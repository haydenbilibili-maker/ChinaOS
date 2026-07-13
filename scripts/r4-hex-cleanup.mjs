#!/usr/bin/env node
/**
 * Round 4 · 图表轴色硬编码清理 (#27324a / #93a1b5 → chartHelpers token)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES = path.join(__dirname, '../app/src/modules');
const DRY = process.argv.includes('--dry-run');

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(jsx|js)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

let updated = 0;

for (const fp of walk(MODULES)) {
  if (fp.includes('chartHelpers.js')) continue;
  let src = fs.readFileSync(fp, 'utf8');
  if (!/#27324a|#93a1b5/.test(src)) continue;
  if (/const AX\s*=/.test(src)) continue; // hand-tune AX modules

  const orig = src;
  src = src.replace(/color:\s*'#27324a'/g, 'color: AXIS.lineStyle.color');
  src = src.replace(/color:\s*"#27324a"/g, 'color: AXIS.lineStyle.color');
  src = src.replace(/color:\s*'#93a1b5'/g, 'color: LABEL.color');
  src = src.replace(/color:\s*"#93a1b5"/g, 'color: LABEL.color');

  if (src === orig) continue;

  if (!/\bAXIS\b/.test(src) || !/\bLABEL\b/.test(src)) {
    if (src.includes("from '../shared/chartHelpers.js'") || src.includes('from "../../shared/chartHelpers.js"')) {
      src = src.replace(
        /import \{([^}]+)\} from ['"](\.\.\/)+shared\/chartHelpers\.js['"];/,
        (m, imports, dots) => {
          const parts = new Set(imports.split(',').map((s) => s.trim()).filter(Boolean));
          parts.add('AXIS');
          parts.add('LABEL');
          return `import { ${[...parts].join(', ')} } from '${dots || '../'}shared/chartHelpers.js';`;
        },
      );
    } else {
      const depth = fp.includes('/talent/') ? '../../' : '../';
      const rel = fp.includes('/modules/me/') ? '../../' : depth;
      src = `import { AXIS, LABEL } from '${rel}shared/chartHelpers.js';\n${src}`;
    }
  }

  if (!DRY) fs.writeFileSync(fp, src);
  updated++;
  console.log('hex cleaned:', path.relative(MODULES, fp));
}

console.log(JSON.stringify({ updated, dry: DRY }));
