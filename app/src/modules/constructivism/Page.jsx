import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, LEGEND } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 建构主义国际关系理论（亚历山大·温特 Alexander Wendt）
// ----------------------------------------------------------------------------
// 核心：利益由身份建构、身份由互动建构；「无政府状态是国家造就的」。
// 三种无政府文化（霍布斯/洛克/康德）决定国家如何看待彼此与安全含义。
// ============================================================================

// —— ① 三种无政府文化 ——
const CULTURES = [
  {
    key: 'hobbes', label: '霍布斯文化 · 敌人', role: '敌人 (Enemy)', accent: '#c41e3a',
    logic: '彼此视为不承认对方生存权的死敌。逻辑是「你死我活」，国家追求消灭或征服对手；自助与生存压倒一切。',
    security: '安全是零和的：一方所得即另一方所失。军备竞赛、先发制人、势力范围争夺成为常态。',
    violence: '暴力无上限——灭国、征服、种族清洗皆在「可想象」范围内。',
    relation: '三十年战争时期的欧洲、冷战古巴导弹危机的至暗时刻。',
    mapping: '当代主流体系已基本走出霍布斯文化；俄乌战场局部、若干「政权更迭」话语仍带霍布斯色彩。',
    radar: [95, 20, 90, 10],
  },
  {
    key: 'locke', label: '洛克文化 · 对手', role: '对手 (Rival)', accent: '#e8a317',
    logic: '彼此视为竞争对手，但承认对方的生存权与主权。可以激烈竞争，却不以消灭对方为目标——主权与边界被普遍尊重。',
    security: '安全是竞争性但有底线的：默认遵守不灭国的「生存红线」，冲突被规范约束在有限范围内（当今体系的主流文化）。',
    violence: '暴力有边界——可以打有限战争，但「灭国」已被主权规范排除。',
    relation: '威斯特伐利亚以降的主权国家体系；当代绝大多数大国关系。',
    mapping: '中美关系的主流定位：激烈竞争 + 承认彼此生存权；中欧亦属洛克文化但合作面更宽。',
    radar: [55, 60, 55, 45],
  },
  {
    key: 'kant', label: '康德文化 · 朋友', role: '朋友 (Friend)', accent: '#10b981',
    logic: '彼此视为朋友：争端不诉诸暴力（非暴力规范），且在受到第三方威胁时相互援助（互助规范）。',
    security: '安全是集体的：形成安全共同体，战争从「选项之一」变为「不可想象」。利益被重新定义为共同利益。',
    violence: '暴力被排除——成员间战争「不可想象」，争端只走法律与协商。',
    relation: '欧盟内部、美加、北欧诸国——彼此之间不设防的安全共同体。',
    mapping: '中俄「无上限」伙伴话语朝康德方向靠，但互信深度仍属强洛克；东盟内部接近弱康德文化。',
    radar: [15, 95, 20, 90],
  },
];
const RADAR_IND = [
  { name: '冲突倾向', max: 100 }, { name: '合作倾向', max: 100 },
  { name: '自助程度', max: 100 }, { name: '集体认同', max: 100 },
];

// —— ② 身份 → 利益 → 行为 ——
const IDENTITIES = [
  {
    key: 'rejuv', label: '崛起复兴者', accent: '#c41e3a',
    desc: '把自己叙述为「百年屈辱后重回应有位置」的文明型国家——核心命题是恢复历史地位，而非颠覆体系。',
    interests: ['主权完整与统一（不可谈判）', '发展权与产业升级空间', '国际话语权与规则参与权', '周边安全缓冲'],
    behavior: '强调「和平发展」叙事但在核心利益上寸步不让；积极加入并改良现有机制（一带一路、亚投行）而非另起炉灶。',
    perceived: '在对方眼中易被读作「修正主义者」——同一行为、两种身份归因，正是叙事竞争的核心战场。',
  },
  {
    key: 'beneficiary', label: '体系受益者', accent: '#22d3ee',
    desc: '把自己定位为现行国际体系的最大受益方之一——WTO 红利、全球化分工是发展奇迹的外部条件。',
    interests: ['开放的全球贸易体系', '稳定的中美经贸关系', '多边机制（WTO/联合国）的权威', '避免阵营化与脱钩'],
    behavior: '反对脱钩断链、做多边主义旗手；行为重心是「维持体系」而非「挑战体系」——利益排序与复兴者叙事明显不同。',
    perceived: '在西方鸽派眼中是「负责任利益攸关方」；在鹰派眼中是「占便宜的搭便车者」。',
  },
  {
    key: 'revisionist', label: '修正主义者', accent: '#e8a317',
    desc: '（这是美方鹰派建构的他者身份）：意图改写规则、输出模式、取代霸权的体系挑战者。',
    interests: ['（被归因的）取代美国主导地位', '（被归因的）输出治理模式', '（被归因的）改写海洋/科技/金融规则'],
    behavior: '一旦此身份被对方接受为「事实」，遏制、脱钩、围堵就成为「理性应对」——身份归因直接生产了政策。',
    perceived: '温特要点：他者归因的身份若被持续对待，会通过互动「自我实现」——把对方当敌人，对方就变成敌人。',
  },
  {
    key: 'responsible', label: '负责任大国', accent: '#10b981',
    desc: '主动建构的国际形象：全球公共产品提供者——维和、减贫、气候承诺、疫苗援助、斡旋调停。',
    interests: ['国际声誉与软实力', '全球治理议程设置权', '南方国家的认同与追随', '规范制定者地位'],
    behavior: '沙特-伊朗斡旋、双碳承诺、维和出兵大国——以「供给公共产品」重定义大国权利义务。',
    perceived: '身份决定利益的活演示：同一国力，换一种身份自我定位，利益排序与行为清单随之重写。',
  },
];

// —— ③ 观念结构 vs 物质结构 ——
const MEANING_ROWS = [
  ['同一物质事实', '观念结构 A 之下', '观念结构 B 之下'],
  ['一艘航空母舰', '英国拥有：美国视若无睹——朋友的武器不是威胁', '假想中朝鲜拥有：立即触发地区安全危机'],
  ['500 vs 5 件核武器', '英国的 500 件：华盛顿安然入睡', '朝鲜的 5 件：足以重塑东亚安全架构'],
  ['军演', '盟友联演：被称作「维护地区稳定」', '对手军演：被称作「胁迫与挑衅」'],
  ['边境驻军', '美加边境不设防：物质上完全可互相入侵', '若敌对国家如此部署：即刻军备竞赛'],
];

// —— ④ 中美身份叙事温度（示意：100=朋友/伙伴，0=敌人） ——
const NARRATIVE_YEARS = ['1979', '1989', '1997', '2001', '2008', '2012', '2017', '2020', '2023', '2026'];
const US_VIEW = [72, 45, 60, 55, 62, 50, 32, 18, 22, 25];
const CN_VIEW = [68, 52, 62, 50, 65, 55, 45, 30, 35, 38];
const NARRATIVE_NOTES = '1979 建交蜜月 → 1989 急冻 → 1997-2001「建设性战略伙伴」→ 2001 反恐合流 + 入世 → 2008 金融危机合作 → 2012 后疑虑上升 → 2017《国安战略》定性「战略竞争者」→ 2018-2020 贸易战/疫情触底 → 2023 后「管控竞争」小幅回稳。';

// —— ⑤ 规范生命周期 ——
const NORM_STAGES = [
  { title: '① 规范兴起', accent: '#e8a317', desc: '规范倡导者（活动家、先行国家）提出新观念，说服关键国家接受——靠的是议程设置与道义说服。' },
  { title: '② 规范瀑布', accent: '#22d3ee', desc: '越过临界点后规范迅速扩散：国家因合法性、声誉、从众压力而跟进采纳——「不接受」开始有成本。' },
  { title: '③ 规范内化', accent: '#10b981', desc: '规范被视为理所当然，遵守不再需要计算——违反它变得「不可想象」（如奴隶贸易、化武使用）。' },
];
const NORM_CASES = [
  { name: '反殖民规范', stage: 3, pos: '已内化', note: '1945 后数十年完成瀑布；今天「殖民」一词本身即是罪名。' },
  { name: '核禁忌', stage: 3, pos: '深度内化但承压', note: '80 年未实战使用——但核威慑话语回潮正在测试禁忌强度。' },
  { name: '气候规范', stage: 2, pos: '瀑布期', note: '碳中和承诺成为大国「体面」标配，但内化（违反不可想象）远未达成。' },
  { name: 'AI 治理规范', stage: 1, pos: '兴起期', note: '谁先定义「负责任的 AI」，谁就握有下一代规范的制定权——正在进行的规范竞争。' },
];

// —— ⑥ 与现实主义对照 ——
const COMPARE_IND = [
  { name: '物质因素权重', max: 100 }, { name: '观念因素权重', max: 100 },
  { name: '结构可变性', max: 100 }, { name: '对未来开放度', max: 100 },
  { name: '行为可预测性', max: 100 }, { name: '政策悲观度', max: 100 },
];
const REALISM_V = [95, 15, 10, 20, 85, 90];
const CONSTRUCT_V = [40, 90, 85, 80, 40, 30];
const COMPARE_ROWS = [
  ['本体论', '物质主义：实力分布决定一切', '观念主义：共有观念赋予物质以意义'],
  ['无政府状态', '给定的恒定结构，逻辑唯一（自助）', '国家造就的社会建构，至少三种文化'],
  ['国家利益', '先天给定：生存、权力、安全', '由身份建构：「我是谁」决定「我要什么」'],
  ['变化可能', '结构恒定，历史循环（悲观）', '结构可被实践重塑（谨慎开放）'],
  ['对修昔底德陷阱', '结构必然，崛起国与守成国必有一战概率高', '敌人身份的自我实现预言，可被观念重构'],
  ['短板', '解释不了冷战和平终结、欧盟安全共同体', '低估物质刚性；身份重塑漫长且脆弱'],
];

// —— ⑦ 理论演进 ——
const THEORY_STAGES = [
  { period: '1948-1979', title: '理性主义主导', accent: '#64748b', desc: '摩根索古典现实主义 → 华尔兹结构现实主义：物质实力分布解释一切，观念被当作附带现象。国家如台球——内部观念不重要，只看碰撞力学。' },
  { period: '1980s-1992', title: '社会学转向', accent: '#e8a317', desc: '冷战和平终结让物质主义理论集体失语——苏联实力未崩先「观念崩」。1992 年温特发表《无政府状态是国家造就的》，建构主义正式登场。' },
  { period: '1999', title: '《国际政治的社会理论》', accent: '#c41e3a', desc: '温特集大成之作：与华尔兹《国际政治理论》针锋相对，系统提出观念结构、三种无政府文化、身份-利益建构链——建构主义跻身三大理论范式。' },
  { period: '2000s-2010s', title: '实践转向', accent: '#22d3ee', desc: '从「观念」深入到「实践」：外交惯例、日常互动如何再生产或悄然改变结构。规范生命周期理论（芬尼莫尔/辛金克）成为政策分析工具。' },
  { period: '2016-至今', title: '数字时代的叙事竞争', accent: '#10b981', desc: '社交媒体使身份叙事的建构速度空前：话语战、认知战、「讲好故事」竞赛——大国竞争的前线从军备转向「谁来定义谁」。' },
];

export default function Page() {
  const [c, setC] = useState('locke');
  const [idn, setIdn] = useState('rejuv');
  const [normIdx, setNormIdx] = useState(3);
  const [theoryIdx, setTheoryIdx] = useState(2);
  const cu = CULTURES.find((x) => x.key === c);
  const id = IDENTITIES.find((x) => x.key === idn);
  const nc = NORM_CASES[normIdx];

  const cultureRadar = useMemo(() => ({
    radar: { indicator: RADAR_IND, axisName: { color: '#93a1b5', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{ type: 'radar', data: [{ value: cu.radar, name: cu.role, lineStyle: { color: cu.accent, width: 2 }, itemStyle: { color: cu.accent }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }] }],
  }), [c]);

  const narrativeOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['美国对中国的身份定位', '中国对美国的身份定位'] },
    grid: { ...GRID, top: 32 },
    xAxis: categoryX(NARRATIVE_YEARS),
    yAxis: valueY({ max: 100, axisLabel: { formatter: (v) => (v === 100 ? '朋友' : v === 50 ? '对手' : v === 0 ? '敌人' : '') } }),
    series: [
      { name: '美国对中国的身份定位', type: 'line', smooth: true, data: US_VIEW, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.06)' } },
      { name: '中国对美国的身份定位', type: 'line', smooth: true, data: CN_VIEW, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
    ],
  }), []);

  const compareRadar = useMemo(() => ({
    legend: { ...LEGEND, top: 0, data: ['现实主义', '建构主义'] },
    radar: { indicator: COMPARE_IND, radius: '62%', center: ['50%', '56%'], axisName: { color: '#93a1b5', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{
      type: 'radar',
      data: [
        { value: REALISM_V, name: '现实主义', lineStyle: { color: '#64748b', width: 2 }, itemStyle: { color: '#64748b' }, areaStyle: { color: 'rgba(100,116,139,0.12)' } },
        { value: CONSTRUCT_V, name: '建构主义', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
      ],
    }],
  }), []);

  return (
    <div>
      <PageHeader badge="Cognition · 建构主义" title="建构主义 · 无政府状态是国家造就的"
        subtitle="温特：利益由身份建构、身份由互动建构 —— 观念与规范，而非物理实力，塑造大国关系" />
      <IntroCard>
        建构主义反对现实主义把无政府状态当作给定的物理事实。温特的名言是<strong style={{ color: 'var(--text-primary)' }}>「无政府状态是国家造就的」(Anarchy is what states make of it)</strong>：同样的无政府结构，国家可以演化出敌人、对手或朋友三种迥异的文化。<strong style={{ color: 'var(--text-primary)' }}>利益不是先天给定的，而是由身份建构；身份又在互动中被建构。</strong>温特的经典例证：500 件核武器在英国手里，不如 5 件在朝鲜手里可怕——物质本身没有意义，<strong style={{ color: 'var(--text-primary)' }}>意义来自共有观念</strong>。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="3 种" label="同一无政府结构的可能文化" accent="#c41e3a" />
        <Stat value="1992/1999" label="温特两篇奠基之作" accent="#e8a317" />
        <Stat value="身份→利益" label="核心因果链（非实力→利益）" accent="#22d3ee" />
        <Stat value="3 阶段" label="规范生命周期：兴起→瀑布→内化" accent="#10b981" />
      </Grid>

      {/* ① 三种无政府文化 */}
      <Card title="① 三种无政府文化 · 同一结构的三种可能" className="mb-6">
        <SelectorBar items={CULTURES} activeKey={c} onSelect={setC} />
        <Grid cols={2} className="mb-3">
          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{cu.logic}</p>
            <div className="p-3 rounded mb-2" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)' }}>
              <span className="text-[10px] mono uppercase" style={{ color: 'var(--cyber-cyan)' }}>安全含义</span>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{cu.security}</p>
            </div>
            <div className="p-3 rounded" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${cu.accent}` }}>
              <span className="text-[10px] mono uppercase" style={{ color: cu.accent }}>暴力边界</span>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{cu.violence}</p>
            </div>
          </div>
          <EChart option={cultureRadar} style={{ height: 250 }} />
        </Grid>
        <Grid cols={2}>
          <div className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>历史典型关系</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{cu.relation}</p>
          </div>
          <div className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: cu.accent }}>当代映射（中美 / 中俄 / 中欧在哪？）</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{cu.mapping}</p>
          </div>
        </Grid>
      </Card>

      {/* ② 身份 → 利益 → 行为 */}
      <Card title="② 身份决定利益 · 点选一种身份设定，看它建构出什么" className="mb-6">
        <SelectorBar items={IDENTITIES} activeKey={idn} onSelect={setIdn} />
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{id.desc}</p>
        <Grid cols={3} className="mb-3">
          <div className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${id.accent}` }}>
            <div className="text-xs font-semibold mb-2" style={{ color: id.accent }}>由此建构的利益排序</div>
            <ol className="text-[11px] leading-relaxed pl-4" style={{ color: 'var(--text-tertiary)', listStyle: 'decimal' }}>
              {id.interests.map((it) => <li key={it} className="mb-1">{it}</li>)}
            </ol>
          </div>
          <div className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>行为预期</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{id.behavior}</p>
          </div>
          <div className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--cyber-cyan)' }}>他者如何读这个身份</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{id.perceived}</p>
          </div>
        </Grid>
        <Grid cols={4}>
          {[['① 互动', '国家在反复互动中形成对彼此的预期。'], ['② 身份', '互动沉淀为身份：敌人 / 对手 / 朋友。'], ['③ 利益', '身份界定利益——「我是谁」决定「我要什么」。'], ['④ 行为', '利益驱动行为，行为又反馈进下一轮互动。']].map(([t, d]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>这条链是自我强化的循环：把对方当敌人对待，对方便回以敌意，敌人身份被坐实；反之，善意互动也能逐步重塑身份。结构不是铁笼，而是被实践不断再生产的「社会事实」。</p>
      </Card>

      {/* ③ 观念结构 vs 物质结构 */}
      <Card title="③ 观念结构 vs 物质结构 · 同一物质事实的两种意义" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {MEANING_ROWS.map((row, i) => (
                <tr key={row[0]} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {row.map((cell, j) => (
                    <td key={j} className="p-2 align-top" style={{
                      color: i === 0 ? 'var(--text-primary)' : j === 0 ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      fontWeight: i === 0 || j === 0 ? 600 : 400,
                      background: i === 0 ? 'var(--bg-elevated)' : 'transparent',
                      width: j === 0 ? '20%' : '40%',
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>温特的论证核心：威胁不是由钢铁与当量构成的，而是由「我们认为对方是谁」构成的。物质能力划定可能性边界，但<strong style={{ color: 'var(--text-secondary)' }}>哪种可能性被当真，由观念结构决定</strong>。</p>
      </Card>

      {/* ④ 中美身份叙事变迁 */}
      <Card title="④ 中美身份叙事变迁 · 伙伴 → 竞争者 → 对手（话语温度示意，1979-2026）" className="mb-6">
        <EChart option={narrativeOpt} style={{ height: 280 }} />
        <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{NARRATIVE_NOTES} 纵轴为对官方话语「身份定位温度」的主观编码（100=朋友 / 50=对手 / 0=敌人），仅示意趋势。建构主义读法：曲线下行不是实力对比的机械反映，而是<strong style={{ color: 'var(--text-secondary)' }}>双方话语互动逐轮再生产的结果</strong>——每一次「定性」都参与建构下一轮关系。</p>
      </Card>

      {/* ⑤ 规范生命周期 */}
      <Card title="⑤ 规范生命周期 · 兴起 → 瀑布 → 内化（芬尼莫尔 & 辛金克）" className="mb-6">
        <Grid cols={3} className="mb-4">
          {NORM_STAGES.map((s) => (
            <div key={s.title} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `3px solid ${s.accent}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: s.accent }}>{s.title}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{s.desc}</p>
            </div>
          ))}
        </Grid>
        <SelectorBar items={NORM_CASES.map((x, i) => ({ key: String(i), label: x.name, accent: NORM_STAGES[x.stage - 1].accent }))}
          activeKey={String(normIdx)} onSelect={(k) => setNormIdx(Number(k))} />
        <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${NORM_STAGES[nc.stage - 1].accent}` }}>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {nc.name} <span className="text-xs mono ml-2" style={{ color: NORM_STAGES[nc.stage - 1].accent }}>当前位置：第 {nc.stage} 阶段 · {nc.pos}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{nc.note}</p>
        </div>
      </Card>

      {/* ⑥ 与现实主义对照 */}
      <Card title="⑥ 建构主义 vs 现实主义 · 范式对照" className="mb-6">
        <Grid cols={2}>
          <EChart option={compareRadar} style={{ height: 300 }} />
          <div>
            {COMPARE_ROWS.map(([dim, r, cv]) => (
              <div key={dim} className="mb-2 pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{dim}</div>
                <Grid cols={2}>
                  <p className="text-[11px]" style={{ color: '#94a3b8' }}><span className="mono" style={{ color: '#64748b' }}>现实主义</span> · {r}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}><span className="mono" style={{ color: 'var(--china-red)' }}>建构主义</span> · {cv}</p>
                </Grid>
              </div>
            ))}
          </div>
        </Grid>
      </Card>

      {/* ⑦ 理论演进 */}
      <Card title="⑦ 理论演进 · 从理性主义独大到叙事竞争时代" className="mb-6">
        <TimelineBar stages={THEORY_STAGES} activeIdx={theoryIdx} onSelect={setTheoryIdx} />
      </Card>

      <Card title="对中美关系 · 修昔底德陷阱可被观念重构" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          与进攻性现实主义（中国「不能和平崛起」是结构必然）相对照，建构主义给出截然不同的读法：<strong style={{ color: 'var(--text-primary)' }}>修昔底德陷阱不是物理定律，而是一种「敌人」身份的社会建构</strong>。中美若持续以对手而非敌人互动、培育共享规范，体系文化可从霍布斯滑向洛克乃至康德——陷阱因此<strong style={{ color: 'var(--china-red)' }}>可被观念重构，而非命中注定</strong>。当然，建构主义也被批评为低估了物质实力与安全困境的刚性：身份的重塑漫长且脆弱，恶性循环同样会自我实现。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '无政府是国家造就的', subtitle: '同一结构 · 三种文化', body: '霍布斯/洛克/康德——无政府状态本身没有唯一逻辑，敌人、对手还是朋友，取决于国家把彼此造就成什么。' },
        { key: 'stone', title: '身份政治学', subtitle: '身份 → 利益 → 行为', body: '利益不是给定而是建构的：「我是谁」决定「我要什么」。换一种身份自我定位，利益排序与行为清单随之重写。' },
        { key: 'path', title: '叙事即权力', subtitle: '话语竞争 = 身份竞争', body: '谁来定义「中国是谁」，谁就预设了对华政策菜单——话语竞争就是身份竞争，就是利益的重定义之争。' },
      ]} />
      <ModuleFooter moduleId="constructivism" disclaimer="理论梳理 · 思想工具，非立场表达 · 图表数值为分析示意，非测量数据" />
    </div>
  );
}
