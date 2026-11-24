import '@fontsource/instrument-serif/400.css';
import '@fontsource-variable/schibsted-grotesk/index.css';
import './styles/main.css';

/* Ratgeberseiten (Dev 115): Aufruf und Klicks zur App zählen wie auf der Startseite, UTM-Kürzel reisen in den Links zur App mit. */
import('./lib/track.js').then(({track,utmFromUrl})=>{
  track('view',{once:true});
  const u=utmFromUrl(),qs=new URLSearchParams();
  for(const k of Object.keys(u))qs.set('utm_'+k,u[k]);
  document.querySelectorAll('a[href^="/app/"]').forEach(a=>{
    if([...qs].length){const [path,hash='']=a.getAttribute('href').split('#');a.setAttribute('href',path+(path.includes('?')?'&':'?')+qs.toString()+(hash?'#'+hash:''))}
    a.addEventListener('click',()=>track('cta',{label:'ratgeber:'+(a.closest('header')?'kopfzeile':'seite')+':'+(a.getAttribute('href').split('#')[1]||'app')}));
  });
}).catch(()=>{});
