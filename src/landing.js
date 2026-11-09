import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/schibsted-grotesk/index.css';
import './styles/main.css';
import { initContent } from './cms/content.js';
import { illustration } from './lib/art.js';

document.querySelectorAll('.art[data-kind]').forEach(el=>el.insertAdjacentHTML('afterbegin',illustration(el.dataset.kind)));

/* Vorführung im Einstieg: vier Ansichten, wechselt von selbst, lässt sich anhalten und per Tab wählen. */
(function(){
  const stage=document.getElementById('stage');if(!stage)return;
  const scenes=[...stage.querySelectorAll('.vs')],tabs=[...stage.querySelectorAll('.stab')],typed=document.getElementById('typed'),live=document.getElementById('slive'),pause=document.getElementById('spause');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur=0,timer=null,typer=null,paused=reduce,visible=true;
  const full=typed?typed.dataset.full:'';
  const type=()=>{if(!typed)return;clearInterval(typer);if(reduce){typed.textContent=full;return}typed.textContent='';let n=0;typer=setInterval(()=>{n++;typed.textContent=full.slice(0,n);if(n>=full.length)clearInterval(typer)},55)};
  const show=(i,announce)=>{cur=(i+scenes.length)%scenes.length;scenes.forEach((s,k)=>s.classList.toggle('on',k===cur));tabs.forEach((t,k)=>{t.classList.toggle('on',k===cur);t.setAttribute('aria-pressed',k===cur)});if(cur===0)type();if(announce&&live)live.textContent=scenes[cur].dataset.label};
  const stop=()=>{clearInterval(timer);timer=null};
  const start=()=>{stop();if(paused||!visible||reduce)return;timer=setInterval(()=>show(cur+1),cur===0?6500:5500)};
  const restart=()=>{stop();start()};
  tabs.forEach(t=>t.addEventListener('click',()=>{show(+t.dataset.i,true);restart()}));
  if(pause){pause.textContent=reduce?'Abspielen':'Anhalten';pause.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'Abspielen':'Anhalten';pause.setAttribute('aria-label',paused?'Vorführung abspielen':'Vorführung anhalten');if(paused)stop();else{show(cur+1,true);start()}})}
  stage.addEventListener('focusin',()=>stop());stage.addEventListener('focusout',()=>start());
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;visible?start():stop()},{threshold:.2}).observe(stage);
  type();start();
})();

/* Geschichte: Schritt für Schritt einblenden, sobald er sichtbar wird. Ohne JavaScript bleibt alles sichtbar. */
document.documentElement.classList.add('js');
document.querySelectorAll('.tstep').forEach(step=>step.querySelectorAll('.chip,.mini').forEach((el,i)=>el.style.setProperty('--i',i)));
const steps=document.querySelectorAll('.tstep');
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.35,rootMargin:'0px 0px -8% 0px'});
  steps.forEach(s=>io.observe(s));
}else steps.forEach(s=>s.classList.add('in'));

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
    a.addEventListener('click',()=>track('cta',{label:(a.closest('header')?'kopfzeile':a.closest('.hero')?'start':a.closest('section')?.id||'seite')+':'+(a.getAttribute('href').split('#')[1]||'app')}));
  });
}).catch(()=>{});
