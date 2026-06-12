/** 老年群体 GY-09 · 页签 deep-link 路由 */

export const LAONIAN_PANELS = {
  l1: 'ln-p-l1',
  l2: 'ln-p-l2',
  l3: 'ln-p-l3',
  l4: 'ln-p-l4',
  l5: 'ln-p-l5',
  l6: 'ln-p-l6',
  l7: 'ln-p-l7',
  l8: 'ln-p-l8',
  watch: 'ln-p-watch',
};

const VALID_TABS = new Set(Object.keys(LAONIAN_PANELS));

export function resolveLaonianTab(tab) {
  if (!tab) return 'l1';
  return VALID_TABS.has(tab) ? tab : 'l1';
}

export const LAONIAN_TAB_LABELS = {
  l1: 'L1 · 规模与速度',
  l2: 'L2 · 三轨养老金',
  l3: 'L3 · 延迟退休',
  l4: 'L4 · 照护悬崖',
  l5: 'L5 · 财富占位',
  l6: 'L6 · 银发与收割',
  l7: 'L7 · 政治形态学',
  l8: 'L8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const LAONIAN_TABS = Object.entries(LAONIAN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'l6' ? '#5e8c7a' : '#b5483a',
}));

export function laonianPanelId(tab) {
  return LAONIAN_PANELS[resolveLaonianTab(tab)];
}

export function laonianPath(tab = 'l1') {
  const id = resolveLaonianTab(tab);
  return id === 'l1' ? '/modules/laonian' : `/modules/laonian?tab=${id}`;
}
