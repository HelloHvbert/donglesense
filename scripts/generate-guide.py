"""Generate the two bundled PDF guides. Requires reportlab and a Unicode TTF font."""
from pathlib import Path
import json, os
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
font = Path(os.environ.get('GUIDE_FONT', 'C:/Windows/Fonts/arial.ttf'))
bold = Path(os.environ.get('GUIDE_FONT_BOLD', 'C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFont(TTFont('Guide', str(font)))
pdfmetrics.registerFont(TTFont('GuideBold', str(bold)))
styles = {
 'title': ParagraphStyle('title',fontName='GuideBold',fontSize=26,leading=31,textColor=HexColor('#152947'),spaceAfter=13),
 'sub': ParagraphStyle('sub',fontName='Guide',fontSize=10,leading=15,textColor=HexColor('#60738d'),spaceAfter=24),
 'h': ParagraphStyle('h',fontName='GuideBold',fontSize=13,leading=18,textColor=HexColor('#2260a8'),spaceBefore=15,spaceAfter=7),
 'p': ParagraphStyle('p',fontName='Guide',fontSize=10,leading=15,textColor=HexColor('#26364b'),spaceAfter=7),
 'small': ParagraphStyle('small',fontName='Guide',fontSize=8,leading=12,textColor=HexColor('#5a6a80'),spaceAfter=7),
}
content=json.loads((ROOT/'docs/guide-content.json').read_text(encoding='utf8'))
for lang in ['pl','en']:
 en=lang=='en'
 def footer(c,doc):
  c.setStrokeColor(HexColor('#d9e2ef'));c.line(45,43,550,43)
  c.setFont('Guide',8);c.setFillColor(HexColor('#667994'))
  c.drawString(45,29,'DualSense Wireless Adapter | v0.7.2-hotfix')
  c.drawRightString(550,29,str(doc.page))
 target=ROOT/f'public/assets/guide-{lang}.pdf'
 doc=SimpleDocTemplate(str(target),pagesize=(595.28,841.89),rightMargin=45,leftMargin=45,topMargin=42,bottomMargin=58,title='DualSense Wireless Adapter - '+('User guide' if en else 'Instrukcja'),author='DualSense Wireless Adapter')
 story=[Paragraph('DualSense<br/>Wireless Adapter',styles['title']),Paragraph('USER GUIDE / EN' if en else 'INSTRUKCJA OBSŁUGI / PL',styles['sub'])]
 for i,(title,body) in enumerate(content[lang]):
  if i==4:
   story.extend([PageBreak(),Paragraph('Settings & information' if en else 'Ustawienia i informacje',styles['title'])])
  story.extend([Paragraph(f'{i+1:02d} / {escape(title)}',styles['h']),Paragraph(escape(body),styles['p'])])
 story.append(Paragraph('Licenses and product information' if en else 'Licencje i informacje o produkcie',styles['h']))
 legal=('Independent product, not affiliated with or authorized by Sony Interactive Entertainment. DualSense and PlayStation are trademarks of their owners. The panel uses its own interface and protocol implementation. Firmware is not included with the web panel.' if en else 'Niezależny produkt, bez powiązania lub autoryzacji Sony Interactive Entertainment. DualSense i PlayStation są znakami ich właścicieli. Panel ma własny interfejs i implementację protokołu. Firmware nie jest dołączone do panelu webowego.')
 story.append(Paragraph(escape(legal),styles['small']))
 licenses=('DS5Dongle: MIT, copyright awalol (2026); audio.cpp: MPL-2.0. Firmware dependencies have separate terms, including WDL, Opus, Pico SDK, TinyUSB, BTstack and libcyw43. Raspberry Pi supplemental commercial licensing depends on the hardware. The exact firmware build and product hardware must be checked before commercial distribution.' if en else 'DS5Dongle: MIT, copyright awalol (2026); audio.cpp: MPL-2.0. Zależności firmware mają osobne warunki: WDL, Opus, Pico SDK, TinyUSB, BTstack i libcyw43. Dodatkowe licencje komercyjne Raspberry Pi zależą od sprzętu. Przed dystrybucją komercyjną należy sprawdzić konkretny build firmware i hardware produktu.')
 story.append(Paragraph(escape(licenses),styles['small']))
 story.append(Paragraph('React, React DOM, Vite, Tailwind CSS, Vitest: MIT. TypeScript: Apache-2.0. Lucide: ISC; Feather-derived icons: MIT. '+('Full installed-package notices are available under About & licenses in the panel and in THIRD_PARTY_NOTICES.md.' if en else 'Pełne teksty licencji zainstalowanych bibliotek są dostępne w zakładce Informacje i licencje oraz w THIRD_PARTY_NOTICES.md.'),styles['small']))
 for label,url in [('DS5Dongle source','https://github.com/awalol/DS5Dongle/tree/c3308aeaa653ea88c7baee1c963fb6511db0ebbb'),('MPL 2.0','https://www.mozilla.org/MPL/2.0/'),('BTstack supplemental license','https://github.com/raspberrypi/pico-sdk/blob/2.2.0/src/rp2_common/pico_btstack/LICENSE.RP')]:
  story.append(Paragraph(f'<link href="{url}" color="#2260a8">{label}</link>',styles['small']))
 story.append(Paragraph('Profile based on source analysis; physical adapter acceptance testing is required.' if en else 'Profil oparty na analizie kodu; wymagane testy odbiorcze na fizycznym adapterze.',styles['small']))
 doc.build(story,onFirstPage=footer,onLaterPages=footer)
 print(target)
