> Aktualizacja 22.10.2026: domyślny profil DS5 Bridge 1.7.1 / WebUSB. Test sprzętowy i zakres: [bridge171-protocol.md](bridge171-protocol.md). Poniższe wcześniejsze wyniki dotyczą profilu awalol.

# Lista funkcji i źródeł

| Funkcja | v0.7.2-hotfix | Źródło / ograniczenie |
|---|---|---|
| Wzmocnienie haptyki | 1–2 | config.h/config.cpp; nie ogólna skala 0–100% |
| Redukcja triggerów | 0–10 | nie wszystkie efekty reagują; 0 auto |
| Bezczynność | 0–60 min | 0 wyłącza |
| LED adaptera | włącz/wyłącz | krytyczna bateria może nadpisać ustawienie |
| Kolor kontrolera | brak parametru | ukryte |
| Głośności | 0–127, zaawansowane | system operacyjny może je zmieniać |
| Speaker gain | 0–7 | 0 sterowanie przez grę |
| Mic i speaker | wyłączenie | brak wyboru źródła znanego z master |
| Audio buffer | 16–128 | walidacja config.cpp |
| Lock / sync volume | brak w tym wydaniu | v0.7.1 miało oba; master przywraca lock |
| USB serial | bool | ponowne podłączenie |
| Wake PS | bool | OS/BIOS oraz kompilacja ENABLE_WAKE_HID |
| Tryb DS5/Edge/Auto | tak | ponowne podłączenie |
| Polling | 250 / 500 / real-time | nie podpisywać real-time jako 1000 Hz |
| Skrót PS | Win+G / Win+Tab | stały; długie >=750 ms |
| 9 skrótów i remap | brak | tylko zbadany nowszy master, ukryte edytory |
| Restart firmware | brak komendy config | fizyczny podwójny klik |
| Reconnect USB | F6/03 | osobny przycisk z potwierdzeniem |
| Domyślne ustawienia | przygotowanie formularza | jawny zapis, bez kasowania parowań |
| RSSI/audio activity | F9 | RSSI=0 traktować jako niedostępne |
| Bateria | raport wejściowy 01 | payload USBGetStateData bajt 52, nibbles; nie F9 |

Panel opisuje czas ostatniego raportu USB, nie gwarantuje świeżości pochodzącej z Bluetooth. Firmware w trybach okresowych może ponownie wysyłać bufor ostatniego stanu. Bateria jest ostatnią raportowaną wartością w krokach 10%, nie dokładnym pomiarem; nie wyciągamy z niej pewnego statusu połączenia Bluetooth. Nie wyświetlać wartości przykładowych poza wyraźnym trybem demonstracyjnym.
