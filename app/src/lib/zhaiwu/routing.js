/** 失信被执行人与债务人群 GY-32 · 页签 deep-link 路由(第三十子集) */

export const ZHAIWU_PANELS = {
  z1: 'zw-p-z1',
  z2: 'zw-p-z2',
  z3: 'zw-p-z3',
  z4: 'zw-p-z4',
  z5: 'zw-p-z5',
  z6: 'zw-p-z6',
  z7: 'zw-p-z7',
  watch: 'zw-p-watch',
};

const VALID_TABS = new Set(Object.keys(ZHAIWU_PANELS));

export function resolveZhaiwuTab(tab) {
  if (!tab) return 'z1';
  return VALID_TABS.has(tab) ? tab : 'z1';
}

export const ZHAIWU_TAB_LABELS = {
  z1: 'Z1 · 规模分层与失信失能区分',
  z2: 'Z2 · 权限系统性降级',
  z3: 'Z3 · 债务来源风险货币化',
  z4: 'Z4 · 以贷养贷金融下沉',
  z5: 'Z5 · 信用修复与个人破产',
  z6: 'Z6 · 政治形态学',
  z7: 'Z7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const ZHAIWU_TABS = Object.entries(ZHAIWU_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'z6' ? '#5d7489' : '#b5483a',
}));

export function zhaiwuPanelId(tab) {
  return ZHAIWU_PANELS[resolveZhaiwuTab(tab)];
}

export function zhaiwuPath(tab = 'z1') {
  const id = resolveZhaiwuTab(tab);
  return id === 'z1' ? '/modules/zhaiwu' : `/modules/zhaiwu?tab=${id}`;
}
