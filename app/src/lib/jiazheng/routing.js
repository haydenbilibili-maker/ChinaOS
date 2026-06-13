/** 家政与照护工人 GY-31 · 页签 deep-link 路由(第二十九子集) */

export const JIAZHENG_PANELS = {
  j1: 'jz-p-j1',
  j2: 'jz-p-j2',
  j3: 'jz-p-j3',
  j4: 'jz-p-j4',
  j5: 'jz-p-j5',
  j6: 'jz-p-j6',
  watch: 'jz-p-watch',
};

const VALID_TABS = new Set(Object.keys(JIAZHENG_PANELS));

export function resolveJiazhengTab(tab) {
  if (!tab) return 'j1';
  return VALID_TABS.has(tab) ? tab : 'j1';
}

export const JIAZHENG_TAB_LABELS = {
  j1: 'J1 · 万亿市场3000万供给',
  j2: 'J2 · 出借的照护自家停摆',
  j3: 'J3 · 情感劳动不可计价',
  j4: 'J4 · 法律黑洞无保障',
  j5: 'J5 · 政治形态学人肉填充',
  j6: 'J6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const JIAZHENG_TABS = Object.entries(JIAZHENG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'j5' ? '#5d7489' : '#b5483a',
}));

export function jiazhengPanelId(tab) {
  return JIAZHENG_PANELS[resolveJiazhengTab(tab)];
}

export function jiazhengPath(tab = 'j1') {
  const id = resolveJiazhengTab(tab);
  return id === 'j1' ? '/modules/jiazheng' : `/modules/jiazheng?tab=${id}`;
}
