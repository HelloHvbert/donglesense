## Licencje i źródła oprogramowania adaptera

Sekcja online: https://hellohvbert.github.io/donglesense/legal/. Pakiet dystrybucyjny i obowiązki sprzedawcy: [firmware-distribution.md](docs/firmware-distribution.md). Po buildzie uruchom `python scripts/package-firmware-source.py`, aby przygotować archiwum odpowiadających źródeł w dist/legal. CI wykonuje to automatycznie.

## Instrukcja DongleSense PDF

Aktualne instrukcje: [PL](public/assets/donglesense-guide-pl.pdf) i [EN](public/assets/donglesense-guide-en.pdf). Dostępne również w zakładce Instrukcja. Generator: `scripts/generate-donglesense-guide.py` (ReportLab i Arial). Pliki `guide-pl.pdf` / `guide-en.pdf` oraz wcześniejsza dokumentacja odnoszą się do profilu awalol.

# DualSense Wireless Adapter Configurator

## Aktualizacja DS5 Bridge 1.7.1 — 22.10.2026

Domyślny panel obsługuje teraz DS5 Bridge 1.7.1 (SundayMoments), protokół 1.23, przez WebUSB. Przetestowano rzeczywisty adapter użytkownika: odczyt, zmianę i przywrócenie czasu bezczynności, wibracje i kolor podświetlenia pada. Firmware pozostało bez zmian.

W zakładce Adapter: paleta HSV, pasek barwy, HEX/RGB i jasność. Zastosowanie wymaga kliknięcia przycisku. Zmiany dotyczą pamięci roboczej; profil lokalny można zapisać w przeglądarce i ponownie zastosować ręcznie. Zamknij aplikację DS5 Bridge w zasobniku przed połączeniem, ponieważ zajmuje interfejs USB.

Zakres i szczegóły: [protokół oraz test sprzętowy](docs/bridge171-protocol.md). Zaawansowane remapowanie, Trigger Lab, własne skróty i przechwytywanie dźwięku systemowego nie są zaimplementowane. Poprzedni profil awalol i demo pozostają pod adresem ?profile=awalol#dashboard. Poniższe pierwotne informacje i pliki PDF dotyczą tego starszego profilu.



Lokalnie przygotowany, statyczny panel React + TypeScript + Vite + Tailwind CSS, z ikonami Lucide, WebHID i testami Vitest. Własny interfejs PL/EN. Bez backendu, kont i telemetrii sieciowej. Nie publikowano repozytorium ani strony.

**Profil pierwszej wersji: oryginalne DS5Dongle v0.7.2-hotfix, commit c3308ae.** Nie jest to deklaracja zgodności z dowolnym firmware schematu 5. Szczegóły: [research](docs/research.md), [protokół](docs/protocol.md), [zgodność](docs/compatibility.md), [funkcje](docs/features.md).

## Uruchomienie

Node.js 24, npm. W katalogu projektu:

```sh
npm ci
npm run dev
```

Otwórz adres wypisany przez Vite. WebHID wymaga desktopowego Chrome/Edge i bezpiecznego kontekstu (HTTPS lub localhost). Kliknij „Zobacz wersję demo”, aby sprawdzić aplikację bez adaptera. Demo ma jawne oznaczenie i nigdy nie otwiera HID.

```sh
npm test
npm run build
npm run preview
```

## Obsługiwane działanie

- Wybór gamepada HID, odczyt wersji i konfiguracji, obsługa odłączenia i ponownego połączenia.
- Haptyka, triggery, bezczynność, audio, LED, polling, tryb USB, serial, wake i stałe skróty PS.
- Zapis z walidacją całego body, kontrolą konfliktu i readback. Domyślne wartości są najpierw przygotowywane w formularzu.
- Dashboard z raportowanym RSSI i baterią (brak danych = brak liczby); tryb demonstracyjny pokazuje jawne dane przykładowe.
- PDF PL/EN, instrukcje w aplikacji, notices licencji i hash routing.

Dziewięć własnych skrótów, remap, lock volume i inne pola nowszego master nie są obsługiwane przez wybrane wydanie. Nie udajemy ich w UI. Szczegółowy protokół rozszerzeń opisano do przyszłego, osobno testowanego profilu.

## Co oznacza zapis

Firmware **nie przekazuje wyniku flash-write przez HID**. Panel potwierdza zgodne wartości w RAM i wysłanie polecenia zapisu. Nie twierdzi, że otrzymał ACK flash. Weryfikacja trwałości: fizycznie odłącz zasilanie, podłącz ten sam adapter, połącz w panelu i użyj „Porównaj po odłączeniu zasilania”. Potwierdzenie odłączenia zasilania pochodzi od użytkownika, nie jest automatycznie wykrywane.

Preferencja języka i punkt porównania konfiguracji są przechowywane lokalnie w localStorage. Nie ma identyfikatora sprzętu w tym punkcie, więc użytkownik musi użyć tego samego adaptera. Przeglądarka może również zapamiętać uprawnienie WebHID. Nie wysyłamy ustawień do serwera.

## Architektura

- `DeviceTransport`: transport niezależny od UI.
- `WebHIDTransport`: chooser, deskryptory, feature/input reports, timeout i detach.
- `MockTransport`: wyłącznie jawne demo/testy.
- `DeviceService`: stan, operacje sekwencyjne, identyfikacja, konflikt, readback, unieważnianie sesji.
- `ConfigCodec`: strict packed layout i zakresy wydania.
- `FirmwareCompatibility`: ścisła lista wersji; nieznane firmware nie dostaje SET.
- `App.tsx`: widoki i formularze, bez kodowania pakietów USB.

Instrukcje PDF w `public/assets/guide-pl.pdf` i `guide-en.pdf`. Odtworzenie: `python scripts/generate-guide.py` z reportlab; ustaw GUIDE_FONT i GUIDE_FONT_BOLD na dostępne fonty TTF z polskimi znakami, gdy nie używasz Windows. Wspólna treść aplikacji i PDF znajduje się w `docs/guide-content.json`; po jej zmianie odtwórz oba PDF.

## GitHub Pages — dopiero po zatwierdzeniu

Workflow `.github/workflows/deploy.yml` uruchamia testy i build dla PR; publikuje tylko main po push/merge lub ręcznym uruchomieniu. Przygotowano konfigurację, ale nie wykonano żadnej zdalnej operacji na repozytorium.

Po zatwierdzeniu właściciela:

1. Umieść zawartość tego katalogu w katalogu głównym wybranego repozytorium.
2. Settings → Pages → Source: GitHub Actions. Włącz HTTPS. Darmowy hosting Pages dla publicznego repo nie oznacza, że prywatne repo jest darmowe na każdym planie.
3. Zabezpiecz main i wymagaj testów PR. Opcjonalnie wymagaj zatwierdzenia środowiska github-pages.
4. Merge do main uruchamia workflow. Sprawdź deploy oraz zasoby.

Vite `base: './'` i routing hash działają pod `https://OWNER.github.io/REPOSITORY/` bez serwerowego fallbacku. Instrukcja pod QR: `https://OWNER.github.io/REPOSITORY/#guide`. **OWNER/REPOSITORY to wzór, nie opublikowany adres.** Wygeneruj drukowany QR dopiero po ustaleniu i sprawdzeniu docelowego URL.

## Status weryfikacji

Wyniki lokalne: [validation.md](docs/validation.md). Fizyczny adapter, Windows 11, zimny restart i wdrożenie na Pages pozostają do testów: [checklista](docs/manual-testing.md). Nie oznaczaj projektu jako zweryfikowanego do sprzedaży przed wykonaniem tych testów.

## Prawa i zależności

[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) zawiera teksty licencji faktycznie zainstalowanych bibliotek. Nie kopiowano oryginalnego panelu. Nowemu kodowi nie nadano automatycznie licencji open source; wybór warunków dystrybucji należy do właściciela projektu. Firmware ma własne licencje i nie jest dostarczane w paczce panelu. Nie zmieniano firmware.
