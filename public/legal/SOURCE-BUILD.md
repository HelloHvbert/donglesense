# Źródła oprogramowania adaptera 1.7.1

Archiwum firmware-source-1.7.1.zip zawiera kod DS5 Bridge i zależności w wersjach przypiętych w source-lock.json. W firmware nie wprowadzono zmian. Oryginalne licencje i oznaczenia autorów zachowano wewnątrz źródeł. Własny panel DongleSense jest dostępny oddzielnie: https://github.com/HelloHvbert/donglesense.

Oficjalny plik dla standardowego Raspberry Pi Pico 2 W:
DS5-Bridge-Firmware-v1.7.1.uf2
SHA-256: 610cc23a210c26670992c6b8abc66e3de1fd6bf1efe60df81959ab4000375084
Źródło: SundayMoments/DS5_Bridge, commit 5ee08e0984085c99eac5afe14c05f572b6e9dc59.
Manifest oryginalnego wydania: upstream-manifest.json.

## Zawartość

DS5_Bridge/ - niezmodyfikowane źródła wydania, także źródła aplikacji autora, pliki CMake i workflow wydania.
DS5_Bridge/lib/WDL/ oraz lib/opus/ - submoduły wskazane przez wydanie.
pico-sdk/ - SDK 2.3.0 z przypiętymi submodułami; TinyUSB w wersji wskazanej w workflow wydania (nie domyślna wersja SDK).
source-lock.json - dokładne adresy repozytoriów i rewizje.

Pełne drzewa zawierają również pliki dla innych platform i opcjonalne komponenty. Ich obecność nie oznacza, że każdy z nich jest wbudowany w sprzedawany plik. Oryginalne, odrębne licencje tych plików pozostają obowiązujące.

## Budowanie standardowego firmware

Potrzebne narzędzia: CMake (co najmniej 3.13), Ninja, Python 3, GNU Arm Embedded Toolchain 15.2.Rel1. Wydanie autora używało systemu Linux. Narzędzia systemowe i kompilator należy zainstalować osobno; nie są częścią tego archiwum.

Z katalogu, w którym są obok siebie DS5_Bridge i pico-sdk:

    cmake -S DS5_Bridge -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DPICO_SDK_PATH="$(pwd)/pico-sdk" -DENABLE_COMPANION=ON
    cmake --build build --target ds5-bridge

Wynik: build/ds5-bridge.uf2. Nie włączaj wariantu WAVESHARE_RP2350B_PLUS_W_BUILD dla oryginalnego sprzętu.
Dokładne kroki autora: DS5_Bridge/.github/workflows/release.yml.
W zależności od środowiska SDK może pobrać narzędzie picotool 2.3.0. Jego źródła i licencja są dostępne pod https://github.com/raspberrypi/picotool/tree/2.3.0.

Przygotowanie archiwum nie jest deklaracją identyczności bitowej ponownego builda z plikiem autora. Hash powyżej identyfikuje oryginalny plik, a nie nowy build. W tym przebiegu nie kompilowano firmware.

## Instalacja własnej wersji

Instrukcja techniczna dla osoby świadomie modyfikującej oprogramowanie: odłącz adapter, przytrzymaj jego przycisk podczas podłączania USB, następnie skopiuj prawidłowo zbudowany plik .uf2 na dysk urządzenia. Urządzenie uruchomi się ponownie. Samo wejście w ten tryb nie usuwa oprogramowania. Dla wydania 1.7.1 nie dodano blokady instalacji zmodyfikowanego programu ani klucza sprzedawcy. Zwykłe używanie adaptera nie wymaga tej procedury.

## Licencje i prawa odbiorcy

DS5 Bridge: GNU Affero General Public License v3.0 only. Pełny tekst: upstream-LICENSE.txt. Oznaczenia poprzednich autorów i materiałów: upstream-NOTICE.txt. Zależności mają własne licencje dołączone do archiwum i obok niego. Warunki handlowego użycia BTstack/CYW43 zastosowano dla oryginalnego sprzętu Raspberry Pi Pico 2 W potwierdzonego przez sprzedawcę; dokument nie rozszerza tych praw na dowolny zamiennik.

Licencje oprogramowania nie zastępują warunków sprzedaży ani praw konsumenta dotyczących urządzenia. Zastrzeżenia odpowiedzialności pochodzące z licencji dotyczą oprogramowania w zakresie dopuszczonym prawem.
