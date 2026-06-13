/** 征地拆迁与失地农民 GY-51 · 页签 deep-link 路由(人群画像分层第四十九子集 · 土地制度框架) */

export const ZHENGDI_PANELS = {
  z1: 'zd-p-z1',
  z2: 'zd-p-z2',
  z3: 'zd-p-z3',
  z4: 'zd-p-z4',
  z5: 'zd-p-z5',
  watch: 'zd-p-watch',
};

const VALID_TABS = new Set(Object.keys(ZHENGDI_PANELS));

export function resolveZhengdiTab(tab) {
  if (!tab) return 'z1';
  return VALID_TABS.has(tab) ? tab : 'z1';
}

export const ZHENGDI_TAB_LABELS = {
  z1: 'Z1 · 规模与制度框架',
  z2: 'Z2 · 一次性置换三重功能买断',
  z3: 'Z3 · 增值分配与补偿争议',
  z4: 'Z4 · 拆迁暴富与区位分化',
  z5: 'Z5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const ZHENGDI_TABS = Object.entries(ZHENGDI_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'z5' ? '#5d7489' : '#5e8c7a',
}));

export function zhengdiPanelId(tab) {
  return ZHENGDI_PANELS[resolveZhengdiTab(tab)];
}

export function zhengdiPath(tab = 'z1') {
  const id = resolveZhengdiTab(tab);
  return id === 'z1' ? '/modules/zhengdi' : `/modules/zhengdi?tab=${id}`;
}
