#!/usr/bin/env node
/** 为含 EChart 但缺 chartHelpers 的 Page.jsx 补最小 import */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES = path.join(__dirname, '../app/src/modules');

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name === 'Page.jsx') acc.push(p);
  }
  return acc;
}

let n = 0;
for (const fp of walk(MODULES)) {
  let src = fs.readFileSync(fp, 'utf8');
  if (!/EChart/.test(src) || /chartHelpers/.test(src)) continue;
  src = src.replace(
    /import EChart from '([^']+)';/,
    "import EChart from '$1';\nimport { AXIS, LABEL, GRID_LINE } from '../shared/chartHelpers.js';",
  );
  fs.writeFileSync(fp, src);
  n++;
  console.log(path.relative(MODULES, fp));
}
console.log({ updated: n });
