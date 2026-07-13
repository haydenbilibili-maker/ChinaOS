#!/usr/bin/env node
/**
 * Round 4 · 为缺 ModuleFooter 的 Page.jsx 批量补页脚
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES = path.join(__dirname, '../app/src/modules');
const DRY = process.argv.includes('--dry-run');

const TARGETS = [
  'heshanCalibration', 'heshanFiscal', 'heshanFactsheets', 'heshanReform',
  'signalPanel', 'cushionMonitor', 'personalReview', 'attribution',
  'threeForces', 'premierRadius', 'partySchool', 'chronicle',
  'huangfeizhai', 'legalStatutes', 'governanceHub', 'signalDashboard',
];

let updated = 0;

for (const mod of TARGETS) {
  const fp = path.join(MODULES, mod, 'Page.jsx');
  if (!fs.existsSync(fp)) continue;
  let src = fs.readFileSync(fp, 'utf8');
  if (/ModuleFooter|CrossLinks/.test(src)) continue;

  const idMatch = src.match(/export default function (\w+)/);
  const moduleId = mod;

  if (!src.includes('ModuleParadigm')) {
    src = src.replace(
      /^(import .+\n)+/m,
      (head) => `${head}import { ModuleFooter } from '../shared/ModuleParadigm.jsx';\n`,
    );
  }

  src = src.replace(
    /(\s*)<\/div>\s*\);\s*\}\s*$/,
    `$1  <ModuleFooter moduleId="${moduleId}" />\n$1</div>\n  );\n}\n`,
  );

  if (!DRY) fs.writeFileSync(fp, src);
  updated++;
  console.log('footer added:', mod);
}

console.log(JSON.stringify({ updated, dry: DRY }));
