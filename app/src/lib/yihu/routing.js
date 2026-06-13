/** 医护人员 GY-37 · 页签 deep-link 路由(人群画像分层第三十五子集) */

export const YIHU_PANELS = {
  y1: 'yh-p-y1',
  y2: 'yh-p-y2',
  y3: 'yh-p-y3',
  y4: 'yh-p-y4',
  y5: 'yh-p-y5',
  y6: 'yh-p-y6',
  y7: 'yh-p-y7',
  watch: 'yh-p-watch',
};

const VALID_TABS = new Set(Object.keys(YIHU_PANELS));

export function resolveYihuTab(tab) {
  if (!tab) return 'y1';
  return VALID_TABS.has(tab) ? tab : 'y1';
}

export const YIHU_TAB_LABELS = {
  y1: 'Y1 · 508万服务14亿',
  y2: 'Y2 · 医患同困',
  y3: 'Y3 · 规培学徒期',
  y4: 'Y4 · 薪酬改革',
  y5: 'Y5 · 护士与基层',
  y6: 'Y6 · 政治形态学',
  y7: 'Y7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const YIHU_TABS = Object.entries(YIHU_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'y7' ? '#5d7489' : '#b5483a',
}));

export function yihuPanelId(tab) {
  return YIHU_PANELS[resolveYihuTab(tab)];
}

export function yihuPath(tab = 'y1') {
  const id = resolveYihuTab(tab);
  return id === 'y1' ? '/modules/yihu' : `/modules/yihu?tab=${id}`;
}
