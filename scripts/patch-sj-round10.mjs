#!/usr/bin/env node
/**
 * Round 10 · 文案/矩阵/UX ONLY
 * ⚠️ §02 结构切片隔离：不碰 id="f2" / id="stage" / NODE_DATA / SLICE_RAIL / sec-map SVG
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  ROUND10_T1_PLUS,
  ROUND10_MAPPING,
  ROUND10_MATRIX,
  ROUND10_SJ24,
  ROUND10_FOOTER_CHIPS,
  ROUND10_T1_PLUS_IDS,
} from './data/sj-round10-deepen.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const T1_TARGETS = Object.keys(ROUND10_T1_PLUS);
const MAP_TARGETS = Object.keys(ROUND10_MAPPING);
const MATRIX_TARGETS = Object.keys(ROUND10_MATRIX);

function getCls(num, html) {
  const m = html.match(new RegExp(`\\.sj-${num}-prose`));
  return m ? m[0].slice(1).replace('-prose', '') : `sj-${num}`;
}

function extractF2(html) {
  const m = html.match(/<section class="sj-ledger-field" id="f2"[\s\S]*?<\/section>/);
  return m ? m[0] : '';
}

function extractSecMap(html) {
  const m = html.match(/<section class="sj-\d+-sec" id="sec-map"[\s\S]*?<\/section>/);
  return m ? m[0] : '';
}

function assertF2Unchanged(before, after, num) {
  const b = extractF2(before);
  const a = extractF2(after);
  if (b && a && b !== a) {
    throw new Error(`SJ-${num}: §02 结构切片被意外修改 — Round 10 禁止`);
  }
}

function assertSecMapUnchanged(before, after, num) {
  const b = extractSecMap(before);
  const a = extractSecMap(after);
  if (b && a && b !== a) {
    throw new Error(`SJ-${num}: §02 签名映射盘被意外修改 — Round 10 禁止`);
  }
}

function injectMechanismExtra(html, cls, extra, round = 10) {
  if (!extra || html.includes(`机制穿透（Round ${round}）`)) return html;
  const block = `\n  <p class="${cls}-prose" style="margin-top:16px;border-left:3px solid var(--sj-ochre);padding-left:14px">${extra}</p>\n`;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="f1"[^>]*>[\\s\\S]*?</div>\\s*</div>\\s*)(</section>)`,
  );
  if (re.test(html)) return html.replace(re, `$1${block}$2`);
  return html;
}

function injectProseBlocks(html, cls, blocks) {
  if (!blocks?.length) return html;
  let out = html;
  for (const { anchor, text } of blocks) {
    if (out.includes(text.slice(0, 24))) continue;
    const re = new RegExp(
      `(<section class="sj-ledger-field" ${anchor}[^>]*>[\\s\\S]*?<div class="sj-ledger-fh">[\\s\\S]*?</div>)`,
    );
    out = out.replace(re, `$1\n  <p class="${cls}-prose" style="margin-top:12px">${text}</p>`);
  }
  return out;
}

function expandForceChain(html, forceChain, marker) {
  let out = html;
  for (const [force, chain] of Object.entries(forceChain || {})) {
    const esc = force.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      `(<tr><td>${esc}[^<]*</td><td class="zheng">[^<]*</td><td class="shi">)([^<]*)(</td></tr>)`,
    );
    out = out.replace(re, (_, pre, shi, post) => {
      if (shi.includes(marker)) return pre + shi + post;
      const merged = shi.trim().endsWith('。') ? `${shi.trim()} ${chain}` : `${shi} ${chain}`;
      return pre + merged + post;
    });
  }
  return out;
}

function addHistorians(html, cls, histExtra) {
  if (!histExtra?.length) return html;
  let out = html;
  for (const h of histExtra) {
    if (out.includes(h.text.slice(0, 20))) continue;
    const article = `\n    <article><div class="who">${h.who}<span>${h.sub}</span></div><p>${h.text}</p></article>`;
    const re = new RegExp(`(<div class="${cls}-hist">[\\s\\S]*?)(</div>\\s*</section>)`);
    out = out.replace(re, `$1${article}$2`);
  }
  return out;
}

function expandMirrorDiff(html, extra, marker) {
  if (!extra || html.includes(marker)) return html;
  return html.replace(
    /(<article class="diff">[\s\S]*?<p>)([^<]*)(<\/p>)/,
    (_, pre, body, post) => {
      if (body.includes(marker)) return pre + body + post;
      const merged = body.trim().endsWith('。') ? `${body.trim()} ${extra}` : `${body} ${extra}`;
      return pre + merged + post;
    },
  );
}

function addVerdictExtras(html, extras) {
  if (!extras?.length) return html;
  const blocks = [];
  for (const item of extras) {
    if (html.includes(item.slice(0, 20))) continue;
    blocks.push(`\n    <article class="open"><div class="vh">未决</div><p>${item}</p></article>`);
  }
  if (!blocks.length) return html;
  const re = new RegExp('(</div>\\s*</section>\\s*<section class="sj-ledger-field" id="f7")');
  return html.replace(re, `${blocks.join('')}$1`);
}

function injectXrefProse(html, cls, extra, round = 10) {
  if (!extra || html.includes(`交叉引用收束（Round ${round}）`)) return html;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="fx"[^>]*>[\\s\\S]*?<div class="sj-ledger-fh">[\\s\\S]*?</div>)`,
  );
  const block = `\n  <p class="${cls}-prose" style="margin-bottom:14px">${extra}</p>`;
  return html.replace(re, `$1${block}`);
}

function injectDeepBlock(html, block, round = 10) {
  if (!block) return html;
  const tag = `Round ${round} 标注`;
  if (html.includes(tag)) return html;
  const re = /(<section class="sj-ledger-field" id="fx"[^>]*>)/;
  if (re.test(html)) return html.replace(re, `${block}\n$1`);
  const re2 = /(<section class="sj-ledger-field" id="f7"[^>]*>[\s\S]*?<\/section>)/;
  return html.replace(re2, `$1\n${block}`);
}

function injectCompareBlock(html, cls, block) {
  if (!block || html.includes(block.slice(0, 24))) return html;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="f4"[^>]*>[\\s\\S]*?</div>\\s*)(</section>\\s*<section class="sj-ledger-field" id="f5")`,
  );
  return html.replace(re, `$1\n  ${block}\n  $2`);
}

function injectFooterNote(html, note) {
  if (!note || html.includes(note.slice(20, 50))) return html;
  return html.replace(/(<footer class="sj-\d+-foot">)/, `${note}\n$1`);
}

function injectFooterChips(html, chips) {
  if (!chips || html.includes('sj-24 误判索引') && html.includes('-xlink')) return html;
  if (html.includes(chips.slice(0, 30))) return html;
  return html.replace(/(<footer class="sj-\d+-foot">)/, `${chips}\n$1`);
}

function injectTierNote(html, cls, note) {
  if (!note || html.includes('Round 10 升维')) return html;
  const re = new RegExp(`(<section class="sj-ledger-field" id="f1"[^>]*>[\\s\\S]*?</section>)`);
  const tag = `\n  <p class="${cls}-prose" style="font-family:var(--sj-mono);font-size:11px;color:var(--sj-ochre);margin-top:8px">${note}</p>\n`;
  return html.replace(re, `$1${tag}`);
}

function injectMappingMeta(html, num, metaExtra) {
  if (!metaExtra || html.includes('Round 10 复核')) return html;
  const re = new RegExp(`(<section class="sj-${num}-sec" id="sec-meta"[^>]*>[\\s\\S]*?</div>\\s*)(</section>)`);
  if (re.test(html)) return html.replace(re, `$1${metaExtra}\n$2`);
  const re2 = new RegExp(`(<section class="sj-${num}-sec" id="sec-meta"[^>]*>[\\s\\S]*?)(</section>)`);
  return html.replace(re2, `$1${metaExtra}\n$2`);
}

function injectPairExtra(html, num, pairExtra) {
  if (!pairExtra?.prose || html.includes(pairExtra.prose.slice(0, 24))) return html;
  const re = new RegExp(
    `(<article id="${pairExtra.id}"[\\s\\S]*?</div>\\s*</div>\\s*)(</article>)`,
  );
  const block = `\n      <p class="sj-${num}-prose" style="margin-top:10px;font-size:12.5px;color:var(--sj-paper-300)">${pairExtra.prose}</p>\n    `;
  return html.replace(re, `$1${block}$2`);
}

function injectMatrixInsight(html, num, insight) {
  if (!insight || html.includes('Round 10 跨成员洞察')) return html;
  const block = `<p class="sj-${num}-prose" style="margin-top:14px;font-style:italic">${insight}</p>`;
  const re = new RegExp(`(<section class="sj-${num}-sec" id="sec-rules"[^>]*>[\\s\\S]*?</section>)`);
  if (re.test(html)) return html.replace(re, `$1\n  ${block}`);
  const re2 = new RegExp(`(<p class="sj-${num}-note">四条规律回指[\\s\\S]*?</p>)`);
  return html.replace(re2, `$1\n  ${block}`);
}

function bumpCaseVersion(html) {
  return html
    .replace(/\bv0\.6\b/g, 'v0.7')
    .replace(/\bv0\.2\b/g, 'v0.7')
    .replace(/AS_OF 2026-07-15 · Round 9/g, 'AS_OF 2026-07-15 · Round 10')
    .replace(/AS_OF 2026-07-15 · Round 8/g, 'AS_OF 2026-07-15 · Round 10')
    .replace(/AS_OF 2026-07-15(?! · Round 10)/g, 'AS_OF 2026-07-15 · Round 10');
}

function bumpMapVersion(html) {
  return html
    .replace(/\bv0\.6\b/g, 'v0.7')
    .replace(/AS_OF 2026-07-15 · Round 9/g, 'AS_OF 2026-07-15 · Round 10')
    .replace(/AS_OF 2026-07-15(?! · Round 10)/g, 'AS_OF 2026-07-15 · Round 10');
}

let count = 0;
const f2Guard = [];

// A · T1+ 续升
for (const num of T1_TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  const before = readFileSync(path, 'utf8');
  let html = before;
  const cls = getCls(num, html);
  const data = ROUND10_T1_PLUS[num];

  html = injectMechanismExtra(html, cls, data.mechanismExtra);
  html = injectTierNote(html, cls, data.tierNote);
  html = expandForceChain(html, data.forceChainR9, '〔R10〕');
  html = addHistorians(html, cls, data.histExtra);
  html = expandMirrorDiff(html, data.mirrorDiffExtraR10, 'Round 10 差异加厚');
  html = injectProseBlocks(html, cls, data.proseBlocks);
  html = addVerdictExtras(html, data.verdictExtra);
  html = injectDeepBlock(html, data.deepBlock);
  html = injectCompareBlock(html, cls, data.compareBlock);
  html = injectFooterNote(html, data.footerNote);
  if (data.footerChips) html = injectFooterChips(html, data.footerChips);
  html = injectXrefProse(html, cls, data.xrefProse);
  html = bumpCaseVersion(html);

  assertF2Unchanged(before, html, num);
  writeFileSync(path, html, 'utf8');
  f2Guard.push(`SJ-${num}`);
  count++;
  console.log(`Round10 T1+ SJ-${num}.html (§02 untouched)`);
}

// B · 映射卷 SJ-20~23
for (const num of MAP_TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  const before = readFileSync(path, 'utf8');
  let html = before;
  const data = ROUND10_MAPPING[num];

  html = injectMappingMeta(html, num, data.metaExtra);
  html = injectPairExtra(html, num, data.pairExtra);
  html = bumpMapVersion(html);

  assertSecMapUnchanged(before, html, num);
  writeFileSync(path, html, 'utf8');
  console.log(`Round10 mapping SJ-${num}.html (sec-map untouched)`);
}

// C · 综合矩阵 SJ-16~19
for (const num of MATRIX_TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  let html = readFileSync(path, 'utf8');
  html = injectMatrixInsight(html, num, ROUND10_MATRIX[num]);
  html = bumpMapVersion(html);
  writeFileSync(path, html, 'utf8');
  console.log(`Round10 matrix SJ-${num}.html`);
}

// E · SJ-24 §03b 三型误判机制
const sj24Path = join(OUT, 'SJ-24.html');
const sj24Before = readFileSync(sj24Path, 'utf8');
let sj24 = sj24Before;
const { mechanismProse } = ROUND10_SJ24;

if (!sj24.includes('Round 10 · 三型误判机制对照')) {
  sj24 = sj24.replace(
    '<section class="sj-24-sec" id="sec-meta"',
    `${mechanismProse}\n\n<section class="sj-24-sec" id="sec-meta"`,
  );
}
sj24 = bumpMapVersion(sj24);
assertSecMapUnchanged(sj24Before, sj24, '24');
writeFileSync(sj24Path, sj24, 'utf8');
console.log('Round10 SJ-24.html (§03b mechanism · sec-map untouched)');

// E · 误判链 footer chips SJ-43/47
for (const num of Object.keys(ROUND10_FOOTER_CHIPS)) {
  const path = join(OUT, `SJ-${num}.html`);
  const before = readFileSync(path, 'utf8');
  let html = before;
  html = injectFooterChips(html, ROUND10_FOOTER_CHIPS[num].chips);
  html = bumpCaseVersion(html);
  assertF2Unchanged(before, html, num);
  writeFileSync(path, html, 'utf8');
  f2Guard.push(`SJ-${num}`);
  console.log(`Round10 footer chips SJ-${num}.html`);
}

// D · Hub SJ-00 T1+ filter + badges
const hubPath = join(OUT, 'SJ-00.html');
let hub = readFileSync(hubPath, 'utf8');

if (!hub.includes('aria-label="T1+ 精选"')) {
  hub = hub.replace(
    `.sj-00-case-card .type{font-family:var(--sj-mono);font-size:9px;color:var(--sj-paper-300);margin-top:8px;letter-spacing:.08em}`,
    `.sj-00-case-card .type{font-family:var(--sj-mono);font-size:9px;color:var(--sj-paper-300);margin-top:8px;letter-spacing:.08em}
.sj-00-case-card .t1-badge{font-family:var(--sj-mono);font-size:9px;color:var(--sj-vermil);border:1px solid var(--sj-vermil);padding:2px 6px;border-radius:4px;margin-left:6px}
.sj-00-case-card[data-tier="t1plus"]{border-left:3px solid var(--sj-vermil)}
.sj-00-case-card .yr-badge{font-family:var(--sj-mono);font-size:9px;color:var(--sj-ochre);border:1px solid var(--sj-line);padding:2px 6px;border-radius:4px}`,
  );

  hub = hub.replace(
    `  <div class="sj-00-case-filter" role="group" aria-label="类型筛选">
    <span class="lbl">类型</span>
    <button type="button" class="sj-00-btn is-on" id="sj-type-all" data-type="">全部</button>
    <button type="button" class="sj-00-btn" data-type="case">单案台账</button>
    <button type="button" class="sj-00-btn" data-type="synthesis">综合矩阵</button>
  </div>`,
    `  <div class="sj-00-case-filter" role="group" aria-label="类型筛选">
    <span class="lbl">类型</span>
    <button type="button" class="sj-00-btn is-on" id="sj-type-all" data-type="">全部</button>
    <button type="button" class="sj-00-btn" data-type="case">单案台账</button>
    <button type="button" class="sj-00-btn" data-type="synthesis">综合矩阵</button>
  </div>
  <div class="sj-00-case-filter" role="group" aria-label="T1+ 精选">
    <span class="lbl">Tier</span>
    <button type="button" class="sj-00-btn is-on" id="sj-tier-all" data-tier="">全部</button>
    <button type="button" class="sj-00-btn" data-tier="t1plus">T1+ 精选</button>
  </div>`,
  );

  for (const id of ROUND10_T1_PLUS_IDS) {
    const re = new RegExp(
      `(<article class="sj-00-case-card"[^>]*data-built="1"[^>]*>\\s*<div class="top"><span class="sj-num">SJ-${id}</span>)`,
    );
    hub = hub.replace(re, (m) => {
      if (m.includes('data-tier')) return m;
      return m.replace(
        '<article class="sj-00-case-card"',
        '<article class="sj-00-case-card" data-tier="t1plus"',
      ).replace(
        `SJ-${id}</span>`,
        `SJ-${id}</span><span class="t1-badge">T1+</span>`,
      );
    });
    // Fix: need to add data-tier to article tag
    hub = hub.replace(
      new RegExp(`(<article class="sj-00-case-card")([^>]*data-built="1"[^>]*>\\s*<div class="top"><span class="sj-num">SJ-${id}</span>)`),
      (full, open, rest) => {
        if (full.includes('data-tier=')) return full;
        const withTier = open + ' data-tier="t1plus"' + rest;
        if (withTier.includes('t1-badge')) return withTier;
        return withTier.replace(
          `SJ-${id}</span>`,
          `SJ-${id}</span><span class="t1-badge">T1+</span>`,
        );
      },
    );
  }

  // Filter JS: add tier filter
  hub = hub.replace(
    `  var dynBtns = Array.from(document.querySelectorAll('.sj-00-case-filter[aria-label="朝代筛选"] .sj-00-btn'));
  var typeBtns = Array.from(document.querySelectorAll('.sj-00-case-filter[aria-label="类型筛选"] .sj-00-btn'));
  var visEl = document.getElementById('sj-stat-visible');
  var dyn = '';
  var type = '';
  function apply(){
    dynBtns.forEach(function(b){
      var isAll = b.id === 'sj-case-all';
      b.classList.toggle('is-on', dyn ? b.dataset.dyn === dyn : isAll);
    });
    typeBtns.forEach(function(b){
      var isAll = b.id === 'sj-type-all';
      b.classList.toggle('is-on', type ? b.dataset.type === type : isAll);
    });
    var vis = 0;
    cards.forEach(function(c){
      var cardType = c.dataset.type || 'case';
      var show = (!dyn || c.dataset.dynasty === dyn) && (!type || cardType === type);
      c.classList.toggle('is-hidden', !show);
      c.classList.toggle('is-hot', !!(dyn || type) && show);
      if(show) vis++;
    });
    if(visEl) visEl.textContent = String(vis);
  }
  dynBtns.forEach(function(b){
    b.addEventListener('click', function(){ dyn = b.dataset.dyn || ''; apply(); });
  });
  typeBtns.forEach(function(b){
    b.addEventListener('click', function(){ type = b.dataset.type || ''; apply(); });
  });`,
    `  var dynBtns = Array.from(document.querySelectorAll('.sj-00-case-filter[aria-label="朝代筛选"] .sj-00-btn'));
  var typeBtns = Array.from(document.querySelectorAll('.sj-00-case-filter[aria-label="类型筛选"] .sj-00-btn'));
  var tierBtns = Array.from(document.querySelectorAll('.sj-00-case-filter[aria-label="T1+ 精选"] .sj-00-btn'));
  var visEl = document.getElementById('sj-stat-visible');
  var dyn = '';
  var type = '';
  var tier = '';
  function apply(){
    dynBtns.forEach(function(b){
      var isAll = b.id === 'sj-case-all';
      b.classList.toggle('is-on', dyn ? b.dataset.dyn === dyn : isAll);
    });
    typeBtns.forEach(function(b){
      var isAll = b.id === 'sj-type-all';
      b.classList.toggle('is-on', type ? b.dataset.type === type : isAll);
    });
    tierBtns.forEach(function(b){
      var isAll = b.id === 'sj-tier-all';
      b.classList.toggle('is-on', tier ? b.dataset.tier === tier : isAll);
    });
    var vis = 0;
    cards.forEach(function(c){
      var cardType = c.dataset.type || 'case';
      var cardTier = c.dataset.tier || '';
      var show = (!dyn || c.dataset.dynasty === dyn) && (!type || cardType === type) && (!tier || cardTier === tier);
      c.classList.toggle('is-hidden', !show);
      c.classList.toggle('is-hot', !!(dyn || type || tier) && show);
      if(show) vis++;
    });
    if(visEl) visEl.textContent = String(vis);
  }
  dynBtns.forEach(function(b){
    b.addEventListener('click', function(){ dyn = b.dataset.dyn || ''; apply(); });
  });
  typeBtns.forEach(function(b){
    b.addEventListener('click', function(){ type = b.dataset.type || ''; apply(); });
  });
  tierBtns.forEach(function(b){
    b.addEventListener('click', function(){ tier = b.dataset.tier || ''; apply(); });
  });`,
  );

  hub = hub.replace(
    'AS_OF 2026-07-15 · Round 9',
    'AS_OF 2026-07-15 · Round 10',
  );
  if (!hub.includes('Round 10')) {
    hub = hub.replace(/AS_OF 2026-07-15(?! · Round 10)/, 'AS_OF 2026-07-15 · Round 10');
  }
}

writeFileSync(hubPath, hub, 'utf8');
console.log('Round10 SJ-00.html (T1+ filter + badges)');

console.log('Done:', count, 'T1+ volumes + mapping + matrix + SJ-24 + Hub');
console.log('§02 隔离卷:', [...new Set(f2Guard)].join(', '), '+ SJ-20~24 sec-map');
