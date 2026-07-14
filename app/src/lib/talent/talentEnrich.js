// ============================================================================
// 人才库 · 旗舰条目批量增密（加载时合并，向后兼容）
// ============================================================================

import { AS_OF } from '../db/figureCommon.js';
import { buildDensityPatch } from './talentDensity.js';

/** @typedef {'official'|'media'|'academic'|'inferred'} VerifyTier */
/** @typedef {'high'|'medium'|'low'} Confidence */

/**
 * 按 id 或 name 索引的增密补丁
 * @type {Record<string, object>}
 */
export const FLAGSHIP_ENRICH = {
  // —— 政治局常委 / 副国级 ——
  '习近平': {
    verifyTier: 'official', confidence: 'high',
    provenance: '中共中央/新华社公开职务发布；不含非公开家庭与私人信息',
    lastPublicActivity: '2026-05 中央周边外交与重大会议公开报道',
    sources: ['新华社', '中国政府网', '人民网'],
    publicRecordNote: '职务任免以全国人大/党代会公报为准',
    tags: ['二十届', '总书记', '军委主席', '核心'],
    keyEvents: [
      { from: '2012', to: '', desc: '任中共中央总书记、中央军委主席' },
      { from: '2013', to: '', desc: '任中华人民共和国主席' },
      { from: '2017', to: '', desc: '党的十九大确立新时代指导思想' },
      { from: '2022', to: '', desc: '连任二十届中央总书记' },
    ],
    bio: '现任中共中央总书记、国家主席、中央军委主席。公开履历以党代会与人代会公报、新华社人事发布为锚点；研究口径聚焦制度权力结构与公开政策议程，不含私人领域信息。',
  },
  '李强': {
    verifyTier: 'official', confidence: 'high',
    provenance: '国务院/新华社公开任免',
    lastPublicActivity: '2026-05 国务院常务会及地方调研公开报道',
    sources: ['新华社', '中国政府网'],
    tags: ['总理', '二十届', '国务院'],
    bio: '现任国务院总理、党组书记。公开履历涵盖上海主政期与国务院系统任职；经济政策与就业、外贸为近期公开议程焦点。',
  },
  '赵乐际': {
    verifyTier: 'official', confidence: 'high',
    provenance: '全国人大/新华社公开职务',
    sources: ['新华社', '中国人大网'],
    tags: ['人大常委会委员长', '二十届'],
    lastPublicActivity: '2026-05 立法监督与代表工作公开活动',
  },
  '王沪宁': {
    verifyTier: 'official', confidence: 'high',
    sources: ['新华社', '全国政协网'],
    tags: ['政协主席', '二十届', '统战'],
    lastPublicActivity: '2026-05 政协协商与统战工作公开报道',
    provenance: '全国政协/新华社公开职务发布',
  },
  '蔡奇': {
    verifyTier: 'official', confidence: 'high',
    sources: ['新华社'],
    tags: ['书记处', '二十届', '中办'],
    provenance: '中共中央公开人事发布',
    lastPublicActivity: '2026-05 中央办公厅与党建公开报道',
  },
  '丁薛祥': {
    verifyTier: 'official', confidence: 'high',
    sources: ['新华社', '国务院'],
    tags: ['副总理', '二十届'],
    provenance: '国务院/新华社公开任免',
  },
  '何立峰': {
    verifyTier: 'official', confidence: 'high',
    sources: ['新华社', '国家发改委'],
    tags: ['副总理', '财经', '二十届'],
    provenance: '国务院副总理公开职务；曾任发改委主任',
    lastPublicActivity: '2026-05 财经政策与金融稳定公开报道',
    bio: '分管财经领域国务院副总理；公开履历含发改委主任期与地方主政经历；研究口径聚焦宏观政策与债务治理公开议程。',
  },
  '张国清': {
    verifyTier: 'official', confidence: 'high',
    sources: ['新华社'],
    tags: ['副总理', '二十届', '国资'],
    provenance: '国务院公开任免；曾任辽宁省委书记',
  },
  '刘国中': {
    verifyTier: 'official', confidence: 'high',
    sources: ['新华社'],
    tags: ['副总理', '二十届', '三农'],
    provenance: '国务院公开任免；曾任陕西省委书记',
  },
  '王毅': {
    verifyTier: 'official', confidence: 'high',
    sources: ['外交部', '新华社'],
    tags: ['外交', '二十届', '政治局'],
    provenance: '外交部官网职务与新华社公开活动',
    lastPublicActivity: '2026-05 周边外交与多边场合公开报道',
    bio: '现任外交部长、中央政治局委员。公开履历含多任外长期与驻日大使经历；研究口径聚焦公开外交议程与台海/周边表述。',
  },
  // —— 商业龙头 ——
  'be-m-pony': {
    verifyTier: 'media', confidence: 'high',
    provenance: '港交所披露/腾讯控股年报与公开财报电话会',
    sources: ['腾讯控股年报', '港交所', '新华社'],
    lastPublicActivity: '2025-2026 财报季与两会代表公开露面',
    tags: ['互联网', '深圳', '代表委员'],
    bio: '腾讯控股联合创始人、董事会主席兼CEO。公开节点含微信生态、游戏监管适应与资本配置；研究口径以财报与监管公开文件为锚。',
  },
  'be-m-yiming': {
    verifyTier: 'media', confidence: 'high',
    provenance: '公开报道与商业榜单；公司非上市，财务以媒体报道为主',
    sources: ['福布斯', '胡润', '公开报道'],
    tags: ['字节跳动', '算法', '内容'],
    bio: '字节跳动创始人。公开信息以产品生态（抖音/TikTok）与算法推荐监管讨论为主；个人公开露面较少。',
  },
  'be-m-dinglei': {
    verifyTier: 'official', confidence: 'high',
    sources: ['网易财报', '港交所', '人大公开代表信息'],
    provenance: '上市公司披露与代表公开信息',
    tags: ['网易', '游戏', '代表委员'],
  },
  '马化腾': {
    verifyTier: 'media', confidence: 'high',
    sources: ['腾讯控股年报', '港交所'],
    provenance: '同上 be-m-pony',
    tags: ['互联网', '深圳'],
  },
  '马云': {
    verifyTier: 'media', confidence: 'medium',
    sources: ['阿里巴巴财报', '公开报道'],
    provenance: '阿里系公开披露；2020后公开露面显著减少',
    lastPublicActivity: '2024-2025 农业/教育公益与海外行程零星公开报道',
    tags: ['阿里', '电商', '蚂蚁'],
    confidence: 'medium',
  },
  '雷军': {
    verifyTier: 'official', confidence: 'high',
    sources: ['小米集团年报', '港交所', '公开发布会'],
    provenance: '上市公司披露与产品发布会公开信息',
    tags: ['小米', '造车', '硬件'],
    lastPublicActivity: '2025-2026 SU7 交付与财报公开活动',
  },
  '任正非': {
    verifyTier: 'media', confidence: 'high',
    sources: ['华为官网', '公开采访', '新华社'],
    provenance: '非上市；以官网与公开采访为主',
    tags: ['华为', '通信', '制裁'],
    bio: '华为创始人。公开节点含5G、制裁适应与研发投入；研究口径聚焦企业公开声明与供应链公开报道。',
  },
  // —— 院士/知识精英 ——
  'ce-n-tu': {
    verifyTier: 'official', confidence: 'high',
    sources: ['诺贝尔官网', '中国中医科学院', '新华社'],
    provenance: '诺奖委员会与中科院院士公开名录',
    tags: ['青蒿素', '诺奖', '药学'],
    bio: '2015年诺贝尔生理学或医学奖获得者；青蒿素发现与抗疟国际合作为公开学术史核心节点。',
  },
  '屠呦呦': {
    verifyTier: 'official', confidence: 'high',
    sources: ['诺贝尔官网', '中国中医科学院'],
    provenance: '同上',
    tags: ['青蒿素', '诺奖'],
  },
  'ce-n-yuan': {
    verifyTier: 'official', confidence: 'high',
    sources: ['新华社', '隆平高科', '公开纪念'],
    provenance: '国家最高科技奖与公开纪念报道',
    tags: ['杂交水稻', '粮食安全'],
    bio: '杂交水稻奠基人；2021年公开纪念后条目以历史节点与遗产口径维护。',
  },
  '袁隆平': {
    verifyTier: 'official', confidence: 'high',
    sources: ['新华社', '国家最高科技奖'],
    tags: ['杂交水稻', '粮食安全', '已故'],
  },
  '钟南山': {
    verifyTier: 'official', confidence: 'high',
    sources: ['广州医科大学', '新华社', '国家卫健委公开活动'],
    provenance: '工程院院士公开名录与抗疫公开报道',
    tags: ['呼吸', '抗疫', '院士'],
    lastPublicActivity: '2025-2026 公共卫生与呼吸疾病公开学术活动',
    bio: '呼吸病学专家、中国工程院院士；公开节点含SARS与重大传染病抗疫专家组公开活动。',
  },
  'ce-n-zhong': {
    verifyTier: 'official', confidence: 'high',
    sources: ['广州医科大学', '新华社'],
    tags: ['呼吸', '抗疫', '院士'],
  },
  // —— 异见/港澳台（存争议标注） ——
  'dv-xu-zhiyong': {
    verifyTier: 'media', confidence: 'medium',
    provenance: '公开判决与外媒/人权组织交叉记录；政治安全类案件',
    sources: ['公开判决', 'BBC', '路透社'],
    publicRecordNote: '案件性质与量刑以公开法律文书为准；叙事存在阵营化差异',
    confidence: 'medium',
    tags: ['新公民运动', '律师'],
  },
  'tw-lai-ching-te': {
    verifyTier: 'official', confidence: 'high',
    sources: ['台湾地区领导人办公室', '新华社涉台报道'],
    provenance: '台湾当局公开职务与选举结果',
    tags: ['台湾', '总统', '民进党'],
    lastPublicActivity: '2026-05 台当局公开行程与两岸表述',
  },
};

/** 按队列追加默认 provenance */
const QUEUE_DEFAULTS = {
  figures: { verifyTier: 'official', confidence: 'high' },
  knowledge: { verifyTier: 'academic', confidence: 'high' },
  business: { verifyTier: 'media', confidence: 'medium' },
  overseas: { verifyTier: 'academic', confidence: 'medium' },
  dissident: { verifyTier: 'media', confidence: 'medium' },
  taiwan: { verifyTier: 'official', confidence: 'high' },
  anticorruption: { verifyTier: 'official', confidence: 'high' },
  diplomatic: { verifyTier: 'official', confidence: 'high' },
  education: { verifyTier: 'official', confidence: 'high' },
  thinktank: { verifyTier: 'official', confidence: 'high' },
  research: { verifyTier: 'official', confidence: 'high' },
  selfMedia: { verifyTier: 'media', confidence: 'medium' },
};

function normalizeTagList(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return String(tags).split(/[,，、]/).map((t) => t.trim()).filter(Boolean);
}

const FLAGSHIP_LEVELS = new Set(['副国级', '国家级', '正国级']);
const FLAGSHIP_RANK_KW = ['政治局', '常委', '国务院副总理', '国务委员'];

function isAutoFlagship(record, queue) {
  if (!record) return false;
  if (FLAGSHIP_ENRICH[record.id] || FLAGSHIP_ENRICH[record.name]) return true;
  if (queue === 'figures') {
    if (record.level && FLAGSHIP_LEVELS.has(record.level)) return true;
    const rank = record.fields?.rank || '';
    if (FLAGSHIP_RANK_KW.some((k) => rank.includes(k))) return true;
    if (record.career?.length >= 3 && record.source) return true;
  }
  if (queue === 'knowledge') {
    if (record.tier === 'S' || record.academyCas || record.academyCae) return true;
    if (record.rankNotes?.includes('院士') || record.rankNotes?.includes('长江')) return true;
  }
  if (queue === 'business') {
    if (record.category === 'founder' && record.honors?.includes('代表')) return true;
    const topCo = ['腾讯', '阿里', '华为', '字节', '比亚迪', '宁德时代', '茅台', '工商银行'];
    if (topCo.some((c) => (record.company || '').includes(c))) return true;
  }
  if (queue === 'overseas' && record.tier === 'S') return true;
  if (queue === 'dissident' && record.tier === 'A') return true;
  return false;
}

function autoProvenance(record, queue) {
  const src = record.source || record.sources?.[0] || '公开报道';
  const templates = {
    figures: `公开任职口径；来源锚点：${src}；不含私人信息`,
    knowledge: `知识生产公开履历；来源：${src}；荣誉以来源发布时为准`,
    business: `资本市场公开节点；来源：${src}；财务以披露文件为准`,
    overseas: `跨境人力资本公开节点；来源：${src}`,
    dissident: `制度边界公开记录；来源：${src}；叙事存在阵营化差异`,
    taiwan: `台港澳公开职务；来源：${src}`,
    anticorruption: `反腐公开通报；来源：${src}`,
    diplomatic: `外交部/驻外使领馆公开任命；来源：${src}`,
    education: `高校公开名录；来源：${src}`,
    thinktank: `智库机构公开信息；来源：${src}`,
    research: `科研院所/大科学装置公开节点；来源：${src}`,
    selfMedia: `自媒体公开账号与媒体报道；来源：${src}；粉丝量级为公开口径`,
  };
  return templates[queue] || `公开资料整理；来源：${src}`;
}

/**
 * 合并增密补丁到单条记录
 * @param {object} record
 * @param {{ queue?: string, tierDefault?: boolean }} [opts]
 */
export function applyTalentEnrichment(record, opts = {}) {
  if (!record) return record;
  const { queue, tierDefault = true } = opts;
  const key = record.id || record.name;
  const patch = FLAGSHIP_ENRICH[key] || FLAGSHIP_ENRICH[record.name] || {};
  const defaults = tierDefault && queue ? QUEUE_DEFAULTS[queue] || {} : {};
  const density = buildDensityPatch(record, queue);
  const auto = isAutoFlagship(record, queue) ? {
    verifyTier: defaults.verifyTier || 'media',
    confidence: defaults.confidence || 'medium',
    provenance: autoProvenance(record, queue),
    verifiedAt: AS_OF,
  } : {};
  const merged = { ...defaults, ...auto, ...record, ...density, ...patch };
  if (!merged.asOf) merged.asOf = AS_OF;
  if (!merged.verifiedAt && merged.verifyTier) merged.verifiedAt = AS_OF;
  if (patch.keyEvents && record.career?.length && !patch.career) {
    merged.career = patch.keyEvents;
  } else if (patch.keyEvents && !record.career && !record.keyEvents) {
    merged.keyEvents = patch.keyEvents;
  }
  if (patch.tags && record.tags) {
    merged.tags = [...new Set([...normalizeTagList(record.tags), ...normalizeTagList(patch.tags)])].join(',');
  }
  return merged;
}

/** @param {object[]} list */
export function enrichTalentList(list, opts = {}) {
  return (list || []).map((r) => applyTalentEnrichment(r, opts));
}

/** 旗舰增密命中数（用于报告） */
export function countFlagshipHits(list, queue) {
  let n = 0;
  for (const r of list || []) {
    const k = r.id || r.name;
    if (FLAGSHIP_ENRICH[k] || FLAGSHIP_ENRICH[r.name] || isAutoFlagship(r, queue)) n += 1;
  }
  return n;
}
