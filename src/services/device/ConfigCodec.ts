export const REPORT = { command: 0xf6, config: 0xf7, version: 0xf8, status: 0xf9 } as const;
export const BODY_SIZE = 19;
export const PAYLOAD_SIZE = 63;
export const DEFAULT_CONFIG = {
  schema: 5, haptics: 1, speakerVolume: 100, headsetVolume: 100, speakerGain: 2,
  idleMinutes: 30, ledDisabled: 0, polling: 1, audioBuffer: 64, controllerMode: 2,
  usbSerial: 0, psShortcut: 0, micDisabled: 0, speakerDisabled: 0, wake: 0, triggerReduction: 0,
};
export type Config = typeof DEFAULT_CONFIG;
export type ConfigKey = keyof Config;
const bytes = ['speakerVolume','headsetVolume','speakerGain','idleMinutes','ledDisabled','polling','audioBuffer','controllerMode','usbSerial','psShortcut','micDisabled','speakerDisabled','wake','triggerReduction'] as const;
const bounds: Record<ConfigKey, readonly [number, number]> = {
  schema:[5,5],haptics:[1,2],speakerVolume:[0,127],headsetVolume:[0,127],speakerGain:[0,7],idleMinutes:[0,60],ledDisabled:[0,1],polling:[0,2],audioBuffer:[16,128],controllerMode:[0,2],usbSerial:[0,1],psShortcut:[0,1],micDisabled:[0,1],speakerDisabled:[0,1],wake:[0,1],triggerReduction:[0,10],
};
export function validateConfig(config: Config): void {
  for (const key of Object.keys(bounds) as ConfigKey[]) {
    const v = config[key], [min,max] = bounds[key];
    if (!Number.isFinite(v) || v < min || v > max || (key !== 'haptics' && !Number.isInteger(v))) throw new Error(`INVALID_VALUE:${key}`);
  }
}
export function decodeConfig(payload: Uint8Array): Config {
  if (payload.length < BODY_SIZE || payload.length > PAYLOAD_SIZE) throw new Error('INVALID_LENGTH');
  // A nonzero extended body belongs to a different profile. Zero transport padding is allowed.
  if (payload.slice(BODY_SIZE).some(v => v !== 0)) throw new Error('UNKNOWN_LAYOUT');
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const config: Config = {...DEFAULT_CONFIG, schema: payload[0], haptics: view.getFloat32(1,true)};
  bytes.forEach((key,index) => {config[key] = payload[index+5];});
  validateConfig(config);
  return config;
}
export function encodeConfig(config: Config): Uint8Array {
  validateConfig(config);
  const result = new Uint8Array(BODY_SIZE);
  result[0] = config.schema;
  new DataView(result.buffer).setFloat32(1,config.haptics,true);
  bytes.forEach((key,index) => {result[index+5] = config[key];});
  return result;
}
export function equalConfig(a: Config,b: Config): boolean {
  const aa=encodeConfig(a), bb=encodeConfig(b);
  return aa.every((v,i)=>v===bb[i]);
}
export function decodeVersion(data: Uint8Array): string {
  const end=data.indexOf(0), raw=data.slice(0,end<0?undefined:end);
  if (!raw.length || raw.some(v=>v<32||v>126)) throw new Error('INVALID_VERSION');
  return new TextDecoder().decode(raw).trim();
}
