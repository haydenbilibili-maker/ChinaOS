/** 货车司机与公路货运劳动者 GY-27 · 页签 deep-link 路由(第二十五子集) */

export const HUOCHE_PANELS = {
  h1: 'hc-p-h1',
  h2: 'hc-p-h2',
  h3: 'hc-p-h3',
  h4: 'hc-p-h4',
  h5: 'hc-p-h5',
  h6: 'hc-p-h6',
  h7: 'hc-p-h7',
  watch: 'hc-p-watch',
};

const VALID_TABS = new Set(Object.keys(HUOCHE_PANELS));

export function resolveHuocheTab(tab) {
  if (!tab) return 'h1';
  return VALID_TABS.has(tab) ? tab : 'h1';
}

export const HUOCHE_TAB_LABELS = {
  h1: 'H1 · 73%货运量毛细血管',
  h2: 'H2 · 北斗即调度器',
  h3: 'H3 · 重资产债务经营',
  h4: 'H4 · 平台化运费内卷',
  h5: 'H5 · 命在轮子上',
  h6: 'H6 · 政治形态学',
  h7: 'H7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const HUOCHE_TABS = Object.entries(HUOCHE_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'h6' ? '#5d7489' : '#b5483a',
}));

export function huochePanelId(tab) {
  return HUOCHE_PANELS[resolveHuocheTab(tab)];
}

export function huochePath(tab = 'h1') {
  const id = resolveHuocheTab(tab);
  return id === 'h1' ? '/modules/huoche' : `/modules/huoche?tab=${id}`;
}
