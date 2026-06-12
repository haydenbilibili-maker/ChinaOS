import { GROUPS, MODULES, modulesByGroup } from './registry.js';
import { resolveTalentTab } from '../lib/talent/routing.js';
import { GUOYUN_TAB_LABELS, resolveGuoyunTab } from '../lib/guoyun/routing.js';
import { getVolume } from '../modules/civilization/volumes.js';

const TALENT_TAB_LABELS = {
  resume: '中国政要',
  anticorruption: '反腐透视',
  dissident: '异见人士',
  taiwan: '港澳台政要',
  education: '高等教育',
  thinktank: '智库',
  research: '科研院所',
  knowledge: '知识精英',
  business: '商业精英',
  overseas: '海外人才',
  diplomatic: '外交人才',
};

const SANDBOX_TAB_LABELS = {
  general: '通用沙盘',
  handong: '汉东省沙盘',
  inspection: '中央巡视沙盘',
  wargame: '大国博弈推演桌',
  presser: '舆情风暴应对台',
  macro: '宏观调控驾驶舱',
  'party-school': '党校研修',
  'org-dept': '组织画像',
};

const POLICY_CORPUS_LABELS = {
  policy: '政策文件',
  legal: '法律条文',
};

const MODULES_BY_PATH_LEN = [...MODULES].sort((a, b) => b.path.length - a.path.length);

/** 按路径最长前缀匹配注册模块（支持 wildcard 子路由） */
export function resolveModuleByPath(pathname) {
  const path = pathname || '/';
  return MODULES_BY_PATH_LEN.find(
    (m) => path === m.path || path.startsWith(`${m.path}/`),
  ) || null;
}

function getSubRouteCrumbs(mod, pathname, search) {
  if (!mod) return [];

  if (mod.id === 'civilization') {
    const match = pathname.match(/^\/civilization\/v\/([^/]+)/);
    if (match) {
      const vol = getVolume(match[1]);
      return [{ label: vol?.title || match[1], to: null, active: true }];
    }
  }

  if (mod.id === 'talent') {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    const tab = resolveTalentTab(params.get('tab') || 'resume');
    if (tab !== 'resume') {
      return [{ label: TALENT_TAB_LABELS[tab] || tab, to: null, active: true }];
    }
  }

  if (mod.id === 'sandbox') {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    const tab = params.get('tab');
    if (tab && tab !== 'general' && SANDBOX_TAB_LABELS[tab]) {
      return [{ label: SANDBOX_TAB_LABELS[tab], to: null, active: true }];
    }
  }

  if (mod.id === 'policydocs') {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    const tab = params.get('tab');
    if (tab === 'legal') {
      return [{ label: POLICY_CORPUS_LABELS.legal, to: null, active: true }];
    }
  }

  if (mod.id === 'guoyun') {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    const tab = resolveGuoyunTab(params.get('tab'));
    if (tab !== 'sim' && GUOYUN_TAB_LABELS[tab]) {
      return [{ label: GUOYUN_TAB_LABELS[tab], to: null, active: true }];
    }
  }

  return [];
}

/**
 * @returns {{ label: string, to: string | null, active?: boolean, accent?: string }[]}
 */
export function buildBreadcrumbs(pathname, search = '') {
  const path = pathname || '/';
  const isDashboard = path === '/' || path === '/dashboard';

  if (isDashboard) {
    return [{ label: '中枢看板', to: null, active: true }];
  }

  const mod = resolveModuleByPath(path);
  const items = [{ label: 'China OS', to: '/dashboard', active: false }];

  if (!mod) {
    const fallback = path.replace(/^\//, '') || '总览';
    items.push({ label: fallback, to: null, active: true });
    return items;
  }

  const group = GROUPS.find((g) => g.id === mod.group);
  const subCrumbs = getSubRouteCrumbs(mod, path, search);
  const hasSubRoute = subCrumbs.length > 0;

  if (group) {
    const firstInGroup = modulesByGroup(group.id)[0];
    items.push({
      label: group.label,
      to: firstInGroup?.path ?? null,
      accent: group.accent,
      active: false,
    });
  }

  items.push({
    label: mod.title,
    to: hasSubRoute ? mod.path : null,
    active: !hasSubRoute,
  });

  return [...items, ...subCrumbs];
}
