#!/usr/bin/env node
/**
 * VI 2.0 色彩迁移：把 1.x 霓虹色板（硬编码 hex / rgb 三元组）映射到「观象」色板。
 *
 *   node scripts/vi2-color-codemod.mjs           # 改写 app/src
 *   node scripts/vi2-color-codemod.mjs --check   # 只统计剩余旧色，有则 exit 1
 *
 * hex 保持 6 位，`${color}33` 这类拼接透明度的写法不受影响。
 * 不处理 app/public（史鉴卷与静态报告保留各自美学）。
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, extname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'app', 'src');
const EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.css']);
const CHECK = process.argv.includes('--check');

/** 旧 hex → 新 hex（小写，不含 #） */
export const HEX_MAP = {
  // 朱砂
  c41e3a: 'e5483b', e63946: 'e5483b', ef4444: 'e5483b', '8b0000': '9e2a22',
  // 霁蓝（1.x 的赛博青 / 蓝）
  '22d3ee': '6e8cff', '06b6d4': '5b7cf0', '3b82f6': '6e8cff', '67e8f9': 'a4b6ff', a5f3fc: 'c2cdff',
  // 铜
  e8a317: 'd4a25a', f59e0b: 'd4a25a', d4af37: 'd9b26a', b18a52: 'd4a25a',
  // 青瓷
  '10b981': '6fc2ae', '14b8a6': '6fc2ae', '79a496': '6fc2ae',
  // 紫檀 / 赭
  '8b5cf6': 'b07cc6', a855f7: 'b07cc6', f0abfc: 'd9a7d6', ec4899: 'c9719b', fb923c: 'c07a4a',
  // 墨灰与基底
  '64748b': '8a8578', '94a3b8': 'a29c91', '93a1b5': 'a29c91', '5b6a82': '8a847a', '27324a': '2a2d36',
  e8edf6: 'ede8df', '0a0e17': '0d0f14', '0f1623': '14171f', '1a2333': '1c202a', '0c121c': '0a0c10',
};

/** 旧 rgb 三元组 → 新三元组 */
export const RGB_MAP = [
  [[34, 211, 238], [110, 140, 255]],
  [[196, 30, 58], [229, 72, 59]],
  [[232, 163, 23], [212, 162, 90]],
  [[212, 175, 55], [217, 178, 106]],
  [[177, 138, 82], [212, 162, 90]],
  [[16, 185, 129], [111, 194, 174]],
  [[121, 164, 150], [111, 194, 174]],
  [[139, 92, 246], [176, 124, 198]],
  [[148, 163, 184], [162, 156, 145]],
  [[10, 14, 23], [13, 15, 20]],
  [[15, 22, 35], [20, 23, 31]],
  [[5, 8, 14], [7, 8, 11]],
];

const hexRe = new RegExp(`#(${Object.keys(HEX_MAP).join('|')})(?![0-9a-f])`, 'gi');
const rgbRes = RGB_MAP.map(([from, to]) => [
  new RegExp(`(rgba?\\(\\s*)${from[0]}\\s*,\\s*${from[1]}\\s*,\\s*${from[2]}(?=\\s*[,)])`, 'g'),
  `$1${to.join(', ')}`,
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === 'node_modules' || name === '__tests__') continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXT.has(extname(name))) out.push(p);
  }
  return out;
}

let files = 0;
let hits = 0;
for (const file of walk(SRC)) {
  const src = readFileSync(file, 'utf8');
  let n = 0;
  let next = src.replace(hexRe, (m, h) => { n += 1; const to = HEX_MAP[h.toLowerCase()]; return `#${m[1] === m[1].toUpperCase() && /[A-F]/.test(h) ? to.toUpperCase() : to}`; });
  for (const [re, rep] of rgbRes) next = next.replace(re, (...a) => { n += 1; return rep.replace('$1', a[1]); });
  if (n) {
    files += 1;
    hits += n;
    if (!CHECK) writeFileSync(file, next);
  }
}

console.log(`${CHECK ? '[check] 剩余旧色' : '已迁移'}：${hits} 处 · ${files} 个文件`);
if (CHECK && hits) process.exit(1);
