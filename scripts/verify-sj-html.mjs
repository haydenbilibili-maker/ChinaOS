#!/usr/bin/env node
/**
 * Verify SJ HTML volumes: structural integrity + geometry compliance hints.
 * Run after patch-sj-slices.mjs.
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { FORBIDDEN_CLONE_MOTIF } from './lib/sj-slice-geometries.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHIJIAN = join(ROOT, 'app/public/shijian');
const SHIJIAN_WORLD = join(ROOT, 'app/public/shijian-world');

const CASE_RE = /^SJ-(0[5-9]|1[0-9]|[2-5][0-9])\.html$/;
const FORBIDDEN_IDS = ['xuanzong', 'anlushan', 'fanzhen', 'mubing'];

function verifyFile(dir, name, series) {
  const path = join(dir, name);
  const html = readFileSync(path, 'utf8');
  const errors = [];
  const warnings = [];
  const isCase = series === 'SJ' && CASE_RE.test(name);

  if (!html.includes('<body')) errors.push('missing <body');
  if (!html.includes('<header')) errors.push('missing <header');
  if (!html.includes('<footer')) errors.push('missing <footer');
  if (!html.includes('<svg')) errors.push('missing signature SVG');
  if (!html.includes('</html>')) errors.push('missing </html>');
  if (!html.includes('prefers-reduced-motion')) errors.push('missing reduced-motion fallback');
  if (isCase && html.includes('id="f2"') && !html.includes('id="stage"')) {
    errors.push('missing id="stage"');
  }

  if (/\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|\bIndexedDB\b|\bdocument\.cookie\b/.test(html)) {
    errors.push('uses forbidden browser storage');
  }
  if (/<script\b[^>]*\bsrc\s*=|<link\b[^>]*\b(?:href|rel)\s*=/i.test(html)) {
    errors.push('uses external script/link dependency');
  }
  if (/\bfetch\s*\(|\bXMLHttpRequest\b/.test(html)) {
    errors.push('uses forbidden network request');
  }

  if (isCase && html.includes('id="f2"')) {
    const nodeIds = [...html.matchAll(/class="sj-node"[^>]*data-id="([^"]+)"/g)].map((m) => m[1]);
    const dataMatch = html.match(/const NODE_DATA=\{([\s\S]*?)\};/);
    if (dataMatch) {
      const dataKeys = [...dataMatch[1].matchAll(/"([^"]+)":\s*\{/g)].map((m) => m[1]);
      const nodeSet = new Set(nodeIds);
      for (const id of nodeIds) {
        if (!dataKeys.includes(id)) errors.push(`NODE_DATA missing key: ${id}`);
      }
      // NODE_DATA may include edge-only pick targets (data-edge keys without .sj-node)
      const edgeIds = new Set(
        [...html.matchAll(/class="sj-edge"[^>]*data-edge="([^"]+)"/g)].map((m) => m[1]),
      );
      for (const id of dataKeys) {
        if (!nodeSet.has(id) && !edgeIds.has(id)) {
          errors.push(`orphan NODE_DATA key (no node/edge): ${id}`);
        }
      }
    }

    if (name === 'SJ-10.html') {
      for (const id of FORBIDDEN_IDS) {
        if (html.includes(id)) errors.push(`SJ-10 forbidden id: ${id}`);
      }
    }

    const num = name.match(/SJ-(\d+)/)[1];
    if (!['05'].includes(num) && /脆弱皇权竖轴|首辅纵列/.test(html)) {
      warnings.push(`possible ${FORBIDDEN_CLONE_MOTIF} in prose`);
    }
  }

  return { name, errors, warnings };
}

const collections = [
  {
    series: 'SJ',
    dir: SHIJIAN,
    files: readdirSync(SHIJIAN).filter((f) => /^SJ-\d{2}\.html$/.test(f)).sort(),
  },
  {
    series: 'SJW',
    dir: SHIJIAN_WORLD,
    files: readdirSync(SHIJIAN_WORLD).filter((f) => /^SJW-\d{2}\.html$/.test(f)).sort(),
  },
];

let fail = 0;
let warn = 0;

for (const collection of collections) {
  for (const name of collection.files) {
    const { errors, warnings } = verifyFile(collection.dir, name, collection.series);
    if (errors.length) {
      fail++;
      console.error(`FAIL ${name}`);
      errors.forEach((e) => console.error(`  · ${e}`));
    }
    if (warnings.length) {
      warn++;
      if (!errors.length) {
        console.warn(`WARN ${name}`);
        warnings.forEach((w) => console.warn(`  · ${w}`));
      }
    }
  }
}

const summary = collections.map((c) => `${c.files.length} ${c.series}`).join(' + ');
console.log(`\nVerified ${summary} volumes · failures: ${fail} · warnings: ${warn}`);
process.exit(fail > 0 ? 1 : 0);
