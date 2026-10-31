import {afterEach,describe,expect,it,vi} from 'vitest';
import {WebHIDTransport} from './WebHIDTransport';
afterEach(()=>vi.unstubAllGlobals());
function fakeDevice(){
 const events=new EventTarget();
 const d={opened:false,collections:[{usagePage:1,usage:5,featureReports:[{reportId:246},{reportId:247},{reportId:248}]}],
  open:vi.fn(async()=>{d.opened=true;}),close:vi.fn(async()=>{d.opened=false;}),
  receiveFeatureReport:vi.fn(async(id:number)=>{const b=new Uint8Array([99,id,5,0,0,128,63]);return new DataView(b.buffer,1,6);}),
  sendFeatureReport:vi.fn(async()=>{}),addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events),dispatchEvent:events.dispatchEvent.bind(events)};
 const hidEvents=new EventTarget();const hid={requestDevice:vi.fn(async()=>[d]),addEventListener:hidEvents.addEventListener.bind(hidEvents),removeEventListener:hidEvents.removeEventListener.bind(hidEvents)};
 vi.stubGlobal('navigator',{hid});vi.stubGlobal('isSecureContext',true);return{d,hid,hidEvents};
}
describe('WebHID boundary',()=>{
 it('filters both products on the gamepad collection and strips ID exactly once',async()=>{const {hid}=fakeDevice();const t=new WebHIDTransport();await t.connect();expect(hid.requestDevice.mock.calls[0]).toEqual([{filters:[{vendorId:1356,productId:3302,usagePage:1,usage:5},{vendorId:1356,productId:3570,usagePage:1,usage:5}]}]);expect(Array.from(await t.read(247))).toEqual([5,0,0,128,63]);await t.close();});
 it('rejects a controller without adapter reports before opening',async()=>{const {d}=fakeDevice();d.collections[0].featureReports=[];const t=new WebHIDTransport();await expect(t.connect()).rejects.toThrow('NOT_ADAPTER');expect(d.open).not.toHaveBeenCalled();});
 it('passes output ID separately and copies the payload',async()=>{const {d}=fakeDevice();const t=new WebHIDTransport();await t.connect();await t.write(246,new Uint8Array([1,5]));expect(d.sendFeatureReport.mock.calls[0]).toEqual([246,new Uint8Array([1,5]).buffer]);await t.close();});
 it('ignores short input and decodes battery nibble only for valid power states',async()=>{const {d}=fakeDevice();const t=new WebHIDTransport(),telemetry=vi.fn();t.onTelemetry=telemetry;await t.connect();function report(data:Uint8Array){const e=new Event('inputreport');Object.assign(e,{reportId:1,data:new DataView(data.buffer)});d.dispatchEvent(e);}report(new Uint8Array(10));expect(telemetry).not.toHaveBeenCalled();const p=new Uint8Array(63);p[52]=0x17;report(p);expect(telemetry.mock.calls[0][0].battery).toBe(70);p[52]=0xf7;report(p);expect(telemetry.mock.calls[1][0].battery).toBeNull();await t.close();});
 it('reacts only to the selected device disconnect and refuses later I/O',async()=>{const {d,hidEvents}=fakeDevice();const t=new WebHIDTransport(),disconnected=vi.fn();t.onDisconnect=disconnected;await t.connect();const e=new Event('disconnect');Object.assign(e,{device:d});hidEvents.dispatchEvent(e);expect(disconnected).toHaveBeenCalledOnce();await expect(t.read(247)).rejects.toThrow('DISCONNECTED');});
});
