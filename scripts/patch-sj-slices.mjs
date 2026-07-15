#!/usr/bin/env node
/**
 * Patch §02 structure slices for SJ case volumes to premium + geometry-spec standard.
 * True source: docs/shijian/结构切片几何规格.md — geometry configs override premium defaults.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  SLICE_CONFIGS,
  sliceCss,
  sliceScript,
  buildF2Section,
} from './lib/sj-premium-slice.mjs';
import {
  GEOMETRY_SLICE_CONFIGS,
  GEOMETRY_SPEC_VERSION,
  FORBIDDEN_CLONE_MOTIF,
} from './lib/sj-slice-geometries.mjs';
import { buildRoundSliceConfigs } from './lib/case-to-slice-config.mjs';
import { ROUND4_CASES } from './data/round4-cases.mjs';
import { ROUND4_CHUNQIU } from './data/round4-cases-chunqiu.mjs';
import { ROUND5_CASES } from './data/round5-cases.mjs';
import { ROUND6_CASES } from './data/round6-cases.mjs';
import { POLISH_SLICE_CONFIGS } from './lib/sj-slice-polish-r2.mjs';

const ROUND_SLICE_CONFIGS = buildRoundSliceConfigs([
  ...ROUND4_CASES,
  ...ROUND4_CHUNQIU,
  ...ROUND5_CASES,
  ...ROUND6_CASES,
]);

/**
 * Geometry spec (§1) wins over legacy premium / round-data / polish configs.
 * GEOMETRY_SLICE_CONFIGS is spread LAST so architect-locked geometry (e.g. SJ-53/54)
 * is authoritative and never reverts to a vertical-spine round-data clone.
 */
const ALL_SLICE_CONFIGS = {
  ...SLICE_CONFIGS,
  ...ROUND_SLICE_CONFIGS,
  ...POLISH_SLICE_CONFIGS,
  ...GEOMETRY_SLICE_CONFIGS,
};

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const TARGETS = [
  '09', '10', '11', '12', '13', '14', '15',
  '27', '28', '31', '32', '33', '34', '35', '36',
  '25', '26', '29', '30', '37', '47', '48',
  '38', '39', '40', '41', '42', '43', '44', '49',
  '45', '46', '50', '51',
  '52', '53', '54', '55', '56', '57',
];

/** Post-patch structural assertions — blank-page regression guard */
function assertHtmlIntegrity(num, html) {
  const required = ['<body', '<header', 'id="stage"', '</html>'];
  for (const frag of required) {
    if (!html.includes(frag)) {
      throw new Error(`SJ-${num} patch regression: missing ${frag}`);
    }
  }
  if (!/<section class="sj-ledger-field" id="f2"/.test(html)) {
    throw new Error(`SJ-${num} patch regression: f2 section missing`);
  }
}

function assertGeometryCompliance(num, config) {
  const prose = config.prose || '';
  if (num === '10' && /xuanzong|anlushan|fanzhen|mubing/.test(prose)) {
    throw new Error(`SJ-10 config must not use 天宝旧 id (${FORBIDDEN_CLONE_MOTIF})`);
  }
  if (['11', '13'].includes(num) && /脆弱竖轴|首辅纵列|实线竖轴/.test(prose)) {
    console.warn(`SJ-${num}: prose may still reference vertical-spine clone — check geometry spec`);
  }
}

function injectCss(html, prefix) {
  const css = sliceCss(prefix);
  if (html.includes('.sj-node{cursor:pointer')) return html;
  const stageRe = new RegExp(`(\\.${prefix.replace('-', '\\-')}-stage svg\\{[^}]+\\})`);
  if (stageRe.test(html)) {
    return html.replace(stageRe, `$1${css}`);
  }
  const fallback = new RegExp(`(\\.${prefix.replace('-', '\\-')}-stage\\{[^}]+\\})`);
  return html.replace(fallback, `$1${css}`);
}

function replaceF2(html, config) {
  const section = buildF2Section(config.prefix, {
    prose: config.prose,
    svg: config.svg(),
    legend: config.legend,
    nodeData: config.nodeData,
    nodeEdge: config.nodeEdge,
    railSummary: config.railSummary,
  });
  const re = /<section class="sj-ledger-field" id="f2"[^>]*>[\s\S]*?<\/section>/;
  if (!re.test(html)) throw new Error('f2 section not found');
  return html.replace(re, section);
}

function extractRailToc(html) {
  const m = html.match(/\/\* rail toc highlight \*\/[\s\S]*?\}\)\(\);\s*/);
  return m ? m[0] : '';
}

function injectScript(html, config) {
  const script = sliceScript(config.nodeData, config.nodeEdge);
  const railToc = extractRailToc(html);
  // Anchor on stage IIFE — must not span from <head> theme script across the whole document.
  const stageScriptRe =
    /<script>\s*\(function\(\)\{\s*const stage\s*=\s*document\.getElementById\(['"]stage['"]\)[\s\S]*?NODE_DATA[\s\S]*?<\/script>/g;
  let cleaned = html.replace(stageScriptRe, '');
  const blocks = [script];
  if (railToc && !cleaned.includes('rail toc highlight')) {
    blocks.push(`<script>\n${railToc}</script>`);
  }
  return cleaned.replace('</body>', `${blocks.join('\n')}\n</body>`);
}

function updateRail(html, config) {
  const summary = config.railSummary;
  const miniRe = /<div class="sj-rail-card"[^>]*>\s*<div class="k">结构切片<\/div>[\s\S]*?<\/div>/g;
  const mini = `<div class="sj-rail-card" style="margin-top:8px"><div class="k">结构切片</div><p class="sj-rail-mini">${summary}</p></div>`;
  let cleaned = html.replace(miniRe, '');
  const tocRe = /(<nav class="sj-rail-toc"[^>]*>[\s\S]*?<\/nav>)/;
  if (tocRe.test(cleaned)) {
    return cleaned.replace(tocRe, `$1\n  ${mini}`);
  }
  return cleaned;
}

function addRailMiniCss(html) {
  if (html.includes('.sj-rail-mini{font-size')) return html;
  return html.replace('</style>', `.sj-rail-mini{font-size:12.5px;color:var(--sj-paper-300);line-height:1.6;margin-top:6px}\n</style>`);
}

function dedupeSliceRail(html) {
  const rails = html.match(/<!--SLICE_RAIL:[^>]+-->/g);
  if (!rails?.length) return html;
  const unique = rails[rails.length - 1];
  let out = html.replace(/<!--SLICE_RAIL:[^>]+-->\n?/g, '');
  const f2End = out.indexOf('</section>', out.indexOf('id="f2"'));
  if (f2End !== -1) {
    const insertAt = f2End + '</section>'.length;
    out = `${out.slice(0, insertAt)}\n${unique}${out.slice(insertAt)}`;
  }
  return out;
}

console.log(`Geometry spec v${GEOMETRY_SPEC_VERSION} · forbidden motif: ${FORBIDDEN_CLONE_MOTIF}`);

for (const num of TARGETS) {
  const config = ALL_SLICE_CONFIGS[num];
  if (!config) {
    console.warn('Skip', num, '— no config');
    continue;
  }
  assertGeometryCompliance(num, config);
  const path = join(OUT, `SJ-${num}.html`);
  let html = readFileSync(path, 'utf8');
  html = addRailMiniCss(html);
  html = injectCss(html, config.prefix);
  html = replaceF2(html, config);
  html = injectScript(html, config);
  html = updateRail(html, config);
  html = dedupeSliceRail(html);
  html = html.replace(/(?:[ \t]*\n){3,}/g, '\n\n'); // collapse accumulating blank/whitespace-only lines — keep re-runs idempotent
  assertHtmlIntegrity(num, html);
  writeFileSync(path, html, 'utf8');
  const nodeCount = Object.keys(config.nodeData).length;
  console.log(`Patched SJ-${num}.html · ${nodeCount} nodes`);
}

console.log('Done:', TARGETS.length, 'volumes');
