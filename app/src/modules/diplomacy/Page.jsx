import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// 升温/维持/降温 三档色（沿用附件判读盘语义）
const WARM = '#10b981', HOLD = '#e8a317', COOL = '#c41e3a', STEEL = '#22d3ee';
const pill = (c) => ({ display: 'inline-block', fontSize: 11, fontFamily: 'monospace', padding: '3px 9px', borderRadius: 20, border: `1px solid ${c}66`, background: `${c}14`, color: c, whiteSpace: 'nowrap' });

// 四圈层布局环
const RINGS = [
  { id: 'r1', r: 54, label: '大国关系', role: '关键', color: COOL, desc: '美国为总牵引、俄罗斯为背靠、欧洲为争夺地——三条线相互定价。' },
  { id: 'r2', r: 98, label: '周边外交', role: '首要', color: HOLD, desc: '命运共同体话语 + 东盟自贸区 3.0；台海、南海、半岛三大摩擦面所在。' },
  { id: 'r3', r: 142, label: '全球南方', role: '基础', color: WARM, desc: '金砖扩容、对非零关税、中阿/海合会——多极化叙事的票仓与资源带。' },
  { id: 'r4', r: 186, label: '多边机制', role: '舞台', color: STEEL, desc: '联合国系 + 自建机制（上合/金砖/一带一路）双轨，争夺规则话语权。' },
];
const LAYERS = [
  ['L1 · 理念层', '叙事供给', '对内供合法性、对外供秩序方案：人类命运共同体为总纲，三大全球倡议（发展/安全/文明）为支柱。把「中国崛起」翻译成「公共产品」。', ['命运共同体', '三大全球倡议', '多极化']],
  ['L2 · 结构层', '处境判断', '官方判断「百年变局」：美国主导秩序松动、阵营化与全球化并行。核心矛盾——中国是现秩序最大受益者之一，又是其最大修正力量。', ['百年变局', '受益者悖论', '阵营化风险']],
  ['L3 · 布局层', '圈层分工', '即上方布局环：大国是关键、周边是首要、发展中国家是基础、多边是舞台——总分工延续至今，变的只是各环权重与温度。', ['四环分工', '权重随势调整']],
  ['L4 · 工具层', '手段组合', '经济杠杆（市场准入/供应链/稀土）、机制杠杆（自建多边）、军事威慑（灰色地带）、叙事投送，元首外交作为最高校准器。', ['经济胁迫与让利', '机制创设', '元首外交']],
];
const VECTORS = [
  ['中美', '总牵引', '釜山会晤后的「管控性缓和」：元首通话频密、关税与科技战未解，斗而不破、以拖待变。', '竞合管控', HOLD, '→'],
  ['中俄', '背靠背', '「上不封顶」的协作伙伴，但乌战长期化使北京承担二级制裁与声誉成本——亲密中有算计。', '深度协作', WARM, '→'],
  ['中欧', '争夺地', '电动车、产能过剩之争叠加对俄立场分歧；中方策略是分化「去风险」阵线、稳住经贸基本盘。', '摩擦中维系', COOL, '→'],
  ['周边·东北亚', '日韩朝', '对日因历史与安全持续紧张；对韩观望其战略摇摆；对朝以最高规格再锚定（见中朝情景）。', '分线操作 · ↗对朝', HOLD, '↗'],
  ['周边·东南亚', '东盟', '经济整合（自贸区 3.0）与南海摩擦双轨并行——用发展红利对冲安全疑虑是基本打法。', '经济拉动', WARM, '↗'],
  ['中印', '慢解冻', '边境脱离接触后的功能性缓和；印度的多向结盟使其始终是变量而非伙伴。', '谨慎回暖', HOLD, '↗'],
  ['全球南方', '票仓', '金砖扩容、对非零关税、中阿峰会——投入最确定、回报最长线的一环，也是叙事主战场。', '系统加码', WARM, '↗'],
];
const TENSIONS = [
  ['韬光养晦', '奋发有为', 68, '指针长期右移，但 2023 年后出现战术性回摆：战狼话语降温、「伙伴外交」重启——进取目标不变，姿态在校准。'],
  ['发展优先', '安全优先', 60, '「统筹发展与安全」实际重心已偏向安全（供应链自主、反间谍法），但经济下行压力又把指针拉回——当前最不稳定的一根轴。'],
  ['不结盟传统', '准同盟现实', 42, '名义坚持「伙伴而不结盟」，实际对俄、对朝都已是功能性准同盟；拒绝「轴心」标签正是为保住回旋余地。'],
  ['主权绝对化', '全球治理供给', 38, '想当公共产品供给者，又把不干涉内政奉为铁律——乌克兰、缅甸等议题上，调停者角色与原则约束互相牵制。'],
  ['深度互赖', '脱钩备战', 55, '出口依存与「双循环」内化同时推进；稀土与关键供应链既是互赖证据，也是被武器化的筹码。'],
];
// 中朝五情景
const DPRK_SCN = [
  ['S1', '有保留的管控型同盟', '高 · 当前主导', WARM, '维持朝鲜为缓冲带、供经济生命线，但核问题上保持距离（暖话 + 交易性实质）。', '现状延续；中美僵持但未失控；北京成功把平壤再锚回自身轨道。', '元首级访问 + 部长级常态；贸易稳定；制裁立场模糊护盘。'],
  ['S3', '平壤向莫斯科漂移', '中 · 正被对冲', STEEL, '朝鲜以俄为替代靠山，降对华依赖、行为更自主激进，北京杠杆流失、关系隐性转冷。', '俄持续供能源/技术/安全保障；朝俄互动热度系统性高于朝中。', '朝俄高层往来反超朝中；对华贸易收缩而对俄扩张；中方高规格「再锚定」（即正在发生）。'],
  ['S2', '三边轴心固化', '中低', HOLD, '中美、美俄对抗持续升级，中国半推半就接受中俄朝协调机制化。', '西方对华全面围堵；北京放弃战略模糊。阻力大——惧被贴「轴心」标签、惧被朝鲜冒险拖下水。', '三边联合声明/机制化会晤；军事协调公开化；中方默许朝俄军技合作。'],
  ['S4', '美朝缓和挤压中国', '低中', HOLD, '朝鲜借大国博弈获承认或制裁松动，以美制华——北京的噩梦情景。', '特朗普重启对朝峰会外交；朝方判断对美交易收益高于对华依附。', '美朝直接接触升温；朝方对华姿态转冷；中方加速争夺影响力（援助/投资加码）。'],
  ['S5', '危机 / 崩溃', '低 · 高冲击', COOL, '朝内部不稳、接班变局、经济崩盘或半岛冲突，迫使中国摊牌。', '金氏政权动荡；严重经济失控；擦枪走火。', '朝高层异动；边境军事/人道动员；中方对朝政策由「维稳」突转「备险」。'],
];
const DPRK_CONST = [
  ['地缘缓冲', '千余公里共界。不战、不乱是中方底线，防难民潮、防美军推进至鸭绿江——「无核化」目标已名存实亡。'],
  ['条约纽带', '《中朝友好合作互助条约》是中国唯一保留的同盟性质条约，2026 年恰逢签订 65 周年。'],
  ['意识形态互用', '同为共产党领导的社会主义国家，互为合法性叙事的资源。'],
  ['不对称依赖', '2025 年中朝贸易 27.35 亿美元（中方出口 22.95 亿）。命脉在华，却不可全控。'],
];
// 指标盘（全局 + 中朝）
const IND_GLOBAL = [
  ['中美元首互动', '通话/会晤频率 × 成果落地', [['缓和', WARM, '机制化会晤 + 关税/科技实质松动'], ['管控', HOLD, '高频通话护栏，结构性议题冻结', 1], ['恶化', COOL, '沟通中断 + 制裁螺旋']]],
  ['台海军事活动', '越线频次 × 演训规模', [['降温', WARM, '活动频次系统性回落'], ['常态化', HOLD, '高压巡航成新常态，未升级', 1], ['升级', COOL, '封控演训 / 危机事件']]],
  ['外资与贸易流向', 'FDI × 对美欧出口占比', [['回流', WARM, 'FDI 回升，西方份额稳定'], ['转向', HOLD, 'FDI 承压，出口向南方再配置', 1], ['失血', COOL, 'FDI 持续净流出 + 出口受阻']]],
  ['自建机制扩张', '金砖/上合 扩员 × 议程', [['扩张', WARM, '扩员 + 本币结算等议程推进', 1], ['停滞', HOLD, '名义扩大，议程空转'], ['退潮', COOL, '成员离心 / 机制边缘化']]],
  ['姿态语言', '战狼指数 × 让利动作', [['柔化', WARM, '伙伴话语 + 单边免签等让利', 1], ['中性', HOLD, '常规表态'], ['强硬', COOL, '对抗性话语回潮 + 报复措施']]],
];
const IND_DPRK = [
  ['高层互访', '级别 × 频率', [['升温', WARM, '元首级 + 部长级常态（强锚定）', 1], ['维持', HOLD, '仅部长级 / 致电往来'], ['降温', COOL, '长期高层空窗']]],
  ['中朝贸易', '同比 × 结构', [['升温', WARM, '增长 + 恢复原油/劳务'], ['维持', HOLD, '总额持平，结构无突变', 1], ['降温', COOL, '系统性收缩']]],
  ['安理会涉朝立场', '制裁松紧', [['升温', WARM, '公开护盘 / 否决施压', 1], ['维持', HOLD, '模糊弃权'], ['降温', COOL, '配合对朝施压']]],
  ['朝俄 vs 朝中', '相对热度', [['升温', WARM, '朝中互动明显领先'], ['维持', HOLD, '双线并行，中方主动再锚定', 1], ['降温', COOL, '朝向俄系统性倾斜']]],
];

function IndicatorBoard({ rows }) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
      {rows.map(([name, sub, bands], i) => (
        <div key={name} style={{ display: 'grid', gridTemplateColumns: '1.3fr 2.7fr', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
          <div style={{ padding: '14px 16px', borderRight: '1px solid var(--border-subtle)' }}>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</div>
            <div className="text-[10px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {bands.map(([lv, c, desc, on]) => (
              <div key={lv} style={{ display: 'grid', gridTemplateColumns: '54px 1fr', gap: 10, alignItems: 'center', fontSize: 12, opacity: on ? 1 : 0.5 }}>
                <span className="mono" style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 4, textAlign: 'center', background: `${c}1a`, color: c }}>{lv}</span>
                <span style={{ color: on ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: on ? 600 : 400 }}>{desc}{on ? <span className="mono ml-2" style={{ color: WARM, fontSize: 9.5 }}>● 当前</span> : ''}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS = [['layers', '四层架构'], ['vectors', '关系矢量盘'], ['tensions', '结构性张力轴'], ['dprk', '中朝情景评估'], ['indicators', '全局指标盘']];

export default function Page() {
  const [hot, setHot] = useState(null);
  const [tab, setTab] = useState('layers');
  const btn = (a) => ({ background: a ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: a ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '6px 14px', fontSize: 13 });

  return (
    <div>
      <PageHeader badge="Diplomacy · 全局框架盘" title="外交全局框架 · 判读盘"
        subtitle="四层嵌套系统：理念供叙事 · 结构定处境 · 布局分圈层 · 工具给抓手 —— 分辨恒量与变量，以行为而非辞令读信号" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        读中国外交，最忌当一串孤立事件。它是一个<strong style={{ color: 'var(--text-primary)' }}>四层嵌套系统</strong>，所有具体动作都能在这套坐标里定位。判读纪律第一条：<strong style={{ color: 'var(--text-primary)' }}>话语≈噪声，行为=信号</strong>——「传统友好」信息量近乎为零，真正泄露方向的是贸易数据、互访级别、制裁立场与劳务往来。
      </p></Card>

      {/* 四圈层布局环 */}
      <Card title="布局环 · 四圈层定位（悬停图例高亮）" className="mb-6">
        <Grid cols={2}>
          <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 380, margin: '0 auto', display: 'block' }}>
            <circle cx="200" cy="200" r="192" fill="none" stroke="#2C3340" strokeWidth="1" strokeDasharray="3 5" />
            {[...RINGS].reverse().map((g) => (
              <circle key={g.id} cx="200" cy="200" r={g.r} fill={`${g.color}14`} stroke={g.color} strokeWidth={hot === g.id ? 3.5 : 1.4} style={{ transition: 'stroke-width .2s' }} />
            ))}
            <text x="200" y="196" textAnchor="middle" fill="#E7EAEF" fontSize="15" fontWeight="600">大国</text>
            <text x="200" y="214" textAnchor="middle" fill="#9AA4B2" fontSize="9" fontFamily="monospace">关键</text>
            <text x="200" y="124" textAnchor="middle" fill="#E7EAEF" fontSize="12" fontWeight="600">周边·首要</text>
            <text x="200" y="82" textAnchor="middle" fill="#E7EAEF" fontSize="12" fontWeight="600">全球南方·基础</text>
            <text x="200" y="34" textAnchor="middle" fill="#E7EAEF" fontSize="12" fontWeight="600">多边机制·舞台</text>
          </svg>
          <div className="space-y-2">
            {RINGS.map((g) => (
              <div key={g.id} onMouseEnter={() => setHot(g.id)} onMouseLeave={() => setHot(null)}
                style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'start', background: hot === g.id ? 'var(--bg-elevated)' : 'transparent', border: `1px solid ${hot === g.id ? g.color : 'var(--border-subtle)'}`, borderRadius: 10, padding: '11px 13px', cursor: 'pointer', transition: 'all .2s' }}>
                <span style={{ width: 11, height: 11, borderRadius: 3, marginTop: 5, background: g.color }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{g.label}<span className="text-[10px] mono ml-2" style={{ color: 'var(--text-tertiary)' }}>{g.role}</span></div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Grid>
      </Card>

      <div className="flex gap-1 flex-wrap mb-4">
        {TABS.map(([k, label]) => <button key={k} onClick={() => setTab(k)} style={btn(k === tab)} className="mono">{label}</button>)}
      </div>

      {tab === 'layers' && (
        <Card title="四层分析架构 · 自上而下">
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
            {LAYERS.map(([no, h, p, chips], i) => (
              <div key={no} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ padding: '18px 16px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                  <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{no}</div>
                  <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</div>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p}</p>
                  <div className="flex flex-wrap gap-2 mt-2">{chips.map((c) => <span key={c} className="text-[10px] mono px-2 py-0.5 rounded-full" style={{ border: `1px solid ${STEEL}4d`, background: `${STEEL}10`, color: STEEL }}>{c}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'vectors' && (
        <Card title="关系矢量盘 · 温度 × 趋势（2026-06 读数）">
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
            {VECTORS.map(([nm, sub, desc, st, c, arrow], i) => (
              <div key={nm} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 160px', alignItems: 'center', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ padding: '14px 16px' }}><div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{nm}</div><div className="text-[10px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</div></div>
                <div style={{ padding: '14px 16px', borderLeft: '1px solid var(--border-subtle)' }} className="text-xs" >{<span style={{ color: 'var(--text-secondary)' }}>{desc}</span>}</div>
                <div style={{ padding: '14px 16px', borderLeft: '1px solid var(--border-subtle)' }}><span style={pill(c)}>{st}</span> <span className="mono ml-1" style={{ color: c }}>{arrow}</span></div>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>与「<Link to="/straits" className="mono" style={{ color: STEEL }}>台海局势</Link>」「<Link to="/bri" className="mono" style={{ color: STEEL }}>一带一路</Link>」「<Link to="/fdi" className="mono" style={{ color: STEEL }}>跨境投资</Link>」模块对照阅读。</p>
        </Card>
      )}

      {tab === 'tensions' && (
        <Card title="结构性张力轴 · 系统的内在矛盾">
          <div className="space-y-3">
            {TENSIONS.map(([l, r, pos, read]) => (
              <div key={l} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 11, padding: '16px 18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{l}</span>
                  <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>VS</span>
                  <span className="text-sm font-semibold text-right" style={{ color: 'var(--text-primary)' }}>{r}</span>
                </div>
                <div style={{ position: 'relative', height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${STEEL}80, #2C3340 50%, ${COOL}80)` }}>
                  <span style={{ position: 'absolute', top: '50%', left: `${pos}%`, transform: 'translate(-50%,-50%)', width: 13, height: 13, borderRadius: '50%', background: 'var(--text-primary)', border: '3px solid var(--bg-base)' }} />
                </div>
                <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>{read}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'dprk' && (
        <div>
          <Grid cols={5} className="mb-4">
            {DPRK_SCN.map(([id, nm, prob, c]) => (
              <div key={id} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c}` }}>
                <div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{id}</div>
                <div className="text-xs font-semibold mt-1 mb-2" style={{ color: 'var(--text-primary)' }}>{nm}</div>
                <span style={{ ...pill(c), fontSize: 9.5 }}>{prob}</span>
              </div>
            ))}
          </Grid>
          <Card title="结构性恒量 · 任何剧本的地基" className="mb-4">
            <Grid cols={2}>
              {DPRK_CONST.map(([h, p]) => (
                <div key={h} style={{ borderLeft: `2px solid ${STEEL}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</div><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{p}</p></div>
              ))}
            </Grid>
          </Card>
          {DPRK_SCN.map(([id, nm, prob, c, jl, tj, xx]) => (
            <Card key={id} className="mb-3">
              <div className="flex justify-between items-start mb-3">
                <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}><span className="mono text-xs mr-2" style={{ color: 'var(--text-tertiary)' }}>{id}</span>{nm}</div>
                <span style={pill(c)}>{prob}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 12 }}><span className="mono" style={{ color: STEEL }}>机理</span><span style={{ color: 'var(--text-secondary)' }}>{jl}</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}><span className="mono" style={{ color: STEEL }}>触发条件</span><span style={{ color: 'var(--text-secondary)' }}>{tj}</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}><span className="mono" style={{ color: STEEL }}>先行信号</span><span style={{ color: 'var(--text-secondary)' }}>{xx}</span></div>
              </div>
            </Card>
          ))}
          <Card title="中朝先行指标盘 · 三档阈值 + 当前读数"><IndicatorBoard rows={IND_DPRK} /></Card>
        </div>
      )}

      {tab === 'indicators' && (
        <Card title="全局先行指标盘 · 三档阈值 + 当前读数（2026-06）">
          <IndicatorBoard rows={IND_GLOBAL} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>阈值越线即触发重判；建议按季更新贸易与互访两项，其余事件驱动即时更新。</p>
        </Card>
      )}

      <Card title="判读纪律" className="mt-6">
        <ol className="space-y-2" style={{ listStyle: 'none' }}>
          {[['话语≈噪声，行为=信号', '社论的暖度不计入判读，只读可量化抓手。'],
            ['层间对照读', '理念层(L1)永远比工具层(L4)滞后且光滑；真信号在 L4 与 L1 的落差里——说「共同体」的同时在做什么。'],
            ['张力轴是预测器', '五根轴的指针移动方向，比任何单一事件更早指示总路线变化；尤其盯「发展 vs 安全」这根最不稳的轴。'],
            ['低概率≠可忽略', 'S5 概率低但冲击极高，需单列应急触发线，不与基线混算。'],
            ['圈层优先级算法', '资源冲突时，历史规律是大国稳定 > 周边止损 > 南方投资；看预算与高层时间的实际分配即可验证。']].map(([t, d], i) => (
            <li key={t} className="text-sm" style={{ color: 'var(--text-secondary)' }}><span className="mono mr-2" style={{ color: STEEL }}>{String(i + 1).padStart(2, '0')}</span><strong style={{ color: 'var(--text-primary)' }}>{t}。</strong>{d}</li>
          ))}
        </ol>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>判读基准 2026-06 · 吸收自《中朝关系情景评估盘》《中国外交全局框架盘》；恒量/变量分离 · 行为优先于辞令 · 阈值触发重判。本盘为分析框架，非预测、非立场陈述。</p>
    </div>
  );
}
