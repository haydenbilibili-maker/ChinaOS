/** 国运模块 · 两谱系深链（?tab=timeline|sim）+ 推演深链（panel / scenario / var / watch） */
import { buildGuoyunSimLink } from '../gy/coupling.js';

export const GUOYUN_TABS = [
  { id: 'timeline', label: '时间轴 · 已发生', accent: '#5e8c7a' },
  { id: 'sim', label: '推演 · 未来', accent: '#d4af37' },
];

export const GUOYUN_TAB_LABELS = Object.fromEntries(GUOYUN_TABS.map((t) => [t.id, t.label]));

const VALID = new Set(GUOYUN_TABS.map((t) => t.id));

export function resolveGuoyunTab(tab) {
  return VALID.has(tab) ? tab : 'sim';
}

export function guoyunPath(tab = 'sim', simOpts) {
  const id = resolveGuoyunTab(tab);
  if (id !== 'sim') return `/modules/guoyun?tab=${id}`;
  return buildGuoyunSimLink(simOpts);
}
