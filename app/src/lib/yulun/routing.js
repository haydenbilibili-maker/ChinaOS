/** 网络舆论场人群 GY-36 · 页签 deep-link 路由(第三十四子集 · 第三批收官) */

export const YULUN_PANELS = {
  y1: 'yl-p-y1',
  y2: 'yl-p-y2',
  y3: 'yl-p-y3',
  y4: 'yl-p-y4',
  y5: 'yl-p-y5',
  y6: 'yl-p-y6',
  y7: 'yl-p-y7',
  watch: 'yl-p-watch',
};

const VALID_TABS = new Set(Object.keys(YULUN_PANELS));

export function resolveYulunTab(tab) {
  if (!tab) return 'y1';
  return VALID_TABS.has(tab) ? tab : 'y1';
}

export const YULUN_TAB_LABELS = {
  y1: 'Y1 · 情绪共振腔',
  y2: 'Y2 · 受众即弹药',
  y3: 'Y3 · 饭圈纯样本',
  y4: 'Y4 · 网络暴力',
  y5: 'Y5 · 举报私力审查',
  y6: 'Y6 · 民族主义与代际',
  y7: 'Y7 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const YULUN_TABS = Object.entries(YULUN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'y7' ? '#5d7489' : '#b5483a',
}));

export function yulunPanelId(tab) {
  return YULUN_PANELS[resolveYulunTab(tab)];
}

export function yulunPath(tab = 'y1') {
  const id = resolveYulunTab(tab);
  return id === 'y1' ? '/modules/yulun' : `/modules/yulun?tab=${id}`;
}
