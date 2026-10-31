# DS5 Bridge 1.7.1 — protocol and hardware validation

Source pinned to SundayMoments/DS5_Bridge v1.7.1, commit 5ee08e0984085c99eac5afe14c05f572b6e9dc59.
Reference: https://github.com/SundayMoments/DS5_Bridge/tree/5ee08e0984085c99eac5afe14c05f572b6e9dc59
Files inspected: src/usb_descriptors.c, src/host_bridge.cpp, src/host_bridge.h, src/companion.cpp, companion/src/shared/protocol.ts and companion/src/main/bridge-service.ts. Panel implementation is independent; firmware and companion source are not included in this package.

## Transport

WebUSB, vendor interface class FF/subclass 00/protocol 00 with bulk OUT endpoint 7. Interface 5 in normal mode, 1 in bridge-only mode. Product filters: 054C:0CE6, 054C:0DF2, 054C:09CC, 1209:DB05, 1209:DB08. Claim only this control interface, never gamepad/audio/keyboard interfaces. Windows uses the firmware's Microsoft OS 2.0 WinUSB binding. The desktop companion must release its handle first (Exit from tray).

Vendor/interface GET request 31h, wValue report ID, wIndex selected interface; SET request 32h, wValue 0. Both transfer the complete 64-byte report including report ID. Status=01, command=02, ACK=03. Bytes 1..4: DS5B, bytes 5..6: protocol 1.23. Version 1.7.1 is mandatory before enabling writes. No firmware-update, reset or pairing-erasure commands are exposed.

## Applied settings

Haptics 0..500%, speaker 0..100%, speaker gain 1..7, adapter LED, idle enabled/1..120 minutes, microphone mute, wake on connect, USB suspend disconnect, sleep shortcut, lightbar override, lightbar RGB and brightness. RGB/brightness use a single command 08h with brightness in the u16 value and RGB in bytes 11..13. RGB and brightness are read from status bytes 31..34.

Apply first checks the baseline revision and values. Each changed setting is sent once, followed by matching ACK command+sequence, success result, revision increment and status readback. On uncertain/partial failure the connection closes and remaining changes stop; reconnect to inspect actual state. There is no automatic command retry or rollback that could hide a partial write.

ACK confirms application, not persistent flash storage. Local browser profiles explicitly require manual loading and applying after reconnection. Restore the original setting manually when running reversible tests. Settings not present in the status report are not fabricated: Trigger Lab, persona switching, remapping, custom chords and system audio capture remain outside this profile's implemented scope.

## Hardware test — 2026-10-22

- Supplied UF2 SHA-256: 610cc23a210c26670992c6b8abc66e3de1fd6bf1efe60df81959ab4000375084.
- WebUSB initially could not claim the interface while DS5 Bridge and AudioHelper were running. Exiting the desktop app resolved it without driver or firmware changes.
- Actual adapter returned firmware 1.7.1, protocol 1.23, controller connected, battery 25%. RSSI reported 0 dBm; displayed as reported, accuracy not independently verified.
- Initial connection performed only GET transfers, no setting command.
- Idle timeout changed 15 -> 16 -> 15 minutes. Both changes passed ACK/revision/readback verification. Original 15 minutes restored.
- Classic rumble test command 14h accepted. User confirmed physical vibration after repeat. This does not validate HD haptics or audio routing.
- User tested lightbar color and confirmed it works. UI readback also reported successful application.
- Visible HSV palette, hue slider, HEX and RGB fields added. Form changes require Apply. Four preset buttons removed at user's request.
- No firmware flashing, pairing erasure, USB reset or desktop-app installation performed.
