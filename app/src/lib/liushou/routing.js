/** 农村留守老人 GY-30 · 页签 deep-link 路由(第二十八子集) */

export const LIUSHOU_PANELS = {
  l1: 'll-p-l1',
  l2: 'll-p-l2',
  l3: 'll-p-l3',
  l4: 'll-p-l4',
  l5: 'll-p-l5',
  l6: 'll-p-l6',
  l7: 'll-p-l7',
  watch: 'll-p-watch',
};

const VALID_TABS = new Set(Object.keys(LIUSHOU_PANELS));

export function resolveLiushouTab(tab) {
  if (!tab) return 'l1';
  return VALID_TABS.has(tab) ? tab : 'l1';
}

export const LIUSHOU_TAB_LABELS = {
  l1: 'L1 · 城乡断层最底端',
  l2: 'L2 · 土地养老破产',
  l3: 'L3 · 百余元养老金',
  l4: 'L4 · 照护医疗不可达',
  l5: 'L5 · 三留守体系',
  l6: 'L6 · 政治形态学',
  l7: 'L7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const LIUSHOU_TABS = Object.entries(LIUSHOU_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'l6' ? '#5d7489' : '#b5483a',
}));

export function liushouPanelId(tab) {
  return LIUSHOU_PANELS[resolveLiushouTab(tab)];
}

export function liushouPath(tab = 'l1') {
  const id = resolveLiushouTab(tab);
  return id === 'l1' ? '/modules/liushou' : `/modules/liushou?tab=${id}`;
}
