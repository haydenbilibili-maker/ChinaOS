#!/usr/bin/env node
/**
 * 史鉴精调轮 · Phase B 文案纵深
 * 加厚 §01/§03/§04/§05/§06/§07；真源母本，禁臆造
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ROUND4_CASES } from './data/round4-cases.mjs';
import { ROUND4_CHUNQIU } from './data/round4-cases-chunqiu.mjs';
import { ROUND5_CASES } from './data/round5-cases.mjs';
import {
  CLASSIC_DEEPEN,
  roundForceExtra,
  roundMirrorExpand,
} from './data/sj-refine-deepen.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const ROUND_BY_NUM = Object.fromEntries(
  [...ROUND4_CASES, ...ROUND4_CHUNQIU, ...ROUND5_CASES].map((c) => [c.num, c]),
);

const REFINE_TARGETS = [
  '09', '11', '12', '13', '14', '15',
  '27', '28', '35', '36', '38', '39', '40', '41', '42', '43', '44', '49',
  '52', '53', '54', '55', '56', '57',
];

function getCls(num, html) {
  const m = html.match(new RegExp(`\\.sj-${num}-prose`)) || html.match(/\.(sj-\d+)-prose/);
  return m ? m[0].slice(1).replace('-prose', '') : `sj-${num}`;
}

function injectHookExtra(html, cls, extra) {
  if (!extra || html.includes(extra.slice(0, 24))) return html;
  const re = new RegExp(
    `(<div class="${cls}-hook">[\\s\\S]*?</div>\\s*</div>\\s*</section>)`,
  );
  const block = `\n  <p class="${cls}-prose" style="margin-top:14px">${extra}</p>`;
  if (re.test(html)) {
    return html.replace(re, `$1${block}`);
  }
  return html;
}

function injectPhaseExtra(html, cls, extra) {
  if (!extra || html.includes(extra.slice(0, 24))) return html;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="f3"[^>]*>[\\s\\S]*?<p class="${cls}-prose">[\\s\\S]*?</p>)`,
  );
  if (re.test(html)) {
    return html.replace(re, `$1\n  <p class="${cls}-prose">${extra}</p>`);
  }
  return html;
}

function injectForcesIntro(html, cls) {
  const intro =
    '双轨意识：左列是正史书写的<strong>正史归因</strong>，右列是剥离立场后的<strong>结构实因</strong>。五力须联读，忌单因论。';
  if (html.includes('双轨意识')) return html;
  const re = new RegExp(
    `(<section class="sj-ledger-field" id="f4"[^>]*>\\s*<div class="sj-ledger-fh">[\\s\\S]*?</div>)`,
  );
  return html.replace(re, `$1\n  <p class="${cls}-prose">${intro}</p>`);
}

function expandForceRows(html, forceExtra) {
  let out = html;
  for (const [force, extra] of Object.entries(forceExtra || {})) {
    const re = new RegExp(
      `(<tr><td>${force}[^<]*</td><td class="zheng">[^<]*</td><td class="shi">)([^<]*)(</td></tr>)`,
    );
    out = out.replace(re, (_, pre, shi, post) => {
      if (shi.includes(extra.slice(0, 16))) return pre + shi + post;
      const merged = shi.trim().endsWith('。') ? `${shi.trim()} ${extra}` : `${shi} ${extra}`;
      return pre + merged + post;
    });
  }
  return out;
}

function expandRoundForces(html, roundCase) {
  if (!roundCase?.forces) return html;
  let out = html;
  for (const [force, , shi] of roundCase.forces) {
    const expanded = roundForceExtra(force, shi);
    if (expanded === shi) continue;
    const esc = force.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      `(<tr><td>${esc}[^<]*</td><td class="zheng">[^<]*</td><td class="shi">)([^<]*)(</td></tr>)`,
    );
    out = out.replace(re, (_, pre, cell, post) => {
      if (cell.includes(expanded.slice(-20))) return pre + cell + post;
      return pre + expanded + post;
    });
  }
  return out;
}

function expandMirror(html, same, diff) {
  let out = html;
  if (same) {
    out = out.replace(
      /(<article class="same">[\s\S]*?<p>)([^<]*)(<\/p>)/,
      (_, pre, body, post) => {
        if (body.length >= same.length - 10) return pre + body + post;
        return pre + same + post;
      },
    );
  }
  if (diff) {
    out = out.replace(
      /(<article class="diff">[\s\S]*?<p>)([^<]*)(<\/p>)/,
      (_, pre, body, post) => {
        if (body.length >= diff.length - 10) return pre + body + post;
        return pre + diff + post;
      },
    );
  }
  return out;
}

function bumpVersion(html) {
  return html
    .replace(/\bv0\.1\b/g, 'v0.2')
    .replace(/AS_OF 2026-07-15(?! · 精调轮)/g, 'AS_OF 2026-07-15 · 精调轮');
}

let count = 0;
for (const num of REFINE_TARGETS) {
  const path = join(OUT, `SJ-${num}.html`);
  let html = readFileSync(path, 'utf8');
  const cls = getCls(num, html);
  const classic = CLASSIC_DEEPEN[num];
  const round = ROUND_BY_NUM[num];

  html = injectForcesIntro(html, cls);

  if (classic) {
    html = injectHookExtra(html, cls, classic.hookExtra);
    html = injectPhaseExtra(html, cls, classic.phaseExtra);
    html = expandForceRows(html, classic.forceExtra);
    html = expandMirror(html, classic.mirrorSame, classic.mirrorDiff);
  } else if (round) {
    html = injectPhaseExtra(html, cls, round.phaseProse);
    html = expandRoundForces(html, round);
    const { same, diff } = roundMirrorExpand(round.mirror.same, round.mirror.diff);
    html = expandMirror(html, same, diff);
  }

  html = bumpVersion(html);
  writeFileSync(path, html, 'utf8');
  count++;
  console.log(`Refined SJ-${num}.html (content)`);
}

console.log('Done:', count, 'volumes · Phase B');
