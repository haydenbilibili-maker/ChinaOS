/** 零工经济人群 GY-05 · 页签 deep-link 路由 */

export const LINGGONG_PANELS = {
  l1: 'lg-p-l1',
  l2: 'lg-p-l2',
  l3: 'lg-p-l3',
  l4: 'lg-p-l4',
  l5: 'lg-p-l5',
  l6: 'lg-p-l6',
  l7: 'lg-p-l7',
  l8: 'lg-p-l8',
  watch: 'lg-p-watch',
};

const VALID_TABS = new Set(Object.keys(LINGGONG_PANELS));

export function resolveLinggongTab(tab) {
  if (!tab) return 'l1';
  return VALID_TABS.has(tab) ? tab : 'l1';
}

export const LINGGONG_TAB_LABELS = {
  l1: 'L1 · 规模换人',
  l2: 'L2 · 三重身份',
  l3: 'L3 · 算法雇主',
  l4: 'L4 · 法律黑洞',
  l5: 'L5 · 生存数学',
  l6: 'L6 · 组织阀门',
  l7: 'L7 · 新变量',
  l8: 'L8 · 自动化挤压',
  watch: 'L9 · 合成 · 观测哨',
};

export const LINGGONG_TABS = Object.entries(LINGGONG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'l7' ? '#5e8c7a' : '#b5483a',
}));

export function linggongPanelId(tab) {
  return LINGGONG_PANELS[resolveLinggongTab(tab)];
}

export function linggongPath(tab = 'l1') {
  const id = resolveLinggongTab(tab);
  return id === 'l1' ? '/modules/linggong' : `/modules/linggong?tab=${id}`;
}
