/* Kleine Helfer ohne Abhängigkeiten. */
export const $=(s,r=document)=>r.querySelector(s);
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const norm=s=>String(s).toLowerCase().replace(/ß/g,'ss');
export const kwOf=t=>norm(t).split(/[^a-zäöüss0-9]+/).filter(w=>w.length>=4);
export const same=(a,b)=>{a=norm(a);b=norm(b);return a===b||a.endsWith(b)||b.endsWith(a)};
export const overlap=(A,B)=>A.some(x=>B.some(y=>same(x,y)));
export const ICON={
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 gift:'<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-3 0-5-1-5-3s3-2 5 3c2-5 5-5 5-3s-2 3-5 3"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
 spark:'<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>',
 bag:'<path d="M5 8h14l1 12H4z"/><path d="M9 8V6a3 3 0 016 0v2"/>'
};
export const ic=(n,c='')=>`<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
export const money=n=>n.toLocaleString('de-DE')+' €';

export const nid=()=>crypto.randomUUID();

let toastT;
export function toast(msg,action){
  document.querySelectorAll('.toast').forEach(e=>e.remove());
  const d=document.createElement('div');
  d.className='toast';d.setAttribute('role','status');d.textContent=msg;
  if(action){const b=document.createElement('button');b.type='button';b.className='toast-act';b.textContent=action.label;b.onclick=()=>{d.remove();action.run()};d.appendChild(b)}
  document.body.appendChild(d);
  clearTimeout(toastT);toastT=setTimeout(()=>d.remove(),action?6500:3400);
}

/** Genitiv eines Vornamens: "Lena" -> "Lenas", "Jonas" -> "Jonas’". */
export const gen=n=>/[sßxz]$/i.test(String(n))?n+'’':n+'s';
