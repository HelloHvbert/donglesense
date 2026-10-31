# DongleSense - dokumentacja techniczna

Stan: 31.10.2026. NIE JEST to certyfikat, zatwierdzona ocena zgodności ani wydana deklaracja UE. Nie stanowi podstawy do samodzielnego umieszczenia znaku CE. Dokumenty przygotowano lokalnie; niczego nie opublikowano jako potwierdzenia zgodności DongleSense.

Zebrano oficjalną deklarację UE i certyfikat bezpieczeństwa oryginalnej płytki Pico 2 W, przewodnik Komisji Europejskiej RED z 7.07.2026 oraz dokumenty Bambu PLA Basic. Deklaracja płytki jest dowodem dotyczącym płytki, nie gotowego DongleSense z innym firmware i obudową.

## Co jest w paczce

1. 01-opis-produktu.md - identyfikacja konfiguracji i wykaz brakujących danych.
2. 02-ocena-wplywu-zmian.csv - przygotowana analiza obudowy, montażu, oprogramowania, bezpieczeństwa i EMC.
3. 03-procedura-i-dowody.md - warunki wyboru procedury RED i lista dowodów do pozyskania.
4. 04-wzor-deklaracji-UE.md - niewypełniony szkielet, bez twierdzenia o zgodności i bez podpisu.
5. 05-plan-weryfikacji.csv - plan badań/ocen do uzgodnienia z kompetentną osobą lub laboratorium; nie jest normą badawczą.
6. 06-zrodla-i-luki.md - źródła, ograniczenia i dokumenty, których nie udało się pobrać.
7. dowody/ - oryginalne pliki producentów z sumami SHA-256.

## Co zrobić teraz

- Zidentyfikować faktyczny egzemplarz i wersję obudowy: plik 3MF/STL, wariant, wymiary, parametry druku, mocowanie i metalowe elementy. Link do modelu nie zastępuje dokumentacji wykonanej sztuki.
- Zachować faktury/pochodzenie płytki i filamentu oraz numery partii.
- Uzgodnić zakres i wersje norm dla produktu końcowego; uzyskać dokumentację badań płytki i sprawdzić, które wyniki można wykorzystać po integracji.
- Uzupełnić ocenę zmian, wykonać potrzebne pomiary i zamknąć otwarte ryzyka.
- Dopiero po pozytywnej ocenie: ustalić finalną deklarację UE, oznaczenie, instrukcję, identyfikowalność i kontrolę produkcji.

Testy grania, wibracji, dźwięku i 35 testów programu są testami funkcjonalnymi. Nie potwierdzają zgodności radiowej, EMC, bezpieczeństwa ani RoHS. Pakiet licencji oprogramowania również tego nie potwierdza.

[Zapytanie do laboratorium](07-zapytanie-do-laboratorium.md).

## Kolejność prac dla tej konstrukcji

1. Zachować deklarację Raspberry Pi Pico 2 W i dokumenty dowodowe — wykonano.
2. Zebrać opis DongleSense, zdjęcia płytki i obudowy, identyfikację firmware oraz ocenę ryzyka — opis i wersja są zapisane; zdjęcia i zamknięta ocena ryzyka do uzupełnienia.
3. Udokumentować brak modyfikacji anteny i elektroniki oraz brak pogorszenia warunków pracy przez obudowę — wymaga potwierdzenia faktycznego egzemplarza i odpowiednich dowodów. Nie uznano tego za spełnione na podstawie samego projektu modelu.
4. Ocenić, czy zebrane dowody pozwalają na zastosowanie wewnętrznej kontroli produkcji dla gotowego DongleSense — decyzja otwarta; zakres ewentualnych dodatkowych badań wynika z tej oceny.
5. Dopiero po pozytywnym zakończeniu oceny wystawić własną deklarację UE i zastosować wymagane oznakowanie — deklaracja DongleSense nie została wystawiona.
