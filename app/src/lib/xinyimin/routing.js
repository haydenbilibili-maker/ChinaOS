/** 城市新移民与夹心层 · 有城无籍 GY-21 · 页签 deep-link 路由(第十九子集) */

export const XINYIMIN_PANELS = {
  p1: 'xm-p-p1',
  p2: 'xm-p-p2',
  p3: 'xm-p-p3',
  p4: 'xm-p-p4',
  p5: 'xm-p-p5',
  p6: 'xm-p-p6',
  p7: 'xm-p-p7',
  watch: 'xm-p-watch',
};

const VALID_TABS = new Set(Object.keys(XINYIMIN_PANELS));

export function resolveXinyiminTab(tab) {
  if (!tab) return 'p1';
  return VALID_TABS.has(tab) ? tab : 'p1';
}

export const XINYIMIN_TAB_LABELS = {
  p1: 'P1 · 事实市民',
  p2: 'P2 · 无代表的纳税',
  p3: 'P3 · 积分玻璃天花板',
  p4: 'P4 · 教育难民',
  p5: 'P5 · 社保损耗与钟摆',
  p6: 'P6 · 政治形态学',
  p7: 'P7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const XINYIMIN_TABS = Object.entries(XINYIMIN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'p2' ? '#5e8c7a' : '#b5483a',
}));

export function xinyiminPanelId(tab) {
  return XINYIMIN_PANELS[resolveXinyiminTab(tab)];
}

export function xinyiminPath(tab = 'p1') {
  const id = resolveXinyiminTab(tab);
  return id === 'p1' ? '/modules/xinyimin' : `/modules/xinyimin?tab=${id}`;
}
