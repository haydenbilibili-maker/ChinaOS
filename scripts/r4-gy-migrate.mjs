#!/usr/bin/env node
/**
 * Round 4 · GY 人群切片批量迁移 GySliceShell
 * 用法: node scripts/r4-gy-migrate.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const MODULES = path.join(ROOT, 'app/src/modules');
const DRY = process.argv.includes('--dry-run');

/** @type {Record<string, { id: string }>} */
const SKIP = {
  qingnian: true, // 已试点
  renqunTupu: true, // 母索引含额外 Section，保留手写结构
  guoyun: true,
  yishixingtai: true,
};

const POPULATION_IDS = [
  'xingshaoshu', 'linggong', 'nongmingong', 'tizhinei', 'zhongchan', 'laonian',
  'tajian', 'zhixiao', 'tuiyi', 'yiyi', 'liupiao', 'yibao', 'lian', 'zhongnv',
  'canzhang', 'danshen', 'xianyu', 'xinyimin', 'jigong', 'manbing', 'moshao',
  'shidu', 'shuzi', 'huoche', 'chengxu', 'getihu', 'liushou', 'jiazheng',
  'zhaiwu', 'qingjiao', 'manjiu', 'xinnong', 'yulun', 'yihu', 'jiaoshi', 'baoan',
  'wangyue', 'baoxian', 'minqi', 'jipin', 'jiaozheng', 'funv', 'binzang',
  'junren', 'bianjiang', 'jiedu', 'zhiyebing', 'zhengdi', 'fangui', 'hanjian',
  'ertong', 'jingzhang', 'gongyi', 'ganran', 'xinfang',
];

function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function extractPageHeader(src) {
  const badge = src.match(/badge="([^"]+)"/)?.[1];
  const title = src.match(/title="([^"]+)"/)?.[1];
  const subtitle = src.match(/subtitle="([^"]+)"/)?.[1];
  const panelMatch = src.match(/import\s+(\w+)\s+from\s+'\.\/(\w+Panel)\.jsx'/);
  const cssMatch = src.match(/import\s+'\.\/([\w-]+)\.css'/);
  const commentMatch = src.match(/\/\*\*[\s\S]*?\*\//);
  return { badge, title, subtitle, panelImport: panelMatch?.[1], panelFile: panelMatch?.[2], css: cssMatch?.[1], comment: commentMatch?.[0] };
}

function extractAppId(panelSrc) {
  const m = panelSrc.match(/id="([a-z]{2,3}-app)"/);
  return m?.[1];
}

function migratePage(moduleId) {
  const dir = path.join(MODULES, moduleId);
  const pagePath = path.join(dir, 'Page.jsx');
  if (!fs.existsSync(pagePath)) return { moduleId, status: 'skip', reason: 'no Page.jsx' };
  if (SKIP[moduleId]) return { moduleId, status: 'skip', reason: 'excluded' };

  const pageSrc = fs.readFileSync(pagePath, 'utf8');
  if (pageSrc.includes('GySliceShell')) return { moduleId, status: 'skip', reason: 'already migrated' };

  const meta = extractPageHeader(pageSrc);
  if (!meta.badge || !meta.title || !meta.panelImport) {
    return { moduleId, status: 'fail', reason: 'cannot parse PageHeader/Panel' };
  }

  const panelPath = path.join(dir, `${meta.panelFile}.jsx`);
  const panelSrc = fs.existsSync(panelPath) ? fs.readFileSync(panelPath, 'utf8') : '';
  const appId = extractAppId(panelSrc);
  if (!appId) return { moduleId, status: 'fail', reason: 'no app id in Panel' };

  const fnName = `${pascal(moduleId)}Page`;
  const comment = meta.comment || `/**\n * 中国人群分析 · ${meta.title}\n */`;
  const newPage = `import GySliceShell from '../shared/gy/GySliceShell.jsx';
import ${meta.panelImport} from './${meta.panelFile}.jsx';
import './${meta.css || moduleId}.css';

${comment}
export default function ${fnName}() {
  return (
    <GySliceShell
      badge="${meta.badge}"
      title="${meta.title}"
      subtitle="${meta.subtitle || ''}"
      appId="${appId}"
      moduleId="${moduleId}"
      className="${moduleId.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)}-page"
    >
      <${meta.panelImport} />
    </GySliceShell>
  );
}
`;

  let newPanel = panelSrc;
  if (panelSrc.includes(`id="${appId}"`)) {
    newPanel = panelSrc.replace(new RegExp(`\\s*id="${appId}"\\n`), '\n');
  }

  if (!DRY) {
    fs.writeFileSync(pagePath, newPage);
    if (newPanel !== panelSrc) fs.writeFileSync(panelPath, newPanel);
  }
  return { moduleId, status: 'ok', appId };
}

const results = POPULATION_IDS.map(migratePage);
const ok = results.filter((r) => r.status === 'ok');
const skip = results.filter((r) => r.status === 'skip');
const fail = results.filter((r) => r.status === 'fail');

console.log(JSON.stringify({ dry: DRY, ok: ok.length, skip: skip.length, fail: fail.length, failDetails: fail }, null, 2));
