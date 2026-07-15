#!/usr/bin/env node
/**
 * Clean verified 〔存疑〕 placeholders per 案例库-核心母本.md 核验补正.
 * Keeps 存疑 on disputed estimates (兵力/人口/税率).
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

/** Per-file replacements: [from, to] */
const REPLACEMENTS = {
  'SJ-27.html': [
    ['人口数字标〔存疑〕', '人口数字学界估算差异大，须标出处'],
    ['三十税一〔存疑〕', '三十税一（《汉书·食货志》载文帝时田租税率，学界有争议）'],
    ['田租十五税一→三十税一〔存疑〕', '田租十五税一→三十税一（《汉书·食货志》）'],
  ],
  'SJ-31.html': [
    ['兵力数字标〔存疑〕', '兵力数字学界估算差异大，须标出处'],
    ['士众数十万〔存疑〕', '士众数十万（《三国志》载，实际作战兵力存争议）'],
  ],
  'SJ-33.html': [
    ['「投鞭断流」〔存疑〕式兵力误判', '「投鞭断流」式兵力误判（《晋书》载八十万，实际远低）'],
    ['号称百万〔存疑〕', '号称百万（《晋书》载八十万，实际作战兵力存争议）'],
    ['《晋书》载苻坚众八十万〔存疑〕', '《晋书》载苻坚众八十万（实际作战兵力存争议）'],
    ['账面优势≠战场效能〔存疑〕', '账面优势≠战场效能（《晋书》载八十万，实际远低）'],
  ],
  'SJ-35.html': [
    ['具体户数〔存疑〕', '具体户数学界估算差异大'],
    ['〔存疑〕</p></article></div>', '（通说）</p></article></div>'],
  ],
  'SJ-38.html': [
    ['「天可汗」系年〔存疑〕', '「天可汗」系年（《旧唐书·太宗本纪》）'],
    ['〔存疑〕</p></article></div>', '（通说）</p></article></div>'],
  ],
  'SJ-39.html': [
    ['〔存疑〕</p></article></div>', '（通说）</p></article></div>'],
  ],
  'SJ-41.html': [
    ['兵力数字〔存疑〕', '兵力数字学界估算差异大'],
    ['〔存疑〕</p></article></div>', '（通说）</p></article></div>'],
  ],
  'SJ-45.html': [
    ['〔户数存疑〕', ''],
    ['〔存疑〕</p></article></div>', '（通说，1287/1330 系年已核）</p></article></div>'],
  ],
  'SJ-46.html': [
    ['〔存疑〕</p></article></div>', '（通说，1351 系年已核）</p></article></div>'],
  ],
  'SJ-49.html': [
    ['人口逼近马尔萨斯天花板〔存疑〕', '人口逼近马尔萨斯天花板（何炳棣等估算，须标出处）'],
    ['人口 3–4 亿〔存疑〕', '人口约 3–4 亿（何炳棣估算，须标出处）'],
    ['〔存疑〕</p></article></div>', '（学界对 peak vs turning point 有重估之争）</p></article></div>'],
  ],
  'SJ-50.html': [
    ['约五千万至七千万〔存疑，须标出处〕', '约五千万至七千万（曹树基《中国人口史》等，标估算）'],
    ['人口〔存疑〕', '人口估算'],
    ['5000万–7000万〔存疑〕', '5000万–7000万（估算·曹树基等）'],
    ['〔存疑〕</p></article></div>', '（学界对人口损失与革命性质争议大）</p></article></div>'],
  ],
  'SJ-51.html': [
    ['〔存疑〕</p></article></div>', '（通说，1898 系年已核）</p></article></div>'],
  ],
  'SJ-32.html': [
    ['选官制度与军事功勋通道分离〔存疑〕', '选官制度与军事功勋通道渐趋分离（魏晋之际通说）'],
  ],
  'SJ-34.html': [
    ['〔存疑〕</p></article></div>', '（通说，均田/迁都系年已核）</p></article></div>'],
  ],
};

let changed = 0;
for (const [file, reps] of Object.entries(REPLACEMENTS)) {
  const path = join(OUT, file);
  let html = readFileSync(path, 'utf8');
  const before = html;
  for (const [from, to] of reps) {
    html = html.split(from).join(to);
  }
  if (html !== before) {
    writeFileSync(path, html, 'utf8');
    changed++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Done: ${changed} files cleaned`);
