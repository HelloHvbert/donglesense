# Research DS5Dongle — 21.10.2026

## Decyzja projektowa

Pierwszy profil: oficjalny tag **v0.7.2-hotfix**, commit `c3308aeaa653ea88c7baee1c963fb6511db0ebbb`. To kandydat do testów produktu, nie deklaracja gotowości sprzętu do sprzedaży. Własna implementacja WebHID; bez kopiowania kodu ani grafiki konfiguratora. Użytkownik zaakceptował brak potwierdzenia trwałego zapisu: UI ma rozróżniać zastosowanie RAM i wysłanie polecenia flash.

## Zbadane źródła

| Repozytorium / ref | Commit | Wynik |
|---|---|---|
| awalol/DS5Dongle v0.7.2-hotfix | c3308aeaa653ea88c7baee1c963fb6511db0ebbb | profil wydania, 19 bajtów konfiguracji |
| awalol/DS5Dongle master | daa35cca841c8a70a627d1ce9a65b9d3f3209265 | 24 bajty, remap i 9 skrótów; również schemat 5 |
| awalol/DS5Dongle v0.7.1 | e74ac757e00210899521352c0dd1ffd056f9f68c | schemat 4, inny układ |
| awalol/DS5Dongle v0.6.0-hotfix | 0ed05d3f56526619dfba97d0921e25f7e64e9d8a | schemat 1, głośność float |
| awalol/ds5dongle-config-web master | e1d1e100bd07f27f9b5a5194b6cccaaa8ff69edf | WebHID, 19 bajtów, brak deklaracji licencji w drzewie |
| awalol/ds5dongle-config-web dev | 9bea63c25ef8285bd995898ad344af20c5b9159f | WebHID, 24 bajty, skróty, brak pliku licencji |
| MarcelineVPQ/DS5Dongle-OLED-Config-Web master | b320baf857555c03e2c6544f387fc2ddaf52ef52 | MIT na poziomie repo; osobne licencje zasobów; odmienny firmware |

Strony https://ds5.awalol.eu.org i https://ds5-dev.awalol.eu.org odpowiadały HTTP 200. Nie zakładamy, że wdrożony bundle dokładnie odpowiada najnowszej gałęzi. Analiza funkcji opiera się na przypiętych źródłach. Release API wskazuje tag v0.7.2-hotfix jako najnowsze wydanie (tytuł v0.7.2).

## Konkretne ścieżki i ustalenia

Baza linków wydania: https://github.com/awalol/DS5Dongle/tree/c3308aeaa653ea88c7baee1c963fb6511db0ebbb

- `src/usb_descriptors.cpp`: VID 054C; PID 0CE6/0DF2, kolekcja gamepad 01:05; interfejs HID po trzech audio, numer 3. Raporty feature F6–F9 po 63 bajty danych. Osobna klawiatura jest opcjonalna.
- `src/cmd.cpp`, `pico_cmd_get`, `pico_cmd_set`: F7 czyta Config_body, F8 tekst wersji, F9 RSSI i flagi audio. F6 funkcje 01 RAM, 02 flash, 03 ponowna enumeracja USB. **Wynik bool config_save jest ignorowany.**
- `src/config.h`: packed Config_body; brak magic/CRC/size w raporcie F7. Te pola należą do zapisu flash, nie protokołu konfiguratora.
- `src/config.cpp`: walidacja, wartości domyślne, kontrola flash wewnątrz firmware. Odczyt F7 nadal pochodzi z RAM. Bufor audio dopuszcza 128, mimo komentarza 127 w nagłówku.
- `tools/config_tool.py`: referencyjny klient hidapi, 64 bajty wraz z ID raportu; w aktualnym master przerwa 50 ms i bariera odczytu między zmianą RAM a flash. Obecna tabela FIELDS nie pasuje do starszego wydania!
- `src/ps_shortcut.cpp`: wydanie ma stałe Win+G po krótkim PS i Win+Tab po przytrzymaniu >=750 ms, jeden przełącznik. Nie jest to dziewięć programowalnych skrótów.
- `src/bt.cpp`: parowanie, rozłączenie, przycisk adaptera i LED; `src/battery_led.cpp`: niska bateria; `src/utils.h`: struktura raportu stanu kontrolera.
- `src/state_mgr.cpp`, `src/usb.cpp`, `src/main.cpp`: zastosowanie parametrów audio, triggerów, odpytywania. System operacyjny może zmieniać głośność.
- `master/src/button_shortcut.h`, `.cpp`, `src/button_remap.h`: nowsze mapowania F A/F B, nieobecne w profilu wydania.
- Panel oryginalny: `src/protocol/config.ts`, `src/protocol/ds5BridgeHid.ts`, `src/hooks/useDs5Bridge.ts`, `src/components/ConfigPanel.ts`. Zbadano funkcjonalność, kod nie jest przenoszony do projektu.
- OLED: `docs/adr/0001-vendor-usb-transport.md`, `src/protocol/webUsbTransport.ts`. Fork używa vendor-class WebUSB i własnej sygnatury DS5O w F1. Nie wolno przenosić tych założeń do oryginalnego DS5Dongle.

## Istotne ograniczenia

1. Schemat 5 sam nie identyfikuje formatu. Wydanie ma 19 bajtów, master 24, a pola 14–16 zmieniły znaczenie. Wersja, deskryptory i walidacja muszą poprzedzać zapis.
2. VID/PID są również identyfikatorami prawdziwego kontrolera Sony. Nie dowodzą, że wybrano adapter. Zapis wymaga poprawnego odczytu wersji i znanego profilu.
3. USB reconnect nie restartuje CPU ani nie przeładowuje flash. Nie stanowi testu trwałości zapisu.
4. Brak osobnej komendy resetu fabrycznego konfiguracji w F6. Można przygotować udokumentowane wartości domyślne w formularzu i zastosować je zwykłym zapisem po zatwierdzeniu. Nie usuwa to parowań.
5. Brak edytowalnego koloru lightbara w Config_body wydania. Nie implementujemy sterowania efektami przez przypadkowe raporty kontrolera.
6. Nie ma gwarancji identyfikacji arbitralnych własnych buildów podających identyczny tekst wersji. Profil dotyczy oryginalnego wydania, a fizyczne testy pozostają wymagane.

## Licencje

Główna licencja firmware MIT nie obejmuje automatycznie całego pliku UF2. `src/audio.cpp` deklaruje MPL-2.0. WDL ma warunki zbliżone do zlib oraz opcję LGPL; Opus własny tekst BSD. SDK, TinyUSB, BTstack i sterownik radiowy wymagają osobnego uwzględnienia. Zobacz THIRD_PARTY_NOTICES.md.

BTstack ma bazowe ograniczenie niekomercyjne, ale Raspberry Pi udziela dodatkowej licencji dla wymienionych produktów, w tym Pico 2 W, i produktów z nich wywiedzionych: `pico-sdk/src/rp2_common/pico_btstack/LICENSE.RP`. **Nie jest to ogólny zakaz sprzedaży adaptera.** Trzeba potwierdzić rzeczywistą płytkę i wersje komponentów w sprzedawanym UF2; nie udzielamy deklaracji licencyjnej dla nieznanego hardware.

Źródła: [MIT firmware](https://github.com/awalol/DS5Dongle/blob/daa35cca841c8a70a627d1ce9a65b9d3f3209265/LICENSE), [MPL audio](https://github.com/awalol/DS5Dongle/blob/daa35cca841c8a70a627d1ce9a65b9d3f3209265/src/audio.cpp), [licencja dodatkowa](https://github.com/raspberrypi/pico-sdk/blob/2.3.1/src/rp2_common/pico_btstack/LICENSE.RP), [dokumentacja Raspberry Pi](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html#wireless-software-licensing).

## Dalszy kierunek

WebHID → DeviceTransport → DeviceService → ConfigCodec/FirmwareCompatibility. React dostaje stan i operacje, nigdy pakiety. Pierwszy kamień milowy: odczyt w mocku i testach, następnie implementacja zapisu; weryfikacja na fizycznym adapterze jest osobną bramką przed udostępnieniem klientom. Nieznane firmware: wersja widoczna, zapis zablokowany.
