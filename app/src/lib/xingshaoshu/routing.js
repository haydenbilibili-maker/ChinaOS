/** 性少数群像 GY-04 · 页签 deep-link 路由 */

export const XINGSHAOSHU_PANELS = {
  s1: 'xs-p-s1',
  s2: 'xs-p-s2',
  s3: 'xs-p-s3',
  s4: 'xs-p-s4',
  s5: 'xs-p-s5',
  s6: 'xs-p-s6',
  s7: 'xs-p-s7',
  watch: 'xs-p-watch',
};

const VALID_TABS = new Set(Object.keys(XINGSHAOSHU_PANELS));

export function resolveXingshaoshuTab(tab) {
  if (!tab) return 's1';
  return VALID_TABS.has(tab) ? tab : 's1';
}

export const XINGSHAOSHU_TABS = [
  { id: 's1', label: 'S1 · 数量', accent: '#b5483a' },
  { id: 's2', label: 'S2 · 成因', accent: '#5e8c7a' },
  { id: 's3', label: 'S3 · 政治定位', accent: '#b5483a' },
  { id: 's4', label: 'S4 · 粉红经济', accent: '#b39657' },
  { id: 's5', label: 'S5 · 男色经济', accent: '#5d7489' },
  { id: 's6', label: 'S6 · 健康与污名', accent: '#5e8c7a' },
  { id: 's7', label: 'S7 · 风险翻转', accent: '#b5483a' },
  { id: 'watch', label: 'S8 · 观测哨', accent: '#b39657' },
];

export function xingshaoshuPanelId(tab) {
  return XINGSHAOSHU_PANELS[resolveXingshaoshuTab(tab)];
}

export function xingshaoshuPath(tab = 's1') {
  const id = resolveXingshaoshuTab(tab);
  return id === 's1' ? '/modules/xingshaoshu' : `/modules/xingshaoshu?tab=${id}`;
}
