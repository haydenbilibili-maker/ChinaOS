#!/usr/bin/env node
/**
 * Round 4 · 模块视觉对齐 checklist 审计（8 项 · 含 N/A 语义）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES_DIR = path.join(__dirname, '../app/src/modules');
const APP_DIR = path.join(__dirname, '../app/src');

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
  const htmlShell = src.includes('ShijianHtmlShell');
  const hasStatCards = /<Stat[\s>]/.test(src);
  const hasEChart = /EChart/.test(src);
  const hasCustomTabs = /setTab|activeTab|TAB[s]?\s*=/.test(src)
    && !/TabBar|SelectorBar|os-tab-bar/.test(src);
  const axisHex = /axisLine[^;{]*#27324a|axisLabel[^;{]*#93a1b5|const AX\s*=/.test(src);

  const items = {
    header: gyShell || htmlShell || /PageHeader/.test(src) || /ObservatoryHome/.test(src),
    osCard: gyShell || htmlShell || /os-card|\bCard\b/.test(src) || /Panel\.jsx/.test(src),
    tabs: gyShell || !hasCustomTabs || /TabBar|SelectorBar|os-tab-bar/.test(src),
    statGrid: !hasStatCards || /StatGrid|<Stat\b/.test(src),
    charts: !hasEChart || (/chartHelpers/.test(src) && !/const AX\s*=/.test(src)),
    footer: gyShell || htmlShell || /ModuleFooter|CrossLinks/.test(src),
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

// 共享壳层门禁：覆盖本轮 UI/UX 基线，避免“模块页全绿、全局交互回退”。
const sharedSources = {
  css: fs.readFileSync(path.join(APP_DIR, 'index.css'), 'utf8'),
  shell: fs.readFileSync(path.join(APP_DIR, 'app/Shell.jsx'), 'utf8'),
  ui: fs.readFileSync(path.join(APP_DIR, 'app/ui.jsx'), 'utf8'),
  search: fs.readFileSync(path.join(APP_DIR, 'app/GlobalSearch.jsx'), 'utf8'),
  shijian: fs.readFileSync(path.join(MODULES_DIR, 'shijian/shijian.css'), 'utf8'),
  econ: fs.readFileSync(path.join(MODULES_DIR, 'econdash/econ.css'), 'utf8'),
};
const sharedChecks = {
  globalReducedMotion: /prefers-reduced-motion:\s*reduce/.test(sharedSources.css),
  globalFocusVisible: /button:focus-visible[\s\S]*\[role='tab'\]:focus-visible/.test(sharedSources.css),
  mobile390Baseline: /@media\s*\(max-width:\s*480px\)/.test(sharedSources.css),
  responsiveTableShell: /\.os-table-scroll/.test(sharedSources.css),
  skipLink: /os-skip-link/.test(sharedSources.shell) && /id="main-content"/.test(sharedSources.shell),
  drawerFocusReturn: /drawerTriggerRef/.test(sharedSources.shell) && /trapFocus/.test(sharedSources.shell),
  tabKeyboardAndResize: /ArrowRight/.test(sharedSources.ui) && /ResizeObserver/.test(sharedSources.ui),
  searchDialogFocusTrap: /aria-modal="true"/.test(sharedSources.search) && /e\.key === 'Tab'/.test(sharedSources.search),
  iframeResponsiveAndReduced: /max-width:\s*420px/.test(sharedSources.shijian)
    && /prefers-reduced-motion:\s*reduce/.test(sharedSources.shijian),
  econReducedMotion: /prefers-reduced-motion:\s*reduce/.test(sharedSources.econ),
};
const sharedFails = Object.entries(sharedChecks).filter(([, ok]) => !ok).map(([name]) => name);
console.log(`\nShared UI baseline: ${Object.keys(sharedChecks).length - sharedFails.length}/${Object.keys(sharedChecks).length}`);
if (sharedFails.length) console.log(`  failures: ${sharedFails.join(', ')}`);
if (fails.length || sharedFails.length) process.exitCode = 1;
