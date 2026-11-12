import { livePRODUCTS } from './lib/catalog.js';
import { fits } from './lib/fit.js';
import { weightOf } from './lib/weights.js';
import { esc, norm, kwOf, same, overlap, money, gen } from './lib/util.js';
import { S } from './state.js';
import { ACT, CATALOG, cat, occL } from './data/content.js';
import { isKid } from './lib/age.js';

export const tagsOf=p=>p.interests.map(l=>ACT.find(a=>a.l===l)?.t).filter(Boolean);
export const ownedOf=p=>p.wishes.filter(w=>w.status==='selbst');
export function excluded(p,item){
  if(isKid(p)&&item.c&&item.c!=='spielen'&&!item.kid)return 'Nicht altersgerecht.'; // Kind-Konten: nur Kinder-Ideen aus dem Katalog
  const known=[];
  p.wishes.filter(w=>w.vis!=='privat').forEach(w=>known.push({k:w.kw,why:w.status==='selbst'?`${p.name} hat das schon (${w.t}).`:`Steht schon auf ${gen(p.name)} Liste (${w.t}).`}));
  (p.gifts||p.history||[]).forEach(g=>known.push({k:g.kw||[],why:`${p.name} hat das schon bekommen.`}));
  (p.hidden||[]).forEach(h=>known.push({k:h.kw||[],why:`Dafür hat ${p.name} schon gesorgt.`}));
  const hit=known.find(x=>overlap(item.kw,x.k));
  if(hit) return hit.why;
  if(p.nogos.some(n=>overlap(item.kw,kwOf(n)))) return `${p.name} möchte das nicht geschenkt bekommen.`;
  return null;
}
export function recommend(p){
  const tags=tagsOf(p),owned=ownedOf(p),good=[],skip=[];
  CATALOG.forEach(it=>{
    const ex=excluded(p,it);
    if(ex){skip.push({it,why:ex});return}
    let sc=0;const why=[];
    const comp=it.comp&&owned.find(o=>o.kw.some(k=>same(k,it.comp)));
    if(comp){sc+=4;why.push(`${p.name} besitzt bereits <b>${esc(comp.t)}</b>. Das hier ergänzt es.`)}
    const mt=it.tags.filter(t=>tags.includes(t));
    if(mt.length){sc+=2*mt.length;const labels=p.interests.filter(l=>mt.includes(ACT.find(a=>a.l===l)?.t));why.push(`${p.name} interessiert sich für <b>${labels.map(esc).join(' und ')}</b>.`)}
    if(it.tr&&p.tries.some(t=>norm(t).includes(norm(it.tr)))){sc+=3;why.push(`${p.name} möchte <b>${esc(it.tr)}</b> gern einmal ausprobieren.`)}
    if(it.brand&&p.brands.includes(it.brand)){sc+=2;why.push(`Lieblingsmarke: <b>${esc(it.brand)}</b>.`)}
    if(p.cats.includes(it.c)){sc+=1;if(!why.length)why.push(`Passt zu ${gen(p.name)} Welt <b>${esc(cat(it.c).n)}</b>.`)}
    const oc=S.ui.occ;
    if(oc!=='none'&&sc>0){if(it.occ.includes(oc)){sc+=2;why.push(`Passt zu <b>${occL(oc)}</b>.`)}else sc-=1}
    const wt=weightOf(it.c);
    if(sc>0&&wt>0) good.push({it,sc:sc*wt,why});
  });
  good.sort((a,b)=>b.sc-a.sc);
  return {good,skip};
}
export function picks(p,w){
  const b=w.budget||1e9,all=livePRODUCTS().filter(x=>w.kw.some(k=>same(k,x.cat))&&fits(w,x)),inb=all.filter(x=>(x.price??x.est)<=b);
  const list=inb.map(x=>{let sc=x.q*2;const why=[];
    if(p.brands.includes(x.brand)){sc+=4;why.push(`${esc(x.brand)} gehört zu ${esc(gen(p.name))} Lieblingsmarken.`)}
    why.push(w.budget?`Das sollte nach unserer Einschätzung gut ins Budget bis ${money(w.budget)} passen. Den genauen Preis siehst du bei Amazon.`:'Den genauen Preis siehst du bei Amazon.');
    return {x,sc,why}}).sort((a,b)=>b.sc-a.sc);
  return {list,over:all.length-inb.length};
}
export function check(p,text){
  const toks=kwOf(text);const res=[];
  const m=(kws,pre)=>toks.some(t=>kws.some(k=>{k=norm(k);return t===k||t.endsWith(k)||(t.length>=4&&k.endsWith(t))||(pre&&t.startsWith(k))}));
  p.wishes.filter(w=>w.vis!=='privat').forEach(w=>{if(m(w.kw))res.push(w.status==='selbst'?{type:'have',w}:{type:'wish',w})});
  p.gifts.forEach(g=>{if(m(g.kw))res.push({type:'given',g})});
  p.nogos.forEach(n=>{if(m(kwOf(n)))res.push({type:'nogo',n})});
  const fits=p.interests.filter(l=>m(kwOf(l),true));
  const c=CATALOG.find(i=>m(i.kw));
  const ctags=c?c.tags:[];
  const hitTags=ctags.filter(t=>tagsOf(p).includes(t));
  return {res,fits,ctags,hitTags,text};
}
