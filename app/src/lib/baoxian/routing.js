/** 保险代理与直销末梢 GY-41 · 页签 deep-link 路由(人群画像分层第三十九子集) */

export const BAOXIAN_PANELS = {
  x1: 'bx-p-x1',
  x2: 'bx-p-x2',
  x3: 'bx-p-x3',
  x4: 'bx-p-x4',
  x5: 'bx-p-x5',
  x6: 'bx-p-x6',
  watch: 'bx-p-watch',
};

const VALID_TABS = new Set(Object.keys(BAOXIAN_PANELS));

export function resolveBaoxianTab(tab) {
  if (!tab) return 'x1';
  return VALID_TABS.has(tab) ? tab : 'x1';
}

export const BAOXIAN_TAB_LABELS = {
  x1: 'X1 · 大进大出坍缩',
  x2: 'X2 · 增员制进程树',
  x3: 'X3 · 收入彩票化',
  x4: 'X4 · 报行合一转型',
  x5: 'X5 · 体面话术零工',
  x6: 'X6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const BAOXIAN_TABS = Object.entries(BAOXIAN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'x6' ? '#5d7489' : '#b5483a',
}));

export function baoxianPanelId(tab) {
  return BAOXIAN_PANELS[resolveBaoxianTab(tab)];
}

export function baoxianPath(tab = 'x1') {
  const id = resolveBaoxianTab(tab);
  return id === 'x1' ? '/modules/baoxian' : `/modules/baoxian?tab=${id}`;
}
