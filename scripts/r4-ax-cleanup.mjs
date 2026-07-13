#!/usr/bin/env node
/**
 * Round 4 · const AX 旧模式 → chartHelpers AXIS / LABEL / GRID_LINE
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry-run');

const FILES = [
  'app/src/modules/handong/Page.jsx',
  'app/src/modules/wargame/Page.jsx',
  'app/src/modules/macro/Page.jsx',
  'app/src/modules/me/Page.jsx',
  'app/src/modules/me/SectionLifePlan.jsx',
  'app/src/modules/me/SectionShanhai.jsx',
  'app/src/modules/me/SectionSimulator.jsx',
  'app/src/modules/me/SectionRisk.jsx',
  'app/src/modules/me/SectionValues.jsx',
  'app/src/modules/me/SectionBalance.jsx',
  'app/src/modules/ruleoflaw/Page.jsx',
  'app/src/modules/talent/Page.jsx',
];

function ensureImport(src, relDepth) {
  const imp = `import { AXIS, LABEL, GRID_LINE, CHART_SERIES_PALETTE } from '${relDepth}shared/chartHelpers.js';`;
  if (src.includes('chartHelpers')) {
    return src.replace(
      /import \{([^}]+)\} from ['"][^'"]*chartHelpers\.js['"];/,
      (m, items) => {
        const set = new Set(items.split(',').map((s) => s.trim()).filter(Boolean));
        ['AXIS', 'LABEL', 'GRID_LINE', 'CHART_SERIES_PALETTE'].forEach((x) => set.add(x));
        const rel = m.match(/from ['"]([^'"]+)['"]/)[1];
        return `import { ${[...set].join(', ')} } from '${rel}';`;
      },
    );
  }
  return src.replace(/^(import .+\n)+/m, (h) => `${h}${imp}\n`);
}

let updated = 0;

for (const rel of FILES) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) continue;
  let src = fs.readFileSync(fp, 'utf8');
  const orig = src;
  const depth = rel.includes('/me/') || rel.includes('/talent/') ? '../../' : '../';

  src = src.replace(/const AX = \{ line: '#27324a', text: '#93a1b5', split: 'rgba\(148,163,184,0\.1\)' \};\n/g, '');
  src = src.replace(/const AX = \{ text: '#93a1b5', split: 'rgba\(148,163,184,0\.1\)', splitStrong: 'rgba\(148,163,184,0\.15\)' \};\n/g, '');
  src = src.replace(/const AX = \{ axisLine: \{ lineStyle: \{ color: '#27324a' \} \}, axisLabel: \{ color: '#93a1b5' \} \};\n/g, '');
  src = src.replace(/const AX = \{ axisLine: \{ lineStyle: \{ color: '#27324a' \} \}, axisLabel: \{ color: '#93a1b5', fontSize: 10 \}, splitLine: \{ lineStyle: \{ color: 'rgba\(148,163,184,0\.08\)' \} \} \};\n/g, '');
  src = src.replace(/const SPLIT = \{ splitLine: \{ lineStyle: \{ color: 'rgba\(148,163,184,0\.1\)' \} \} \};\n/g, '');

  src = src.replace(/AX\.line/g, 'AXIS.lineStyle.color');
  src = src.replace(/AX\.text/g, 'LABEL.color');
  src = src.replace(/AX\.split/g, 'GRID_LINE.lineStyle.color');
  src = src.replace(/AX\.splitStrong/g, 'GRID_LINE.lineStyle.color');
  src = src.replace(/\.\.\.AX\b/g, '...AXIS, axisLabel: LABEL');
  src = src.replace(/\.\.\.SPLIT\b/g, '...GRID_LINE');

  if (rel.includes('talent/Page.jsx')) {
    src = src.replace(/const PAL = \[[^\]]+\];\n/g, '');
    src = src.replace(/PAL\[/g, 'CHART_SERIES_PALETTE[');
    src = src.replace(/PAL\.length/g, 'CHART_SERIES_PALETTE.length');
    src = src.replace(/axisLine: \{ lineStyle: \{ color: '#27324a' \} \}, axisLabel: \{ color: '#93a1b5', fontSize: 10 \}/g, '...AXIS, axisLabel: { ...LABEL, fontSize: 10 }');
    src = src.replace(/textStyle: \{ color: '#93a1b5'/g, 'textStyle: { color: LABEL.color');
    src = src.replace(/inRange: \{ color: \['#0f1623', '#27324a'/g, "inRange: { color: ['#0f1623', AXIS.lineStyle.color");
  }

  if (src !== orig) {
    src = ensureImport(src, depth);
    if (!DRY) fs.writeFileSync(fp, src);
    updated++;
    console.log('AX cleaned:', rel);
  }
}

console.log(JSON.stringify({ updated, dry: DRY }));
