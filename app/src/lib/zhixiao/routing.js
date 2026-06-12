/** 职校生 · 被分流的一半 GY-11 · 页签 deep-link 路由 */

export const ZHIXIAO_PANELS = {
  j1: 'zx-p-j1',
  j2: 'zx-p-j2',
  j3: 'zx-p-j3',
  j4: 'zx-p-j4',
  j5: 'zx-p-j5',
  j6: 'zx-p-j6',
  j7: 'zx-p-j7',
  j8: 'zx-p-j8',
  watch: 'zx-p-watch',
};

const VALID_TABS = new Set(Object.keys(ZHIXIAO_PANELS));

export function resolveZhixiaoTab(tab) {
  if (!tab) return 'j1';
  return VALID_TABS.has(tab) ? tab : 'j1';
}

export const ZHIXIAO_TAB_LABELS = {
  j1: 'J1 · 隐形人群',
  j2: 'J2 · 分流机器',
  j3: 'J3 · 双重畸变',
  j4: 'J4 · 学生工管道',
  j5: 'J5 · 蓄水池预备役',
  j6: 'J6 · 心理与亚文化',
  j7: 'J7 · 政治形态学',
  j8: 'J8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const ZHIXIAO_TABS = Object.entries(ZHIXIAO_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'j6' ? '#5e8c7a' : '#b5483a',
}));

export function zhixiaoPanelId(tab) {
  return ZHIXIAO_PANELS[resolveZhixiaoTab(tab)];
}

export function zhixiaoPath(tab = 'j1') {
  const id = resolveZhixiaoTab(tab);
  return id === 'j1' ? '/modules/zhixiao' : `/modules/zhixiao?tab=${id}`;
}
