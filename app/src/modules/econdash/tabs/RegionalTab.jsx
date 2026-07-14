import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, SourceBadge } from '../../../app/ui.jsx';
import EChart from '../../../lib/viz/EChart.jsx';
import { AXIS, GRID_LINE, LABEL, LEGEND } from '../../shared/chartHelpers.js';
import { ECON_AS_OF, SECTOR_STRUCTURE, SECTORS } from '../econData.js';
import SectionRegional from '../SectionRegional.jsx';
import { toneOf, ARROW } from '../econHelpers.jsx';

const REGIONAL_HUB = [
  { to: '/regional', label: '区域协调 · 四大板块', note: '东中西梯度、转移支付与全国统一大市场。', accent: '#c99a4e' },
  { to: '/manufacturing', label: '制造强国 · GVC 位势', note: '第二产业硬核：规模优势与转型升级的产业锚点。', accent: '#e8a317' },
  { to: '/foreign-trade', label: '对外贸易 · 新三样', note: '出口交货值领先指标，外需与区域产业耦合。', accent: '#22d3ee' },
  { to: '/northeast', label: '东北振兴 · 三省', note: '老工业基地与全面振兴新突破的压力测试。', accent: '#c41e3a' },
];

export default function RegionalTab() {
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

  const industryBarOption = useMemo(() => {
    if (!sectorCards.length) return null;
    return {
      grid: { left: 88, right: 24, top: 16, bottom: 24 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'value', max: 70, axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
      yAxis: {
        type: 'category',
        data: sectorCards.map((s) => s.label),
        inverse: true,
        axisLine: AXIS,
        axisLabel: { ...LABEL, fontSize: 11 },
        axisTick: { show: false },
      },
      series: [{
        type: 'bar',
        data: sectorCards.map((s) => ({
          value: s.cur,
          itemStyle: { color: s.color },
        })),
        barWidth: 14,
        label: { show: true, position: 'right', formatter: '{c}%', color: 'var(--text-secondary)', fontSize: 11 },
      }],
    };
  }, [sectorCards]);

  const evolveSparkOption = useMemo(() => {
    if (!SECTOR_STRUCTURE?.length) return null;
    const rows = SECTOR_STRUCTURE.slice(-8);
    const years = rows.map((r) => String(r.year));
    return {
      legend: { top: 0, textStyle: { ...LEGEND.textStyle, fontSize: 11 }, data: SECTORS.map((s) => s.label) },
      grid: { left: 44, right: 20, top: 32, bottom: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category', data: years, boundaryGap: false,
        axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 10 }, axisTick: { show: false },
      },
      yAxis: {
        type: 'value', name: '占比 %', max: 70, nameTextStyle: { ...LABEL, fontSize: 10 },
        axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE,
      },
      series: SECTORS.map((s) => ({
        name: s.label,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2, color: s.color },
        data: rows.map((r) => r[s.id] ?? null),
      })),
    };
  }, []);

  return (
    <div className="econ-section">
      <Card title="产业格局 · 三次结构快照">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs m-0" style={{ color: 'var(--text-tertiary)' }}>
            服务业占比过半、制造业承压转型、农业占比刚性下滑——产业结构的此消彼长定义区域投资与要素流动的长期方向。
          </p>
          <SourceBadge live={false} asOf={ECON_AS_OF} />
        </div>
        <Grid cols={2} gap="1.25rem">
          <div className="min-w-0">
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>最新年占比横向对比</div>
            <EChart option={industryBarOption} variant="compact" style={{ height: 220 }} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>近 8 年演变折线</div>
            <EChart option={evolveSparkOption} variant="compact" style={{ height: 220 }} />
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
              </div>
            </div>
          ))}
        </Grid>
      </Card>

      <div className="econ-block"><SectionRegional /></div>

      <Card title="区域产业 · 关联深潜">
        <div className="econ-hub-grid">
          {REGIONAL_HUB.map((h) => (
            <Link key={h.to} to={h.to} className="econ-hub-card" style={{ borderLeft: `3px solid ${h.accent}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{h.label} ↗</div>
              <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{h.note}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
