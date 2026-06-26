/** 数据事实观察 · 阈值研判逻辑（与 A/B/C 信号灯语义对齐） */

/**
 * @typedef {Object} ObservationRule
 * @property {('threshold_high'|'threshold_low'|'zero_cross'|'spread'|'band'|'custom')} type
 * @property {number} [threshold] 荣枯/警戒/零轴
 * @property {number} [greenMin] 转绿下界
 * @property {number} [amberMin] 转琥珀下界
 * @property {number} [greenMax] 转绿上界
 * @property {number} [compareId] spread 类型：对比指标 id
 * @property {string} [hint] 自定义读数说明
 */

/** @type {Record<string, ObservationRule>} */
export const OBSERVATION_RULES = {
  gdp_deflator: {
    type: 'zero_cross',
    threshold: 0,
    amberMin: -0.5,
    hint: '连续两季转正并站稳 → C1 转绿（态势闸门）',
  },
  retail_growth: {
    type: 'spread',
    compareId: 'fai_growth',
    hint: '社零持续高于固投 → C2 转绿',
  },
  fai_growth: { type: 'custom', hint: '与社零对比，见 retail_growth 剪刀差' },
  consumption_gdp: {
    type: 'threshold_high',
    greenMin: 42,
    amberMin: 40,
    hint: '比重持续上行 → C3 转绿（结构性胜利）',
  },
  resident_midloan: {
    type: 'zero_cross',
    threshold: 0,
    amberMin: -500,
    hint: '新增由缩转增并持续 → C4 转绿',
  },
  pmi_mfg: { type: 'threshold_high', threshold: 50, hint: '荣枯线 50；线上扩张、线下收缩' },
  pmi_nonmfg: { type: 'threshold_high', threshold: 50, hint: '荣枯线 50；服务业景气' },
  m2: { type: 'band', greenMin: 8, greenMax: 12, hint: '宽货币传导至实体仍偏弱' },
  afre: { type: 'threshold_high', greenMin: 9, amberMin: 7, hint: '社融增速；政府债拉动为主' },
  bond_10y: { type: 'band', greenMin: 2.0, greenMax: 3.5, hint: '低利率反映通缩预期与政策空间' },
  usdcny: { type: 'band', greenMin: 6.8, greenMax: 7.35, hint: '汇率稳则外需与资本流动可控' },
  ppi: { type: 'zero_cross', threshold: 0, amberMin: -2, hint: '工业品通缩；与平减指数互证' },
  cpi: { type: 'band', greenMin: 0.5, greenMax: 2.5, hint: '需求侧温和；近零偏冷' },
  power: { type: 'threshold_high', greenMin: 5, amberMin: 2, hint: '实体生产真实活跃度' },
  rail_freight: { type: 'threshold_high', greenMin: 3, amberMin: 0, hint: '大宗与重工业运输' },
  house_price: {
    type: 'zero_cross',
    threshold: 0,
    amberMin: -0.2,
    hint: '房价环比转正 → 居民资产负债表信心修复',
  },
  youth_unemp: { type: 'threshold_low', threshold: 14, greenMax: 13, hint: '结构性就业压力；拖累消费预期' },
  urban_unemp: { type: 'threshold_low', threshold: 5.5, hint: '警戒区 5.5%' },
  deficit_rate: { type: 'threshold_high', greenMin: 3.5, hint: '中央加杠杆意愿；A2 已实质推进' },
  child_allowance: {
    type: 'threshold_high',
    greenMin: 7200,
    amberMin: 3600,
    hint: '标准翻倍 → B1 转绿',
  },
};

/**
 * @param {import('./observationData.js').Observation} obs
 * @param {import('./observationData.js').Observation[]} all
 * @returns {{ signal: 'red'|'amber'|'green', label: string, reason: string }}
 */
export function computeObservationHint(obs, all = []) {
  const rule = OBSERVATION_RULES[obs.id];
  if (!rule) return { signal: 'amber', label: '待标定', reason: '暂无阈值规则' };

  const v = obs.value;
  const byId = Object.fromEntries(all.map((o) => [o.id, o]));

  if (rule.type === 'spread') {
    const other = byId[rule.compareId];
    if (!other || typeof v !== 'number' || typeof other.value !== 'number') {
      return { signal: 'amber', label: '待核对', reason: '剪刀差读数不全' };
    }
    const gap = v - other.value;
    if (gap >= 1.5) return { signal: 'green', label: '消费领跑', reason: `社零超固投 ${gap.toFixed(1)} pct` };
    if (gap >= 0) return { signal: 'amber', label: '微弱领先', reason: `社零略高于固投 ${gap.toFixed(1)} pct` };
    return { signal: 'red', label: '投资主导', reason: `固投仍超社零 ${Math.abs(gap).toFixed(1)} pct` };
  }

  if (rule.type === 'custom') {
    return { signal: 'amber', label: '参照项', reason: rule.hint || '见关联指标' };
  }

  if (rule.type === 'zero_cross') {
    if (v > 0) return { signal: 'green', label: '已转正', reason: rule.hint || '穿越零轴' };
    if (typeof rule.amberMin === 'number' && v >= rule.amberMin) {
      return { signal: 'amber', label: '临界', reason: rule.hint || '逼近零轴' };
    }
    return { signal: 'red', label: '负区间', reason: rule.hint || '仍在零轴下方' };
  }

  if (rule.type === 'threshold_high') {
    if (typeof rule.threshold === 'number') {
      if (v >= rule.threshold + 0.5) return { signal: 'green', label: '线上', reason: rule.hint || `≥ ${rule.threshold}` };
      if (v >= rule.threshold - 0.5) return { signal: 'amber', label: '临界', reason: rule.hint || `贴近 ${rule.threshold}` };
      return { signal: 'red', label: '线下', reason: rule.hint || `< ${rule.threshold}` };
    }
    if (typeof rule.greenMin === 'number' && v >= rule.greenMin) {
      return { signal: 'green', label: '达标', reason: rule.hint || `≥ ${rule.greenMin}` };
    }
    if (typeof rule.amberMin === 'number' && v >= rule.amberMin) {
      return { signal: 'amber', label: '破冰', reason: rule.hint || `≥ ${rule.amberMin}` };
    }
    return { signal: 'red', label: '偏低', reason: rule.hint || '未达琥珀线' };
  }

  if (rule.type === 'threshold_low') {
    if (typeof rule.greenMax === 'number' && v <= rule.greenMax) {
      return { signal: 'green', label: '改善', reason: rule.hint || `≤ ${rule.greenMax}` };
    }
    if (typeof rule.threshold === 'number' && v >= rule.threshold) {
      return { signal: 'red', label: '警戒', reason: rule.hint || `≥ ${rule.threshold}` };
    }
    if (typeof rule.threshold === 'number' && v >= rule.threshold - 1) {
      return { signal: 'amber', label: '偏高', reason: rule.hint || '接近警戒线' };
    }
    return { signal: 'amber', label: '中性', reason: rule.hint || '总量平稳' };
  }

  if (rule.type === 'band') {
    const lo = rule.greenMin ?? -Infinity;
    const hi = rule.greenMax ?? Infinity;
    if (v >= lo && v <= hi) return { signal: 'green', label: '合意', reason: rule.hint || `[${lo}, ${hi}]` };
    if (v >= lo - 1 && v <= hi + 1) return { signal: 'amber', label: '偏离', reason: rule.hint || '略偏离合意区' };
    return { signal: 'red', label: '异常', reason: rule.hint || '明显偏离合意区' };
  }

  return { signal: 'amber', label: '待标定', reason: rule.hint || '—' };
}

/** @param {number|null|undefined} n @param {string} [suffix] */
export function fmtDelta(n, suffix = '%') {
  if (n == null || !Number.isFinite(n)) return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n}${suffix}`;
}

/** @param {import('./observationData.js').Observation} obs */
export function fmtValue(obs) {
  if (obs.value == null || !Number.isFinite(obs.value)) return '—';
  const abs = Math.abs(obs.value);
  if (abs >= 1000) return obs.value.toLocaleString('zh-CN');
  if (Number.isInteger(obs.value)) return String(obs.value);
  return obs.value.toFixed(abs < 10 ? 2 : 1);
}
