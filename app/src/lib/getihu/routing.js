/** 个体工商户与小微商家 GY-29 · 页签 deep-link 路由(第二十七子集) */

export const GETIHU_PANELS = {
  g1: 'gt-p-g1',
  g2: 'gt-p-g2',
  g3: 'gt-p-g3',
  g4: 'gt-p-g4',
  g5: 'gt-p-g5',
  g6: 'gt-p-g6',
  g7: 'gt-p-g7',
  watch: 'gt-p-watch',
};

const VALID_TABS = new Set(Object.keys(GETIHU_PANELS));

export function resolveGetihuTab(tab) {
  if (!tab) return 'g1';
  return VALID_TABS.has(tab) ? tab : 'g1';
}

export const GETIHU_TAB_LABELS = {
  g1: 'G1 · 沉默底盘',
  g2: 'G2 · 无异常捕获',
  g3: 'G3 · 高开高关',
  g4: 'G4 · 平台依附',
  g5: 'G5 · 扶持与挤压',
  g6: 'G6 · 政治形态学',
  g7: 'G7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const GETIHU_TABS = Object.entries(GETIHU_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'g6' ? '#5d7489' : '#b5483a',
}));

export function getihuPanelId(tab) {
  return GETIHU_PANELS[resolveGetihuTab(tab)];
}

export function getihuPath(tab = 'g1') {
  const id = resolveGetihuTab(tab);
  return id === 'g1' ? '/modules/getihu' : `/modules/getihu?tab=${id}`;
}
