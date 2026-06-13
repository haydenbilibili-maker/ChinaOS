// ============================================================================
// 经济观测台 · 经济异动监测聚合（纯数据 / 纯函数，零 React / 零随机 / 零当前时间）
// ----------------------------------------------------------------------------
// 角色：把全盘各数据层（核心指标盘 / 金丝雀 / 背离监测 / 区域下钻）的异常项，
//   按确定性规则汇成一张「实时监测」告警板。本层只做聚合与研判，不持有自有数据。
// 口径声明（最高优先级，全程贯彻）：
//   · 告警源数据均为「公开统计梳理 + 示意标定」近似值，标注基准日 WATCH_ASOF；
//     告警的严重度分级（严重 / 警示 / 关注）为分析示意，非官方分级、非预测。
//   · 全模块声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// 确定性铁律：本层零随机、零当前时间；id / 排序 / 计数全程确定，基准日用常量。
// ============================================================================

import { KEY_INDICATORS, indicatorVerdict, CANARY_SIGNALS } from './econData.js';
import { TENSIONS } from './econDeflation.js';
import { REGIONS, regionStressTally } from './econRegional.js';

/** 监测基准日（与各源层 ASOF 对齐；以官方发布为准） */
export const WATCH_ASOF = '2026-06-11';

// ---------------------------------------------------------------------------
// 严重度档位：排序权重（降序）与可读标签集合。
//   严重 > 警示 > 关注。聚合规则不产出「严重」凭单条——多源叠加由 watchSummary
//   呈现密集度；本聚合内最高单条档位为「警示」，「严重」档保留给跨域共振升格。
// ---------------------------------------------------------------------------

/** 档位 → 排序权重（数字越大越严重，用于降序稳定排序） */
const LEVEL_WEIGHT = { 严重: 3, 警示: 2, 关注: 1 };

/** verdict.tone → 告警档位（negative→警示，caution→关注；其余不告警） */
function toneToLevel(tone) {
  if (tone === 'negative') return '警示';
  if (tone === 'caution') return '关注';
  return null;
}

/**
 * scanAlerts — 全盘异动扫描，返回按严重度降序的统一告警数组。
 * 每条 {id, level, domain, title, detail(≤40字), source, value?}。
 * 规则确定性、可重放：同一份源数据每次产出完全一致。
 * @returns {Array<{id:string, level:'严重'|'警示'|'关注',
 *   domain:'价格'|'景气'|'就业'|'货币'|'需求'|'区域'|'背离'|'结构',
 *   title:string, detail:string, source:string, value?:string}>}
 */
export function scanAlerts() {
  const alerts = [];

  // —— 工具：截断 detail 到 ≤40 字（确定性，不引入省略号外的随机）——
  const clip = (s, n = 40) => {
    const t = String(s == null ? '' : s);
    return t.length <= n ? t : t.slice(0, n - 1) + '…';
  };

  // —— 源层别名（用于稳定 id 前缀，避免跨源 id 撞车）——
  const SRC = {
    indicator: '核心指标盘',
    canary: '金丝雀',
    tension: '背离监测',
    region: '区域下钻',
  };

  // 核心指标 group（物价/景气/就业/货币/需求）→ 告警 domain（价格/...）
  const GROUP_TO_DOMAIN = {
    物价: '价格',
    景气: '景气',
    就业: '就业',
    货币: '货币',
    需求: '需求',
  };

  // ===== 1) 核心指标盘 =====
  // indicatorVerdict tone：negative→警示、caution→关注；
  // 额外规则：PMI 类（threshold===50）越过荣枯线向下（value<50 且 trend==='down'）→至少警示。
  for (const ind of Array.isArray(KEY_INDICATORS) ? KEY_INDICATORS : []) {
    if (!ind || typeof ind !== 'object') continue;
    const v = indicatorVerdict(ind);
    let level = toneToLevel(v.tone);

    const isPmi = ind.threshold === 50;
    const pmiBreakDown = isPmi && typeof ind.value === 'number' && ind.value < 50 && ind.trend === 'down';
    if (pmiBreakDown) {
      // 越过荣枯线向下：升格到至少「警示」
      level = level && LEVEL_WEIGHT[level] >= LEVEL_WEIGHT['警示'] ? level : '警示';
    }
    if (!level) continue;

    const domain = GROUP_TO_DOMAIN[ind.group] || '结构';
    const detail = pmiBreakDown
      ? `跌破荣枯线 50 且仍在下探，景气收缩`
      : clip(v.text);
    const value = typeof ind.value === 'number' ? `${ind.value}${ind.unit || ''}` : undefined;

    alerts.push({
      id: `ind:${ind.id}`,
      level,
      domain,
      title: ind.label || ind.id,
      detail: clip(detail),
      source: SRC.indicator,
      ...(value != null ? { value } : {}),
    });
  }

  // ===== 2) 金丝雀盘 =====
  // signal red→警示、amber→关注；title=label，detail=lead。
  for (const c of Array.isArray(CANARY_SIGNALS) ? CANARY_SIGNALS : []) {
    if (!c || typeof c !== 'object') continue;
    let level = null;
    if (c.signal === 'red') level = '警示';
    else if (c.signal === 'amber') level = '关注';
    if (!level) continue;

    // 金丝雀域归类：就业类入「就业」，其余领先信号入「景气」。
    const domain = c.id === 'youth_unemp' ? '就业' : '景气';
    alerts.push({
      id: `canary:${c.id}`,
      level,
      domain,
      title: c.label || c.id,
      detail: clip(c.lead),
      source: SRC.canary,
      ...(c.reading ? { value: clip(c.reading, 24) } : {}),
    });
  }

  // ===== 3) 背离监测 =====
  // right≥60（现实显著弱于叙事）→警示；title='{a} × {b} 背离'，detail=gap。
  for (const t of Array.isArray(TENSIONS) ? TENSIONS : []) {
    if (!t || typeof t !== 'object' || typeof t.right !== 'number') continue;
    if (t.right < 60) continue;
    alerts.push({
      id: `tension:${t.id}`,
      level: '警示',
      domain: '背离',
      title: `${t.a || '前项'} × ${t.b || '后项'} 背离`,
      detail: clip(t.gap),
      source: SRC.tension,
      value: `张力 ${100 - t.right}:${t.right}`,
    });
  }

  // ===== 4) 区域下钻 =====
  // regionStressTally level==='高压'→警示（domain 区域），detail=headline。
  for (const r of Array.isArray(REGIONS) ? REGIONS : []) {
    if (!r || typeof r !== 'object') continue;
    if (r.group === '全国') continue; // 全国基准为参照锚，不作为单区域告警
    const tally = regionStressTally(r);
    if (tally.level !== '高压') continue;
    alerts.push({
      id: `region:${r.id}`,
      level: '警示',
      domain: '区域',
      title: `${r.name || r.id} · 投资环境高压`,
      detail: clip(r.headline),
      source: SRC.region,
      value: `承压 ${tally.avg}/100`,
    });
  }

  // —— 去重（同 id 仅留首条）——
  const seen = new Set();
  const deduped = [];
  for (const a of alerts) {
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    deduped.push(a);
  }

  // —— 稳定降序：先按 level 权重降序，权重相同保持插入顺序（源层→源内）——
  deduped.sort((x, y) => (LEVEL_WEIGHT[y.level] || 0) - (LEVEL_WEIGHT[x.level] || 0));

  return deduped;
}

// ---------------------------------------------------------------------------
// watchSummary — 对告警数组做计数自洽汇总 + 一句总体研判。
// ---------------------------------------------------------------------------

/**
 * @param {ReturnType<typeof scanAlerts>} alerts
 * @returns {{total:number, 严重:number, 警示:number, 关注:number,
 *   byDomain:Object.<string,number>, mood:string}}
 */
export function watchSummary(alerts) {
  const list = Array.isArray(alerts) ? alerts : [];
  let sev = 0, warn = 0, watch = 0;
  const byDomain = {};

  for (const a of list) {
    if (!a || typeof a !== 'object') continue;
    if (a.level === '严重') sev += 1;
    else if (a.level === '警示') warn += 1;
    else if (a.level === '关注') watch += 1;
    const d = a.domain || '结构';
    byDomain[d] = (byDomain[d] || 0) + 1;
  }
  const total = sev + warn + watch;

  // —— 一句总体研判：拎出告警最密集的两个域 + 总体成色 ——
  const domainsRanked = Object.entries(byDomain)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .map(([d]) => d);
  const topTwo = domainsRanked.slice(0, 2);

  let mood;
  if (total === 0) {
    mood = '全盘暂无触发的异动告警，主要读数落在合意区间。';
  } else {
    const heavy = sev + warn; // 严重 + 警示 计为「重档」
    const lensTxt = topTwo.length
      ? `${topTwo.join('与')}${topTwo.length > 1 ? '两线' : '一线'}告警密集`
      : '多域告警散布';
    if (heavy === 0) {
      mood = `${lensTxt}，多为关注档，尚属低位扰动，需求侧未见塌方。`;
    } else if (heavy >= 6) {
      mood = `${lensTxt}，重档告警成片，价格与内生动能双弱，弱复苏未确认。`;
    } else {
      mood = `${lensTxt}，重档告警集中，弱复苏缺乏价格与信用的双重确认。`;
    }
  }

  return { total, 严重: sev, 警示: warn, 关注: watch, byDomain, mood };
}

// ---------------------------------------------------------------------------
// DISCIPLINE_RULES — 数据使用纪律四条（与「中国经济观测台结构蓝图」对齐）。
//   恰 4 条：春节错月 / 口径变更 / 交叉验证 / 背离即裂缝。
// ---------------------------------------------------------------------------

/** @type {Array<{mark:string, title:string, body:string}>} 数据纪律四条 */
export const DISCIPLINE_RULES = [
  {
    mark: '春',
    title: '春节错月扰动',
    body: '1–2 月数据受春节错月强烈干扰，单月同比失真；需做 1–2 月合并、或按农历错月对齐后再比较，切忌拿错月单月下结论。',
  },
  {
    mark: '径',
    title: '统计口径变更须标注',
    body: '口径变更使新旧序列不可比，须显著标注：青年失业率 2024 起不含在校生、M1 启用新口径、北向资金停止实时披露——比较前先核对口径是否同一。',
  },
  {
    mark: '叉',
    title: '官方×高频双轨交叉验证',
    body: '官方月报与高频实物量互为校验：用电量、货运量、票据利率、地铁客流交叉对照；当官方读数与高频背离时，以高频实物量为更难注水的旁证。',
  },
  {
    mark: '裂',
    title: '背离即裂缝，优先盯背离',
    body: '名义×实际、体制×市场、总量×私人之间的背离即结构裂缝；监测时优先盯背离面板，张力张开处往往先于总量数据暴露真实承压。',
  },
];
