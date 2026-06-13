/** 尘肺与职业病/工伤群体 GY-50 · 页签 deep-link 路由(人群画像分层第四十八子集 · 劳动权益+职业健康框架) */

export const ZHIYEBING_PANELS = {
  c1: 'zb-p-c1',
  c2: 'zb-p-c2',
  c3: 'zb-p-c3',
  c4: 'zb-p-c4',
  c5: 'zb-p-c5',
  watch: 'zb-p-watch',
};

const VALID_TABS = new Set(Object.keys(ZHIYEBING_PANELS));

export function resolveZhiyebingTab(tab) {
  if (!tab) return 'c1';
  return VALID_TABS.has(tab) ? tab : 'c1';
}

export const ZHIYEBING_TAB_LABELS = {
  c1: 'C1 · 占职业病90%尘肺存量',
  c2: 'C2 · 延迟显现长潜伏期',
  c3: 'C3 · 认定难证明来自哪台主机',
  c4: 'C4 · 因病致贫致债下游',
  c5: 'C5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const ZHIYEBING_TABS = Object.entries(ZHIYEBING_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'c5' ? '#5d7489' : '#5e8c7a',
}));

export function zhiyebingPanelId(tab) {
  return ZHIYEBING_PANELS[resolveZhiyebingTab(tab)];
}

export function zhiyebingPath(tab = 'c1') {
  const id = resolveZhiyebingTab(tab);
  return id === 'c1' ? '/modules/zhiyebing' : `/modules/zhiyebing?tab=${id}`;
}
