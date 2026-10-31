export type Telemetry = { battery: number | null; power: number | null; receivedAt: number };
export interface DeviceTransport {
  readonly demo: boolean;
  connect(): Promise<void>;
  close(): Promise<void>;
  read(reportId: number): Promise<Uint8Array>;
  write(reportId: number, payload: Uint8Array): Promise<void>;
  onDisconnect: (()=>void) | null;
  onTelemetry: ((value: Telemetry)=>void) | null;
}
