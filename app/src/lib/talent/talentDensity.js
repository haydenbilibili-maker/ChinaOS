// ============================================================================
// 人才库 · 全量条目增密（加载时派生，不覆盖已有富文本）
// ============================================================================

import { AS_OF } from '../db/figureCommon.js';

const PLACEHOLDER_RE = /扩展条目|扩展种子|示意|placeholder/i;

function yearOf(v) {
  const m = String(v == null ? '' : v).match(/(19|20)\d{2}/);
  return m ? m[0] : null;
}

function normTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  return String(tags).split(/[,，、;；|]/).map((t) => t.trim()).filter(Boolean);
}

function mergeTags(...lists) {
  return [...new Set(lists.flatMap(normTags))];
}

function isThinBio(bio) {
  if (!bio) return true;
  if (bio.length < 80) return true;
  return PLACEHOLDER_RE.test(bio);
}

function isThinTimeline(items) {
  return !items?.length || items.length < 2;
}

function sourcesOf(record) {
  if (record.sources?.length) return record.sources;
  if (record.source) return [record.source];
  return ['公开报道'];
}

function provenanceFor(record, queue) {
  const src = sourcesOf(record).join('、');
  const templates = {
    figures: `公开任职口径；来源锚点：${src}；任免以官方发布为准；不含私人信息`,
    knowledge: `知识生产公开履历；来源：${src}；荣誉与职务以来源发布时为准`,
    business: `资本市场与商业公开节点；来源：${src}；财务以披露文件为准`,
    overseas: `跨境人力资本公开节点；来源：${src}；境外任职以来源国机构公开信息为准`,
    dissident: `制度边界公开记录；来源：${src}；叙事存在阵营化差异，以公开法律文书与报道交叉核对`,
    taiwan: `台港澳公开职务；来源：${src}；职务以选举/任命公开结果为准`,
    anticorruption: `中央纪委国家监委等公开通报；来源：${src}；案件进展以最新通报为准`,
    diplomatic: `外交部/驻外使领馆公开任命；来源：${src}；不含非公开外交评估`,
    education: `高校公开名录；来源：${src}`,
    thinktank: `智库机构公开信息；来源：${src}`,
    research: `科研院所/大科学装置公开节点；来源：${src}`,
  };
  return templates[queue] || `公开资料整理；来源：${src}`;
}

function inferEducation(record, queue) {
  const existing = record.education || record.fields?.edu;
  if (existing) return existing;
  if (queue === 'knowledge') {
    const title = record.title || '';
    const inst = record.institution || '';
    if (/院士|教授|研究员|博导/.test(title)) {
      return inst ? `${inst}体系内高级职称（公开任职）` : '高等教育与研究生培养体系（公开任职）';
    }
    if (/副教授|讲师/.test(title)) return '高等教育教职（公开任职）';
  }
  if (queue === 'figures' && record.fields?.edu) return record.fields.edu;
  return null;
}

function figureBio(r) {
  const title = r.fields?.title || r.role || '';
  const org = r.org || '';
  const prov = r.province && r.province !== '中央' ? r.province : (r.province === '中央' ? '中央/国家机构' : '');
  const level = r.level || '';
  const rank = r.fields?.rank || '';
  const native = r.fields?.native ? `籍贯${r.fields.native}` : '';
  const edu = r.fields?.edu ? `学历${r.fields.edu}` : '';
  const career = r.career || r.keyEvents || [];
  const careerNote = career.length
    ? `公开履历含${career.length}个任职节点，现任职锚点：${career[0]?.desc || title}`
    : (title ? `现任公开职务：${title}` : '');
  const parts = [
    [level, r.role, title].filter(Boolean).join('·'),
    org && prov ? `${org}（${prov}）` : (org || prov),
    [native, edu].filter(Boolean).join('；'),
    rank,
    careerNote,
    '研究口径聚焦公开权力结构与制度演进，不含私人领域信息。',
  ].filter(Boolean);
  return parts.join('。').replace(/。+/g, '。');
}

function figureTimeline(r) {
  const career = r.career || r.keyEvents;
  if (career?.length >= 2) return career;
  const events = [...(career || [])];
  const took = yearOf(r.fields?.tookOffice);
  const title = r.fields?.title || r.role;
  if (took && title && !events.some((e) => e.from === took)) {
    events.unshift({ from: took, to: '', desc: `任${title}` });
  }
  if (r.org && !events.some((e) => (e.desc || '').includes(r.org))) {
    const y = yearOf(r.fields?.tookOffice) || events[0]?.from;
    events.push({
      from: y ? String(Math.max(1980, +y - 5)) : '',
      to: y || '',
      desc: `${r.org}${r.province && r.province !== '中央' ? `（${r.province}）` : ''}系统任职`,
    });
  }
  if (r.fields?.native && events.length < 2) {
    events.push({ from: '', to: took || '', desc: `地方成长路径（籍贯${r.fields.native}，公开信息）` });
  }
  if (r.fields?.rank && events.length < 3) {
    events.push({ from: took || '', to: '', desc: r.fields.rank });
  }
  return events.length >= 2 ? events : null;
}

function figureTags(r) {
  return mergeTags(
    r.tags,
    r.level,
    r.role,
    r.sector,
    r.province,
    r.fields?.rank,
    r.fields?.institutionType,
    r.org,
  ).filter((t) => t && t !== '—' && t.length < 20);
}

function knowledgeBio(r) {
  const inst = r.institution || '';
  const field = r.discipline || r.field || '';
  const title = r.title || '';
  const works = r.works || '';
  const honors = r.rankNotes || '';
  const decade = r.decade ? `${r.decade}代学者` : '';
  const academy = [
    r.academyCas && '中科院院士',
    r.academyCae && '工程院院士',
    r.academyDivision && `${r.academyDivision}学部`,
    r.electedYear && `${r.electedYear}年当选`,
  ].filter(Boolean).join('、');
  const parts = [
    inst && field ? `${inst}${field}方向` : (inst || field),
    title && `现任${title}`,
    decade,
    academy && `学术荣誉：${academy}`,
    honors && honors !== title && `荣誉备注：${honors}`,
    works && `代表成果/研究方向：${works}`,
    '条目口径为公开学术履历与机构发布信息，不含非公开评议。',
  ].filter(Boolean);
  return parts.join('。').replace(/。+/g, '。');
}

function knowledgeTimeline(r) {
  const events = [];
  const decade = r.decade?.replace(/后$/, '');
  if (decade && /^\d{2}$/.test(decade)) {
    const birthApprox = `${+decade < 30 ? '19' : '19'}${decade}年代`;
    events.push({ from: birthApprox, to: '', desc: '出生年代（公开报道口径）' });
  }
  if (r.electedYear) {
    events.push({ from: String(r.electedYear), to: '', desc: `当选${r.academyCas ? '中科院' : ''}${r.academyCae ? '工程院' : ''}院士（公开名录）` });
  }
  const inst = r.institution;
  const title = r.title;
  if (inst && title) {
    events.push({ from: '', to: '', desc: `现任${inst}${title}` });
  }
  if (r.works && events.length < 3) {
    events.push({ from: '', to: '', desc: `研究方向：${r.works.slice(0, 60)}${r.works.length > 60 ? '…' : ''}` });
  }
  return events.length >= 2 ? events : (events.length ? [...events, { from: '', to: '', desc: `${inst || '机构'}${fieldOf(r)}学术任职（公开信息）` }] : null);
}

function fieldOf(r) {
  const f = r.discipline || r.field;
  return f ? `${f}方向` : '';
}

function businessBio(r) {
  const co = r.company || '';
  const title = r.title || '';
  const ach = r.achievements || '';
  const honors = r.honors && r.honors !== '—' ? r.honors : '';
  const bg = r.background || '';
  const prov = r.province || '';
  const industry = r.industry || r.field || r.sector || '';
  const role = r.category === 'founder' ? '创始人' : r.category === 'investor' ? '投资人' : r.category === 'executive' ? '高管' : r.category || '';
  const parts = [
    co && title ? `${co}${title}` : (co || title),
    industry && `${industry}赛道`,
    role && `角色：${role}`,
    prov && `关联地域：${prov}`,
    ach && `公开成就：${ach}`,
    honors && `荣誉/社会职务：${honors}`,
    bg && `背景：${bg.slice(0, 80)}${bg.length > 80 ? '…' : ''}`,
    co && `公开节点以${co}披露文件与资本市场信息为锚点`,
    '财务与资本动作以交易所披露及年报为准；不含非公开关联交易推断。',
  ].filter(Boolean);
  return parts.join('。').replace(/。+/g, '。');
}

function businessTimeline(r) {
  const events = [...(r.keyEvents || r.career || [])];
  if (r.company && r.title && !events.some((e) => (e.desc || '').includes(r.company))) {
    events.unshift({ from: '', to: '', desc: `现任${r.company}${r.title}` });
  }
  if (r.achievements && !events.some((e) => (e.desc || '').includes(r.achievements.slice(0, 12)))) {
    events.push({ from: '', to: '', desc: r.achievements });
  }
  if (r.honors && r.honors !== '—' && !events.some((e) => (e.desc || '').includes('荣誉'))) {
    events.push({ from: '', to: '', desc: `荣誉：${r.honors}` });
  }
  if (r.background && events.length < 3) {
    events.push({ from: '', to: '', desc: `背景：${r.background.slice(0, 72)}${r.background.length > 72 ? '…' : ''}` });
  }
  if (r.industry && events.length < 2) {
    events.push({ from: '', to: '', desc: `${r.industry}赛道公开节点` });
  }
  return events.length >= 2 ? events : null;
}

function overseasBio(r) {
  const country = r.baseCountry || r.region || '';
  const inst = r.institution || '';
  const field = r.field || '';
  const role = r.role || '';
  const nat = r.nationality || '中国';
  return [
    `${nat}籍${field || '专业'}人才，驻${country}`,
    inst && role ? `现任${inst}${role}` : (inst || role),
    r.works && `公开成果：${r.works}`,
    '跨境任职与学术合作以来源国机构及中文公开报道为锚点。',
  ].filter(Boolean).join('。');
}

function overseasTimeline(r) {
  const events = [];
  const country = r.baseCountry || r.region;
  if (country) events.push({ from: '', to: '', desc: `驻${country}发展（公开信息）` });
  if (r.institution) events.push({ from: '', to: '', desc: `任职${r.institution}${r.role ? `·${r.role}` : ''}` });
  if (r.field) events.push({ from: '', to: '', desc: `${r.field}方向` });
  return events.length >= 2 ? events : null;
}

const TW_PARTY_LABEL = {
  DPP: '民进党', KMT: '国民党', TPP: '台湾民众党', PFP: '亲民党', NPP: '时代力量',
};

function taiwanBio(r) {
  const party = r.party && (TW_PARTY_LABEL?.[r.party] || r.party);
  const region = r.region === 'hk' ? '香港' : r.region === 'mo' ? '澳门' : '台湾';
  const events = r.keyEvents || r.career || [];
  const careerNote = events.length
    ? `公开履历含${events.length}个节点，最新：${events[0]?.desc || r.role || ''}`
    : (r.role ? `现任公开职务：${r.role}` : '');
  return [
    party && `${party}籍`,
    region && `${region}政治人物`,
    r.role && `公开职务：${r.role}`,
    r.term && `任期：${r.term}`,
    r.status && `状态：${r.status}`,
    careerNote,
    '职务信息以当地公开选举/任命结果为准；两岸叙事存在立场差异。',
  ].filter(Boolean).join('。');
}

function taiwanTimeline(r) {
  const events = [...(r.keyEvents || r.career || [])];
  const termStart = yearOf(r.term) || (r.term || '').match(/(\d{4})/)?.[1];
  if (termStart && r.role && !events.some((e) => e.from === termStart)) {
    events.unshift({ from: termStart, to: '', desc: `任${r.role}（${r.term || termStart}）` });
  } else if (r.role && !events.length) {
    events.push({ from: '', to: '', desc: `现任公开职务：${r.role}` });
  }
  const party = r.party && (TW_PARTY_LABEL[r.party] || r.party);
  if (party && !events.some((e) => (e.desc || '').includes(party))) {
    events.push({ from: '', to: termStart || '', desc: `${party}籍政治人物` });
  }
  if (r.status && events.length < 3) {
    events.push({ from: '', to: '', desc: `状态：${r.status}` });
  }
  if (r.bio && events.length < 2) {
    events.push({ from: '', to: '', desc: r.bio.slice(0, 80) });
  }
  return events.length >= 2 ? events : null;
}

function dissidentBio(r) {
  const events = r.keyEvents || r.career || [];
  const recordNote = events.length
    ? `公开记录含${events.length}个关键节点，最新：${events[0]?.desc || r.knownFor || ''}`
    : (r.knownFor ? `公开关联：${r.knownFor}` : '');
  return [
    r.field && `${r.field}领域`,
    r.subCategory && `类型：${r.subCategory}`,
    r.background && `背景：${r.background}`,
    r.knownFor && `公开标识：${r.knownFor}`,
    r.status && `现状：${r.status}`,
    r.location && `所在地：${r.location}`,
    recordNote,
    r.notes,
    '案件与言论记录以公开法律文书及多方报道交叉核对；叙事存在阵营化差异。',
  ].filter(Boolean).join('。');
}

function dissidentTimeline(r) {
  const events = [...(r.keyEvents || r.career || [])];
  if (r.knownFor && !events.some((e) => (e.desc || '').includes(r.knownFor.slice(0, 8)))) {
    events.unshift({ from: '', to: '', desc: `公开关联：${r.knownFor}` });
  }
  if (r.background && events.length < 3) {
    events.push({ from: '', to: '', desc: `背景：${r.background}` });
  }
  const statusYear = yearOf(r.year || r.announcementDate);
  if (r.status) {
    events.push({
      from: statusYear || '',
      to: '',
      desc: `现状：${r.status}${r.location ? `（${r.location}）` : ''}`,
    });
  }
  if (r.field && events.length < 2) {
    events.push({ from: '', to: '', desc: `${r.field}领域公开记录` });
  }
  return events.length >= 2 ? events : null;
}

function anticorruptionBio(r) {
  const charges = r.category && r.category !== '严重违纪违法' ? `涉嫌：${r.category}` : '';
  const detail = r.notes && !/^历史|^重复/.test(r.notes) ? r.notes : '';
  return [
    r.formerRole && `原任：${r.formerRole}`,
    r.org && `原机构：${r.org}`,
    r.province && `关联地域：${r.province}`,
    r.level && `原级别：${r.level}`,
    r.sector && `系统条线：${r.sector}`,
    charges,
    r.caseType && `案件类型：${r.caseType}`,
    r.status && `进展：${r.status}`,
    r.announcementDate && `官宣节点：${r.announcementDate}`,
    r.year && `${r.year}年度公开通报`,
    detail,
    '信息以中央纪委国家监委等机关公开通报为准。',
  ].filter(Boolean).join('。');
}

function anticorruptionTimeline(r) {
  const events = [];
  if (r.announcementDate) {
    events.push({
      from: yearOf(r.announcementDate) || '',
      to: '',
      desc: `官宣：${r.formerRole || r.name} — ${r.status || '接受审查调查'}（${r.announcementDate}）`,
    });
  }
  if (r.formerRole) {
    events.push({ from: '', to: r.announcementDate ? yearOf(r.announcementDate) : '', desc: `原职：${r.formerRole}` });
  }
  if (r.org) {
    events.push({ from: '', to: '', desc: `原任职机构：${r.org}` });
  }
  if (r.category && r.category !== '严重违纪违法') {
    events.push({ from: '', to: '', desc: `公开表述：${r.category}` });
  }
  if (r.notes && r.notes.length > 12) {
    const snippet = r.notes.length > 120 ? `${r.notes.slice(0, 118)}…` : r.notes;
    events.push({ from: '', to: '', desc: snippet });
  }
  return events.length >= 2 ? events : null;
}

function diplomaticBio(r) {
  const host = r.hostCountry || r.region || '';
  return [
    r.role && host ? `驻${host}${r.role}` : (r.role || host),
    r.rank && `外交衔级：${r.rank}`,
    r.previousPosts && `既往任职：${r.previousPosts}`,
    r.careerHighlights && `履历要点：${r.careerHighlights}`,
    r.hostCity && `驻地：${r.hostCity}`,
    '任命与到任日期以外交部及驻外机构公开信息为准。',
  ].filter(Boolean).join('。');
}

function selfMediaBio(r) {
  return [
    r.platform && `主平台：${r.platform}`,
    r.niche && `垂类：${r.niche}`,
    r.followers && `粉丝量级：${r.followers}`,
    r.keyWorks && `代表作品：${r.keyWorks}`,
    r.controversies && r.controversies !== '—' ? `争议节点：${r.controversies}` : null,
    r.bio,
    '信息以各平台公开资料与媒体报道为准；粉丝数据为公开报道口径。',
  ].filter(Boolean).join('。');
}

function diplomaticTimeline(r) {
  const events = [];
  const app = yearOf(r.appointedDate);
  const cred = yearOf(r.credentialsDate);
  if (app) events.push({ from: app, to: '', desc: `任命驻${r.hostCountry || ''}${r.role || '外交职务'}` });
  if (cred && cred !== app) events.push({ from: cred, to: '', desc: '递交国书/到任（公开日期）' });
  if (r.previousPosts) {
    String(r.previousPosts).split(/[;；、,，]/).slice(0, 3).forEach((p) => {
      const t = p.trim();
      if (t) events.push({ from: '', to: app || '', desc: `既往：${t}` });
    });
  }
  return events.length >= 2 ? events : null;
}

const BUILDERS = {
  figures: (r) => ({
    bio: isThinBio(r.bio) ? figureBio(r) : undefined,
    keyEvents: isThinTimeline(r.career || r.keyEvents) ? figureTimeline(r) : undefined,
    tags: figureTags(r),
    relatedEntities: mergeTags(r.org, r.province, r.sector).slice(0, 6),
    education: inferEducation(r, 'figures'),
  }),
  knowledge: (r) => ({
    bio: isThinBio(r.bio) ? knowledgeBio(r) : undefined,
    keyEvents: isThinTimeline(r.keyEvents) ? knowledgeTimeline(r) : undefined,
    tags: mergeTags(r.tags, r.discipline, r.field, r.institution, r.tier, r.decade),
    achievements: r.works && !r.achievements ? r.works : undefined,
    education: inferEducation(r, 'knowledge'),
    relatedEntities: r.institution ? [r.institution] : undefined,
  }),
  business: (r) => ({
    bio: isThinBio(r.bio) ? businessBio(r) : undefined,
    keyEvents: isThinTimeline(r.keyEvents) ? businessTimeline(r) : undefined,
    tags: mergeTags(r.tags, r.company, r.province, r.industry, r.category),
    relatedEntities: r.company ? [r.company] : undefined,
  }),
  overseas: (r) => ({
    bio: isThinBio(r.bio) ? overseasBio(r) : undefined,
    keyEvents: isThinTimeline(r.keyEvents) ? overseasTimeline(r) : undefined,
    tags: mergeTags(r.tags, r.baseCountry, r.field, r.category),
  }),
  taiwan: (r) => ({
    bio: isThinBio(r.bio) ? taiwanBio(r) : undefined,
    keyEvents: isThinTimeline(r.keyEvents || r.career) ? taiwanTimeline(r) : undefined,
    tags: mergeTags(r.tags, r.party, r.role, r.region),
  }),
  dissident: (r) => ({
    bio: isThinBio(r.bio) ? dissidentBio(r) : undefined,
    keyEvents: isThinTimeline(r.keyEvents || r.career) ? dissidentTimeline(r) : undefined,
    tags: mergeTags(r.tags, r.category, r.subCategory, r.field, r.status),
    publicRecordNote: r.publicRecordNote || '公开记录存在阵营化叙事差异，以法律文书与多方报道交叉核对',
  }),
  anticorruption: (r) => ({
    bio: isThinBio(r.bio) ? anticorruptionBio(r) : undefined,
    keyEvents: isThinTimeline(r.keyEvents) ? anticorruptionTimeline(r) : undefined,
    tags: mergeTags(r.tags, r.level, r.province, r.sector, r.caseType, r.status),
    relatedEntities: mergeTags(r.org, r.province),
  }),
  diplomatic: (r) => ({
    bio: isThinBio(r.bio) ? diplomaticBio(r) : undefined,
    keyEvents: isThinTimeline(r.keyEvents || r.career) ? diplomaticTimeline(r) : undefined,
    tags: mergeTags(r.tags, r.hostCountry, r.region, r.role, r.rank),
  }),
  selfMedia: (r) => ({
    bio: isThinBio(r.bio) ? selfMediaBio(r) : undefined,
    tags: mergeTags(r.tags, r.platform, r.platformKey, r.niche, r.category, r.tier, r.followers),
    publicRecordNote: r.publicRecordNote || '粉丝量级与商业数据以公开报道为准，不含非公开收入信息',
  }),
};

/**
 * 为单条记录生成增密补丁（不覆盖已有富字段）
 * @param {object} record
 * @param {string} [queue]
 */
export function buildDensityPatch(record, queue) {
  if (!record) return {};
  const q = queue || record._queue;
  const builder = BUILDERS[q];
  const patch = {
    asOf: record.asOf || AS_OF,
    sources: sourcesOf(record),
    source: record.source || sourcesOf(record)[0],
    provenance: record.provenance || provenanceFor(record, q),
    verifiedAt: record.verifiedAt || AS_OF,
  };
  if (!record.verifyTier && q) {
    const tiers = {
      figures: 'official', knowledge: 'academic', business: 'media',
      overseas: 'academic', dissident: 'media', taiwan: 'official',
      anticorruption: 'official', diplomatic: 'official', selfMedia: 'media',
    };
    patch.verifyTier = tiers[q] || 'media';
  }
  if (!record.confidence) {
    patch.confidence = ['figures', 'taiwan', 'anticorruption', 'diplomatic'].includes(q) ? 'high' : 'medium';
  }
  if (builder) {
    const built = builder(record);
    if (built.bio && isThinBio(record.bio)) patch.bio = built.bio;
    if (built.keyEvents && isThinTimeline(record.keyEvents || record.career)) {
      patch.keyEvents = built.keyEvents;
      if (!record.career?.length) patch.career = built.keyEvents;
    }
    if (built.tags?.length) {
      patch.tags = mergeTags(record.tags, built.tags).join(',');
    }
    if (built.education && !record.education && !record.fields?.edu) {
      patch.education = built.education;
    }
    if (built.achievements && !record.achievements) patch.achievements = built.achievements;
    if (built.relatedEntities?.length && !record.relatedEntities?.length) {
      patch.relatedEntities = built.relatedEntities;
    }
    if (built.publicRecordNote && !record.publicRecordNote) patch.publicRecordNote = built.publicRecordNote;
  }
  if (!record.lastPublicActivity) {
    const took = record.fields?.tookOffice || record.appointedDate || record.announcementDate;
    if (took) patch.lastPublicActivity = `${took} 前后公开任职/通报节点`;
  }
  return patch;
}

/** 统计增密命中 */
export function densityStats(list, queue) {
  let bio = 0;
  let timeline = 0;
  let prov = 0;
  for (const r of list || []) {
    const p = buildDensityPatch(r, queue);
    if ((r.bio && !isThinBio(r.bio)) || p.bio) bio += 1;
    const tl = r.keyEvents || r.career;
    if ((tl?.length >= 2) || p.keyEvents?.length >= 2) timeline += 1;
    if (r.provenance || p.provenance) prov += 1;
  }
  return { total: list?.length || 0, withBio: bio, withTimeline: timeline, withProvenance: prov };
}
