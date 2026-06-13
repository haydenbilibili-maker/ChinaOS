/** 边疆少数民族 GY-48 · 页签 deep-link 路由(人群画像分层第四十六子集 · 封顶片 · 多框架并置不裁决) */

export const BIANJIANG_PANELS = {
  b1: 'bj-p-b1',
  b2: 'bj-p-b2',
  b3: 'bj-p-b3',
  b4: 'bj-p-b4',
  b5: 'bj-p-b5',
  b6: 'bj-p-b6',
  watch: 'bj-p-watch',
};

const VALID_TABS = new Set(Object.keys(BIANJIANG_PANELS));

export function resolveBianjiangTab(tab) {
  if (!tab) return 'b1';
  return VALID_TABS.has(tab) ? tab : 'b1';
}

export const BIANJIANG_TAB_LABELS = {
  b1: 'B1 · 规模与制度框架',
  b2: 'B2 · 框架一官方共同体发展安全',
  b3: 'B3 · 框架二外部人权文化关切',
  b4: 'B4 · 张力自治发展整合',
  b5: 'B5 · 边疆民族青年',
  b6: 'B6 · 方法论为何不裁决',
  watch: '合成 · 观测哨',
};

export const BIANJIANG_TABS = Object.entries(BIANJIANG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'b6' ? '#5d7489' : '#b5483a',
}));

export function bianjiangPanelId(tab) {
  return BIANJIANG_PANELS[resolveBianjiangTab(tab)];
}

export function bianjiangPath(tab = 'b1') {
  const id = resolveBianjiangTab(tab);
  return id === 'b1' ? '/modules/bianjiang' : `/modules/bianjiang?tab=${id}`;
}
