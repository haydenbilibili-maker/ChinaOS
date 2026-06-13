/** 人群画像总图谱 GY-00 · 页签 deep-link 路由 */

export const RENQUN_TUPU_PANELS = {
  atlas: 'at-p-atlas',
  axes: 'at-p-axes',
  price: 'at-p-price',
  order: 'at-p-order',
};

const VALID_TABS = new Set(Object.keys(RENQUN_TUPU_PANELS));

export function resolveRenqunTupuTab(tab) {
  if (!tab) return 'atlas';
  return VALID_TABS.has(tab) ? tab : 'atlas';
}

export const RENQUN_TUPU_TABS = [
  { id: 'atlas', label: '图谱', accent: '#b5483a' },
  { id: 'axes', label: '轴线覆盖', accent: '#5e8c7a' },
  { id: 'price', label: '价目表假说', accent: '#b39657' },
  { id: 'order', label: '钻探顺序', accent: '#5d7489' },
];

export function renqunTupuPanelId(tab) {
  return RENQUN_TUPU_PANELS[resolveRenqunTupuTab(tab)];
}

export function renqunTupuPath(tab = 'atlas') {
  const id = resolveRenqunTupuTab(tab);
  return id === 'atlas' ? '/modules/renqun-tupu' : `/modules/renqun-tupu?tab=${id}`;
}
