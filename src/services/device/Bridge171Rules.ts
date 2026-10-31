import type {BridgeSettings} from './Bridge171Codec';
export const SETTING_RULES = {
 haptics:{command:1,min:0,max:500}, speaker:{command:7,min:0,max:100}, speakerGain:{command:0x32,min:1,max:7},
 led:{command:2,min:0,max:1}, idleEnabled:{command:3,min:0,max:1}, idleMinutes:{command:0x1c,min:1,max:120},
 micMuted:{command:0x1b,min:0,max:1}, wake:{command:0x35,min:0,max:1}, suspendDisconnect:{command:0x0f,min:0,max:1},
 sleepShortcut:{command:0x10,min:0,max:1}, lightbarOverride:{command:9,min:0,max:1}, red:{command:8,min:0,max:255}, green:{command:8,min:0,max:255}, blue:{command:8,min:0,max:255}, brightness:{command:8,min:0,max:100}
} as const;
export function validateSettings(s:BridgeSettings){for(const [key,r] of Object.entries(SETTING_RULES)){const v=s[key as keyof BridgeSettings];if(!Number.isInteger(v)||v<r.min||v>r.max)throw Error(`INVALID_VALUE:${key}`);}}
