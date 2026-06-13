/** 城市极贫与救助对象 GY-43 · 页签 deep-link 路由(人群画像分层第四十一子集) */

export const JIPIN_PANELS = {
  j1: 'jp-p-j1',
  j2: 'jp-p-j2',
  j3: 'jp-p-j3',
  j4: 'jp-p-j4',
  j5: 'jp-p-j5',
  j6: 'jp-p-j6',
  watch: 'jp-p-watch',
};

const VALID_TABS = new Set(Object.keys(JIPIN_PANELS));

export function resolveJipinTab(tab) {
  if (!tab) return 'j1';
  return VALID_TABS.has(tab) ? tab : 'j1';
}

export const JIPIN_TAB_LABELS = {
  j1: 'J1 · 3986万最低限度',
  j2: 'J2 · keep-alive保活',
  j3: 'J3 · 网眼之外',
  j4: 'J4 · 核查与尊严',
  j5: 'J5 · 底板的政治意义',
  j6: 'J6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const JIPIN_TABS = Object.entries(JIPIN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'j6' ? '#5d7489' : '#b5483a',
}));

export function jipinPanelId(tab) {
  return JIPIN_PANELS[resolveJipinTab(tab)];
}

export function jipinPath(tab = 'j1') {
  const id = resolveJipinTab(tab);
  return id === 'j1' ? '/modules/jipin' : `/modules/jipin?tab=${id}`;
}
