import {DEFAULT_CONFIG,encodeConfig,REPORT,decodeConfig,type Config} from './ConfigCodec';
import type {DeviceTransport,Telemetry} from './DeviceTransport';
export class MockTransport implements DeviceTransport {
  readonly demo=true;
  onDisconnect:(()=>void)|null=null;
  onTelemetry:((value:Telemetry)=>void)|null=null;
  config:Config={...DEFAULT_CONFIG};
  version='v0.7.2-hotfix';
  connected=false;
  writes:{id:number;payload:Uint8Array}[]=[];
  private interval:ReturnType<typeof setInterval>|undefined;
  async connect(){this.connected=true;this.interval=setInterval(()=>this.onTelemetry?.({battery:70,power:0,receivedAt:Date.now()}),1000);}
  async close(){this.connected=false;clearInterval(this.interval);}
  async read(id:number){
    if(!this.connected)throw new Error('DISCONNECTED');
    if(id===REPORT.version)return new TextEncoder().encode(this.version);
    if(id===REPORT.config)return encodeConfig(this.config);
    if(id===REPORT.status)return new Uint8Array([214,128]);
    throw new Error('INVALID_REPORT');
  }
  async write(id:number,payload:Uint8Array){
    if(!this.connected)throw new Error('DISCONNECTED');
    this.writes.push({id,payload:payload.slice()});
    if(id===REPORT.command&&payload[0]===1)this.config=decodeConfig(payload.slice(1,20));
    if(id===REPORT.command&&payload[0]===3){await this.close();this.onDisconnect?.();}
  }
}
