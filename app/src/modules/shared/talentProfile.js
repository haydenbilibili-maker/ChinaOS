// =====================================================================
// talentProfile.js —— 共享人才画像算法层（确定性纯函数，无随机、无副作用）
// ---------------------------------------------------------------------
// 契约（三模块统一遵守，字段不得偏离）：
//   - ABILITY_DIMS      六维能力维度名
//   - TAG_DEFS          12 个经历标签定义 { id, label, color, keywords }
//   - profileOf(figure) 单条人物 → 画像对象
//   - matchScore(p, n)  画像维度 vs 需求维度 → 0-100 匹配分
//   - summarizeLibrary(profiles) 画像数组 → 库级统计摘要
// 免责声明（两模块统一展示）：
//   「模拟推演工具：画像由公开履历关键词自动推断，课程/考核/匹配均为
//    思想实验框架，不代表任何机构真实流程，不构成人事评价」
// =====================================================================

// ------------------------- 六维能力维度 -------------------------------
export const ABILITY_DIMS = ['理论素养', '治理实操', '组织动员', '经济金融', '科技产业', '风险应对'];

// ------------------------- 12 个经历标签 ------------------------------
// 每个标签：id（程序内标识）/ label（中文展示名）/ color（图表配色）/
// keywords（履历全文命中任一关键词即打标，纯字符串包含匹配，确定性）
export const TAG_DEFS = [
  { id: 'localChief', label: '地方主官', color: '#e05252', keywords: ['省长', '市长', '书记', '县长', '区长', '州长', '省委', '市委', '县委'] },
  { id: 'central',    label: '中央部委', color: '#d4a142', keywords: ['部委', '国务院', '中央办公厅', '部长', '司长', '发改委', '财政部', '工信部', '部党组'] },
  { id: 'soe',        label: '央企国企', color: '#4f8fdd', keywords: ['央企', '国企', '国资', '总公司', '集团董事长', '集团总经理', '集团公司'] },
  { id: 'military',   label: '军队国防', color: '#5f7a61', keywords: ['解放军', '部队', '国防', '军区', '战区', '军委', '司令员', '政委', '武警'] },
  { id: 'academic',   label: '学者型',   color: '#8e6fc4', keywords: ['院士', '教授', '研究员', '博士生导师', '研究院', '社科院', '学者'] },
  { id: 'finance',    label: '金融条线', color: '#2fa37c', keywords: ['银行', '证监', '保监', '金融', '央行', '人民银行', '证券', '财政'] },
  { id: 'techind',    label: '工信科技', color: '#3aa0c9', keywords: ['工信', '科技', '工业', '半导体', '航天', '信息化', '电子', '工程师'] },
  { id: 'agri',       label: '农业农村', color: '#9aa83a', keywords: ['农业', '农村', '乡村', '三农', '粮食', '水利'] },
  { id: 'law',        label: '政法纪检', color: '#b4543e', keywords: ['政法', '纪委', '监委', '公安', '法院', '检察', '司法', '纪检'] },
  { id: 'propaganda', label: '宣传统战', color: '#c97ba0', keywords: ['宣传', '统战', '网信', '文明办', '意识形态', '广电'] },
  { id: 'youth',      label: '共青团',   color: '#d97f3e', keywords: ['共青团', '团委', '团中央', '青联'] },
  { id: 'diplomat',   label: '外事涉外', color: '#5a6fb0', keywords: ['外交', '外事', '涉外', '大使', '领事', '国际组织'] },
];

// ------------------- 标签 → 系统大类（用于 crossSys） -------------------
// 跨系统度量：命中的标签按下表归并为系统大类，统计不同大类个数
const SYS_OF = {
  localChief: '党政',
  central:    '党政',
  agri:       '党政',
  propaganda: '党政',
  youth:      '群团',
  soe:        '央企',
  military:   '军队',
  academic:   '学术',
  finance:    '金融',
  law:        '政法',
  techind:    '科技产业',
  diplomat:   '外事',
};

// ----------------- 六维打分关键词表（内联设计，确定性） -----------------
// 与 ABILITY_DIMS 顺序一一对应；每命中一个关键词按权重加分
const DIM_KEYWORDS = [
  ['党校', '宣传', '政研', '社科', '马克思', '学'],          // 理论素养
  ['省长', '市长', '书记', '县', '治理', '政府'],            // 治理实操
  ['组织部', '工会', '共青团', '动员', '群众'],              // 组织动员
  ['财政', '金融', '银行', '发改', '经济', '证监'],          // 经济金融
  ['工信', '科技', '半导体', '航天', '工程师', '工业'],      // 科技产业
  ['应急', '安全', '维稳', '防汛', '疫', '纪委'],            // 风险应对
];

// 关键词权重（确定性规则）：越长越具体，加分越高，范围 8~12
//   1 字 → 8 分，2 字 → 10 分，3 字及以上 → 12 分
function kwWeight(kw) {
  return Math.min(12, 8 + (kw.length - 1) * 2);
}

// --------------------- 省级地名表（用于 crossProv） ---------------------
// 34 个省级行政区简称式地名（履历文本中出现即计入，去重计数）
const PROVINCES = [
  '北京', '天津', '上海', '重庆',
  '河北', '山西', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东',
  '河南', '湖北', '湖南', '广东', '海南',
  '四川', '贵州', '云南', '陕西', '甘肃', '青海',
  '内蒙古', '广西', '西藏', '宁夏', '新疆',
  '香港', '澳门', '台湾',
];

// --------------------------- 内部工具函数 ------------------------------

// 层级加成：副国级 +10 / 正部 +8 / 省部 +6 / 副部 +4，其余 0
// 注意判断顺序：副国 → 正部 → 省部 → 副部（避免子串误判）
function levelBonus(level) {
  const s = String(level || '');
  if (s.includes('副国')) return 10;
  if (s.includes('正部')) return 8;
  if (s.includes('省部')) return 6;
  if (s.includes('副部')) return 4;
  return 0;
}

// 把人物记录拼成一段可检索全文（角色/机构/省份/原始文本/头衔/履历描述）
function fullTextOf(figure) {
  const f = figure || {};
  const career = Array.isArray(f.career) ? f.career : [];
  const fields = f.fields || {};
  return [
    f.name, f.role, f.org, f.province, f.raw,
    fields.title, fields.birth,
    ...career.map((c) => (c && c.desc) || ''),
  ].filter(Boolean).join(' ');
}

// 履历文本（仅履历条目 + 任职省份字段），用于 crossProv 统计
function careerTextOf(figure) {
  const f = figure || {};
  const career = Array.isArray(f.career) ? f.career : [];
  return [
    ...career.map((c) => (c && c.desc) || ''),
    f.province, f.raw,
  ].filter(Boolean).join(' ');
}

// 从 "1998" / "1998.03" / "1998年" 等字符串中提取 4 位年份；失败返回 null
function yearOf(v) {
  const m = String(v == null ? '' : v).match(/(19|20)\d{2}/);
  return m ? parseInt(m[0], 10) : null;
}

// 数值夹取到 [lo, hi]
function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

// --------------------------- 核心：单人画像 ----------------------------
// 输入 figures 库单条：
//   { name, level, role, org, province, raw,
//     career:[{from,to,desc}], fields:{title,birth,...} }
// 输出：
//   { dims:[6 个 0-100 整数], tags:[标签 label], tagIds:[标签 id],
//     crossProv, crossSys, seniority, spanYears }
// 打分规则（确定性、纯关键词驱动）：
//   每维 = min(95, base 25 + Σ命中关键词权重) + 层级加成，最终夹取 0-100
export function profileOf(figure) {
  const f = figure || {};
  const text = fullTextOf(f);
  const bonus = levelBonus(f.level);

  // —— 六维打分 ——
  const dims = DIM_KEYWORDS.map((kws) => {
    let score = 25; // 每维基础分
    for (const kw of kws) {
      if (text.includes(kw)) score += kwWeight(kw); // 每命中 +8~12
    }
    score = Math.min(95, score);       // 关键词部分封顶 95
    return clamp(Math.round(score + bonus), 0, 100); // 加层级加成后夹取
  });

  // —— 经历标签 ——
  const hitDefs = TAG_DEFS.filter((t) => t.keywords.some((kw) => text.includes(kw)));
  const tags = hitDefs.map((t) => t.label);
  const tagIds = hitDefs.map((t) => t.id);

  // —— 跨省经历：履历文本中出现的不同省级地名数 ——
  const cText = careerTextOf(f);
  const crossProv = PROVINCES.filter((p) => cText.includes(p)).length;

  // —— 跨系统经历：命中标签归并到系统大类后去重计数 ——
  const crossSys = new Set(tagIds.map((id) => SYS_OF[id]).filter(Boolean)).size;

  // —— 资历层级与履历年限 ——
  const seniority = f.level || '—';
  const career = Array.isArray(f.career) ? f.career : [];
  const years = career.map((c) => yearOf(c && c.from)).filter((y) => y != null);
  const spanYears = years.length ? clamp(2026 - Math.min(...years), 0, 80) : 0;

  return { dims, tags, tagIds, crossProv, crossSys, seniority, spanYears };
}

// ------------------------ 核心：岗位匹配打分 ---------------------------
// matchScore(profileDims, needDims) → 0-100
// 思路：需求越高的维度权重越大（w_i = need_i / Σneed），
//   计算加权欧氏距离 d = sqrt(Σ w_i · (p_i - n_i)²)，最大可能距离为 100，
//   归一化后 score = (1 - d / 100) × 100，夹取并取整。
export function matchScore(profileDims, needDims) {
  const p = Array.isArray(profileDims) ? profileDims : [];
  const n = Array.isArray(needDims) ? needDims : [];
  const len = ABILITY_DIMS.length;
  const sumNeed = n.slice(0, len).reduce((a, b) => a + (Number(b) || 0), 0);

  let weighted = 0;
  for (let i = 0; i < len; i++) {
    const pi = Number(p[i]) || 0;
    const ni = Number(n[i]) || 0;
    const wi = sumNeed > 0 ? ni / sumNeed : 1 / len; // 需求全 0 时退化为等权
    weighted += wi * (pi - ni) * (pi - ni);
  }
  const d = Math.sqrt(weighted); // 取值范围 [0, 100]
  return clamp(Math.round((1 - d / 100) * 100), 0, 100);
}

// ------------------------ 核心：人才库级摘要 ---------------------------
// 输入画像数组（允许调用方在 profileOf 结果上附加 name 字段），输出：
//   { dimAvg:[6 维均值], tagCounts:{label: 出现次数},
//     crossProvAvg(跨省均值，1 位小数), topCross:[{name, crossProv} 前 5] }
export function summarizeLibrary(profiles) {
  const list = (Array.isArray(profiles) ? profiles : []).filter(Boolean);
  const n = list.length;

  // —— 六维均值 ——
  const dimAvg = ABILITY_DIMS.map((_, i) => {
    if (!n) return 0;
    const sum = list.reduce((a, p) => a + ((p.dims && Number(p.dims[i])) || 0), 0);
    return Math.round(sum / n);
  });

  // —— 标签计数（按 label 聚合） ——
  const tagCounts = {};
  for (const p of list) {
    for (const label of p.tags || []) {
      tagCounts[label] = (tagCounts[label] || 0) + 1;
    }
  }

  // —— 跨省均值与跨省 Top5 ——
  const crossProvAvg = n
    ? Math.round((list.reduce((a, p) => a + (Number(p.crossProv) || 0), 0) / n) * 10) / 10
    : 0;
  const topCross = list
    .map((p) => ({ name: p.name || '—', crossProv: Number(p.crossProv) || 0 }))
    .sort((a, b) => b.crossProv - a.crossProv)
    .slice(0, 5);

  return { dimAvg, tagCounts, crossProvAvg, topCross };
}
