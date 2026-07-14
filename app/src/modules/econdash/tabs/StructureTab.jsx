import React, { Suspense, lazy, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, SourceBadge, LoadingSkeleton } from '../../../app/ui.jsx';
import EChart from '../../../lib/viz/EChart.jsx';
import { AXIS, GRID_LINE, LABEL } from '../../shared/chartHelpers.js';
import { ECON_AS_OF, INCOME_DIST, NEW_ECONOMY } from '../econData.js';
import SectionDivergence from '../SectionDivergence.jsx';
import { toneOf } from '../econHelpers.jsx';

const SectionCatalog = lazy(() => import('../SectionCatalog.jsx'));
const SectionCycle = lazy(() => import('../SectionCycle.jsx'));
const SectionFiveYear = lazy(() => import('../SectionFiveYear.jsx'));

export default function StructureTab() {
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
      yAxis: { type: 'value', scale: true, axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
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

  const newEcoOption = useMemo(() => {
    const rows = NEW_ECONOMY || [];
    if (!rows.length) return null;
    const names = rows.map((r) => r.label);
    return {
      legend: { top: 0, textStyle: { color: 'var(--text-secondary)', fontSize: 11 }, data: ['占 GDP 比重 %', '同比增速 %'] },
      grid: { left: 92, right: 28, top: 30, bottom: 20 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'value', axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
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

  return (
    <div className="econ-section">
      <div className="econ-block"><SectionDivergence /></div>

      <Card title="结构矛盾 · 关联深潜">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          总量指标掩盖分布与结构裂缝。下列模块承接经济大盘的「结构层」读数——官民矛盾、区域梯度、阶层流动。
        </p>
        <div className="econ-hub-grid">
          <Link to="/contradictions" className="econ-hub-card" style={{ borderLeft: '3px solid #8090c6' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>社会主要矛盾 · 结构图谱 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              官民、城乡、区域、代际四维矛盾——均值之下有裂缝，总量之内有失衡。
            </p>
          </Link>
          <Link to="/governance" className="econ-hub-card" style={{ borderLeft: '3px solid #62a89e' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>治理现代化 · 数字政府 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              结构矛盾落到执行精度——网格治理与制度接口的治理出口。
            </p>
          </Link>
          <Link to="/modules/observatory" className="econ-hub-card" style={{ borderLeft: '3px solid #c99a4e' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>观象台 · 治理总入口 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              双仪表合成 · 叙事链 · 行动清单——结构矛盾与政策信号的交叉判读。
            </p>
          </Link>
        </div>
      </Card>

      <Suspense fallback={<LoadingSkeleton rows={2} label="指标目录载入中…" />}>
        <div className="econ-block"><SectionCatalog /></div>
      </Suspense>

      <Card title="收入分配与新经济 · 增长落到谁身上">
        <Grid cols={2} gap="1.25rem">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>基尼系数（近 10 年）</span>
              <SourceBadge live={false} asOf={ECON_AS_OF} />
            </div>
            <EChart option={giniOption} style={{ height: 240 }} />
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
            <EChart option={newEcoOption} style={{ height: 280 }} />
            <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
              // 占比看体量，增速看动能——高增速低占比的，是下一程的引擎
            </p>
          </div>
        </Grid>
      </Card>

      <Suspense fallback={<LoadingSkeleton rows={2} label="周期研判载入中…" />}>
        <div className="econ-block"><SectionCycle /></div>
      </Suspense>
      <Suspense fallback={<LoadingSkeleton rows={2} label="十五五锚点载入中…" />}>
        <div className="econ-block"><SectionFiveYear /></div>
      </Suspense>
    </div>
  );
}
