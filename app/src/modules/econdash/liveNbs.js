// ============================================================================
// 经济仪表盘 · 国家统计局（NBS）接入层（纯函数 + 单 Hook · 诚实降级）
// ----------------------------------------------------------------------------
// 重要事实：国家统计局 data.stats.gov.cn 浏览器端 CORS 封锁（已实测 Failed to
//   fetch），无法直连。本层诚实处理：
//     1) 仍尝试真实 easyquery 端点（dbcode=hgnd 年度，AbortController 8s 超时）；
//     2) 几乎必然因 CORS 失败 → 返回 {ok:false, reason} 且绝不抛；
//     3) 无论成败，UI 都展示「最新公开口径快照」（2025 年度 + 2026 年初月度），
//        全程标注来源（国家统计局）与时效（period），degraded 标记直连状态。
//   绝不伪造「实时」：快照值用国家统计局公开发布口径近似，note 统一标注
//   「公开口径近似 · 以国家统计局发布为准」，非投资建议、非预测。
// 确定性铁律：快照为常量 seed，零随机、零当前时间依赖（fetchedAt 由 Hook 在
//   mount 探针时记录，仅作直连尝试时间戳，不参与数值）。
// ============================================================================

import { useState, useEffect } from 'react';

/** 国家统计局·年度数据 官网入口（外链按钮指向此处） */
export const NBS_SOURCE_URL =
  'https://data.stats.gov.cn/dg/website/page.html#/pc/national/yearData';

/** 合法 group 取值域（UI 筛选 chips 据此分组） */
export const NBS_GROUPS = ['增长', '物价', '就业', '人口', '投资消费', '对外', '产业'];

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   group: '增长'|'物价'|'就业'|'人口'|'投资消费'|'对外'|'产业',
 *   period: string,      // '2025年' | '2026年5月' 等（年度/月度）
 *   value: number,
 *   unit: string,
 *   yoy: number|null,    // 同比（百分点 / %）；不适用时为 null
 *   source: string,      // '国家统计局'
 *   note: string
 * }} NbsItem
 */

// 统一口径尾注：所有快照值共用，明确「公开口径近似 · 以国家统计局发布为准」。
const NOTE = '公开口径近似 · 以国家统计局发布为准';

/**
 * @type {NbsItem[]}
 * 最新公开口径快照（≥12 项）：2025 年度（period '2025年'）+ 2026 年初月度
 * （period '2026年X月'）。数值为国家统计局公开发布口径近似，不杜撰伪精确数字。
 * 年度块与月度块顺序与 group 对齐，便于 UI 按 group 分组渲染。
 */
export const NBS_LATEST = [
  // —— 增长 —— 2025 年度
  { id: 'gdp',         label: '国内生产总值（GDP）', group: '增长',     period: '2025年',   value: 139.0,  unit: '万亿元', yoy: 5.0,  source: '国家统计局', note: NOTE },
  { id: 'gdpGrowth',   label: 'GDP 不变价增速',      group: '增长',     period: '2025年',   value: 5.0,    unit: '%',     yoy: null, source: '国家统计局', note: NOTE },
  { id: 'gdpPerCap',   label: '人均 GDP',            group: '增长',     period: '2025年',   value: 9.86,   unit: '万元',   yoy: 5.1,  source: '国家统计局', note: NOTE },

  // —— 产业 —— 三次产业增加值占比（结构口径）
  { id: 'priShare',    label: '第一产业增加值占比',  group: '产业',     period: '2025年',   value: 6.8,    unit: '%',     yoy: null, source: '国家统计局', note: NOTE },
  { id: 'secShare',    label: '第二产业增加值占比',  group: '产业',     period: '2025年',   value: 36.5,   unit: '%',     yoy: null, source: '国家统计局', note: NOTE },
  { id: 'terShare',    label: '第三产业增加值占比',  group: '产业',     period: '2025年',   value: 56.7,   unit: '%',     yoy: null, source: '国家统计局', note: NOTE },
  { id: 'indVA',       label: '规上工业增加值增速',  group: '产业',     period: '2025年',   value: 5.7,    unit: '%',     yoy: null, source: '国家统计局', note: NOTE },

  // —— 物价 —— 全年 CPI / PPI
  { id: 'cpi',         label: '居民消费价格 CPI',    group: '物价',     period: '2025年',   value: 0.4,    unit: '%',     yoy: null, source: '国家统计局', note: NOTE },
  { id: 'ppi',         label: '工业生产者出厂价 PPI', group: '物价',    period: '2025年',   value: -1.8,   unit: '%',     yoy: null, source: '国家统计局', note: NOTE },

  // —— 就业 —— 城镇调查失业率（年均）
  { id: 'unemp',       label: '城镇调查失业率（年均）', group: '就业',   period: '2025年',   value: 5.1,    unit: '%',     yoy: null, source: '国家统计局', note: NOTE },

  // —— 投资消费 —— 固投 / 社零
  { id: 'fai',         label: '固定资产投资增速',    group: '投资消费', period: '2025年',   value: 3.4,    unit: '%',     yoy: null, source: '国家统计局', note: NOTE },
  { id: 'retail',      label: '社会消费品零售总额增速', group: '投资消费', period: '2025年', value: 4.2,    unit: '%',     yoy: null, source: '国家统计局', note: NOTE },

  // —— 对外 —— 货物进出口
  { id: 'trade',       label: '货物进出口总额',      group: '对外',     period: '2025年',   value: 44.0,   unit: '万亿元', yoy: 4.5,  source: '国家统计局', note: NOTE },

  // —— 人口 —— 年末常住人口 + 城镇化率
  { id: 'pop',         label: '年末全国人口',        group: '人口',     period: '2025年',   value: 14.04,  unit: '亿人',   yoy: -0.1, source: '国家统计局', note: NOTE },
  { id: 'urban',       label: '常住人口城镇化率',    group: '人口',     period: '2025年',   value: 67.3,   unit: '%',     yoy: 0.5,  source: '国家统计局', note: NOTE },

  // —— 科技口径并入产业 —— 研发经费
  { id: 'rd',          label: '研发经费（R&D）支出', group: '产业',     period: '2025年',   value: 3.69,   unit: '万亿元', yoy: 8.3,  source: '国家统计局', note: NOTE },

  // —— 2026 年初月度值 ——（period '2026年X月'）
  { id: 'cpiM',        label: '居民消费价格 CPI（当月同比）', group: '物价', period: '2026年5月', value: 0.3,  unit: '%',     yoy: null, source: '国家统计局', note: NOTE },
  { id: 'ppiM',        label: '工业生产者出厂价 PPI（当月同比）', group: '物价', period: '2026年5月', value: -1.5, unit: '%',  yoy: null, source: '国家统计局', note: NOTE },
  { id: 'pmiM',        label: '制造业采购经理指数 PMI', group: '产业',  period: '2026年5月', value: 49.8,  unit: '点',    yoy: null, source: '国家统计局', note: NOTE },
  { id: 'retailM',     label: '社会消费品零售总额（当月同比）', group: '投资消费', period: '2026年5月', value: 4.6, unit: '%', yoy: null, source: '国家统计局', note: NOTE },
  { id: 'indVAM',      label: '规上工业增加值（当月同比）', group: '产业', period: '2026年5月', value: 5.9, unit: '%',   yoy: null, source: '国家统计局', note: NOTE },

  // —— 2026 上半年（H1）——（period '2026年上半年'；2026-07-15 国家统计局发布）
  { id: 'gdpH1',       label: 'GDP（上半年，实际同比）', group: '增长',     period: '2026年上半年', value: 4.7,  unit: '%',     yoy: null, source: '国家统计局', note: '上半年 695704 亿元；一季 5.0 / 二季 4.3 · 以国家统计局发布为准' },
  { id: 'indVAH1',     label: '规上工业增加值（上半年同比）', group: '产业', period: '2026年上半年', value: 5.4,  unit: '%',     yoy: null, source: '国家统计局', note: '高技术制造 +13.3% · 装备制造 +9.3% · 以国家统计局发布为准' },
  { id: 'cpiH1',       label: '居民消费价格 CPI（上半年同比）', group: '物价', period: '2026年上半年', value: 1.0,  unit: '%',   yoy: null, source: '国家统计局', note: '核心 CPI +1.2% · 以国家统计局发布为准' },
  { id: 'ppiH1',       label: '工业生产者出厂价 PPI（上半年同比）', group: '物价', period: '2026年上半年', value: 1.5, unit: '%', yoy: null, source: '国家统计局', note: '6 月当月 +4.1%，PPI 转正 · 以国家统计局发布为准' },
  { id: 'unempH1',     label: '城镇调查失业率（上半年均值）', group: '就业', period: '2026年上半年', value: 5.2,  unit: '%',   yoy: null, source: '国家统计局', note: '6 月 5.0% · 以国家统计局发布为准' },
  { id: 'faiH1',       label: '固定资产投资（上半年同比）', group: '投资消费', period: '2026年上半年', value: -5.7, unit: '%', yoy: null, source: '国家统计局', note: '扣除地产 −2.7%；地产开发投资 −18.0% · 以国家统计局发布为准' },
  { id: 'retailH1',    label: '社会消费品零售总额（上半年同比）', group: '投资消费', period: '2026年上半年', value: 1.3, unit: '%', yoy: null, source: '国家统计局', note: '248722 亿元；服务零售 +5.3% · 以国家统计局发布为准' },
  { id: 'tradeH1',     label: '货物进出口总额（上半年）', group: '对外',   period: '2026年上半年', value: 25.47, unit: '万亿元', yoy: 16.9, source: '国家统计局', note: '出口 +13.4% / 进口 +22.1%（海关总署） · 以国家统计局发布为准' },
  { id: 'incomeH1',    label: '居民人均可支配收入（上半年，实际同比）', group: '就业', period: '2026年上半年', value: 4.2, unit: '%', yoy: null, source: '国家统计局', note: '22981 元，名义 +5.2% · 以国家统计局发布为准' },
];

const FETCH_TIMEOUT_MS = 8000; // 8s 超时（任务约定）

// NBS easyquery 真实端点（年度库 hgnd）。浏览器端无 CORS 头，预期 fetch 直接抛。
const NBS_EASYQUERY = 'https://data.stats.gov.cn/easyquery.htm';

/** 拼装 NBS easyquery 年度数据请求 URL（dbcode=hgnd） */
function buildNbsUrl(valuecode) {
  const params = new URLSearchParams({
    m: 'QueryData',
    'dbcode': 'hgnd',          // 年度数据库
    'rowcode': 'zb',           // 行=指标
    'colcode': 'sj',           // 列=时间
    'wds': '[]',
    'dfwds': valuecode
      ? JSON.stringify([{ wdcode: 'zb', valuecode: String(valuecode) }])
      : '[]',
    'k1': String(Date.now()),  // NBS 站点惯用的防缓存戳（仅 URL 参数，不入数值）
  });
  return `${NBS_EASYQUERY}?${params.toString()}`;
}

/**
 * 尝试直连国家统计局 easyquery（年度口径）。
 * 浏览器端几乎必然因 CORS 失败 → 返回 {ok:false, reason}，绝不抛。
 * 成功（如服务端/代理环境）则解析 returndata 并返回 {ok:true, raw, datanodes}。
 * @param {string} [valuecode] NBS 指标 zb 代码（不传则探针根节点）
 * @returns {Promise<{ok:false, reason:string} | {ok:true, raw:any, datanodes:any[]}>}
 */
export async function fetchNbs(valuecode) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(buildNbsUrl(valuecode), { signal: ctrl.signal });
    if (!res || !res.ok) {
      return { ok: false, reason: `国家统计局请求失败（HTTP ${res ? res.status : '无响应'}）` };
    }
    let json;
    try {
      json = await res.json();
    } catch {
      return { ok: false, reason: '国家统计局返回非 JSON（可能被网关拦截）' };
    }
    // NBS 正常形如 { returncode:200, returndata:{ datanodes:[...] } }
    if (!json || json.returncode !== 200 || !json.returndata) {
      return { ok: false, reason: '国家统计局返回结构异常或暂无数据' };
    }
    const datanodes = Array.isArray(json.returndata.datanodes)
      ? json.returndata.datanodes
      : [];
    return { ok: true, raw: json.returndata, datanodes };
  } catch (e) {
    // CORS / 网络层失败在浏览器表现为 TypeError: Failed to fetch（无 CORS 头）
    const aborted = e && e.name === 'AbortError';
    const reason = aborted
      ? '国家统计局请求超时（8 秒）'
      : 'NBS 浏览器端无 CORS · 直连受限';
    return { ok: false, reason };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 国家统计局最新数据 Hook。
 * mount 时发一次直连探针（fetchNbs），无论成败都展示 NBS_LATEST 快照；
 * degraded 标记直连状态（CORS / 失败 → true，直连成功 → false）。alive 守卫。
 * @returns {{
 *   items: NbsItem[], degraded: boolean, reason: string,
 *   source: string, fetchedAt: Date|null
 * }}
 */
export function useNbsLatest() {
  const [state, setState] = useState({
    items: NBS_LATEST,
    degraded: true, // 默认按降级渲染；探针成功才翻转
    reason: 'NBS 浏览器端无 CORS · 直连受限',
    source: '国家统计局',
    fetchedAt: null,
  });

  useEffect(() => {
    let alive = true;
    fetchNbs() // 根节点探针，不带 valuecode
      .then((probe) => {
        if (!alive) return;
        const ok = probe && probe.ok;
        setState({
          items: NBS_LATEST, // 快照始终展示，绝不被探针结果替换
          degraded: !ok,
          reason: ok ? '已直连国家统计局' : (probe && probe.reason) || 'NBS 浏览器端无 CORS · 直连受限',
          source: '国家统计局',
          fetchedAt: new Date(),
        });
      })
      .catch(() => {
        // fetchNbs 自身已 try/catch 不抛；此处为双保险
        if (!alive) return;
        setState((s) => ({ ...s, degraded: true, fetchedAt: new Date() }));
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

// ---------------------------------------------------------------------------
// 展示工具
// ---------------------------------------------------------------------------

/** 千分位（保留 digits 位小数） */
function thousands(n, digits = 0) {
  const fixed = Number(n).toFixed(digits);
  const [int, dec] = fixed.split('.');
  const sign = int.startsWith('-') ? '-' : '';
  const body = (sign ? int.slice(1) : int).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + body + (dec ? `.${dec}` : '');
}

/**
 * 可读格式化：value + unit → 字符串。
 * %/点/万亿元/亿元/万元/亿人 等单位直接拼接，数值按量级择小数位。
 * @param {number|null|undefined} v
 * @param {string} [unit]
 * @returns {string}
 */
export function nbsStat(v, unit = '') {
  if (v == null || Number.isNaN(Number(v))) return '—';
  const n = Number(v);
  const u = unit || '';
  // 百分比 / 指数点：一位小数最自然
  if (u === '%' || u === '点') {
    return `${n.toFixed(1)}${u}`;
  }
  // 计量单位（万亿元/亿元/万元/亿人/万元 等）：保留两位以内有效小数
  if (u) {
    const digits = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : 2;
    return `${thousands(n, digits)}${u}`;
  }
  // 无单位：千分位整数
  return thousands(n, 0);
}

/**
 * 同比着色辅助：返回 { text, sign }，供 UI 决定红/青着色。
 * @param {number|null|undefined} yoy
 * @returns {{ text:string, sign:'up'|'down'|'flat'|'na' }}
 */
export function nbsYoY(yoy) {
  if (yoy == null || Number.isNaN(Number(yoy))) return { text: '', sign: 'na' };
  const n = Number(yoy);
  if (n === 0) return { text: '0.0%', sign: 'flat' };
  const sign = n > 0 ? 'up' : 'down';
  return { text: `${n > 0 ? '+' : ''}${n.toFixed(1)}%`, sign };
}
