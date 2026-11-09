import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { photoUrl } from './src/data/photos.js';
import legal from './legal.config.mjs';

/* Ersetzt {{photo:<key>:<breite>}} in den HTML-Seiten durch die Foto-URL aus dem Manifest. */
const photoPlaceholders = () => ({
  name: 'wishtale-photo-placeholders',
  transformIndexHtml: html =>
    html.replace(/\{\{photo:([\w:-]+?):(\d+)\}\}/g, (_, key, w) => photoUrl(key, +w) ?? ''),
});

/* Ersetzt {{legal:<feld>}} in den Rechtsseiten durch die Angaben aus legal.config.mjs. Fehlende Angaben werden markiert. */
const missing = new Set();
const legalPlaceholders = () => ({
  name: 'wishtale-legal-placeholders',
  transformIndexHtml: html =>
    html
      // <!--if:feld-->…<!--/if--> bleibt nur stehen, wenn das Feld in legal.config.mjs ausgefüllt ist
      .replace(/<!--if:(\w+)-->([\s\S]*?)<!--\/if-->/g, (_, key, inner) => ((legal[key] || '').trim() ? inner : ''))
      .replace(/\{\{legal:(\w+)\}\}/g, (_, key) => {
      const v = (legal[key] || '').trim();
      if (v) return v.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      missing.add(key);
      return `<mark class="todo">[${key} fehlt]</mark>`;
    }),
  closeBundle() {
    const need = [...missing].filter(k => !['phone', 'vatId'].includes(k));
    if (need.length) console.warn(`\n⚠ Rechtsseiten unvollständig, bitte in legal.config.mjs ergänzen: ${need.join(', ')}\n`);
  },
});

export default defineConfig({
  base: './',
  plugins: [photoPlaceholders(), legalPlaceholders()],
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'index.html'), app: resolve(__dirname, 'app/index.html'), dev: resolve(__dirname, 'dev/index.html'),
        impressum: resolve(__dirname, 'impressum.html'), datenschutz: resolve(__dirname, 'datenschutz.html'), barrierefreiheit: resolve(__dirname, 'barrierefreiheit.html'),
        cms: resolve(__dirname, 'cms/index.html'),
      },
    },
  },
});
