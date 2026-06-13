/** 单身女性与不婚者 · 主动退出的常态化 GY-19 · 页签 deep-link 路由(第十七子集) */

export const DANSHEN_PANELS = {
  d1: 'ds-p-d1',
  d2: 'ds-p-d2',
  d3: 'ds-p-d3',
  d4: 'ds-p-d4',
  d5: 'ds-p-d5',
  d6: 'ds-p-d6',
  d7: 'ds-p-d7',
  watch: 'ds-p-watch',
};

const VALID_TABS = new Set(Object.keys(DANSHEN_PANELS));

export function resolveDanshenTab(tab) {
  if (!tab) return 'd1';
  return VALID_TABS.has(tab) ? tab : 'd1';
}

export const DANSHEN_TAB_LABELS = {
  d1: 'D1 · 罢工之后新建制',
  d2: 'D2 · 退出建制化',
  d3: 'D3 · 需求结构重组',
  d4: 'D4 · 剩女到单身贵族',
  d5: 'D5 · 养老自筹悬崖',
  d6: 'D6 · 去政治化革命',
  d7: 'D7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const DANSHEN_TABS = Object.entries(DANSHEN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'd6' ? '#5e8c7a' : '#b5483a',
}));

export function danshenPanelId(tab) {
  return DANSHEN_PANELS[resolveDanshenTab(tab)];
}

export function danshenPath(tab = 'd1') {
  const id = resolveDanshenTab(tab);
  return id === 'd1' ? '/modules/danshen' : `/modules/danshen?tab=${id}`;
}
