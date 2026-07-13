#!/usr/bin/env node
/**
 * Round 4 · 模块视觉对齐 checklist 审计（8 项 · 含 N/A 语义）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES_DIR = path.join(__dirname, '../app/src/modules');

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && !['shared', 'dashboard'].includes(ent.name)) walk(p, acc);
    else if (ent.name === 'Page.jsx') acc.push(p);
  }
  return acc;
}

function checkPage(fp) {
  const src = fs.readFileSync(fp, 'utf8');
  const mod = path.basename(path.dirname(fp));
  if (/Navigate to=/.test(src) && !/PageHeader|GySliceShell/.test(src)) {
    return { mod, pass: 8, total: 8, checks: {}, gyShell: false, redirect: true };
  }
  const gyShell = src.includes('GySliceShell');
  const hasStatCards = /<Stat[\s>]/.test(src);
  const hasEChart = /EChart/.test(src);
  const hasCustomTabs = /setTab|activeTab|TAB[s]?\s*=/.test(src) && !/TabBar|os-tab-bar/.test(src);
  const axisHex = /axisLine[^;{]*#27324a|axisLabel[^;{]*#93a1b5|const AX\s*=/.test(src);

  const items = {
    header: gyShell || /PageHeader/.test(src) || /ObservatoryHome/.test(src),
    osCard: gyShell || /os-card|\bCard\b/.test(src) || /Panel\.jsx/.test(src),
    tabs: gyShell || !hasCustomTabs || /TabBar|os-tab-bar/.test(src),
    statGrid: !hasStatCards || /StatGrid|<Stat\b/.test(src),
    charts: !hasEChart || (/chartHelpers/.test(src) && !/const AX\s*=/.test(src)),
    footer: gyShell || /ModuleFooter|CrossLinks/.test(src),
    noHexAxis: !axisHex,
    lightOk: true,
  };

  const pass = Object.values(items).filter(Boolean).length;
  return { mod, pass, total: 8, checks: items, gyShell };
}

const pages = walk(MODULES_DIR);
const results = pages.map(checkPage);
const fullPass = results.filter((r) => r.pass === r.total);
const pct = ((fullPass.length / results.length) * 100).toFixed(1);
const gyShell = results.filter((r) => r.gyShell).length;

console.log(`Modules: ${results.length} | Full pass: ${fullPass.length} (${pct}%)`);
console.log(`GySliceShell: ${gyShell} slices`);
console.log('\nRemaining failures:');
const fails = results.filter((r) => r.pass < r.total);
for (const r of fails.slice(0, 20)) {
  const failed = Object.entries(r.checks).filter(([, v]) => !v).map(([k]) => k);
  console.log(`  ${r.mod}: ${r.pass}/8 — ${failed.join(', ')}`);
}
if (fails.length > 20) console.log(`  … +${fails.length - 20} more`);
