#!/usr/bin/env node
/** Patch registry.js for Round 5 volumes */
import fs from 'node:fs';
import path from 'node:path';

const REG = path.resolve(import.meta.dirname, '../app/src/app/registry.js');
let reg = fs.readFileSync(REG, 'utf8');

const entries = [
  {
    after: "id: 'shijianSJ27'",
    block: `  {
    id: 'shijianSJ28',
    path: '/modules/shijian/sj-28',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 28,
    eventYear: -119,
    title: '汉武帝扩张',
    subtitle: '军事力强化 vs 财政越阈',
    icon: 'Swords',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj28Page.jsx')),
  },`,
  },
  {
    after: "id: 'shijianSJ35'",
    block: `  {
    id: 'shijianSJ36',
    path: '/modules/shijian/sj-36',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 36,
    eventYear: 605,
    title: '大运河',
    subtitle: '基座—财政耦合 · 工程过载',
    icon: 'Route',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj36Page.jsx')),
  },`,
  },
  {
    after: "id: 'shijianSJ39'",
    block: `  {
    id: 'shijianSJ40',
    path: '/modules/shijian/sj-40',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 40,
    eventYear: 875,
    title: '黄巢起义',
    subtitle: '崩解期基座引燃',
    icon: 'Flame',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj40Page.jsx')),
  },`,
  },
  {
    after: "id: 'shijianSJ41'",
    block: `  {
    id: 'shijianSJ42',
    path: '/modules/shijian/sj-42',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 42,
    eventYear: 1138,
    title: '南宋偏安',
    subtitle: '区域再配置 · 守江必守淮',
    icon: 'Map',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj42Page.jsx')),
  },
  {
    id: 'shijianSJ43',
    path: '/modules/shijian/sj-43',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 43,
    eventYear: 1005,
    title: '澶渊之盟',
    subtitle: '边疆—财政交易 · 岁币换和平',
    icon: 'Handshake',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj43Page.jsx')),
  },
  {
    id: 'shijianSJ44',
    path: '/modules/shijian/sj-44',
    group: 'shijian',
    subgroup: 'cases',
    navOrder: 44,
    eventYear: 1219,
    title: '蒙古西征',
    subtitle: '军事力扩张极限 · 花剌子模',
    icon: 'Globe2',
    accent: '#a83b2c',
    component: lazy(() => import('../modules/shijian/Sj44Page.jsx')),
  },`,
  },
];

for (const { after, block } of entries) {
  const id = after.match(/'([^']+)'/)[1];
  if (reg.includes(`id: '${id}'`) && !reg.includes(block.trim().split('\n')[1]?.trim() || '___')) {
    const firstNewId = block.match(/id: '([^']+)'/)?.[1];
    if (firstNewId && !reg.includes(`id: '${firstNewId}'`)) {
      const idx = reg.indexOf(after);
      const closeIdx = reg.indexOf('},', idx);
      const insertAt = closeIdx + 3;
      reg = reg.slice(0, insertAt) + '\n' + block + reg.slice(insertAt);
    }
  }
}

// synthesis band marker
for (const id of ['shijianSJ07', 'shijianSJ16', 'shijianSJ17', 'shijianSJ18', 'shijianSJ19']) {
  if (reg.includes(`id: '${id}'`) && !reg.includes(`id: '${id}'`, reg.indexOf(`casesBand: 'synthesis'`))) {
    reg = reg.replace(
      new RegExp(`(id: '${id}',[\\s\\S]*?subgroup: 'cases',)\\n`),
      `$1\n    casesBand: 'synthesis',\n`,
    );
  }
}

reg = reg.replace("icon: 'Handshake'", "icon: 'Globe2'");

fs.writeFileSync(REG, reg);
console.log('Patched registry.js for Round 5');
