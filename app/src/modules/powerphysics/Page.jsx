import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 权力物理学（Power Physics）交互模型
// ----------------------------------------------------------------------------
// 把权力当作可计算的「力场」：有效权力 = f(强制力, 合法性, 信息穿透) − 社会摩擦。
// 三态预设（动员/维稳/萧条）+ 四条定律（项目签名隐喻）。
// ============================================================================

const PRESETS = {
  mobilize: { label: '动员态', coercion: 75, legit: 70, penetration: 80, friction: 35, note: '集中力量办大事：强制与穿透拉满，以绩效合法性对冲摩擦。' },
  stable: { label: '维稳态', coercion: 60, legit: 75, penetration: 90, friction: 40, note: '常态化治理：信息穿透最大化（数字利维坦），追求极致确定性。' },
  depression: { label: '萧条态', coercion: 55, legit: 50, penetration: 85, friction: 70, note: '增长换挡：绩效合法性递减、社会摩擦抬升，统治成本上行。' },
};

const LAWS = [
  ['收支倒挂 · 压力传导', '财权上收、事权下沉 → 基层财政缺口被层层加压传导，是治理摩擦的主源。'],
  ['锦标赛竞争 · 分布式算力', '以晋升锦标赛把发展动能分配给地方，竞争即母系统的生产力算力。'],
  ['语义防火墙 · 解释权主权', '垄断「文明/民主/公正」的定义权，构建认知层防御、降低维稳成本。'],
  ['磁盘碎片整理 · 反腐', '反腐既清理山头主义、也是对权力结构的周期性「碎片整理」，重收确定性。'],
];

export default function Page() {
  const [p, setP] = useState({ ...PRESETS.stable });
  // 有效权力 = 强制0.3 + 合法0.4 + 穿透0.3 − 摩擦0.5（截断 0–100）
  const eff = useMemo(() => Math.max(0, Math.min(100, Math.round(p.coercion * 0.3 + p.legit * 0.4 + p.penetration * 0.3 - p.friction * 0.5))), [p]);
  // 统治成本 ≈ 摩擦/有效权力（越高越贵）；确定性指数 ≈ 穿透×合法/100
  const cost = useMemo(() => Math.round((p.friction / Math.max(20, eff)) * 100), [p, eff]);
  const certainty = useMemo(() => Math.round((p.penetration * p.legit) / 100), [p]);

  const radar = {
    radar: { indicator: [{ name: '强制力', max: 100 }, { name: '合法性', max: 100 }, { name: '信息穿透', max: 100 }, { name: '社会摩擦', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{ type: 'radar', data: [{ value: [p.coercion, p.legit, p.penetration, p.friction], name: '力场', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.14)' } }] }],
  };
  const gauge = {
    series: [{ type: 'gauge', min: 0, max: 100, progress: { show: true, width: 14, itemStyle: { color: eff > 70 ? '#10b981' : eff > 45 ? '#e8a317' : '#c41e3a' } },
      axisLine: { lineStyle: { width: 14, color: [[1, '#1a2333']] } }, axisLabel: { color: '#5b6a82', fontSize: 10 }, axisTick: { show: false }, splitLine: { show: false },
      pointer: { itemStyle: { color: '#93a1b5' } }, detail: { valueAnimation: true, color: '#e8edf6', fontSize: 28, offsetCenter: [0, '40%'] }, data: [{ value: eff }] }],
  };
  const Slider = ({ k, label }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{p[k]}</span></div>
      <input type="range" min="0" max="100" value={p[k]} onChange={(e) => setP({ ...p, [k]: Number(e.target.value) })} style={{ width: '100%', accentColor: '#c41e3a' }} />
    </div>
  );

  return (
    <div>
      <PageHeader badge="Cognition · 权力物理学" title="权力物理学 · 把权力当作力场来计算"
        subtitle="有效权力 = 强制力 · 合法性 · 信息穿透 − 社会摩擦 —— 调参看系统确定性与统治成本如何变化" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        权力物理学是本项目的冷峻内核：把权力运行从道德叙事中剥离，当作<strong style={{ color: 'var(--text-primary)' }}>可计算的力场</strong>——强制力提供下限、合法性降低维稳成本、信息穿透决定意志直达末梢的效率，三者对冲社会摩擦。系统的终极偏好是<strong style={{ color: 'var(--text-primary)' }}>「确定性」</strong>。
      </p></Card>
      <Grid cols={3} className="mb-6">
        <Stat value={eff} label="有效权力指数（实时）" accent={eff > 70 ? '#10b981' : eff > 45 ? '#e8a317' : '#c41e3a'} />
        <Stat value={certainty} label="确定性指数（穿透×合法）" accent="#22d3ee" />
        <Stat value={cost + '%'} label="相对统治成本" accent="#e8a317" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="力场参数 · 拖动调参（或选预设态）">
          <div className="flex gap-1 flex-wrap mb-3">
            {Object.entries(PRESETS).map(([k, v]) => (
              <button key={k} onClick={() => setP({ ...v })} className="text-xs px-3 py-1 rounded mono"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>{v.label}</button>
            ))}
          </div>
          <Slider k="coercion" label="强制力 Coercion" />
          <Slider k="legit" label="合法性 Legitimacy" />
          <Slider k="penetration" label="信息穿透 Penetration" />
          <Slider k="friction" label="社会摩擦 Friction" />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>提示：摩擦每升 10，有效权力降 5、统治成本陡增——这就是为什么体制极度厌恶不确定性。</p>
        </Card>
        <Card title="力场画像 + 有效权力表">
          <EChart option={radar} style={{ height: 180 }} />
          <EChart option={gauge} style={{ height: 150 }} />
        </Card>
      </Grid>

      <Card title="权力物理学四定律 · 项目签名隐喻" className="mb-6">
        <Grid cols={2}>
          {LAWS.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="用法 · 与各模块的接口">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          权力物理学是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>权力逻辑 / 政府体系 / 治理现代化 / 治国沙盒</span>的抽象底层：压力型体制是「摩擦传导」，数字利维坦是「穿透拉满」，反腐是「碎片整理」，人才配置是「在给定力场下求最优解」。调参即在脑中预演不同治理态的代价。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模型为分析框架与思想工具，参数与权重为示意，用于结构化思考而非实证测量。</p>
    </div>
  );
}
