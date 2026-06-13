/** 受污名疾病与感染者群体 GY-57 · 页签 deep-link 路由(人群画像分层第五十五子集 · 公共卫生与反歧视视角、以科学事实校正污名、保护感染者人格与隐私、不渲染不猎奇) */

export const GANRAN_PANELS = {
  r1: 'gr-p-r1',
  r2: 'gr-p-r2',
  r3: 'gr-p-r3',
  r4: 'gr-p-r4',
  r5: 'gr-p-r5',
  watch: 'gr-p-watch',
};

const VALID_TABS = new Set(Object.keys(GANRAN_PANELS));

export function resolveGanranTab(tab) {
  if (!tab) return 'r1';
  return VALID_TABS.has(tab) ? tab : 'r1';
}

export const GANRAN_TAB_LABELS = {
  r1: 'R1 · 三类受污名疾病',
  r2: 'R2 · 医学事实vs社会污名',
  r3: 'R3 · 歧视的场域',
  r4: 'R4 · 反歧视的制度修正',
  r5: 'R5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const GANRAN_TABS = Object.entries(GANRAN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'r5' ? '#5d7489' : '#5e8c7a',
}));

export function ganranPanelId(tab) {
  return GANRAN_PANELS[resolveGanranTab(tab)];
}

export function ganranPath(tab = 'r1') {
  const id = resolveGanranTab(tab);
  return id === 'r1' ? '/modules/ganran' : `/modules/ganran?tab=${id}`;
}
