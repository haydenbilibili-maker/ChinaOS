#!/usr/bin/env node
/** Patch registry.js for Round 4 volumes */
import fs from 'node:fs';
import path from 'node:path';

const REG = path.resolve(import.meta.dirname, '../app/src/app/registry.js');
let reg = fs.readFileSync(REG, 'utf8');

const entries = [
  {
    after: "id: 'shijianSJ17'",
    block: `  {
    id: 'shijianSJ18',
    path: '/modules/shijian/sj-18',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 18,
    title: '拐点谱系矩阵',
    subtitle: '综合层 · 三拐点跨案 · 鼎盛隐性危机',
    icon: 'TrendingDown',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj18Page.jsx')),
  },
  {
    id: 'shijianSJ19',
    path: '/modules/shijian/sj-19',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 19,
    title: '分裂—重整矩阵',
    subtitle: '综合层 · 四分裂期跨案 · 军事定正统',
    icon: 'Split',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj19Page.jsx')),
  },`,
  },
  {
    after: "id: 'shijianSJ51'",
    block: `  {
    id: 'shijianSJ52',
    path: '/modules/shijian/sj-52',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 52,
    title: '五四运动',
    subtitle: '合法性叙事断裂 · 拒签和约',
    icon: 'Megaphone',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj52Page.jsx')),
  },
  {
    id: 'shijianSJ53',
    path: '/modules/shijian/sj-53',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 53,
    title: '北伐战争',
    subtitle: '军事力定正统 · 国共合作',
    icon: 'Swords',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj53Page.jsx')),
  },
  {
    id: 'shijianSJ54',
    path: '/modules/shijian/sj-54',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 54,
    title: '吴起变法',
    subtitle: '触动贵族 · 强兵抚战 · 人亡政废',
    icon: 'Scale',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj54Page.jsx')),
  },
  {
    id: 'shijianSJ55',
    path: '/modules/shijian/sj-55',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 55,
    title: '合纵连横',
    subtitle: '外交—军事博弈 · 纵横家',
    icon: 'Globe2',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj55Page.jsx')),
  },
  {
    id: 'shijianSJ56',
    path: '/modules/shijian/sj-56',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 56,
    title: '长平之战',
    subtitle: '军事消耗 · 基座承载越阈',
    icon: 'Swords',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj56Page.jsx')),
  },
  {
    id: 'shijianSJ57',
    path: '/modules/shijian/sj-57',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 57,
    title: '百家争鸣',
    subtitle: '合法性叙事竞争 · 诸子百家',
    icon: 'BookOpen',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj57Page.jsx')),
  },`,
  },
];

for (const { after, block } of entries) {
  if (reg.includes(`id: '${after.split("'")[1]}'`) && !reg.includes(block.trim().split('\n')[1].trim())) {
    const idx = reg.indexOf(after);
    const closeIdx = reg.indexOf('},', idx);
    const insertAt = closeIdx + 3;
    reg = reg.slice(0, insertAt) + '\n' + block + reg.slice(insertAt);
  }
}

// Fix icon if Split doesn't exist - use GitMerge instead
reg = reg.replace("icon: 'Split'", "icon: 'GitMerge'");
reg = reg.replace("icon: 'Megaphone'", "icon: 'Radio'");
reg = reg.replace("icon: 'BookOpen'", "icon: 'ScrollText'");

fs.writeFileSync(REG, reg);
console.log('Patched registry.js for Round 4');
