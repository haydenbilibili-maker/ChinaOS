/** 被拐卖与反拐救助对象 GY-52 · 页签 deep-link 路由(人群画像分层第五十子集 · 妇女儿童权益与反拐制度框架 · 受害者视角) */

export const FANGUI_PANELS = {
  f1: 'fg-p-f1',
  f2: 'fg-p-f2',
  f3: 'fg-p-f3',
  f4: 'fg-p-f4',
  f5: 'fg-p-f5',
  watch: 'fg-p-watch',
};

const VALID_TABS = new Set(Object.keys(FANGUI_PANELS));

export function resolveFanguiTab(tab) {
  if (!tab) return 'f1';
  return VALID_TABS.has(tab) ? tab : 'f1';
}

export const FANGUI_TAB_LABELS = {
  f1: 'F1 · 反拐成效与制度',
  f2: 'F2 · 寻址丢失身份擦除',
  f3: 'F3 · 预防与脆弱性',
  f4: 'F4 · 法律完善讨论(归因)',
  f5: 'F5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const FANGUI_TABS = Object.entries(FANGUI_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'f5' ? '#5d7489' : '#5e8c7a',
}));

export function fanguiPanelId(tab) {
  return FANGUI_PANELS[resolveFanguiTab(tab)];
}

export function fanguiPath(tab = 'f1') {
  const id = resolveFanguiTab(tab);
  return id === 'f1' ? '/modules/fangui' : `/modules/fangui?tab=${id}`;
}
