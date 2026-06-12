/** 国运模块 · 两谱系深链（?tab=timeline|sim） */
export const GUOYUN_TABS = [
  { id: 'timeline', label: '时间轴 · 已发生', accent: '#5e8c7a' },
  { id: 'sim', label: '推演 · 未来', accent: '#d4af37' },
];

export const GUOYUN_TAB_LABELS = Object.fromEntries(GUOYUN_TABS.map((t) => [t.id, t.label]));

const VALID = new Set(GUOYUN_TABS.map((t) => t.id));

export function resolveGuoyunTab(tab) {
  return VALID.has(tab) ? tab : 'sim';
}

export function guoyunPath(tab = 'sim') {
  const id = resolveGuoyunTab(tab);
  return id === 'sim' ? '/modules/guoyun' : `/modules/guoyun?tab=${id}`;
}
