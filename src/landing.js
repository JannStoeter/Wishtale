import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/schibsted-grotesk/index.css';
import './styles/main.css';
import { initContent } from './cms/content.js';
import { illustration } from './lib/art.js';

document.querySelectorAll('.art[data-kind]').forEach(el=>el.insertAdjacentHTML('afterbegin',illustration(el.dataset.kind)));

/* Klebender Knopf am Handy: erscheint, sobald der Knopf im Einstieg aus dem Bild ist, und verschwindet beim Abschluss-Knopf. */
(function(){
  const bar=document.getElementById('stickycta'),hero=document.querySelector('.herocta'),end=document.querySelector('.lp-end');
  if(!bar||!hero||!('IntersectionObserver' in window))return;
  let heroOut=false,endIn=false;
  const upd=()=>{const on=heroOut&&!endIn;bar.classList.toggle('show',on);bar.setAttribute('aria-hidden',on?'false':'true');bar.querySelector('a').tabIndex=on?0:-1};
  new IntersectionObserver(es=>{heroOut=!es[0].isIntersecting&&es[0].boundingClientRect.top<0;upd()}).observe(hero);
  if(end)new IntersectionObserver(es=>{endIn=es[0].isIntersecting;upd()}).observe(end);
})();

/* Geschichte: Schritt für Schritt einblenden, sobald er sichtbar wird. Ohne JavaScript bleibt alles sichtbar. */
document.documentElement.classList.add('js');
/* Saisonale Abschnitte (data-until) verschwinden nach ihrem Datum von selbst. */
document.querySelectorAll('[data-until]').forEach(el=>{if(Date.now()>Date.parse(el.dataset.until))el.hidden=true});
document.querySelectorAll('.tstep').forEach(step=>step.querySelectorAll('.chip,.mini').forEach((el,i)=>el.style.setProperty('--i',i)));
const steps=document.querySelectorAll('.tstep');
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.35,rootMargin:'0px 0px -8% 0px'});
  steps.forEach(s=>io.observe(s));
}else steps.forEach(s=>s.classList.add('in'));

/* Rubriken: Ein Sprung auf einen Anker (#weihnachten, #kinder, #fragen …) klappt die passende Rubrik auf. */
const openTarget=()=>{const id=decodeURIComponent(location.hash.slice(1));if(!id)return;let el;try{el=document.getElementById(id)}catch{return}if(!el)return;const d=el.closest('details');if(d&&!d.hidden){d.open=true;requestAnimationFrame(()=>el.scrollIntoView({block:'start'}))}};
addEventListener('hashchange',openTarget);openTarget();

/* Texte aus der Datenbank, und der Einstieg in den Bearbeitungsmodus (wird erst bei Bedarf geladen). */
initContent();
const openCms=async e=>{e?.preventDefault();const m=await import('./cms/editor.js');m.openEditor()};
document.getElementById('cms-open')?.addEventListener('click',openCms);
if(location.search.includes('bearbeiten'))openCms();

/* Aktion aus dem CMS als schmaler Hinweis oben auf der Seite (nur wenn eine läuft). */
import('./lib/promo.js').then(async({loadPromo,safeUrl})=>{
  const {campaigns}=await loadPromo();
  const c=campaigns.find(x=>(x.placement||[]).includes('landing'));
  if(!c||!(c.headline||c.title))return;
  const bar=document.createElement('div');bar.className='promobar';bar.setAttribute('role','region');bar.setAttribute('aria-label','Aktion');
  const t=document.createElement('span');t.textContent=c.headline||c.title;bar.appendChild(t);
  if(c.cta_label&&c.cta_url){const a=document.createElement('a');a.href=safeUrl(c.cta_url);a.textContent=c.cta_label;bar.appendChild(a)}
  document.body.insertBefore(bar,document.querySelector('.skip')?.nextSibling||document.body.firstChild);
}).catch(()=>{});

/* Statistik: Aufruf der Seite und Klicks auf die Knöpfe zur App. UTM-Kürzel aus der Adresse reisen in den Links zur App mit, damit neue Konten einer Aktion zugeordnet werden können. */
import('./lib/track.js').then(({track,utmFromUrl})=>{
  track('view',{once:true});
  const u=utmFromUrl(),qs=new URLSearchParams();
  for(const k of Object.keys(u))qs.set('utm_'+k,u[k]);
  document.querySelectorAll('a[href^="app/"]').forEach(a=>{
    if([...qs].length){const [path,hash='']=a.getAttribute('href').split('#');a.setAttribute('href',path+(path.includes('?')?'&':'?')+qs.toString()+(hash?'#'+hash:''))}
    a.addEventListener('click',()=>track('cta',{label:(a.closest('header')?'kopfzeile':a.closest('.lp-hero')?'start':a.closest('section')?.id||'seite')+':'+(a.getAttribute('href').split('#')[1]||'app')}));
  });
}).catch(()=>{});
