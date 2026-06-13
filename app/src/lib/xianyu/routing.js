/** 县域青年 · 留下的人 GY-20 · 页签 deep-link 路由(第十八子集) */

export const XIANYU_PANELS = {
  x1: 'xy-p-x1',
  x2: 'xy-p-x2',
  x3: 'xy-p-x3',
  x4: 'xy-p-x4',
  x5: 'xy-p-x5',
  x6: 'xy-p-x6',
  x7: 'xy-p-x7',
  x8: 'xy-p-x8',
  watch: 'xy-p-watch',
};

const VALID_TABS = new Set(Object.keys(XIANYU_PANELS));

export function resolveXianyuTab(tab) {
  if (!tab) return 'x1';
  return VALID_TABS.has(tab) ? tab : 'x1';
}

export const XIANYU_TAB_LABELS = {
  x1: 'X1 · 沉默大多数',
  x2: 'X2 · 关系即调度器',
  x3: 'X3 · 编制原产地',
  x4: 'X4 · 蜜雪冰城经济学',
  x5: 'X5 · 彩礼人情隐性税',
  x6: 'X6 · 返乡理想与幻灭',
  x7: 'X7 · 政治形态学',
  x8: 'X8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const XIANYU_TABS = Object.entries(XIANYU_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'x2' ? '#5e8c7a' : '#b5483a',
}));

export function xianyuPanelId(tab) {
  return XIANYU_PANELS[resolveXianyuTab(tab)];
}

export function xianyuPath(tab = 'x1') {
  const id = resolveXianyuTab(tab);
  return id === 'x1' ? '/modules/xianyu' : `/modules/xianyu?tab=${id}`;
}
