> Aktualizacja 22.10.2026: domyślny profil DS5 Bridge 1.7.1 / WebUSB. Test sprzętowy i zakres: [bridge171-protocol.md](bridge171-protocol.md). Poniższe wcześniejsze wyniki dotyczą profilu awalol.

# Weryfikacja lokalna — 21–22.10.2026

## Wykonano

- Kamień milowy odczytu: 6 testów przeszło **przed** dodaniem zapisu. Połączenie mock, wersja, konfiguracja, odmowa, rozłączenie, układ binarny.
- Końcowe `npm test`: **22/22 testy** w trzech plikach. Transport WebHID testowany z obiektem HID zastępczym, nie fizycznym adapterem.
- `npm run build`: TypeScript strict i Vite build zakończone poprawnie. Produkcyjny JS około 274 kB, gzip około 88 kB; brak backendu.
- `npm audit --omit=dev`: zero zgłoszonych podatności zależności produkcyjnych w chwili sprawdzania. To nie jest audyt bezpieczeństwa całej aplikacji.
- Podgląd lokalny w przeglądarce aplikacji: ekran powitalny, demo, wejście do ustawień kontrolera, zmiana haptyki 1.0 → 1.5, wskaźnik dirty, zapis demo i poprawny komunikat, zablokowany przycisk po zapisie.
- Zmiana PL/EN i nawigacja do instrukcji z poprawnym językiem oraz linkiem do właściwego PDF. Etykiety nawigacji zachowane dla widoku ikonowego.
- Oględziny layoutu w wąskim panelu (~647 px) i desktop (~1400 px). Nie deklarujemy pełnych testów na wszystkich rozdzielczościach.
- Oba PDF: render Poppler i oględziny wszystkich stron, czytelne polskie znaki, brak ucięć.
- Pełne teksty licencji znalezionych w faktycznie zainstalowanych pakietach, spis w dependency-inventory.json. Platformowy binding builda odsyła do licencji pakietu nadrzędnego; nie trafia do JS przeglądarki.

## Nie wykonano / granice wyniku

- Fizyczny odczyt i zapis adaptera, rzeczywiste potwierdzenie trwałości po odłączeniu zasilania, pomiary odpytywania i testy gier.
- Odbiór sprzętowy na Windows 11, Chrome i Edge. Obecność komputera Windows nie jest testem adaptera.
- Publikacja GitHub Pages i wykonanie workflow na zdalnym repozytorium — brak zatwierdzenia użytkownika i wybranego repo.
- Pełny audyt dystrybucji konkretnego UF2, hardware i wszystkich składowych binarnego firmware. Firmware nie jest częścią paczki.
- Zapis dla master, forka OLED lub dowolnego nieznanego schematu. Panel celowo blokuje te wersje.

Przed udostępnieniem klientom wykonaj [manual-testing.md](manual-testing.md). Ta wersja jest przygotowana do testów odbiorczych, a nie oznaczona jako zweryfikowana produkcyjnie.

## Kontrola końcowa 22.10.2026

Ponownie wykonano 22 testy i build produkcyjny z wynikiem pozytywnym. Sprawdzono zgodność 114 kluczy tłumaczeń PL/EN, obecność zasobów JS/CSS wskazanych przez dist/index.html oraz obu PDF i notices w dist. Paczka ZIP zawiera źródła i dist; bez node_modules i pobranych plików oryginalnego panelu.
