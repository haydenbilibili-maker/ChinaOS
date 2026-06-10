import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 修昔底德陷阱（Thucydides Trap · Graham Allison）
// ----------------------------------------------------------------------------
// 守成大国 vs 崛起大国的结构性紧张。艾利森研究 500 年 16 案例，12 战 4 和。
// 交互①：实力交叉滑杆 → 实力曲线（逼近交叉=高危窗口）；②：历史案例切换器。
// ============================================================================

const DRIVERS = [
  ['恐惧 Fear', '守成国对地位被取代的结构性恐惧——能力胜过意图。'],
  ['利益 Interest', '崛起国要求与新实力相称的话语权与势力范围。'],
  ['荣誉 Honor', '面子、威望与历史叙事，让退让的国内成本极高。'],
];

const PEACE_PATHS = [
  ['抬高战争代价', '核威慑 / 经济相互依赖，使热战不可承受 → 美苏冷战未热战。'],
  ['重新定义关系', '把零和竞争重构为共存框架（如战后英美权力和平交接）。'],
  ['约束自身雄心', '守成或崛起国主动自我节制、避免触发对方红线。'],
  ['给崛起国空间', '在体系内为新强权预留位置，而非全面围堵。'],
];

const CASES = {
  athens: { label: '雅典 vs 斯巴达', era: '前 5 世纪', out: '战争', color: '#c41e3a',
    rise: 88, rule: 80, txt: '雅典崛起引发斯巴达恐惧 → 伯罗奔尼撒战争，两败俱伤。修昔底德的原型命题。' },
  ukgermany: { label: '英国 vs 德国', era: '1900s', out: '战争', color: '#c41e3a',
    rise: 82, rule: 85, txt: '德国工业与海军崛起冲击英国海上霸权 → 第一次世界大战，结构紧张被民族主义引爆。' },
  usussr: { label: '美国 vs 苏联', era: '冷战', out: '和平（避免）', color: '#10b981',
    rise: 75, rule: 90, txt: '核威慑抬高战争代价 + 阵营边界相对清晰 → 长期对峙但未直接热战，四个和平案例之一。' },
  uschina: { label: '美国 vs 中国', era: '当下', out: '未定', color: '#e8a317',
    rise: 84, rule: 90, txt: '实力曲线逼近交叉的高危窗口。核武 + 经济深度交织既抬高代价、也制造新型摩擦——结局取决于四条路径能否被走通。' },
};

export default function Page() {
  const [c, setC] = useState('uschina');
  const [gap, setGap] = useState(80); // 崛起国实力（守成国基准 100）
  const cs = CASES[c];

  // 危险度 ≈ 实力越逼近交叉越高（gap 越接近 100 越危险）
  const danger = useMemo(() => Math.max(0, Math.min(100, Math.round(100 - Math.abs(100 - gap) * 1.4))), [gap]);

  const cross = useMemo(() => ({
    legend: { data: ['守成大国', '崛起大国'], textStyle: { color: '#93a1b5' }, top: 0 },
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    xAxis: { type: 'category', data: ['T-20', 'T-15', 'T-10', 'T-5', '当前', 'T+5'], axisLine: { lineStyle: { color: '#27324a' } } },
    yAxis: { type: 'value', max: 120, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    series: [
      { name: '守成大国', type: 'line', smooth: true, data: [100, 100, 99, 98, 97, 96], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
      { name: '崛起大国', type: 'line', smooth: true, data: [gap - 45, gap - 30, gap - 18, gap - 8, gap, gap + 8], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
    ],
  }), [gap]);

  return (
    <div>
      <PageHeader badge="Cognition · 修昔底德陷阱" title="修昔底德陷阱 · 守成与崛起的结构性紧张"
        subtitle="格雷厄姆·艾利森 · 500 年 16 案例（12 战 4 和）—— 恐惧 + 利益 + 荣誉，与实力交叉的高危窗口" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        修昔底德写道：「<strong style={{ color: 'var(--text-primary)' }}>使战争不可避免的，是雅典实力的增长，以及由此在斯巴达引起的恐惧</strong>。」艾利森将其升级为结构命题：当崛起国实力<strong style={{ color: 'var(--text-primary)' }}>逼近守成国</strong>时，结构性压力剧增。但与进攻性现实主义的「结构悲观」不同，他强调 16 例中有 4 例避免了战争——<strong style={{ color: '#10b981' }}>陷阱可以规避</strong>。
      </p></Card>

      <Grid cols={3} className="mb-6">
        <Stat value={gap} label="崛起国相对实力（守成=100）" accent="#c41e3a" />
        <Stat value={danger} label="结构危险度（逼近交叉↑）" accent={danger > 70 ? '#c41e3a' : danger > 40 ? '#e8a317' : '#10b981'} />
        <Stat value={`12 : 4`} label="历史案例 战争 : 和平" accent="#22d3ee" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="交互① · 实力交叉曲线（拖动崛起国实力）">
          <input type="range" min="40" max="115" value={gap} onChange={(e) => setGap(Number(e.target.value))} style={{ width: '100%', accentColor: '#c41e3a' }} />
          <EChart option={cross} style={{ height: 230 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>两条曲线<strong style={{ color: 'var(--text-secondary)' }}>逼近交叉的窗口期</strong>结构压力最大——恐惧、误判与意外摩擦最易引爆冲突。曲线为示意，非预测。</p>
        </Card>
        <Card title="三大驱动力 · 战争为何「结构性」">
          {DRIVERS.map(([t, d]) => (
            <div key={t} className="mb-3" style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Card>
      </Grid>

      <Card title="交互② · 历史案例切换器（500 年 16 例节选）" className="mb-6">
        <div className="flex gap-1 flex-wrap mb-4">
          {Object.entries(CASES).map(([k, v]) => (
            <button key={k} onClick={() => setC(k)} className="text-sm px-3 py-1.5 rounded mono"
              style={{ background: k === c ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === c ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === c ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
          ))}
        </div>
        <Grid cols={3}>
          <div className="col-span-2">
            <div className="text-xs mono mb-2" style={{ color: 'var(--cyber-cyan)' }}>{cs.era} · 守成 vs 崛起</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cs.txt}</p>
          </div>
          <div className="p-4 rounded text-center" style={{ background: 'var(--bg-elevated)', border: `1px solid ${cs.color}` }}>
            <div className="text-[10px] mono uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>结局</div>
            <div className="text-xl font-bold mono" style={{ color: cs.color }}>{cs.out}</div>
            <div className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>崛起实力 {cs.rise} / 守成 {cs.rule}</div>
          </div>
        </Grid>
      </Card>

      <Card title="逃出陷阱 · 和平的四条路径" className="mb-6">
        <Grid cols={2}>
          {PEACE_PATHS.map(([t, d], i) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#10b981' }}>{`路径 ${i + 1} · ${t}`}</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="与现实主义模块对照 · 结构悲观 vs 可规避">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>现实主义</span>（尤其米尔斯海默）读出「<strong style={{ color: 'var(--china-red)' }}>中国不能和平崛起</strong>」——结构决定悲剧。修昔底德陷阱共享同一结构起点，却给出不同结论：实力转移制造的是<strong style={{ color: 'var(--text-primary)' }}>高危「窗口」而非必然战争</strong>，四条路径与政治家的选择能改写结局。两者对照，恰是「<strong style={{ color: 'var(--text-primary)' }}>结构约束</strong>」与「<strong style={{ color: '#10b981' }}>能动空间</strong>」之争。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模块为思想工具，实力曲线与危险度为示意（非预测），用于结构化推演而非实证测量。</p>
    </div>
  );
}
