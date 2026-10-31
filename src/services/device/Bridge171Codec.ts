// Independently implemented from the DS5 Bridge v1.7.1 wire format. See docs/bridge171-protocol.md.
import {validateSettings} from './Bridge171Rules';
export type BridgeSettings={haptics:number;speaker:number;speakerGain:number;led:number;idleEnabled:number;idleMinutes:number;micMuted:number;wake:number;suspendDisconnect:number;sleepShortcut:number;lightbarOverride:number;red:number;green:number;blue:number;brightness:number};
export type BridgeStatus={version:string;protocol:string;revision:number;controllerConnected:boolean;battery:number|null;rssi:number|null;settings:BridgeSettings;uptime:number};
export function header(bytes:Uint8Array,id:number){
 if(bytes.length!==64||bytes[0]!==id||String.fromCharCode(...bytes.slice(1,5))!=='DS5B')throw Error('INVALID_BRIDGE_REPORT');
 if(bytes[5]!==1||bytes[6]!==23)throw Error(`UNSUPPORTED_PROTOCOL:${bytes[5]}.${bytes[6]}`);
}
export function decodeBridgeStatus(b:Uint8Array):BridgeStatus{
 header(b,1);const v=new DataView(b.buffer,b.byteOffset,b.byteLength);const version=`${b[25]}.${b[26]}.${b[27]}`;
 if(version!=='1.7.1')throw Error(`UNSUPPORTED_FIRMWARE:${version}`);
 for(const i of [7,15,16,50,51,59])if(b[i]>1)throw Error('INVALID_BRIDGE_STATUS');
 if(b[9]!==255&&b[9]>100)throw Error('INVALID_BATTERY');
 const settings:BridgeSettings={haptics:v.getUint16(13,true),speaker:v.getUint16(29,true),speakerGain:b[57],led:b[15],idleEnabled:b[16],idleMinutes:v.getUint16(43,true),micMuted:b[51],wake:b[50],suspendDisconnect:(b[20]>>4)&1,sleepShortcut:(b[20]>>6)&1,lightbarOverride:b[59],red:b[31],green:b[32],blue:b[33],brightness:b[34]};
 validateSettings(settings);
 return {version,protocol:'1.23',revision:v.getUint16(17,true),controllerConnected:b[7]===1,battery:b[7]&&b[9]!==255?b[9]:null,rssi:b[7]&&b[46]===1?v.getInt8(45):null,uptime:v.getUint32(21,true),settings};
}
export function commandPacket(command:number,sequence:number,value:number,extra:number[]=[]){
 const b=new Uint8Array(64);b.set([2,68,83,53,66,1,23,command,sequence]);new DataView(b.buffer).setUint16(9,value,true);if(extra.length>53)throw Error('INVALID_PAYLOAD');b.set(extra,11);return b;
}
export function checkAck(b:Uint8Array,command:number,sequence:number,revision?:number){
 header(b,3);if(b[7]!==command||b[8]!==sequence)throw Error('STALE_ACK');
 if(b[9]!==0)throw Error(`DEVICE_REJECTED:${b[9]}:${b[10]}`);
 const next=new DataView(b.buffer,b.byteOffset,b.byteLength).getUint16(11,true);
 if(revision!==undefined&&next!==((revision+1)&65535))throw Error('REVISION_MISMATCH');return next;
}
export function sameSettings(a:BridgeSettings,b:BridgeSettings){return Object.keys(a).every(k=>a[k as keyof BridgeSettings]===b[k as keyof BridgeSettings]);}
