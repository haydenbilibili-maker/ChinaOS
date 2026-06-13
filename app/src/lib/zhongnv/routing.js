/** 中年女性 · 被折叠的一代 GY-17 · 页签 deep-link 路由(第十五子集) */

export const ZHONGNV_PANELS = {
  m1: 'zn-p-m1',
  m2: 'zn-p-m2',
  m3: 'zn-p-m3',
  m4: 'zn-p-m4',
  m5: 'zn-p-m5',
  m6: 'zn-p-m6',
  m7: 'zn-p-m7',
  m8: 'zn-p-m8',
  watch: 'zn-p-watch',
};

const VALID_TABS = new Set(Object.keys(ZHONGNV_PANELS));

export function resolveZhongnvTab(tab) {
  if (!tab) return 'm1';
  return VALID_TABS.has(tab) ? tab : 'm1';
}

export const ZHONGNV_TAB_LABELS = {
  m1: 'M1 · 夹空中间层',
  m2: 'M2 · 隐形劳动总账',
  m3: 'M3 · 三明治照护',
  m4: 'M4 · 法律脆弱',
  m5: 'M5 · 再就业双门槛',
  m6: 'M6 · 健康自我塌缩',
  m7: 'M7 · 政治形态学',
  m8: 'M8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const ZHONGNV_TABS = Object.entries(ZHONGNV_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'm6' ? '#5e8c7a' : '#b5483a',
}));

export function zhongnvPanelId(tab) {
  return ZHONGNV_PANELS[resolveZhongnvTab(tab)];
}

export function zhongnvPath(tab = 'm1') {
  const id = resolveZhongnvTab(tab);
  return id === 'm1' ? '/modules/zhongnv' : `/modules/zhongnv?tab=${id}`;
}
