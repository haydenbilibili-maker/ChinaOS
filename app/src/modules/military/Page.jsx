import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid, TabBar, DistBar } from '../../app/ui.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import MilitaryMap, { BaseTypeLegend, TheaterLegend } from './MilitaryMap.jsx';
import { FIGURE_MILITARY_2026, FIGURE_MILITARY_META, FIGURE_MILITARY_COUNT } from '../../lib/db/figureMilitary2026.js';
import './military.css';
import {
  MILITARY_INTEL_META,
  STRATEGY_MILESTONES,
  OVERVIEW_STATS,
  BUDGET_TREND,
  SERVICES,
  PERSONNEL,
  MISSILE_SPECTRUM,
  EQUIPMENT_CATALOG,
  NAVY_BAR,
  AIR_PIE,
  TECH_DOMAINS,
  THEATERS,
  LOGISTICS,
  MILITARY_BASES,
  RANK_PYRAMID,
  FORCE_COMPOSITION,
  RECRUITMENT_TREND,
  DEFENSE_GDP_TREND,
  INTL_DEFENSE_COMPARE,
  SERVICE_SUNBURST,
  EQUIPMENT_TREE,
  EQUIPMENT_COMPARE,
  SERVICE_TIMELINE,
  MODERNIZATION_RADAR,
  TRL_MATRIX,
  RD_INVESTMENT_TREND,
  MCF_SANKEY,
  THEATER_FORCE,
  STRAITS_POSTURE,
  ISLAND_CHAINS,
} from '../../lib/db/militaryIntel2026.js';
import { AXIS, GRID_LINE, LABEL, LEGEND, categoryX, valueY, logY, radarOpt } from '../shared/chartHelpers.js';

const TABS = [
  ['strategy', '战略态势'],
  ['services', '军种结构'],
  ['combat', '装备战力'],
  ['island', '台海岛链'],
  ['leaders', '人事将领'],
];

const RANK_COLORS = { 上将: '#c41e3a', 中将: '#e8a317', 少将: '#22d3ee' };

const tabBtn = (active) => ({
  background: active ? 'rgba(196,30,58,0.22)' : 'var(--bg-elevated)',
  color: active ? '#fff' : 'var(--text-secondary)',
  border: `1px solid ${active ? 'var(--china-red)' : 'var(--border-subtle)'}`,
  cursor: 'pointer',
  borderRadius: 6,
  padding: '6px 14px',
  fontSize: 12,
});

const TRL_COLORS = ['#64748b', '#64748b', '#64748b', '#64748b', '#e8a317', '#e8a317', '#22d3ee', '#22d3ee', '#10b981'];

function parseNum(v) {
  if (typeof v === 'number') return v;
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function rankDistPairs(rows) {
  return rows.map((row) => [row.rank || row.name || row[0], parseNum(row.share ?? row.count ?? row[1])]);
}

function OverviewTab() {
  const budgetChart = {
    grid: { left: 44, right: 16, top: 16, bottom: 24 },
    xAxis: { type: 'category', data: BUDGET_TREND.years, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
    yAxis: { type: 'value', name: 'B$', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    series: [{ type: 'bar', data: BUDGET_TREND.values, barWidth: 26, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } }],
  };

  const deterrenceRadar = {
    radar: {
      indicator: [{ name: '高超声速', max: 100 }, { name: '反舰打击', max: 100 }, { name: '态势感知', max: 100 }, { name: '区域拒止', max: 100 }, { name: '战略投送', max: 100 }],
      axisName: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
    },
    series: [{ type: 'radar', data: [{ value: [88, 90, 85, 92, 70], name: 'A2/AD 能力示意', lineStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.14)' } }] }],
  };

  return (
    <>
      <Grid cols={3} className="mb-4">
        {STRATEGY_MILESTONES.map(({ year, title, desc }) => (
          <Card key={year}>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold mono" style={{ color: 'var(--china-red)' }}>{year}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{title}</span>
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
          </Card>
        ))}
      </Grid>
      <StatGrid className="mb-6">
        {OVERVIEW_STATS.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} accent={s.accent} />
        ))}
      </StatGrid>
      <Grid cols={2} className="mb-6">
        <Card title={`国防预算趋势 · ${BUDGET_TREND.asOf}（${BUDGET_TREND.unit}）`}>
          <EChart option={budgetChart} style={{ height: 240 }} />
        </Card>
        <Card title="A2/AD 能力雷达 · 公开评估示意">
          <EChart option={deterrenceRadar} style={{ height: 240 }} />
        </Card>
      </Grid>
      <Card title="军委管总 · 战区主战 · 军种主建">
        <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          2016 年深化国防和军队改革后，确立「军委管总、战区主战、军种主建」格局；2024 年战略支援部队调整为信息支援部队。五大战区对应主要战略方向，军种专注力量建设。
        </p>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))' }}>
          {Object.entries(SERVICES).slice(0, 5).map(([k, s]) => (
            <div key={k} className="p-2.5 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</span>
                <span className="text-[9px] px-1 rounded mono" style={{ background: 'rgba(196,30,58,0.14)', color: 'var(--china-red)' }}>{s.tag}</span>
              </div>
              <p className="text-[10px] mono" style={{ color: 'var(--fire-gold)' }}>{s.stat}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function RankPyramid({ levels }) {
  return (
    <div className="space-y-1">
      {levels.map((l, i) => {
        const w = 32 + (i / (levels.length - 1)) * 66;
        return (
          <div key={l.rank} className="flex items-center justify-center" title={l.label}>
            <div className="flex items-center justify-between px-3" style={{ width: `${w}%`, height: 32, background: `${l.color}d0`, borderRadius: 4, border: `1px solid ${l.color}` }}>
              <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: '#fff' }}>{l.rank}</span>
              <span className="text-[10px] mono" style={{ color: '#fff' }}>{l.count.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PersonnelTab() {
  const [svc, setSvc] = useState('army');
  const s = SERVICES[svc];
  const pieChart = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    series: [{ type: 'pie', radius: ['48%', '68%'], center: ['50%', '42%'], label: { color: LABEL.color, fontSize: 10 },
      data: PERSONNEL.serviceShare.map((d) => ({ value: d.value, name: d.name, itemStyle: { color: d.color } })) }],
  };

  const sunburst = {
    tooltip: { trigger: 'item', formatter: (p) => `${p.name}: ${p.value || ''}` },
    series: [{
      type: 'sunburst', radius: ['12%', '92%'], center: ['50%', '50%'], data: SERVICE_SUNBURST,
      label: { color: '#e2e8f0', fontSize: 9, minAngle: 8 },
      itemStyle: { borderColor: '#0a0e17', borderWidth: 1 },
      levels: [{}, { r0: '12%', r: '52%' }, { r0: '52%', r: '92%', label: { align: 'right' } }],
    }],
  };

  const forceStack = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (a) => a.map((x) => `${x.seriesName}: ${x.value} 万`).join('<br/>') },
    legend: { ...LEGEND, top: 0 },
    grid: { left: 8, right: 8, top: 30, bottom: 8, containLabel: true },
    xAxis: { type: 'value', splitLine: GRID_LINE, axisLabel: LABEL, name: '万', nameTextStyle: { color: '#5b6a82' } },
    yAxis: { type: 'category', data: ['兵员构成'], axisLine: AXIS, axisLabel: LABEL },
    series: FORCE_COMPOSITION.segments.map((seg) => ({ name: seg.name, type: 'bar', stack: 't', barWidth: 40, data: [seg.value], itemStyle: { color: seg.color }, label: { show: true, color: '#fff', fontSize: 10 } })),
  };

  const recruitChart = {
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0 },
    grid: { left: 40, right: 40, top: 30, bottom: 24 },
    xAxis: categoryX(RECRUITMENT_TREND.years),
    yAxis: [
      { type: 'value', name: '万', nameTextStyle: { color: '#5b6a82' }, splitLine: GRID_LINE, axisLabel: LABEL },
      { type: 'value', name: '%', nameTextStyle: { color: '#5b6a82' }, splitLine: { show: false }, axisLabel: LABEL, max: 100 },
    ],
    series: [
      { name: '征兵规模(万)', type: 'bar', data: RECRUITMENT_TREND.scale, barWidth: 18, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
      { name: '大学生比例(%)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', data: RECRUITMENT_TREND.collegeShare, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  };

  const gdpChart = {
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0 },
    grid: { left: 44, right: 44, top: 30, bottom: 24 },
    xAxis: categoryX(DEFENSE_GDP_TREND.years),
    yAxis: [
      { type: 'value', name: 'B$', nameTextStyle: { color: '#5b6a82' }, splitLine: GRID_LINE, axisLabel: LABEL },
      { type: 'value', name: '%GDP', nameTextStyle: { color: '#5b6a82' }, splitLine: { show: false }, axisLabel: LABEL },
    ],
    series: [
      { name: '军费(B$)', type: 'bar', data: DEFENSE_GDP_TREND.budget, barWidth: 18, itemStyle: { color: '#e8a317', borderRadius: [3, 3, 0, 0] } },
      { name: '占GDP(%)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', data: DEFENSE_GDP_TREND.gdpShare, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
    ],
  };

  const intlChart = {
    tooltip: { trigger: 'item', formatter: (p) => `${p.name}: ${p.value} B$` },
    grid: { left: 56, right: 36, top: 10, bottom: 20 },
    xAxis: { type: 'value', splitLine: GRID_LINE, axisLabel: LABEL },
    yAxis: { type: 'category', data: INTL_DEFENSE_COMPARE.data.map((d) => d.name).reverse(), axisLine: AXIS, axisLabel: LABEL },
    series: [{ type: 'bar', barWidth: 13, label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 },
      data: INTL_DEFENSE_COMPARE.data.map((d) => ({ value: d.value, itemStyle: { color: d.color, borderRadius: [0, 3, 3, 0] } })).reverse() }],
  };

  return (
    <>
      <StatGrid className="mb-4">
        <Stat value={PERSONNEL.activeDuty.label} label="现役总兵力" accent="#c41e3a" />
        <Stat value={PERSONNEL.civilianStaff.total} label="文职人员" accent="#8b5cf6" />
        <Stat value={PERSONNEL.recruitment.annual} label="年征兵规模" accent="#22d3ee" />
        <Stat value={SERVICES.capf.stat.split(' ·')[0]} label="武警估算" />
      </StatGrid>
      <Grid cols={2} className="mb-6">
        <Card title={`军种—兵种 旭日图 · ${PERSONNEL.sourceAsOf}`}>
          <EChart option={sunburst} style={{ height: 280 }} />
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>占比为开源估算示意，内环=军种，外环=主要兵种</p>
        </Card>
        <Card title="军衔金字塔 · 编制结构示意">
          <p className="text-[10px] mb-2" style={{ color: 'var(--text-tertiary)' }}>{RANK_PYRAMID.note}（{RANK_PYRAMID.asOf}）</p>
          <RankPyramid levels={RANK_PYRAMID.levels} />
        </Card>
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title={`兵员构成堆叠 · ${FORCE_COMPOSITION.asOf}（${FORCE_COMPOSITION.unit}）`}>
          <EChart option={forceStack} style={{ height: 130 }} />
          <p className="text-[10px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{FORCE_COMPOSITION.note}</p>
        </Card>
        <Card title="征兵规模与大学生比例趋势">
          <EChart option={recruitChart} style={{ height: 200 }} />
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{RECRUITMENT_TREND.note}</p>
        </Card>
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="军费占 GDP 趋势 · SIPRI 口径">
          <EChart option={gdpChart} style={{ height: 220 }} />
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{DEFENSE_GDP_TREND.note}</p>
        </Card>
        <Card title={`国际军费对比 · ${INTL_DEFENSE_COMPARE.asOf}（${INTL_DEFENSE_COMPARE.unit}）`}>
          <EChart option={intlChart} style={{ height: 220 }} />
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{INTL_DEFENSE_COMPARE.note}</p>
        </Card>
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title={`军种人员结构示意 · ${PERSONNEL.sourceAsOf}`}>
          <EChart option={pieChart} style={{ height: 220 }} />
          <p className="text-[10px] mt-2" style={{ color: 'var(--text-tertiary)' }}>来源：{PERSONNEL.source} · 占比为开源估算示意</p>
        </Card>
        <Card title="将官 / 校尉结构 · 公开估算">
          <p className="text-[10px] mb-2" style={{ color: 'var(--text-tertiary)' }}>{PERSONNEL.rankStructure.note}</p>
          <DistBar data={rankDistPairs(PERSONNEL.rankStructure.general)} color="#c41e3a" labelWidth={48} />
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-[10px] mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>尉官以上占比示意</p>
            <DistBar data={rankDistPairs(PERSONNEL.rankStructure.field)} color="#22d3ee" labelWidth={72} />
          </div>
        </Card>
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="文职人员体系">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            {PERSONNEL.civilianStaff.label} · {PERSONNEL.civilianStaff.total}（{PERSONNEL.civilianStaff.sourceAsOf}）— {PERSONNEL.civilianStaff.note}
          </p>
          <div className="space-y-2">
            {PERSONNEL.civilianStaff.categories.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="mono w-20 shrink-0" style={{ color: 'var(--cyber-cyan)' }}>{c.name}</span>
                <div className="flex-1 h-2 rounded" style={{ background: 'var(--bg-base)' }}>
                  <div style={{ width: `${c.share}%`, height: '100%', background: '#8b5cf6', borderRadius: 2, opacity: 0.8 }} />
                </div>
                <span className="mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{c.share}% · {c.desc}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="征兵与武警">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            年度征兵 {PERSONNEL.recruitment.annual}（{PERSONNEL.recruitment.asOf}）— {PERSONNEL.recruitment.note}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {PERSONNEL.recruitment.focus.map((f) => (
              <span key={f} className="text-[10px] px-2 py-0.5 rounded mono" style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}>{f}</span>
            ))}
          </div>
          <div className="p-3 rounded mt-2" style={{ background: 'var(--bg-elevated)' }}>
            <div className="font-semibold text-xs mb-1" style={{ color: 'var(--text-primary)' }}>{SERVICES.capf.title}</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{SERVICES.capf.desc}</p>
          </div>
        </Card>
      </Grid>
      <Card title="编制层级 · 五大军种 + 武警">
        <div className="flex gap-1 flex-wrap mb-3">
          {Object.keys(SERVICES).map((k) => (
            <button key={k} type="button" onClick={() => setSvc(k)} style={tabBtn(svc === k)} className="mono">
              {SERVICES[k].title.split(' ')[0]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{s.title}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded mono" style={{ background: 'rgba(196,30,58,0.16)', color: 'var(--china-red)' }}>{s.tag}</span>
        </div>
        <p className="text-xs mono mb-2" style={{ color: 'var(--fire-gold)' }}>{s.stat}</p>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
        <div className="flex flex-wrap gap-2">
          {s.hierarchy.map((h, i) => (
            <span key={h} className="text-[10px] mono px-2 py-1 rounded flex items-center gap-1" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
              {i > 0 && <span style={{ color: 'var(--text-tertiary)' }}>→</span>}
              {h}
            </span>
          ))}
        </div>
      </Card>
    </>
  );
}

function EquipmentTab() {
  const [mis, setMis] = useState('srbm');
  const [domain, setDomain] = useState('海军');
  const m = MISSILE_SPECTRUM[mis];
  const cat = EQUIPMENT_CATALOG.find((c) => c.domain === domain) || EQUIPMENT_CATALOG[0];

  const navyChart = {
    grid: { left: 80, right: 24, top: 16, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: NAVY_BAR.categories, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
    series: [{ type: 'bar', data: NAVY_BAR.values, barWidth: 14, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', color: LABEL.color } }],
  };

  const airChart = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: LABEL.color } },
    series: [{ type: 'pie', radius: ['52%', '72%'], center: ['50%', '44%'], label: { color: LABEL.color },
      data: AIR_PIE.data.map((d) => ({ value: d.value, name: d.name, itemStyle: { color: d.color } })) }],
  };

  const treeChart = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{
      type: 'tree', data: [EQUIPMENT_TREE], top: '2%', left: '14%', bottom: '2%', right: '18%',
      symbolSize: 7, orient: 'LR', initialTreeDepth: 2, expandAndCollapse: true,
      label: { position: 'left', verticalAlign: 'middle', align: 'right', fontSize: 10, color: '#e2e8f0' },
      leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left', color: LABEL.color, fontSize: 9 } },
      itemStyle: { color: '#c41e3a', borderColor: '#c41e3a' },
      lineStyle: { color: 'rgba(148,163,184,0.3)' },
      emphasis: { focus: 'descendant' },
    }],
  };

  const compareChart = {
    tooltip: { trigger: 'item', formatter: (p) => `${p.name}: ${p.value.toLocaleString()}` },
    grid: { left: 96, right: 48, top: 10, bottom: 24 },
    xAxis: { type: 'log', min: 10, splitLine: GRID_LINE, axisLabel: LABEL },
    yAxis: { type: 'category', data: EQUIPMENT_COMPARE.data.map((d) => d.name).reverse(), axisLine: AXIS, axisLabel: LABEL },
    series: [{ type: 'bar', barWidth: 13, label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 },
      data: EQUIPMENT_COMPARE.data.map((d) => ({ value: d.value, itemStyle: { color: d.color, borderRadius: [0, 3, 3, 0] } })).reverse() }],
  };

  const timelineChart = {
    tooltip: { trigger: 'item', formatter: (p) => `${p.data.value[0]} · ${p.data.name}` },
    grid: { left: 50, right: 24, top: 30, bottom: 24 },
    xAxis: { type: 'value', min: 2011, max: 2025, interval: 2, axisLabel: { ...LABEL, formatter: '{value}' }, splitLine: GRID_LINE },
    yAxis: { type: 'category', data: ['火箭军', '空军', '海军'], axisLine: AXIS, axisLabel: LABEL },
    series: [{
      type: 'scatter', symbolSize: 13,
      label: { show: true, position: 'top', formatter: (p) => p.data.name, fontSize: 9, color: LABEL.color },
      data: SERVICE_TIMELINE.map((t) => ({ name: t.name, value: [t.year, t.domain], itemStyle: { color: t.color } })),
    }],
  };

  const modRadar = {
    tooltip: { trigger: 'item' },
    legend: { ...LEGEND, top: 0 },
    radar: {
      indicator: MODERNIZATION_RADAR.indicators, axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
    },
    series: [{ type: 'radar', data: [
      { value: MODERNIZATION_RADAR.navy, name: '海军', lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.12)' }, itemStyle: { color: '#22d3ee' } },
      { value: MODERNIZATION_RADAR.air, name: '空军', lineStyle: { color: '#8b5cf6', width: 2 }, areaStyle: { color: 'rgba(139,92,246,0.12)' }, itemStyle: { color: '#8b5cf6' } },
    ] }],
  };

  return (
    <>
      <Grid cols={2} className="mb-6">
        <Card title={`海军力量 · ${NAVY_BAR.asOf}（艘 · 估算）`}><EChart option={navyChart} style={{ height: 220 }} /></Card>
        <Card title={`空军现代化 · ${AIR_PIE.asOf}`}><EChart option={airChart} style={{ height: 220 }} /></Card>
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="主战装备数量对比 · 对数刻度">
          <EChart option={compareChart} style={{ height: 240 }} />
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>来源：{EQUIPMENT_COMPARE.asOf} · {EQUIPMENT_COMPARE.note}</p>
        </Card>
        <Card title="海空军现代化率雷达 · 公开评估">
          <EChart option={modRadar} style={{ height: 240 }} />
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{MODERNIZATION_RADAR.note}</p>
        </Card>
      </Grid>
      <Card title="主战装备谱系树 · 点击节点展开/折叠" className="mb-6">
        <EChart option={treeChart} style={{ height: 320 }} />
      </Card>
      <Card title="装备服役 / 亮相年代时间线 · 公开报道" className="mb-6">
        <EChart option={timelineChart} style={{ height: 220 }} />
        <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>横轴为年份，纵轴为军种；点位为里程碑式列装/亮相节点示意。</p>
      </Card>
      <Card title="主要装备谱系 · 公开报道整理" className="mb-6">
        <div className="flex gap-1 flex-wrap mb-3">
          {EQUIPMENT_CATALOG.map((c) => (
            <button key={c.domain} type="button" onClick={() => setDomain(c.domain)} style={tabBtn(domain === c.domain)} className="mono">{c.domain}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                <th className="text-left py-2 pr-3">型号</th>
                <th className="text-left py-2 pr-3">类型</th>
                <th className="text-left py-2 pr-3">状态</th>
                <th className="text-left py-2 pr-3">数量</th>
                <th className="text-left py-2">备注</th>
              </tr>
            </thead>
            <tbody>
              {cat.items.map((item) => (
                <tr key={item.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td className="py-2 pr-3 font-medium mono" style={{ color: cat.accent }}>{item.name}</td>
                  <td className="py-2 pr-3" style={{ color: 'var(--text-secondary)' }}>{item.type}</td>
                  <td className="py-2 pr-3"><span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981' }}>{item.status}</span></td>
                  <td className="py-2 pr-3 mono" style={{ color: 'var(--text-primary)' }}>{item.qty}</td>
                  <td className="py-2" style={{ color: 'var(--text-tertiary)' }}>{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="火箭军 · 弹道导弹谱系">
        <div className="flex gap-1 flex-wrap mb-3">
          {Object.keys(MISSILE_SPECTRUM).map((k) => (
            <button key={k} type="button" onClick={() => setMis(k)} style={tabBtn(mis === k)} className="mono">
              {MISSILE_SPECTRUM[k].title.match(/\(([^)]+)\)/)?.[1] || k.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between"><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{m.title}</span><span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{m.variants}</span></div>
        <p className="text-xs mt-2 mb-3" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
        <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-tertiary)' }}>射程</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{m.range}</span></div>
        <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}><div style={{ width: `${m.width}%`, height: '100%', background: 'linear-gradient(90deg,#c41e3a,#e8a317)', transition: 'width .4s' }} /></div>
        <div className="mt-3 text-xs"><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>战略覆盖：</span><span style={{ color: 'var(--text-tertiary)' }}>{m.target}</span></div>
      </Card>
    </>
  );
}

function TechTab() {
  const [sel, setSel] = useState('ai');
  const t = TECH_DOMAINS.find((x) => x.id === sel) || TECH_DOMAINS[0];

  const heatData = useMemo(() => {
    const out = [];
    TRL_MATRIX.data.forEach((row, stageIdx) => row.forEach((v, domainIdx) => out.push([domainIdx, stageIdx, v])));
    return out;
  }, []);

  const trlHeat = {
    tooltip: { position: 'top', formatter: (p) => `${TRL_MATRIX.domains[p.data[0]]} · ${TRL_MATRIX.stages[p.data[1]]}: ${p.data[2]}` },
    grid: { left: 70, right: 20, top: 10, bottom: 80 },
    xAxis: { type: 'category', data: TRL_MATRIX.domains, axisLabel: { ...LABEL, rotate: 32, interval: 0 }, axisLine: AXIS, splitArea: { show: true } },
    yAxis: { type: 'category', data: TRL_MATRIX.stages, axisLabel: LABEL, axisLine: AXIS, splitArea: { show: true } },
    visualMap: { min: 20, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#141c2b', '#7c2d12', '#e8a317', '#22d3ee'] }, textStyle: { color: LABEL.color, fontSize: 10 } },
    series: [{ type: 'heatmap', data: heatData, label: { show: true, color: '#0a0e17', fontSize: 9 }, emphasis: { itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.5)' } } }],
  };

  const rdChart = {
    tooltip: { trigger: 'axis' },
    grid: { left: 44, right: 16, top: 16, bottom: 24 },
    xAxis: categoryX(RD_INVESTMENT_TREND.years),
    yAxis: valueY({ name: '指数', nameTextStyle: { color: '#5b6a82' } }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 7, data: RD_INVESTMENT_TREND.index, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } }],
  };

  const sankey = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{
      type: 'sankey', data: MCF_SANKEY.nodes, links: MCF_SANKEY.links,
      top: 10, bottom: 10, left: 10, right: 110, emphasis: { focus: 'adjacency' },
      label: { color: '#e2e8f0', fontSize: 10 },
      lineStyle: { color: 'gradient', opacity: 0.42, curveness: 0.5 },
      itemStyle: { borderWidth: 0 }, nodeGap: 10,
    }],
  };

  return (
    <>
      <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        尖端军事科技按 TRL（Technology Readiness Level，1–9）标注成熟度；数据来自公开防务报告与科研披露，不含涉密项目细节。
      </p>
      <Grid cols={2} className="mb-6">
        <Card title="尖端科技成熟度矩阵 · 领域 × 研发阶段">
          <EChart option={trlHeat} style={{ height: 280 }} />
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{TRL_MATRIX.note}</p>
        </Card>
        <Card title="国防科技研发投入趋势 · 指数（2014=100）">
          <EChart option={rdChart} style={{ height: 240 }} />
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{RD_INVESTMENT_TREND.note}</p>
        </Card>
      </Grid>
      <Card title="军民融合关系图 · 民口 → 领域 → 军用（Sankey）" className="mb-6">
        <EChart option={sankey} style={{ height: 300 }} />
        <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{MCF_SANKEY.note}</p>
      </Card>
      <Grid cols={3} className="mb-4">
        {TECH_DOMAINS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSel(d.id)}
            className="text-left p-3 rounded os-card"
            style={{
              border: `1px solid ${sel === d.id ? d.trl >= 7 ? '#22d3ee' : '#e8a317' : 'var(--border-subtle)'}`,
              background: sel === d.id ? 'rgba(34,211,238,0.08)' : 'var(--bg-elevated)',
              cursor: 'pointer',
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{d.title}</span>
              <span className="text-[10px] mono px-1.5 py-0.5 rounded font-bold" style={{ background: `${TRL_COLORS[d.trl - 1]}22`, color: TRL_COLORS[d.trl - 1] }}>TRL {d.trl}</span>
            </div>
            <span className="text-[10px] mono" style={{ color: 'var(--fire-gold)' }}>{d.status}</span>
          </button>
        ))}
      </Grid>
      <Card title={t.title}>
        <div className="flex flex-wrap gap-3 mb-3 text-xs">
          <span className="mono px-2 py-1 rounded" style={{ background: `${TRL_COLORS[t.trl - 1]}22`, color: TRL_COLORS[t.trl - 1] }}>TRL {t.trl} · {t.trlLabel}</span>
          <span className="mono px-2 py-1 rounded" style={{ background: 'rgba(196,30,58,0.14)', color: 'var(--china-red)' }}>{t.status}</span>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
        <div className="mb-3">
          <div className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>代表项目 / 方向</div>
          <div className="flex flex-wrap gap-1">
            {t.programs.map((p) => (
              <span key={p} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}>{p}</span>
            ))}
          </div>
        </div>
        <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>来源：{t.source}</p>
        <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>TRL 进度</div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="flex-1 h-2 rounded-sm" style={{ background: n <= t.trl ? TRL_COLORS[t.trl - 1] : 'var(--bg-base)', opacity: n <= t.trl ? 0.9 : 0.4 }} title={`TRL ${n}`} />
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}

function TheaterTab() {
  const [sel, setSel] = useState('east');
  const th = THEATERS.find((x) => x.id === sel) || THEATERS[0];

  const theaterForceChart = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { ...LEGEND, top: 0 },
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    xAxis: categoryX(THEATER_FORCE.theaters, { interval: 0 }),
    yAxis: valueY({ max: 280 }),
    series: THEATER_FORCE.series.map((seg) => ({ name: seg.name, type: 'bar', stack: 't', barWidth: 30, data: seg.data, itemStyle: { color: seg.color } })),
  };

  return (
    <>
      <Card title="五大战区辖区 · 公开资料" className="mb-4">
        <TheaterLegend selected={sel} onSelect={setSel} />
        <MilitaryMap mode="theater" selectedTheater={sel} onTheaterClick={setSel} style={{ height: 400, marginTop: 12 }} />
      </Card>
      <Card title={`战区力量侧重对比 · ${THEATER_FORCE.asOf}`} className="mb-4">
        <EChart option={theaterForceChart} style={{ height: 240 }} />
        <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{THEATER_FORCE.note}</p>
      </Card>
      <Grid cols={2} className="mb-4">
        <Card title={th.name}>
          <div className="space-y-2 text-xs">
            <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>机关驻地</span> · <span className="mono" style={{ color: th.color }}>{th.hq}</span></div>
            <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>战略方向</span> · {th.focus}</div>
            <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>司令</span> · {th.commander}</div>
            <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>海军</span> · {th.fleet}</div>
            <p className="leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{th.note}</p>
          </div>
        </Card>
        <Card title="辖区省份 · 集团军归属">
          <div className="flex flex-wrap gap-1 mb-3">
            {th.provinces.map((p) => (
              <span key={p} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${th.color}18`, color: th.color }}>{p}</span>
            ))}
          </div>
          <div className="space-y-1.5">
            {th.armyGroups.map((g) => (
              <div key={g} className="text-[11px] mono px-2 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{g}</div>
            ))}
          </div>
        </Card>
      </Grid>
      <Card title="战区对照 · 一表速览">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th className="text-left py-2">战区</th><th className="text-left py-2">驻地</th><th className="text-left py-2">方向</th><th className="text-left py-2">集团军</th>
              </tr>
            </thead>
            <tbody>
              {THEATERS.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', opacity: sel === t.id ? 1 : 0.7 }}
                  onClick={() => setSel(t.id)}>
                  <td className="py-2 mono font-medium" style={{ color: t.color }}>{t.name}</td>
                  <td className="py-2">{t.hq}</td>
                  <td className="py-2" style={{ color: 'var(--text-secondary)' }}>{t.focus}</td>
                  <td className="py-2" style={{ color: 'var(--text-tertiary)' }}>{t.armyGroups.length} 个集团军</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

const LIFT_STRENGTH = [
  { name: '铁路机动', val: 85, color: '#10b981', note: '全军铁路输送体系' },
  { name: '管线补给', val: 60, color: '#22d3ee', note: '西南/西北管线网' },
  { name: '战略空运', val: 55, color: '#8b5cf6', note: '运-20 机队 50+ 架' },
  { name: '战略海运', val: 45, color: '#e8a317', note: '民用滚装 + 补给舰（仍为短板）' },
];

function LogisticsTab() {
  const liftChart = {
    tooltip: { trigger: 'item', formatter: (p) => `${p.name}: ${p.value}/100` },
    grid: { left: 70, right: 30, top: 10, bottom: 20 },
    xAxis: { type: 'value', max: 100, splitLine: GRID_LINE, axisLabel: LABEL },
    yAxis: { type: 'category', data: LIFT_STRENGTH.map((l) => l.name).reverse(), axisLine: AXIS, axisLabel: LABEL },
    series: [{ type: 'bar', barWidth: 16, label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 },
      data: LIFT_STRENGTH.map((l) => ({ value: l.val, itemStyle: { color: l.color, borderRadius: [0, 3, 3, 0] } })).reverse() }],
  };

  return (
    <>
      <Grid cols={3} className="mb-4">
        <Stat value={LOGISTICS.hubs.length} label="联勤保障中心" accent="#10b981" />
        <Stat value={LOGISTICS.transport.strategicAirlift.capacity.split(' ')[0]} label="战略空运" accent="#22d3ee" />
        <Stat value="5" label="战区联勤中心" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="五大联勤保障中心 · 地理分布">
          <MilitaryMap mode="logistics" style={{ height: 320 }} />
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>菱形标注为联勤保障中心驻地（公开报道量级），覆盖五大战略方向。</p>
        </Card>
        <Card title="战略投送能力强度 · 相对评估示意">
          <EChart option={liftChart} style={{ height: 220 }} />
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>强度为公开评估相对值（0–100）示意；远海海运投送仍为主要短板。</p>
        </Card>
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title={`联勤保障部队结构 · ${LOGISTICS.asOf}`}>
          <div className="space-y-2">
            {LOGISTICS.structure.map((row, i) => (
              <div key={row.level} className="flex gap-2 items-start text-xs">
                <span className="mono shrink-0 w-5 text-center py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981' }}>{i + 1}</span>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{row.level}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{row.role}</div>
                  <div className="text-[10px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{row.location}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{SERVICES.jls.desc}</p>
        </Card>
        <Card title="运输投送能力 · 公开评估">
          {Object.values(LOGISTICS.transport).map((t) => (
            <div key={t.label} className="mb-3 pb-3 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t.label}</span>
                <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{t.capacity}</span>
              </div>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{t.note}</p>
            </div>
          ))}
        </Card>
      </Grid>
      <Card title="主要联勤枢纽 · 公开报道">
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))' }}>
          {LOGISTICS.hubs.map((h) => (
            <div key={h.name} className="p-3 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{h.name}</div>
              <div className="flex gap-1 mb-1">
                <span className="text-[9px] mono px-1 rounded" style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981' }}>{h.type}</span>
                <span className="text-[9px] mono px-1 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}>{h.region}</span>
              </div>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{h.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function BasesTab() {
  const [sel, setSel] = useState('');
  const [typeF, setTypeF] = useState('');
  const base = MILITARY_BASES.find((b) => b.id === sel);
  const filtered = useMemo(() => (typeF ? MILITARY_BASES.filter((b) => b.type === typeF) : MILITARY_BASES), [typeF]);

  return (
    <>
      <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        以下基地/港口/机场坐标来自公开报道与开源卫星标注，精度为城市/设施量级，<span className="mono" style={{ color: 'var(--china-red)' }}>非精确军事情报</span>，仅供研究参考。
      </p>
      <Card title="主要基地分布 · 公开标注" className="mb-4">
        <div className="flex flex-wrap gap-1 mb-2">
          <button type="button" onClick={() => setTypeF('')} style={tabBtn(!typeF)} className="mono text-[10px]">全部</button>
          {[...new Set(MILITARY_BASES.map((b) => b.type))].map((t) => (
            <button key={t} type="button" onClick={() => setTypeF(t)} style={tabBtn(typeF === t)} className="mono text-[10px]">{t}</button>
          ))}
        </div>
        <BaseTypeLegend />
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-[10px] mono flex items-center gap-1" style={{ color: '#e8a317' }}><span style={{ width: 14, height: 0, borderTop: '2px dashed #e8a317', display: 'inline-block' }} />第一岛链</span>
          <span className="text-[10px] mono flex items-center gap-1" style={{ color: '#22d3ee' }}><span style={{ width: 14, height: 0, borderTop: '2px dashed #22d3ee', display: 'inline-block' }} />第二岛链</span>
        </div>
        <MilitaryMap mode="bases-global" selectedBase={sel} onBaseClick={setSel} style={{ height: 420, marginTop: 8 }} />
      </Card>
      <Grid cols={2}>
        <Card title={`基地列表 · ${filtered.length} 处`}>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {filtered.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSel(b.id)}
                className="w-full text-left px-2 py-1.5 rounded text-[11px]"
                style={{
                  background: sel === b.id ? 'rgba(34,211,238,0.12)' : 'var(--bg-elevated)',
                  border: `1px solid ${sel === b.id ? '#22d3ee' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                }}
              >
                <span className="mono font-medium" style={{ color: 'var(--text-primary)' }}>{b.name}</span>
                <span className="mx-1" style={{ color: 'var(--text-tertiary)' }}>·</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{b.type} · {b.region}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title={base ? base.name : '选择基地查看详情'}>
          {base ? (
            <div className="space-y-2 text-xs">
              <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>类型</span> · {base.type} / {base.branch}</div>
              <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>区域</span> · {base.region}</div>
              <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>坐标</span> · <span className="mono">{base.coord.join(', ')}</span>（公开参考）</div>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{base.note}</p>
              <p className="text-[10px] pt-2 border-t" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>来源：{base.source}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>点击地图散点或左侧列表查看详情</p>
          )}
        </Card>
      </Grid>
    </>
  );
}

function ServicesTab() {
  return (
    <div className="mil-section space-y-6">
      <PersonnelTab />
      <Card title={`联勤保障概要 · ${LOGISTICS.asOf}`}>
        <StatGrid className="mb-4">
          <Stat value={LOGISTICS.hubs.length} label="联勤保障中心" accent="#10b981" />
          <Stat value={LOGISTICS.transport.strategicAirlift.capacity.split(' ')[0]} label="战略空运" accent="#22d3ee" />
          <Stat value="5" label="战区联勤中心" />
        </StatGrid>
        <Grid cols={2}>
          <div>
            <MilitaryMap mode="logistics" style={{ height: 260 }} />
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>菱形标注为联勤保障中心驻地（公开报道量级）。</p>
          </div>
          <div className="space-y-2">
            {LOGISTICS.structure.slice(0, 4).map((row, i) => (
              <div key={row.level} className="flex gap-2 items-start text-xs">
                <span className="mono shrink-0 w-5 text-center py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981' }}>{i + 1}</span>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{row.level}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{row.role}</div>
                </div>
              </div>
            ))}
          </div>
        </Grid>
      </Card>
    </div>
  );
}

function CombatTab() {
  return (
    <div className="mil-section space-y-6">
      <EquipmentTab />
      <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <TechTab />
      </div>
    </div>
  );
}

function IslandTab() {
  const [sel, setSel] = useState('east');
  const [baseSel, setBaseSel] = useState('');
  const [phaseIdx, setPhaseIdx] = useState(STRAITS_POSTURE.phases.length - 1);
  const th = THEATERS.find((x) => x.id === sel) || THEATERS[0];
  const frontlineBases = useMemo(
    () => MILITARY_BASES.filter((b) => STRAITS_POSTURE.frontlineRegions.includes(b.region)),
    [],
  );
  const base = MILITARY_BASES.find((b) => b.id === baseSel);

  const theaterForceChart = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { ...LEGEND, top: 0 },
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    xAxis: categoryX(THEATER_FORCE.theaters, { interval: 0 }),
    yAxis: valueY({ max: 280 }),
    series: THEATER_FORCE.series.map((seg) => ({ name: seg.name, type: 'bar', stack: 't', barWidth: 30, data: seg.data, itemStyle: { color: seg.color } })),
  };

  const deterrenceRadar = {
    radar: {
      indicator: [{ name: '高超声速', max: 100 }, { name: '反舰打击', max: 100 }, { name: '态势感知', max: 100 }, { name: '区域拒止', max: 100 }, { name: '常态巡航', max: 100 }],
      axisName: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
    },
    series: [{ type: 'radar', data: [{ value: [88, 90, 85, 92, 95], name: 'A2/AD 气泡 · 公开评估', lineStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.14)' } }] }],
  };

  return (
    <>
      <StatGrid className="mb-4">
        {STRAITS_POSTURE.anchors.map((a) => (
          <Stat key={a.label} value={a.value} label={a.label} accent={a.accent} />
        ))}
      </StatGrid>

      <Card title={`台海 / 岛链战略阶段 · ${STRAITS_POSTURE.asOf}`} className="mb-4">
        <TimelineBar stages={STRAITS_POSTURE.phases} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {STRAITS_POSTURE.phases[phaseIdx].desc}
          <span className="block mt-2 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{STRAITS_POSTURE.note}</span>
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Link to="/straits" className="mil-island-link">台海重力博弈 · 完整模型 ↗</Link>
          <span className="text-[10px] mono self-center" style={{ color: 'var(--text-tertiary)' }}>{ISLAND_CHAINS.note}</span>
        </div>
      </Card>

      <Grid cols={2} className="mb-4">
        <Card title="物理威慑 · A2/AD 能力雷达">
          <EChart option={deterrenceRadar} style={{ height: 220 }} />
        </Card>
        <Card title={`战区力量侧重 · ${THEATER_FORCE.asOf}`}>
          <EChart option={theaterForceChart} style={{ height: 220 }} />
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{THEATER_FORCE.note}</p>
        </Card>
      </Grid>

      <Card title="五大战区辖区 · 东部方向默认高亮" className="mb-4">
        <TheaterLegend selected={sel} onSelect={setSel} />
        <MilitaryMap mode="theater" selectedTheater={sel} onTheaterClick={setSel} style={{ height: 380, marginTop: 12 }} />
      </Card>

      <Grid cols={2} className="mb-4">
        <Card title={th.name}>
          <div className="space-y-2 text-xs">
            <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>机关驻地</span> · <span className="mono" style={{ color: th.color }}>{th.hq}</span></div>
            <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>战略方向</span> · {th.focus}</div>
            <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>司令</span> · {th.commander}</div>
            <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>海军</span> · {th.fleet}</div>
            <p className="leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{th.note}</p>
          </div>
        </Card>
        <Card title="辖区省份 · 集团军归属">
          <div className="flex flex-wrap gap-1 mb-3">
            {th.provinces.map((p) => (
              <span key={p} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${th.color}18`, color: th.color }}>{p}</span>
            ))}
          </div>
          <div className="space-y-1.5">
            {th.armyGroups.map((g) => (
              <div key={g} className="text-[11px] mono px-2 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{g}</div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="第一岛链前沿 · 公开标注基地" className="mb-4">
        <BaseTypeLegend />
        <div className="flex flex-wrap gap-2 mt-1 mb-2">
          <span className="text-[10px] mono flex items-center gap-1" style={{ color: '#e8a317' }}><span style={{ width: 14, height: 0, borderTop: '2px dashed #e8a317', display: 'inline-block' }} />第一岛链</span>
          <span className="text-[10px] mono flex items-center gap-1" style={{ color: '#22d3ee' }}><span style={{ width: 14, height: 0, borderTop: '2px dashed #22d3ee', display: 'inline-block' }} />第二岛链</span>
        </div>
        <MilitaryMap mode="bases-global" selectedBase={baseSel} onBaseClick={setBaseSel} style={{ height: 360, marginTop: 8 }} />
        <p className="text-[10px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          坐标为公开报道/开源地图量级，<span className="mono" style={{ color: 'var(--china-red)' }}>非精确军事情报</span>。
        </p>
      </Card>

      <Grid cols={2}>
        <Card title={`东南沿海前沿 · ${frontlineBases.length} 处`}>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {frontlineBases.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBaseSel(b.id)}
                className="w-full text-left px-2 py-1.5 rounded text-[11px]"
                style={{
                  background: baseSel === b.id ? 'rgba(34,211,238,0.12)' : 'var(--bg-elevated)',
                  border: `1px solid ${baseSel === b.id ? '#22d3ee' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                }}
              >
                <span className="mono font-medium" style={{ color: 'var(--text-primary)' }}>{b.name}</span>
                <span className="mx-1" style={{ color: 'var(--text-tertiary)' }}>·</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{b.type} · {b.region}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title={base ? base.name : '选择基地查看详情'}>
          {base ? (
            <div className="space-y-2 text-xs">
              <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>类型</span> · {base.type} / {base.branch}</div>
              <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>区域</span> · {base.region}</div>
              <div><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>坐标</span> · <span className="mono">{base.coord.join(', ')}</span>（公开参考）</div>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{base.note}</p>
              <p className="text-[10px] pt-2 border-t" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>来源：{base.source}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>点击地图散点或左侧列表查看详情</p>
          )}
        </Card>
      </Grid>
    </>
  );
}

function LeadersTab() {
  const [rankF, setRankF] = useState('');
  const [branchF, setBranchF] = useState('');
  const [q, setQ] = useState('');

  const branches = useMemo(
    () => [...new Set(FIGURE_MILITARY_2026.map((f) => f.fields?.milBranch).filter(Boolean))].sort(),
    [],
  );

  const rankCounts = useMemo(() => {
    const counts = { 上将: 0, 中将: 0, 少将: 0 };
    FIGURE_MILITARY_2026.forEach((f) => {
      const r = f.fields?.milRank;
      if (r && counts[r] != null) counts[r] += 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => FIGURE_MILITARY_2026.filter((f) => {
    const rank = f.fields?.milRank;
    const branch = f.fields?.milBranch;
    const role = f.fields?.role || f.role || '';
    if (rankF && rank !== rankF) return false;
    if (branchF && branch !== branchF) return false;
    if (q.trim()) {
      const needle = q.trim();
      if (!f.name.includes(needle) && !role.includes(needle) && !(f.org || '').includes(needle)) return false;
    }
    return true;
  }), [rankF, branchF, q]);

  const rankChart = {
    tooltip: { trigger: 'item' },
    grid: { left: 44, right: 16, top: 16, bottom: 24 },
    xAxis: categoryX(['上将', '中将', '少将']),
    yAxis: valueY({ name: '人', nameTextStyle: { color: '#5b6a82' } }),
    series: [{
      type: 'bar',
      barWidth: 36,
      data: ['上将', '中将', '少将'].map((r) => ({
        value: rankCounts[r] || 0,
        itemStyle: { color: RANK_COLORS[r], borderRadius: [3, 3, 0, 0] },
      })),
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 10 },
    }],
  };

  const branchPie = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    series: [{
      type: 'pie',
      radius: ['46%', '68%'],
      center: ['50%', '42%'],
      label: { color: LABEL.color, fontSize: 10 },
      data: branches.map((b, i) => ({
        name: b,
        value: FIGURE_MILITARY_2026.filter((f) => f.fields?.milBranch === b).length,
        itemStyle: { color: ['#c41e3a', '#22d3ee', '#8b5cf6', '#e8a317', '#10b981', '#64748b'][i % 6] },
      })),
    }],
  };

  const rankItems = [
    { key: '', label: '全部军衔' },
    { key: '上将', label: '上将', accent: RANK_COLORS.上将 },
    { key: '中将', label: '中将', accent: RANK_COLORS.中将 },
    { key: '少将', label: '少将', accent: RANK_COLORS.少将 },
  ];

  const branchItems = [{ key: '', label: '全部军种' }, ...branches.map((b) => ({ key: b, label: b }))];

  return (
    <>
      <StatGrid className="mb-4">
        <Stat value={String(rankCounts.上将 || 0)} label="上将（公开名录）" accent={RANK_COLORS.上将} />
        <Stat value={String(rankCounts.中将 || 0)} label="中将" accent={RANK_COLORS.中将} />
        <Stat value={String(rankCounts.少将 || 0)} label="少将（公开子集）" accent={RANK_COLORS.少将} />
        <Stat value={String(FIGURE_MILITARY_COUNT)} label="库内总条数" accent="#8b5cf6" />
      </StatGrid>

      <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {FIGURE_MILITARY_META.notes} · 截至 {FIGURE_MILITARY_META.asOf}。本页仅展示 seed 库中可核实条目，<span className="mono" style={{ color: 'var(--china-red)' }}>非官方全集</span>。
      </p>

      <div className="mil-leaders-grid mb-4">
        <Card title="军衔结构 · 公开名录统计">
          <EChart option={rankChart} style={{ height: 200 }} />
        </Card>
        <Card title="军种分布 · 库内条目">
          <EChart option={branchPie} style={{ height: 200 }} />
        </Card>
      </div>

      <Card title="将官检索 · 库内条目" className="mb-4">
        <div className="flex flex-wrap gap-2 mb-3 items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="检索姓名 / 职务…"
            aria-label="检索将官"
            className="text-xs mono px-2 py-1.5 rounded flex-1"
            style={{ minWidth: 160, background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
          />
          <Link to="/talent" className="mil-island-link shrink-0">人才库全览 ↗</Link>
        </div>
        <SelectorBar items={rankItems} activeKey={rankF} onSelect={setRankF} />
        <SelectorBar items={branchItems} activeKey={branchF} onSelect={setBranchF} />
        <p className="text-[10px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>命中 {filtered.length} / {FIGURE_MILITARY_COUNT} 条</p>
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
          {filtered.map((f) => {
            const rank = f.fields?.milRank || '—';
            const role = f.fields?.role || f.role || '—';
            const branch = f.fields?.milBranch || '—';
            return (
              <div key={f.id || `${f.name}-${role}`} className="mil-leader-row" tabIndex={0}>
                <span className="mil-rank-badge" style={{ background: `${RANK_COLORS[rank] || '#64748b'}22`, color: RANK_COLORS[rank] || '#64748b' }}>{rank}</span>
                <div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{f.name}</div>
                  <div className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{role}</div>
                  <div className="text-[10px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{branch} · {f.source?.split('·')[0]?.trim() || '公开报道'}</div>
                </div>
                <Link to="/talent" className="text-[10px] mono shrink-0 self-center" style={{ color: 'var(--cyber-cyan)' }} aria-label={`${f.name} 人才库`}>↗</Link>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="军衔金字塔 · 编制结构示意">
        <p className="text-[10px] mb-2" style={{ color: 'var(--text-tertiary)' }}>{RANK_PYRAMID.note}（{RANK_PYRAMID.asOf}）</p>
        <RankPyramid levels={RANK_PYRAMID.levels} />
      </Card>
    </>
  );
}

export default function Page() {
  const [tab, setTab] = useState('strategy');

  return (
    <div className="ink-observatory mil-wrap">
      <PageHeader
        badge="Military · 全维度透视"
        title="中国军事力量全维度透视"
        subtitle={`岛链突破 · 战区体制 · A2/AD · 算力主权 —— 公开资料整理 · 截至 ${MILITARY_INTEL_META.asOf}`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          <Link to="/straits" className="mil-island-link">台海重力博弈 ↗</Link>
          <Link to="/talent" className="text-[11px] mono px-2 py-1 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}>
            军事将官人才库 · {FIGURE_MILITARY_COUNT} 条 ↗
          </Link>
        </div>
      </PageHeader>

      <IntroCard className="mb-6 mil-intro">
        本模块以<strong style={{ color: 'var(--text-primary)' }}>公开 OSINT</strong>整理解放军五大战区、军种结构与主战装备谱系，锚定
        <strong style={{ color: 'var(--china-red)' }}>岛链突破</strong>与
        <strong style={{ color: 'var(--fire-gold)' }}>A2/AD</strong>物理威慑向量。
        数值均标注 asOf / 估算区间，<span className="mono" style={{ color: 'var(--text-tertiary)' }}>不含涉密坐标或未公开编制</span>；
        台海终局计算见<strong style={{ color: 'var(--cyber-cyan)' }}>台海模块</strong>，将官名录衔接<strong style={{ color: 'var(--cyber-cyan)' }}>人才库</strong> seed 数据。
      </IntroCard>

      <div className="mil-sticky-nav">
        <TabBar tabs={TABS} value={tab} onChange={setTab} accent="var(--china-red)" sticky />
      </div>

      <div className="os-reveal-stagger">
        {tab === 'strategy' && <div className="mil-section"><OverviewTab /></div>}
        {tab === 'services' && <ServicesTab />}
        {tab === 'combat' && <CombatTab />}
        {tab === 'island' && <div className="mil-section"><IslandTab /></div>}
        {tab === 'leaders' && <div className="mil-section"><LeadersTab /></div>}
      </div>

      <FrameworkTrio cards={[
        { title: '盐铁逻辑', subtitle: '命脉装备 · 战略底座', body: '导弹谱系、核威慑、A2/AD 能力是当代盐铁专营的军事映射——守成者最不愿失去的物理筹码。', pillars: [['核威慑', '二次打击可信。'], ['A2/AD', '区域拒止。'], ['联勤', '投送与补给。']] },
        { title: '摸石头方法论', subtitle: '迭代 · 灰度 · 验证', body: '装备列装与作战概念同步迭代——从近海防御到远海护卫，从机械化到信息化智能化的渐进式跃迁。', pillars: [['战区', '五大战区体制。'], ['装备', 'TRL 分层列装。'], ['演训', '实战化检验。']] },
        { title: '升级路径', subtitle: '从数量到质量', body: '裁军增效、军改深化、新域新质作战力量——从规模型向质量效能型的结构性升级。', pillars: [['智能化', '算力主权。'], ['航天', '低轨星座。'], ['联合作战', '体系对抗。']] },
      ]} />

      <ModuleFooter
        moduleId="military"
        disclaimer={`公开资料整理 · 截至 ${MILITARY_INTEL_META.asOf} · 来源：${MILITARY_INTEL_META.sources.join('、')}。${MILITARY_INTEL_META.disclaimer}`}
      />
    </div>
  );
}
