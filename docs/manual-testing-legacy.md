> Aktualizacja 22.10.2026: domyślny profil DS5 Bridge 1.7.1 / WebUSB. Test sprzętowy i zakres: [bridge171-protocol.md](bridge171-protocol.md). Poniższe wcześniejsze wyniki dotyczą profilu awalol.

# Testy odbiorcze: Windows 11 + fizyczny adapter

Status: **NIEWYKONANE**. Testy mock i podgląd nie są dowodem zgodności sprzętowej.

Zapisz: model hardware, hash pliku UF2, wersję F8, pełny odczyt F7, wersję Windows/Chrome/Edge, typ kontrolera (DS5/Edge), rezultat i datę. Testuj na egzemplarzu testowym, nie na urządzeniu klienta. Operacje usuwania parowań i tryb flash tylko po osobnym potwierdzeniu.

- [ ] HTTPS GitHub Pages i localhost: przycisk otwiera chooser tylko po kliknięciu.
- [ ] Anulowanie wyboru i odmowa uprawnień nie pokazują sukcesu; można ponowić.
- [ ] Bez kontrolera: zweryfikuj, kiedy firmware enumeruje gamepad USB. Po PS + Create można połączyć.
- [ ] Zwykły przewodowy DualSense nie przechodzi identyfikacji jako zgodny adapter.
- [ ] F8 odpowiada dokładnie obsługiwanemu profilowi. F7 odczytuje 19 bajtów i ewentualny zerowy padding; sprawdź prefiks ID w WebHID na Windows.
- [ ] Wersja dev, v0.7.1 i nieznany build: zapis zablokowany.
- [ ] Haptyka 1.0/1.5/2.0 i redukcja triggerów 0/5/10: rzeczywisty efekt w grze. Nie wszystkie efekty triggerów podlegają redukcji.
- [ ] Speaker gain 0/2/7, mic/speaker disable, bufor audio: rzeczywisty dźwięk/mikrofon; powrót do auto po nowym stanie z gry lub ponownym połączeniu.
- [ ] Zmiana głośności OS między odczytem a zapisem: konflikt nie nadpisuje bieżącego stanu.
- [ ] Zmiana konfiguracji w drugim konfiguratorze: konflikt bez SET.
- [ ] Zapis: SET F6/01 → GET F7 → SET F6/02 → GET F7; brak twierdzenia o ACK flash.
- [ ] Fizycznie odłącz zasilanie, podłącz ten sam adapter i porównaj wartości. Samo USB reconnect nie wystarcza.
- [ ] Odłącz w czasie odczytu, RAM write, flash write i readback: wynik niepewny, brak automatycznego retry.
- [ ] Po utracie połączenia brak edycji/zapisu, można ponownie połączyć.
- [ ] Zmiana serial/mode/wake/PS shortcut: komunikat i działanie po ponownym podłączeniu.
- [ ] Wake działa przy odpowiednich ustawieniach BIOS/UEFI/Windows; nie deklaruj zgodności każdego PC.
- [ ] Krótki PS Win+G; długi >=750 ms Win+Tab. Brak edytora 9 skrótów dla tego firmware.
- [ ] Przygotowanie domyślnych nie pisze do urządzenia; zwykły zapis stosuje je po świadomej akcji.
- [ ] LED połączenia i alarm niskiej baterii; raportowane poziomy baterii nie są precyzyjnym pomiarem procentowym.
- [ ] 250/500/real-time: obserwacja raportów, bez deklaracji gwarantowanego 1000 Hz.
- [ ] RSSI=0/brak/stary odczyt: brak wymyślonej siły sygnału.
- [ ] PL/EN, klawiatura, fokus, telefon/tablet, redukcja animacji; pobranie obu PDF i notices.
- [ ] GitHub Pages w podkatalogu repozytorium: odświeżenie #controller/#guide, PDF i pozostałe zasoby.

Przed sprzedażą: potwierdź warunki licencyjne konkretnego UF2/hardware i dołącz wymagane notices/źródła MPL. Nie używaj oznaczeń sugerujących oficjalny produkt Sony.
