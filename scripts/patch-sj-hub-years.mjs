#!/usr/bin/env node
/** Backfill data-year + yr-badge on all SJ-00 Hub case cards */
import fs from 'node:fs';
import path from 'node:path';

const HUB = path.resolve(import.meta.dirname, '../app/public/shijian/SJ-00.html');
const yearsSrc = fs.readFileSync(
  path.resolve(import.meta.dirname, '../app/src/lib/shijian/caseYears.js'),
  'utf8',
);

const yearMap = {};
for (const block of [yearsSrc.match(/SHIJIAN_CASE_EVENT_YEARS = \{([\s\S]*?)\};/), yearsSrc.match(/SYNTHESIS_EVENT_YEARS = \{([\s\S]*?)\};/)]) {
  if (!block) continue;
  for (const m of block[1].matchAll(/shijianSJ(\d+):\s*(-?\d+)/g)) {
    yearMap[`SJ-${m[1]}`] = Number(m[2]);
  }
}

function badge(y) {
  return y < 0 ? `前${Math.abs(y)}` : String(y);
}

let html = fs.readFileSync(HUB, 'utf8');
const gridRe = /(<div class="sj-00-case-grid" id="sj-case-grid">)([\s\S]*?)(<\/div>\s*<\/section>)/;
const gridMatch = html.match(gridRe);
if (!gridMatch) throw new Error('case grid not found');

let grid = gridMatch[2];
const articleRe = /<article class="sj-00-case-card"([^>]*)>([\s\S]*?)<\/article>/g;
grid = grid.replace(articleRe, (full, attrs, body) => {
  const sj = body.match(/<span class="sj-num">(SJ-\d+)<\/span>/);
  if (!sj) return full;
  const y = yearMap[sj[1]];
  if (y == null) return full;
  let newAttrs = attrs;
  if (!newAttrs.includes('data-year')) {
    newAttrs += ` data-year="${y}"`;
  } else {
    newAttrs = newAttrs.replace(/data-year="[^"]*"/, `data-year="${y}"`);
  }
  if (!body.includes('yr-badge')) {
    body = body.replace(
      /(<span class="dyn">[^<]+<\/span>)/,
      `$1<span class="yr-badge">${badge(y)}</span>`,
    );
  }
  return `<article class="sj-00-case-card"${newAttrs}>${body}</article>`;
});

html = html.replace(gridRe, `$1${grid}$3`);

if (!html.includes('.yr-badge')) {
  html = html.replace(
    '.sj-00-case-card .top .dyn{color:var(--sj-celadon);font-size:11px}',
    `.sj-00-case-card .top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.sj-00-case-card .top .dyn{color:var(--sj-celadon);font-size:11px}
.sj-00-case-card .top .yr-badge{font-family:var(--sj-mono);font-size:10px;color:var(--sj-ochre);border:1px solid var(--sj-line);padding:1px 6px;border-radius:4px;margin-left:auto}`,
  );
}

fs.writeFileSync(HUB, html);
console.log('Backfilled data-year on', Object.keys(yearMap).length, 'case entries');
