#!/usr/bin/env node
/**
 * 学者专栏数据契约门禁：逐个检查 app/src/modules/scholars/<dir>/data.js 与 stances.js。
 * 用法：node scripts/check-scholars.mjs [dir ...]（缺省检查全部学者目录）。只读、无网络。
 */
import { existsSync, readdirSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { MODULES } from '../app/src/app/registry.js';
import { STANCE_ISSUES } from '../app/src/modules/scholars/schema.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = join(ROOT, 'app/src/modules/scholars');
const ROUTES = new Set(MODULES.map((m) => m.path));
const ISSUE_IDS = new Set(STANCE_ISSUES.map((i) => i.id));
const VERIFY = new Set(['primary', 'media', 'reprint', 'doubt']);
const TYPES = new Set(['原话', '转述']);
const STATUS = new Set(['done', 'failed', 'open']);
const DATE_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const REQUIRED = [
  'AS_OF', 'THEMES', 'THEME_KEYS', 'PROFILE', 'CAREER', 'CAREER_GROUPS', 'BOOKS', 'CORPUS', 'CLAIMS', 'QUOTES',
  'THEME_INTRO', 'THEME_LINKS', 'FEATURED', 'LEDGER', 'FRAMEWORK', 'CONTROVERSIES', 'DOUBTFUL', 'COUNTS', 'BOARD',
];

const dirs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(BASE).filter((d) => statSync(join(BASE, d)).isDirectory() && existsSync(join(BASE, d, 'data.js')));

let failures = 0;

for (const dir of dirs) {
  const errs = [];
  const warn = [];
  const D = await import(pathToFileURL(join(BASE, dir, 'data.js')).href);
  const hasBoard = !!D.BOARD;

  for (const key of REQUIRED) {
    if (D[key] === undefined && !(dir === 'huangQifan' && !hasBoard)) errs.push(`缺少导出 ${key}`);
  }
  if (!D.THEMES || !D.CORPUS) {
    console.error(`FAIL ${dir}: 数据不完整，跳过`);
    failures += 1;
    continue;
  }

  const themeKeys = new Set(Object.keys(D.THEMES));
  const corpusIds = new Set();
  for (const k of D.CORPUS) {
    if (corpusIds.has(k.id)) errs.push(`CORPUS id 重复 ${k.id}`);
    corpusIds.add(k.id);
    if (!DATE_RE.test(String(k.date))) errs.push(`CORPUS ${k.id} 日期格式 ${k.date}`);
    if (!VERIFY.has(k.verified)) errs.push(`CORPUS ${k.id} verified=${k.verified}`);
    if (!k.venue || !k.source || !k.form) errs.push(`CORPUS ${k.id} 缺 venue/source/form`);
    (k.themes ?? []).forEach((t) => { if (!themeKeys.has(t)) errs.push(`CORPUS ${k.id} 未知领域 ${t}`); });
    if (!k.themes?.length) errs.push(`CORPUS ${k.id} 无领域标注`);
  }

  const claimIds = new Set();
  for (const c of D.CLAIMS) {
    if (claimIds.has(c.id)) errs.push(`CLAIM id 重复 ${c.id}`);
    claimIds.add(c.id);
    if (!TYPES.has(c.type)) errs.push(`CLAIM ${c.id} type=${c.type}`);
    if (!themeKeys.has(c.theme)) errs.push(`CLAIM ${c.id} 未知领域 ${c.theme}`);
    if (!c.date || !c.venue || !c.source) errs.push(`CLAIM ${c.id} 缺出处（CORPUS 引用失效？）`);
    if (!VERIFY.has(c.verified)) errs.push(`CLAIM ${c.id} verified=${c.verified}`);
    if (c.type === '原话' && /^「|」$/.test(c.text)) errs.push(`CLAIM ${c.id} 原话文本自带「」（展示件会自动加）`);
  }

  for (const t of D.THEME_KEYS ?? []) {
    if (!D.THEME_INTRO?.[t]) errs.push(`THEME_INTRO 缺 ${t}`);
    if (!D.CLAIMS.some((c) => c.theme === t)) warn.push(`领域 ${t} 无观点条目`);
  }
  for (const [t, links] of Object.entries(D.THEME_LINKS ?? {})) {
    if (!themeKeys.has(t)) errs.push(`THEME_LINKS 未知领域 ${t}`);
    links.forEach((l) => { if (!ROUTES.has(String(l.to).split(/[?#]/)[0])) errs.push(`THEME_LINKS 未注册路由 ${l.to}`); });
  }
  for (const id of D.FEATURED ?? []) {
    const q = D.CLAIMS.find((c) => c.id === id);
    if (!q) errs.push(`FEATURED 引用不存在 ${id}`);
    else if (q.type !== '原话') errs.push(`FEATURED ${id} 不是原话`);
  }

  for (const r of D.CAREER ?? []) {
    if (hasBoard && !D.CAREER_GROUPS?.[r.group]) errs.push(`CAREER ${r.id} 未知 group ${r.group}`);
    if (!(r.start <= r.end)) errs.push(`CAREER ${r.id} 起止倒置`);
  }
  for (const b of D.BOOKS) {
    if (!VERIFY.has(b.verified)) errs.push(`BOOK ${b.id} verified=${b.verified}`);
    (b.themes ?? []).forEach((t) => { if (!themeKeys.has(t)) errs.push(`BOOK ${b.id} 未知领域 ${t}`); });
    if (b.verified !== 'doubt' && !b.year) errs.push(`BOOK ${b.id} 非存疑但无 year`);
  }
  for (const l of D.LEDGER) {
    if (!STATUS.has(l.status)) errs.push(`LEDGER ${l.id} status=${l.status}`);
    if (!TYPES.has(l.type)) errs.push(`LEDGER ${l.id} type=${l.type}`);
    if (!l.check || !l.dataSrc || !l.venue || !l.date) errs.push(`LEDGER ${l.id} 缺 check/dataSrc/venue/date`);
  }
  const nodeIds = new Set((D.FRAMEWORK?.nodes ?? []).map((n) => n.id));
  (D.FRAMEWORK?.links ?? []).forEach(([a, b]) => {
    if (!nodeIds.has(a) || !nodeIds.has(b)) errs.push(`FRAMEWORK 连线悬挂 ${a}-${b}`);
  });
  (D.FRAMEWORK?.nodes ?? []).forEach((n) => {
    if (!(n.cat >= 0 && n.cat < D.FRAMEWORK.categories.length)) errs.push(`FRAMEWORK 节点 ${n.id} cat 越界`);
  });
  if (hasBoard) {
    for (const key of ['order', 'subtitle', 'span', 'careerTitle', 'moduleId', 'sourceNote']) {
      if (D.BOARD[key] === undefined) errs.push(`BOARD 缺 ${key}`);
    }
  }

  const stancePath = join(BASE, dir, 'stances.js');
  if (existsSync(stancePath)) {
    const { STANCES } = await import(pathToFileURL(stancePath).href);
    for (const [issue, s] of Object.entries(STANCES ?? {})) {
      if (!ISSUE_IDS.has(issue)) errs.push(`STANCES 未知议题 ${issue}`);
      if (!s.stance || !s.date || !s.venue || !s.source) errs.push(`STANCES ${issue} 缺 stance/date/venue/source`);
      if (!TYPES.has(s.type)) errs.push(`STANCES ${issue} type=${s.type}`);
      if (!VERIFY.has(s.verified)) errs.push(`STANCES ${issue} verified=${s.verified}`);
      if (s.type === '原话' && !s.quote) errs.push(`STANCES ${issue} 标原话但缺 quote`);
    }
  } else {
    warn.push('缺 stances.js');
  }

  const q = D.CLAIMS.filter((c) => c.type === '原话').length;
  const p = D.CLAIMS.length - q;
  console.log(`${errs.length ? 'FAIL' : 'OK  '} ${dir}: 原话 ${q} · 转述 ${p} · 文库 ${D.CORPUS.length} · 著作 ${D.BOOKS.length} · 台账 ${D.LEDGER.length} · 存疑/不收录 ${D.DOUBTFUL.length}`);
  warn.forEach((w) => console.warn(`  WARN ${w}`));
  errs.forEach((e) => console.error(`  FAIL ${e}`));
  failures += errs.length;
}

console.log(`Scholars: ${dirs.length} dirs · ${failures} failures`);
process.exit(failures ? 1 : 0);
