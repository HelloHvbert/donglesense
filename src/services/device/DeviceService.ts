import {decodeConfig,decodeVersion,encodeConfig,equalConfig,validateConfig,PAYLOAD_SIZE,REPORT,type Config} from './ConfigCodec';
import {compatibleFirmware} from './FirmwareCompatibility';
import type {DeviceTransport,Telemetry} from './DeviceTransport';
export type DeviceSnapshot={connected:boolean;demo:boolean;version:string;config:Config|null;busy:boolean;rssi:number|null;telemetry:Telemetry|null};
export class DeviceService {
  private state:DeviceSnapshot={connected:false,demo:false,version:'',config:null,busy:false,rssi:null,telemetry:null};
  private listeners=new Set<()=>void>();
  private generation=0;
  private transport:DeviceTransport|null=null;
  getSnapshot=()=>this.state;
  subscribe=(listener:()=>void)=>{this.listeners.add(listener);return()=>{this.listeners.delete(listener);};};
  private update(patch:Partial<DeviceSnapshot>){this.state={...this.state,...patch};this.listeners.forEach(fn=>fn());}
  private check(generation:number){if(generation!==this.generation||!this.transport)throw new Error('DISCONNECTED');}
  async connect(transport:DeviceTransport){
    if(this.state.busy)throw new Error('BUSY');
    await this.disconnect();
    const generation=++this.generation;
    this.transport=transport;
    this.update({busy:true,demo:transport.demo});
    transport.onDisconnect=()=>{if(this.transport===transport){++this.generation;this.transport=null;this.update({connected:false,config:null,busy:false,rssi:null,telemetry:null});}};
    transport.onTelemetry=value=>{if(this.transport===transport)this.update({telemetry:value});};
    try{
      await transport.connect();this.check(generation);
      const version=decodeVersion(await transport.read(REPORT.version));this.check(generation);
      this.update({version});
      const config=compatibleFirmware(version)?decodeConfig(await transport.read(REPORT.config)):null;this.check(generation);
      this.update({connected:true,config});
    }catch(error){if(this.transport===transport)await this.disconnect();throw error;}
    finally{if(generation===this.generation)this.update({busy:false});}
  }
  async disconnect(){const t=this.transport;this.transport=null;++this.generation;if(t){t.onDisconnect=null;t.onTelemetry=null;await t.close().catch(()=>{});}this.update({connected:false,config:null,busy:false,version:'',rssi:null,telemetry:null});}
  async refreshStatus(){
    if(this.state.busy||!this.state.config||!this.transport)return;
    const generation=this.generation,transport=this.transport;
    this.update({busy:true});
    try{const p=await transport.read(REPORT.status);this.check(generation);this.update({rssi:p.length&&p[0]>=128?p[0]-256:null});}
    catch{if(generation===this.generation)this.update({rssi:null});}
    finally{if(generation===this.generation)this.update({busy:false});}
  }
  private async operation<T>(fn:(transport:DeviceTransport,check:()=>void)=>Promise<T>):Promise<T>{
    if(this.state.busy)throw new Error('BUSY');
    if(!this.transport||!this.state.config||!compatibleFirmware(this.state.version))throw new Error('NOT_COMPATIBLE');
    const generation=this.generation,transport=this.transport;
    this.update({busy:true});
    try{return await fn(transport,()=>this.check(generation));}
    finally{if(generation===this.generation)this.update({busy:false});}
  }
  async readCurrent():Promise<Config>{
    return this.operation(async(t,check)=>{const config=decodeConfig(await t.read(REPORT.config));check();return config;});
  }
  async save(draft:Config,baseline:Config):Promise<Config>{
    validateConfig(draft);
    const normalized=decodeConfig(encodeConfig(draft));
    return this.operation(async(t,check)=>{
      const current=decodeConfig(await t.read(REPORT.config));check();
      if(!equalConfig(current,baseline))throw new Error('CONFLICT');
      let started=false;
      try{
        const command=new Uint8Array(PAYLOAD_SIZE);command[0]=1;command.set(encodeConfig(normalized),1);
        started=true;await t.write(REPORT.command,command);check();
        await new Promise(resolve=>setTimeout(resolve,50));check();
        const applied=decodeConfig(await t.read(REPORT.config));check();
        if(!equalConfig(applied,normalized))throw new Error('READBACK_MISMATCH');
        const save=new Uint8Array(PAYLOAD_SIZE);save[0]=2;await t.write(REPORT.command,save);check();
        await new Promise(resolve=>setTimeout(resolve,50));check();
        const result=decodeConfig(await t.read(REPORT.config));check();
        if(!equalConfig(result,normalized))throw new Error('READBACK_MISMATCH');
        this.update({config:result});return result;
      }catch(error){if(started&&this.transport===t)await this.disconnect();throw error;}
    });
  }
  async reconnectUSB():Promise<void>{
    await this.operation(async(t)=>{const command=new Uint8Array(PAYLOAD_SIZE);command[0]=3;await t.write(REPORT.command,command);});
    await this.disconnect();
  }
}
