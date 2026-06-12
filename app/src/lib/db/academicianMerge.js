// ============================================================================
// 两院院士 · 并入文化精英 / 商业精英队列
// ============================================================================
import { ACADEMICIAN_2026 } from './figureAcademician2026.js';
import { mergeAcademyIntoRow, academyFieldsFromRecord } from './academicianCommon.js';
import { classifySciField, normalizeCulturalEliteCategory } from './ceCategory.js';

function regionFromInstitution(institution) {
  const inst = String(institution || '');
  const m = inst.match(/^(北京|上海|天津|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|广西|海南|四川|贵州|云南|陕西|甘肃|青海|宁夏|新疆|西藏|内蒙古)/);
  if (m) return m[1];
  return inst.replace(/大学.*$|研究所.*$|研究院.*$/, '').slice(0, 6) || '北京';
}

/** 姓名 → 院士记录（合并 cas/cae 为 both） */
export function buildAcademicianIndex(list = ACADEMICIAN_2026) {
  const byName = new Map();
  for (const ac of list) {
    const name = (ac.name || '').trim();
    if (!name) continue;
    const prev = byName.get(name);
    if (!prev) {
      byName.set(name, { ...ac });
      continue;
    }
    const cas = prev.academy === 'cas' || prev.academy === 'both' || ac.academy === 'cas' || ac.academy === 'both';
    const cae = prev.academy === 'cae' || prev.academy === 'both' || ac.academy === 'cae' || ac.academy === 'both';
    const academy = cas && cae ? 'both' : cas ? 'cas' : cae ? 'cae' : prev.academy;
    byName.set(name, {
      ...prev,
      ...ac,
      academy,
      academyCas: academy === 'cas' || academy === 'both',
      academyCae: academy === 'cae' || academy === 'both',
      linkedId: prev.linkedId || ac.linkedId,
      electedYear: prev.electedYear || ac.electedYear,
    });
  }
  return byName;
}

/** 院士 → 文化精英队列（按领域归入基础科学/工程技术/医学健康） */
function academicianToCulturalEliteRow(ac) {
  const fields = academyFieldsFromRecord(ac);
  const label = fields.academy === 'both' ? '两院院士' : fields.academy === 'cas' ? '中科院院士' : '工程院院士';
  const category = classifySciField(ac.field, ac.institution, fields.academy);
  return {
    id: ac.id,
    name: ac.name,
    sector: '文化',
    category,
    tier: '',
    region: ac.region || regionFromInstitution(ac.institution),
    discipline: ac.field,
    field: ac.field,
    institution: ac.institution,
    title: `${label}·${ac.subfield || ac.field || ''}`,
    works: ac.works || ac.achievement || '',
    strengths: ac.field,
    rankNotes: `${label}·${ac.subfield || ac.field || ''}`,
    decade: ac.decade || '',
    source: ac.source || '中科院/工程院官网',
    notes: ac.notes || '',
    ...fields,
    academyDivision: ac.division || ac.academyDivision || '',
  };
}

/**
 * 将院士名录并入文化精英队列：已有同名记录则 enrich 并重算类目，缺失则追加
 * @param {object[]} rows
 */
export function mergeAcademiciansIntoCulturalElite(rows) {
  const index = buildAcademicianIndex();
  const seenNames = new Set();
  const out = (rows || []).map((row) => {
    const ac = index.get((row.name || '').trim());
    if (ac) {
      seenNames.add(ac.name);
      const merged = mergeAcademyIntoRow(row, ac);
      const cat = normalizeCulturalEliteCategory(merged);
      return cat ? { ...merged, category: cat } : merged;
    }
    return row;
  });
  for (const ac of index.values()) {
    if (seenNames.has(ac.name)) continue;
    out.push(academicianToCulturalEliteRow(ac));
    seenNames.add(ac.name);
  }
  return out;
}

/**
 * 将院士名录并入商业精英队列：按姓名 enrich
 * @param {object[]} rows
 */
export function mergeAcademiciansIntoBusinessElite(rows) {
  const index = buildAcademicianIndex();
  return (rows || []).map((row) => {
    const ac = index.get((row.name || '').trim());
    if (!ac) return row;
    const fields = academyFieldsFromRecord(ac);
    const honors = [row.honors, academyBadgeLabel(fields.academy)].filter(Boolean).join('；');
    return mergeAcademyIntoRow({ ...row, honors }, ac);
  });
}

function academyBadgeLabel(academy) {
  if (academy === 'both') return '两院院士';
  if (academy === 'cas') return '中科院院士';
  if (academy === 'cae') return '工程院院士';
  return '';
}

/** 统计院士分布 */
export function countAcademicians(rows) {
  let cas = 0;
  let cae = 0;
  let both = 0;
  for (const r of rows || []) {
    const a = r.academy || (r.academyCas && r.academyCae ? 'both' : r.academyCas ? 'cas' : r.academyCae ? 'cae' : null);
    if (a === 'both') both += 1;
    else if (a === 'cas') cas += 1;
    else if (a === 'cae') cae += 1;
  }
  return { cas, cae, both, total: cas + cae + both };
}
