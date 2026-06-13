/** 流动与留守儿童 GY-54 · 页签 deep-link 路由(人群画像分层第五十二子集 · 涉未成年 · 儿童权益与发展视角、不渲染不问题化) */

export const ERTONG_PANELS = {
  e1: 'et-p-e1',
  e2: 'et-p-e2',
  e3: 'et-p-e3',
  e4: 'et-p-e4',
  e5: 'et-p-e5',
  watch: 'et-p-watch',
};

const VALID_TABS = new Set(Object.keys(ERTONG_PANELS));

export function resolveErtongTab(tab) {
  if (!tab) return 'e1';
  return VALID_TABS.has(tab) ? tab : 'e1';
}

export const ERTONG_TAB_LABELS = {
  e1: 'E1 · 两种分离',
  e2: 'E2 · 留守监护断裂',
  e3: 'E3 · 流动接入受限',
  e4: 'E4 · 关爱保护体系',
  e5: 'E5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const ERTONG_TABS = Object.entries(ERTONG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'e5' ? '#5d7489' : '#5e8c7a',
}));

export function ertongPanelId(tab) {
  return ERTONG_PANELS[resolveErtongTab(tab)];
}

export function ertongPath(tab = 'e1') {
  const id = resolveErtongTab(tab);
  return id === 'e1' ? '/modules/ertong' : `/modules/ertong?tab=${id}`;
}
