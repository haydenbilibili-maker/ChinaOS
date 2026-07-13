import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid, SourceBadge } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, GRID_LINE, LABEL, LEGEND } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { WB_INDICATORS, useWorldBank, wbStat, fmtYoY } from './liveWorldBank.js';
import {
  ECON_AS_OF, SECTOR_STRUCTURE, SECTORS, KEY_INDICATORS, CANARY_SIGNALS,
  INCOME_DIST, NEW_ECONOMY, indicatorVerdict, canaryTally, buildEconReport,
} from './econData.js';
import SectionDeflation from './SectionDeflation.jsx';
import SectionDivergence from './SectionDivergence.jsx';
import SectionCatalog from './SectionCatalog.jsx';
import SectionRegional from './SectionRegional.jsx';
import SectionCompare from './SectionCompare.jsx';
import SectionWatch from './SectionWatch.jsx';
import SectionDiscipline from './SectionDiscipline.jsx';
import SectionCycle from './SectionCycle.jsx';
import SectionFiveYear from './SectionFiveYear.jsx';
import SectionNbsLatest from './SectionNbsLatest.jsx';
import { buildPanoramaReport } from './econReport.js';

// ============================================================================
// 经济大盘 · 全景与实时监测
// ----------------------------------------------------------------------------
// 三层数据合成的经济全景盘：
//   1. NBS 公开口径快照（三次产业 / 核心指标 / 金丝雀 / 收入分配 / 新经济）—— 确定性
//      seed，基准日为常量 ECON_AS_OF，标注「快照」绿/红点；以官方发布为准。
//   2. World Bank WDI 实时长序列（GDP / 人均 GDP / 三产占比 …）—— 浏览器直连，
//      35 年折线，标「实时」绿点。
//   3. 金丝雀 / 领先指标 —— 公开数据派生的领先信号示意。
// 页面只做交互与呈现，所有判定逻辑落在 econData.js 纯函数里。
// 声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================


// —— 涨跌着色：增长型涨绿跌红 ——
function toneOf(v) {
  if (v == null || v === 0) return '#64748b';
  return v > 0 ? '#10b981' : '#c41e3a';
}
const ARROW = (v) => (v == null || v === 0 ? '→' : v > 0 ? '↑' : '↓');

// —— 核心指标筛选组 ——
const INDICATOR_GROUPS = [
  { key: 'all', label: '全部', accent: '#64748b' },
  { key: 'price', label: '物价', accent: '#c41e3a' },
  { key: 'climate', label: '景气', accent: '#22d3ee' },
  { key: 'employ', label: '就业', accent: '#e8a317' },
  { key: 'money', label: '货币', accent: '#8b5cf6' },
  { key: 'demand', label: '需求', accent: '#10b981' },
];

export default function Page({ embedded = false }) {
  const wb = useWorldBank(); // { data, loading, fetchedAt }
  const [group, setGroup] = useState('all');
  const [wbKey, setWbKey] = useState(WB_INDICATORS?.[0]?.key);
  const [reportMd, setReportMd] = useState('');
  const [copied, setCopied] = useState(false);

  // —— 顶部四 Stat：实时 GDP / 人均 GDP / 第三产业占比 / 基准日 ——
  const wbData = wb.data || {};
  const gdpLatest = wbData.gdp?.latest || null;
  const gdpPcLatest = wbData.gdpPerCap?.latest || null;
  const gdpYoY = useMemo(() => fmtYoY(wbData.gdp?.series), [wbData.gdp?.series]);
  const gdpTrend = useMemo(() => {
    if (!gdpYoY) return null;
    return gdpYoY.startsWith('-') ? 'down' : 'up';
  }, [gdpYoY]);

  // 第三产业最新占比（NBS 快照）：SECTOR_STRUCTURE 末年第三产业值
  const tertiaryLatest = useMemo(() => {
    if (!SECTOR_STRUCTURE?.length) return null;
    const last = SECTOR_STRUCTURE[SECTOR_STRUCTURE.length - 1];
    return last?.srv ?? null;
  }, []);

  // —— ① 三次产业 donut（最新年三产占比）——
  const donutOption = useMemo(() => {
    if (!SECTOR_STRUCTURE?.length) return null;
    const last = SECTOR_STRUCTURE[SECTOR_STRUCTURE.length - 1];
    const data = SECTORS.map((s) => ({
      name: s.label,
      value: last?.[s.id] ?? 0,
      itemStyle: { color: s.color },
    }));
    return {
      tooltip: { trigger: 'item', formatter: '{b}<br/>占比 {c}% ({d}%)' },
      legend: { bottom: 0, textStyle: { ...LEGEND.textStyle, fontSize: 11 }, data: SECTORS.map((s) => s.label) },
      series: [{
        type: 'pie',
        radius: ['46%', '70%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: 'var(--bg-surface)', borderWidth: 2 },
        label: { ...LABEL, fontSize: 11, formatter: '{b}\n{c}%' },
        labelLine: { length: 8, length2: 8 },
        data,
      }],
    };
  }, []);

  // —— ① 占比演变堆叠面积 + GDP 增速副线（近 8 年）——
  const evolveOption = useMemo(() => {
    if (!SECTOR_STRUCTURE?.length) return null;
    const rows = SECTOR_STRUCTURE.slice(-8);
    const years = rows.map((r) => String(r.year));
    const mkArea = (s) => ({
      name: s.label,
      type: 'line',
      stack: 'sector',
      areaStyle: { color: s.color, opacity: 0.55 },
      lineStyle: { width: 1, color: s.color },
      symbol: 'none',
      emphasis: { focus: 'series' },
      data: rows.map((r) => r[s.id] ?? null),
    });
    const series = SECTORS.map(mkArea);
    const hasGrowth = rows.some((r) => r.gdpGrowth != null);
    if (hasGrowth) {
      series.push({
        name: 'GDP 增速',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { width: 2, color: '#e8a317' },
        itemStyle: { color: '#e8a317' },
        data: rows.map((r) => r.gdpGrowth ?? null),
      });
    }
    return {
      legend: { top: 0, textStyle: { ...LEGEND.textStyle, fontSize: 11 }, data: [...SECTORS.map((s) => s.label), ...(hasGrowth ? ['GDP 增速'] : [])] },
      grid: { left: 44, right: 48, top: 32, bottom: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category', data: years, boundaryGap: false,
        axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 11 }, axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value', name: '占比 %', max: 100, nameTextStyle: { ...LABEL, fontSize: 10 },
          axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE,
        },
        {
          type: 'value', name: '增速 %', nameTextStyle: { ...LABEL, fontSize: 10 },
          axisLine: AXIS, axisLabel: LABEL, splitLine: { show: false }, scale: true,
        },
      ],
      series,
    };
  }, []);

  // —— ① 三卡：label + desc + 最新占比 + 较上年 Δ ——
  const sectorCards = useMemo(() => {
    if (!SECTOR_STRUCTURE?.length) return [];
    const n = SECTOR_STRUCTURE.length;
    const last = SECTOR_STRUCTURE[n - 1];
    const prev = n >= 2 ? SECTOR_STRUCTURE[n - 2] : null;
    return SECTORS.map((s) => {
      const cur = last?.[s.id] ?? null;
      const before = prev?.[s.id] ?? null;
      const delta = cur != null && before != null ? Math.round((cur - before) * 100) / 100 : null;
      return { ...s, cur, delta };
    });
  }, []);

  // —— ② 核心指标筛选 ——
  const indicators = useMemo(() => {
    const list = KEY_INDICATORS || [];
    return group === 'all' ? list : list.filter((k) => k.group === group);
  }, [group]);

  // —— ③ World Bank 选中指标 ——
  const wbDef = useMemo(() => (WB_INDICATORS || []).find((d) => d.key === wbKey) || null, [wbKey]);
  const wbSeries = wbKey ? wbData[wbKey] : null;

  const wbLineOption = useMemo(() => {
    const series = wbSeries?.series || [];
    if (!series.length) return null;
    const years = series.map((p) => String(p.year));
    const vals = series.map((p) => p.value);
    const last = series[series.length - 1];
    const kind = wbDef?.kind || 'pct';
    // 大数轴标紧凑化：万亿/亿/万；百分比/指数直接显示
    const axisFmt = (v) => {
      const n = Math.abs(v);
      if (kind === 'money') {
        if (n >= 1e12) return `${(v / 1e12).toFixed(1)}万亿`;
        if (n >= 1e8) return `${(v / 1e8).toFixed(0)}亿`;
        if (n >= 1e4) return `${(v / 1e4).toFixed(0)}万`;
        return String(Math.round(v));
      }
      if (kind === 'pct') return `${(+v).toFixed(0)}%`;
      return (+v).toFixed(v < 10 ? 1 : 0);
    };
    const tipUnit = kind === 'money' ? wbStat(last?.value, 'money').replace(/[\d.,]+/g, '').trim() : (wbDef?.unit || '');
    return {
      grid: { left: 58, right: 24, top: 24, bottom: 28 },
      tooltip: {
        trigger: 'axis',
        formatter: (ps) => {
          const p = ps[0];
          return `${p.axisValue}<br/>${wbDef?.label || ''} ${kind === 'money' ? wbStat(p.data, 'money') : axisFmt(p.data) + (kind === 'pct' ? '' : ` ${wbDef?.unit || ''}`)}`;
        },
      },
      xAxis: {
        type: 'category', data: years, boundaryGap: false,
        axisLine: AXIS,
        axisLabel: { ...LABEL, interval: Math.max(0, Math.floor(years.length / 8)) },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value', scale: true, nameTextStyle: { ...LABEL, fontSize: 10 },
        axisLine: AXIS,
        axisLabel: { ...LABEL, formatter: axisFmt },
        splitLine: GRID_LINE,
      },
      series: [{
        type: 'line', data: vals, smooth: true, symbol: 'none',
        lineStyle: { width: 2, color: '#22d3ee' },
        areaStyle: { color: 'rgba(34,211,238,0.12)' },
        markPoint: last ? {
          symbol: 'circle', symbolSize: 8,
          itemStyle: { color: '#22d3ee' },
          label: { color: '#e6edf6', fontSize: 10, formatter: '最新' },
          data: [{ coord: [String(last.year), last.value] }],
        } : undefined,
      }],
    };
  }, [wbSeries, wbDef]);

  // —— ④ 金丝雀统计 ——
  const tally = useMemo(() => canaryTally(CANARY_SIGNALS || []), []);
  const LIGHT = {
    green: { c: '#10b981', t: '正常' },
    amber: { c: '#e8a317', t: '警示' },
    red: { c: '#c41e3a', t: '告警' },
  };

  // —— ⑤ 基尼系数折线（近 10 年）——
  const giniOption = useMemo(() => {
    const rows = (INCOME_DIST?.giniSeries || []).slice(-10);
    if (!rows.length) return null;
    return {
      grid: { left: 48, right: 20, top: 20, bottom: 28 },
      tooltip: { trigger: 'axis', formatter: (p) => `${p[0].axisValue}<br/>基尼系数 ${p[0].data}` },
      xAxis: {
        type: 'category', data: rows.map((r) => String(r.year)), boundaryGap: false,
        axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 11 }, axisTick: { show: false },
      },
      yAxis: {
        type: 'value', scale: true,
        axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE,
      },
      series: [{
        type: 'line', data: rows.map((r) => r.value), smooth: true, symbol: 'circle', symbolSize: 5,
        lineStyle: { width: 2, color: '#c41e3a' }, itemStyle: { color: '#c41e3a' },
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { type: 'dashed', color: '#e8a317', opacity: 0.6 },
          label: { color: '#e8a317', fontSize: 10, formatter: '国际警戒 0.4' },
          data: [{ yAxis: 0.4 }],
        },
      }],
    };
  }, []);

  // —— ⑤ 新经济横向 bar（share + growth 双指标）——
  const newEcoOption = useMemo(() => {
    const rows = NEW_ECONOMY || [];
    if (!rows.length) return null;
    const names = rows.map((r) => r.label);
    return {
      legend: { top: 0, textStyle: { ...LEGEND.textStyle, fontSize: 11 }, data: ['占 GDP 比重 %', '同比增速 %'] },
      grid: { left: 92, right: 28, top: 30, bottom: 20 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'value', axisLine: AXIS, axisLabel: LABEL,
        splitLine: GRID_LINE,
      },
      yAxis: {
        type: 'category', data: names, inverse: true,
        axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 11 }, axisTick: { show: false },
      },
      series: [
        { name: '占 GDP 比重 %', type: 'bar', data: rows.map((r) => r.share), itemStyle: { color: '#22d3ee' }, barGap: 0, barWidth: 9 },
        { name: '同比增速 %', type: 'bar', data: rows.map((r) => r.growth), itemStyle: { color: '#e8a317' }, barWidth: 9 },
      ],
    };
  }, []);

  // —— ⑥ 报告 ——
  const genReport = () => {
    try { setReportMd(buildPanoramaReport()); }
    catch { setReportMd(buildEconReport({ wb: wbData, asOf: ECON_AS_OF })); }
  };
  const copyReport = () => {
    navigator.clipboard?.writeText(reportMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const BTN = {
    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer',
  };
  const BTN_CYAN = { ...BTN, background: 'var(--btn-primary-bg)', border: '1px solid var(--accent-border)', color: 'var(--cyber-cyan)', fontWeight: 600 };

  return (
    <div>
      {!embedded && (
        <PageHeader
          badge="Dashboard · 经济发展与监测大盘"
          title="经济大盘 · 全景与实时监测"
          subtitle="把官方口径快照、世界银行实时长序列和领先指标合成一张盘——十五五开局 2026 H1 读数、结构的变迁、过热与转冷的早信号，都在一屏里。"
        />
      )}
      <IntroCard>
        本页以三层数据合成经济全景：国家统计局公开口径快照（标注基准日，以官方发布为准）、
        世界银行 WDI 实时长序列（直连取数、35 年序列）、以及公开数据派生的领先指标示意。
        三次产业结构看「经济在做什么」，核心指标盘看「当下的体温」，金丝雀监测盘看「转折的早信号」，
        收入分配与新经济看「增长落到谁身上、新动能在哪里」。
        口径声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
      </IntroCard>
      <StatGrid className="mb-8">
        <Stat
          value={wb.loading && !gdpLatest ? '载入中' : (gdpLatest ? wbStat(gdpLatest.value, 'money') : '—')}
          label="实时 GDP（World Bank · 现价美元）"
          accent="var(--china-red)"
          trend={gdpTrend || undefined}
          trendValue={gdpYoY || undefined}
        />
        <Stat
          value={wb.loading && !gdpPcLatest ? '载入中' : (gdpPcLatest ? wbStat(gdpPcLatest.value, 'money') : '—')}
          label="人均 GDP（World Bank · 现价美元）"
          accent="var(--cyber-cyan)"
        />
        <Stat
          value={tertiaryLatest != null ? `${tertiaryLatest}%` : '—'}
          label="第三产业占比（NBS 快照）"
          accent="var(--fire-gold)"
        />
        <Stat value={ECON_AS_OF} label="快照基准日" accent="var(--status-positive)" />
      </StatGrid>

      {/* 00 当前主线 · 通缩与资金活化 */}
      <div className="mb-6"><SectionDeflation /></div>

      {/* ! 经济异动监测 · 全盘聚合 */}
      <div className="mb-6"><SectionWatch /></div>

      {/* ① 三次产业结构 */}
      <Card title="① 三次产业结构 · 经济在做什么">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            从「以农立国」到工业化、再到服务业过半——三产占比的此消彼长，是一国经济阶段最直白的体检表。
          </p>
          <SourceBadge live={false} asOf={ECON_AS_OF} />
        </div>
        <Grid cols={2} gap="1.25rem">
          <div className="min-w-0">
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>最新年三产占比</div>
            {donutOption ? <EChart option={donutOption} style={{ height: 300 }} /> : <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 数据待载</p>}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>占比演变（近 8 年）+ GDP 增速副线</div>
            {evolveOption ? <EChart option={evolveOption} style={{ height: 300 }} /> : <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 数据待载</p>}
          </div>
        </Grid>
        <Grid cols={3} gap="0.75rem" className="mt-4">
          {sectorCards.map((s) => (
            <div key={s.id} className="os-card p-3" style={{ borderLeft: `3px solid ${s.color}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: s.color }}>{s.label}</div>
              <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{s.desc}</p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="mono text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{s.cur != null ? `${s.cur}%` : '—'}</span>
                {s.delta != null && (
                  <span className="mono text-xs font-semibold" style={{ color: toneOf(s.delta) }}>
                    {ARROW(s.delta)} {s.delta > 0 ? '+' : ''}{s.delta}pct
                  </span>
                )}
                <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>较上年</span>
              </div>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ② 核心指标盘 */}
      <Card title="② 核心指标盘 · 当下的体温">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <SelectorBar
            items={INDICATOR_GROUPS}
            activeKey={group}
            onSelect={setGroup}
          />
          <SourceBadge live={false} asOf={ECON_AS_OF} />
        </div>
        <Grid cols={3} gap="0.75rem">
          {indicators.map((k) => {
            const verdict = indicatorVerdict ? indicatorVerdict(k) : null;
            const vTone = verdict?.tone || '#64748b';
            const isPmi = /pmi|景气|荣枯/i.test(`${k.id}${k.label}`) || k.threshold === 50;
            return (
              <div key={k.id} className="os-card p-3" style={{ borderLeft: `3px solid ${vTone}` }}>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{k.label}</span>
                  {verdict?.label && (
                    <span
                      className="text-[10px] mono px-1.5 py-0.5 rounded"
                      style={{ background: `${vTone}1f`, color: vTone, border: `1px solid ${vTone}45` }}
                    >{verdict.label}</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="mono text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{k.value}</span>
                  {k.unit && <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{k.unit}</span>}
                  <span className="mono text-sm ml-1" style={{ color: toneOf(k.trend ?? k.yoy) }}>{ARROW(k.trend ?? k.yoy)}</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {k.yoy != null && (
                    <span className="text-[11px] mono" style={{ color: toneOf(k.yoy) }}>
                      同比 {fmtYoY ? fmtYoY(k.yoy) : `${k.yoy > 0 ? '+' : ''}${k.yoy}%`}
                    </span>
                  )}
                  {k.mom != null && (
                    <span className="text-[11px] mono" style={{ color: toneOf(k.mom) }}>
                      环比 {k.mom > 0 ? '+' : ''}{k.mom}%
                    </span>
                  )}
                  {isPmi && (
                    <span className="text-[10px] mono" style={{ color: (k.value >= 50 ? '#10b981' : '#c41e3a') }}>
                      荣枯线 50 {k.value >= 50 ? '上方·扩张' : '下方·收缩'}
                    </span>
                  )}
                </div>
                {verdict?.note && (
                  <p className="text-[11px] leading-relaxed mt-1.5" style={{ color: 'var(--text-tertiary)' }}>{verdict.note}</p>
                )}
              </div>
            );
          })}
          {!indicators.length && <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 该组暂无指标</p>}
        </Grid>
        <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
          // 同比/环比涨绿跌红；PMI 类标注荣枯线 50；徽章为研判 tone 着色 —— 均以官方发布为准
        </p>
      </Card>

      {/* ③ 世界银行长序列 */}
      <Card title="③ 世界银行长序列 · 三十五年的来路">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            浏览器直连 World Bank WDI 实时取数，看长周期里的趋势线——短期噪声退场，结构变迁显形。
          </p>
          <SourceBadge live asOf={ECON_AS_OF} />
        </div>
        <SelectorBar
          items={WB_INDICATORS || []}
          activeKey={wbKey}
          onSelect={setWbKey}
        />
        <Grid cols={2} gap="1.25rem">
          <div className="min-w-0" style={{ gridColumn: 'span 1' }}>
            {wb.loading && !wbSeries?.series?.length ? (
              <div className="os-skeleton" style={{ height: 300, borderRadius: 8 }} aria-hidden="true" />
            ) : wbSeries?.error ? (
              <div className="rounded-lg p-5 text-sm" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.3)', color: 'var(--text-tertiary)' }}>
                <span className="mono" style={{ color: '#c41e3a' }}>// 实时取数失败</span> —— {String(wbSeries.error)}；该指标暂以降级态呈现，可稍后重试。
              </div>
            ) : wbLineOption ? (
              <EChart option={wbLineOption} style={{ height: 300 }} />
            ) : (
              <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 暂无序列数据</p>
            )}
          </div>
          <div className="min-w-0 flex flex-col gap-3">
            <div className="os-card p-4" style={{ borderLeft: '3px solid #22d3ee' }}>
              <div className="text-xs mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{wbDef?.label || '—'} · 最新值</div>
              <div className="mono text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {wbSeries?.latest ? wbStat(wbSeries.latest.value, wbDef?.kind || 'pct') : (wb.loading ? '载入中' : '—')}
              </div>
              {wbSeries?.latest?.year && (
                <div className="text-[11px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>数据年份 {wbSeries.latest.year}</div>
              )}
              <div className="mt-2">
                <SourceBadge live asOf={ECON_AS_OF} />
              </div>
            </div>
            {wbDef?.note && (
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{wbDef.note}</p>
            )}
            <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
              数据源：{wbSeries?.source || 'World Bank · WDI'}
            </p>
          </div>
        </Grid>
      </Card>

      {/* ⊞ 国家统计局最新数据 · 2025/2026 */}
      <div className="mb-6"><SectionNbsLatest /></div>

      {/* ◆ 国际对比 · 世界银行实时多国 */}
      <div className="mb-6"><SectionCompare /></div>

      {/* ④ 金丝雀监测盘 */}
      <Card title="④ 金丝雀监测盘 · 转折的早信号">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            领先指标是矿井里的金丝雀——它先于官方数据感知冷暖。下列读数为公开数据派生的领先信号示意。
          </p>
          <SourceBadge live={false} asOf={ECON_AS_OF} />
        </div>
        <div className="rounded-lg p-4 mb-4 flex items-center gap-5 flex-wrap" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          {(['green', 'amber', 'red']).map((k) => (
            <div key={k} className="flex items-center gap-2">
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: LIGHT[k].c, display: 'inline-block', boxShadow: `0 0 8px ${LIGHT[k].c}88` }} />
              <span className="mono text-lg font-bold" style={{ color: LIGHT[k].c }}>{tally?.[k] ?? 0}</span>
              <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{LIGHT[k].t}</span>
            </div>
          ))}
          {tally?.mood && (
            <span className="text-sm font-semibold ml-auto" style={{ color: 'var(--text-secondary)' }}>{tally.mood}</span>
          )}
        </div>
        <Grid cols={3} gap="0.75rem">
          {(CANARY_SIGNALS || []).map((c) => {
            const light = LIGHT[c.signal] || LIGHT.green;
            return (
              <div key={c.id} className="os-card p-3" style={{ borderLeft: `3px solid ${light.c}` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: light.c, display: 'inline-block', boxShadow: `0 0 6px ${light.c}88` }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.label}</span>
                </div>
                <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>代理变量：{c.proxy}</div>
                <div className="mono text-base font-bold mb-1" style={{ color: light.c }}>{c.reading}</div>
                <p className="text-[11px] leading-relaxed mb-1" style={{ color: 'var(--text-tertiary)' }}>{c.lead}</p>
                {c.source && <div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>来源：{c.source}</div>}
              </div>
            );
          })}
        </Grid>
        <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
          // 信号灯仅为领先信号示意，非官方景气判断 —— 公开数据派生 · 非预测
        </p>
      </Card>

      {/* 01–10 共享宏观骨架 · 指标目录 */}
      <div className="mb-6"><SectionCatalog /></div>

      {/* ★ 背离监测 · 叙事×现实 */}
      <div className="mb-6"><SectionDivergence /></div>

      {/* ▲ 区域下钻 · 投资环境压力 */}
      <div className="mb-6"><SectionRegional /></div>

      {/* ⑤ 收入分配与新经济 */}
      <Card title="⑤ 收入分配与新经济 · 增长落到谁身上">
        <Grid cols={2} gap="1.25rem">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>基尼系数（近 10 年）</span>
              <SourceBadge live={false} asOf={ECON_AS_OF} />
            </div>
            {giniOption ? <EChart option={giniOption} style={{ height: 240 }} /> : <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 数据待载</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              {INCOME_DIST?.urbanRuralRatio != null && (
                <span className="text-[11px] mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  城乡收入比 <b style={{ color: '#c41e3a' }}>{INCOME_DIST.urbanRuralRatio}</b>
                </span>
              )}
              {INCOME_DIST?.quintileRatio != null && (
                <span className="text-[11px] mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  五分位倍差 <b style={{ color: '#e8a317' }}>{INCOME_DIST.quintileRatio}</b>
                </span>
              )}
              {INCOME_DIST?.incomeGrowth != null && (
                <span className="text-[11px] mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  居民收入增速 <b style={{ color: toneOf(INCOME_DIST.incomeGrowth) }}>{INCOME_DIST.incomeGrowth > 0 ? '+' : ''}{INCOME_DIST.incomeGrowth}%</b>
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>新经济动能 · 占比 × 增速</span>
              <SourceBadge live={false} asOf={ECON_AS_OF} />
            </div>
            {newEcoOption ? <EChart option={newEcoOption} style={{ height: 280 }} /> : <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 数据待载</p>}
            <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
              // 占比看体量，增速看动能——高增速低占比的，是下一程的引擎
            </p>
          </div>
        </Grid>
      </Card>

      {/* ⑥ 经济速读报告 */}
      <Card title="⑥ 经济速读报告 · 一页 Markdown">
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
          汇总实时 GDP/人均、三次产业结构、核心指标研判与金丝雀信号灯，生成确定性速读报告。
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" style={BTN_CYAN} onClick={genReport}>📄 生成经济速读</button>
          {reportMd && (
            <button type="button" style={copied ? { ...BTN, color: '#10b981' } : BTN} onClick={copyReport}>
              {copied ? '已复制 ✓' : '复制 Markdown'}
            </button>
          )}
        </div>
        {reportMd && (
          <pre
            className="text-[11px] leading-relaxed p-4 rounded mt-3 mono overflow-auto"
            style={{
              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)', maxHeight: 420, whiteSpace: 'pre-wrap',
            }}
          >{reportMd}</pre>
        )}
      </Card>

      {/* ↻ 历史周期对照 */}
      <div className="mb-6"><SectionCycle /></div>

      {/* ◷ 五年规划目标达成度 */}
      <div className="mb-6"><SectionFiveYear /></div>

      {/* ⌗ 经济数据底座 · 已迁移至 数据与系统 · 数据底座 */}
      <div className="mb-6">
        <a
          href="#/foundation?tab=econ"
          className="os-card p-5 block no-underline"
          style={{ borderLeft: '3px solid #e8a317' }}
        >
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            ⌗ 经济数据底座 · 已迁移 →
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            经济序列的上传 / 解析 / 编辑 / 多序列对比 / 导出 等完整数据管理能力，
            已迁入「数据与系统 · 数据底座」的「经济数据」标签，与全站本地库统一管理。
            <span style={{ color: '#e8a317' }}> 点此前往 →</span>
          </div>
        </a>
      </div>

      {/* § 数据使用纪律 */}
      <div className="mb-6"><SectionDiscipline /></div>

      {/* 框架三卡 + 页脚 */}
      <FrameworkTrio cards={[
        {
          title: '统计的政治学', subtitle: '口径即立场 · 度量即权力', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '一个经济体被怎么测量，决定了它被怎么治理。GDP 把什么算进来、什么留在外面，CPI 篮子放哪些商品、权重几何——口径不是技术细节，是政治选择。数据先于政策，统计制度本身就是一项基础设施。',
          pillars: [['口径', '算什么即重视什么。'], ['权重', '篮子决定通胀感受。'], ['发布', '节奏与披露是治理动作。']],
        },
        {
          title: '指标的领先与滞后', subtitle: '体温计 · 后视镜 · 金丝雀', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: 'GDP 是后视镜——确认已经发生的事；PMI、用电量、货运量是体温计——同步感知当下；信贷脉冲、票据利率、招聘指数是金丝雀——先于官方数据感知转折。读经济不是读一个数，是读一组指标的时间错位。',
          pillars: [['滞后', 'GDP 确认过去。'], ['同步', '景气量度当下。'], ['领先', '金丝雀预告拐点。']],
        },
        {
          title: '全景的盲区', subtitle: '看得见的与漏掉的', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '再全的大盘也有盲区：均值掩盖分布，总量遮蔽结构，存量数据看不见资产负债表的隐性裂缝。基尼系数、城乡比、债务-收入比这些「分布与结构」指标，常常比总量更早预告麻烦。看全景的同时，要盯住它没照亮的角落。',
          pillars: [['分布', '均值之下有裂缝。'], ['结构', '总量之内有失衡。'], ['隐性', '表外即下一处风险。']],
        },
      ]} />
      {!embedded && (
        <ModuleFooter
          moduleId="econdash"
          links={[
            { to: '/finance-system', label: '金融系统 · 系统风险', note: '增长账单的另一面：杠杆、宏观审慎与金融安全。' },
            { to: '/manufacturing', label: '制造强国 · GVC 位势', note: '第二产业的硬核：规模优势与转型升级的产业锚点。' },
            { to: '/demographic', label: '人口结构 · 负增长', note: '增长的人口底盘：抚养比、老龄化与内需纵深。' },
          ]}
          disclaimer="公开统计梳理 · 示意标定 · 非投资建议 · 非预测"
          sourceNote="数据源：国家统计局公开口径快照 · 世界银行 WDI 实时 · 领先指标为公开数据派生示意"
        />
      )}
    </div>
  );
}
