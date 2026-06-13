// ============================================================================
// 全局搜索 · 统一索引构建器
// ----------------------------------------------------------------------------
// 聚合「模块注册表 + 人物 + 文化/商业精英 + 民企500强 + 反腐名单」为单一可检索
// 列表；重型 seed 文件按需动态导入，首次打开搜索时才构建，避免拖慢启动。
// 每条记录形如：{ type, id, title, subtitle, badge, path, hay, talentTab?, subCategory?, entityId?, dataset? }
// ============================================================================

import { MODULES, GROUPS } from '../../app/registry.js';
import { buildTalentLink, figureEntityId } from '../talent/routing.js';
import { FIGURE_SEED_COUNT } from '../db/figureSeed.js';
import {
  ceKey,
  CE_TAB_LABEL,
  CULTURAL_ELITE_SEED_PKG,
  CULTURAL_ELITE_META,
  CULTURAL_ELITE_DEDUPED_COUNT,
} from '../db/culturalEliteSeed.js';
import { acKey as antiCorruptionKey, ANTI_CORRUPTION_COUNT } from '../db/antiCorruptionSeed.js';
import { otKey } from '../db/overseasTalentSeed.js';
import { dcKey, DC_TAB_LABEL, DIPLOMATIC_CORPS_SEED_PKG } from '../db/diplomaticCorpsSeed.js';
import { dvKey, DISSIDENT_DEDUPED_COUNT } from '../db/dissidentSeed.js';
import { twKey, TW_REGION_LABEL, TW_TAB_LABEL, TAIWAN_POLITICAL_DEDUPED_COUNT } from '../db/taiwanPoliticalSeed.js';
import { acKey as acadKey } from '../db/academicianSeed.js';
import { academyBadgeLabel, resolveAcademy } from '../db/academicianCommon.js';
import {
  smKey,
  SM_TAB_LABEL,
  SELF_MEDIA_SEED_PKG,
  SELF_MEDIA_DEDUPED_COUNT,
  SELF_MEDIA_INDEX_NAMES,
} from '../db/selfMediaSeed.js';
import { normalizeSelfMediaName } from '../db/selfMediaPrimary.js';
import { GLOSSARY_COUNT } from '../db/glossarySeed.js';
import { buildGlossaryHay } from '../db/glossary.js';

const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.id, g.label]));
const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const norm = (s) => String(s == null ? '' : s).toLowerCase();

const hayOf = (...parts) => norm(parts.filter(Boolean).join(' '));

const pushRecord = (records, rec) => {
  records.push({
    talentTab: null,
    subCategory: null,
    entityId: null,
    dataset: null,
    ...rec,
  });
};

export function buildModuleRecords() {
  return MODULES.map((m) => {
    const groupLabel = GROUP_LABEL[m.group] || m.group;
    return {
      type: 'module',
      id: `module:${m.id}`,
      title: m.title,
      subtitle: m.subtitle || '',
      badge: groupLabel,
      icon: m.icon,
      path: m.path,
      hay: hayOf(m.title, m.subtitle, groupLabel, m.id, m.path),
      talentTab: null,
      subCategory: null,
      entityId: null,
      dataset: null,
    };
  });
}

/** 种子变更时递增，使模块级索引缓存在 HMR / 热更新后失效 */
export const SEARCH_INDEX_REVISION = `v19:anticorruption-2026-06:${ANTI_CORRUPTION_COUNT}:${GLOSSARY_COUNT}:${SELF_MEDIA_DEDUPED_COUNT.total}:${CULTURAL_ELITE_DEDUPED_COUNT.total}:${DIPLOMATIC_CORPS_SEED_PKG?.rows?.length ?? 0}:${DISSIDENT_DEDUPED_COUNT.total}:${TAIWAN_POLITICAL_DEDUPED_COUNT.total}:${FIGURE_SEED_COUNT}`;

let _indexPromise = null;
let _indexRevision = null;

export function invalidateSearchIndex() {
  _indexPromise = null;
  _indexRevision = null;
}

export function buildSearchIndex() {
  if (_indexPromise && _indexRevision === SEARCH_INDEX_REVISION) return _indexPromise;
  invalidateSearchIndex();
  _indexRevision = SEARCH_INDEX_REVISION;
  _indexPromise = (async () => {
    const records = [...buildModuleRecords()];

    const [
      { FIGURE_SEED },
      { BUSINESS_ELITE_SEED_PKG },
      { ANTI_CORRUPTION_SEED_PKG },
      { PE500_COMPANIES },
      { HIGHER_EDUCATION_SEED_PKG },
      { THINK_TANK_SEED_PKG },
      { RESEARCH_INSTITUTE_SEED_PKG },
      { OVERSEAS_TALENT_SEED_PKG, OT_TAB_LABEL },
      { DIPLOMATIC_CORPS_SEED_PKG: DC_SEED_PKG },
      { DISSIDENT_SEED_PKG, DV_TAB_LABEL },
      { TAIWAN_POLITICAL_SEED_PKG, TW_TAB_LABEL },
      { ACADEMICIAN_SEED_PKG },
      { LEGAL_STATUTE_SEED_PKG, LS_TYPE_MAP },
    ] = await Promise.all([
      import('../db/figureSeed.js'),
      import('../db/businessEliteSeed.js'),
      import('../db/antiCorruptionSeed.js'),
      import('../db/privateEnterpriseSeed.js'),
      import('../db/higherEducationSeed.js'),
      import('../db/thinkTankSeed.js'),
      import('../db/researchInstituteSeed.js'),
      import('../db/overseasTalentSeed.js'),
      import('../db/diplomaticCorpsSeed.js'),
      import('../db/dissidentSeed.js'),
      import('../db/taiwanPoliticalSeed.js'),
      import('../db/academicianSeed.js'),
      import('../db/legalStatuteSeed.js'),
    ]);

    const figSeen = new Set();
    for (const f of FIGURE_SEED || []) {
      const name = f.name;
      if (!name) continue;
      const role = f.role || f.fields?.title || '';
      const org = f.org || f.fields?.institution || '';
      const prov = f.province && f.province !== '中央' ? short(f.province) : (f.province || '');
      const dedupe = `${name}#${role}#${org}`;
      if (figSeen.has(dedupe)) continue;
      figSeen.add(dedupe);
      const entityId = figureEntityId(f);
      const ctx = [role, f.level, prov].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'figure',
        id: `figure:${entityId}`,
        title: name,
        subtitle: ctx,
        badge: f.sector === '军队' ? '军事' : (f.level || '中国政要'),
        path: buildTalentLink({ id: entityId }),
        talentTab: 'resume',
        subCategory: f.sector || f.level,
        entityId,
        dataset: 'figures',
        hay: hayOf(name, role, org, f.level, f.sector, prov, short(f.province), f.fields?.native, f.provenance, f.verifyTier, f.source, f.tags, f.confidence),
      });
    }

    for (const r of CULTURAL_ELITE_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      if (SELF_MEDIA_INDEX_NAMES.has(normalizeSelfMediaName(r.name))) continue;
      const entityId = ceKey(r);
      const ctx = [r.discipline || r.field, r.institution || r.title, r.region].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'knowledge',
        id: `knowledge:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: CE_TAB_LABEL[r.category] || '知识精英',
        path: buildTalentLink({ tab: 'knowledge', ce: r.category, id: entityId }),
        talentTab: 'knowledge',
        subCategory: r.category,
        entityId,
        dataset: 'cultural-elite',
        hay: hayOf(entityId, r.id, r.name, r.discipline, r.field, r.institution, r.title, r.region, r.works, r.tier, r.category, CE_TAB_LABEL[r.category], r.provenance, r.verifyTier, r.source, r.tags, r.bio),
      });
    }

    for (const r of BUSINESS_ELITE_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = r.id || `${r.name}#${r.category || ''}`;
      const sk = r.sectorKey || r.industry || '';
      const ctx = [r.title, r.company, r.industry, sk, short(r.province)].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'business',
        id: `business:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: '商业精英',
        path: buildTalentLink({ tab: 'business', be: r.category, bs: r.sectorKey, id: entityId }),
        talentTab: 'business',
        subCategory: r.category,
        entityId,
        dataset: 'business-elite',
        hay: hayOf(r.name, r.title, r.company, r.industry, r.sectorKey, r.province, short(r.province), r.background, r.provenance, r.verifyTier, r.source, r.tags, r.bio),
      });
    }

    for (const r of ANTI_CORRUPTION_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = antiCorruptionKey(r);
      const ctx = [r.formerRole, r.level, short(r.province)].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'anticorruption',
        id: `anticorruption:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: r.status || '落马',
        path: buildTalentLink({ tab: 'anticorruption', id: entityId }),
        talentTab: 'anticorruption',
        subCategory: r.level,
        entityId,
        dataset: 'anticorruption',
        hay: hayOf(r.name, r.formerRole, r.org, r.level, r.province, short(r.province), r.sector),
      });
    }

    for (const r of HIGHER_EDUCATION_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = r.id || r.name;
      const ctx = [r.tier, r.discipline, short(r.region)].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'education',
        id: `education:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: r.tier || '高等教育',
        path: buildTalentLink({ tab: 'education', id: entityId }),
        talentTab: 'education',
        subCategory: r.tier,
        entityId,
        dataset: 'higher-education',
        hay: hayOf(r.name, r.discipline, r.type, r.strengths, r.tier, r.tags, r.region, r.rankNotes, r.notes),
      });
    }

    for (const r of THINK_TANK_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = r.id || r.name;
      const ctx = [r.type, r.affiliation, short(r.province)].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'thinktank',
        id: `thinktank:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: r.type || '智库',
        path: buildTalentLink({ tab: 'thinktank', tt: r.type, id: entityId }),
        talentTab: 'thinktank',
        subCategory: r.type,
        entityId,
        dataset: 'think-tank',
        hay: hayOf(r.name, r.affiliation, r.focusAreas, r.tier, r.province, r.honors),
      });
    }

    for (const r of RESEARCH_INSTITUTE_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = r.id || r.name;
      const ctx = [r.type, r.field, short(r.province)].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'research',
        id: `research:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: r.type === '大科学装置' ? (r.tier || '大科学装置') : (r.tier || r.type || '科研院所'),
        path: buildTalentLink({ tab: 'research', ri: r.type, id: entityId }),
        talentTab: 'research',
        subCategory: r.type,
        entityId,
        dataset: 'research-institute',
        hay: hayOf(r.name, r.field, r.type, r.province, r.tier, r.notes, r.parentCompany, r.tags, r.scale),
      });
    }

    for (const r of OVERSEAS_TALENT_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = otKey(r);
      const ctx = [OT_TAB_LABEL[r.category], r.institution, r.baseCountry].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'overseas',
        id: `overseas:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: OT_TAB_LABEL[r.category] || '海外人才',
        path: buildTalentLink({ tab: 'overseas', ot: r.category, id: entityId }),
        talentTab: 'overseas',
        subCategory: r.category,
        entityId,
        dataset: 'overseas-talent',
        hay: hayOf(r.name, r.nameEn, r.institution, r.role, r.field, r.bio, r.tags, r.baseCountry, OT_TAB_LABEL[r.category]),
      });
    }

    for (const r of DC_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = dcKey(r);
      const ctx = [r.role, r.hostCity, r.hostCountry, DC_TAB_LABEL[r.region]].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'diplomatic',
        id: `diplomatic:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: DC_TAB_LABEL[r.region] || '外交人才',
        path: buildTalentLink({ tab: 'diplomatic', dc: r.region, id: entityId }),
        talentTab: 'diplomatic',
        subCategory: r.region,
        entityId,
        dataset: 'diplomatic-corps',
        hay: hayOf(r.name, r.nameEn, r.role, r.hostCountry, r.hostCity, r.region, r.careerHighlights, ...(r.previousPosts || []), r.rank, r.provenance, r.source),
      });
    }

    const smSeen = new Set();
    for (const r of SELF_MEDIA_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = smKey(r);
      const normName = normalizeSelfMediaName(r.name);
      if (smSeen.has(normName)) continue;
      smSeen.add(normName);
      const ctx = [r.platform, r.niche, r.followers, SM_TAB_LABEL[r.category]].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'selfMedia',
        id: `selfMedia:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: SM_TAB_LABEL[r.category] || '自媒体人',
        path: buildTalentLink({ tab: 'self-media', sm: r.category, id: entityId }),
        talentTab: 'self-media',
        subCategory: r.category,
        entityId,
        dataset: 'self-media',
        hay: hayOf(entityId, r.id, r.name, r.platform, r.platformKey, r.niche, r.followers, r.bio, r.keyWorks, r.controversies, r.tier, SM_TAB_LABEL[r.category], r.source, r.tags),
      });
    }

    for (const r of DISSIDENT_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = dvKey(r);
      const ctx = [DV_TAB_LABEL[r.category], r.knownFor, r.status, r.location].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'dissident',
        id: `dissident:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: DV_TAB_LABEL[r.category] || '异见人士',
        path: buildTalentLink({ tab: 'dissident', dv: r.category, id: entityId }),
        talentTab: 'dissident',
        subCategory: r.category,
        entityId,
        dataset: 'dissent-voices',
        hay: hayOf(r.name, r.nameEn, r.background, r.field, r.knownFor, r.status, r.location, r.bio, r.tags, DV_TAB_LABEL[r.category]),
      });
    }

    const acadSeen = new Set();
    for (const r of ACADEMICIAN_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = acadKey(r);
      if (acadSeen.has(entityId)) continue;
      acadSeen.add(entityId);
      const badge = academyBadgeLabel(resolveAcademy(r)) || '两院院士';
      const ctx = [r.field, r.institution, r.division, r.electedYear ? `当选${r.electedYear}` : ''].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'academician',
        id: `academician:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge,
        path: buildTalentLink({ tab: 'knowledge', id: r.linkedId || entityId }),
        talentTab: 'knowledge',
        subCategory: resolveAcademy(r),
        entityId,
        dataset: 'academician',
        hay: hayOf(r.name, r.field, r.institution, r.division, r.subfield, r.works, badge, r.region),
      });
    }

    const taiwanSeen = new Set();
    for (const r of TAIWAN_POLITICAL_SEED_PKG?.rows || []) {
      if (!r.name) continue;
      const entityId = twKey(r);
      if (taiwanSeen.has(entityId)) continue;
      taiwanSeen.add(entityId);
      const ctx = [TW_REGION_LABEL[r.region], TW_TAB_LABEL[r.category], r.role, r.party, r.status].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'taiwan',
        id: `taiwan:${entityId}`,
        title: r.name,
        subtitle: ctx,
        badge: TW_REGION_LABEL[r.region] || TW_TAB_LABEL[r.category] || '港澳台政要',
        path: buildTalentLink({ tab: 'taiwan', rg: r.region, tw: r.category, id: entityId }),
        talentTab: 'taiwan',
        subCategory: r.category,
        entityId,
        dataset: 'taiwan-political',
        hay: hayOf(r.name, r.nameEn, r.role, r.term, r.party, r.status, r.bio, r.tags, r.region, TW_REGION_LABEL[r.region], TW_TAB_LABEL[r.category]),
      });
    }

    const legalSeen = new Set();
    let corpusIdSet = new Set();
    try {
      const { loadLegalCorpusManifest } = await import('../doc/legalCorpus.js');
      const manifest = await loadLegalCorpusManifest();
      corpusIdSet = new Set(
        Object.values(manifest.entries || {})
          .filter((e) => e.corpusFile)
          .map((e) => e.id),
      );
    } catch {
      /* corpus manifest optional */
    }
    for (const r of LEGAL_STATUTE_SEED_PKG?.rows || []) {
      if (!r.title) continue;
      const entityId = r.id || r.title;
      if (legalSeen.has(entityId)) continue;
      legalSeen.add(entityId);
      const hasCorpus = corpusIdSet.has(entityId);
      const ctx = [LS_TYPE_MAP[r.type] || r.type, r.issuer, ...(r.domain || []), hasCorpus ? '本地原文' : ''].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'legal',
        id: `legal:${entityId}`,
        title: r.title,
        subtitle: ctx,
        badge: hasCorpus ? `${LS_TYPE_MAP[r.type] || '法律条文'} · 原文` : (LS_TYPE_MAP[r.type] || '法律条文'),
        path: `/policydocs?tab=legal&sel=${encodeURIComponent(entityId)}&view=read`,
        subCategory: r.type,
        entityId,
        dataset: 'legal-statute',
        hay: hayOf(r.title, r.issuer, r.summary, r.status, ...(r.domain || []), ...(r.keyArticles || []), LS_TYPE_MAP[r.type], hasCorpus ? '本地原文库 条文原文' : ''),
      });
    }

    for (const c of PE500_COMPANIES || []) {
      if (!c.name) continue;
      const ctx = [c.industry, short(c.province), c.rank ? `第${c.rank}名` : ''].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'enterprise',
        id: `enterprise:${c.id || c.name}`,
        title: c.name,
        subtitle: ctx,
        badge: '民企500强',
        path: '/enterprise500',
        rank: c.rank || 9999,
        hay: hayOf(c.name, c.industry, c.province, short(c.province), c.listing),
      });
    }

    const { DOC_SEED } = await import('../db/docSeed.js');
    let policyCorpusIdSet = new Set();
    try {
      const { loadPolicyCorpusManifest } = await import('../doc/policyCorpus.js');
      const policyManifest = await loadPolicyCorpusManifest();
      policyCorpusIdSet = new Set(
        Object.values(policyManifest.entries || {})
          .filter((e) => e.corpusFile)
          .map((e) => e.id),
      );
    } catch {
      /* policy corpus manifest optional */
    }
    const policySeen = new Set();
    for (const d of DOC_SEED || []) {
      if (!d.title || !d.id) continue;
      if (policySeen.has(d.id)) continue;
      policySeen.add(d.id);
      const hasCorpus = policyCorpusIdSet.has(d.id);
      const ctx = [d.type, d.category, d.org, d.year, hasCorpus ? '本地原文' : ''].filter(Boolean).join(' · ');
      pushRecord(records, {
        type: 'policy',
        id: `policy:${d.id}`,
        title: d.title,
        subtitle: ctx,
        badge: hasCorpus ? `${d.type || '政策文件'} · 原文` : (d.type || '政策文件'),
        path: `/policydocs?sel=${encodeURIComponent(d.id)}&view=read`,
        entityId: d.id,
        dataset: 'policy-docs',
        hay: hayOf(d.title, d.type, d.category, d.org, d.year, ...(d.keywords || []), ...(d.highlights || []), hasCorpus ? '本地原文库 政策原文' : ''),
      });
    }

    const { GLOSSARY_ENTRIES, CATEGORY_MAP } = await import('../db/glossary.js');
    for (const g of GLOSSARY_ENTRIES || []) {
      if (!g.term) continue;
      pushRecord(records, {
        type: 'glossary',
        id: `glossary:${g.id}`,
        title: g.term,
        subtitle: g.definition?.slice(0, 80) || '',
        badge: CATEGORY_MAP[g.category]?.label || '术语',
        path: `/glossary?id=${encodeURIComponent(g.id)}`,
        entityId: g.id,
        hay: buildGlossaryHay(g),
      });
    }

    const counts = records.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {});
    return { records, counts, revision: SEARCH_INDEX_REVISION };
  })().catch((err) => {
    invalidateSearchIndex();
    throw err;
  });
  return _indexPromise;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => invalidateSearchIndex());
}

export function searchRecords(records, query, perGroup = 6) {
  const q = norm(query).trim();
  if (!q) return { groups: [], total: 0 };
  const terms = q.split(/\s+/).filter(Boolean);
  const groupLimit = q.length <= 1 ? 30 : q.length <= 2 ? 18 : perGroup;

  const scored = [];
  for (const r of records) {
    const title = norm(r.title);
    const titleHit = terms.every((t) => title.includes(t));
    const hayHit = terms.every((t) => r.hay.includes(t));
    if (!titleHit && !hayHit) continue;
    let score = 0;
    if (title === q) score = 100;
    else if (title.startsWith(q)) score = 80 + Math.max(0, 8 - title.length);
    else if (title.includes(q)) score = 60;
    else if (hayHit) score = 30;
    if (r.type === 'module') score += 15;
    if (r.type === 'enterprise' && r.rank) score -= Math.min(r.rank, 500) / 100;
    scored.push({ r, score });
  }
  scored.sort((a, b) => b.score - a.score || norm(a.r.title).localeCompare(norm(b.r.title), 'zh'));

  const byType = new Map();
  let total = 0;
  for (const { r } of scored) {
    total += 1;
    if (!byType.has(r.type)) byType.set(r.type, []);
    byType.get(r.type).push(r);
  }
  const groups = [...byType.entries()].map(([type, items]) => ({
    type,
    total: items.length,
    items: items.slice(0, groupLimit),
  }));
  return { groups, total };
}
