/** 退役军人 · 预装组织力 GY-12 · 页签 deep-link 路由 */

export const TUIYI_PANELS = {
  v1: 'ty-p-v1',
  v2: 'ty-p-v2',
  v3: 'ty-p-v3',
  v4: 'ty-p-v4',
  v5: 'ty-p-v5',
  v6: 'ty-p-v6',
  v7: 'ty-p-v7',
  watch: 'ty-p-watch',
};

const VALID_TABS = new Set(Object.keys(TUIYI_PANELS));

export function resolveTuiyiTab(tab) {
  if (!tab) return 'v1';
  return VALID_TABS.has(tab) ? tab : 'v1';
}

export const TUIYI_TAB_LABELS = {
  v1: 'V1 · 规模构成',
  v2: 'V2 · 预装组织力',
  v3: 'V3 · 2018 建部',
  v4: 'V4 · 赎买成色',
  v5: 'V5 · 怨恨语法',
  v6: 'V6 · 双重态',
  v7: 'V7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const TUIYI_TABS = Object.entries(TUIYI_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'v6' ? '#5e8c7a' : '#b5483a',
}));

export function tuiyiPanelId(tab) {
  return TUIYI_PANELS[resolveTuiyiTab(tab)];
}

export function tuiyiPath(tab = 'v1') {
  const id = resolveTuiyiTab(tab);
  return id === 'v1' ? '/modules/tuiyi' : `/modules/tuiyi?tab=${id}`;
}
