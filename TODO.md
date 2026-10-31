# DongleSense — TODO

Aktualizacja: 22.10.2026. Domyślny panel: DS5 Bridge 1.7.1 przez WebUSB. Starszy profil awalol pozostaje osobnym trybem. Firmware adaptera pozostaje bez zmian.

## Zakończone

- [x] Identyfikacja dostarczonego UF2, protokołu i interfejsu sterowania — szczegóły w docs/bridge171-protocol.md.
- [x] React/TypeScript/Vite, PL/EN, zakładki i komunikaty połączenia.
- [x] Odczyt bez zapisu; zmiany z walidacją, ACK, rewizją i odczytem zwrotnym.
- [x] Test na adapterze użytkownika: odczyt, czas bezczynności 15 → 16 → 15 minut.
- [x] Test klasycznych wibracji — efekt potwierdzony przez użytkownika.
- [x] Kolor podświetlenia pada — działanie potwierdzone przez użytkownika.
- [x] Picker HEX/RGB, jasność, utrzymanie koloru, lokalny profil przeglądarki.
- [x] Spójne odstępy i karty, lekkie animacje z prefers-reduced-motion, nazwa DongleSense.
- [x] Wstecz/Dalej i link logo — działanie potwierdzone przez użytkownika.
- [x] 35 testów automatycznych: 22 starszego profilu i 13 DS5 Bridge; TypeScript i build przechodzą.
- [x] Dodatkowe scenariusze mock: brak zmian = brak zapisu, przerwanie po błędzie USB, timeout i powiadomienie UI.
- [x] Dokumentacja protokołu, ograniczeń i dotychczasowych testów sprzętowych.
- [x] README, notices zależności, paczka ZIP i przygotowany workflow GitHub Actions.

## Do wykonania — odbiór

- [ ] Chrome i Edge na Windows: połączenie, anulowanie wyboru, ponowne połączenie, konflikt z aplikacją desktopową.
- [ ] Fizyczne odłączenie podczas odczytu/zapisu i powrót do pracy; dotychczasowe testy błędów są mockami.
- [ ] Pozostałe funkcje na sprzęcie: audio, mikrofon, haptyka w grze, LED adaptera, uśpienie i wybudzanie.
- [x] Lokalny profil: zapis i wczytanie do formularza oraz zachowanie niezastosowanego koloru między zakładkami — potwierdzone przez użytkownika.
- [x] Lokalny profil: odtworzenie po odłączeniu zasilania — użytkownik potwierdził powrót profilu i zgodny kolor pada.
- [ ] Pełna kontrola klawiaturą, PL/EN, mały ekran, ograniczenie animacji i fokus. W tej sesji brak ponownego odbioru wizualnego — dostęp automatyzacji przeglądarki zablokowany.
- [x] Aktualne instrukcje DongleSense PL/EN w PDF, sprawdzone wizualnie i podlinkowane w zakładce Instrukcja (31.10.2026). Starsze PDF pozostają wyłącznie dla profilu awalol.
- [ ] Pełne notices/licencje dla dokładnego firmware dystrybuowanego z urządzeniem.
- [ ] Uruchomienie workflow na GitHub i publikacja po zgodzie użytkownika.
- [ ] Test wdrożenia w podkatalogu, docelowy URL i drukowany QR.

Checklista: [docs/manual-testing.md](docs/manual-testing.md). Nie zaznaczamy testów mock jako odbioru fizycznego sprzętu. Ustawienia DS5 Bridge dotyczą sesji; profil lokalny jest przechowywany w przeglądarce, nie we flash adaptera.



- [x] Zwykłe odłączenie i ponowne połączenie adaptera — potwierdzone przez użytkownika; test przerwania trwającego odczytu/zapisu pozostaje otwarty.


