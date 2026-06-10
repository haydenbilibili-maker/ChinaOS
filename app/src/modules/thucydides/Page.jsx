import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 修昔底德陷阱（Thucydides Trap · Graham Allison）
// ----------------------------------------------------------------------------
// 守成大国 vs 崛起大国的结构性紧张。艾利森研究 500 年 16 案例，12 战 4 和。
// 交互①：实力交叉滑杆 → 实力曲线（逼近交叉=高危窗口）；②：历史案例切换器；
// ③：战争风险多因子模拟器（收敛/联盟/摩擦/护栏 四滑杆）；④：中美演进时间线。
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

// 艾利森《注定一战》附录 · 500 年 16 案例全表（和平 4 例高亮）
const ALLISON16 = [
  ['15 世纪末', '葡萄牙', '西班牙', '全球帝国与贸易', '和平', true],
  ['16 世纪上半叶', '法国', '哈布斯堡', '西欧陆权', '战争', false],
  ['16–17 世纪', '哈布斯堡', '奥斯曼帝国', '中东欧陆权 · 地中海', '战争', false],
  ['17 世纪上半叶', '哈布斯堡', '瑞典', '北欧陆权与海权', '战争', false],
  ['17 世纪中后期', '荷兰共和国', '英格兰', '全球贸易与海权', '战争', false],
  ['17 末–18 世纪中', '法国', '大不列颠', '全球帝国与欧洲陆权', '战争', false],
  ['18 末–19 世纪初', '英国', '法国（拿破仑）', '欧洲陆权与海权', '战争', false],
  ['19 世纪中', '英国 · 法国', '俄国', '全球帝国 · 中亚（克里米亚）', '战争', false],
  ['19 世纪中后期', '法国', '德国（普鲁士）', '欧洲陆权', '战争', false],
  ['19 末–20 世纪初', '中国 · 俄国', '日本', '东亚陆权与海权', '战争', false],
  ['20 世纪初', '英国', '美国', '全球经济与西半球海权', '和平', true],
  ['20 世纪初', '英国（法俄协约）', '德国', '欧洲陆权与全球海权', '战争（一战）', false],
  ['20 世纪中', '苏联 · 英法', '德国', '欧洲陆权与海权', '战争（二战）', false],
  ['20 世纪中', '美国', '日本', '亚太海权与影响力', '战争（太平洋）', false],
  ['1940s–1980s', '美国', '苏联', '全球霸权', '和平（冷战）', true],
  ['1990s–至今', '英国 · 法国', '德国（统一后）', '欧洲政治影响力', '和平（欧盟框架）', true],
];

// 风险模拟器 · 因子定义与历史模式预设
const RISK_FACTORS = [
  { key: 'conv', label: '实力差距收敛度', desc: '崛起国逼近守成国的程度——越收敛恐惧越深', color: '#c41e3a', dir: '+' },
  { key: 'alliance', label: '联盟刚性', desc: '同盟承诺自动化程度——把局部摩擦联动为系统对抗', color: '#e8a317', dir: '+' },
  { key: 'friction', label: '危机摩擦频率', desc: '海空相遇 / 代理冲突 / 制裁反制的发生密度', color: '#a855f7', dir: '+' },
  { key: 'guard', label: '沟通护栏强度', desc: '热线 / 危机管控机制 / 军方对话——吸收火星的缓冲层', color: '#10b981', dir: '−' },
];

const RISK_PRESETS = {
  y1914: { label: '1914 模式', conv: 85, alliance: 92, friction: 75, guard: 15, color: '#c41e3a',
    note: '联盟刚性把萨拉热窝的局部火星自动升级为系统战争——动员时刻表绑架了外交。' },
  coldwar: { label: '冷战模式', conv: 70, alliance: 60, friction: 80, guard: 78, color: '#10b981',
    note: '摩擦频率不低（柏林/古巴/越南），但热线+军控护栏持续吸收火星，未直接热战。' },
};

// 崛起速率对照：「快」本身即恐惧之源
const SPEED_CARDS = [
  { who: '德国 1870–1914', accent: '#e8a317', doubling: '~25 年', share: '钢产量 1890s 超英，GDP 一战前逼平',
    txt: '统一后 44 年完成工业反超。英国的恐惧不只来自规模，更来自「速度的不可预期」——海军竞赛由此失控。' },
  { who: '中国 1978–2026', accent: '#c41e3a', doubling: '~8 年（高速期）', share: 'GDP 从美 6% → 约 70%（市场汇率）',
    txt: '改革开放后 GDP 翻倍周期一度缩至 8 年左右，购买力平价 2014 年前后超美。压缩在一代人内的赶超，让守成国的心理调适来不及完成。' },
];

// 结构压力（火药桶）vs 触发事件（火星）
const TRIGGERS = [
  { spark: '萨拉热窝 1914', powder: '英德海权竞赛 + 刚性联盟网', accent: '#c41e3a',
    txt: '一桩巴尔干刺杀本身不足以毁灭欧洲；是结构（联盟自动化+动员竞赛）把火星接到了火药桶上。' },
  { spark: '珍珠港 1941', powder: '美国石油禁运扼住日本命脉', accent: '#e8a317',
    txt: '禁运制造「不打即衰」的窗口焦虑——崛起受阻国在结构绝望下选择先发制人豪赌。' },
  { spark: '古巴导弹危机 1962', powder: '美苏全球核对峙结构', accent: '#10b981',
    txt: '同样级别的火星落在有护栏的结构上：秘密渠道+单方面克制让 13 天悬崖最终撤梯——火星未点燃火药。' },
];

// 中美结构紧张演进时间线
const TIMELINE = [
  { period: '1979–2008', title: '接触合作', accent: '#10b981',
    desc: '建交 + 入世逻辑：把中国纳入体系即可塑造之。实力差距巨大，结构压力低，「接触派」主导美国对华共识。' },
  { period: '2009–2016', title: '焦虑酝酿', accent: '#22d3ee',
    desc: '金融危机后中国 GDP 超日、提出「新型大国关系」；美国「重返亚太」。实力收敛开始触发守成国再评估。' },
  { period: '2017–2019', title: '战略竞争定调', accent: '#e8a317',
    desc: '美国国安战略将中国列为「战略竞争者」，接触共识破裂；贸易战开打——结构紧张被官方话语正式确认。' },
  { period: '2020–2022', title: '科技战与脱钩', accent: '#c41e3a',
    desc: '芯片禁令 / 实体清单 / 供应链重组：摩擦从关税升级到技术命脉；台海、南海危机摩擦频率同步上升。' },
  { period: '2023–至今', title: '护栏外交 · 窗口期管理', accent: '#a855f7',
    desc: '恢复军方沟通 + 元首会晤设「地板」：竞争不变但加装护栏——本页模拟器中的 guard 因子现实版。' },
];

export default function Page() {
  const [c, setC] = useState('uschina');
  const [gap, setGap] = useState(80); // 崛起国实力（守成国基准 100）
  const [tl, setTl] = useState(4);
  // 交互③ · 风险模拟器四因子
  const [conv, setConv] = useState(75);
  const [alliance, setAlliance] = useState(55);
  const [friction, setFriction] = useState(65);
  const [guard, setGuard] = useState(60);
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

  // 战争风险指数：收敛 + 联盟刚性 + 摩擦 抬升；护栏 压降
  const risk = useMemo(() => {
    const raw = conv * 0.3 + alliance * 0.25 + friction * 0.25 + (100 - guard) * 0.2;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }, [conv, alliance, friction, guard]);
  const riskLv = risk >= 70 ? { t: '高危 · 1914 区间', c: '#c41e3a' } : risk >= 45 ? { t: '警戒 · 摩擦升级区', c: '#e8a317' } : { t: '缓冲 · 护栏有效区', c: '#10b981' };

  // 因子贡献条形图（护栏取「缺口」即 100-guard）
  const factorBar = useMemo(() => ({
    grid: { left: 110, right: 36, top: 10, bottom: 24 },
    xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
    yAxis: { type: 'category', data: ['护栏缺口', '摩擦频率', '联盟刚性', '收敛度'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
    series: [{
      type: 'bar', barWidth: 14,
      data: [
        { value: 100 - guard, itemStyle: { color: '#10b981' } },
        { value: friction, itemStyle: { color: '#a855f7' } },
        { value: alliance, itemStyle: { color: '#e8a317' } },
        { value: conv, itemStyle: { color: '#c41e3a' } },
      ],
      label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10 },
    }],
  }), [conv, alliance, friction, guard]);

  const applyPreset = (p) => { setConv(p.conv); setAlliance(p.alliance); setFriction(p.friction); setGuard(p.guard); };
  const sliderOf = { conv: [conv, setConv], alliance: [alliance, setAlliance], friction: [friction, setFriction], guard: [guard, setGuard] };

  return (
    <div>
      <PageHeader badge="Cognition · 修昔底德陷阱" title="修昔底德陷阱 · 守成与崛起的结构性紧张"
        subtitle="格雷厄姆·艾利森 · 500 年 16 案例（12 战 4 和）—— 恐惧 + 利益 + 荣誉，与实力交叉的高危窗口" />
      <IntroCard>
        修昔底德写道：「<strong style={{ color: 'var(--text-primary)' }}>使战争不可避免的，是雅典实力的增长，以及由此在斯巴达引起的恐惧</strong>。」艾利森将其升级为结构命题：当崛起国实力<strong style={{ color: 'var(--text-primary)' }}>逼近守成国</strong>时，结构性压力剧增。但与进攻性现实主义的「结构悲观」不同，他强调 16 例中有 4 例避免了战争——<strong style={{ color: '#10b981' }}>陷阱可以规避</strong>。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={gap} label="崛起国相对实力（守成=100）" accent="#c41e3a" />
        <Stat value={danger} label="结构危险度（逼近交叉↑）" accent={danger > 70 ? '#c41e3a' : danger > 40 ? '#e8a317' : '#10b981'} />
        <Stat value={risk} label="多因子战争风险指数" accent={riskLv.c} />
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

      <Card title="交互③ · 战争风险多因子模拟器（结构不是单变量）" className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(RISK_PRESETS).map(([k, p]) => (
            <button key={k} type="button" onClick={() => applyPreset(p)} className="text-xs px-3 py-1.5 rounded mono"
              style={{ background: 'var(--bg-elevated)', color: p.color, border: `1px solid ${p.color}`, cursor: 'pointer' }}>
              载入 {p.label}
            </button>
          ))}
          <span className="text-[11px] self-center" style={{ color: 'var(--text-tertiary)' }}>← 历史模式预设：同样的摩擦，不同的结构吸收力</span>
        </div>
        <Grid cols={2}>
          <div>
            {RISK_FACTORS.map((f) => {
              const [val, setVal] = sliderOf[f.key];
              return (
                <div key={f.key} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{f.label} <span className="mono" style={{ color: f.color }}>{f.dir}风险</span></span>
                    <span className="mono" style={{ color: f.color }}>{val}</span>
                  </div>
                  <input type="range" min="0" max="100" value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: '100%', accentColor: f.color }} />
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
          <div>
            <div className="p-4 rounded text-center mb-3" style={{ background: 'var(--bg-elevated)', border: `1px solid ${riskLv.c}` }}>
              <div className="text-[10px] mono uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>合成战争风险指数</div>
              <div className="text-3xl font-bold mono" style={{ color: riskLv.c }}>{risk}</div>
              <div className="text-xs mt-1 font-semibold" style={{ color: riskLv.c }}>{riskLv.t}</div>
            </div>
            <EChart option={factorBar} style={{ height: 150 }} />
          </div>
        </Grid>
        <Grid cols={2} className="mt-3">
          {Object.values(RISK_PRESETS).map((p) => (
            <div key={p.label} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${p.color}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: p.color }}>{p.label}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{p.note}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="结构压力 vs 触发事件 · 火药桶与火星" className="mb-6">
        <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          陷阱的核心区分：<strong style={{ color: '#c41e3a' }}>结构提供火药</strong>（实力转移积累的恐惧与对抗布局），<strong style={{ color: '#e8a317' }}>危机提供火星</strong>（刺杀、禁运、部署等具体事件）。同一颗火星，落在不同结构上结局迥异——这正是护栏的价值所在。
        </p>
        <Grid cols={3}>
          {TRIGGERS.map((t) => (
            <div key={t.spark} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${t.accent}` }}>
              <div className="text-sm font-semibold" style={{ color: t.accent }}>{t.spark}</div>
              <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>火药桶：{t.powder}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{t.txt}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="交互② · 历史案例切换器（深读 4 例）" className="mb-6">
        <SelectorBar items={Object.entries(CASES).map(([key, v]) => ({ key, label: v.label, accent: v.color }))} activeKey={c} onSelect={setC} />
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

      <Card title="艾利森 16 案例全表 · 500 年实力转移清单（和平 4 例高亮）" className="mb-6">
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['#', '时期', '守成大国', '崛起大国', '争夺领域', '结局'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 mono" style={{ color: 'var(--cyber-cyan)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALLISON16.map(([era, rule, rise, domain, out, peace], i) => (
                <tr key={era + rise} style={{ borderBottom: '1px solid rgba(148,163,184,0.08)', background: peace ? 'rgba(16,185,129,0.07)' : 'transparent' }}>
                  <td className="py-1.5 px-2 mono" style={{ color: 'var(--text-tertiary)' }}>{i + 1}</td>
                  <td className="py-1.5 px-2" style={{ color: 'var(--text-tertiary)' }}>{era}</td>
                  <td className="py-1.5 px-2" style={{ color: 'var(--text-secondary)' }}>{rule}</td>
                  <td className="py-1.5 px-2" style={{ color: 'var(--text-secondary)' }}>{rise}</td>
                  <td className="py-1.5 px-2" style={{ color: 'var(--text-tertiary)' }}>{domain}</td>
                  <td className="py-1.5 px-2 mono font-semibold" style={{ color: peace ? '#10b981' : '#c41e3a' }}>{out}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>美中是体系正在经历的「第 17 案」：12:4 的基础概率令人警醒，但 4 例和平证明结局并非结构注定——尤其英美交接与冷战两例，分别示范了「重定义关系」与「抬高代价+护栏」两条路径。</p>
      </Card>

      <Card title="崛起速率对照 · 「快」本身即恐惧之源" className="mb-6">
        <Grid cols={2}>
          {SPEED_CARDS.map((s) => (
            <div key={s.who} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${s.accent}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: s.accent }}>{s.who}</div>
              <div className="flex gap-4 mb-2">
                <div>
                  <div className="text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>GDP 翻倍周期</div>
                  <div className="text-lg font-bold mono" style={{ color: s.accent }}>{s.doubling}</div>
                </div>
                <div>
                  <div className="text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>赶超刻度</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.share}</div>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{s.txt}</p>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>结构压力 ∝ 收敛<strong style={{ color: 'var(--text-secondary)' }}>速度</strong>而不仅是收敛幅度：缓慢的实力转移给守成国留出心理与制度调适期（英美 · 半个世纪），压缩式赶超则在一代决策者任内完成「世界观坍塌」。</p>
      </Card>

      <Card title="交互④ · 中美结构紧张演进时间线" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={tl} onSelect={setTl} />
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

      <Card title="与现实主义模块对照 · 结构悲观 vs 可规避" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>现实主义</span>（尤其米尔斯海默）读出「<strong style={{ color: 'var(--china-red)' }}>中国不能和平崛起</strong>」——结构决定悲剧。修昔底德陷阱共享同一结构起点，却给出不同结论：实力转移制造的是<strong style={{ color: 'var(--text-primary)' }}>高危「窗口」而非必然战争</strong>，四条路径与政治家的选择能改写结局。两者对照，恰是「<strong style={{ color: 'var(--text-primary)' }}>结构约束</strong>」与「<strong style={{ color: '#10b981' }}>能动空间</strong>」之争。
        </p>
      </Card>
<FrameworkTrio cards={[
        { key: 'salt', body: '实力逼近交叉 → 结构性恐惧与误判窗口。' },
        { key: 'stone', body: '四条和平路径：抬高代价、重定义关系、自我节制。' },
        { key: 'path', body: '结构约束 vs 能动空间：陷阱可规避非必然。' },
      ]} />
<ModuleFooter moduleId="thucydides" sourceNote="思想工具 / 框架推演，非预测" />
    </div>
  );
}
