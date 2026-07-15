// ============================================================================
// 数据时效工具 · 纯函数（陈旧判定 + 中国标准时间格式化）
// ----------------------------------------------------------------------------
// 职责：给定「数据时间戳」与「当前时间」，计算数据年龄并判定是否可能过期；
//       以及把任意时刻格式化为中国标准时间（UTC+8 / Asia/Shanghai）展示串。
// 确定性：所有导出均为纯函数，不读取 Date.now()（当前时间必须由调用方注入），
//         便于单元测试与可复现。UI 层负责用 setInterval 注入实时 now。
// 声明：本工具仅做时效研判，不改动任何数据数值。
// ============================================================================

/**
 * 宏观数据陈旧阈值（天）。
 * ----------------------------------------------------------------------------
 * 取值理由：中国宏观月度数据（CPI/PPI/PMI/社零/固投/工业增加值等）通常在次月
 * 中旬由国家统计局集中发布，季度/半年数据则在季后次月中旬发布——即每一轮官方
 * 发布窗口的间隔约为一个自然月（30–31 天）。取 35 天 = 一个月 + 数日发布延迟
 * 缓冲：若数据时间戳距今已超过 35 天，意味着至少已跨过下一轮官方发布窗口而看板
 * 仍未更新，故判定「数据可能已过期」。此阈值为可调常量，改动发布节奏假设时只需
 * 修改此处。
 */
export const STALE_THRESHOLD_DAYS = 35;

/** 一天的毫秒数。 */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * 把多种输入（Date / ISO 字符串 / 时间戳数字）解析为毫秒时间戳。
 * 解析失败返回 NaN（不抛）。仅日期串（YYYY-MM-DD）按本地 00:00 解析。
 * @param {Date|string|number|null|undefined} input
 * @returns {number} 毫秒时间戳，或 NaN
 */
export function toMillis(input) {
  if (input == null) return NaN;
  if (input instanceof Date) return input.getTime();
  if (typeof input === 'number') return Number.isFinite(input) ? input : NaN;
  if (typeof input === 'string') {
    const t = Date.parse(input);
    return Number.isNaN(t) ? NaN : t;
  }
  return NaN;
}

/**
 * 计算两时刻相差的天数（to − from），保留小数。
 * 任一无法解析则返回 NaN。
 * @param {Date|string|number} from 较早时刻（如数据时间戳）
 * @param {Date|string|number} to   较晚时刻（如当前时间）
 * @returns {number} 相差天数（可为负），或 NaN
 */
export function daysBetween(from, to) {
  const a = toMillis(from);
  const b = toMillis(to);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return (b - a) / MS_PER_DAY;
}

/**
 * @typedef {Object} FreshnessResult
 * @property {number}  ageDays       数据年龄（天，保留小数；无法解析为 NaN）
 * @property {number}  ageDaysWhole  数据年龄（向下取整天数；NaN 时为 NaN）
 * @property {boolean} isStale       是否超过阈值（可能已过期）
 * @property {('fresh'|'aging'|'stale'|'unknown')} level 三档 + 未知
 * @property {number}  thresholdDays 使用的阈值（天）
 * @property {number}  daysUntilStale 距触发陈旧还剩天数（已陈旧为负；NaN 时为 NaN）
 * @property {string}  label         中文一句话研判
 */

/**
 * 评估数据时效：给定数据时间戳与当前时间，判定 fresh / aging / stale。
 * - fresh：年龄 ≤ 阈值 × 0.6，视为「数据为最新」。
 * - aging：介于其间，仍在有效期但临近下一轮发布窗口，做柔性提醒。
 * - stale：年龄 > 阈值，判定「数据可能已过期」，UI 醒目告警。
 * - unknown：时间戳无法解析。
 * 当前时间必须由调用方注入（默认取 new Date() 仅为兜底，测试请显式传入）。
 * @param {Date|string|number} dataAsOf 数据时间戳
 * @param {Date|string|number} [now] 当前时间（UI 用实时 now 注入）
 * @param {number} [thresholdDays] 陈旧阈值，默认 STALE_THRESHOLD_DAYS
 * @returns {FreshnessResult}
 */
export function assessFreshness(dataAsOf, now = new Date(), thresholdDays = STALE_THRESHOLD_DAYS) {
  const threshold = Number.isFinite(thresholdDays) && thresholdDays > 0 ? thresholdDays : STALE_THRESHOLD_DAYS;
  const ageDays = daysBetween(dataAsOf, now);

  if (Number.isNaN(ageDays)) {
    return {
      ageDays: NaN,
      ageDaysWhole: NaN,
      isStale: false,
      level: 'unknown',
      thresholdDays: threshold,
      daysUntilStale: NaN,
      label: '数据时间戳无法解析，时效未知。',
    };
  }

  // 未来时间戳（now 早于数据日）按年龄 0 处理，视为最新。
  const safeAge = Math.max(0, ageDays);
  const ageDaysWhole = Math.floor(safeAge);
  const isStale = safeAge > threshold;
  const daysUntilStale = threshold - safeAge;

  let level;
  if (isStale) level = 'stale';
  else if (safeAge <= threshold * 0.6) level = 'fresh';
  else level = 'aging';

  let label;
  if (level === 'stale') {
    label = `数据已 ${ageDaysWhole} 天未更新，超过 ${threshold} 天阈值，可能已过期，建议更新经济大盘数据。`;
  } else if (level === 'aging') {
    label = `数据已 ${ageDaysWhole} 天，仍在有效期，${Math.ceil(daysUntilStale)} 天后临近下一轮官方发布窗口。`;
  } else {
    label = `数据为最新（${ageDaysWhole} 天内，${threshold} 天阈值内）。`;
  }

  return { ageDays: safeAge, ageDaysWhole, isStale, level, thresholdDays: threshold, daysUntilStale, label };
}

/**
 * @typedef {Object} CstParts
 * @property {string} date    'YYYY-MM-DD'（中国标准时间）
 * @property {string} time    'HH:MM:SS'（24 小时制，中国标准时间）
 * @property {string} weekday '周一'…'周日'
 * @property {string} full    '2026-07-15 21:56:03'
 */

/**
 * 把任意时刻格式化为中国标准时间（UTC+8 / Asia/Shanghai）各部件。
 * 无外部依赖，用运行时 Intl；不改变系统时区，始终按 Asia/Shanghai 呈现。
 * @param {Date|string|number} [date] 时刻，默认 new Date()
 * @returns {CstParts}
 */
export function formatCstParts(date = new Date()) {
  const ms = toMillis(date);
  const d = Number.isNaN(ms) ? new Date() : new Date(ms);
  const fmt = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short',
  });
  const parts = fmt.formatToParts(d);
  const get = (type) => (parts.find((p) => p.type === type)?.value ?? '');
  const y = get('year');
  const mo = get('month');
  const da = get('day');
  let hh = get('hour');
  // Intl 在部分环境把 00 时输出为 '24'，规整为 '00'。
  if (hh === '24') hh = '00';
  const mi = get('minute');
  const ss = get('second');
  let wd = get('weekday'); // zh-CN short 形如 '周三'
  if (wd && !wd.startsWith('周')) wd = `周${wd}`;
  const dateStr = `${y}-${mo}-${da}`;
  const timeStr = `${hh}:${mi}:${ss}`;
  return { date: dateStr, time: timeStr, weekday: wd, full: `${dateStr} ${timeStr}` };
}
