import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import MilitaryMap, { BaseTypeLegend, TheaterLegend } from './MilitaryMap.jsx';
import { FIGURE_MILITARY_COUNT } from '../../lib/db/figureMilitary2026.js';
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
} from '../../lib/db/militaryIntel2026.js';

const TABS = [
  ['overview', '总览'],
  ['personnel', '人员'],
  ['equipment', '装备'],
  ['tech', '科技'],
  ['theater', '战区'],
  ['logistics', '联勤'],
  ['bases', '基地'],
];

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

function DistBars({ data, color = '#c41e3a', max, labelW = 56 }) {
  const vals = data.map((row) => parseNum(row.share ?? row.count ?? row[1]));
  const top = max || Math.max(...vals, 1);
  return (
    <div className="space-y-1.5">
      {data.map((row, i) => {
        const k = row.rank || row.name || row[0];
        const n = row.share ?? row.count ?? row[1];
        const note = row.note || row.label;
        const v = parseNum(n);
        return (
          <div key={k || i} className="flex items-center gap-2">
            <span className="text-[11px] mono shrink-0 text-right" style={{ width: labelW, color: 'var(--text-secondary)' }}>{k}</span>
            <span className="flex-1 rounded-sm" style={{ height: 13, background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', inset: 0, width: `${(v / top) * 100}%`, background: color, opacity: 0.75, borderRadius: 2 }} />
            </span>
            <span className="text-[10px] mono shrink-0 text-right" style={{ width: 72, color: 'var(--text-tertiary)' }}>{n}{note ? ` · ${note}` : ''}</span>
          </div>
        );
      })}
    </div>
  );
}

function SourceFooter() {
  return (
    <p className="text-xs mt-8 pt-4 border-t leading-relaxed" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>
      <span className="mono" style={{ color: 'var(--china-red)' }}>公开资料整理</span>
      {' · '}截至 {MILITARY_INTEL_META.asOf} · 来源：{MILITARY_INTEL_META.sources.join('、')}。
      {MILITARY_INTEL_META.disclaimer}
    </p>
  );
}

function OverviewTab() {
  const budgetChart = {
    grid: { left: 44, right: 16, top: 16, bottom: 24 },
    xAxis: { type: 'category', data: BUDGET_TREND.years, axisLine: { lineStyle: { color: '#27324a' } } },
    yAxis: { type: 'value', name: 'B$', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    series: [{ type: 'bar', data: BUDGET_TREND.values, barWidth: 26, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } }],
  };

  const deterrenceRadar = {
    radar: {
      indicator: [{ name: '高超声速', max: 100 }, { name: '反舰打击', max: 100 }, { name: '态势感知', max: 100 }, { name: '区域拒止', max: 100 }, { name: '战略投送', max: 100 }],
      axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
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
      <Grid cols={6} className="mb-6">
        {OVERVIEW_STATS.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} accent={s.accent} />
        ))}
      </Grid>
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

function PersonnelTab() {
  const [svc, setSvc] = useState('army');
  const s = SERVICES[svc];
  const pieChart = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'pie', radius: ['48%', '68%'], center: ['50%', '42%'], label: { color: '#93a1b5', fontSize: 10 },
      data: PERSONNEL.serviceShare.map((d) => ({ value: d.value, name: d.name, itemStyle: { color: d.color } })) }],
  };

  return (
    <>
      <Grid cols={4} className="mb-4">
        <Stat value={PERSONNEL.activeDuty.label} label="现役总兵力" accent="#c41e3a" />
        <Stat value={PERSONNEL.civilianStaff.total} label="文职人员" accent="#8b5cf6" />
        <Stat value={PERSONNEL.recruitment.annual} label="年征兵规模" accent="#22d3ee" />
        <Stat value={SERVICES.capf.stat.split(' ·')[0]} label="武警估算" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title={`军种人员结构示意 · ${PERSONNEL.asOf}`}>
          <EChart option={pieChart} style={{ height: 220 }} />
          <p className="text-[10px] mt-2" style={{ color: 'var(--text-tertiary)' }}>来源：{PERSONNEL.source} · 占比为开源估算示意</p>
        </Card>
        <Card title="将官 / 校尉结构 · 公开估算">
          <p className="text-[10px] mb-2" style={{ color: 'var(--text-tertiary)' }}>{PERSONNEL.rankStructure.note}</p>
          <DistBars data={PERSONNEL.rankStructure.general} color="#c41e3a" labelW={48} />
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-[10px] mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>尉官以上占比示意</p>
            <DistBars data={PERSONNEL.rankStructure.field} color="#22d3ee" labelW={72} />
          </div>
        </Card>
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="文职人员体系">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            {PERSONNEL.civilianStaff.label} · {PERSONNEL.civilianStaff.total}（{PERSONNEL.civilianStaff.asOf}）— {PERSONNEL.civilianStaff.note}
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
    yAxis: { type: 'category', data: NAVY_BAR.categories, axisLine: { lineStyle: { color: '#27324a' } } },
    series: [{ type: 'bar', data: NAVY_BAR.values, barWidth: 14, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }],
  };

  const airChart = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
    series: [{ type: 'pie', radius: ['52%', '72%'], center: ['50%', '44%'], label: { color: '#93a1b5' },
      data: AIR_PIE.data.map((d) => ({ value: d.value, name: d.name, itemStyle: { color: d.color } })) }],
  };

  return (
    <>
      <Grid cols={2} className="mb-6">
        <Card title={`海军力量 · ${NAVY_BAR.asOf}（艘 · 估算）`}><EChart option={navyChart} style={{ height: 220 }} /></Card>
        <Card title={`空军现代化 · ${AIR_PIE.asOf}`}><EChart option={airChart} style={{ height: 220 }} /></Card>
      </Grid>
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

  return (
    <>
      <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        尖端军事科技按 TRL（Technology Readiness Level，1–9）标注成熟度；数据来自公开防务报告与科研披露，不含涉密项目细节。
      </p>
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

  return (
    <>
      <Card title="五大战区辖区 · 公开资料" className="mb-4">
        <TheaterLegend selected={sel} onSelect={setSel} />
        <MilitaryMap mode="theater" selectedTheater={sel} onTheaterClick={setSel} style={{ height: 400, marginTop: 12 }} />
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

function LogisticsTab() {
  return (
    <>
      <Grid cols={3} className="mb-4">
        <Stat value={LOGISTICS.hubs.length} label="联勤保障中心" accent="#10b981" />
        <Stat value={LOGISTICS.transport.strategicAirlift.capacity.split(' ')[0]} label="战略空运" accent="#22d3ee" />
        <Stat value="5" label="战区联勤中心" />
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

export default function Page() {
  const [tab, setTab] = useState('overview');

  return (
    <div>
      <PageHeader
        badge="Military"
        title="中国军事力量全维度透视"
        subtitle={`岛链突破 · 战区体制 · 算力主权 · 战略威慑 —— 公开资料整理 · 截至 ${MILITARY_INTEL_META.asOf}`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          <Link to="/talent" className="text-[11px] mono px-2 py-1 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}>
            军事将官人才库 · {FIGURE_MILITARY_COUNT} 条 ↗
          </Link>
        </div>
      </PageHeader>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {TABS.map(([k, label]) => (
          <button key={k} type="button" onClick={() => setTab(k)} style={tabBtn(tab === k)}>{label}</button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'personnel' && <PersonnelTab />}
      {tab === 'equipment' && <EquipmentTab />}
      {tab === 'tech' && <TechTab />}
      {tab === 'theater' && <TheaterTab />}
      {tab === 'logistics' && <LogisticsTab />}
      {tab === 'bases' && <BasesTab />}

      <CrossLinks className="mt-6" links={[
        { to: '/talent', label: '人才库 · 军事将官', note: `${FIGURE_MILITARY_COUNT} 条现役将官公开履历，可与战区/军种对照` },
        { to: '/straits', label: '台海局势', note: 'A2/AD 气泡与地缘重力 —— 东部战区方向延伸' },
        { to: '/omnisecurity', label: '大安全观', note: '粮食 · 能源 · 网络 —— 总体国家安全观下的军事支撑' },
      ]} />

      <SourceFooter />
    </div>
  );
}
