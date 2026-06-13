/** 保安群体 GY-39 · 页签 deep-link 路由(人群画像分层第三十七子集) */

export const BAOAN_PANELS = {
  b1: 'ba-p-b1',
  b2: 'ba-p-b2',
  b3: 'ba-p-b3',
  b4: 'ba-p-b4',
  b5: 'ba-p-b5',
  b6: 'ba-p-b6',
  watch: 'ba-p-watch',
};

const VALID_TABS = new Set(Object.keys(BAOAN_PANELS));

export function resolveBaoanTab(tab) {
  if (!tab) return 'b1';
  return VALID_TABS.has(tab) ? tab : 'b1';
}

export const BAOAN_TAB_LABELS = {
  b1: 'B1 · 676万汇流池',
  b2: 'B2 · 在场即服务',
  b3: 'B3 · 劳动黑洞',
  b4: 'B4 · 三个来源',
  b5: 'B5 · 政治形态学',
  b6: 'B6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const BAOAN_TABS = Object.entries(BAOAN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'b6' ? '#5d7489' : '#b5483a',
}));

export function baoanPanelId(tab) {
  return BAOAN_PANELS[resolveBaoanTab(tab)];
}

export function baoanPath(tab = 'b1') {
  const id = resolveBaoanTab(tab);
  return id === 'b1' ? '/modules/baoan' : `/modules/baoan?tab=${id}`;
}
