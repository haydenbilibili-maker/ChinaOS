// ============================================================================
// realPool.js —— 汉东沙盘 · 真实政要候选池适配层（纯函数 + 1 个 React hook）
// ----------------------------------------------------------------------------
// 定位：把人才库「中国政要」队列（IndexedDB figures store，公开履历）适配成
//   汉东省治理沙盘的官员形状，使沙盘可从真实政要库选人进虚构班子任职。
// 数据边界（安全红线）：
//   - 只引用库内已有公开履历字段（name/level/role/org/province/fields/career），
//     绝不杜撰任何履历细节；
//   - 画像六维由 shared/talentProfile.js 的公开履历关键词算法自动推断，
//     再经线性映射投影到汉东「六域空间」（HD_DOMAIN_LABELS），属算法换算，
//     不代表对真实人物能力的实际评估；
//   - 入沙盘后的政绩、任免、考核均为虚构游戏机制。
// 免责（所有真实人物相关 UI / 报告必须展示 REAL_POOL_NOTE）：
//   「画像由公开履历关键词自动推断；政绩/任免为虚构游戏机制，
//    不构成对任何真实人物的人事评价或预测。」
// ============================================================================

import { useMemo } from 'react';
import { useFigures } from '../../lib/db/useDataset.js';
import { profileOf, matchScore } from '../shared/talentProfile.js';

// ------------------------------ 免责声明 ------------------------------------
export const REAL_POOL_NOTE = '真实政要画像由公开履历关键词自动推断（仅引用库内公开任职信息），用于沙盘思想实验；政绩与任免为虚构游戏机制，不构成对任何真实人物的人事评价或预测。';

// ----------------- 能力空间 → 六域空间 线性映射 ------------------------------
// 行 = 汉东六域 HD_DOMAIN_LABELS（科技产业/经济/社会民生/外部环境/能源资源/金融财政），
// 列 = ABILITY_DIMS（理论素养/治理实操/组织动员/经济金融/科技产业/风险应对），
// 各行权重和 = 1.0（凸组合，保持量纲 0-100）。
const MAP = [
  [0.00, 0.15, 0.00, 0.05, 0.75, 0.05], // 科技产业
  [0.05, 0.40, 0.05, 0.35, 0.10, 0.05], // 经济
  [0.10, 0.25, 0.40, 0.00, 0.00, 0.25], // 社会民生
  [0.35, 0.15, 0.10, 0.15, 0.10, 0.15], // 外部环境
  [0.00, 0.25, 0.10, 0.05, 0.35, 0.25], // 能源资源
  [0.05, 0.10, 0.00, 0.60, 0.05, 0.20], // 金融财政
];

// 经历标签 → 六域加成（条线经历对特定领域的额外贡献，确定性规则）
// 域下标：0 科技产业 / 1 经济 / 2 社会民生 / 3 外部环境 / 4 能源资源 / 5 金融财政
const TAG_DOMAIN_BONUS = {
  diplomat: [[3, 12]],          // 外事涉外 → 外部环境 +12
  finance:  [[5, 8]],           // 金融条线 → 金融财政 +8
  soe:      [[4, 6]],           // 央企国企 → 能源资源 +6
  techind:  [[4, 6]],           // 工信科技 → 能源资源 +6
  law:      [[2, 8]],           // 政法纪检 → 社会民生 +8
  military: [[3, 4], [4, 6]],   // 军队国防 → 外部环境 +4、能源资源 +6
  agri:     [[2, 6]],           // 农业农村 → 社会民生 +6
};

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

// 量纲校准：关键词画像经凸组合后聚拢在 35-60 区间，直接入沙盘会让真实班子
// 乘数系统性低于虚构库（虚构官员 dims 刻意保留 30-90 长短板）。围绕 40 拉伸
// 1.6 倍、中枢移到 52，使两池处在同一动态范围，长板/短板同样鲜明。
const calibrate = (v) => clamp(Math.round(52 + (v - 40) * 1.6), 15, 95);

// 能力六维（ABILITY_DIMS 空间）+ 经历标签 → 汉东六域整数向量
export function abilityToDomain(abilityDims, tagIds) {
  const a = Array.isArray(abilityDims) ? abilityDims : [];
  const tags = Array.isArray(tagIds) ? tagIds : [];
  return MAP.map((row, d) => {
    let v = 0;
    for (let i = 0; i < row.length; i++) v += row[i] * (Number(a[i]) || 0);
    for (const id of tags) {
      for (const [dom, bonus] of TAG_DOMAIN_BONUS[id] || []) {
        if (dom === d) v += bonus;
      }
    }
    return calibrate(v);
  });
}

// ------------------------- 去重键 / 稳定 id ----------------------------------
// 与 talent/Page.jsx 同款唯一键：同一人同一任职只算一条
const figKey = (f) => `${f.name}#${f.fields?.birth || ''}#${f.province || ''}#${f.role || ''}#${f.org || f.fields?.title || ''}`;

// FNV-1a 32 位哈希 → base36，确定性稳定 slug（附长度位进一步降低碰撞概率）
function stableSlug(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(36) + '-' + s.length.toString(36);
}

// ------------------------- 图表色板（按姓名确定性取色） -----------------------
const PALETTE = ['#c41e3a', '#22d3ee', '#e8a317', '#10b981', '#8b5cf6', '#fb923c', '#64748b'];
function colorOf(name) {
  let sum = 0;
  const s = String(name || '');
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
  return PALETTE[sum % PALETTE.length];
}

// 从 "1958" / "1958年3月" / "1958.03" 等提取 4 位出生年份 → 2026 年口径年龄
function ageOf(birth) {
  const m = String(birth == null ? '' : birth).match(/(19|20)\d{2}/);
  return m ? 2026 - parseInt(m[0], 10) : null;
}

// ----------------- 核心适配：figure → 汉东官员形状 ---------------------------
// 只引用库内公开履历字段；merit 固定 50（虚构游戏机制起点，与真实政绩无关）。
export function toHdOfficial(figure) {
  const f = figure || {};
  const fields = f.fields || {};
  const profile = profileOf(f); // 只调一次
  return {
    id: 'real-' + stableSlug(figKey(f)),
    name: f.name,
    age: ageOf(fields.birth),
    archetype: (profile.tags && profile.tags[0]) || f.level || '政要',
    color: colorOf(f.name),
    dims: abilityToDomain(profile.dims, profile.tagIds),
    merit: 50,
    bio: [
      fields.title || f.role,
      f.province && ('任职关联：' + f.province),
      f.level,
    ].filter(Boolean).join(' · '),
    real: true,
    level: f.level || '',
    province: f.province || '',
    tags: (profile.tags || []).slice(0, 3),
  };
}

// ------------------------- 层级排序权重 --------------------------------------
const LEVEL_ORDER = ['党和国家领导人', '副国级', '正部级', '省部级', '副部级'];
function levelRank(level) {
  const s = String(level || '');
  const exact = LEVEL_ORDER.indexOf(s);
  if (exact >= 0) return exact;
  for (let i = 0; i < LEVEL_ORDER.length; i++) {
    if (s.includes(LEVEL_ORDER[i])) return i;
  }
  return LEVEL_ORDER.length; // 其余排在最后
}

// 去重（保 updatedAt 最新）→ 适配 → 排序，纯函数便于复用与测试
export function buildPool(figures) {
  const seen = new Map();
  for (const f of figures || []) {
    if (!f || !f.name) continue;
    const k = figKey(f);
    const prev = seen.get(k);
    if (!prev || (f.updatedAt || 0) >= (prev.updatedAt || 0)) seen.set(k, f);
  }
  return [...seen.values()]
    .map(toHdOfficial)
    .sort((a, b) => {
      const r = levelRank(a.level) - levelRank(b.level);
      if (r !== 0) return r;
      return String(a.name).localeCompare(String(b.name), 'zh-Hans-CN');
    });
}

// ----------------- React hook：真实政要候选池 --------------------------------
// figures 加载中（null）→ { pool: null, count: 0, loading: true }
export function useRealPool() {
  const figures = useFigures();
  const pool = useMemo(() => (figures ? buildPool(figures) : null), [figures]);
  if (!pool) return { pool: null, count: 0, loading: true };
  return { pool, count: pool.length, loading: false };
}

// ----------------- 检索：按关键字过滤候选池 ----------------------------------
// query 空白返回原数组；否则 name/province/level/bio/tags 任一包含（不区分大小写）
export function filterPool(pool, query) {
  const list = Array.isArray(pool) ? pool : [];
  const q = String(query || '').trim().toLowerCase();
  if (!q) return list;
  return list.filter((o) => {
    const hay = [o.name, o.province, o.level, o.bio, ...(o.tags || [])];
    return hay.some((s) => String(s || '').toLowerCase().includes(q));
  });
}

// ----------------- 岗位推荐：按六域需求匹配排序 -------------------------------
// 排除 taken（Set of id）后按 matchScore(o.dims, need) 降序取前 limit
export function topMatches(pool, need, taken, limit = 30) {
  const list = Array.isArray(pool) ? pool : [];
  const used = taken instanceof Set ? taken : new Set(taken || []);
  return list
    .filter((o) => !used.has(o.id))
    .map((o) => ({ ...o, match: matchScore(o.dims, need) }))
    .sort((a, b) => b.match - a.match)
    .slice(0, limit);
}
