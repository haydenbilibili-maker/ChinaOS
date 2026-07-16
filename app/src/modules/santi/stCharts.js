/**
 * 三体透镜 · 深空 ECharts option 构建（零 CDN，复用 app echarts）
 * 标注「示意」的曲线仅为思想实验，非实证预测。
 */

import { CANON, CIV_LEDGERS, STATE_LEDGERS, GOV_LEDGERS, DIMS } from './santiCanon.js';

const ST = {
  signal: '#6b8cae',
  flare: '#c45c26',
  ice: '#7a9e9f',
  metal: '#c5cdd8',
  muted: '#8b95a8',
  line: '#2a3344',
  void: '#0b0e14',
};

const tooltipBase = {
  backgroundColor: 'rgba(11, 14, 20, 0.94)',
  borderColor: 'rgba(107, 140, 174, 0.35)',
  textStyle: { color: ST.metal, fontSize: 12 },
};

/** 光谱卡在 C/N/G/S 上的覆盖计数 → 雷达 */
export function buildDimRadarOption(cards = CANON) {
  const counts = { C: 0, N: 0, G: 0, S: 0 };
  cards.forEach((c) => {
    (c.dims || []).forEach((d) => {
      if (counts[d] != null) counts[d] += 1;
    });
  });
  const max = Math.max(1, ...Object.values(counts));
  return {
    color: [ST.signal],
    tooltip: { ...tooltipBase },
    radar: {
      indicator: DIMS.map((d) => ({ name: `${d.key} ${d.label}`, max })),
      center: ['50%', '55%'],
      radius: '62%',
      axisName: { color: ST.muted, fontSize: 11 },
      splitLine: { lineStyle: { color: ST.line } },
      splitArea: { areaStyle: { color: ['rgba(18,24,38,0.4)', 'rgba(11,14,20,0.6)'] } },
      axisLine: { lineStyle: { color: ST.line } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: DIMS.map((d) => counts[d.key]),
            name: '概念卡覆盖',
            areaStyle: { color: 'rgba(107,140,174,0.22)' },
            lineStyle: { color: ST.signal, width: 2 },
            itemStyle: { color: ST.ice },
          },
        ],
      },
    ],
  };
}

/** 台账三列状态分布（单卡 ledger 摘要） */
export function buildLedgerDistOption(cards = CANON) {
  let realized = 0;
  let open = 0;
  let caution = 0;
  cards.forEach((c) => {
    if (c.maturity === 'index') return;
    if (c.ledger?.realized && c.ledger.realized !== '—') realized += 1;
    if (c.ledger?.open) open += 1;
    if (c.ledger?.caution) caution += 1;
  });
  return {
    color: [ST.ice, ST.signal, ST.flare],
    tooltip: { ...tooltipBase, trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: ST.muted, fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '46%'],
        label: { color: ST.metal, fontSize: 11 },
        data: [
          { name: '已兑现字段', value: realized },
          { name: '未决字段', value: open },
          { name: '慎用字段', value: caution },
        ],
      },
    ],
  };
}

/** 主题台账状态条（CL/NL/GL） */
export function buildThemeLedgerBarOption(ledgers) {
  const map = { realized: 0, in_progress: 0, open: 0 };
  ledgers.forEach((L) => {
    if (map[L.status] != null) map[L.status] += 1;
  });
  return {
    color: [ST.ice, ST.signal, ST.flare],
    tooltip: { ...tooltipBase, trigger: 'axis' },
    grid: { left: 48, right: 16, top: 24, bottom: 28 },
    xAxis: {
      type: 'category',
      data: ['已兑现', '进行中', '未决'],
      axisLabel: { color: ST.muted },
      axisLine: { lineStyle: { color: ST.line } },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: ST.muted },
      splitLine: { lineStyle: { color: ST.line, type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        barWidth: 28,
        data: [
          { value: map.realized, itemStyle: { color: ST.ice } },
          { value: map.in_progress, itemStyle: { color: ST.signal } },
          { value: map.open, itemStyle: { color: ST.flare } },
        ],
      },
    ],
  };
}

/** 公理→黑暗森林→技术爆炸 桑基（示意流量） */
export function buildCausalSankeyOption() {
  return {
    tooltip: { ...tooltipBase },
    series: [
      {
        type: 'sankey',
        emphasis: { focus: 'adjacency' },
        nodeAlign: 'left',
        lineStyle: { color: 'gradient', curveness: 0.45, opacity: 0.35 },
        label: { color: ST.metal, fontSize: 11 },
        data: [
          { name: 'ST-01 公理', itemStyle: { color: ST.signal } },
          { name: 'ST-02 黑暗森林', itemStyle: { color: ST.flare } },
          { name: 'ST-03 技术爆炸', itemStyle: { color: ST.ice } },
          { name: 'ST-04 智子锁死', itemStyle: { color: ST.muted } },
          { name: 'ST-07 水滴', itemStyle: { color: ST.muted } },
        ],
        links: [
          { source: 'ST-01 公理', target: 'ST-02 黑暗森林', value: 8 },
          { source: 'ST-02 黑暗森林', target: 'ST-03 技术爆炸', value: 7 },
          { source: 'ST-03 技术爆炸', target: 'ST-04 智子锁死', value: 3 },
          { source: 'ST-03 技术爆炸', target: 'ST-07 水滴', value: 4 },
        ],
      },
    ],
  };
}

/** 国家竞争链：锁死→面壁→执剑→水滴 */
export function buildStateFlowOption() {
  return {
    tooltip: { ...tooltipBase },
    series: [
      {
        type: 'sankey',
        emphasis: { focus: 'adjacency' },
        nodeAlign: 'justify',
        lineStyle: { color: 'gradient', curveness: 0.4, opacity: 0.4 },
        label: { color: ST.metal, fontSize: 11 },
        data: [
          { name: 'ST-04 锁死', itemStyle: { color: ST.muted } },
          { name: 'ST-05 面壁', itemStyle: { color: ST.signal } },
          { name: 'ST-06 执剑', itemStyle: { color: ST.flare } },
          { name: 'ST-07 水滴', itemStyle: { color: ST.ice } },
        ],
        links: [
          { source: 'ST-04 锁死', target: 'ST-05 面壁', value: 5 },
          { source: 'ST-05 面壁', target: 'ST-06 执剑', value: 6 },
          { source: 'ST-06 执剑', target: 'ST-07 水滴', value: 4 },
          { source: 'ST-04 锁死', target: 'ST-07 水滴', value: 2 },
        ],
      },
    ],
  };
}

/** 技术爆炸曲线（示意 · 思想实验） */
export function buildTechExplosionOption() {
  const t = [];
  const slow = [];
  const burst = [];
  for (let i = 0; i <= 40; i += 1) {
    const x = i / 4;
    t.push(x);
    slow.push(+(1.2 * Math.log1p(x) + 0.3).toFixed(2));
    // 后半段非线性跃迁（示意）
    const jump = x < 6 ? 0.8 * x : 0.8 * 6 + Math.pow(x - 6, 1.85) * 0.55;
    burst.push(+Math.min(12, jump).toFixed(2));
  }
  return {
    color: [ST.muted, ST.flare],
    tooltip: {
      ...tooltipBase,
      trigger: 'axis',
      formatter: (params) => {
        const lines = (params || []).map((p) => `${p.marker}${p.seriesName}: ${p.value}`);
        return `相对时间 ${params?.[0]?.axisValue}<br/>${lines.join('<br/>')}<br/><span style="opacity:.7">示意曲线 · 非预测</span>`;
      },
    },
    legend: {
      top: 4,
      textStyle: { color: ST.muted, fontSize: 11 },
      data: ['渐进扩散（示意）', '技术爆炸窗口（示意）'],
    },
    grid: { left: 44, right: 18, top: 36, bottom: 32 },
    xAxis: {
      type: 'category',
      data: t,
      name: '相对时间',
      nameTextStyle: { color: ST.muted },
      axisLabel: { color: ST.muted, interval: 7 },
      axisLine: { lineStyle: { color: ST.line } },
    },
    yAxis: {
      type: 'value',
      name: '相对能力',
      nameTextStyle: { color: ST.muted },
      axisLabel: { color: ST.muted },
      splitLine: { lineStyle: { color: ST.line, type: 'dashed' } },
    },
    series: [
      {
        name: '渐进扩散（示意）',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: slow,
        lineStyle: { width: 2 },
      },
      {
        name: '技术爆炸窗口（示意）',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: burst,
        lineStyle: { width: 2.4 },
        areaStyle: { color: 'rgba(196,92,38,0.12)' },
      },
    ],
  };
}

/** 动员收益 vs 成本（示意 · ST-23 受控） */
export function buildMobilizationCostOption() {
  const phases = ['常态', '加压', '极限动员', '疲劳期', '合法性回补'];
  return {
    color: [ST.signal, ST.flare],
    tooltip: {
      ...tooltipBase,
      trigger: 'axis',
      formatter: (params) => {
        const lines = (params || []).map((p) => `${p.marker}${p.seriesName}: ${p.value}`);
        return `${params?.[0]?.axisValue}<br/>${lines.join('<br/>')}<br/><span style="opacity:.7">示意 · 强制成本对照，非制度评价</span>`;
      },
    },
    legend: {
      top: 4,
      textStyle: { color: ST.muted, fontSize: 11 },
    },
    grid: { left: 44, right: 18, top: 36, bottom: 32 },
    xAxis: {
      type: 'category',
      data: phases,
      axisLabel: { color: ST.muted, fontSize: 10 },
      axisLine: { lineStyle: { color: ST.line } },
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: { color: ST.muted },
      splitLine: { lineStyle: { color: ST.line, type: 'dashed' } },
    },
    series: [
      {
        name: '短期执行力（示意）',
        type: 'line',
        smooth: true,
        data: [42, 58, 88, 70, 55],
        areaStyle: { color: 'rgba(107,140,174,0.15)' },
      },
      {
        name: '信任/纠错损耗（示意）',
        type: 'line',
        smooth: true,
        data: [18, 32, 62, 78, 68],
        areaStyle: { color: 'rgba(196,92,38,0.12)' },
      },
    ],
  };
}

/** 作品来源分布 */
export function buildWorkDistOption(cards = CANON) {
  const map = {};
  cards.forEach((c) => {
    map[c.work] = (map[c.work] || 0) + 1;
  });
  const entries = Object.entries(map);
  return {
    color: [ST.signal, ST.ice, ST.flare],
    tooltip: { ...tooltipBase, trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['38%', '64%'],
        center: ['50%', '50%'],
        label: { color: ST.metal, fontSize: 11 },
        data: entries.map(([name, value]) => ({ name, value })),
      },
    ],
  };
}

/** 威慑力场：能力×决心×可信度（示意雷达） */
export function buildDeterrenceFieldOption() {
  return {
    color: [ST.flare, ST.signal],
    tooltip: { ...tooltipBase },
    legend: {
      bottom: 0,
      textStyle: { color: ST.muted, fontSize: 11 },
    },
    radar: {
      indicator: [
        { name: '能力', max: 100 },
        { name: '决心信号', max: 100 },
        { name: '可信度', max: 100 },
        { name: '指挥链冗余', max: 100 },
        { name: '误判缓冲', max: 100 },
      ],
      center: ['50%', '48%'],
      radius: '58%',
      axisName: { color: ST.muted, fontSize: 11 },
      splitLine: { lineStyle: { color: ST.line } },
      splitArea: { areaStyle: { color: ['rgba(18,24,38,0.35)', 'rgba(11,14,20,0.55)'] } },
      axisLine: { lineStyle: { color: ST.line } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            name: '小说执剑（示意）',
            value: [95, 92, 70, 25, 20],
            areaStyle: { color: 'rgba(196,92,38,0.18)' },
            lineStyle: { color: ST.flare },
          },
          {
            name: '制度指挥链（示意）',
            value: [80, 65, 85, 88, 78],
            areaStyle: { color: 'rgba(107,140,174,0.18)' },
            lineStyle: { color: ST.signal },
          },
        ],
      },
    ],
  };
}

export function allThemeLedgers() {
  return [...CIV_LEDGERS, ...STATE_LEDGERS, ...GOV_LEDGERS];
}

export { ST };
