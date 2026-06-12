// ============================================================================
// 术语词典 · 查询与索引工具
// ============================================================================
import { moduleById } from '../../app/registry.js';
import {
  GLOSSARY_ENTRIES,
  GLOSSARY_CATEGORIES,
  GLOSSARY_META,
  GLOSSARY_COUNT,
} from './glossarySeed.js';

export { GLOSSARY_ENTRIES, GLOSSARY_CATEGORIES, GLOSSARY_META, GLOSSARY_COUNT };

const norm = (s) => String(s ?? '').toLowerCase();

export const CATEGORY_MAP = Object.fromEntries(GLOSSARY_CATEGORIES.map((c) => [c.id, c]));

export function resolveContext(ctx) {
  if (!ctx) return [];
  return ctx.map((c) => {
    const mod = c.moduleId ? moduleById(c.moduleId) : null;
    return {
      ...c,
      path: c.path || mod?.path || null,
      label: c.label || mod?.title || c.moduleId || '',
    };
  }).filter((c) => c.label);
}

export function enrichEntry(entry) {
  if (!entry) return null;
  return {
    ...entry,
    categoryLabel: CATEGORY_MAP[entry.category]?.label || entry.category,
    contextResolved: resolveContext(entry.context),
  };
}

const INITIALS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

export function glossaryInitials(entries = GLOSSARY_ENTRIES) {
  const counts = Object.fromEntries(INITIALS.map((i) => [i, 0]));
  for (const e of entries) {
    const ini = e.initial || '#';
    counts[ini] = (counts[ini] || 0) + 1;
  }
  return INITIALS.filter((i) => counts[i] > 0).map((i) => ({ id: i, label: i === '#' ? '#' : i, count: counts[i] }));
}

export function filterGlossary(entries, { q = '', category = 'all', initial = 'all' } = {}) {
  const terms = norm(q).trim().split(/\s+/).filter(Boolean);
  return entries.filter((e) => {
    if (category !== 'all' && e.category !== category) return false;
    if (initial !== 'all' && (e.initial || '#') !== initial) return false;
    if (!terms.length) return true;
    const hay = norm([e.term, ...(e.aliases || []), e.definition, e.source, ...(e.related || [])].join(' '));
    return terms.every((t) => hay.includes(t));
  });
}

export function findGlossaryEntry({ id, term } = {}) {
  if (id) {
    const byId = GLOSSARY_ENTRIES.find((e) => e.id === id);
    if (byId) return enrichEntry(byId);
  }
  if (term) {
    const t = term.trim();
    const exact = GLOSSARY_ENTRIES.find((e) => e.term === t || (e.aliases || []).includes(t));
    if (exact) return enrichEntry(exact);
    const loose = GLOSSARY_ENTRIES.find((e) => e.term.includes(t) || (e.aliases || []).some((a) => a.includes(t)));
    if (loose) return enrichEntry(loose);
  }
  return null;
}

export function buildGlossaryHay(entry) {
  return norm([
    entry.term,
    ...(entry.aliases || []),
    entry.definition,
    entry.source,
    CATEGORY_MAP[entry.category]?.label,
    ...(entry.related || []),
    ...(entry.context || []).map((c) => c.label || c.moduleId),
  ].join(' '));
}
