> Aktualizacja 22.10.2026: domyślny profil DS5 Bridge 1.7.1 / WebUSB. Test sprzętowy i zakres: [bridge171-protocol.md](bridge171-protocol.md). Poniższe wcześniejsze wyniki dotyczą profilu awalol.

# Zgodność

| Firmware | Schemat | Rozmiar body | Polityka pierwszej aplikacji |
|---|---|---|---|
| v0.7.2-hotfix / c3308ae | 5 | 19 | odczyt i zapis; wymaga testów fizycznych |
| v0.7.1 | 4 | 21 | rozpoznanie wersji, brak zapisu |
| v0.6.0-hotfix | 1 | 15 | rozpoznanie wersji, brak zapisu |
| master daa35cc | 5 | 24 | brak zapisu w pierwszym profilu |
| dowolny dev / nieznany build / OLED | nieznany | nieznany | brak dekodowania jako znany profil i brak zapisu |

Wersja F8 to tekst ustawiany przy kompilacji, nie kryptograficzny dowód pochodzenia. Release workflow przekazuje tag do VERSION; build gałęzi skraca SHA do 7 znaków. Akceptujemy dokładny tag v0.7.2-hotfix i dokładny hash c3308ae (lub pełny commit). Nie akceptujemy dowolnego tekstu zawierającego „0.7.2”, „dev” ani samego config_version=5.

Przeglądarka: desktop Chrome/Edge z navigator.hid i secure context; brak WebHID oznacza ekran instrukcji. Weryfikacja na Windows 11 jest wymagana. Nie instalujemy sterowników WinUSB dla oryginalnego HID. Nie stosujemy instrukcji naprawy sterowników forka OLED.

Nieznany firmware może pokazać odczytaną wersję, ale wszystkie edytory pozostają zablokowane. Zwykły kontroler Sony może przejść filtr VID/PID: nie wysyłać żadnego SET zanim adapter nie przejdzie identyfikacji i walidacji.
