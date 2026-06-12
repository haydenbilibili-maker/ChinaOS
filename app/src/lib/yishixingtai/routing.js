import { YISHI_PANELS, resolveYishiTab } from '../gy/coupling.js';

export { resolveYishiTab };

export const YISHI_TABS = [
  { id: 'overview', label: '剖面 · 总览与优先序', accent: '#b5483a' },
  { id: 'comps', label: '五组件 · 逐层下钻', accent: '#5e8c7a' },
  { id: 'twin', label: '双轨 · 马克思主义 / 干部与民众', accent: '#5d7489' },
  { id: 'tension', label: '张力 · 三条裂缝', accent: '#b5483a' },
  { id: 'watch', label: '观测哨 · 年度复盘', accent: '#b39657' },
];

export const YISHI_TAB_LABELS = Object.fromEntries(YISHI_TABS.map((t) => [t.id, t.label]));

export function yishiPanelId(tab) {
  return YISHI_PANELS[resolveYishiTab(tab)];
}

export function yishiPath(tab = 'overview') {
  const id = resolveYishiTab(tab);
  return id === 'overview' ? '/modules/yishixingtai' : `/modules/yishixingtai?tab=${id}`;
}
