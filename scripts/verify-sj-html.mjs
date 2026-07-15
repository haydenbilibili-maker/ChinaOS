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

const CASE_RE = /^SJ-(0[5-9]|1[0-9]|[2-5][0-9])\.html$/;
const FORBIDDEN_IDS = ['xuanzong', 'anlushan', 'fanzhen', 'mubing'];

function verifyFile(name) {
  const path = join(SHIJIAN, name);
  const html = readFileSync(path, 'utf8');
  const errors = [];
  const warnings = [];
  const isCase = CASE_RE.test(name);

  if (!html.includes('<body')) errors.push('missing <body');
  if (!html.includes('</html>')) errors.push('missing </html>');
  if (isCase && !html.includes('<header')) errors.push('missing <header');
  if (isCase && html.includes('id="f2"') && !html.includes('id="stage"')) {
    errors.push('missing id="stage"');
  }

  if (/\blocalStorage\b|\bsessionStorage\b|\bIndexedDB\b/.test(html)) {
    errors.push('uses forbidden browser storage');
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

const files = readdirSync(SHIJIAN)
  .filter((f) => /^SJ-\d+\.html$/.test(f))
  .sort();

let fail = 0;
let warn = 0;

for (const name of files) {
  const { errors, warnings } = verifyFile(name);
  if (errors.length) {
    fail++;
    console.error(`FAIL ${name}`);
    errors.forEach((e) => console.error(`  · ${e}`));
  }
  if (warnings.length) {
    warn++;
    if (warnings.length && !errors.length) {
      console.warn(`WARN ${name}`);
      warnings.forEach((w) => console.warn(`  · ${w}`));
    }
  }
}

console.log(`\nVerified ${files.length} SJ volumes · failures: ${fail} · warnings: ${warn}`);
process.exit(fail > 0 ? 1 : 0);
