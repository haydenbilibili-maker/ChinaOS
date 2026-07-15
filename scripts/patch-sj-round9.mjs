#!/usr/bin/env node
/**
 * Round 9 · 文案/矩阵 ONLY
 * ⚠️ §02 结构切片隔离：不碰 id="f2" / id="stage" / NODE_DATA / SLICE_RAIL
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  ROUND9_T1_PLUS,
  ROUND9_T2_PLUS,
  ROUND9_SJ24,
} from './data/sj-round9-deepen.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const T1_TARGETS = Object.keys(ROUND9_T1_PLUS);
const T2_TARGETS = Object.keys(ROUND9_T2_PLUS);

function getCls(num, html) {
  const m = html.match(new RegExp(`\\.sj-${num}-prose`));
  return m ? m[0].slice(1).replace('-prose', '') : `sj-${num}`;
}

/** 提取 §02 区块用于隔离校验 */
function extractF2(html) {
  const m = html.match(/<section class="sj-ledger-field" id="f2"[\s\S]*?<\/section>/);
  return m ? m[0] : '';
}

function assertF2Unchanged(before, after, num) {
  const b = extractF2(before);
  const a = extractF2(after);
  if (b && a && b !== a) {
    throw new Error(`SJ-${num}: §02 结构切片被意外修改 — Round 9 禁止`);
  }
}

function injectMechanismExtra(html, cls, extra) {
  if (!extra || html.includes('机制穿透（Round 9）')) return html;
  const block = `\n  <p class="${cls}-prose" style="margin-top:16px;border-left:3px solid var(--sj-ochre);padding-left:14px">${extra}</p>\n`;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="f1"[^>]*>[\\s\\S]*?</div>\\s*</div>\\s*)(</section>)`,
  );
  if (re.test(html)) return html.replace(re, `$1${block}$2`);
  return html;
}

function injectHookExtra(html, cls, extra) {
  if (!extra || html.includes(extra.slice(0, 24))) return html;
  const re = new RegExp(`(<div class="${cls}-hook">[\\s\\S]*?<div class="yr">)`);
  const block = `\n  <p class="${cls}-prose" style="margin-top:14px">${extra}</p>\n  `;
  if (re.test(html)) return html.replace(re, `$1${block}`);
  return html;
}

function injectPhaseExtra(html, cls, extra) {
  if (!extra || html.includes(extra.slice(0, 24))) return html;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="f3"[^>]*>[\\s\\S]*?<p class="${cls}-prose">[\\s\\S]*?</p>)`,
  );
  if (re.test(html)) return html.replace(re, `$1\n  <p class="${cls}-prose">${extra}</p>`);
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

function addOpenQuestion(html, openExtra) {
  if (!openExtra || html.includes(openExtra.slice(0, 20))) return html;
  const item = `\n    <article class="open"><div class="vh">未决</div><p>${openExtra}</p></article>`;
  const re = new RegExp('(</div>\\s*</section>\\s*<section class="sj-ledger-field" id="f7")');
  return html.replace(re, `${item}$1`);
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
  if (!extra || html.includes('交叉引用收束（Round 9）')) return html;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="fx"[^>]*>[\\s\\S]*?<div class="sj-ledger-fh">[\\s\\S]*?</div>)`,
  );
  const block = `\n  <p class="${cls}-prose" style="margin-bottom:14px">${extra}</p>`;
  return html.replace(re, `$1${block}`);
}

function injectDeepBlock(html, block) {
  if (!block) return html;
  if (html.includes('Round 9 标注')) {
    if (block.includes('史料口径') && !html.includes('史料口径')) {
      const divStart = html.indexOf('<div class="sj-');
      const idx = html.indexOf('T1+ 深描穿透', divStart);
      if (idx > 0) {
        const start = html.lastIndexOf('<div class="sj-', idx);
        const end = html.indexOf('</div>', html.indexOf('Round 9 标注', idx)) + 6;
        if (start >= 0 && end > start) return html.slice(0, start) + block + html.slice(end);
      }
    }
    return html;
  }
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
  const para = `\n  ${block}\n  `;
  return html.replace(re, `$1${para}$2`);
}

function injectFooterNote(html, note) {
  if (!note || html.includes(note.slice(20, 50))) return html;
  return html.replace(/(<footer class="sj-\d+-foot">)/, `${note}\n$1`);
}

function injectTierNote(html, cls, note) {
  if (!note || html.includes('Round 9 升维')) return html;
  const re = new RegExp(`(<section class="sj-ledger-field" id="f1"[^>]*>[\\s\\S]*?</section>)`);
  const tag = `\n  <p class="${cls}-prose" style="font-family:var(--sj-mono);font-size:11px;color:var(--sj-ochre);margin-top:8px">${note}</p>\n`;
  return html.replace(re, `$1${tag}`);
}

function bumpVersion(html) {
  return html
    .replace(/\bv0\.4\b/g, 'v0.6')
    .replace(/\bv0\.5\b/g, 'v0.6')
    .replace(/AS_OF 2026-07-15 · Round 8/g, 'AS_OF 2026-07-15 · Round 9')
    .replace(/AS_OF 2026-07-15(?! · Round 9)/g, 'AS_OF 2026-07-15 · Round 9');
}

let count = 0;
const f2Guard = [];

for (const num of T1_TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  const before = readFileSync(path, 'utf8');
  let html = before;
  const cls = getCls(num, html);
  const data = ROUND9_T1_PLUS[num];

  html = injectMechanismExtra(html, cls, data.mechanismExtra);
  html = injectTierNote(html, cls, data.tierNote);
  html = expandForceChain(html, data.forceChainR9, '〔R9〕');
  html = addHistorians(html, cls, data.histExtra);
  html = expandMirrorDiff(html, data.mirrorDiffExtraR9, 'Round 9 差异加厚');
  html = injectProseBlocks(html, cls, data.proseBlocks);
  html = addVerdictExtras(html, data.verdictExtra);
  html = injectDeepBlock(html, data.deepBlock);
  html = injectCompareBlock(html, cls, data.compareBlock);
  html = injectFooterNote(html, data.footerNote);
  html = injectXrefProse(html, cls, data.xrefProse);
  html = bumpVersion(html);

  assertF2Unchanged(before, html, num);
  writeFileSync(path, html, 'utf8');
  f2Guard.push(`SJ-${num}`);
  count++;
  console.log(`Round9 T1+ SJ-${num}.html (§02 untouched)`);
}

for (const num of T2_TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  const before = readFileSync(path, 'utf8');
  let html = before;
  const cls = getCls(num, html);
  const data = ROUND9_T2_PLUS[num];

  html = injectPhaseExtra(html, cls, data.phaseExtra);
  html = injectHookExtra(html, cls, data.hookExtra);
  html = addHistorians(html, cls, data.histExtra);
  html = addOpenQuestion(html, data.openExtra);
  html = bumpVersion(html);

  assertF2Unchanged(before, html, num);
  writeFileSync(path, html, 'utf8');
  f2Guard.push(`SJ-${num}`);
  count++;
  console.log(`Round9 T2+ SJ-${num}.html (§02 untouched)`);
}

// SJ-24 误判索引（不改 §02 签名映射盘 SVG）
const sj24Path = join(OUT, 'SJ-24.html');
const sj24Before = readFileSync(sj24Path, 'utf8');
let sj24 = sj24Before;
const { indexSection, introExtra } = ROUND9_SJ24;

if (!sj24.includes('sec-wujpan-index')) {
  sj24 = sj24.replace(
    '<section class="sj-24-sec" id="sec-meta"',
    `${indexSection}\n\n<section class="sj-24-sec" id="sec-meta"`,
  );
  sj24 = sj24.replace(
    '<a href="#sec-meta">04 · 元差异</a>',
    '<a href="#sec-wujpan-index">03b · 误判索引</a>\n      <a href="#sec-meta">04 · 元差异</a>',
  );
}

if (!sj24.includes('Round 9 说明')) {
  const introRe = /(<section class="sj-24-sec" id="sec-intro"[\s\S]*?<p class="sj-24-prose">)([^<]*)(<\/p>)/;
  if (introRe.test(sj24)) {
    sj24 = sj24.replace(introRe, `$1$2$3\n  <p class="sj-24-prose">${introExtra}</p>`);
  }
}

sj24 = sj24
  .replace(/\bv0\.5\b/g, 'v0.6')
  .replace(/AS_OF 2026-07-15 · Round 8/g, 'AS_OF 2026-07-15 · Round 9');

// SJ-24 sec-map is §02 — verify unchanged
const mapBefore = sj24Before.match(/<section class="sj-24-sec" id="sec-map"[\s\S]*?<\/section>/)?.[0] || '';
const mapAfter = sj24.match(/<section class="sj-24-sec" id="sec-map"[\s\S]*?<\/section>/)?.[0] || '';
if (mapBefore && mapAfter && mapBefore !== mapAfter) {
  throw new Error('SJ-24: §02 签名映射盘被意外修改');
}

writeFileSync(sj24Path, sj24, 'utf8');
console.log('Round9 SJ-24.html (误判索引 · §02 untouched)');

console.log('Done:', count, 'case volumes + SJ-24');
console.log('§02 隔离卷:', f2Guard.join(', '), '+ SJ-24 sec-map');
