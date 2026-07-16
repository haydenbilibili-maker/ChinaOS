import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Stat, StatGrid, SourceBadge, EmptyState } from '../../../app/ui.jsx';
import EChart from '../../../lib/viz/EChart.jsx';
import {
  AXIS, LABEL, LEGEND, GRID, GRID_WIDE, CHART_TOOLTIP, CHART_SERIES_COLORS,
  categoryX, valueY,
} from '../../shared/chartHelpers.js';
import { SelectorBar } from '../../shared/ModuleParadigm.jsx';
import { WB_INDICATORS, wbStat } from '../liveWorldBank.js';
import { useWBCompare, COMPARE_COUNTRIES, DEFAULT_ISOS } from '../liveWBCompare.js';
import { ECON_AS_OF, econTabPath } from '../econData.js';
import {
  REPORT_META,
  EXECUTIVE_SUMMARY,
  OUTLOOK_SUMMARY,
  TABLE1,
  KEY_READINGS,
  SECTIONS,
  BOXES,
  DISCLAIMER,
} from '../../wbCeReport/ceuReportData.js';

// ============================================================================
// 经济大盘 · 世行经济简报 Tab（CEU 全文要点 + 多图台账 + WDI 长序列交叉验证）
// 图表数字均来自 ceuReportData（CEU 2026-07）或浏览器直连 WDI；缺序列不画假数。
// ============================================================================

const C = CHART_SERIES_COLORS;

const SUB_TABS = [
  { id: 'overview', label: '概述与多图' },
  { id: 'recent', label: '近期形势' },
  { id: 'outlook', label: '前景政策' },
  { id: 'special', label: '低碳专题' },
  { id: 'data', label: '指标表' },
  { id: 'wdi', label: 'WDI 长序列' },
];

const WB_FOCUS_KEYS = ['gdpGrowth', 'cpi', 'gdp', 'gdpPerCap', 'agri', 'ind', 'srv', 'manuf', 'urban', 'fdi'];

/** CEU 风险台账 · 示意标定（非世行官方评级） */
const RISK_LEDGER = [
  { name: '能源冲击再波动', status: 2, note: '全球供应扰动推高成本；储备与限价缓释但不确定性仍在。' },
  { name: '地产超预期下滑', status: 2, note: '相关投资 −16.2%；白名单缓交付，去化约 30 个月。' },
  { name: '消费再平衡偏慢', status: 2, note: '预防性储蓄 32.4%；社保占 GDP ~11%，低于 OECD。' },
  { name: '外需随全球放缓', status: 2, note: '基线出口回落；高科技出口仍是缓冲。' },
  { name: '补充预算上行', status: 1, note: '上行风险：财政脉冲与 AI 投资超预期。' },
  { name: '2026 增速 4.4% 基线', status: 3, note: 'CEU 基线已发布；正式引用以 PDF 为准。' },
];

function SourceLine({ children }) {
  return <p className="text-[10px] mono mt-2 m-0" style={{ color: 'var(--text-tertiary)' }}>{children}</p>;
}

function ChartNote({ children }) {
  return (
    <p className="text-xs leading-relaxed mt-2 m-0" style={{ color: 'var(--text-secondary)' }}>{children}</p>
  );
}

function tableSection(title) {
  return TABLE1.sections.find((s) => s.title.includes(title) || s.title === title);
}

function rowByLabel(sec, label) {
  if (!sec) return null;
  return sec.rows.find((r) => r.label.replace(/　/g, '').includes(label.replace(/　/g, '')) || r.label === label);
}

function lineOpt({ years, series, yName = '%' }) {
  return {
    grid: { ...GRID_WIDE, bottom: 40 },
    legend: { ...LEGEND, bottom: 0 },
    tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '—' : `${v}`), ...CHART_TOOLTIP },
    xAxis: categoryX(years),
    yAxis: valueY({ name: yName, axisLabel: { formatter: '{value}' } }),
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      data: s.data,
      lineStyle: { width: 2, color: s.color },
      itemStyle: { color: s.color },
    })),
  };
}

function barGroupOpt({ years, series }) {
  return {
    grid: { ...GRID, bottom: 40, left: 48 },
    legend: { ...LEGEND, bottom: 0 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...CHART_TOOLTIP },
    xAxis: categoryX(years),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: series.map((s) => ({
      name: s.name,
      type: 'bar',
      barMaxWidth: 14,
      data: s.data,
      itemStyle: { color: s.color, borderRadius: [2, 2, 0, 0] },
    })),
  };
}

function ForecastChart({ rows, years }) {
  const option = useMemo(
    () => lineOpt({
      years,
      series: rows.map((r) => ({ name: r.label, data: r.values, color: r.accent })),
    }),
    [rows, years],
  );
  return <EChart option={option} style={{ height: 300 }} loading={false} />;
}

function DataTable({ sections, years }) {
  return (
    <div className="space-y-4">
      {sections.map((sec) => (
        <div key={sec.title} style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
          <div className="mono text-xs px-3 py-2" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
            {sec.title}
          </div>
          {sec.rows.map((row, ri) => (
            <div
              key={row.label}
              style={{
                display: 'grid',
                gridTemplateColumns: `minmax(140px, 1.6fr) repeat(${years.length}, 1fr)`,
                borderTop: ri ? '1px solid var(--border-subtle)' : 'none',
                fontSize: 12,
                fontWeight: row.bold ? 600 : 400,
              }}
            >
              <div style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{row.label}</div>
              {row.values.map((v, vi) => (
                <div
                  key={vi}
                  className="mono"
                  style={{
                    padding: '8px 10px',
                    textAlign: 'right',
                    color: years[vi]?.includes('f') ? '#22d3ee' : 'var(--text-primary)',
                    borderLeft: '1px solid var(--border-subtle)',
                  }}
                >
                  {typeof v === 'number' ? v.toFixed(1) : v}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SectionProse({ section }) {
  if (!section) return null;
  return (
    <div className="space-y-5">
      {section.subsections.map((sub) => (
        <div key={sub.title}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: section.accent }}>{sub.title}</h3>
          <div className="space-y-2">
            {sub.bullets.map((b, i) => (
              <p key={i} className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{b}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function wdiSeriesOpt(series, color, kind) {
  if (!series?.length) return null;
  const years = series.map((p) => String(p.year));
  const vals = series.map((p) => p.value);
  return {
    grid: { ...GRID, bottom: 28, left: 52 },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const p = params?.[0];
        if (!p) return '';
        return `${p.axisValue}<br/>${kind === 'money' ? wbStat(p.data, 'money') : `${p.data}${kind === 'pct' ? '%' : ''}`}`;
      },
      ...CHART_TOOLTIP,
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
      axisLabel: { color: LABEL.color, fontSize: 10, interval: 4 },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } },
      axisLabel: {
        color: LABEL.color,
        fontSize: 10,
        formatter: (v) => (kind === 'money' ? wbStat(v, 'money') : v),
      },
    },
    series: [{
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      data: vals,
      lineStyle: { width: 2, color },
      itemStyle: { color },
      areaStyle: { color: `${color}14` },
    }],
  };
}

export default function WorldBankTab({ wb }) {
  const [subTab, setSubTab] = useState('overview');
  const [wbKey, setWbKey] = useState('gdpGrowth');

  const wbData = wb?.data || {};
  const wbIndicators = useMemo(
    () => (WB_INDICATORS || []).filter((d) => WB_FOCUS_KEYS.includes(d.key)),
    [],
  );
  const wbDef = useMemo(
    () => (WB_INDICATORS || []).find((d) => d.key === wbKey) || null,
    [wbKey],
  );
  const wbSeries = wbKey ? wbData[wbKey] : null;

  const compare = useWBCompare('gdpGrowth', DEFAULT_ISOS);

  const demandSec = useMemo(() => tableSection('不变市场价格'), []);
  const sectorSec = useMemo(() => tableSection('不变要素价格'), []);
  const balanceSec = useMemo(() => tableSection('宏观平衡'), []);
  const years = TABLE1.years;

  // ① 需求侧分项增速（CEU 表 1）
  const demandOpt = useMemo(() => {
    const keys = [
      { label: '居民消费', color: C.cyberCyan },
      { label: '固定资本形成总额', color: C.fireGold },
      { label: '货物和服务出口', color: C.powerRed },
      { label: '货物和服务进口', color: C.emerald },
    ];
    const series = keys.map(({ label, color }) => {
      const row = rowByLabel(demandSec, label);
      return row ? { name: label, data: row.values, color } : null;
    }).filter(Boolean);
    if (!series.length) return null;
    return barGroupOpt({ years, series });
  }, [demandSec, years]);

  // ② 三次产业增速
  const sectorOpt = useMemo(() => {
    const keys = [
      { label: '农业', color: C.emerald },
      { label: '工业', color: C.fireGold },
      { label: '服务业', color: C.cyberCyan },
    ];
    const series = keys.map(({ label, color }) => {
      const row = rowByLabel(sectorSec, label);
      return row ? { name: label, data: row.values, color } : null;
    }).filter(Boolean);
    if (!series.length) return null;
    return lineOpt({ years, series });
  }, [sectorSec, years]);

  // ③ 宏观平衡：CPI / 经常账户 / 广义财政
  const balanceOpt = useMemo(() => {
    const keys = [
      { label: 'CPI 通胀率', color: C.violet },
      { label: '经常账户余额 / GDP', color: C.cyberCyan },
      { label: '广义财政收支余额 / GDP', color: C.emerald },
    ];
    const series = keys.map(({ label, color }) => {
      const row = rowByLabel(balanceSec, label);
      return row ? { name: label, data: row.values, color } : null;
    }).filter(Boolean);
    if (!series.length) return null;
    return lineOpt({ years, series });
  }, [balanceSec, years]);

  // ④ 政府债务 / GDP
  const debtOpt = useMemo(() => {
    const row = rowByLabel(balanceSec, '政府债务 / GDP');
    if (!row) return null;
    return {
      grid: { ...GRID, bottom: 28 },
      tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%`, ...CHART_TOOLTIP },
      xAxis: categoryX(years),
      yAxis: valueY({ axisLabel: { formatter: '{value}%' }, min: 40 }),
      series: [{
        type: 'bar',
        barMaxWidth: 22,
        data: row.values.map((v, i) => ({
          value: v,
          itemStyle: {
            color: years[i]?.includes('f') ? 'rgba(196,30,58,0.55)' : C.powerRed,
            borderRadius: [3, 3, 0, 0],
          },
        })),
        label: { show: true, position: 'top', formatter: '{c}', color: LABEL.color, fontSize: 9 },
      }],
    };
  }, [balanceSec, years]);

  // ⑤ FDI 净值 / GDP
  const fdiOpt = useMemo(() => {
    const row = rowByLabel(balanceSec, 'FDI 净值 / GDP');
    if (!row) return null;
    return {
      grid: { ...GRID, bottom: 28 },
      tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%`, ...CHART_TOOLTIP },
      xAxis: categoryX(years),
      yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
      series: [{
        type: 'bar',
        barMaxWidth: 22,
        data: row.values.map((v) => ({
          value: v,
          itemStyle: {
            color: v >= 0 ? C.emerald : C.slate,
            borderRadius: v >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3],
          },
        })),
      }],
    };
  }, [balanceSec, years]);

  // ⑥ 风险台账示意
  const riskOpt = useMemo(() => ({
    grid: { left: 120, right: 24, top: 12, bottom: 28 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const i = params?.[0]?.dataIndex;
        const r = RISK_LEDGER[i];
        if (!r) return '';
        const st = r.status === 3 ? '已兑现/已发布' : r.status === 2 ? '进行中' : '上行/观察';
        return `${r.name}<br/>状态：${st}<br/>${r.note}`;
      },
      ...CHART_TOOLTIP,
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 3,
      interval: 1,
      axisLabel: {
        color: LABEL.color,
        fontSize: 10,
        formatter: (v) => ({ 1: '观察', 2: '进行中', 3: '已发布' }[v] || ''),
      },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } },
    },
    yAxis: {
      type: 'category',
      data: RISK_LEDGER.map((r) => r.name),
      axisLabel: { color: LABEL.color, fontSize: 10, width: 110, overflow: 'truncate' },
    },
    series: [{
      type: 'bar',
      barWidth: 10,
      data: RISK_LEDGER.map((r) => ({
        value: r.status,
        itemStyle: {
          color: r.status === 3 ? C.emerald : r.status === 2 ? C.fireGold : C.cyberCyan,
          borderRadius: [0, 3, 3, 0],
        },
      })),
    }],
  }), []);

  // ⑦ WDI GDP 增速长序列
  const wdiGrowthOpt = useMemo(
    () => wdiSeriesOpt(wbData.gdpGrowth?.series, C.powerRed, 'pct'),
    [wbData.gdpGrowth?.series],
  );

  // ⑧ WDI CPI
  const wdiCpiOpt = useMemo(
    () => wdiSeriesOpt(wbData.cpi?.series, C.violet, 'pct'),
    [wbData.cpi?.series],
  );

  // ⑨ WDI 产业结构（农/工/服）
  const wdiStructOpt = useMemo(() => {
    const agri = wbData.agri?.series || [];
    const ind = wbData.ind?.series || [];
    const srv = wbData.srv?.series || [];
    if (!agri.length && !ind.length && !srv.length) return null;
    const yearSet = new Set([
      ...agri.map((p) => p.year),
      ...ind.map((p) => p.year),
      ...srv.map((p) => p.year),
    ]);
    const yearsAsc = [...yearSet].sort((a, b) => a - b);
    const mapOf = (arr) => {
      const m = {};
      arr.forEach((p) => { m[p.year] = p.value; });
      return m;
    };
    const ma = mapOf(agri);
    const mi = mapOf(ind);
    const ms = mapOf(srv);
    return {
      grid: { ...GRID_WIDE, bottom: 40 },
      legend: { ...LEGEND, bottom: 0, data: ['第一产业', '第二产业', '第三产业'] },
      tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '—' : `${Number(v).toFixed(1)}%`), ...CHART_TOOLTIP },
      xAxis: categoryX(yearsAsc.map(String)),
      yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
      series: [
        { name: '第一产业', type: 'line', smooth: true, symbol: 'none', data: yearsAsc.map((y) => ma[y] ?? null), lineStyle: { color: C.emerald, width: 2 }, itemStyle: { color: C.emerald } },
        { name: '第二产业', type: 'line', smooth: true, symbol: 'none', data: yearsAsc.map((y) => mi[y] ?? null), lineStyle: { color: C.fireGold, width: 2 }, itemStyle: { color: C.fireGold } },
        { name: '第三产业', type: 'line', smooth: true, symbol: 'none', data: yearsAsc.map((y) => ms[y] ?? null), lineStyle: { color: C.cyberCyan, width: 2 }, itemStyle: { color: C.cyberCyan } },
      ],
    };
  }, [wbData.agri?.series, wbData.ind?.series, wbData.srv?.series]);

  // ⑩ 多国 GDP 增速对照
  const compareOpt = useMemo(() => {
    const by = compare?.data?.byCountry || {};
    const countries = DEFAULT_ISOS.map((iso) => COMPARE_COUNTRIES.find((c) => c.iso === iso)).filter(Boolean);
    const yearSet = new Set();
    countries.forEach((c) => {
      (by[c.iso]?.series || []).forEach((p) => yearSet.add(p.year));
    });
    const yearsAsc = [...yearSet].sort((a, b) => a - b);
    if (!yearsAsc.length) return null;
    const series = countries.map((c) => {
      const m = {};
      (by[c.iso]?.series || []).forEach((p) => { m[p.year] = p.value; });
      return {
        name: c.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        data: yearsAsc.map((y) => m[y] ?? null),
        lineStyle: { width: 2, color: c.color },
        itemStyle: { color: c.color },
      };
    });
    const hasData = series.some((s) => s.data.some((v) => v != null));
    if (!hasData) return null;
    return {
      grid: { ...GRID_WIDE, bottom: 40 },
      legend: { ...LEGEND, bottom: 0 },
      tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '—' : `${Number(v).toFixed(1)}%`), ...CHART_TOOLTIP },
      xAxis: categoryX(yearsAsc.map(String)),
      yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
      series,
    };
  }, [compare?.data?.byCountry]);

  const wbLineOption = useMemo(() => {
    const series = wbSeries?.series || [];
    if (!series.length) return null;
    return wdiSeriesOpt(series, '#22d3ee', wbDef?.kind || 'pct');
  }, [wbSeries, wbDef]);

  const wbLoading = wb?.loading && !wbSeries?.series?.length;
  const section = SECTIONS.find((s) => s.id === subTab);

  return (
    <div className="econ-section space-y-5">
      <Card title={`世行经济简报 · ${REPORT_META.edition}`} asSection={false}>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs m-0" style={{ color: 'var(--text-tertiary)' }}>
            世界银行《{REPORT_META.title}》结构化要点 + CEU 基线图表台账 + WDI 年度长序列交叉验证。
            数据截至 {REPORT_META.asOf} · {REPORT_META.source}
          </p>
          <SourceBadge live={false} asOf={REPORT_META.asOf} />
        </div>

        <StatGrid className="mb-4">
          {KEY_READINGS.slice(0, 8).map((k) => (
            <Stat key={k.label} value={k.value} label={k.label} sub={k.sub} accent={k.accent} />
          ))}
        </StatGrid>

        <div className="econ-finance-subnav" role="tablist" aria-label="世行简报子导航">
          {SUB_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={subTab === t.id}
              className={`econ-finance-subnav-btn${subTab === t.id ? ' is-active' : ''}`}
              onClick={() => setSubTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {subTab === 'overview' && (
        <>
          <Card title="概述 · 执行摘要" asSection={false}>
            <div className="space-y-3">
              {EXECUTIVE_SUMMARY.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{p}</p>
              ))}
            </div>
            <SourceLine>出处：{REPORT_META.source} · 《{REPORT_META.titleEn}》{REPORT_META.edition} · 截至 {REPORT_META.asOf}</SourceLine>
          </Card>

          <Card title="① 中国经济前景 · 基线四指标（CEU 表）" asSection={false}>
            <ForecastChart rows={OUTLOOK_SUMMARY.rows} years={OUTLOOK_SUMMARY.years} />
            <ChartNote>
              实际 GDP 自 2025 年 5.0% 回落至 2026f 4.4%，其后 2027–28 年继续温和下移；CPI 自极低位回升，经常账户顺差收窄，广义财政赤字高位缓降——四线同图是「供强需弱 + 再通胀临时性」叙事的量化骨架。
            </ChartNote>
            <SourceLine>{OUTLOOK_SUMMARY.note} · 出处：CEU {REPORT_META.edition} · 截至 {REPORT_META.asOf}</SourceLine>
          </Card>

          <Grid cols={2} gap="1.25rem">
            {demandOpt && (
              <Card title="② 需求侧分项增速 · 消费 / 投资 / 进出口" asSection={false}>
                <EChart option={demandOpt} style={{ height: 280 }} />
                <ChartNote>
                  出口在 2024–25 年显著抬升后，基线情景下向 6.9%→4.2% 回落；居民消费增速低于疫情后反弹峰值，固定资本形成维持低个位数——外热内冷的结构在预测区间内仍未闭合。
                </ChartNote>
                <SourceLine>出处：CEU 表 1 · 实际 GDP 分项（不变市场价格）· f = 预测</SourceLine>
              </Card>
            )}
            {sectorOpt && (
              <Card title="③ 三次产业增速 · 农 / 工 / 服" asSection={false}>
                <EChart option={sectorOpt} style={{ height: 280 }} />
                <ChartNote>
                  服务业仍是主引擎，但 2026f 起与工业增速差距收窄；工业受外需与高技术缓冲，农业稳定在 3% 区间——产业结构换挡反映在增速差而非水平占比（占比见 WDI 子页）。
                </ChartNote>
                <SourceLine>出处：CEU 表 1 · 不变要素价格分产业 · 截至 {REPORT_META.asOf}</SourceLine>
              </Card>
            )}
          </Grid>

          <Grid cols={2} gap="1.25rem">
            {balanceOpt && (
              <Card title="④ 宏观平衡 · CPI / 经常账户 / 广义财政" asSection={false}>
                <EChart option={balanceOpt} style={{ height: 280 }} />
                <ChartNote>
                  经常账户顺差自 2025 年峰值回落；广义财政赤字率高位运行，与「刺激仍具必要性、结构重于规模」的政策叙事同向。CPI 回升被 CEU 定性为能源驱动、或具暂时性。
                </ChartNote>
                <SourceLine>出处：CEU 表 1 · 宏观平衡 · * 广义财政为世行工作人员估算</SourceLine>
              </Card>
            )}
            {debtOpt && (
              <Card title="⑤ 政府债务 / GDP 轨迹" asSection={false}>
                <EChart option={debtOpt} style={{ height: 280 }} />
                <ChartNote>
                  债务率自 2023 年约 55% 升至 2028f 约 84%——预测段（半透明柱）标示基线情景下的路径，非官方目标；与土地出让收入 −28.7% 的地方财力压力并读。
                </ChartNote>
                <SourceLine>出处：CEU 表 1 · 政府债务 / GDP · f = 预测</SourceLine>
              </Card>
            )}
          </Grid>

          <Grid cols={2} gap="1.25rem">
            {fdiOpt && (
              <Card title="⑥ FDI 净值 / GDP" asSection={false}>
                <EChart option={fdiOpt} style={{ height: 260 }} />
                <ChartNote>
                  净值在 2023–24 年为负、2025 年短暂转正后基线重回微负——外资活跃度回摆与「高科技投资对冲地产」叙事并行，不可外推为短期资金流预测。
                </ChartNote>
                <SourceLine>出处：CEU 表 1 · FDI 净值 / GDP</SourceLine>
              </Card>
            )}
            <Card title="⑦ 风险与未决项 · 台账示意" asSection={false}>
              <EChart option={riskOpt} style={{ height: 260 }} />
              <ChartNote>
                状态条为研判框架<strong style={{ color: 'var(--text-primary)' }}>示意标定</strong>（已发布=3 / 进行中=2 / 观察=1），非世行官方评级。条目论据见 CEU 正文「前景和风险」。
              </ChartNote>
              <SourceLine>示意标定 · 非官方评级 · 出处：CEU {REPORT_META.edition}</SourceLine>
            </Card>
          </Grid>

          <Grid cols={2} gap="1.25rem">
            {wdiGrowthOpt ? (
              <Card title="⑧ WDI · GDP 实际增速长序列（中国）" asSection={false}>
                <EChart option={wdiGrowthOpt} style={{ height: 260 }} loading={!!wb?.loading && !wbData.gdpGrowth?.series?.length} loadingLabel="WDI 拉取中…" />
                <ChartNote>
                  年度不变价增速的长波背景，用于对照 CEU 月度研判中的 4.4% 基线——口径为 WDI，与 NBS 季度发布存在时滞与修订差。
                </ChartNote>
                <SourceLine>
                  数据源：{wbData.gdpGrowth?.source || 'World Bank · WDI'} · NY.GDP.MKTP.KD.ZG
                  {wbData.gdpGrowth?.error ? ` · 〔存疑〕${wbData.gdpGrowth.error}` : ''} · 截至 {ECON_AS_OF}
                </SourceLine>
              </Card>
            ) : (
              <Card title="⑧ WDI · GDP 实际增速长序列" asSection={false}>
                <EmptyState title="序列暂缺" description={wbData.gdpGrowth?.error || 'World Bank 取数中或暂无数据；不臆造长序列。'} />
                <SourceLine>〔存疑〕缺 WDI 序列 · 截至 {ECON_AS_OF}</SourceLine>
              </Card>
            )}
            {wdiCpiOpt ? (
              <Card title="⑨ WDI · 通胀率（CPI）长序列" asSection={false}>
                <EChart option={wdiCpiOpt} style={{ height: 260 }} loading={!!wb?.loading && !wbData.cpi?.series?.length} loadingLabel="WDI 拉取中…" />
                <ChartNote>
                  与 CEU「再通胀或具暂时性」并读：长序列显示中国 CPI 长期偏低，近期回升是否可持续取决于内需而非单纯能源脉冲。
                </ChartNote>
                <SourceLine>
                  数据源：{wbData.cpi?.source || 'World Bank · WDI'} · FP.CPI.TOTL.ZG
                  {wbData.cpi?.error ? ` · 〔存疑〕${wbData.cpi.error}` : ''} · 截至 {ECON_AS_OF}
                </SourceLine>
              </Card>
            ) : (
              <Card title="⑨ WDI · 通胀率（CPI）" asSection={false}>
                <EmptyState title="序列暂缺" description={wbData.cpi?.error || '暂无 CPI 长序列；不填假数。'} />
                <SourceLine>〔存疑〕缺 WDI 序列 · 截至 {ECON_AS_OF}</SourceLine>
              </Card>
            )}
          </Grid>

          <Grid cols={2} gap="1.25rem">
            {wdiStructOpt ? (
              <Card title="⑩ WDI · 三次产业增加值占比" asSection={false}>
                <EChart option={wdiStructOpt} style={{ height: 280 }} />
                <ChartNote>
                  占比长序列刻画「脱农进服」的水平结构；与 CEU 表 1 的产业<strong style={{ color: 'var(--text-primary)' }}>增速</strong>图互补——一为水平，一为边际。
                </ChartNote>
                <SourceLine>数据源：World Bank · WDI · NV.AGR/IND/SRV.TOTL.ZS · 截至 {ECON_AS_OF}</SourceLine>
              </Card>
            ) : (
              <Card title="⑩ WDI · 三次产业占比" asSection={false}>
                <EmptyState title="结构序列暂缺" description="农/工/服占比尚未取回；请稍后或见「WDI 长序列」子页。" />
                <SourceLine>〔存疑〕缺结构序列 · 截至 {ECON_AS_OF}</SourceLine>
              </Card>
            )}
            {compareOpt ? (
              <Card title="⑪ 多国对照 · GDP 增速（近十年）" asSection={false}>
                <EChart option={compareOpt} style={{ height: 280 }} loading={!!compare?.loading && !compareOpt} loadingLabel="多国对比拉取中…" />
                <ChartNote>
                  中国 / 美国 / 印度同口径对照，用于定位 CEU 基线放缓是否仅为中国特有路径。取数遵守逐国错峰，失败国不造假点。
                </ChartNote>
                <SourceLine>
                  数据源：World Bank · WDI · NY.GDP.MKTP.KD.ZG · {DEFAULT_ISOS.join('/')}
                  {compare?.error ? ` · 〔存疑〕${compare.error}` : ''} · 截至 {ECON_AS_OF}
                </SourceLine>
              </Card>
            ) : (
              <Card title="⑪ 多国对照 · GDP 增速" asSection={false}>
                <EmptyState title="对比序列暂缺" description={compare?.error || '多国取数中或限频；不臆造对照点。'} />
                <SourceLine>〔存疑〕缺多国序列 · 截至 {ECON_AS_OF}</SourceLine>
              </Card>
            )}
          </Grid>

          <Grid cols={3} gap="1.25rem">
            {BOXES.map((b) => (
              <div
                key={b.id}
                className="os-card"
                style={{ padding: 'var(--card-padding)', borderLeft: `3px solid ${b.accent}` }}
              >
                <div className="text-sm font-semibold mb-2" style={{ color: b.accent }}>{b.title}</div>
                <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{b.text}</p>
              </div>
            ))}
          </Grid>
        </>
      )}

      {section && subTab !== 'overview' && subTab !== 'data' && subTab !== 'wdi' && (
        <Card title={`${section.part}. ${section.title}`} asSection={false}>
          <SectionProse section={section} />
          <SourceLine>出处：CEU {REPORT_META.edition} · {section.title} · 截至 {REPORT_META.asOf}</SourceLine>
        </Card>
      )}

      {subTab === 'data' && (
        <>
          <Card title="表 1 · 中国部分经济指标（2023–2028）" asSection={false}>
            <div className="overflow-x-auto mb-3">
              <DataTable sections={TABLE1.sections} years={TABLE1.years} />
            </div>
            <SourceLine>来源：世界银行 · f = 预测值（基线情景）· * 广义财政收支余额为世行工作人员估算 · 截至 {REPORT_META.asOf}</SourceLine>
          </Card>
          <Card title="关键读数速览" asSection={false}>
            <StatGrid>
              {KEY_READINGS.map((k) => (
                <Stat key={k.label} value={k.value} label={k.label} sub={k.sub} accent={k.accent} />
              ))}
            </StatGrid>
            <SourceLine>出处：CEU {REPORT_META.edition} 正文核对读数 · 截至 {REPORT_META.asOf}</SourceLine>
          </Card>
        </>
      )}

      {subTab === 'wdi' && (
        <Card title="WDI 长序列 · 与世行简报交叉验证" asSection={false}>
          <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
            浏览器直连 World Bank Open Data 实时取数，约 35 年年度口径；与 CEU 月度研判存在时滞与统计差异。无序列不填假数。
          </p>
          <SelectorBar items={wbIndicators} activeKey={wbKey} onSelect={setWbKey} />
          <div className="mt-4" style={{ minHeight: 280 }}>
            {wbSeries?.error ? (
              <EmptyState title="实时取数失败" description={`${String(wbSeries.error)}；可稍后重试或前往宏观态势 Tab。`} />
            ) : (
              <EChart
                option={wbLineOption}
                style={{ height: 300 }}
                loading={wbLoading}
                loadingLabel="World Bank 序列拉取中…"
              />
            )}
          </div>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <div>
              <div className="text-xs mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{wbDef?.label || '—'} · 最新值</div>
              <div className="mono text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {wbSeries?.latest ? wbStat(wbSeries.latest.value, wbDef?.kind || 'pct') : (wb?.loading ? '载入中' : '—')}
              </div>
              {wbSeries?.latest?.year && (
                <div className="text-[11px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>数据年份 {wbSeries.latest.year}</div>
              )}
            </div>
            {wbDef?.note && (
              <p className="text-[11px] leading-relaxed flex-1 m-0" style={{ color: 'var(--text-tertiary)' }}>{wbDef.note}</p>
            )}
          </div>
          <SourceLine>数据源：{wbSeries?.source || 'World Bank · WDI'} · 截至 {ECON_AS_OF}</SourceLine>
        </Card>
      )}

      <Card title="交叉深潜 · 关联模块" asSection={false}>
        <div className="econ-hub-grid">
          <Link to={econTabPath('macro')} className="econ-hub-card" style={{ borderLeft: '3px solid #22d3ee' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>宏观态势 · WDI 全指标 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              12 项世行长序列 + NBS 快照 + 国际对比，与本简报年度口径互补。
            </p>
          </Link>
          <Link to={econTabPath('h1review')} className="econ-hub-card" style={{ borderLeft: '3px solid #e8a317' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>半年经济解读 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              NBS 2026 H1 全文台账，与 CEU「供强需弱」叙事交叉。
            </p>
          </Link>
          <Link to={econTabPath('consume15')} className="econ-hub-card" style={{ borderLeft: '3px solid #f472b6' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>十五五促消费 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              扩内需规划全文，对 CEU 消费再平衡建议的制度回应。
            </p>
          </Link>
          <Link to={econTabPath('canary')} className="econ-hub-card" style={{ borderLeft: '3px solid #c41e3a' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>信号金丝雀 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              领先指标示意与 CEU 供强需弱叙事交叉验证。
            </p>
          </Link>
          <a
            href={REPORT_META.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="econ-hub-card"
            style={{ borderLeft: '3px solid #10b981' }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>CEU PDF 原文 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              {REPORT_META.edition} 中文版 · 正式引用请以 PDF 为准。
            </p>
          </a>
        </div>
      </Card>

      <div
        className="os-card"
        style={{ padding: 'var(--card-padding)', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)' }}
      >
        <div className="text-xs mono mb-1" style={{ color: 'var(--text-tertiary)' }}>
          数据截至 {REPORT_META.asOf} · {REPORT_META.source} · NBS/WDI 快照截至 {ECON_AS_OF}
        </div>
        <p className="text-xs m-0" style={{ color: 'var(--text-secondary)' }}>{DISCLAIMER}</p>
      </div>
    </div>
  );
}
