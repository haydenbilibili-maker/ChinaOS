/** 中小学教师 GY-38 · 页签 deep-link 路由(人群画像分层第三十六子集) */

export const JIAOSHI_PANELS = {
  j1: 'js-p-j1',
  j2: 'js-p-j2',
  j3: 'js-p-j3',
  j4: 'js-p-j4',
  j5: 'js-p-j5',
  j6: 'js-p-j6',
  j7: 'js-p-j7',
  watch: 'js-p-watch',
};

const VALID_TABS = new Set(Object.keys(JIAOSHI_PANELS));

export function resolveJiaoshiTab(tab) {
  if (!tab) return 'j1';
  return VALID_TABS.has(tab) ? tab : 'j1';
}

export const JIAOSHI_TAB_LABELS = {
  j1: 'J1 · 1800万教育劳动者',
  j2: 'J2 · 优先级反转',
  j3: 'J3 · 双减悖论',
  j4: 'J4 · 学龄人口拐点',
  j5: 'J5 · 县中塌陷',
  j6: 'J6 · 政治形态学',
  j7: 'J7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const JIAOSHI_TABS = Object.entries(JIAOSHI_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'j7' ? '#5d7489' : '#b5483a',
}));

export function jiaoshiPanelId(tab) {
  return JIAOSHI_PANELS[resolveJiaoshiTab(tab)];
}

export function jiaoshiPath(tab = 'j1') {
  const id = resolveJiaoshiTab(tab);
  return id === 'j1' ? '/modules/jiaoshi' : `/modules/jiaoshi?tab=${id}`;
}
