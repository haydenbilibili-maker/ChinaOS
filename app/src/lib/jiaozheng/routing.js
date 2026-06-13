/** 社区矫正与刑释人员 GY-44 · 页签 deep-link 路由(人群画像分层第四十二子集) */

export const JIAOZHENG_PANELS = {
  j1: 'jc-p-j1',
  j2: 'jc-p-j2',
  j3: 'jc-p-j3',
  j4: 'jc-p-j4',
  j5: 'jc-p-j5',
  j6: 'jc-p-j6',
  watch: 'jc-p-watch',
};

const VALID_TABS = new Set(Object.keys(JIAOZHENG_PANELS));

export function resolveJiaozhengTab(tab) {
  if (!tab) return 'j1';
  return VALID_TABS.has(tab) ? tab : 'j1';
}

export const JIAOZHENG_TAB_LABELS = {
  j1: 'J1 · 社区矫正非监禁刑',
  j2: 'J2 · 权限残留前科标记',
  j3: 'J3 · 回归的断点',
  j4: 'J4 · 安置帮教',
  j5: 'J5 · 被标记者的两难',
  j6: 'J6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const JIAOZHENG_TABS = Object.entries(JIAOZHENG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'j6' ? '#5d7489' : '#b5483a',
}));

export function jiaozhengPanelId(tab) {
  return JIAOZHENG_PANELS[resolveJiaozhengTab(tab)];
}

export function jiaozhengPath(tab = 'j1') {
  const id = resolveJiaozhengTab(tab);
  return id === 'j1' ? '/modules/jiaozheng' : `/modules/jiaozheng?tab=${id}`;
}
