import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

/* ──────────────────────────────────────────────────────────────────────────
   政府体系与行政执行逻辑 · 压力型体制 / 执行算法
   冷峻现实主义视角：把政府当作一台「目标—分解—承压—变通」的执行机器拆解。
   全部为示意值，用于呈现分析框架，非官方统计。
   ────────────────────────────────────────────────────────────────────────── */

/* 1 · 府际关系维度选择器 —— 切换看每条权力轴线的运行机制 / 张力 / 近期改革 */
const RELATIONS = [
  {
    key: 'party-gov', label: '党政关系', accent: '#c41e3a',
    axis: '党委（决策核心）⇄ 政府（执行机构）',
    mech: '党委把方向、管大局、定政策，政府负责落地执行；「党政联席」「党组前置」使政治意志无缝转为行政指令。机构改革后大量议事协调机构由党委直接统领。',
    tension: '党政职能边界的可伸缩性既是动员力来源，也使行政部门的专业自主性与权责对应度被压缩。',
    reform: '党和国家机构改革（2018）：组建国监委、应急部、退役军人部，党委办事机构归口管理同领域政府部门。',
  },
  {
    key: 'central-local', label: '央地关系', accent: '#e8a317',
    axis: '中央（财权 + 规则）⇄ 地方（事权 + 执行）',
    mech: '中央定标准、控钱袋、握人事任免；地方在「政治承包制」下负责增长与稳定。转移支付是央地利益再平衡的主阀门。',
    tension: '「财权上收、事权下放」造成基层「小马拉大车」，土地财政、地方债成为事权缺口的补偿性融资工具。',
    reform: '分税制（1994）重塑财政纵向格局；近年推进央地财政事权与支出责任划分改革，上收部分支出责任。',
  },
  {
    key: 'tiao-kuai', label: '条块关系', accent: '#22d3ee',
    axis: '条（部委垂直系统）⇄ 块（地方综合管辖）',
    mech: '「条」管业务标准与专业垂直（央行、海关、税务、市场监管部分上收），「块」管属地综合协调；多数部门「双重领导」。',
    tension: '条块分割导致「九龙治水」与责任真空：垂直部门听上不听下，属地政府权小责大、协调成本高企。',
    reform: '部分领域垂直管理上收（环保监测、食药、统计督察）以抑制地方干预数据与执法。',
  },
  {
    key: 'inter-dept', label: '部门间关系', accent: '#a78bfa',
    axis: '同级职能部门横向协同',
    mech: '通过领导小组、联席会议、「一件事一次办」打破部门壁垒；大部制把职能相近部门合并以降低交易成本。',
    tension: '部门利益（编制、预算、审批权）固化为「部门所有制」，跨部门事项靠「主要领导挂帅」才能推动。',
    reform: '大部制改革整合交通、市场监管、文旅、卫健等；数字政府以数据共享替代部门间公文流转。',
  },
  {
    key: 'gov-biz', label: '政企关系', accent: '#10b981',
    axis: '政府（监管 + 出资）⇄ 企业（市场主体）',
    mech: '对国企「管资本」、党组织内嵌治理；对民企「亲清」政商关系、负面清单 + 备案制。地方政府兼具裁判员与「招商引资」运动员双重身份。',
    tension: '产业政策与运动式招商造成重复建设与内卷；监管的相机抉择带来政策不确定性。',
    reform: '放管服 / 「证照分离」压缩审批；全国统一大市场破除地方保护与行政性垄断。',
  },
  {
    key: 'staffing', label: '编制人事', accent: '#f472b6',
    axis: '机构编制（事权载体）+ 干部人事（执行者）',
    mech: '编制是行政资源的「硬通货」，由党委机构编制部门集中控制；干部「下管一级」、异地交流、能上能下。',
    tension: '「财政供养人口」刚性增长与基层减编压力并存；编制冻结下大量编外、购买服务用工承接实际职能。',
    reform: '严控总量、动态调剂、「减上补下」；推行职务与职级并行缓解晋升「天花板」。',
  },
];

/* 2 · 压力型体制传导链 —— 中央定目标 → 省加码 → 市分解 → 县承压 → 基层变通 */
const PRESSURE_CHAIN = [
  { level: '中央', accent: '#c41e3a', set: '设定核心目标', detail: '下达约束性指标（双碳、耕地红线、防风险），签订总目标，挂钩「一票否决」。', signal: '原始目标 100' },
  { level: '省', accent: '#e8a317', set: '逐级加码', detail: '为确保完成、留足安全垫，向下分解时上浮指标、提前时限——「层层加码」第一跳。', signal: '加码至 115' },
  { level: '市', accent: '#f59e0b', set: '再分解', detail: '叠加本级政绩诉求与考核权重，继续上浮并细化到具体项目、时间节点。', signal: '加码至 130' },
  { level: '县', accent: '#22d3ee', set: '承压', detail: '权小责大、资源有限，成为压力的实际承压层，被迫「白加黑、五加二」突击完成。', signal: '目标 130 · 资源 70' },
  { level: '基层（乡镇/村）', accent: '#a78bfa', set: '变通执行', detail: '面对不可能任务，产生「上有政策下有对策」：数字美化、运动式突击、形式留痕、选择性执行。', signal: '执行折损 → 失真' },
];

/* 5 · 五级政府层级 + 职能配置占比（示意） */
const GOV_TIERS = [
  { name: '中央', value: 6, color: '#c41e3a' },
  { name: '省级', value: 12, color: '#e8a317' },
  { name: '地市级', value: 20, color: '#22d3ee' },
  { name: '县区级', value: 30, color: '#a78bfa' },
  { name: '乡镇级', value: 32, color: '#10b981' },
];

/* 6 · 行政体制改革时间线 */
const REFORM_STAGES = [
  { period: '1994', title: '分税制改革', accent: '#c41e3a', desc: '重建中央财政汲取能力，划分中央税 / 地方税 / 共享税，确立「财权上收」格局。中央财政收入占比由约 22% 跃升至 55%+，转移支付体系成型——奠定此后三十年央地博弈的财政底层逻辑。' },
  { period: '2008→2013', title: '大部制改革', accent: '#e8a317', desc: '按「职能有机统一」合并相近部门（工信、交通运输、铁路并入、卫计、市场监管），削减部委数量、压缩职能交叉，降低跨部门协调成本，向「宽职能、少机构」演进。' },
  { period: '2013→2018', title: '简政放权 · 放管服', accent: '#22d3ee', desc: '「放管服」三位一体：取消下放行政审批事项、减少前置许可、「证照分离」「最多跑一次」。重塑政企边界，把政府从微观审批型转向宏观服务型——以削权换市场活力。' },
  { period: '2018', title: '党和国家机构改革', accent: '#a78bfa', desc: '系统性重构党政机构：组建国家监察委、应急管理部、退役军人事务部，党委办事机构归口领导政府部门，强化党的全面领导与统领式架构——党政耦合度达到历史峰值。' },
  { period: '2020→', title: '数字政府', accent: '#10b981', desc: '「一网通办」「一网统管」「一件事一次办」：以数据共享替代公文流转，以算法监测替代人工督查。治理从命令式向数据驱动的算法式演进，穿透力与响应速度同步抬升。' },
];

/* 静态趋势图（保留并强化原有图表） */
const distortionTrend = {
  grid: GRID,
  tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2012', '2016', '2020', '2024']),
  yAxis: valueY({ name: '损耗指数', nameTextStyle: { color: '#5b6a82' } }),
  series: [{ type: 'line', smooth: true, data: [100, 72, 50, 35], lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }],
};

const costTrend = {
  grid: GRID,
  tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2013', '2017', '2021', '2024']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [{ type: 'bar', data: [18, 15, 13, 11], barWidth: 28, itemStyle: { color: '#10b981', borderRadius: [3, 3, 0, 0] } }],
};

export default function Page() {
  const [relKey, setRelKey] = useState('central-local');
  const [stageIdx, setStageIdx] = useState(0);
  const rel = RELATIONS.find((r) => r.key === relKey) || RELATIONS[0];

  /* 政府执行力雷达 —— 随府际关系维度联动着色 */
  const efficacyRadar = useMemo(() => radarOpt(
    ['目标分解', '资源调配', '考核问责', '政策落地', '纠偏修正', '横向协同'],
    [95, 78, 92, 85, 62, 58],
    { name: '执行效能', color: rel.accent },
  ), [rel.accent]);

  /* 全球行政效能对比雷达（保留原双系列对比） */
  const efficacyCompare = {
    legend: { data: ['中国', '发达经济体均值'], textStyle: { color: '#93a1b5' }, top: 0 },
    radar: { indicator: [{ name: '动员广度', max: 100 }, { name: '执行速度', max: 100 }, { name: '资源调配', max: 100 }, { name: '政策修正', max: 100 }, { name: '透明度', max: 100 }, { name: '容错弹性', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{ type: 'radar', data: [
      { value: [98, 92, 95, 80, 55, 60], name: '中国', lineStyle: { color: rel.accent }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      { value: [60, 55, 65, 80, 88, 82], name: '发达经济体均值', lineStyle: { color: '#22d3ee' } },
    ] }],
  };

  /* 五级政府结构 donut */
  const tierDonut = useMemo(() => {
    const o = donutOpt(GOV_TIERS.map((t) => ({ name: t.name, value: t.value })));
    o.series[0].data = o.series[0].data.map((d, i) => ({ ...d, itemStyle: { color: GOV_TIERS[i].color } }));
    o.tooltip = { trigger: 'item', formatter: '{b}：职能承载 {c}% · 示意' };
    return o;
  }, []);

  /* 财政事权-支出责任错配：中央 vs 地方 收入占比 vs 支出占比 */
  const fiscalMismatch = useMemo(() => stackedBarOpt({
    categories: ['财政收入占比', '财政支出占比'],
    series: [
      { name: '中央', data: [54, 14], itemStyle: { color: '#c41e3a' } },
      { name: '地方', data: [46, 86], itemStyle: { color: '#22d3ee' } },
    ],
  }), []);

  /* 压力加码：原始目标 vs 逐级上浮 vs 可用资源 */
  const addOnPressure = {
    grid: GRID,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    xAxis: categoryX(['中央', '省', '市', '县', '基层']),
    yAxis: valueY(),
    series: [
      { name: '层层加码后目标', type: 'line', smooth: true, data: [100, 115, 130, 130, 130], lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.1)' }, symbolSize: 7 },
      { name: '可调度资源', type: 'line', smooth: true, data: [100, 92, 80, 70, 55], lineStyle: { color: '#22d3ee', width: 2, type: 'dashed' }, symbolSize: 7 },
    ],
  };

  return (
    <div>
      <PageHeader badge="Administrative System" title="政府体系与行政执行逻辑" subtitle="权力架构 · 压力传导 · 组织算法 · 执行效能 —— 党政耦合的统领式行政机器拆解" />
      <IntroCard>政府体系的本质是一台「<strong style={{ color: 'var(--text-primary)' }}>目标—分解—承压—变通</strong>」的执行机器。党对政府工作的全面领导解决了官僚机构在多目标冲突下的决策迟滞，<strong style={{ color: 'var(--text-primary)' }}>双轨合一</strong>使政治意志无阻碍转化为行政指令；而五级层级的逐级分解，则在赋予超强动员力的同时，内生出「层层加码」与「上有政策、下有对策」的结构性张力。读懂政府，先读懂权力如何沿纵向链条传导、衰减与变形。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="5 级" label="政府层级 · 央省市县乡" accent="#c41e3a" />
        <Stat value="≈800万" label="行政编制 · 示意量级" accent="#22d3ee" />
        <Stat value="26" label="国务院组成部门 · 大部制" accent="#e8a317" />
        <Stat value="≈10万亿" label="中央对地方转移支付 · 示意" accent="#10b981" />
      </Grid>

      {/* 1 · 府际关系选择器 */}
      <Card title="交互一 · 府际关系六维度切换 —— 权力轴线的运行机制 / 张力 / 改革" className="mb-6">
        <SelectorBar items={RELATIONS} activeKey={relKey} onSelect={setRelKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${rel.accent}` }}>
          <div className="text-xs mono mb-2" style={{ color: rel.accent }}>权力轴线 · {rel.axis}</div>
          <Grid cols={3}>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>运行机制</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rel.mech}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>结构张力</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rel.tension}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>近期改革</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rel.reform}</p>
            </div>
          </Grid>
        </div>
        <Grid cols={2}>
          <Card title="政府执行力雷达（随维度联动 · 示意）"><EChart option={efficacyRadar} style={{ height: 240 }} /></Card>
          <Card title="全球行政效能对比"><EChart option={efficacyCompare} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      {/* 2 · 压力型体制传导链 */}
      <Card title="压力型体制传导链 —— 目标如何沿纵向衰减与变形" className="mb-6">
        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {PRESSURE_CHAIN.map((s, i) => (
            <div key={s.level} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `3px solid ${s.accent}`, position: 'relative' }}>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>第 {i + 1} 跳</div>
              <div className="text-sm font-semibold mb-1" style={{ color: s.accent }}>{s.level}</div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{s.set}</div>
              <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{s.detail}</p>
              <div className="text-[11px] mono" style={{ color: s.accent }}>{s.signal}</div>
            </div>
          ))}
        </div>
        <Grid cols={2}>
          <Card title="层层加码 · 目标上浮 vs 资源衰减（示意）"><EChart option={addOnPressure} style={{ height: 240 }} /></Card>
          <Card title="传导损耗指数趋势（穿透式督查后下降）"><EChart option={distortionTrend} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      {/* 3 + 5 · 五级结构 + 财政错配 */}
      <Grid cols={2} className="mb-6">
        <Card title="五级政府结构 · 职能承载分布（示意）">
          <EChart option={tierDonut} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>层级越往下，承载的具体执行职能越重——「上面千条线、下面一根针」，基层是政策落地的最终承压面。</p>
        </Card>
        <Card title="财政事权—支出责任错配 ·「财权上收、事权下放」（示意）">
          <EChart option={fiscalMismatch} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>中央集中过半财政收入，却只承担约一成支出；地方以四成多收入承接近九成支出——缺口由转移支付与土地财政、地方债填补。</p>
        </Card>
      </Grid>

      {/* 6 · 行政体制改革时间线 */}
      <Card title="交互二 · 行政体制改革时间线 —— 分税制 → 数字政府" className="mb-6">
        <TimelineBar stages={REFORM_STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* 行政成本 + 组织算法 */}
      <Grid cols={2} className="mb-6">
        <Card title="行政成本占财政支出（去冗余 · 示意）"><EChart option={costTrend} style={{ height: 240 }} /></Card>
        <Card title="组织算法 · 精英官僚筛选">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>晋升建立在基层主政经验与跨部门历练的复合履历之上。多岗位轮换拆除利益藩篱，政绩评价从单一 GDP 向安全、民生、生态、党建多维矩阵演进。</p>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {[['锦标赛', '同级横向竞争晋升'], ['下管一级', '人事任免向上集中'], ['异地交流', '切断地方利益网络']].map(([t, d]) => (
              <div key={t} className="os-card p-2" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--china-red)' }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* 7 · FrameworkTrio */}
      <FrameworkTrio cards={[
        { title: '压力型体制', subtitle: '目标责任制 · 考核', body: '把宏伟蓝图量化为层层加压的考核指标与「责任状」，将地方政府与官僚个体转化为高强度执行单位——委托代理问题的体制内解法，以政治激励对冲信息不对称。', pillars: [['目标承包', '约束性指标 + 一票否决。'], ['层层加码', '逐级上浮留安全垫。'], ['督查回看', '穿透抽检防过滤。']] },
        { title: '央地博弈', subtitle: '财权事权 · 条块', body: '中央握财权与人事，地方担事权与执行；条块分割叠加财政错配，使地方在「增长锦标赛」与「风险一票否决」间走钢丝——博弈即治理的常态结构。', pillars: [['财权上收', '分税制重塑格局。'], ['事权下放', '基层小马拉大车。'], ['转移支付', '纵向再平衡阀门。']] },
        { title: '执行算法', subtitle: '运动式 → 常规化', body: '从命令式向算法式演进：运动式治理用于攻坚拔点，常规化制度承接长效；数字政府以数据反馈替代直觉决策，穿透力经数字化审计达到历史峰值。', pillars: [['运动式', '饱和动员攻坚。'], ['常规化', '制度沉淀长效。'], ['算法式', '数据驱动自动控制。']] },
      ]} />

      <ModuleFooter moduleId="govsystem" disclaimer="公开资料整理，数值为示意量级、非官方统计 · 仅供分析框架参考" sourceNote="由 china.html「党政机构职能」专题迁移升级扩容" />
    </div>
  );
}
