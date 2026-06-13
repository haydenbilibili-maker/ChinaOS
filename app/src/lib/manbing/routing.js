/** 带病生存的年轻人 · 健康的阶层化 GY-23 · 页签 deep-link 路由(第二十一子集) */

export const MANBING_PANELS = {
  h1: 'mb-p-h1',
  h2: 'mb-p-h2',
  h3: 'mb-p-h3',
  h4: 'mb-p-h4',
  h5: 'mb-p-h5',
  h6: 'mb-p-h6',
  watch: 'mb-p-watch',
};

const VALID_TABS = new Set(Object.keys(MANBING_PANELS));

export function resolveManbingTab(tab) {
  if (!tab) return 'h1';
  return VALID_TABS.has(tab) ? tab : 'h1';
}

export const MANBING_TAB_LABELS = {
  h1: 'H1 · 未老先衰',
  h2: 'H2 · 心理健康',
  h3: 'H3 · 健康消费分化',
  h4: 'H4 · 健康作为新资本',
  h5: 'H5 · 政治形态学',
  h6: 'H6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const MANBING_TABS = Object.entries(MANBING_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'h2' ? '#5e8c7a' : '#b5483a',
}));

export function manbingPanelId(tab) {
  return MANBING_PANELS[resolveManbingTab(tab)];
}

export function manbingPath(tab = 'h1') {
  const id = resolveManbingTab(tab);
  return id === 'h1' ? '/modules/manbing' : `/modules/manbing?tab=${id}`;
}
