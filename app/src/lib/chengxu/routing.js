/** 程序员与大厂白领 GY-28 · 页签 deep-link 路由(第二十六子集) */

export const CHENGXU_PANELS = {
  c1: 'cx-p-c1',
  c2: 'cx-p-c2',
  c3: 'cx-p-c3',
  c4: 'cx-p-c4',
  c5: 'cx-p-c5',
  c6: 'cx-p-c6',
  c7: 'cx-p-c7',
  watch: 'cx-p-watch',
};

const VALID_TABS = new Set(Object.keys(CHENGXU_PANELS));

export function resolveChengxuTab(tab) {
  if (!tab) return 'c1';
  return VALID_TABS.has(tab) ? tab : 'c1';
}

export const CHENGXU_TAB_LABELS = {
  c1: 'C1 · 贵族幻觉',
  c2: 'C2 · 自我弃用',
  c3: 'C3 · 35岁EOL',
  c4: 'C4 · 螺丝钉化',
  c5: 'C5 · 35岁后去哪',
  c6: 'C6 · 政治形态学',
  c7: 'C7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const CHENGXU_TABS = Object.entries(CHENGXU_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'c6' ? '#5d7489' : '#b5483a',
}));

export function chengxuPanelId(tab) {
  return CHENGXU_PANELS[resolveChengxuTab(tab)];
}

export function chengxuPath(tab = 'c1') {
  const id = resolveChengxuTab(tab);
  return id === 'c1' ? '/modules/chengxu' : `/modules/chengxu?tab=${id}`;
}
