import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt } from '../shared/chartHelpers.js';

// ============================================================================
// 低空经济 · eVTOL / 无人机 / 通航 —— 空域改革驱动的万亿赛道
// asOf 2026-06-11 · 公开资料示意，非官方统计
// ============================================================================

const AS_OF = '2026-06-11';

// 市场规模（万亿元，示意）
const scaleOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2023', '2024', '2025E', '2026E', '2030E', '2035E']),
  yAxis: valueY({ name: '万亿元' }),
  series: [{
    type: 'bar', barWidth: 24,
    data: [0.50, 0.67, 0.85, 1.05, 1.80, 3.50],
    itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] },
    label: { show: true, position: 'top', color: '#93a1b5', formatter: '{c}' },
    markLine: { silent: true, data: [{ yAxis: 1.0, label: { formatter: '万亿门槛', color: '#93a1b5' }, lineStyle: { color: '#e8a317', type: 'dashed' } }] },
  }],
};

// 应用场景结构（示意 %）
const sceneOpt = donutOpt([
  { name: '无人机物流配送', value: 32, itemStyle: { color: '#22d3ee' } },
  { name: '农林植保/巡检', value: 24, itemStyle: { color: '#10b981' } },
  { name: '载人 eVTOL', value: 16, itemStyle: { color: '#c41e3a' } },
  { name: '应急消防/医疗', value: 14, itemStyle: { color: '#e8a317' } },
  { name: '文旅观光/通航', value: 14, itemStyle: { color: '#8b5cf6' } },
]);

// 产业链国产化雷达（示意）
const localizeOpt = radarOpt(
  ['整机集成', '电池/电驱', '飞控系统', '航空材料', '空管/通信', '适航认证'],
  [80, 75, 62, 58, 55, 48], { name: '国产化程度', color: '#22d3ee' },
);

// 空域改革阶段
const STAGES = [
  { period: '2023—2024', title: '顶层定调', accent: '#22d3ee', desc: '中央经济工作会议首提「低空经济」为战略性新兴产业；《国家空域基础分类方法》出台，G/W 类空域划设，深圳、合肥、苏州等先行试点。痛点：空域管理军民分割、审批链路长、低空数字化基础设施空白。' },
  { period: '2025', title: '试点扩面', accent: '#e8a317', desc: '低空空域协同管理改革向省域推开，建立低空飞行服务保障体系（U-Space）；eVTOL 取证提速（亿航 EH216-S 已取三证），分布式起降点（垂直起降场）规划落地。痛点：盈利模式未跑通，空域开放与安全监管的成本/收益再平衡。' },
  { period: '2026—2027', title: '商业放量', accent: '#10b981', desc: '十五五开局：低空物流、城市空中交通（UAM）规模化运营试验，跨省域航线互联；央地共建低空智联网（通信/导航/监视一体）。痛点：噪声/隐私/保险等社会成本显性化，标准与国际适航互认。' },
  { period: '2028—2030', title: '体系成型', accent: '#c41e3a', desc: '低空经济纳入综合交通运输体系，形成「制造—运营—服务—保障」全链；目标产业规模迈向 3 万亿级。约束：空域资源仍是盐铁式命脉，安全冗余与规模效率的长期张力。' },
];

// 选择器联动雷达维度（示意评分 0—100）
const DIMS = ['政策力度', '市场成熟', '技术就绪', '盈利可持续', '产业协同'];

const SECTORS = [
  {
    key: 'logistics', label: '无人机物流', accent: '#22d3ee',
    scores: [72, 70, 78, 55, 65],
    thesis: '低空物流是当前最接近规模化盈利的场景——末端配送、支线运输、山区/海岛补给绕开地面拥堵与基建短板，以空域换路权。',
    points: ['美团/顺丰常态化无人机配送航线已超百条（示意）', '支线货运无人机（吨级）填补干支衔接空白', '冷链/医疗急送等高时效场景溢价显著'],
    constraint: '低空数字化基础设施（5G-A/北斗增强）与空域动态调配是放量前提；单机经济性仍依赖规模摊薄。',
  },
  {
    key: 'evtol', label: '载人 eVTOL', accent: '#c41e3a',
    scores: [78, 42, 60, 38, 58],
    thesis: 'eVTOL（电动垂直起降）是城市空中交通的核心载具，对标「打飞的」——技术从样机走向适航取证与小批量运营，是十五五前沿看点。',
    points: ['亿航 EH216-S 取得型号合格证/生产许可证/标准适航证', '多旋翼→复合翼→倾转旋翼，航程与载荷逐级提升', '起降场（vertiport）与城市规划耦合'],
    constraint: '安全冗余、电池能量密度、城市噪声与公众接受度构成商业化四重门槛；保险与责任认定制度待建。',
  },
  {
    key: 'agri', label: '农林植保/巡检', accent: '#10b981',
    scores: [55, 85, 82, 72, 60],
    thesis: '植保无人机与工业巡检是渗透率最高的存量市场，大疆等已形成全球竞争力，属低空经济的「现金牛」基本盘。',
    points: ['植保无人机保有量超 20 万架（示意），作业面积占主要农区高比例', '电力/油气/光伏巡检替代人工高危作业', '测绘/应急侦察等政企采购稳定'],
    constraint: '存量市场增速放缓，向高端化（重载/长航时/集群智能）与海外市场要增量。',
  },
  {
    key: 'emergency', label: '应急/医疗', accent: '#e8a317',
    scores: [80, 48, 62, 45, 70],
    thesis: '平急两用属性突出——常态用于物流观光，应急时转为救灾、消防、医疗转运，与公共安全体系直接咬合。',
    points: ['灭火/侦察无人机进入应急装备序列', '血液/器官/急救物资低空快速转运试点', '地震/洪涝「断路断电断网」下的空中生命线'],
    constraint: '需与应急管理、卫健、军方空管多部门协同；常态化与峰值保障的成本分摊机制待明确。',
  },
  {
    key: 'tourism', label: '文旅/通航', accent: '#8b5cf6',
    scores: [58, 50, 65, 42, 48],
    thesis: '低空旅游、私人通航与飞行培训是消费侧入口，把空域资源转化为体验经济，与扩大内需、文旅消费联动。',
    points: ['直升机/热气球/动力伞观光景区扩容', '通用机场网络（A1/A2/A3类）加密', '飞行营地/航空研学带动县域消费'],
    constraint: '通航长期「叫好不叫座」，受空域、油料、人才与运营成本制约；需以低空开放降低准入。',
  },
];

export default function Page() {
  const [stage, setStage] = useState(1);
  const [sector, setSector] = useState('logistics');
  const s = SECTORS.find((x) => x.key === sector) ?? SECTORS[0];

  return (
    <div>
      <PageHeader
        badge="十五五 · 战略性新兴产业"
        title="低空经济 · 空域改革与立体交通"
        subtitle="万亿级赛道 · 空域命脉释放 · 制造—运营—服务全链"
      />

      <IntroCard>
        低空经济以民用有人/无人航空器在 <strong style={{ color: 'var(--text-primary)' }}>3000 米以下空域</strong>的各类飞行活动为牵引，辐射制造、运营、服务与保障全链。
        其本质是一次<strong style={{ color: 'var(--text-primary)' }}>空域资源的「盐铁式」再配置</strong>——军民分割的低空被逐步划设、数字化与市场化，
        以空域开放换产业增量。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~3.5万亿" label="2035E 产业规模" accent="#22d3ee" />
        <Stat value="<3000m" label="低空空域高度" accent="#10b981" />
        <Stat value="EH216-S" label="全球首张 eVTOL 三证" accent="#c41e3a" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="低空经济规模 · 万亿元（示意）"><EChart option={scaleOpt} style={{ height: 240 }} /></Card>
        <Card title="应用场景结构 · 占比（示意）"><EChart option={sceneOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="空域改革进程 · 从顶层定调到体系成型" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stage} onSelect={setStage} />
      </Card>

      <Card title="交互 · 应用场景选择器" className="mb-4">
        <SelectorBar
          items={SECTORS.map((x) => ({ key: x.key, label: x.label, accent: x.accent }))}
          activeKey={sector}
          onSelect={setSector}
        />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${s.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: s.accent }}>场景论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{s.thesis}</p>
          <div className="space-y-2 mb-3">
            {s.points.map((p) => (
              <div key={p} style={{ borderLeft: `2px solid ${s.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{p}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#e8a317' }}>约束 · </span>{s.constraint}
          </div>
        </div>
        <Card title={`${s.label} · 商业化就绪度评估（示意）`}>
          <EChart option={radarOpt(DIMS, s.scores, { name: s.label, color: s.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="产业链国产化程度 · 雷达（示意）"><EChart option={localizeOpt} style={{ height: 260 }} /></Card>
        <Card title="与民航 / 商业航天的边界">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            低空经济区别于<strong style={{ color: 'var(--text-primary)' }}>民航大飞机</strong>（高空干线、C919 制造链主）与<strong style={{ color: 'var(--text-primary)' }}>商业航天</strong>（轨道、星座）：
            其主战场是 3000 米以下的城市与县域立体交通，核心变量是<strong style={{ color: 'var(--text-primary)' }}>空域管理体制</strong>而非单一技术。
          </p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>制造侧</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>电动化/智能化使航空器制造门槛下移，新能源与汽车供应链外溢赋能。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>运营侧</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>盈利模式仍在探索，空域开放节奏决定商业化天花板。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>产业规模 2030E 迈向 1.8 万亿、2035E 约 3.5 万亿；常态化无人机航线、垂直起降场（vertiport）网络与通用机场密度抬升。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>空域管制权军民分割是历史底盘；安全冗余、噪声/隐私社会成本、保险责任与国际适航互认未解。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>低空空域协同管理改革省域推开 → 低空智联网（通导监一体）共建 → 纳入综合交通运输体系全链贯通。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '空域命脉', body: '空域是国家垄断的战略资源，军民分割是历史底盘。低空开放本质是中央对空域管制权的可控让渡，以换取产业增量与立体交通能力。', pillars: [['命脉', '空域管制权。'], ['让渡', '分类划设 G/W。'], ['冗余', '安全监管底线。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '试点先行', body: '深圳/合肥/苏州先行先试，省域协同管理改革灰度推开——以试点试探空域开放、数字基建与运营模式的边界。', pillars: [['试点', '低空特区。'], ['灰度', '省域协同。'], ['迭代', 'U-Space。']] },
        { key: 'path', title: '升级路径', subtitle: '存量到增量', body: '从植保/巡检现金牛，向无人机物流、载人 eVTOL 城市空中交通跃迁；以低空智联网把空域转化为可计量、可调度的新要素。', pillars: [['存量', '植保巡检。'], ['增量', '物流eVTOL。'], ['底座', '低空智联网。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          低空经济的真正瓶颈不在飞行器，而在<strong style={{ color: 'var(--text-primary)' }}>空域这一「盐铁式」命脉的释放节奏</strong>与配套的数字化、安全冗余、保险责任制度。
          技术（电动化、智能化）已基本就绪，制度供给与商业模式才是十五五期间能否把万亿赛道兑现的关键变量。
        </p>
      </Card>

      <ModuleFooter moduleId="lowAltitude" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
