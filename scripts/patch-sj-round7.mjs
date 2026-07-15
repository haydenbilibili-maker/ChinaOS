#!/usr/bin/env node
/**
 * Round 7 · 质量深化
 * - T2+ 加厚 Round 6 边缘卷（25/26/29/30/37/47/48）
 * - SJ-07 崩解矩阵增隋行（表+文案，SVG 保持五朝主矩阵）
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ROUND7_T2, ROUND7_MATRIX_NOTES } from './data/sj-round7-deepen.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const TARGETS = Object.keys(ROUND7_T2);

function getCls(num, html) {
  const m = html.match(new RegExp(`\\.sj-${num}-prose`));
  return m ? m[0].slice(1).replace('-prose', '') : `sj-${num}`;
}

function injectHookExtra(html, cls, extra) {
  if (!extra || html.includes(extra.slice(0, 28))) return html;
  const re = new RegExp(`(<div class="${cls}-hook">[\\s\\S]*?<div class="yr">)`);
  const block = `\n  <p class="${cls}-prose" style="margin-top:14px">${extra}</p>\n  `;
  if (re.test(html)) return html.replace(re, `$1${block}`);
  return html;
}

function injectPhaseExtra(html, cls, extra) {
  if (!extra || html.includes(extra.slice(0, 28))) return html;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="f3"[^>]*>[\\s\\S]*?<p class="${cls}-prose">[\\s\\S]*?</p>)`,
  );
  if (re.test(html)) return html.replace(re, `$1\n  <p class="${cls}-prose">${extra}</p>`);
  return html;
}

function expandForceChain(html, forceChain) {
  let out = html;
  for (const [force, chain] of Object.entries(forceChain || {})) {
    const esc = force.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      `(<tr><td>${esc}[^<]*</td><td class="zheng">[^<]*</td><td class="shi">)([^<]*)(</td></tr>)`,
    );
    out = out.replace(re, (_, pre, shi, post) => {
      if (shi.includes(chain.slice(0, 16))) return pre + shi + post;
      const merged = shi.trim().endsWith('。') ? `${shi.trim()} ${chain}` : `${shi} ${chain}`;
      return pre + merged + post;
    });
  }
  return out;
}

function addHistorians(html, cls, histExtra) {
  if (!histExtra?.length) return html;
  const marker = histExtra[0].text.slice(0, 20);
  if (html.includes(marker)) return html;
  const articles = histExtra
    .map(
      (h) =>
        `\n    <article><div class="who">${h.who}<span>${h.sub}</span></div><p>${h.text}</p></article>`,
    )
    .join('');
  const re = new RegExp(`(<div class="${cls}-hist">[\\s\\S]*?)(</div>\\s*</section>)`);
  return html.replace(re, `$1${articles}$2`);
}

function expandMirrorDiff(html, extra) {
  if (!extra || html.includes(extra.slice(0, 28))) return html;
  return html.replace(
    /(<article class="diff">[\s\S]*?<p>)([^<]*)(<\/p>)/,
    (_, pre, body, post) => {
      if (body.includes(extra.slice(0, 20))) return pre + body + post;
      const merged = body.trim().endsWith('。') ? `${body.trim()} ${extra}` : `${body} ${extra}`;
      return pre + merged + post;
    },
  );
}

function thickenNodeData(html, nodeDataExtra) {
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

function addOpenQuestion(html, cls, openExtra) {
  if (!openExtra || html.includes(openExtra.slice(0, 20))) return html;
  const re = new RegExp(
    `(<article class="open">[\\s\\S]*?</article>\\s*)(</div>\\s*</section>\\s*<section class="sj-ledger-field" id="f7")`,
  );
  const item = `\n    <article class="open"><div class="vh">未决</div><p>${openExtra}</p></article>\n    `;
  if (re.test(html)) return html.replace(re, `$1${item}$2`);
  return html;
}

function bumpVersion(html) {
  return html
    .replace(/\bv0\.1\b/g, 'v0.4')
    .replace(/\bv0\.3\b/g, 'v0.4')
    .replace(/AS_OF 2026-07-15(?! · Round 7)/g, 'AS_OF 2026-07-15 · Round 7');
}

let count = 0;
for (const num of TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  let html = readFileSync(path, 'utf8');
  const cls = getCls(num, html);
  const data = ROUND7_T2[num];

  html = injectHookExtra(html, cls, data.hookExtra);
  html = injectPhaseExtra(html, cls, data.phaseExtra);
  html = expandForceChain(html, data.forceChain);
  html = addHistorians(html, cls, data.histExtra);
  html = expandMirrorDiff(html, data.mirrorDiffExtra);
  html = thickenNodeData(html, data.nodeDataExtra);
  html = addOpenQuestion(html, cls, data.openExtra);
  html = bumpVersion(html);

  writeFileSync(path, html, 'utf8');
  count++;
  console.log(`Round7 T2+ SJ-${num}.html`);
}

const sj07Path = join(OUT, 'SJ-07.html');
let sj07 = readFileSync(sj07Path, 'utf8');
const { suiRow, insight, waijiaoCandidate } = ROUND7_MATRIX_NOTES['07'];

if (!sj07.includes('>SJ-37')) {
  const row = `<tr><td>${suiRow.dynasty}</td><td>${suiRow.trigger}</td><td class="lead">${suiRow.lead}</td><td>${suiRow.chain}</td><td>${suiRow.form}</td></tr>`;
  sj07 = sj07.replace(
    '<tr><td>汉（东汉末）</td>',
    `${row}\n        <tr><td>汉（东汉末）</td>`,
  );
  sj07 = sj07.replace(
    '<a href="#sec-table">汉末 · 灾荒+合法性</a>',
    `<a href="#sec-table">隋 · 工程+军事双透支</a>\n      <a href="#sec-table">汉末 · 灾荒+合法性</a>`,
  );
  sj07 = sj07.replace(
    '<a class="sj-rail-chip" href="/modules/shijian/sj-06">SJ-06 天宝</a>',
    `<a class="sj-rail-chip" href="/modules/shijian/sj-37">SJ-37 隋末</a>\n    <a class="sj-rail-chip" href="/modules/shijian/sj-06">SJ-06 天宝</a>`,
  );
}

if (!sj07.includes('Round 7 扩列洞察')) {
  sj07 = sj07.replace(
    '<p class="sj-07-prose" style="margin-top:14px;font-style:italic">跨朝对照的额外洞察：',
    `<p class="sj-07-prose" style="margin-top:14px;font-style:italic">${insight}</p>\n<p class="sj-07-prose" style="margin-top:14px;font-style:italic">跨朝对照的额外洞察：`,
  );
}

if (!sj07.includes('外交—军事误判')) {
  sj07 = sj07.replace(
    '<p class="sj-07-note"><b>同构与差异：</b>',
    `<p class="sj-07-note"><b>Round 7 综合候选：</b>${waijiaoCandidate}</p>\n  <p class="sj-07-note"><b>同构与差异：</b>`,
  );
}

sj07 = sj07.replace(/AS_OF 2026-07-15 · 精修轮/g, 'AS_OF 2026-07-15 · Round 7');
writeFileSync(sj07Path, sj07, 'utf8');
console.log('Round7 SJ-07 matrix table + notes');

console.log('Done:', count, 'volumes + SJ-07 · Round 7 质量深化');
