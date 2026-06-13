/** 职业农民与新农人 GY-35 · 页签 deep-link 路由(第三十三子集) */

export const XINNONG_PANELS = {
  n1: 'xn-p-n1',
  n2: 'xn-p-n2',
  n3: 'xn-p-n3',
  n4: 'xn-p-n4',
  n5: 'xn-p-n5',
  n6: 'xn-p-n6',
  watch: 'xn-p-watch',
};

const VALID_TABS = new Set(Object.keys(XINNONG_PANELS));

export function resolveXinnongTab(tab) {
  if (!tab) return 'n1';
  return VALID_TABS.has(tab) ? tab : 'n1';
}

export const XINNONG_TAB_LABELS = {
  n1: 'N1 · 谁来种地',
  n2: 'N2 · 换芯',
  n3: 'N3 · 种粮的算术',
  n4: 'N4 · 土地纽带',
  n5: 'N5 · 政治形态学',
  n6: 'N6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const XINNONG_TABS = Object.entries(XINNONG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'n5' ? '#5d7489' : '#b5483a',
}));

export function xinnongPanelId(tab) {
  return XINNONG_PANELS[resolveXinnongTab(tab)];
}

export function xinnongPath(tab = 'n1') {
  const id = resolveXinnongTab(tab);
  return id === 'n1' ? '/modules/xinnong' : `/modules/xinnong?tab=${id}`;
}
