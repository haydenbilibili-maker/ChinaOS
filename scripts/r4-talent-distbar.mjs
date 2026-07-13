#!/usr/bin/env node
/**
 * Round 4 · talent Section 内联 DistBars → ui DistBar
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TALENT = path.join(__dirname, '../app/src/modules/talent');
const DRY = process.argv.includes('--dry-run');

const DISTBARS_FN = /function DistBars\(\{[\s\S]*?\n\}\n\n/;

const files = fs.readdirSync(TALENT).filter((f) => f.endsWith('Section.jsx'));
let updated = 0;

for (const file of files) {
  const fp = path.join(TALENT, file);
  let src = fs.readFileSync(fp, 'utf8');
  if (!src.includes('function DistBars')) continue;

  src = src.replace(DISTBARS_FN, '');
  src = src.replace(/<DistBars\b/g, '<DistBar');
  src = src.replace(/<\/DistBars>/g, '</DistBar>');

  if (src.includes("from '../../app/ui.jsx'")) {
    src = src.replace(
      /import \{([^}]+)\} from '\.\.\/\.\.\/app\/ui\.jsx';/,
      (m, imports) => {
        const parts = imports.split(',').map((s) => s.trim()).filter(Boolean);
        if (!parts.includes('DistBar')) parts.push('DistBar');
        return `import { ${parts.join(', ')} } from '../../app/ui.jsx';`;
      },
    );
  } else {
    src = `import { DistBar } from '../../app/ui.jsx';\n${src}`;
  }

  if (!DRY) fs.writeFileSync(fp, src);
  updated++;
  console.log('updated', file);
}

console.log(JSON.stringify({ updated, dry: DRY }));
