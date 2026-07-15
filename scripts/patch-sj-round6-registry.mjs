#!/usr/bin/env node
/** Patch registry.js for Round 6 volumes SJ-25/26/29/30/37/47/48 */
import fs from 'node:fs';
import path from 'node:path';

const REG = path.resolve(import.meta.dirname, '../app/src/app/registry.js');
let reg = fs.readFileSync(REG, 'utf8');

const inserts = [
  {
    after: "id: 'shijianSJ13'",
    block: `  {
    id: 'shijianSJ25',
    path: '/modules/shijian/sj-25',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 25,
    eventYear: -221,
    title: '秦统一六国',
    subtitle: '制度升级 vs 战争机器',
    icon: 'Crown',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj25Page.jsx')),
  },
  {
    id: 'shijianSJ26',
    path: '/modules/shijian/sj-26',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 26,
    eventYear: -213,
    title: '焚书坑儒',
    subtitle: '合法性叙事力自毁',
    icon: 'BookX',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj26Page.jsx')),
  },`,
  },
  {
    after: "id: 'shijianSJ28'",
    block: `  {
    id: 'shijianSJ29',
    path: '/modules/shijian/sj-29',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 29,
    eventYear: 166,
    title: '东汉党锢',
    subtitle: '精英循环堵塞',
    icon: 'Users',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj29Page.jsx')),
  },
  {
    id: 'shijianSJ30',
    path: '/modules/shijian/sj-30',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 30,
    eventYear: 184,
    title: '黄巾起义',
    subtitle: '基座承载越阈',
    icon: 'Flame',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj30Page.jsx')),
  },`,
  },
  {
    after: "id: 'shijianSJ36'",
    block: `  {
    id: 'shijianSJ37',
    path: '/modules/shijian/sj-37',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 37,
    eventYear: 618,
    title: '隋末崩解',
    subtitle: '工程过载+军事透支',
    icon: 'Flame',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj37Page.jsx')),
  },`,
  },
  {
    after: "id: 'shijianSJ46'",
    block: `  {
    id: 'shijianSJ47',
    path: '/modules/shijian/sj-47',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 47,
    eventYear: 1449,
    title: '土木之变',
    subtitle: '军事决策失败',
    icon: 'Swords',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj47Page.jsx')),
  },
  {
    id: 'shijianSJ48',
    path: '/modules/shijian/sj-48',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 48,
    eventYear: 1405,
    title: '郑和下西洋',
    subtitle: '合法性象征投入',
    icon: 'Ship',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj48Page.jsx')),
  },`,
  },
];

for (const { after, block } of inserts) {
  const firstId = block.match(/id: '([^']+)'/)?.[1];
  if (firstId && reg.includes(`id: '${firstId}'`)) continue;
  const idx = reg.indexOf(after);
  if (idx < 0) continue;
  const closeIdx = reg.indexOf('},', idx);
  const insertAt = closeIdx + 3;
  reg = reg.slice(0, insertAt) + '\n' + block + reg.slice(insertAt);
}

fs.writeFileSync(REG, reg);
console.log('Patched registry.js for Round 6');
