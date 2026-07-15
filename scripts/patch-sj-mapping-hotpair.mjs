#!/usr/bin/env node
/**
 * Unify SJ-21~24 mapping volumes with SJ-20 difference-gate UX:
 * click rail/SVG row → scroll + .is-hot-pair highlight on §03 article.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const HOT_PAIR_CSS = `
.{PREFIX}-pair article.is-hot-pair{border-color:var(--sj-vermil);box-shadow:0 0 0 1px var(--sj-vermil),0 8px 24px rgba(0,0,0,.35)}
.{PREFIX}-pair article.is-hot-pair .col.same{background:color-mix(in srgb,var(--sj-celadon) 12%,var(--sj-ink-900))}
.{PREFIX}-pair article.is-hot-pair .col.diff{background:color-mix(in srgb,var(--sj-ochre) 12%,var(--sj-ink-900))}`;

const PICK_PATCH = `  function highlightPair(id){
    document.querySelectorAll('.{PREFIX}-pair article').forEach(a=>a.classList.remove('is-hot-pair'));
    const el=document.getElementById('pair-'+id);
    if(el){ el.classList.add('is-hot-pair'); el.scrollIntoView({behavior:'smooth',block:'center'}); }
  }
  function pick(id){ if(!MAP_DATA[id]) return; clearVisual(); stage.classList.add('is-picking');
    rows.forEach(r=>r.classList.toggle('is-hot', r.dataset.id===id)); showAside(id); highlightPair(id); }`;

const RAIL_TOC_PATCH = `
  document.querySelectorAll('.sj-rail-toc a[href^="#pair-"]').forEach(a=>{
    a.addEventListener('click',e=>{ const id=a.getAttribute('href').slice(6); if(MAP_DATA[id]){ e.preventDefault(); pick(id); }});
  });`;

for (const num of ['21', '22', '23', '24']) {
  const prefix = `sj-${num}`;
  const path = join(OUT, `SJ-${num}.html`);
  let html = readFileSync(path, 'utf8');

  const cssBlock = HOT_PAIR_CSS.replaceAll('{PREFIX}', prefix);
  if (!html.includes('is-hot-pair')) {
    html = html.replace(
      new RegExp(`(\\.${prefix.replace('-', '\\-')}-pair \\.col p[^}]+\\})`),
      `$1${cssBlock}`,
    );
  }

  if (!html.includes('function highlightPair')) {
    html = html.replace(
      /function pick\(id\)\{ if\(!MAP_DATA\[id\]\) return; clearVisual\(\); stage\.classList\.add\('is-picking'\);\s*rows\.forEach\(r=>r\.classList\.toggle\('is-hot', r\.dataset\.id===id\)\); showAside\(id\); \}/,
      PICK_PATCH.replaceAll('{PREFIX}', prefix),
    );
  }

  if (!html.includes('href^="#pair-"')) {
    html = html.replace(
      /rows\.forEach\(r=>\{ const act=\(\)=>pick\(r\.dataset\.id\); r\.addEventListener\('click',act\);\s*r\.addEventListener\('keydown',e=>\{ if\(e\.key==='Enter'\|\|e\.key===' '\)\{ e\.preventDefault\(\); act\(\); \} \}\); \}\);\s*\}\)\(\);/,
      `rows.forEach(r=>{ const act=()=>pick(r.dataset.id); r.addEventListener('click',act);
    r.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); act(); } }); });${RAIL_TOC_PATCH}
})();`,
    );
  }

  writeFileSync(path, html, 'utf8');
  console.log(`Patched SJ-${num}.html · difference-gate hot-pair`);
}

console.log('Done: SJ-21~24 mapping hot-pair');
