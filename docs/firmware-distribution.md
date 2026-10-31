# Dystrybucja oprogramowania adaptera 1.7.1

Przygotowano 31.10.2026 dla oryginalnego sprzętu Raspberry Pi Pico 2 W potwierdzonego przez sprzedawcę.

## Co przygotowano

- Pełne, niezmienione LICENSE, NOTICE, SOURCE oraz manifest oficjalnego wydania.
- Teksty licencji bibliotek z dokładnych rewizji wydania, w tym dodatkowe licencje sprzętowe BTstack i CYW43.
- Publiczną stronę /legal/, komplet źródeł DS5 Bridge z przypiętymi submodułami i SDK, instrukcję budowania/instalowania własnej wersji oraz sumę SHA-256.
- Jednostronicową informację dla kupującego z pisemną ofertą bezpłatnego sieciowego dostępu do źródeł (wariant sekcji 6(b) AGPLv3 dla programu w urządzeniu fizycznym).
- Lokalną paczkę dystrybucyjną DongleSense-licencje-1.7.1.zip.

Nie modyfikowano firmware. Oficjalny UF2 ponownie pobrano i sprawdzono; SHA-256 odpowiada wcześniejszemu plikowi użytkownika: 610cc23a210c26670992c6b8abc66e3de1fd6bf1efe60df81959ab4000375084.

## Czynności sprzedawcy

1. Dołącz wydruk INFORMACJA-DLA-KUPUJACEGO.pdf do każdego wysyłanego adaptera. Dokument identyfikuje sprzedawcę przez zamówienie/dokument sprzedaży i wskazuje kontakt przez platformę zakupu. Sam link w aukcji nie zastępuje dołączonej oferty.
2. Utrzymuj bezpłatne źródła pod /legal/ przez minimum 3 lata od dostarczenia każdego egzemplarza i dłużej, jeżeli nadal oferujesz części zamienne lub wsparcie dla tego modelu. Jeżeli zmienisz hosting, zapewnij odbiorcom zastępczy adres; zachowaj kopię źródeł i licencji.
3. Dostarczaj właściwe oznaczenia i licencje, bez przypisywania sobie autorstwa DS5 Bridge, DS5Dongle ani bibliotek. Nie nakładaj dodatkowych ograniczeń na prawa odbiorcy do oprogramowania.
4. Przy zmianie firmware, jego modyfikacji lub hardware przygotuj nowy komplet odpowiadających źródeł i ponownie sprawdź licencje. Ten pakiet nie obejmuje dowolnego zamiennika sprzętowego ani wersji 2.x.
5. Nie przedstawiaj niezaliczonego mikrofonu jako sprawnej funkcji. Licencje nie zastępują rzetelnego opisu urządzenia ani praw kupującego wobec sprzedawcy.

## Odtwarzanie pakietu

npm run build
python scripts/package-firmware-source.py

Skrypt pobiera archiwa repozytoriów po pełnych SHA zapisanych w docs/firmware-source-lock.json, zachowuje licencje i tworzy dist/legal/firmware-source-1.7.1.zip. CI wykonuje ten sam krok przed publikacją Pages. Cache przyspiesza kolejne uruchomienia; nie jest częścią źródeł projektu. Źródła panelu są w osobnym publicznym repozytorium. Obecność bibliotek lub plików dla innych platform w pełnym archiwum źródłowym nie oznacza, że są wbudowane w standardowy UF2.

Walidacja dotyczy kompletności pobranych repozytoriów, obecności przypiętych zależności, zachowania oznaczeń oraz integralności ZIP. Nie wykonywano ponownej kompilacji firmware ani porównania bitowego wyniku. To dokument wykonanych prac i obowiązków dystrybucyjnych, a nie poświadczenie prawne całego procesu sprzedaży.

## Źródła warunków

- Oficjalne wydanie: https://github.com/SundayMoments/DS5_Bridge/releases/tag/v1.7.1
- Licencja wydania: https://github.com/SundayMoments/DS5_Bridge/blob/5ee08e0984085c99eac5afe14c05f572b6e9dc59/LICENSE
- NOTICE: https://github.com/SundayMoments/DS5_Bridge/blob/5ee08e0984085c99eac5afe14c05f572b6e9dc59/NOTICE
- Licencja sprzętowa BTstack w SDK 2.3.0: https://github.com/raspberrypi/pico-sdk/blob/98a542c1a62fb549ffb5d66a3e5892b06276b670/src/rp2_common/pico_btstack/LICENSE.RP
- Licencja sprzętowa CYW43: źródło i SHA w source-lock.json, plik LICENSE.RP w odpowiednim repozytorium.
