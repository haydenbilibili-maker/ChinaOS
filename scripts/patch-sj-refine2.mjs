#!/usr/bin/env node
/**
 * 史鉴精修第二轮 · Phase B/C
 * T1+ 标杆升维 + T2+ 加厚 + SLICE_RAIL 去重 + 版本标记
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { T1_PLUS, T2_PLUS } from './data/sj-refine2-deepen.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const T1_TARGETS = ['05', '06', '08', '10', '34'];
const T2_TARGETS = Object.keys(T2_PLUS);

function getCls(num, html) {
  const m = html.match(new RegExp(`\\.sj-${num}-prose`)) || html.match(/\.(sj-\d+)-prose/);
  return m ? m[0].slice(1).replace('-prose', '') : `sj-${num}`;
}

function injectHookExtra(html, cls, extra) {
  if (!extra || html.includes(extra.slice(0, 28))) return html;
  const re = new RegExp(
    `(<div class="${cls}-hook">[\\s\\S]*?<div class="yr">)`,
  );
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

function injectPhaseExtra2(html, cls, extra) {
  return injectPhaseExtra(html, cls, extra);
}

function rewriteHook(html, cls, rewrite) {
  if (!rewrite || html.includes(rewrite.slice(0, 28))) return html;
  const re = new RegExp(`(<div class="${cls}-hook"><p>)([\\s\\S]*?)(</p>)`);
  return html.replace(re, (_, pre, _body, post) => `${pre}${rewrite}${post}`);
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
  const re = new RegExp(`(<div class="${cls}-hist">[\\s\\S]*?)(</div>\\s*</section>\\s*<!-- ⑥)`);
  if (re.test(html)) return html.replace(re, `$1${articles}$2`);
  const re2 = new RegExp(`(<div class="${cls}-hist">[\\s\\S]*?)(</div>\\s*</section>)`);
  return html.replace(re2, `$1${articles}$2`);
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
    const re = new RegExp(
      `(${id}:\\s*\\{[\\s\\S]*?body:\\s*')([^']*)(')`,
    );
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
    `(<article class="open">[\\s\\S]*?</article>)(\\s*</div>\\s*</section>\\s*<!-- ⑦|<article class="open">[\\s\\S]*?</article>\\s*</div>\\s*</section>)`,
  );
  const item = `\n    <article class="open"><div class="vh">未决</div><p>${openExtra}</p></article>`;
  if (re.test(html)) {
    return html.replace(re, (_, block, tail) => `${block}${item}${tail}`);
  }
  return html;
}

function dedupeSliceRail(html) {
  const rails = html.match(/<!--SLICE_RAIL:[^>]+-->/g);
  if (!rails || rails.length <= 1) return html;
  const unique = rails[0];
  return html.replace(/<!--SLICE_RAIL:[^>]+-->\n?/g, '').replace(
    '</section>',
    `${unique}\n</section>`,
    1,
  );
}

function bumpVersion(html) {
  return html
    .replace(/\bv0\.1\b/g, 'v0.3')
    .replace(/\bv0\.2\b/g, 'v0.3')
    .replace(/AS_OF 2026-07-15 · 精调轮/g, 'AS_OF 2026-07-15 · 精修轮')
    .replace(/AS_OF 2026-07-14/g, 'AS_OF 2026-07-15 · 精修轮')
    .replace(/AS_OF 2026-07-15(?! · 精修轮)/g, 'AS_OF 2026-07-15 · 精修轮');
}

let count = 0;

for (const num of T1_TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  let html = readFileSync(path, 'utf8');
  const cls = getCls(num, html);
  const data = T1_PLUS[num];

  html = injectHookExtra(html, cls, data.hookExtra);
  html = expandForceChain(html, data.forceChain);
  html = addHistorians(html, cls, data.histExtra);
  html = expandMirrorDiff(html, data.mirrorDiffExtra);
  html = thickenNodeData(html, data.nodeDataExtra);
  html = dedupeSliceRail(html);
  html = bumpVersion(html);

  writeFileSync(path, html, 'utf8');
  count++;
  console.log(`T1+ SJ-${num}.html`);
}

for (const num of T2_TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  let html = readFileSync(path, 'utf8');
  const cls = getCls(num, html);
  const data = T2_PLUS[num];

  html = injectPhaseExtra(html, cls, data.phaseExtra);
  if (data.phaseExtra2) html = injectPhaseExtra2(html, cls, data.phaseExtra2);
  if (data.hookRewrite) html = rewriteHook(html, cls, data.hookRewrite);
  html = addOpenQuestion(html, cls, data.openExtra);
  html = dedupeSliceRail(html);
  html = bumpVersion(html);

  writeFileSync(path, html, 'utf8');
  count++;
  console.log(`T2+ SJ-${num}.html`);
}

console.log('Done:', count, 'volumes · 精修第二轮 Phase B/C');
