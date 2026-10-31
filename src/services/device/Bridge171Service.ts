import {checkAck,commandPacket,decodeBridgeStatus,sameSettings,type BridgeSettings,type BridgeStatus} from './Bridge171Codec';
import {SETTING_RULES,validateSettings} from './Bridge171Rules';
export class Bridge171Service {
 private device:USBDevice|null=null;private iface=-1;private seq=0;private busy=false;private detach=()=>{};
 onDisconnect:(()=>void)|null=null;
 private async io<T>(promise:Promise<T>):Promise<T>{let timer:ReturnType<typeof setTimeout>|undefined;try{return await Promise.race([promise,new Promise<never>((_,reject)=>{timer=setTimeout(()=>{void this.close();this.onDisconnect?.();reject(Error('TIMEOUT'));},4000);})]);}finally{clearTimeout(timer);}}
 async connect(){
  if(this.busy)throw Error('BUSY');if(!globalThis.isSecureContext||!navigator.usb)throw Error('WEBUSB_UNAVAILABLE');
  this.busy=true;
  try{await this.close();const d=await navigator.usb.requestDevice({filters:[{vendorId:0x054c,productId:0x0ce6},{vendorId:0x054c,productId:0x0df2},{vendorId:0x054c,productId:0x09cc},{vendorId:0x1209,productId:0xdb05},{vendorId:0x1209,productId:0xdb08}]});
   this.device=d;await this.io(d.open());if(!d.configuration)await this.io(d.selectConfiguration(1));
   const matches=d.configuration?.interfaces.filter(i=>[1,5].includes(i.interfaceNumber)&&i.alternates.some(a=>a.interfaceClass===255&&a.interfaceSubclass===0&&a.interfaceProtocol===0&&a.endpoints.some(e=>e.direction==='out'&&e.type==='bulk'&&e.endpointNumber===7)));
   if(matches?.length!==1)throw Error('NO_BRIDGE_CONTROL_INTERFACE');this.iface=matches[0].interfaceNumber;
   await this.io(d.claimInterface(this.iface));
   const disconnected=(e:USBConnectionEvent)=>{if(e.device===d){void this.close();this.onDisconnect?.();}};
   navigator.usb.addEventListener('disconnect',disconnected);this.detach=()=>navigator.usb.removeEventListener('disconnect',disconnected);
   return await this.status();
  }catch(e){await this.close();throw e;}finally{this.busy=false;}
 }
 async close(){this.detach();this.detach=()=>{};const d=this.device;this.device=null;this.iface=-1;if(d?.opened)await d.close().catch(()=>{});}
 private async read(id:number){if(!this.device?.opened)throw Error('DISCONNECTED');const r=await this.io(this.device.controlTransferIn({requestType:'vendor',recipient:'interface',request:0x31,value:id,index:this.iface},64));if(r.status!=='ok'||!r.data)throw Error('USB_READ_FAILED');return new Uint8Array(r.data.buffer,r.data.byteOffset,r.data.byteLength).slice();}
 private async status(){return decodeBridgeStatus(await this.read(1));}
 async refresh(){if(this.busy)throw Error('BUSY');this.busy=true;try{return await this.status();}finally{this.busy=false;}}
 private async send(command:number,value:number,revision?:number,extra:number[]=[]){
  if(!this.device?.opened)throw Error('DISCONNECTED');this.seq=(this.seq+1)&255;
  const packet=commandPacket(command,this.seq,value,extra);
  const result=await this.io(this.device.controlTransferOut({requestType:'vendor',recipient:'interface',request:0x32,value:0,index:this.iface},packet.buffer));
  if(result.status!=='ok'||result.bytesWritten!==64)throw Error('USB_WRITE_FAILED');
  return checkAck(await this.read(3),command,this.seq,revision);
 }
 async apply(draft:BridgeSettings,baseline:BridgeStatus){
  if(this.busy)throw Error('BUSY');validateSettings(draft);this.busy=true;let sent=false;
  try{let current=await this.status();if(current.revision!==baseline.revision||!sameSettings(current.settings,baseline.settings))throw Error('CONFLICT');
   for(const key of Object.keys(SETTING_RULES) as (keyof BridgeSettings)[]){if(SETTING_RULES[key].command===8||draft[key]===current.settings[key])continue;
    sent=true;const revision=await this.send(SETTING_RULES[key].command,draft[key],current.revision);const next=await this.status();
    const expected={...current.settings,[key]:draft[key]};if(next.revision!==revision||!sameSettings(next.settings,expected))throw Error('READBACK_MISMATCH');current=next;
   }const colors=['red','green','blue','brightness'] as const;
   if(colors.some(k=>draft[k]!==current.settings[k])){
    if(!current.controllerConnected)throw Error('CONTROLLER_DISCONNECTED');sent=true;
    const revision=await this.send(8,draft.brightness,current.revision,[draft.red,draft.green,draft.blue]);
    const next=await this.status();const expected={...current.settings,red:draft.red,green:draft.green,blue:draft.blue,brightness:draft.brightness};
    if(next.revision!==revision||!sameSettings(next.settings,expected))throw Error('READBACK_MISMATCH');current=next;
   }return current;
  }catch(e){if(sent){await this.close();this.onDisconnect?.();throw Error(`PARTIAL_APPLY:${e instanceof Error?e.message:String(e)}`);}throw e;}finally{this.busy=false;}
 }
 async testRumble(){if(this.busy)throw Error('BUSY');this.busy=true;try{const status=await this.status();if(!status.controllerConnected)throw Error('CONTROLLER_DISCONNECTED');await this.send(0x14,0);return await this.status();}finally{this.busy=false;}}
}
