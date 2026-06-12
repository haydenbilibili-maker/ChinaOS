/** 中产阶层 GY-08 · 页签 deep-link 路由 */

export const ZHONGCHAN_PANELS = {
  z1: 'zc-p-z1',
  z2: 'zc-p-z2',
  z3: 'zc-p-z3',
  z4: 'zc-p-z4',
  z5: 'zc-p-z5',
  z6: 'zc-p-z6',
  z7: 'zc-p-z7',
  z8: 'zc-p-z8',
  watch: 'zc-p-watch',
};

const VALID_TABS = new Set(Object.keys(ZHONGCHAN_PANELS));

export function resolveZhongchanTab(tab) {
  if (!tab) return 'z1';
  return VALID_TABS.has(tab) ? tab : 'z1';
}

export const ZHONGCHAN_TAB_LABELS = {
  z1: 'Z1 · 口径之争',
  z2: 'Z2 · 资产负债表',
  z3: 'Z3 · 教育军备',
  z4: 'Z4 · 职业悬崖',
  z5: 'Z5 · 防御性收缩',
  z6: 'Z6 · 润与出口',
  z7: 'Z7 · 业主政治',
  z8: 'Z8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const ZHONGCHAN_TABS = Object.entries(ZHONGCHAN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'z6' ? '#5e8c7a' : '#b5483a',
}));

export function zhongchanPanelId(tab) {
  return ZHONGCHAN_PANELS[resolveZhongchanTab(tab)];
}

export function zhongchanPath(tab = 'z1') {
  const id = resolveZhongchanTab(tab);
  return id === 'z1' ? '/modules/zhongchan' : `/modules/zhongchan?tab=${id}`;
}
