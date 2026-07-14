import React, { useMemo, useState } from 'react';
import { Card, Grid, Stat, StatGrid, SourceBadge, EmptyState } from '../../../app/ui.jsx';
import EChart from '../../../lib/viz/EChart.jsx';
import { AXIS, GRID_LINE, LABEL, LEGEND } from '../../shared/chartHelpers.js';
import { SelectorBar } from '../../shared/ModuleParadigm.jsx';
import { WB_INDICATORS } from '../liveWorldBank.js';
import { wbStat, fmtYoY } from '../liveWorldBank.js';
import {
  ECON_AS_OF, SECTOR_STRUCTURE, SECTORS, KEY_INDICATORS,
} from '../econData.js';
import SectionDeflation from '../SectionDeflation.jsx';
import SectionWatch from '../SectionWatch.jsx';
import SectionNbsLatest from '../SectionNbsLatest.jsx';
import SectionCompare from '../SectionCompare.jsx';
import {
  toneOf, ARROW, INDICATOR_GROUPS, filterIndicators, IndicatorCard,
} from '../econHelpers.jsx';

export default function MacroTab({ wb }) {
  const [group, setGroup] = useState('all');
  const [wbKey, setWbKey] = useState(WB_INDICATORS?.[0]?.key);

  const wbData = wb.data || {};
  const gdpLatest = wbData.gdp?.latest || null;
  const gdpPcLatest = wbData.gdpPerCap?.latest || null;
  const gdpYoY = useMemo(() => fmtYoY(wbData.gdp?.series), [wbData.gdp?.series]);
  const gdpTrend = useMemo(() => {
    if (!gdpYoY) return null;
    return gdpYoY.startsWith('-') ? 'down' : 'up';
  }, [gdpYoY]);

  const tertiaryLatest = useMemo(() => {
    if (!SECTOR_STRUCTURE?.length) return null;
    const last = SECTOR_STRUCTURE[SECTOR_STRUCTURE.length - 1];
    return last?.srv ?? null;
  }, []);

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
        { type: 'value', name: '占比 %', max: 100, nameTextStyle: { ...LABEL, fontSize: 10 }, axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
        { type: 'value', name: '增速 %', nameTextStyle: { ...LABEL, fontSize: 10 }, axisLine: AXIS, axisLabel: LABEL, splitLine: { show: false }, scale: true },
      ],
      series,
    };
  }, []);

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

  const indicators = useMemo(() => filterIndicators(KEY_INDICATORS, group), [group]);

  const wbDef = useMemo(() => (WB_INDICATORS || []).find((d) => d.key === wbKey) || null, [wbKey]);
  const wbSeries = wbKey ? wbData[wbKey] : null;

  const wbLineOption = useMemo(() => {
    const series = wbSeries?.series || [];
    if (!series.length) return null;
    const years = series.map((p) => String(p.year));
    const vals = series.map((p) => p.value);
    const last = series[series.length - 1];
    const kind = wbDef?.kind || 'pct';
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

  const wbLoading = wb.loading && !wbSeries?.series?.length;

  return (
    <div className="econ-section">
      <div className="econ-block"><SectionDeflation /></div>
      <div className="econ-block"><SectionWatch /></div>

      <StatGrid className="econ-hero-stats">
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

      <Card title="三次产业结构 · 经济在做什么">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            从「以农立国」到工业化、再到服务业过半——三产占比的此消彼长，是一国经济阶段最直白的体检表。
          </p>
          <SourceBadge live={false} asOf={ECON_AS_OF} />
        </div>
        <Grid cols={2} gap="1.25rem">
          <div className="min-w-0">
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>最新年三产占比</div>
            <EChart option={donutOption} variant="dashboard" style={{ height: 300 }} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>占比演变（近 8 年）+ GDP 增速副线</div>
            <EChart option={evolveOption} variant="dashboard" style={{ height: 300 }} />
          </div>
        </Grid>
        <Grid cols={3} gap="0.75rem" className="mt-4" stagger>
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

      <Card title="核心指标盘 · 当下的体温">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <SelectorBar items={INDICATOR_GROUPS} activeKey={group} onSelect={setGroup} />
          <SourceBadge live={false} asOf={ECON_AS_OF} />
        </div>
        <Grid cols={3} gap="0.75rem" stagger>
          {indicators.map((k) => <IndicatorCard key={k.id} k={k} />)}
          {!indicators.length && <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 该组暂无指标</p>}
        </Grid>
        <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
          // 同比/环比涨绿跌红；PMI 类标注荣枯线 50；徽章为研判 tone 着色 —— 均以官方发布为准
        </p>
      </Card>

      <Card title="世界银行长序列 · 三十五年的来路">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            浏览器直连 World Bank WDI 实时取数，看长周期里的趋势线——短期噪声退场，结构变迁显形。
          </p>
          <SourceBadge live asOf={ECON_AS_OF} />
        </div>
        <SelectorBar items={WB_INDICATORS || []} activeKey={wbKey} onSelect={setWbKey} />
        <Grid cols={2} gap="1.25rem">
          <div className="min-w-0">
            {wbSeries?.error ? (
              <EmptyState title="实时取数失败" description={`${String(wbSeries.error)}；该指标暂以降级态呈现，可稍后重试。`} />
            ) : (
              <EChart
                option={wbLineOption}
                variant="dashboard"
                style={{ height: 300 }}
                loading={wbLoading}
                loadingLabel="World Bank 序列拉取中…"
              />
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
              <div className="mt-2"><SourceBadge live asOf={ECON_AS_OF} /></div>
            </div>
            {wbDef?.note && <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{wbDef.note}</p>}
            <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>数据源：{wbSeries?.source || 'World Bank · WDI'}</p>
          </div>
        </Grid>
      </Card>

      <div className="econ-block"><SectionNbsLatest /></div>
      <div className="econ-block"><SectionCompare /></div>
    </div>
  );
}
