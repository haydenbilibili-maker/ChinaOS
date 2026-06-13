// ============================================================================
// 经济观测台 · 全景速读报告（纯函数 / 零 React / 零随机 / 零当前时间）
// ----------------------------------------------------------------------------
// 口径声明（最高优先级，全程贯彻）：
//   · 本文件不产生任何数据，只是把既有数据层（econData / econDeflation /
//     econRegional）的快照串成一页 Markdown「全景速读」。
//   · 一切读数沿用各数据层的公开口径近似值；研判沿用各层纯函数
//     （deflationMood / indicatorVerdict / regionStressTally）。
//   · 全模块声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// 确定性铁律：本层零随机、零当前时间；基准日用常量 REPORT_ASOF。
//   两次调用必须返回完全一致的字符串。
// ============================================================================

import {
  SECTOR_STRUCTURE,
  KEY_INDICATORS,
  NEW_ECONOMY,
  indicatorVerdict,
} from './econData.js';
import {
  HEADLINE_GAUGES,
  TENSIONS,
  deflationMood,
} from './econDeflation.js';
import {
  REGIONS,
  regionStressTally,
} from './econRegional.js';

/** 报告基准日（与各数据层 *_ASOF 对齐；确定性常量，禁止取当前时间） */
export const REPORT_ASOF = '2026-06-11';

/** 尾注口径声明（全站统一话术） */
const DISCLAIMER = '公开统计梳理 · 示意标定 · 非投资建议 · 非预测';

/** 主线四指标的 id（与 HEADLINE_GAUGES 对齐，控制章节一的末值清单顺序） */
const HEADLINE_IDS = ['gdpDeflator', 'coreCpi', 'ppi', 'm1m2'];

// ---------------------------------------------------------------------------
// 小工具（纯函数，确定性）
// ---------------------------------------------------------------------------

/** 格式化带符号百分数：3.6 → '+3.6%'，-2.8 → '-2.8%'，0 → '0%' */
function fmtPct(n, unit = '%') {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '--';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n}${unit}`;
}

/** 取序列末值（最新一期）；空 / 非数组返回 null */
function lastOf(series) {
  return Array.isArray(series) && series.length ? series[series.length - 1] : null;
}

// ---------------------------------------------------------------------------
// 主函数：生成一页 Markdown 全景速读
// ---------------------------------------------------------------------------

/**
 * 生成「中国经济全景速读」一页 Markdown。
 * 章节：一、主线·通缩与资金活化 → 二、三次产业结构 → 三、核心指标异常项 →
 *       四、背离与裂缝 → 五、区域压力 → 六、新动能 → 尾注口径声明。
 * 全程确定性：读数取自各数据层快照，基准日用 REPORT_ASOF 常量。
 * @returns {string} Markdown 文本
 */
export function buildPanoramaReport() {
  const asOf = REPORT_ASOF;
  const gauges = Array.isArray(HEADLINE_GAUGES) ? HEADLINE_GAUGES : [];
  const sectors = Array.isArray(SECTOR_STRUCTURE) ? SECTOR_STRUCTURE : [];
  const indicators = Array.isArray(KEY_INDICATORS) ? KEY_INDICATORS : [];
  const tensions = Array.isArray(TENSIONS) ? TENSIONS : [];
  const regions = Array.isArray(REGIONS) ? REGIONS : [];
  const newEcon = Array.isArray(NEW_ECONOMY) ? NEW_ECONOMY : [];

  const L = [];

  // —— 标题 ——
  L.push(`# 中国经济全景速读（基准 ${asOf}）`);
  L.push('');
  L.push(`> 数据基准：${asOf} · ${DISCLAIMER}`);
  L.push('');

  // —— 一、主线·通缩与资金活化 ——
  L.push('## 一、主线·通缩与资金活化');
  L.push('');
  const mood = typeof deflationMood === 'function'
    ? deflationMood(gauges)
    : { label: '研判暂缺', text: '主线研判暂缺。' };
  L.push(`总判：**${mood.label || '研判'}** —— ${mood.text || ''}`);
  L.push('');
  if (gauges.length) {
    L.push('四主线指标末值：');
    const byId = (id) => gauges.find((g) => g && g.id === id);
    const ordered = [
      ...HEADLINE_IDS.map(byId).filter(Boolean),
      ...gauges.filter((g) => g && !HEADLINE_IDS.includes(g.id)),
    ];
    for (const g of ordered) {
      const last = lastOf(g.series);
      const reading = typeof last === 'number' ? `${fmtPct(last, '')}${g.unit ? ` ${g.unit}` : ''}` : '--';
      L.push(`- **${g.label}**：${reading}${g.sub ? `（${g.sub}）` : ''}`);
    }
    L.push('');
  }

  // —— 二、三次产业结构 ——
  L.push('## 二、三次产业结构');
  L.push('');
  const latest = sectors.length ? sectors[sectors.length - 1] : null;
  if (latest) {
    const estTag = latest.estimated ? '（预估）' : '';
    L.push(
      `${latest.year} 年${estTag}三次产业占比约为 第一产业 ${latest.agri}% / 第二产业 ${latest.ind}% / ` +
      `第三产业 ${latest.srv}%，实际 GDP 增速 ${fmtPct(latest.gdpGrowth)}。`,
    );
    L.push('');
    L.push('服务业占比过半且持续抬升，工业守住出口与就业的承重墙，结构由地产-基建拉动转向服务业与高技术制造。');
  } else {
    L.push('- 三次产业数据缺失。');
  }
  L.push('');

  // —— 三、核心指标异常项（verdict 非 positive）——
  L.push('## 三、核心指标异常项');
  L.push('');
  const flagged = indicators
    .map((ind) => ({ ind, v: typeof indicatorVerdict === 'function' ? indicatorVerdict(ind) : { tone: 'neutral', text: '' } }))
    .filter(({ v }) => v && v.tone !== 'positive');
  if (flagged.length === 0) {
    L.push('- 暂无异常项，主要读数研判为正面或落在合意区间。');
  } else {
    for (const { ind, v } of flagged) {
      const mark = v.tone === 'negative' ? '🔴' : v.tone === 'caution' ? '🟠' : '⚪';
      L.push(`- ${mark} **${ind.label}**：${ind.value}${ind.unit || ''}（同比 ${fmtPct(ind.yoy)}）—— ${v.text}`);
    }
  }
  L.push('');

  // —— 四、背离与裂缝（right ≥ 55 的对）——
  L.push('## 四、背离与裂缝');
  L.push('');
  const wide = tensions.filter((t) => t && typeof t.right === 'number' && t.right >= 55);
  if (wide.length === 0) {
    L.push('- 暂无张力配比偏大（右侧 ≥55）的背离对。');
  } else {
    L.push('右侧（现实端）张力 ≥55 的背离对：');
    for (const t of wide) {
      L.push(`- **${t.a} × ${t.b}**（${t.left}:${t.right}）：${t.gap}。${t.note || ''}`);
    }
  }
  L.push('');

  // —— 五、区域压力（高压省 + redCount）——
  L.push('## 五、区域压力');
  L.push('');
  const ranked = regions
    .filter((r) => r && r.group !== '全国')
    .map((r) => ({ r, tally: typeof regionStressTally === 'function' ? regionStressTally(r) : { level: '稳健', redCount: 0, avg: 0 } }))
    .filter(({ tally }) => tally.level === '高压')
    .sort((x, y) => (y.tally.avg - x.tally.avg) || (y.tally.redCount - x.tally.redCount));
  if (ranked.length === 0) {
    L.push('- 暂无综合研判为「高压」的省域。');
  } else {
    L.push('综合研判为「高压」的省域（按承压均值降序）：');
    for (const { r, tally } of ranked) {
      L.push(`- **${r.name}**（${r.group}）：均值 ${tally.avg} / 100 · 红档 ${tally.redCount} 维 —— ${tally.text}`);
    }
  }
  L.push('');

  // —— 六、新动能（NEW_ECONOMY 前三）——
  L.push('## 六、新动能');
  L.push('');
  const topNew = newEcon.slice(0, 3);
  if (topNew.length === 0) {
    L.push('- 新动能数据缺失。');
  } else {
    for (const item of topNew) {
      L.push(`- **${item.label}**：占比约 ${item.share}% · 增速约 ${fmtPct(item.growth)}。${item.note || ''}`);
    }
  }
  L.push('');

  // —— 尾注口径声明 ——
  L.push('---');
  L.push('');
  L.push(`> ${DISCLAIMER}`);

  return L.join('\n');
}
