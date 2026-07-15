#!/usr/bin/env node
/**
 * Round 8 · T1+ 升维 + SJ-07 六行矩阵 + SJ-24 外交误判专题
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  ROUND8_T1_PLUS,
  ROUND8_SJ07,
  ROUND8_SJ24,
} from './data/sj-round8-deepen.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const T1_TARGETS = ['25', '30', '37'];

function getCls(num, html) {
  const m = html.match(new RegExp(`\\.sj-${num}-prose`));
  return m ? m[0].slice(1).replace('-prose', '') : `sj-${num}`;
}

function injectMechanismExtra(html, cls, extra) {
  if (!extra || html.includes(extra.slice(0, 28))) return html;
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
    const block = `\n  <p class="${cls}-prose" style="margin-top:12px">${text}</p>`;
    out = out.replace(re, `$1${block}`);
  }
  return out;
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

function injectXrefProse(html, cls, extra) {
  if (!extra) return html;
  if (html.includes('交叉引用收束（Round 8）')) {
    if (html.includes(extra.slice(-40))) return html;
    return html.replace(
      /(<p class="[^"]+-prose" style="margin-bottom:14px">交叉引用收束（Round 8）：[^<]*<\/p>)/,
      `<p class="${cls}-prose" style="margin-bottom:14px">${extra}</p>`,
    );
  }
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="fx"[^>]*>[\\s\\S]*?<div class="sj-ledger-fh">[\\s\\S]*?</div>)`,
  );
  const block = `\n  <p class="${cls}-prose" style="margin-bottom:14px">${extra}</p>`;
  return html.replace(re, `$1${block}`);
}

function injectSliceProseExtra(html, cls, extra) {
  if (!extra || html.includes(extra.slice(0, 24))) return html;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="f2"[^>]*>[\\s\\S]*?<p class="${cls}-prose">)([^<]*)(</p>)`,
  );
  const block = `\n  <p class="${cls}-prose" style="margin-top:12px">${extra}</p>`;
  return html.replace(re, `$1$2$3${block}`);
}

function injectDeepBlock(html, block) {
  if (!block) return html;
  if (html.includes('T1+ 深描穿透')) {
    // Update existing deep block if expanded
    const marker = 'T1+ 深描穿透';
    const idx = html.indexOf(marker);
    if (idx > 0 && block.length > 500) {
      const start = html.lastIndexOf('<div class="sj-', idx);
      const end = html.indexOf('</div>', idx) + 6;
      if (start >= 0 && end > start && !html.slice(start, end).includes('史家交锋收束')) {
        return html.slice(0, start) + block + html.slice(end);
      }
    }
    return html;
  }
  const re = /(<section class="sj-ledger-field" id="fx"[^>]*>)/;
  if (re.test(html)) return html.replace(re, `${block}\n$1`);
  const re2 = /(<section class="sj-ledger-field" id="f7"[^>]*>[\s\S]*?<\/section>)/;
  return html.replace(re2, `$1\n${block}`);
}

function injectTierNote(html, cls, note) {
  if (!note || html.includes('sj-tier-note')) return html;
  const re = new RegExp(`(<section class="sj-ledger-field" id="f1"[^>]*>[\\s\\S]*?</section>)`);
  const tag = `\n  <p class="${cls}-prose sj-tier-note" style="font-family:var(--sj-mono);font-size:11px;color:var(--sj-ochre);margin-top:8px">${note}</p>\n`;
  return html.replace(re, `$1${tag}`);
}

function expandForceChainR8(html, forceChain) {
  let out = html;
  for (const [force, chain] of Object.entries(forceChain || {})) {
    const esc = force.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      `(<tr><td>${esc}[^<]*</td><td class="zheng">[^<]*</td><td class="shi">)([^<]*)(</td></tr>)`,
    );
    out = out.replace(re, (_, pre, shi, post) => {
      if (shi.includes('〔R8〕')) return pre + shi + post;
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
    const marker = h.text.slice(0, 20);
    if (out.includes(marker)) continue;
    const article = `\n    <article><div class="who">${h.who}<span>${h.sub}</span></div><p>${h.text}</p></article>`;
    const re = new RegExp(`(<div class="${cls}-hist">[\\s\\S]*?)(</div>\\s*</section>)`);
    out = out.replace(re, `$1${article}$2`);
  }
  return out;
}

function expandMirrorDiffR8(html, extra) {
  if (!extra || html.includes(extra.slice(0, 28))) return html;
  return html.replace(
    /(<article class="diff">[\s\S]*?<p>)([^<]*)(<\/p>)/,
    (_, pre, body, post) => {
      if (body.includes('Round 8 差异加厚')) return pre + body + post;
      const merged = body.trim().endsWith('。') ? `${body.trim()} ${extra}` : `${body} ${extra}`;
      return pre + merged + post;
    },
  );
}

function thickenNodeDataR8(html, nodeDataExtra) {
  let out = html;
  for (const [id, extra] of Object.entries(nodeDataExtra || {})) {
    const re = new RegExp(`(${id}:\\s*\\{[\\s\\S]*?body:\\s*')([^']*)(')`);
    out = out.replace(re, (_, pre, body, post) => {
      if (body.includes(extra.slice(0, 16))) return pre + body + post;
      const merged = body.trim().endsWith('。') ? `${body.trim()} ${extra}` : `${body} ${extra}`;
      return pre + merged + post;
    });
  }
  return out;
}

function bumpCaseVersion(html) {
  return html
    .replace(/\bv0\.4\b/g, 'v0.5')
    .replace(/\bv0\.3\b/g, 'v0.5')
    .replace(/AS_OF 2026-07-15 · Round 7/g, 'AS_OF 2026-07-15 · Round 8')
    .replace(/AS_OF 2026-07-15(?! · Round 8)/g, 'AS_OF 2026-07-15 · Round 8');
}

// ── A. T1+ 升维 ──
let count = 0;
for (const num of T1_TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  let html = readFileSync(path, 'utf8');
  const cls = getCls(num, html);
  const data = ROUND8_T1_PLUS[num];

  html = injectMechanismExtra(html, cls, data.mechanismExtra);
  html = injectTierNote(html, cls, data.tierNote);
  html = expandForceChainR8(html, data.forceChainR8);
  html = addHistorians(html, cls, data.histExtra);
  html = expandMirrorDiffR8(html, data.mirrorDiffExtraR8);
  html = thickenNodeDataR8(html, data.nodeDataExtraR8);
  html = injectProseBlocks(html, cls, data.proseBlocks);
  html = injectSliceProseExtra(html, cls, data.sliceProseExtra);
  html = injectXrefProse(html, cls, data.xrefProse);
  html = addVerdictExtras(html, data.verdictExtra);
  html = injectDeepBlock(html, data.deepBlock);
  if (data.footerNote && !html.includes(data.footerNote.slice(20, 50))) {
    html = html.replace(/(<footer class="sj-\d+-foot">)/, `${data.footerNote}\n$1`);
  }
  html = bumpCaseVersion(html);

  writeFileSync(path, html, 'utf8');
  count++;
  console.log(`Round8 T1+ SJ-${num}.html`);
}

// ── B. SJ-07 六行矩阵 ──
const sj07Path = join(OUT, 'SJ-07.html');
let sj07 = readFileSync(sj07Path, 'utf8');
const { suiSvgRow, dynData, tableRowShi, lawExtra, insightR8, waijiaoDone } = ROUND8_SJ07;

if (!sj07.includes('data-id="sui"')) {
  // Insert Sui SVG row after Qin, shift Han/Ming/Tang/Qing down
  sj07 = sj07.replace(
    '  <!-- 汉 -->',
    `${suiSvgRow}\n  <!-- 汉 -->`,
  );
  // Shift Han row
  sj07 = sj07
    .replace(/(<g class="sj-row" data-id="han"[\s\S]*?)y="234"/g, '$1y="282"')
    .replace(/(<g class="sj-row" data-id="han"[\s\S]*?)y="266"/g, '$1y="314"')
    .replace(/(<g class="sj-row" data-id="han"[\s\S]*?)y="282"/g, '$1y="330"')
    .replace(/(<g class="sj-row" data-id="han"[\s\S]*?)cy="262"/g, '$1cy="310"');
  // Shift Tang
  sj07 = sj07
    .replace(/(<g class="sj-row" data-id="tang"[\s\S]*?)y="298"/g, '$1y="338"')
    .replace(/(<g class="sj-row" data-id="tang"[\s\S]*?)y="330"/g, '$1y="370"')
    .replace(/(<g class="sj-row" data-id="tang"[\s\S]*?)y="346"/g, '$1y="386"')
    .replace(/(<g class="sj-row" data-id="tang"[\s\S]*?)cy="326"/g, '$1cy="366"');
  // Shift Ming
  sj07 = sj07
    .replace(/(<g class="sj-row" data-id="ming"[\s\S]*?)y="362"/g, '$1y="394"')
    .replace(/(<g class="sj-row" data-id="ming"[\s\S]*?)y="394"/g, '$1y="426"')
    .replace(/(<g class="sj-row" data-id="ming"[\s\S]*?)y="410"/g, '$1y="442"')
    .replace(/(<g class="sj-row" data-id="ming"[\s\S]*?)cy="390"/g, '$1cy="422"');
  // Shift Qing
  sj07 = sj07
    .replace(/(<g class="sj-row" data-id="qing"[\s\S]*?)y="426"/g, '$1y="450"')
    .replace(/(<g class="sj-row" data-id="qing"[\s\S]*?)y="458"/g, '$1y="482"')
    .replace(/(<g class="sj-row" data-id="qing"[\s\S]*?)y="474"/g, '$1y="498"')
    .replace(/(<g class="sj-row" data-id="qing"[\s\S]*?)cy="454"/g, '$1cy="478"');
  // Legend + scroll area
  sj07 = sj07.replace(/cy="506"/g, 'cy="530"');
  sj07 = sj07.replace(/y="509"/g, 'y="533"');
  sj07 = sj07.replace(/height="420"/g, 'height="476"');
  sj07 = sj07.replace(/height="412"/g, 'height="468"');
  sj07 = sj07.replace(/y="108" width="4" height="412"/g, 'y="108" width="4" height="468"');

  // Update titles
  sj07 = sj07.replace(
    '秦汉唐明清崩解归因矩阵',
    '秦隋汉唐明清崩解归因矩阵',
  );
  sj07 = sj07.replace(
    '五行为秦汉唐明清',
    '六行为秦隋汉唐明清',
  );
  sj07 = sj07.replace(
    'SJ-07 · 秦汉唐明清 · 行=朝 列=力',
    'SJ-07 · 秦隋汉唐明清 · 行=朝 列=力',
  );
  sj07 = sj07.replace(
    '行为五王朝，列为五力',
    '行为六王朝，列为五力',
  );
  sj07 = sj07.replace(
    '<h3>五朝引燃点</h3>',
    '<h3>六朝引燃点</h3>',
  );
  sj07 = sj07.replace(
    '<a href="#sec-table">03 · 五朝台账</a>',
    '<a href="#sec-table">03 · 六朝台账</a>',
  );
}

// Enhance table 隋 row shi cell
if (!sj07.includes('SJ-37 T1+ 深描')) {
  sj07 = sj07.replace(
    '工程+军事双透支合围（→ SJ-37 深描）',
    tableRowShi,
  );
}

// Add DYN_DATA sui entry
if (!sj07.includes('sui: { name')) {
  const suiEntry = `    sui: { name:'${dynData.sui.name}', tag:'${dynData.sui.tag}',
      chain:'${dynData.sui.chain}',
      law:'${dynData.sui.law}' },\n    `;
  sj07 = sj07.replace('    han: { name:', `${suiEntry}han: { name:`);
  sj07 = sj07.replace(
    '/** 五王朝崩解归因',
    '/** 六王朝崩解归因',
  );
}

// Law + insight
if (!sj07.includes('Round 8 收束')) {
  sj07 = sj07.replace(
    '<p class="sj-07-note"><b>同构与差异：</b>',
    `${lawExtra}\n  <p class="sj-07-note"><b>同构与差异：</b>`,
  );
}

// Fix duplicate 隋 chain if present
sj07 = sj07.replace(
  'SJ-35 奠基→SJ-36 运河过载→611 民变→618 江都兵变；SJ-35 奠基→SJ-36 运河过载→611 王薄起义→618 江都兵变',
  'SJ-35 奠基→SJ-36 运河过载→611 王薄起义→618 江都兵变',
);

// Update 五案 → 六案 in prose
sj07 = sj07.replace(
  '没有任何单一变量能解释全部五案',
  '没有任何单一变量能解释全部六案',
);
sj07 = sj07.replace(
  '<b>同构与差异：</b>五案共享同一主链',
  '<b>同构与差异：</b>六案共享同一主链',
);

if (!sj07.includes('Round 8 六行洞察')) {
  sj07 = sj07.replace(
    '<p class="sj-07-note"><b>Round 7 综合候选：</b>',
    `<p class="sj-07-prose" style="margin-top:14px;font-style:italic">${insightR8}</p>\n  <p class="sj-07-note"><b>Round 8 外交误判：</b>${waijiaoDone}</p>\n  <p class="sj-07-note"><b>Round 7 综合候选：</b>`,
  );
  // Replace old candidate note with done note only
  sj07 = sj07.replace(
    /<p class="sj-07-note"><b>Round 7 综合候选：<\/b>[^<]*<\/p>\n/,
    '',
  );
}

sj07 = sj07
  .replace(/\bv0\.3\b/g, 'v0.5')
  .replace(/AS_OF 2026-07-14/g, 'AS_OF 2026-07-15 · Round 8')
  .replace(/AS_OF 2026-07-15 · Round 7/g, 'AS_OF 2026-07-15 · Round 8')
  .replace(/AS_OF 2026-07-15 · 精修轮/g, 'AS_OF 2026-07-15 · Round 8');
writeFileSync(sj07Path, sj07, 'utf8');
console.log('Round8 SJ-07.html (六行矩阵)');

// ── C. SJ-24 外交误判专题 ──
const sj24Path = join(OUT, 'SJ-24.html');
let sj24 = readFileSync(sj24Path, 'utf8');
const { svgRow, pairArticle, mapData, metaExtra, railNav, xrefCards } = ROUND8_SJ24;

if (!sj24.includes('data-id="wujpan"')) {
  // Expand SVG viewBox and add 4th row
  sj24 = sj24.replace(
    'viewBox="0 0 820 520"',
    'viewBox="0 0 820 560"',
  );
  sj24 = sj24.replace(
    'height="520"',
    'height="560"',
  );
  sj24 = sj24.replace(
    '  <text x="410" y="470"',
    `${svgRow}\n  <text x="410" y="510"`,
  );
  sj24 = sj24.replace(
    'y="470" text-anchor="middle" fill="var(--sj-paper-300)"',
    'y="510" text-anchor="middle" fill="var(--sj-paper-300)"',
  );
}

if (!sj24.includes('pair-wujpan')) {
  sj24 = sj24.replace(
    '    </article>\n  </div>\n</section>\n\n<section class="sj-24-sec" id="sec-meta"',
    `    </article>\n\n${pairArticle}\n  </div>\n</section>\n\n<section class="sj-24-sec" id="sec-meta"`,
  );
  sj24 = sj24.replace(
    '<span class="num">03 · 三组对照</span>',
    '<span class="num">03 · 四组对照</span>',
  );
  sj24 = sj24.replace(
    '三组对照各须过 Δ 闸',
    '四组对照各须过 Δ 闸',
  );
}

if (!sj24.includes('wujpan:')) {
  const entry = `    wujpan: { name:'${mapData.wujpan.name}',
      same:'${mapData.wujpan.same}',
      diff:'${mapData.wujpan.diff}' },\n    `;
  sj24 = sj24.replace('    bianxiang: { name:', `${entry}bianxiang: { name:`);
}

if (!sj24.includes('有限战争 vs 误判升级')) {
  sj24 = sj24.replace(
    '<p class="sj-24-prose">但两样没变：',
    `${metaExtra}\n  <p class="sj-24-prose">但两样没变：`,
  );
}

if (!sj24.includes('pair-wujpan')) {
  // already handled above
}

if (!sj24.includes('#pair-wujpan')) {
  sj24 = sj24.replace(
    '<a href="#pair-bianxiang">③ 边饷 → 国防财政</a></nav>',
    `<a href="#pair-bianxiang">③ 边饷 → 国防财政</a>\n    ${railNav}</nav>`,
  );
}

if (!sj24.includes('SJ-41 · 靖康')) {
  sj24 = sj24.replace(
    '<a href="/modules/shijian/sj-00"><div class="n">SJ-00</div>',
    `${xrefCards}\n    <a href="/modules/shijian/sj-00"><div class="n">SJ-00</div>`,
  );
  sj24 = sj24.replace(
    '映射卷五域收束',
    'Round 8 增「外交—军事误判」第四组（SJ-41/43/47）。映射卷五域收束',
  );
}

sj24 = sj24
  .replace(/\bv0\.1\b/g, 'v0.5')
  .replace(/AS_OF 2026-07-14/g, 'AS_OF 2026-07-15 · Round 8')
  .replace(/本地调试 · 未 push/g, 'Round 8 · 外交误判专题');
writeFileSync(sj24Path, sj24, 'utf8');
console.log('Round8 SJ-24.html (外交误判)');

console.log('Done:', count, 'T1+ volumes + SJ-07 + SJ-24 · Round 8');
