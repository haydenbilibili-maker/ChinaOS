/** 基层治理末梢 · 网格员、辅警、社工、协管 GY-24 · 页签 deep-link 路由(第二十二子集) */

export const MOSHAO_PANELS = {
  m1: 'ms-p-m1',
  m2: 'ms-p-m2',
  m3: 'ms-p-m3',
  m4: 'ms-p-m4',
  m5: 'ms-p-m5',
  m6: 'ms-p-m6',
  watch: 'ms-p-watch',
};

const VALID_TABS = new Set(Object.keys(MOSHAO_PANELS));

export function resolveMoshaoTab(tab) {
  if (!tab) return 'm1';
  return VALID_TABS.has(tab) ? tab : 'm1';
}

export const MOSHAO_TAB_LABELS = {
  m1: 'M1 · 看不见的数百万',
  m2: 'M2 · 权力临时工化',
  m3: 'M3 · 同工不同酬',
  m4: 'M4 · 一根针',
  m5: 'M5 · 政治形态学',
  m6: 'M6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const MOSHAO_TABS = Object.entries(MOSHAO_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'm3' ? '#5d7489' : '#b5483a',
}));

export function moshaoPanelId(tab) {
  return MOSHAO_PANELS[resolveMoshaoTab(tab)];
}

export function moshaoPath(tab = 'm1') {
  const id = resolveMoshaoTab(tab);
  return id === 'm1' ? '/modules/moshao' : `/modules/moshao?tab=${id}`;
}
