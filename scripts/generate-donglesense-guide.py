"""Build current DongleSense PDF guides; legacy guides remain separate."""
from pathlib import Path
import json
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parents[1]
pdfmetrics.registerFont(TTFont('Guide','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('GuideBold','C:/Windows/Fonts/arialbd.ttf'))
URL='https://hellohvbert.github.io/donglesense/'
styles={
 'title':ParagraphStyle('title',fontName='GuideBold',fontSize=29,leading=34,textColor=HexColor('#152947'),spaceAfter=12),
 'sub':ParagraphStyle('sub',fontName='Guide',fontSize=10,leading=15,textColor=HexColor('#63748b'),spaceAfter=16),
 'h':ParagraphStyle('h',fontName='GuideBold',fontSize=13,leading=17,textColor=HexColor('#2260a8'),spaceBefore=14,spaceAfter=7),
 'p':ParagraphStyle('p',fontName='Guide',fontSize=10,leading=15,textColor=HexColor('#26364b'),spaceAfter=8),
}
content={
'pl':[
('Pierwsze połączenie',[
('1. Przygotuj adapter i pada','Podłącz adapter do USB komputera. Po sparowaniu według pierwszej strony pad łączy się z adapterem bezprzewodowo. Na stronie możesz wygodnie zmieniać ustawienia pada.'),
('2. Otwórz panel','Użyj Chrome lub Edge na komputerze i adresu z pierwszej strony. Jeśli korzystasz też z aplikacji DS5 Bridge lub AudioHelper, zamknij je całkowicie przez ikonę obok zegara. Rozłącz adapter w innych otwartych kartach strony.'),
('3. Połącz i odczytaj','Kliknij „Połącz DS5 Bridge”, wybierz adapter USB i zatwierdź. Pierwsze połączenie tylko odczytuje stan. Sprawdź komunikat powodzenia i stan kontrolera. Poziom baterii i siła sygnału są informacjami podawanymi przez adapter.'),
('4. Zastosuj ustawienia','Zmień wybraną wartość i kliknij „Zastosuj zmiany”. Samo przesuwanie suwaka lub wybór koloru zmienia tylko formularz. Panel sprawdza, czy adapter przyjął zmianę. „Cofnij” przywraca formularz do ostatniego odczytu.'),
('Profil lokalny i zasilanie','„Zapisz odczyt jako profil” zachowuje odczytane ustawienia w tej przeglądarce. „Wczytaj profil do formularza” przygotowuje wartości; dopiero „Zastosuj zmiany” wysyła je do urządzenia. Po odłączeniu zasilania ustawienia mogą wrócić do poprzednich wartości. Po odłączeniu zasilania połącz się ponownie, odczytaj stan i w razie potrzeby wczytaj oraz zastosuj profil.'),
]),
('Ustawienia i pomoc',[
('Kontroler i Audio','Kontroler: wzmocnienie haptyki, rozłączanie po bezczynności i jego czas. Test wibracji uruchamia krótkie klasyczne wibracje, nie wszystkie efekty wibracji z gier; wymaga połączonego pada i braku niezastosowanych zmian. Audio: głośność głośnika, jego wzmocnienie i wyciszenie mikrofonu. Dostępność efektu audio zależy także od źródła dźwięku i konfiguracji gry/systemu.'),
('Adapter i podświetlenie pada','Zakładka Adapter obejmuje LED adaptera, wybudzanie, rozłączanie przy uśpieniu USB i skrót usypiania. Kolor pada wybierz na palecie; jasność ustaw osobnym suwakiem. „Utrzymuj wybrany kolor” zapobiega nadpisywaniu go przez grę. Każdą zmianę zatwierdź przyciskiem „Zastosuj zmiany”.'),
('Klawiatura i profile','Używaj Tab do przechodzenia po kontrolkach. Na palecie strzałki lewo/prawo zmieniają nasycenie, góra/dół jasność koloru; Shift zwiększa krok. Profil jest przypisany do przeglądarki i adresu strony. Profil z lokalnej wersji strony nie przenosi się automatycznie na stronę online; usunięcie danych strony może go skasować.'),
('Problemy z połączeniem lub zapisem','Adapter zajęty przez inną aplikację: zakończ aplikację desktopową z ikony przy zegarze i rozłącz inne karty. Anulowany wybór: ponów połączenie. Odłączony adapter: podłącz i odczytaj ponownie. Konflikt ustawień: odśwież odczyt przed zmianami. Jeśli adapter nie odpowie lub zapisze tylko część zmian połącz się i sprawdź rzeczywiste wartości - nie zakładaj, że wszystkie zmiany zostały zapisane lub cofnięte.'),
('Zakres i wersja beta','Panel nie obsługuje Trigger Lab, remapowania, własnych skrótów, przełączania trybu kontrolera ani przechwytywania dźwięku systemowego. Oprogramowanie adaptera pozostaje bez zmian. Połączenie, kolor, klasyczne wibracje i przywracanie profilu sprawdzono na adapterze użytkownika; pełny odbiór audio, wybudzania i wszystkich przeglądarek pozostaje otwarty.'),
])],
'en':[
('First connection',[
('1. Prepare the adapter and controller','Plug the adapter into a computer USB port. After pairing as described on the first page, the controller connects to the adapter wirelessly. Use the page to adjust your controller settings.'),
('2. Open the panel','Use Chrome or Edge on your computer and the address on the first page. If DS5 Bridge or AudioHelper is running, fully exit it using its icon next to the clock. Disconnect the adapter in other open website tabs.'),
('3. Connect and read','Click “Connect DS5 Bridge”, select the USB adapter and confirm. The initial connection only reads device state. Check the success message and controller status. Battery and signal strength are reported by the adapter.'),
('4. Apply settings','Change a value and click “Apply changes”. Moving a slider or choosing a color only edits the form. The page checks that the adapter accepted the change. “Discard” restores the form to the last reading.'),
('Local profile and power','“Save reading as profile” stores the settings read from the device in this browser. “Load profile into form” prepares the values; only “Apply changes” sends them to the device. Settings may return to previous values after power is disconnected. After power is disconnected, reconnect, read the current state, then load and apply your profile if needed.'),
]),
('Settings and help',[
('Controller and Audio','Controller: haptics gain, idle disconnect and timeout. The rumble test produces short classic vibrations, not every type of in-game vibration; it requires a connected controller and no unapplied changes. Audio: speaker volume, speaker gain and microphone mute. Audible results also depend on the sound source and game/system configuration.'),
('Adapter and controller lightbar','The Adapter tab includes the adapter LED, wake, disconnect on USB suspend and the controller sleep shortcut. Choose a controller color on the palette; set brightness with the separate slider. “Keep selected color” prevents games from overriding it. Confirm each change using “Apply changes”.'),
('Keyboard and profiles','Use Tab to move between controls. On the palette, left/right arrows adjust saturation and up/down adjust color value; hold Shift for larger steps. Profiles belong to the current browser and website address. A profile from a local copy of the website does not move to the online site automatically; clearing site data may delete it.'),
('Connection or apply problems','Adapter in use by another app: exit the desktop app from its tray icon and disconnect other tabs. Cancelled selection: connect again. Disconnected adapter: reconnect and read again. Settings conflict: refresh before editing. If the adapter does not respond or only some changes are applied, reconnect and check actual values - do not assume every change was applied or rolled back.'),
('Scope and beta status','Trigger Lab, remapping, custom chords, controller mode switching and system audio capture are not implemented. The adapter software stays unchanged. Connection, color, classic rumble and profile restoration were checked on the user’s adapter; full audio, wake and cross-browser acceptance tests remain open.'),
])]
}
setup=json.loads((ROOT/'src/locales/setup-guide.json').read_text(encoding='utf-8'))
for lang,pages in content.items():
 pages.insert(0,(setup[lang]['buttons']['title'],setup[lang]['buttons']['sections']))
 pages.insert(0,(setup[lang]['title'],setup[lang]['sections']))
 def footer(c,doc):
  c.setStrokeColor(HexColor('#d9e2ef'));c.line(45,44,550,44)
  c.setFont('Guide',8);c.setFillColor(HexColor('#63748b'))
  c.drawString(45,29,'DongleSense | 31.10.2026 | '+lang.upper())
  c.drawRightString(550,29,str(doc.page))
 story=[]
 for n,(title,sections) in enumerate(pages):
  if n:story.append(PageBreak())
  story.append(Paragraph('DongleSense' if n==0 else title,styles['title']))
  story.append(Paragraph(('Instrukcja obsługi / PL' if lang=='pl' else 'User guide / EN')+' - '+title if n==0 else ('Konfigurator USB / wersja beta' if lang=='pl' else 'USB configurator / beta'),styles['sub']))
  if n==0:story.append(Paragraph(f'<link href="{URL}" color="#2260a8">{URL}</link>',styles['p']))
  for heading,body in sections:
   story.extend([Paragraph(heading,styles['h']),Paragraph(body,styles['p'])])
 target=ROOT/f'public/assets/donglesense-guide-{lang}.pdf'
 SimpleDocTemplate(str(target),pagesize=(595.28,841.89),rightMargin=45,leftMargin=45,topMargin=40,bottomMargin=60,title='DongleSense - '+('Instrukcja obsługi' if lang=='pl' else 'User guide'),author='DongleSense').build(story,onFirstPage=footer,onLaterPages=footer)
 print(target)
