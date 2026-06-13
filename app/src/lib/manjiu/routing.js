/** 慢就业青年/全职儿女/NEET GY-34 · 页签 deep-link 路由(第三十二子集) */

export const MANJIU_PANELS = {
  m1: 'mj-p-m1',
  m2: 'mj-p-m2',
  m3: 'mj-p-m3',
  m4: 'mj-p-m4',
  m5: 'mj-p-m5',
  m6: 'mj-p-m6',
  watch: 'mj-p-watch',
};

const VALID_TABS = new Set(Object.keys(MANJIU_PANELS));

export function resolveManjiuTab(tab) {
  if (!tab) return 'm1';
  return VALID_TABS.has(tab) ? tab : 'm1';
}

export const MANJIU_TAB_LABELS = {
  m1: 'M1 · 退出光谱',
  m2: 'M2 · 投入产出倒挂',
  m3: 'M3 · 全职儿女',
  m4: 'M4 · 代际反向转移',
  m5: 'M5 · 政治形态学',
  m6: 'M6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const MANJIU_TABS = Object.entries(MANJIU_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'm5' ? '#5d7489' : '#b5483a',
}));

export function manjiuPanelId(tab) {
  return MANJIU_PANELS[resolveManjiuTab(tab)];
}

export function manjiuPath(tab = 'm1') {
  const id = resolveManjiuTab(tab);
  return id === 'm1' ? '/modules/manjiu' : `/modules/manjiu?tab=${id}`;
}
