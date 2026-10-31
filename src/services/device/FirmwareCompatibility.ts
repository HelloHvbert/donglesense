export const PROFILE = 'v0.7.2-hotfix';
const known = new Set([PROFILE,'c3308ae','c3308aeaa653ea88c7baee1c963fb6511db0ebbb']);
export function compatibleFirmware(version: string): boolean {return known.has(version);}
