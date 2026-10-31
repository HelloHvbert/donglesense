import {describe,it,expect,vi,afterEach} from 'vitest';
import {DeviceService} from './DeviceService';
import {MockTransport} from './MockTransport';
import {DEFAULT_CONFIG,encodeConfig,decodeConfig,validateConfig,REPORT} from './ConfigCodec';
import {requireWebHID} from './WebHIDTransport';
afterEach(()=>vi.unstubAllGlobals());
describe('write transaction',()=>{
  it('updates RAM, reads it before save, then verifies it again',async()=>{
    const s=new DeviceService(),m=new MockTransport(),calls:string[]=[];
    await s.connect(m);const read=m.read.bind(m),write=m.write.bind(m);
    m.read=async id=>{calls.push(`R${id}`);return read(id);};m.write=async(id,p)=>{calls.push(`W${p[0]}`);return write(id,p);};
    const result=await s.save({...DEFAULT_CONFIG,haptics:1.25},DEFAULT_CONFIG);
    expect(calls).toEqual(['R247','W1','R247','W2','R247']);expect(result.haptics).toBe(1.25);
    expect(m.writes.every(w=>w.id===246&&w.payload.length===63)).toBe(true);await s.disconnect();
  });
  it('detects concurrent changes without writing',async()=>{const s=new DeviceService(),m=new MockTransport();await s.connect(m);m.config.idleMinutes=5;await expect(s.save({...DEFAULT_CONFIG,haptics:2},DEFAULT_CONFIG)).rejects.toThrow('CONFLICT');expect(m.writes.length).toBe(0);await s.disconnect();});
  it('never saves to flash if RAM readback differs',async()=>{const s=new DeviceService(),m=new MockTransport();await s.connect(m);m.write=async(id,p)=>{m.writes.push({id,payload:p});};await expect(s.save({...DEFAULT_CONFIG,haptics:2},DEFAULT_CONFIG)).rejects.toThrow('READBACK_MISMATCH');expect(m.writes.map(w=>w.payload[0])).toEqual([1]);expect(s.getSnapshot().connected).toBe(false);});
  it('handles disconnect while writing, never retries flash',async()=>{const s=new DeviceService(),m=new MockTransport();await s.connect(m);m.write=async()=>{m.onDisconnect?.();await m.close();throw new Error('DISCONNECTED');};await expect(s.save({...DEFAULT_CONFIG,haptics:2},DEFAULT_CONFIG)).rejects.toThrow();expect(s.getSnapshot().connected).toBe(false);expect(s.getSnapshot().busy).toBe(false);});
  it('blocks overlapping operations',async()=>{const s=new DeviceService(),m=new MockTransport();await s.connect(m);const p=s.save({...DEFAULT_CONFIG,haptics:2},DEFAULT_CONFIG);await expect(s.save(DEFAULT_CONFIG,DEFAULT_CONFIG)).rejects.toThrow('BUSY');await p;await s.disconnect();});
  it('restores documented defaults through normal transaction',async()=>{const s=new DeviceService(),m=new MockTransport();m.config={...DEFAULT_CONFIG,haptics:2};await s.connect(m);const before={...m.config};await s.save(DEFAULT_CONFIG,before);expect(m.config).toEqual(DEFAULT_CONFIG);await s.disconnect();});
  it('rejects invalid numeric values and unknown schema',()=>{for(const v of [NaN,Infinity,0.9,2.01])expect(()=>validateConfig({...DEFAULT_CONFIG,haptics:v})).toThrow();expect(()=>validateConfig({...DEFAULT_CONFIG,idleMinutes:1.5})).toThrow();const p=encodeConfig(DEFAULT_CONFIG);p[0]=4;expect(()=>decodeConfig(p)).toThrow();});
  it('rejects unsupported browsers and insecure origins',()=>{vi.stubGlobal('isSecureContext',true);vi.stubGlobal('navigator',{});expect(requireWebHID).toThrow('UNSUPPORTED_BROWSER');vi.stubGlobal('isSecureContext',false);expect(requireWebHID).toThrow('INSECURE_CONTEXT');});
  it('unknown firmware never writes',async()=>{const s=new DeviceService(),m=new MockTransport();m.version='dev';await s.connect(m);await expect(s.save(DEFAULT_CONFIG,DEFAULT_CONFIG)).rejects.toThrow('NOT_COMPATIBLE');expect(m.writes).toEqual([]);await s.disconnect();});
  it('uses USB reconnect command, not an invented reboot command',async()=>{const s=new DeviceService(),m=new MockTransport();await s.connect(m);await s.reconnectUSB();expect(m.writes[0].id).toBe(REPORT.command);expect(m.writes[0].payload[0]).toBe(3);});
  it('a late failure from an old device cannot close a new connection',async()=>{
    const s=new DeviceService(),old=new MockTransport(),next=new MockTransport();await s.connect(old);
    let rejectWrite:(e:Error)=>void=()=>{},signalStarted:()=>void=()=>{};
    const started=new Promise<void>(resolve=>{signalStarted=resolve;});
    old.write=async()=>{signalStarted();return new Promise<void>((_,reject)=>{rejectWrite=reject;});};
    const pending=s.save({...DEFAULT_CONFIG,haptics:2},DEFAULT_CONFIG).catch(e=>e);
    await started;old.onDisconnect?.();await old.close();await s.connect(next);rejectWrite(new Error('old failure'));await pending;
    expect(s.getSnapshot().connected).toBe(true);expect(next.connected).toBe(true);await s.disconnect();
  });
});
