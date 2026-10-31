import {describe,it,expect} from 'vitest';
import {DeviceService} from './DeviceService';
import {MockTransport} from './MockTransport';
import {DEFAULT_CONFIG,REPORT,encodeConfig,decodeConfig} from './ConfigCodec';
import {compatibleFirmware} from './FirmwareCompatibility';
describe('read milestone',()=>{
  it('opens, identifies firmware and reads configuration without SET',async()=>{const s=new DeviceService(),m=new MockTransport();await s.connect(m);expect(s.getSnapshot().version).toBe('v0.7.2-hotfix');expect(s.getSnapshot().config).toEqual(DEFAULT_CONFIG);expect(m.writes).toEqual([]);await s.disconnect();});
  it('does not decode or write unknown firmware with the same schema',async()=>{const s=new DeviceService(),m=new MockTransport();m.version='daa35cc';await s.connect(m);expect(s.getSnapshot().config).toBeNull();expect(m.writes).toEqual([]);await s.disconnect();});
  it('handles disconnect during read',async()=>{const s=new DeviceService(),m=new MockTransport();m.read=async()=>{m.onDisconnect?.();throw new Error('DISCONNECTED');};await expect(s.connect(m)).rejects.toThrow();expect(s.getSnapshot().connected).toBe(false);await m.close();});
  it('propagates permission denial',async()=>{const s=new DeviceService(),m=new MockTransport();m.connect=async()=>{throw new DOMException('denied','NotAllowedError');};await expect(s.connect(m)).rejects.toThrow('denied');expect(s.getSnapshot().busy).toBe(false);});
  it('has independently specified binary offsets and report IDs',()=>{const c={...DEFAULT_CONFIG,haptics:1.5,triggerReduction:10};const payload=encodeConfig(c);expect(Array.from(payload)).toEqual([5,0,0,192,63,100,100,2,30,0,1,64,2,0,0,0,0,0,10]);expect(decodeConfig(payload)).toEqual(c);expect(REPORT).toEqual({command:246,config:247,version:248,status:249});});
  it('fails closed on malformed or extended layouts',()=>{expect(()=>decodeConfig(new Uint8Array(18))).toThrow();const p=new Uint8Array(24);p.set(encodeConfig(DEFAULT_CONFIG));p[23]=1;expect(()=>decodeConfig(p)).toThrow('UNKNOWN_LAYOUT');expect(compatibleFirmware('dev-v0.7.2-hotfix')).toBe(false);});
});
