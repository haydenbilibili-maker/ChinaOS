/** 农村留守妇女 GY-45 · 页签 deep-link 路由(人群画像分层第四十三子集) */

export const FUNV_PANELS = {
  f1: 'fn-p-f1',
  f2: 'fn-p-f2',
  f3: 'fn-p-f3',
  f4: 'fn-p-f4',
  f5: 'fn-p-f5',
  f6: 'fn-p-f6',
  watch: 'fn-p-watch',
};

const VALID_TABS = new Set(Object.keys(FUNV_PANELS));

export function resolveFunvTab(tab) {
  if (!tab) return 'f1';
  return VALID_TABS.has(tab) ? tab : 'f1';
}

export const FUNV_TAB_LABELS = {
  f1: 'F1 · 三留守承重轴',
  f2: 'F2 · 一人四岗',
  f3: 'F3 · 承担与权力倒挂',
  f4: 'F4 · 情感健康孤独',
  f5: 'F5 · 最沉默承重者',
  f6: 'F6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const FUNV_TABS = Object.entries(FUNV_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'f6' ? '#5d7489' : '#b5483a',
}));

export function funvPanelId(tab) {
  return FUNV_PANELS[resolveFunvTab(tab)];
}

export function funvPath(tab = 'f1') {
  const id = resolveFunvTab(tab);
  return id === 'f1' ? '/modules/funv' : `/modules/funv?tab=${id}`;
}
