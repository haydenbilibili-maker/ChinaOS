// ============================================================================
// 两院院士 · 共享字段解析与徽章逻辑
// ============================================================================

/** @typedef {'cas' | 'cae' | 'both'} AcademyKind */

/** 从文本推断院士类型 */
export function parseAcademyFromText(text) {
  const hay = String(text || '');
  const cas = /中科院院士|中国科学院院士/.test(hay);
  const cae = /工程院院士|中国工程院院士/.test(hay);
  if (cas && cae) return 'both';
  if (cas) return 'cas';
  if (cae) return 'cae';
  return null;
}

/** @param {object} r */
export function resolveAcademy(r) {
  if (!r) return null;
  if (r.academy === 'cas' || r.academy === 'cae' || r.academy === 'both') return r.academy;
  if (r.academyCas && r.academyCae) return 'both';
  if (r.academyCas) return 'cas';
  if (r.academyCae) return 'cae';
  const fromText = parseAcademyFromText([r.title, r.rankNotes, r.honors, r.notes].filter(Boolean).join(' '));
  return fromText;
}

/** @param {object} r */
export function isAcademician(r) {
  return !!resolveAcademy(r);
}

/** @param {AcademyKind | null} academy */
export function academyBadgeLabel(academy) {
  if (academy === 'both') return '两院院士';
  if (academy === 'cas') return '中科院院士';
  if (academy === 'cae') return '工程院院士';
  return null;
}

/** @param {AcademyKind | null} academy */
export function academyBadgeColor(academy) {
  if (academy === 'both') return { bg: 'rgba(217, 178, 106,0.18)', fg: '#d9b26a', border: 'rgba(217, 178, 106,0.45)' };
  if (academy === 'cas') return { bg: 'rgba(110, 140, 255,0.14)', fg: '#6e8cff', border: 'rgba(110, 140, 255,0.4)' };
  if (academy === 'cae') return { bg: 'rgba(212, 162, 90,0.14)', fg: '#d4a25a', border: 'rgba(212, 162, 90,0.4)' };
  return null;
}

/** @param {object} r */
export function academyTooltip(r) {
  const label = academyBadgeLabel(resolveAcademy(r));
  if (!label) return '';
  const parts = [label];
  if (r.academyDivision) parts.push(r.academyDivision);
  if (r.electedYear) parts.push(`当选 ${r.electedYear}`);
  return parts.join(' · ');
}

/** @param {object} ac */
export function academyFieldsFromRecord(ac) {
  const academy = ac.academy || (ac.academyCas && ac.academyCae ? 'both' : ac.academyCas ? 'cas' : ac.academyCae ? 'cae' : null);
  return {
    academy,
    academyCas: academy === 'cas' || academy === 'both',
    academyCae: academy === 'cae' || academy === 'both',
    academyDivision: ac.division || ac.academyDivision || '',
    electedYear: ac.electedYear || ac.elected || null,
  };
}

/** @param {object} row @param {object} ac */
export function mergeAcademyIntoRow(row, ac) {
  if (!ac) return row;
  const fields = academyFieldsFromRecord(ac);
  const titlePrefix = academyBadgeLabel(fields.academy);
  const hasTitle = [row.title, row.rankNotes, row.honors].filter(Boolean).join(' ').includes('院士');
  return {
    ...row,
    ...fields,
    title: hasTitle ? row.title : (row.title || `${titlePrefix}·${row.field || ac.field || ''}`),
    rankNotes: row.rankNotes || row.title || `${titlePrefix}·${ac.field || row.field || ''}`,
  };
}
