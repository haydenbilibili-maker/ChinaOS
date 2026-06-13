/** 信访群体 GY-58 · 页签 deep-link 路由(人群画像分层第五十六子集 · 多视角并陈、归因不断言、不裁决;中性制度描述,涉争议处标注「不同观点」而非给出结论) */

export const XINFANG_PANELS = {
  x1: 'xf-p-x1',
  x2: 'xf-p-x2',
  x3: 'xf-p-x3',
  x4: 'xf-p-x4',
  x5: 'xf-p-x5',
  watch: 'xf-p-watch',
};

const VALID_TABS = new Set(Object.keys(XINFANG_PANELS));

export function resolveXinfangTab(tab) {
  if (!tab) return 'x1';
  return VALID_TABS.has(tab) ? tab : 'x1';
}

export const XINFANG_TAB_LABELS = {
  x1: 'X1 · 制度定位',
  x2: 'X2 · 多视角并陈',
  x3: 'X3 · 法治化改革',
  x4: 'X4 · 张力与难题',
  x5: 'X5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const XINFANG_TABS = Object.entries(XINFANG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'x5' ? '#5d7489' : '#5e8c7a',
}));

export function xinfangPanelId(tab) {
  return XINFANG_PANELS[resolveXinfangTab(tab)];
}

export function xinfangPath(tab = 'x1') {
  const id = resolveXinfangTab(tab);
  return id === 'x1' ? '/modules/xinfang' : `/modules/xinfang?tab=${id}`;
}
