import guideContent from '../../docs/guide-content.json';
import {Download,Usb,Gamepad2,MousePointerClick,Lightbulb,LifeBuoy} from 'lucide-react';
export default function Guide({english}:{english:boolean}){
 const content=guideContent[english?'en':'pl'];
 const icons=[Usb,Gamepad2,MousePointerClick,Lightbulb,Usb,LifeBuoy];
 return <><div className="page-heading"><div><p className="eyebrow">SUPPORT / 01</p><h1>{english?'Get ready to play':'Zacznij grać'}</h1><p>{english?'A short guide to your adapter.':'Krótka instrukcja Twojego adaptera.'}</p></div><a className="button secondary" href={`${import.meta.env.BASE_URL}assets/guide-${english?'en':'pl'}.pdf`} download><Download size={17}/>{english?'Download PDF':'Pobierz PDF'}</a></div><div className="guide-grid">{content.map(([title,body],i)=>{const Icon=icons[i];return <article className="card guide-card" key={title}><Icon className="accent" size={22}/><h2>{title}</h2><p>{body}</p></article>;})}</div></>;
}
