# Testy odbiorcze DongleSense / DS5 Bridge

Aktualizacja: 22.10.2026. Firmware pozostaje bez zmian. Historyczna checklista awalol: [manual-testing-legacy.md](manual-testing-legacy.md).

## Potwierdzone na adapterze użytkownika

- [x] Po wyłączeniu aplikacji desktopowej interfejs USB daje się otworzyć i odczytać.
- [x] Zmiana czasu bezczynności 15 → 16 → 15, ACK i readback zgodne.
- [x] Klasyczne wibracje: przyjęcie komendy oraz efekt potwierdzony przez użytkownika.
- [x] Zmiana koloru pada: działanie potwierdzone przez użytkownika.

## Automatyczne — 22.10.2026

35/35 testów przeszło, TypeScript i build produkcyjny poprawne. Testy mock obejmują m.in. odczyt bez zapisu, konflikt, niezgodne ACK, walidację, wspólną komendę RGB/jasności, brak zbędnego zapisu, zatrzymanie po błędzie USB i timeout po 4 sekundach. Nie zastępują testów sprzętowych.

## Kolejne testy ręczne

- [ ] W Chrome i Edge: zanotować wersję przeglądarki i Windows; anulować wybór urządzenia, następnie ponownie połączyć.
- [x] Wstecz/Dalej i kliknięcie logo działają — potwierdzone przez użytkownika. Zachowanie niezastosowanego koloru między zakładkami również potwierdzone przez użytkownika.
- [ ] Klawiatura: Tab, Enter, przełączniki, suwaki, strzałki palety i HEX/RGB; widoczny fokus.
- [ ] Mały ekran, PL/EN i systemowe ograniczenie animacji.
- [x] Profil: zapis odczytu, zmiana koloru bez zastosowania, przejście między zakładkami i wczytanie profilu — użytkownik potwierdził poprawne zachowanie. Pad nie zmienia koloru bez zastosowania.
- [x] Po odłączeniu zasilania i ponownym połączeniu użytkownik potwierdził przywrócenie profilu oraz zgodny kolor pada. Profil odtwarzany z przeglądarki; nie jest to dowód zapisu do flash.
- [ ] Odłączyć adapter w czasie odczytu i zapisu; brak fałszywego sukcesu, brak automatycznej ponownej komendy, możliwość ponownego połączenia.
- [ ] Audio, mikrofon i haptyka w grze; po testach przywrócić wartości początkowe.
- [ ] Jasność oraz utrzymanie koloru podczas działania gry.
- [ ] LED adaptera, bezczynność, uśpienie USB, skrót usypiania i wake na danym PC.
- [ ] Opublikowana strona: HTTPS, zasoby, instrukcje i odświeżanie adresów zakładek.

Odbiór wizualny w tej sesji pozostaje niewykonany z powodu blokady dostępu automatyzacji przeglądarki. Nie wykonywano nowych komend na fizycznym adapterze w ramach tego przebiegu testów.



- [x] Zwykłe odłączenie USB i ponowne połączenie: wykrycie rozłączenia, blokada zmian i ponowny odczyt działają — potwierdzone przez użytkownika. Nie obejmuje odłączenia w trakcie operacji.


