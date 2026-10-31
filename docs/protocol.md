# Protokół USB

Podstawa: przypięte commity i pliki w research.md. Offsety poniżej dotyczą **payloadu bez ID raportu**. Little-endian, packed, float IEEE754 32-bit. WebHID sendFeatureReport otrzymuje ID osobno; receiveFeatureReport dla numerowanego raportu zwraca DataView zaczynający się ID. Transport musi je sprawdzić i usunąć dokładnie raz. Nie zgadujemy przesunięcia na podstawie sensowności danych.

## Identyfikacja i raporty

VID 0x054C, PID 0x0CE6 lub 0x0DF2; Usage Page 0x01, Usage 0x05. W zbadanym deskryptorze interfejs gamepada ma numer 3, ale WebHID wybiera kolekcję, nie ręczny numer interfejsu. Nie otwieramy klawiatury. HTTPS lub localhost, bez automatycznego wywoływania requestDevice.

| ID | Operacja | Dane |
|---|---|---|
| F6 | SET feature | 63 bajty; funkcja w bajcie 0 |
| F7 | GET feature | Config_body: 19 bajtów w wydaniu, 24 w zbadanym master; deskryptor rezerwuje 63 |
| F8 | GET feature | tekst PICO_PROGRAM_VERSION_STRING, maks. 63; odczyt do NUL lub końca |
| F9 | GET feature | int8 RSSI; opcjonalny bajt flag audio: bit7 ważny, bit0 mic, bit1 speaker |
| FA | GET/SET feature | tylko nowszy master: 28 bajtów remap, miejsce w raporcie 63 |
| FB | GET/SET feature | tylko nowszy master: 9 × 7 bajtów skrótów |

F6/01: `[01, ...Config_body, padding 00]`; F6/02: `[02, 00…]`; F6/03: `[03, 00…]`. W master F6/05 `[05,01,00…]` zatrzymuje emisję skrótów na 5 s podczas nauki. Nie ma ACK flash, numeru transakcji ani CRC transportowego aplikacji. CRC flash nie jest częścią raportu F7.

## Układ v0.7.2-hotfix (19 bajtów)

| Offset | Pole firmware | Typ / zakres | Domyślnie |
|---|---|---|---|
| 0 | config_version | u8 = 5, tylko odczyt | 5 |
| 1–4 | haptics_gain | f32, 1–2 | 1 |
| 5 | speaker_volume | u8, 0–127 | 100 |
| 6 | headset_volume | u8, 0–127 | 100 |
| 7 | speaker_gain | u8, 0–7; 0 auto | 2 |
| 8 | inactive_time | u8, 0–60 min; 0 wyłącza | 30 |
| 9 | disable_pico_led | bool | 0 |
| 10 | polling_rate_mode | 0=250 Hz, 1=500 Hz, 2=real-time | 1 |
| 11 | audio_buffer_length | u8, 16–128 wg config_valid | 64 |
| 12 | controller_mode | 0=DS5, 1=Edge, 2=Auto | 2 |
| 13 | enable_usb_sn | bool | 0 |
| 14 | ps_shortcut_enabled | bool | 0 |
| 15 | disable_mic | bool | 0 |
| 16 | disable_speaker | bool | 0 |
| 17 | enable_wake | bool | 0 |
| 18 | trigger_reduce | u8, 0–10; 0 auto | 0 |

Nie resetować nieedytowanych pól. Głośności są udostępnione jako opcje zaawansowane; OS może je nadpisać. Zmiany auto gain/triggerów mogą wymagać nowego stanu wysłanego przez grę lub ponownego połączenia kontrolera.

## Różnice master daa35cc (24 bajty, również wersja 5)

Offsety 0–13 pozostają, ale polling: 0=250, 1=500, 2=1000 Hz, 3=real-time. 14=enable_keyboard; 15=mic_select i 16=speaker_select (0 auto, 1 wbudowane, 2 słuchawki, 3 wyłączone). 17 wake; 18 trigger_reduce; 19 lock_volume; 20 status_gpio_pin; 21 status_gpio_mode; 22 packet_mode; 23 disconnect_on_dock. Głośności w nagłówku oznaczono unused. GPIO zależy od płytki, nie udostępniać bez profilu hardware. Obecny config_tool.py nadal ogranicza polling do 0–2 — firmware jest nadrzędnym źródłem.

FA: indeks źródłowego ButtonId → docelowy ButtonId (0–27); 27 Disable. 0–7 kierunki D-pad, 8 Square, 9 Cross, 10 Circle, 11 Triangle, 12 L1, 13 R1, 14 L2, 15 R2, 16 Create, 17 Options, 18 L3, 19 R3, 20 PS/Home, 21 Pad, 22 Mute, 23/24 Fn, 25/26 paddles. Tożsamość oznacza brak zmiany.

FB slot: `[trigger_a, trigger_b, action, payload0, payload1, payload2, flags]`. action 0 klawiatura (modifiers, usage, reserved=0), 1 BT disconnect (payload zera), 2 multimedia (u16 LE usage, reserved=0). trigger_a FF wyłącza; trigger_b FD pojedyncze, FE podwójne naciśnięcie; inne wartości = chord dwóch przycisków. Flags bit0 double chord, bit1 hold. Zakazane identyczne przyciski, dwie strony D-pad, nieznane flagi; hold wyłącznie klawiatura bez double tap. Keyboard usage <=73 hex, multimedia 1–2FF hex. Szczegóły: master `src/button_shortcut.cpp::shortcut_slot_valid`.

## Bezpieczna transakcja proponowana dla panelu

1. Sekwencyjna kolejka; brak równoległych odczytów i zapisów. Zmiana sesji/odłączenie unieważnia operację.
2. Przed zapisem ponownie odczytaj F7. Jeśli różni się od bazowego odczytu, zatrzymaj zapis (konflikt z inną aplikacją).
3. Zwaliduj wszystkie wartości i znany profil, wyślij F6/01. Poczekaj 50 ms, odczytaj F7 i porównaj dokładne zakodowane wartości.
4. Dopiero po zgodnym readback wyślij F6/02. Poczekaj, wykonaj odczyt kontrolny. Komunikat: „Ustawienia zastosowane; polecenie zapisu wysłane. Trwałość sprawdź po odłączeniu zasilania”.
5. Rozłączenie/błąd po SET: wynik niepewny, bez automatycznego ponowienia flash. Ponownie połącz i odczytaj.
6. Przy zmianach deskryptorów (serial, mode, wake, PS keyboard) wymagaj odłączenia/podłączenia USB. F6/03 to tylko ponowna enumeracja; nie udawaj restartu firmware.

Nie można programowo potwierdzić wyłączenia zasilania na podstawie samego zdarzenia HID disconnect. Weryfikacja trwałości wymaga świadomego działania użytkownika i ponownego porównania.
