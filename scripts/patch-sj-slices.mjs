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

/** Geometry spec (§1) wins over legacy premium configs; never re-apply vertical-spine clone. */
const ALL_SLICE_CONFIGS = { ...SLICE_CONFIGS, ...GEOMETRY_SLICE_CONFIGS };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const TARGETS = [
  '09', '10', '11', '12', '13', '14', '15',
  '27', '31', '32', '33', '34',
  '35', '38', '39', '41', '49',
];

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
  let cleaned = html.replace(/<script>[\s\S]*?getElementById\(['"]stage['"]\)[\s\S]*?<\/script>/g, '');
  const blocks = [script];
  if (railToc && !cleaned.includes('rail toc highlight')) {
    blocks.push(`<script>\n${railToc}</script>`);
  }
  return cleaned.replace('</body>', `${blocks.join('\n')}\n</body>`);
}

function updateRail(html, config) {
  const summary = config.railSummary;
  const miniRe = /<div class="sj-rail-card">\s*<div class="k">结构切片<\/div>[\s\S]*?<\/div>/;
  const mini = `<div class="sj-rail-card">
    <div class="k">结构切片</div>
    <p class="sj-rail-mini">${summary}</p>
  </div>`;
  if (miniRe.test(html)) {
    return html.replace(miniRe, mini);
  }
  const tocRe = /(<nav class="sj-rail-toc"[^>]*>[\s\S]*?<\/nav>)/;
  if (tocRe.test(html)) {
    return html.replace(tocRe, `$1\n  <div class="sj-rail-card" style="margin-top:8px"><div class="k">结构切片</div><p style="font-size:12.5px;color:var(--sj-paper-300);line-height:1.6">${summary}</p></div>`);
  }
  return html;
}

function addRailMiniCss(html) {
  if (html.includes('.sj-rail-mini{font-size')) return html;
  return html.replace('</style>', `.sj-rail-mini{font-size:12.5px;color:var(--sj-paper-300);line-height:1.6;margin-top:6px}\n</style>`);
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
  writeFileSync(path, html, 'utf8');
  const nodeCount = Object.keys(config.nodeData).length;
  console.log(`Patched SJ-${num}.html · ${nodeCount} nodes`);
}

console.log('Done:', TARGETS.length, 'volumes');
