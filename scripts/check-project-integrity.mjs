#!/usr/bin/env node
/**
 * ChinaOS 通用完整性门禁：registry / 路由 / 静态史鉴卷 / 交叉链接 / 数据基准日。
 * 只读、幂等；不导入页面组件，不发网络请求。
 */
import { existsSync, readFileSync, readdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { GROUPS, MODULES } from '../app/src/app/registry.js';
import { MODULE_ICONS } from '../app/src/app/moduleIcons.js';
import CROSS_LINKS from '../app/src/modules/shared/moduleCrossLinks.js';
import {
  SHIJIAN_CHINA_SUBGROUPS,
  SHIJIAN_WORLD_SUBGROUPS,
} from '../app/src/lib/shijian/navOrder.js';
import { AS_OF_BASELINE } from '../app/src/lib/config/asOfBaseline.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

function duplicateValues(items, pick) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items) {
    const value = pick(item);
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function pushDuplicates(label, values) {
  if (values.length) errors.push(`${label} 重复：${values.join(', ')}`);
}

const groupIds = new Set(GROUPS.map((group) => group.id));
pushDuplicates('GROUP id', duplicateValues(GROUPS, (group) => group.id));
pushDuplicates('MODULE id', duplicateValues(MODULES, (module) => module.id));
pushDuplicates('MODULE path', duplicateValues(MODULES, (module) => module.path));

for (const module of MODULES) {
  if (!groupIds.has(module.group)) errors.push(`${module.id} 使用未知 group：${module.group}`);
  if (!module.path?.startsWith('/')) errors.push(`${module.id} path 不是绝对应用路由`);
  if (!MODULE_ICONS[module.icon]) errors.push(`${module.id} 使用未打包图标：${module.icon}`);
}

for (const group of GROUPS) {
  if (!MODULES.some((module) => module.group === group.id)) {
    warnings.push(`空分组：${group.id}`);
  }
}

const chinaSubgroups = new Set(SHIJIAN_CHINA_SUBGROUPS.map((item) => item.id));
const worldSubgroups = new Set(SHIJIAN_WORLD_SUBGROUPS.map((item) => item.id));
for (const module of MODULES.filter((item) => item.group === 'shijian')) {
  if (!chinaSubgroups.has(module.subgroup)) errors.push(`${module.id} 使用未知中华 subgroup`);
}
for (const module of MODULES.filter((item) => item.group === 'shijianWorld')) {
  if (!worldSubgroups.has(module.subgroup)) errors.push(`${module.id} 使用未知世界 subgroup`);
}

// lazy import 目标必须存在，避免构建前才发现空白路由。
const registryPath = join(ROOT, 'app/src/app/registry.js');
const registrySource = readFileSync(registryPath, 'utf8');
const importTargets = [...registrySource.matchAll(/component:\s*lazy\(\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\)/g)]
  .map((match) => match[1]);
if (importTargets.length !== MODULES.length) {
  errors.push(`registry lazy import 数 ${importTargets.length} 与模块数 ${MODULES.length} 不一致`);
}
for (const target of importTargets) {
  const absolute = resolve(dirname(registryPath), target);
  if (!existsSync(absolute)) errors.push(`registry import 不存在：${target}`);
}

function assertSeries({
  group,
  dir,
  filePattern,
  pathForFile,
}) {
  const files = readdirSync(join(ROOT, dir)).filter((name) => filePattern.test(name)).sort();
  const registered = MODULES.filter((module) => module.group === group);
  const registeredPaths = new Set(registered.map((module) => module.path));
  const expectedPaths = new Set(files.map(pathForFile));

  for (const path of expectedPaths) {
    if (!registeredPaths.has(path)) errors.push(`${dir} 有静态卷但 registry 缺路由：${path}`);
  }
  for (const path of registeredPaths) {
    if (!expectedPaths.has(path)) errors.push(`registry 有路由但 ${dir} 缺静态卷：${path}`);
  }
  return files.length;
}

const sjCount = assertSeries({
  group: 'shijian',
  dir: 'app/public/shijian',
  filePattern: /^SJ-\d{2}\.html$/,
  pathForFile: (name) => {
    const number = name.match(/\d{2}/)[0];
    return number === '00' ? '/modules/shijian' : `/modules/shijian/sj-${number}`;
  },
});
const sjwCount = assertSeries({
  group: 'shijianWorld',
  dir: 'app/public/shijian-world',
  filePattern: /^SJW-\d{2}\.html$/,
  pathForFile: (name) => {
    const number = name.match(/\d{2}/)[0];
    return number === '00' ? '/modules/shijian-world' : `/modules/shijian-world/sjw-${number}`;
  },
});

// 交叉链接仅允许注册路由或 App.jsx 中明确维护的兼容别名。
const appSource = readFileSync(join(ROOT, 'app/src/App.jsx'), 'utf8');
const aliases = new Set(
  [...appSource.matchAll(/<Route\s+path=["']([^"']+)["']/g)].map((match) => `/${match[1]}`),
);
const validPaths = new Set(MODULES.map((module) => module.path));
for (const [sourceId, links] of Object.entries(CROSS_LINKS)) {
  if (!Array.isArray(links)) {
    errors.push(`交叉链接 ${sourceId} 不是数组`);
    continue;
  }
  for (const link of links) {
    const path = String(link?.to || '').split(/[?#]/)[0];
    if (!path.startsWith('/')) {
      errors.push(`${sourceId} 交叉链接不是站内绝对路由：${link?.to || '(空)'}`);
    } else if (!validPaths.has(path) && !aliases.has(path)) {
      errors.push(`${sourceId} 交叉链接指向未注册路由：${link.to}`);
    }
  }
}

const asOf = new Date(`${AS_OF_BASELINE}T00:00:00Z`);
if (Number.isNaN(asOf.getTime())) {
  errors.push(`AS_OF_BASELINE 非法：${AS_OF_BASELINE}`);
} else {
  const now = new Date();
  const ageDays = Math.floor((now - asOf) / 86400000);
  if (ageDays < 0) errors.push(`AS_OF_BASELINE 位于未来：${AS_OF_BASELINE}`);
  if (ageDays > 45) warnings.push(`AS_OF_BASELINE 已陈旧 ${ageDays} 天：${AS_OF_BASELINE}`);
}

console.log(`Registry: ${GROUPS.length} groups · ${MODULES.length} modules`);
console.log(`Static volumes: ${sjCount} SJ · ${sjwCount} SJW`);
console.log(`Cross-link maps: ${Object.keys(CROSS_LINKS).length}`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`FAIL ${error}`);
console.log(`Integrity: ${errors.length} failures · ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
