/** 离岸中国人 · 境外节点与未结清的账户 GY-16 · 页签 deep-link 路由(系列收官) */

export const LIAN_PANELS = {
  h1: 'la-p-h1',
  h2: 'la-p-h2',
  h3: 'la-p-h3',
  h4: 'la-p-h4',
  h5: 'la-p-h5',
  h6: 'la-p-h6',
  h7: 'la-p-h7',
  h8: 'la-p-h8',
  watch: 'la-p-watch',
};

const VALID_TABS = new Set(Object.keys(LIAN_PANELS));

export function resolveLianTab(tab) {
  if (!tab) return 'h1';
  return VALID_TABS.has(tab) ? tab : 'h1';
}

export const LIAN_TAB_LABELS = {
  h1: 'H1 · 标签拆解',
  h2: 'H2 · 润的光谱',
  h3: 'H3 · 留学账本',
  h4: 'H4 · 叠加态',
  h5: 'H5 · 主权探针',
  h6: 'H6 · 双重不信任',
  h7: 'H7 · 归与不归',
  h8: 'H8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const LIAN_TABS = Object.entries(LIAN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'h6' ? '#5e8c7a' : '#b5483a',
}));

export function lianPanelId(tab) {
  return LIAN_PANELS[resolveLianTab(tab)];
}

export function lianPath(tab = 'h1') {
  const id = resolveLianTab(tab);
  return id === 'h1' ? '/modules/lian' : `/modules/lian?tab=${id}`;
}
