/** 青年 GY-03 · 页签 deep-link 路由（章节制，后续人群模块可复用 population/ 前缀） */

export const QINGNIAN_PANELS = {
  overview: 'qn-p-overview',
  ch01: 'qn-p-ch01',
  ch02: 'qn-p-ch02',
  ch03: 'qn-p-ch03',
  chapters: 'qn-p-chapters',
  watch: 'qn-p-watch',
};

const VALID_TABS = new Set(Object.keys(QINGNIAN_PANELS));

export function resolveQingnianTab(tab) {
  if (!tab) return 'overview';
  return VALID_TABS.has(tab) ? tab : 'overview';
}

export const QINGNIAN_TABS = [
  { id: 'overview', label: '总览 · 画像与机制', accent: '#b5483a' },
  { id: 'ch01', label: 'CH-01 性别分叉', accent: '#b5483a' },
  { id: 'ch02', label: 'CH-02 冰河期对照', accent: '#b39657' },
  { id: 'ch03', label: 'CH-03 公平语法', accent: '#5d7489' },
  { id: 'chapters', label: '章节规划', accent: '#5e8c7a' },
  { id: 'watch', label: '观测哨 · 年度复盘', accent: '#b39657' },
];

export function qingnianPanelId(tab) {
  return QINGNIAN_PANELS[resolveQingnianTab(tab)];
}

export function qingnianPath(tab = 'overview') {
  const id = resolveQingnianTab(tab);
  return id === 'overview' ? '/modules/qingnian' : `/modules/qingnian?tab=${id}`;
}
