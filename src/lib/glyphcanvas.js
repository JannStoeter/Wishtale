/* Symbole aus wishicon.js auf einem Canvas zeichnen (Instagram-Studio und Story-Bild, Dev 140). */
import { GLYPH } from './wishicon.js';

/* ---------- Symbole aus wishicon.js als Path2D ---------- */
const glyphCache = new Map();
export function glyphPaths(name) {
  if (glyphCache.has(name)) return glyphCache.get(name);
  const svg = GLYPH[name] || GLYPH.gift, out = [];
  const num = (a, k) => { const m = a.match(new RegExp(`\\b${k}="([-\\d.]+)"`)); return m ? +m[1] : 0; };
  for (const [, tag, a] of svg.matchAll(/<(path|rect|circle|ellipse)([^>]*)\/>/g)) {
    const p = new Path2D(), sw = num(a, 'stroke-width') || 0;
    if (tag === 'path') p.addPath(new Path2D((a.match(/\bd="([^"]+)"/) || [])[1] || ''));
    else if (tag === 'rect') p.roundRect(num(a, 'x'), num(a, 'y'), num(a, 'width'), num(a, 'height'), num(a, 'rx'));
    else if (tag === 'circle') p.arc(num(a, 'cx'), num(a, 'cy'), num(a, 'r'), 0, Math.PI * 2);
    else { const rot = a.match(/rotate\(([-\d.]+)/); p.ellipse(num(a, 'cx'), num(a, 'cy'), num(a, 'rx'), num(a, 'ry'), rot ? +rot[1] * Math.PI / 180 : 0, 0, Math.PI * 2); }
    out.push({ p, sw });
  }
  glyphCache.set(name, out); return out;
}
export function glyph(ctx, name, x, y, size, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const { p, sw } of glyphPaths(name)) { ctx.lineWidth = sw || 1.6; ctx.stroke(p); }
  ctx.restore();
}

