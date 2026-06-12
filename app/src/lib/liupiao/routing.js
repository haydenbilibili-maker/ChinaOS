/** 流量彩票 · 主播与创作者 GY-14 · 页签 deep-link 路由 */

export const LIUPIAO_PANELS = {
  p1: 'lp-p-p1',
  p2: 'lp-p-p2',
  p3: 'lp-p-p3',
  p4: 'lp-p-p4',
  p5: 'lp-p-p5',
  p6: 'lp-p-p6',
  p7: 'lp-p-p7',
  p8: 'lp-p-p8',
  watch: 'lp-p-watch',
};

const VALID_TABS = new Set(Object.keys(LIUPIAO_PANELS));

export function resolveLiupiaoTab(tab) {
  if (!tab) return 'p1';
  return VALID_TABS.has(tab) ? tab : 'p1';
}

export const LIUPIAO_TAB_LABELS = {
  p1: 'P1 · 千万淘金营',
  p2: 'P2 · 彩票分布',
  p3: 'P3 · 彩票化激励',
  p4: 'P4 · MCN圈占',
  p5: 'P5 · 打赏下沉',
  p6: 'P6 · 头部政治学',
  p7: 'P7 · 审查承包商',
  p8: 'P8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const LIUPIAO_TABS = Object.entries(LIUPIAO_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'p6' ? '#5e8c7a' : '#b5483a',
}));

export function liupiaoPanelId(tab) {
  return LIUPIAO_PANELS[resolveLiupiaoTab(tab)];
}

export function liupiaoPath(tab = 'p1') {
  const id = resolveLiupiaoTab(tab);
  return id === 'p1' ? '/modules/liupiao' : `/modules/liupiao?tab=${id}`;
}
