// ============================================================================
// 人才精英库 · 深链路由（HashRouter query params）
// ============================================================================

import { useCallback, useEffect, useRef } from 'react';

export const VALID_TALENT_TABS = new Set(['resume', 'anticorruption', 'dissident', 'taiwan', 'education', 'thinktank', 'research', 'knowledge', 'business', 'overseas', 'diplomatic', 'party-school', 'org-dept']);

export const LEGACY_TAB_ALIASES = {
  culture: 'knowledge', scholar: 'knowledge', gba: 'taiwan', hkmacau: 'taiwan',
  partyschool: 'party-school', 'party-school': 'party-school', orgengine: 'org-dept', 'org-dept': 'org-dept',
};

/** 中国政要稳定 id（与 Page.jsx figKey / 入库逻辑一致） */
export function figureEntityId(f) {
  if (!f) return '';
  if (f.id) return f.id;
  return `${f.name}#${f.fields?.birth || ''}#${f.province || ''}#${f.role || ''}#${f.org || f.fields?.title || ''}`;
}

export function resolveTalentTab(tabParam) {
  const resolved = LEGACY_TAB_ALIASES[tabParam] || tabParam;
  return VALID_TALENT_TABS.has(resolved) ? resolved : 'resume';
}

/**
 * 构建可分享的人才库深链
 * @param {{ tab?: string, id?: string, ce?: string, be?: string, bs?: string, tt?: string, ri?: string, ot?: string, dc?: string, dv?: string, tw?: string, rg?: string, q?: string }} opts
 */
export function buildTalentLink(opts = {}) {
  const { tab, id, ce, be, bs, tt, ri, ot, dc, dv, tw, rg, q } = opts;
  const params = new URLSearchParams();
  const resolvedTab = tab ? resolveTalentTab(tab) : 'resume';
  if (resolvedTab && resolvedTab !== 'resume') params.set('tab', resolvedTab);
  if (id) params.set('id', id);
  if (ce) params.set('ce', ce);
  if (be) params.set('be', be);
  if (bs) params.set('bs', bs);
  if (tt) params.set('tt', tt);
  if (ri) params.set('ri', ri);
  if (ot) params.set('ot', ot);
  if (dc) params.set('dc', dc);
  if (dv) params.set('dv', dv);
  if (tw) params.set('tw', tw);
  if (rg) params.set('rg', rg);
  if (q && !id) params.set('q', q);
  const qs = params.toString();
  return `/talent${qs ? `?${qs}` : ''}`;
}

export function entityIdOf(record, keyFn) {
  if (!record) return '';
  if (record.id) return record.id;
  if (keyFn) return keyFn(record);
  return record.name || '';
}

export function findEntityInList(list, id, { keyFn } = {}) {
  if (!list?.length || !id) return null;
  if (keyFn) {
    const byKey = list.find((r) => keyFn(r) === id);
    if (byKey) return byKey;
  }
  const byId = list.find((r) => r.id === id);
  if (byId) return byId;
  const byName = list.find((r) => r.name === id);
  if (byName) return byName;
  return null;
}

/**
 * 同步 URL ?id= 与列表选中项
 */
export function useTalentDeepLink({
  searchParams,
  setSearchParams,
  filtered,
  allList,
  sel,
  setSel,
  ready = true,
  preserveKeys = [],
  keyFn,
}) {
  const idParam = searchParams.get('id');
  const qParam = searchParams.get('q');
  const hydrating = useRef(false);

  useEffect(() => {
    if (!ready) return;
    const pool = allList?.length ? allList : filtered;
    if (!pool?.length) return;

    if (idParam) {
      const hit = findEntityInList(filtered, idParam, { keyFn })
        || findEntityInList(pool, idParam, { keyFn });
      if (hit && (!sel || (keyFn ? keyFn(sel) : entityIdOf(sel)) !== (keyFn ? keyFn(hit) : entityIdOf(hit)))) {
        hydrating.current = true;
        setSel(hit);
      }
      return;
    }

    if (qParam && !sel) {
      const byQ = pool.find((r) => r.name === qParam || (r.name && r.name.includes(qParam)));
      if (byQ) {
        hydrating.current = true;
        setSel(byQ);
      }
    }
  }, [idParam, qParam, ready, filtered, allList, sel, setSel, keyFn]);

  const selectEntity = useCallback((record, { keepQ = false } = {}) => {
    if (!record) return;
    setSel(record);
    const next = new URLSearchParams(searchParams);
    const eid = keyFn ? keyFn(record) : entityIdOf(record);
    if (eid) next.set('id', eid);
    else next.delete('id');
    if (!keepQ) next.delete('q');
    preserveKeys.forEach((key) => {
      const val = searchParams.get(key);
      if (val != null && val !== '') next.set(key, val);
    });
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, setSel, preserveKeys, keyFn]);

  useEffect(() => {
    if (hydrating.current) {
      hydrating.current = false;
      return;
    }
    if (!sel || !ready) return;
    const eid = keyFn ? keyFn(sel) : entityIdOf(sel);
    if (!eid || idParam === eid) return;
    const next = new URLSearchParams(searchParams);
    next.set('id', eid);
    preserveKeys.forEach((key) => {
      const val = searchParams.get(key);
      if (val != null && val !== '') next.set(key, val);
    });
    setSearchParams(next, { replace: true });
  }, [sel, ready, idParam, searchParams, setSearchParams, preserveKeys, keyFn]);

  return { idParam, qParam, selectEntity };
}
