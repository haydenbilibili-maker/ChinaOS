/** 农民工(新生代) GY-06 · 页签 deep-link 路由 */

export const NONGMINGONG_PANELS = {
  m1: 'nm-p-m1',
  m2: 'nm-p-m2',
  m3: 'nm-p-m3',
  m4: 'nm-p-m4',
  m5: 'nm-p-m5',
  m6: 'nm-p-m6',
  m7: 'nm-p-m7',
  m8: 'nm-p-m8',
  watch: 'nm-p-watch',
};

const VALID_TABS = new Set(Object.keys(NONGMINGONG_PANELS));

export function resolveNongmingongTab(tab) {
  if (!tab) return 'm1';
  return VALID_TABS.has(tab) ? tab : 'm1';
}

export const NONGMINGONG_TAB_LABELS = {
  m1: 'M1 · 双峰规模',
  m2: 'M2 · 户籍机器',
  m3: 'M3 · 认同悬置',
  m4: 'M4 · 教育再生产',
  m5: 'M5 · 老去的一代',
  m6: 'M6 · 经济换岗',
  m7: 'M7 · 县域回流',
  m8: 'M8 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const NONGMINGONG_TABS = Object.entries(NONGMINGONG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'm7' ? '#5e8c7a' : '#b5483a',
}));

export function nongmingongPanelId(tab) {
  return NONGMINGONG_PANELS[resolveNongmingongTab(tab)];
}

export function nongmingongPath(tab = 'm1') {
  const id = resolveNongmingongTab(tab);
  return id === 'm1' ? '/modules/nongmingong' : `/modules/nongmingong?tab=${id}`;
}
