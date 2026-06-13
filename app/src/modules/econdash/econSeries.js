// ============================================================================
// 经济数据底座 · 经济序列解析层 + localdb 适配（纯函数核心，零 React）
// ----------------------------------------------------------------------------
// 口径声明（最高优先级，全程贯彻）：
//   · 本文件只做「经济时间序列」的健壮解析与 localdb 入参适配，不做任何研判。
//   · 用户上传数据一律标注「用户上传 · 使用前核对来源口径」，非投资建议、非预测。
//   · 全模块声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// 确定性铁律：解析核心为纯函数，零随机、零当前时间（落库 stampMs 由组件传入）。
//   适配封装（listEconDatasets 等）可 import localdb，但解析核心可 node 冒烟。
// ============================================================================

import { listDatasets, getRows, putDataset } from '../../lib/db/localdb.js';

/** 基准快照日（与经济大盘对齐；以官方发布为准） */
export const ECON_AS_OF = '2026-06-11';

// ---------------------------------------------------------------------------
// 1. 经济类数据集分类白名单
// ---------------------------------------------------------------------------

/** @type {string[]} 经济类数据集分类白名单（落库 category 取值域） */
export const ECON_CATEGORIES = [
  '经济运行',
  '国家统计局',
  '海关总署',
  '世界银行',
  '金融货币',
  '财政地方',
  '科技指标',
  '区域经济',
];

// ---------------------------------------------------------------------------
// 2. 频度白名单 + 周期写法说明
// ---------------------------------------------------------------------------

/** @type {string[]} 序列频度白名单 */
export const ECON_FREQ = ['年', '季', '月', '月累计', '日', '周'];

/** 周期（period）规范写法说明，供 UI 展示与上传提示 */
export const PERIOD_HINT =
  'period 规范写法：年=YYYY（2024）；季=YYYYQn（2024Q1）；月=YYYY-MM（2024-01）；' +
  '日=YYYY-MM-DD（2024-01-15）；也容忍中文「2024年」「2024年1月」。' +
  'value 为数值（容忍 %、千分位逗号、中文千分位），非法行将进入 warnings。';

// ---------------------------------------------------------------------------
// 内部工具：周期 token 归一 / 数值清洗
// ---------------------------------------------------------------------------

const CN_DIGITS = { 〇: '0', 零: '0', 一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7', 八: '8', 九: '9', 十: '10' };

/** 将「二〇二四」一类中文数字年份转阿拉伯（仅处理纯中文数字串）；否则原样返回 */
function cnNumToArabic(s) {
  if (!/^[〇零一二三四五六七八九十]+$/.test(s)) return s;
  // 仅处理逐位年份（如 二〇二四 → 2024）；不处理「二十四」式合成
  let out = '';
  for (const ch of s) out += (CN_DIGITS[ch] ?? '');
  return out;
}

/**
 * 把任意时间片段归一为规范 period 字符串。
 * 支持：2024 / 2024-01 / 2024/01 / 2024.01 / 2024-01-15 / 2024Q1 / 2024q1 /
 *       2024年 / 2024年1月 / 2024年第1季度 / 二〇二四年 等。
 * @param {string} raw
 * @returns {string|null} 规范化 period 或 null（无法识别）
 */
export function normPeriod(raw) {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (!s) return null;

  // 中文逐位年份转阿拉伯（如「二〇二四年」）
  s = s.replace(/[〇零一二三四五六七八九十]{2,}/g, (m) => {
    const a = cnNumToArabic(m);
    return /^\d{4}$/.test(a) ? a : m;
  });

  // 季度：2024Q1 / 2024q1 / 2024年第1季度 / 2024年Q1 / 2024-Q1 / 2024 Q1
  let m = s.match(/(\d{4})\s*[年\-/.\s]*\s*(?:第)?\s*[Qq季]\s*([1-4])/) ||
          s.match(/(\d{4})\s*年?\s*第?\s*([1-4])\s*季度?/);
  if (m) return `${m[1]}Q${m[2]}`;

  // 日：2024-01-15 / 2024/1/15 / 2024.01.15 / 2024年1月15日
  m = s.match(/(\d{4})[-/.年]\s*(\d{1,2})[-/.月]\s*(\d{1,2})\s*[日号]?/);
  if (m) {
    const mo = String(+m[2]).padStart(2, '0');
    const d = String(+m[3]).padStart(2, '0');
    if (+m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= 31) return `${m[1]}-${mo}-${d}`;
  }

  // 月：2024-01 / 2024/1 / 2024.01 / 2024年1月
  m = s.match(/(\d{4})[-/.年]\s*(\d{1,2})\s*月?(?!\d)/);
  if (m && +m[2] >= 1 && +m[2] <= 12) return `${m[1]}-${String(+m[2]).padStart(2, '0')}`;

  // 年：2024 / 2024年
  m = s.match(/(\d{4})\s*年?$/) || s.match(/^\s*(\d{4})\s*$/);
  if (m) return m[1];

  return null;
}

/**
 * 把任意数值片段清洗为 number。容忍：千分位逗号、百分号、全角空格、前后空白、负号、中文千分位「，」。
 * @param {*} raw
 * @returns {number|null}
 */
export function cleanNumber(raw) {
  if (raw == null) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  let s = String(raw).trim();
  if (!s) return null;
  s = s.replace(/[,，\s]/g, '').replace(/%＋/g, '').replace(/[%％]/g, '').replace(/＋/g, '').replace(/[－—]/g, '-');
  if (!/^[-+]?\d*\.?\d+([eE][-+]?\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** period 比较器（YYYY / YYYY-MM / YYYYQn / YYYY-MM-DD 统一可比，字符串字典序对齐除季度外） */
function periodKey(p) {
  const s = String(p);
  // 季度归一为可比串：2024Q1 → 2024-Q1（Q 在数字之后排在年末，配合月日仍可比）
  const q = s.match(/^(\d{4})Q([1-4])$/);
  if (q) return `${q[1]}-Q${q[2]}`;
  return s;
}
function cmpPeriod(a, b) {
  const ka = periodKey(a), kb = periodKey(b);
  return ka < kb ? -1 : ka > kb ? 1 : 0;
}

// ---------------------------------------------------------------------------
// 3. parseEconSeries —— 健壮解析（JSON / CSV-TSV / 自由粘贴）
// ---------------------------------------------------------------------------

const EMPTY = (error) => ({ ok: false, error, indicator: '', unit: '', freq: '', source: '', points: [], warnings: [] });

/**
 * 解析一段文本为经济序列。
 * @param {string} text 原始文本
 * @param {('auto'|'json'|'csv'|'free')} [fmt='auto'] 强制格式；auto 自动识别
 * @returns {{ok:boolean, error:string, indicator:string, unit:string, freq:string, source:string, points:{period:string,value:number}[], warnings:string[]}}
 */
export function parseEconSeries(text, fmt = 'auto') {
  if (text == null || String(text).trim() === '') return EMPTY('空输入');
  const raw = String(text);

  let mode = fmt;
  if (mode === 'auto') {
    const t = raw.trim();
    if (t[0] === '{' || t[0] === '[') mode = 'json';
    else if (/[,\t]/.test(t.split(/\r?\n/)[0]) && /\r?\n/.test(t)) mode = 'csv';
    else mode = 'free';
  }

  if (mode === 'json') {
    const r = parseJSON(raw);
    if (r.ok || fmt === 'json') return r;
    // auto 模式下 JSON 失败回退尝试 csv/free
  }
  if (mode === 'csv') {
    const r = parseDelimited(raw);
    if (r.ok || fmt === 'csv') return r;
  }
  // free 或回退
  const free = parseFree(raw);
  if (free.ok || fmt === 'free') return free;

  // auto 全数尝试：取告警最少且 ok 的；都失败则返回最有信息的错误
  const tries = [parseJSON(raw), parseDelimited(raw), free].filter(Boolean);
  const okOne = tries.find((r) => r.ok);
  if (okOne) return okOne;
  return EMPTY('无法识别为经济序列（JSON / CSV / 自由粘贴均未解析出有效点）');
}

/** JSON 分支 */
function parseJSON(raw) {
  let obj;
  try { obj = JSON.parse(raw); } catch (_) { return EMPTY('JSON 解析失败'); }
  const warnings = [];
  let meta = { indicator: '', unit: '', freq: '', source: '' };
  let rawPoints = [];

  if (Array.isArray(obj)) {
    rawPoints = obj;
  } else if (obj && typeof obj === 'object') {
    meta = {
      indicator: String(obj.indicator || obj.name || obj.指标 || ''),
      unit: String(obj.unit || obj.单位 || ''),
      freq: normFreq(obj.freq || obj.频度 || obj.frequency || ''),
      source: String(obj.source || obj.来源 || ''),
    };
    rawPoints = obj.points || obj.data || obj.series || obj.rows || [];
    if (!Array.isArray(rawPoints)) rawPoints = [];
  } else {
    return EMPTY('JSON 顶层既非对象也非数组');
  }

  const points = coercePoints(rawPoints, warnings);
  if (!points.length) return EMPTY('JSON 中未解析出有效数据点');
  return { ok: true, error: '', ...meta, points, warnings };
}

/** 把任意点数组归一为 [{period,value}]，非法行入 warnings */
function coercePoints(arr, warnings) {
  const out = [];
  arr.forEach((item, i) => {
    let p, v;
    if (Array.isArray(item)) {
      p = item[0]; v = item[1];
    } else if (item && typeof item === 'object') {
      p = item.period ?? item.time ?? item.date ?? item.年份 ?? item.时间 ?? item.年月 ?? item.x;
      v = item.value ?? item.val ?? item.数值 ?? item.值 ?? item.y;
    } else {
      warnings.push(`第 ${i + 1} 项非法（非数组/对象）：${JSON.stringify(item)}`);
      return;
    }
    const np = normPeriod(p);
    const nv = cleanNumber(v);
    if (np == null) { warnings.push(`第 ${i + 1} 项时间无法识别：${JSON.stringify(p)}`); return; }
    if (nv == null) { warnings.push(`第 ${i + 1} 项数值无法识别（period=${np}）：${JSON.stringify(v)}`); return; }
    out.push({ period: np, value: nv });
  });
  return out;
}

/** CSV / TSV 分支 */
function parseDelimited(raw) {
  const warnings = [];
  const lines = raw.replace(/\r\n?/g, '\n').split('\n').filter((l) => l.trim() !== '');
  if (!lines.length) return EMPTY('CSV 为空');

  const delim = lines[0].includes('\t') ? '\t' : ',';
  // 引号感知切分：尊重 "..." 包裹的字段（字段内可含分隔符与转义 ""）
  const split = (l) => {
    const out = [];
    let cur = '', q = false;
    for (let i = 0; i < l.length; i++) {
      const ch = l[i];
      if (q) {
        if (ch === '"') {
          if (l[i + 1] === '"') { cur += '"'; i++; } else { q = false; }
        } else cur += ch;
      } else if (ch === '"') {
        q = true;
      } else if (ch === delim) {
        out.push(cur); cur = '';
      } else cur += ch;
    }
    out.push(cur);
    return out.map((c) => c.trim());
  };

  let header = split(lines[0]);
  let body = lines.slice(1);
  let pIdx = 0, vIdx = 1;
  let hasHeader = false;

  const headerLower = header.map((h) => h.toLowerCase());
  const findIdx = (keys) => headerLower.findIndex((h) => keys.some((k) => h.includes(k)));
  const pCand = findIdx(['period', '时间', '年份', '月份', '日期', '年月', 'date', 'time']);
  const vCand = findIdx(['value', '值', '数值', 'val']);

  // 判定是否表头：含关键词，或首行首列无法识别为 period
  if (pCand >= 0 || vCand >= 0) {
    hasHeader = true;
    pIdx = pCand >= 0 ? pCand : 0;
    vIdx = vCand >= 0 ? vCand : (pIdx === 0 ? 1 : 0);
  } else if (normPeriod(header[0]) == null) {
    hasHeader = true; pIdx = 0; vIdx = 1;
  } else {
    // 首行即数据：第一列时间、第二列数值
    hasHeader = false; body = lines; pIdx = 0; vIdx = 1;
  }

  const points = [];
  body.forEach((line, i) => {
    const cells = split(line);
    const np = normPeriod(cells[pIdx]);
    const nv = cleanNumber(cells[vIdx]);
    const ln = (hasHeader ? i + 2 : i + 1);
    if (np == null) { warnings.push(`第 ${ln} 行时间无法识别：${JSON.stringify(cells[pIdx])}`); return; }
    if (nv == null) { warnings.push(`第 ${ln} 行数值无法识别（period=${np}）：${JSON.stringify(cells[vIdx])}`); return; }
    points.push({ period: np, value: nv });
  });

  if (!points.length) return EMPTY('CSV/TSV 中未解析出有效数据点');
  const indicator = hasHeader && header[vIdx] ? String(header[vIdx]) : '';
  return { ok: true, error: '', indicator, unit: '', freq: '', source: '', points, warnings };
}

/** 自由粘贴分支：逐行抽时间 token + 数值 */
function parseFree(raw) {
  const warnings = [];
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  const points = [];
  lines.forEach((line, i) => {
    const s = line.trim();
    if (!s) return;
    // 抽时间 token（优先长写法）。日/月写法不跨空白吞掉后续数值。
    const pm =
      s.match(/\d{4}[-/.]\d{1,2}[-/.]\d{1,2}/) ||                               // 日（纯分隔符）
      s.match(/\d{4}年\d{1,2}月\d{1,2}[日号]/) ||                               // 日（中文带日/号）
      s.match(/\d{4}\s*年?\s*(?:第)?\s*[Qq季]\s*[1-4]/) ||                      // 季 Q
      s.match(/\d{4}\s*年?\s*第?\s*[1-4]\s*季度?/) ||                           // 季 中文
      s.match(/\d{4}[-/.]\d{1,2}(?!\d)/) ||                                     // 月（纯分隔符）
      s.match(/\d{4}年\d{1,2}月?/) ||                                           // 月/年（中文）
      s.match(/[〇零一二三四五六七八九十]{4}\s*年?/) ||                          // 中文逐位年
      s.match(/\d{4}\s*年?/);                                                   // 年
    if (!pm) { warnings.push(`第 ${i + 1} 行无法识别时间：${JSON.stringify(s)}`); return; }
    const np = normPeriod(pm[0]);
    if (np == null) { warnings.push(`第 ${i + 1} 行时间无法归一：${JSON.stringify(s)}`); return; }
    // 抽数值：取时间 token 之后剩余串里的第一个数（含 % / 千分位 / 负号）
    const rest = s.slice(s.indexOf(pm[0]) + pm[0].length);
    const nm = rest.match(/[-+]?[\d,，]*\.?\d+\s*[%％]?/) || s.match(/(?:[^\d]|^)([-+]?[\d,，]*\.?\d+\s*[%％]?)(?!.*\d)/);
    const numStr = nm ? (nm[1] ?? nm[0]) : null;
    const nv = cleanNumber(numStr);
    if (nv == null) { warnings.push(`第 ${i + 1} 行无法识别数值（period=${np}）：${JSON.stringify(s)}`); return; }
    points.push({ period: np, value: nv });
  });
  if (!points.length) return EMPTY('自由文本中未解析出有效数据点');
  return { ok: true, error: '', indicator: '', unit: '', freq: '', source: '', points, warnings };
}

/** 频度归一到白名单（容错近义写法）；无法识别返回原值 trim */
function normFreq(f) {
  const s = String(f || '').trim();
  if (!s) return '';
  if (ECON_FREQ.includes(s)) return s;
  const map = {
    年度: '年', annual: '年', yearly: '年', y: '年',
    季度: '季', quarterly: '季', q: '季',
    月度: '月', monthly: '月', m: '月',
    月累计: '月累计', ytd: '月累计', 累计: '月累计',
    日度: '日', daily: '日', d: '日',
    周度: '周', weekly: '周', w: '周',
  };
  return map[s.toLowerCase()] || map[s] || s;
}

// ---------------------------------------------------------------------------
// 4. seriesToDataset —— 产出 putDataset 入参（不落库）
// ---------------------------------------------------------------------------

/**
 * 把解析结果转为 putDataset 入参对象（仅产出，不写库）。
 * @param {ReturnType<typeof parseEconSeries>} parsed
 * @param {{category?:string, name?:string, source?:string, note?:string}} [opts]
 * @returns {{name:string, category:string, source:string, origin:string, note:string, columns:string[], rows:{period:string,value:number}[]}}
 */
export function seriesToDataset(parsed, { category, name, source, note } = {}) {
  const points = (parsed && Array.isArray(parsed.points)) ? parsed.points : [];
  const cat = ECON_CATEGORIES.includes(category) ? category : '经济运行';
  const finalName = (name && String(name).trim()) || (parsed && parsed.indicator) || '未命名经济序列';
  const finalSource = (source != null ? String(source) : '') || (parsed && parsed.source) || '';
  const baseNote = (note != null && String(note).trim()) ? String(note).trim() : '用户上传 · 使用前核对来源口径';
  return {
    name: finalName,
    category: cat,
    source: finalSource,
    origin: 'upload',
    note: baseNote,
    columns: ['period', 'value'],
    rows: points.map((p) => ({ period: p.period, value: p.value })),
  };
}

// ---------------------------------------------------------------------------
// 5. rowsToPoints —— 从 localdb 行还原序列
// ---------------------------------------------------------------------------

/**
 * 从 localdb getRows 返回的行还原为 [{period,value}]，按 period 排序、value 转 number。
 * 容错列名：period/value 或 时间/数值（及常见近义）。
 * @param {Object[]} rows
 * @returns {{period:string,value:number}[]}
 */
export function rowsToPoints(rows) {
  if (!Array.isArray(rows)) return [];
  const out = [];
  rows.forEach((r) => {
    if (!r || typeof r !== 'object') return;
    const pRaw = r.period ?? r.时间 ?? r.年份 ?? r.年月 ?? r.日期 ?? r.date ?? r.time;
    const vRaw = r.value ?? r.数值 ?? r.值 ?? r.val;
    const np = normPeriod(pRaw);
    const nv = cleanNumber(vRaw);
    if (np == null || nv == null) return;
    out.push({ period: np, value: nv });
  });
  out.sort((a, b) => cmpPeriod(a.period, b.period));
  return out;
}

// ---------------------------------------------------------------------------
// 6. seriesStats —— 序列摘要统计
// ---------------------------------------------------------------------------

/** 同期偏移步数：年=1，季=4，月=12；其余按相邻（1） */
function periodGran(p) {
  const s = String(p);
  if (/^\d{4}$/.test(s)) return { kind: 'year', step: 1 };
  if (/^\d{4}Q[1-4]$/.test(s)) return { kind: 'quarter', step: 4 };
  if (/^\d{4}-\d{2}$/.test(s)) return { kind: 'month', step: 12 };
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { kind: 'day', step: 1 };
  return { kind: 'other', step: 1 };
}

/**
 * 序列摘要：样本数、末值、极值、末值同比、趋势。
 * yoy：优先找「上一同期」（年-1/季-4/月-12 个周期前）的精确点；找不到则用相邻点近似。
 * @param {{period:string,value:number}[]} points
 * @returns {{n:number, latest:{period:string,value:number}|null, min:number|null, max:number|null, yoy:number|null, trend:('up'|'down'|'flat')}}
 */
export function seriesStats(points) {
  const pts = (Array.isArray(points) ? points : [])
    .filter((p) => p && p.period != null && Number.isFinite(Number(p.value)))
    .map((p) => ({ period: String(p.period), value: Number(p.value) }))
    .sort((a, b) => cmpPeriod(a.period, b.period));

  const n = pts.length;
  if (!n) return { n: 0, latest: null, min: null, max: null, yoy: null, trend: 'flat' };

  const vals = pts.map((p) => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const latest = pts[n - 1];

  // yoy：找上一同期
  let yoy = null;
  const { step } = periodGran(latest.period);
  const samePeriod = pts.length > step ? pts[n - 1 - step] : null;
  const base = samePeriod && samePeriod.value !== 0 ? samePeriod
    : (n >= 2 && pts[n - 2].value !== 0 ? pts[n - 2] : null);
  if (base && base.value !== 0) {
    yoy = Math.round(((latest.value - base.value) / Math.abs(base.value)) * 1000) / 10;
  }

  // trend：末两点比较（带极小阈值，避免浮点抖动）
  let trend = 'flat';
  if (n >= 2) {
    const d = latest.value - pts[n - 2].value;
    const eps = Math.max(Math.abs(latest.value), Math.abs(pts[n - 2].value)) * 1e-9;
    trend = d > eps ? 'up' : d < -eps ? 'down' : 'flat';
  }

  return { n, latest: { period: latest.period, value: latest.value }, min, max, yoy, trend };
}

// ---------------------------------------------------------------------------
// 7. listEconDatasets —— localdb 适配：过滤经济类 + 按 updatedAt 降序
// ---------------------------------------------------------------------------

/**
 * 列出底座中所有经济类数据集（category ∈ ECON_CATEGORIES），按 updatedAt 降序。
 * @returns {Promise<Object[]>}
 */
export async function listEconDatasets() {
  const all = await listDatasets();
  return all
    .filter((d) => d && ECON_CATEGORIES.includes(d.category))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

// ---------------------------------------------------------------------------
// 适配封装（薄）：从底座按 datasetId 还原序列 / 解析后落库
// ---------------------------------------------------------------------------

/**
 * 读取某数据集并还原为序列点（薄封装，便于组件直接取用）。
 * @param {string} datasetId
 * @returns {Promise<{period:string,value:number}[]>}
 */
export async function loadEconSeries(datasetId) {
  const rows = await getRows(datasetId);
  return rowsToPoints(rows);
}

/**
 * 解析文本并落库（薄封装）。stampMs 由调用方传入以维持确定性。
 * @param {string} text
 * @param {{category?:string, name?:string, source?:string, note?:string, fmt?:string, stampMs?:number}} opts
 * @returns {Promise<{ok:boolean, id?:string, error?:string, parsed:ReturnType<typeof parseEconSeries>}>}
 */
export async function importEconSeries(text, opts = {}) {
  const parsed = parseEconSeries(text, opts.fmt || 'auto');
  if (!parsed.ok) return { ok: false, error: parsed.error, parsed };
  const pkg = seriesToDataset(parsed, opts);
  const id = await putDataset({ ...pkg, stampMs: opts.stampMs });
  return { ok: true, id, parsed };
}
