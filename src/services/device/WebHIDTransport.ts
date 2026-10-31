import type {DeviceTransport,Telemetry} from './DeviceTransport';
export function requireWebHID(): void {
  if (!globalThis.isSecureContext) throw new Error('INSECURE_CONTEXT');
  if (typeof navigator==='undefined' || !('hid' in navigator)) throw new Error('UNSUPPORTED_BROWSER');
}
export class WebHIDTransport implements DeviceTransport {
  readonly demo=false;
  onDisconnect: (()=>void)|null=null;
  onTelemetry: ((value:Telemetry)=>void)|null=null;
  private device: HIDDevice|null=null;
  private detach=()=>{};
  async connect(): Promise<void> {
    requireWebHID();
    const devices=await navigator.hid.requestDevice({filters:[0x0ce6,0x0df2].map(productId=>({vendorId:0x054c,productId,usagePage:1,usage:5}))});
    const device=devices[0];
    if (!device) throw new Error('CANCELLED');
    const collection=device.collections.find(c=>c.usagePage===1&&c.usage===5);
    const reports=new Set(collection?.featureReports?.map(r=>r.reportId));
    if (!collection || ![0xf6,0xf7,0xf8].every(r=>reports.has(r))) throw new Error(`NOT_ADAPTER: featureReports=${[...reports].map(r=>r?.toString(16)).join(',')||'none'}`);
    await device.open(); this.device=device;
    const disconnect=(event:HIDConnectionEvent)=>{if(event.device===device){this.device=null;this.detach();this.onDisconnect?.();}};
    const input=(event:HIDInputReportEvent)=>{
      if(event.reportId!==1 || event.data.byteLength<53) return;
      const value=event.data.getUint8(52), power=value>>4, level=value&15;
      this.onTelemetry?.({battery:(power===0||power===1)&&level<=10?level*10:null,power,receivedAt:Date.now()});
    };
    navigator.hid.addEventListener('disconnect',disconnect);
    device.addEventListener('inputreport',input);
    this.detach=()=>{navigator.hid.removeEventListener('disconnect',disconnect);device.removeEventListener('inputreport',input);};
  }
  async close(): Promise<void> {this.detach();const d=this.device;this.device=null;if(d?.opened)await d.close();}
  private async deadline<T>(operation: Promise<T>):Promise<T>{
    let timer:ReturnType<typeof setTimeout>|undefined;
    try{return await Promise.race([operation,new Promise<never>((_,reject)=>{timer=setTimeout(()=>{void this.close().catch(()=>{});this.onDisconnect?.();reject(new Error('TIMEOUT'));},4000);})]);}
    finally{clearTimeout(timer);}
  }
  async read(id:number):Promise<Uint8Array>{
    if(!this.device?.opened)throw new Error('DISCONNECTED');
    const data=await this.deadline(this.device.receiveFeatureReport(id));
    if(data.byteLength<2||data.getUint8(0)!==id)throw new Error(`INVALID_REPORT: id=${id.toString(16)}, bytes=${data.byteLength}, first=${data.byteLength?data.getUint8(0).toString(16):'none'}`);
    return new Uint8Array(data.buffer,data.byteOffset+1,data.byteLength-1).slice();
  }
  async write(id:number,payload:Uint8Array):Promise<void>{
    if(!this.device?.opened)throw new Error('DISCONNECTED');
    await this.deadline(this.device.sendFeatureReport(id,Uint8Array.from(payload).buffer));
  }
}

