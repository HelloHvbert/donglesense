# Hardware test diagnosis — 2026-10-22

Input: DS5-Bridge-Firmware-v1.7.1.uf2, 1,505,280 bytes.
SHA-256: 610cc23a210c26670992c6b8abc66e3de1fd6bf1efe60df81959ab4000375084

Parsed 2,940 UF2 blocks without executing or flashing the image. Embedded strings include `1.7.1`, `pico2_w`, `ds5-bridge`, `DS5 Bridge Control`, and build paths containing `DS5_Bridge`.

The gamepad HID descriptor at reconstructed image offset 0x31010 contains feature report IDs:
05 08 09 0A 0B 0C 20 21 22 80 81 82 83 84 85 A0 E0 F0 F1 F2 F4 F5.
These match the list observed in the browser exactly. F6/F7/F8 are absent from this descriptor.

This explains rejection by the configurator's awalol v0.7.2-hotfix profile. It does not establish a hardware fault. Earlier association with loteran Auto Haptics was not established and is superseded by this file inspection.

Matching project/release: https://github.com/SundayMoments/DS5_Bridge/releases/tag/v1.7.1
The downloaded release asset has not been compared byte-for-byte with the supplied UF2. The separate Control interface protocol still requires source inspection before implementation. No device writes or firmware changes were made.
