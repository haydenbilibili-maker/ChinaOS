/** 意义市场 · 信仰人群 GY-13 · 页签 deep-link 路由 */

export const YIYI_PANELS = {
  x1: 'ym-p-x1',
  x2: 'ym-p-x2',
  x3: 'ym-p-x3',
  x4: 'ym-p-x4',
  x5: 'ym-p-x5',
  x6: 'ym-p-x6',
  x7: 'ym-p-x7',
  x8: 'ym-p-x8',
  watch: 'ym-p-watch',
};

const VALID_TABS = new Set(Object.keys(YIYI_PANELS));

export function resolveYiyiTab(tab) {
  if (!tab) return 'x1';
  return VALID_TABS.has(tab) ? tab : 'x1';
}

export const YIYI_TAB_LABELS = {
  x1: 'X1 · 真空成因',
  x2: 'X2 · 供应商谱系',
  x3: 'X3 · 寺庙经济',
  x4: 'X4 · 玄学青年',
  x5: 'X5 · 防火墙红区',
  x6: 'X6 · 供给侧政治学',
  x7: 'X7 · 历史的押韵',
  x8: 'X8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const YIYI_TABS = Object.entries(YIYI_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'x6' ? '#5e8c7a' : '#b5483a',
}));

export function yiyiPanelId(tab) {
  return YIYI_PANELS[resolveYiyiTab(tab)];
}

export function yiyiPath(tab = 'x1') {
  const id = resolveYiyiTab(tab);
  return id === 'x1' ? '/modules/yiyi' : `/modules/yiyi?tab=${id}`;
}
