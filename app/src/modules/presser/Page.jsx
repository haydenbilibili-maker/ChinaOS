import React, { useMemo, useState } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import { IntroCard, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL, GRID_LINE } from '../shared/chartHelpers.js';
import {
  PR_AS_OF,
  PR_SCENARIOS,
  STANCES,
  CHANNELS,
  simulateOpinion,
  verdictOf,
  buildPresserReport,
} from './presserData.js';

export default function Page({ embedded = false }) {
  const [scenarioId, setScenarioId] = useState(PR_SCENARIOS[0].id);
  const [hours, setHours] = useState(12);
  const [stance, setStance] = useState('full');
  const [channels, setChannels] = useState(['notice', 'presser']);

  const scenario = PR_SCENARIOS.find((s) => s.id === scenarioId) || PR_SCENARIOS[0];

  const result = useMemo(
    () => simulateOpinion({ scenario, hours, stance, channels }),
    [scenario, hours, stance, channels],
  );

  const verdict = useMemo(() => verdictOf(result), [result]);

  const chartOption = useMemo(() => ({
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    xAxis: { type: 'category', data: result.curve.map((_, i) => `D${i + 1}`), axisLabel: { color: '#888', fontSize: 10 } },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#888', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } } },
    series: [{
      type: 'line',
      data: result.curve,
      smooth: true,
      lineStyle: { color: scenario.color, width: 2 },
      areaStyle: { color: `${scenario.color}22` },
      markLine: { silent: true, data: [{ yAxis: 55, lineStyle: { color: '#fb923c', type: 'dashed' }, label: { formatter: '警戒线 55', fontSize: 9 } }] },
    }],
  }), [result, scenario.color]);

  const toggleChannel = (id) => {
    setChannels((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const report = buildPresserReport({ scenario, hours, stance, channels, res: result });

  return (
    <div>
      {!embedded && (
      <PageHeader
        badge="Sim · 舆情"
        title="舆情风暴应对台"
        subtitle={`抽象情景推演 · 响应时机 × 口径 × 渠道 · 基准日 ${PR_AS_OF}`}
      />
      )}
      <IntroCard>
        六个情景均为原创虚构抽象题材，不指向任何真实事件。推演「未响应复利攀升 → 口径衰减差分 → 渠道触达/信任套利」的机理结构；非公关建议。
      </IntroCard>

      <Grid cols={3} className="mb-4">
        {PR_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenarioId(s.id)}
            className="text-left p-3 rounded os-list-item"
            style={{
              border: scenarioId === s.id ? `1px solid ${s.color}` : '1px solid var(--border-subtle)',
              background: scenarioId === s.id ? `${s.color}12` : 'var(--bg-elevated)',
            }}
          >
            <div className="text-sm font-semibold" style={{ color: s.color }}>{s.label}</div>
            <div className="text-[10px] mt-1 leading-snug" style={{ color: 'var(--text-tertiary)' }}>{s.intro.slice(0, 48)}…</div>
          </button>
        ))}
      </Grid>

      <Grid cols={2} className="mb-4">
        <Card title="处置参数">
          <div className="space-y-3">
            <div>
              <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>响应时机（事发后 {hours} 小时）</div>
              <input type="range" min={0} max={72} step={1} value={hours} onChange={(e) => setHours(+e.target.value)} className="w-full" />
            </div>
            <div>
              <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>回应口径</div>
              <div className="flex flex-wrap gap-1">
                {STANCES.map((s) => (
                  <button key={s.id} type="button" onClick={() => setStance(s.id)} className="text-[10px] mono px-2 py-1 rounded" style={{ background: stance === s.id ? 'rgba(196,30,58,0.15)' : 'var(--bg-base)', color: stance === s.id ? 'var(--china-red)' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>发布渠道（零渠道=鸵鸟）</div>
              <div className="flex flex-wrap gap-1">
                {CHANNELS.map((c) => (
                  <button key={c.id} type="button" onClick={() => toggleChannel(c.id)} className="text-[10px] mono px-2 py-1 rounded" style={{ background: channels.includes(c.id) ? 'rgba(34,211,238,0.12)' : 'var(--bg-base)', color: channels.includes(c.id) ? 'var(--cyber-cyan)' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="14 天推演结果">
          <StatGrid cols={2}>
            <Stat label="峰值热度" value={result.peak} sub={`第 ${result.peakDay} 天`} accent={scenario.color} />
            <Stat label="长尾均值" value={result.longTail} sub="D10–14" />
            <Stat label="次生风险" value={result.secondary} sub="/100" />
            <Stat label="公信力Δ" value={`${result.trust > 0 ? '+' : ''}${result.trust}`} sub="相对基线" />
          </StatGrid>
          <div className="mt-2 text-xs px-2 py-1.5 rounded" style={{ background: `${verdict.color}18`, color: verdict.color }}>
            判定：{verdict.label} — {verdict.note}
          </div>
          {result.reversal && (
            <p className="text-[10px] mt-2 mono" style={{ color: 'var(--china-red)' }}>
              反转引爆：D{result.reversal.day} 二次峰 {result.reversal.value}
            </p>
          )}
        </Card>
      </Grid>

      <Card title="热度曲线 · 14 天" className="mb-4">
        <EChart option={chartOption} style={{ height: 220 }} />
      </Card>

      <Card title="机理复盘（Markdown）">
        <pre className="text-[11px] leading-relaxed whitespace-pre-wrap mono" style={{ color: 'var(--text-secondary)', maxHeight: 360, overflowY: 'auto' }}>{report}</pre>
      </Card>

      {!embedded && <ModuleFooter moduleId="presser" disclaimer={`思想工具 · 抽象情景 · 基准日 ${PR_AS_OF} · 非公关建议`} />}
    </div>
  );
}
