import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ─── 堆型/路线档案 ──────────────────────────────────────────────────────────
// maturity=技术成熟度示意；autonomy=自主化率示意；commercial=商业化进度示意
const GENS = [
  {
    key: 'hualong', label: '华龙一号(三代)', accent: '#c41e3a', maturity: 98, autonomy: 95, commercial: 96,
    tag: '三代 · 主力基荷', units: '在运/在建合计领跑',
    desc: '自主三代压水堆，设计总包与设备国产化率接近 100%，是新增核准的主力路线。从 AP1000/EPR 引进消化中长出的「国之重器」，已实现批量化建造与对外出口——能源主权从图纸落到混凝土的样板。',
    strategic: '把三代堆的定价权、标准权、供应链握在自己手里；出海即是把基荷电力的制度模板向外输出。',
  },
  {
    key: 'guohe', label: '国和一号(三代)', accent: '#e8a317', maturity: 90, autonomy: 88, commercial: 78,
    tag: '三代 · 大功率非能动', units: '示范工程投运',
    desc: 'CAP1400，基于 AP1000 非能动技术的自主大功率机型。非能动安全系统在断电工况下靠重力/自然循环导出余热，降低对外部电源与人为干预的依赖——把安全从「操作纪律」转成「物理定律」。',
    strategic: '与华龙形成双轮:压水堆路线的功率上限与非能动安全标准的自主化对冲单一技术路径的系统性风险。',
  },
  {
    key: 'htr', label: '高温气冷堆(四代)', accent: '#22d3ee', maturity: 88, autonomy: 93, commercial: 55,
    tag: '四代 · 固有安全', units: 'HTR-PM 示范并网',
    desc: '石墨球燃料 + 氦气冷却，HTR-PM 示范验证「固有安全」——失冷工况下堆芯靠物理特性自然停堆,不熔毁。高温出口热可用于工业供热、制氢与热电联供,打开核能的非电力应用场景。',
    strategic: '四代堆里工程化最靠前的一条;以固有安全换取厂址灵活性,把核能推向工业脱碳的纵深。',
  },
  {
    key: 'fast', label: '快堆(四代)', accent: '#a855f7', maturity: 82, autonomy: 80, commercial: 40,
    tag: '四代 · 闭式循环', units: '示范堆建设中',
    desc: '快中子增殖堆,提高铀资源利用率数十倍,并嬗变长寿命核素。与乏燃料后处理联动构成闭式燃料循环——把「一次通过」的资源浪费,变成可循环的能源主权布局。',
    strategic: '数十年尺度的铀资源解套方案;闭式循环一旦闭环,天然铀对外依存的杠杆将大幅削弱。',
  },
  {
    key: 'smr', label: '小型堆 SMR', accent: '#10b981', maturity: 50, autonomy: 75, commercial: 30,
    tag: '模块化 · 分布式', units: '玲龙一号示范',
    desc: '模块化小型堆,面向工业供热、海岛与数据中心供电。工厂预制、现场组装压缩工期,但审批、安全壳与应急半径是真实的制度成本——小不等于审批快。',
    strategic: '核能的「分布式」试探:在算力扩张与工业供热需求下卡位,但监管框架仍按大堆逻辑运转。',
  },
  {
    key: 'fusion', label: '可控核聚变', accent: '#38bdf8', maturity: 18, autonomy: 70, commercial: 8,
    tag: '前沿 · 长波卡位', units: 'EAST/BEST 工程',
    desc: 'EAST、HL-3 持续刷新等离子体参数,BEST 紧凑型聚变实验装置推进工程化;ITER 与 CFETR 牵动全球供应链。受材料、能量增益(Q值)约束,商用仍在数十年外——宜与裂变基荷解耦评估,不可挪用于近期电力规划。',
    strategic: '终极能源的长波下注:赢家通吃的卡位赛,赌的是材料、超导与等离子体控制的数十年复利,不赌短期回报。',
  },
];

// ─── 阶段时间线 ─────────────────────────────────────────────────────────────
const PHASES = [
  { period: '1985–2004', title: '引进起步', accent: '#64748b', desc: '秦山自主起步 + 大亚湾引进法国技术;装机微小,技术路线受制于人,核电在能源盘子里只是补充。' },
  { period: '2005–2015', title: '三代消化', accent: '#94a3b8', desc: 'AP1000/EPR 引进与华龙一号自主研发并行;福岛后核准放缓、安全标准抬升,在运装机约 26 GW。' },
  { period: '2016–2022', title: '自主华龙', accent: '#e8a317', desc: '核准节奏恢复,华龙一号批量化建造并首堆并网;装机突破 50 GW,设备国产化率逼近 100%。' },
  { period: '2023–2027', title: '批量化与出海', accent: '#c41e3a', desc: '年核准维持 10 台以上量级,华龙一号出口巴基斯坦等;在建规模稳居全球第一,核电从补充转为基荷主力。' },
  { period: '2028–2040', title: '四代与聚变', accent: '#22d3ee', desc: '高温气冷堆、快堆示范规模化,闭式燃料循环工程落地;聚变工程实验堆推进——长周期、跨代际的能源卡位。' },
];

export default function Page() {
  const [gen, setGen] = useState('hualong');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 2);
  const g = GENS.find((x) => x.key === gen) || GENS[0];

  // 交互① · 装机与在建（双轴:核电装机 GW + 在建机组数 台）
  const scaleDual = useMemo(() => {
    const years = ['2015', '2017', '2019', '2021', '2023', '2025E', '2030E'];
    const capacity = [26, 36, 45, 53, 57, 70, gen === 'fusion' ? 110 : gen === 'smr' ? 95 : 113];
    const building = [24, 20, 12, 16, 26, 30, 28];
    return {
      grid: { ...GRID, right: 44, bottom: 50 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
      xAxis: categoryX(years),
      yAxis: [
        valueY({ name: 'GW', nameTextStyle: { color: LABEL.color, fontSize: 9 }, axisLabel: { formatter: '{value}' } }),
        valueY({ name: '在建台', nameTextStyle: { color: LABEL.color, fontSize: 9 }, position: 'right', splitLine: { show: false }, axisLabel: { formatter: '{value}' } }),
      ],
      series: [
        { name: '在建机组(台)', type: 'bar', yAxisIndex: 1, barWidth: 16, data: building, itemStyle: { color: AXIS.lineStyle.color, borderRadius: 3 } },
        { name: '核电装机(GW)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, yAxisIndex: 0, data: capacity,
          lineStyle: { color: g.accent, width: 2.5 }, itemStyle: { color: g.accent }, areaStyle: { color: `${g.accent}14` } },
      ],
    };
  }, [gen, g]);

  // 交互① · 路线关键参数（成熟度/自主化/商业化）随切换
  const paramBar = useMemo(() => ({
    grid: { left: 70, right: 24, top: 12, bottom: 12 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c}%' },
    xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    yAxis: { type: 'category', data: ['商业化进度', '自主化率', '技术成熟度'], axisLabel: { color: LABEL.color, fontSize: 10 }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
    series: [{
      type: 'bar', barWidth: 16,
      data: [g.commercial, g.autonomy, g.maturity],
      itemStyle: { color: g.accent, borderRadius: 3 },
      label: { show: true, position: 'right', formatter: '{c}%', color: LABEL.color, fontSize: 10 },
    }],
  }), [g]);

  // 交互③ · 能源结构中的核电占比（发电量结构 donut）
  const mixDonut = useMemo(() => donutOpt([
    { name: '煤电', value: 58, itemStyle: { color: '#475569' } },
    { name: '水电', value: 13, itemStyle: { color: '#3b82f6' } },
    { name: '风电', value: 10, itemStyle: { color: '#22d3ee' } },
    { name: '光伏', value: 9, itemStyle: { color: '#e8a317' } },
    { name: '气电', value: 5, itemStyle: { color: '#a855f7' } },
    { name: '核电', value: 5, itemStyle: { color: '#c41e3a' } },
  ]), []);

  // 交互④ · 技术自主度雷达（产业链六维）
  const autonomyRadar = useMemo(() => radarOpt(
    ['堆型设计', '核燃料', '主泵', '压力容器', '数字仪控', '乏燃料后处理'],
    gen === 'hualong' ? [98, 95, 90, 100, 78, 70]
      : gen === 'guohe' ? [90, 92, 82, 95, 80, 68]
      : gen === 'htr' ? [93, 88, 85, 92, 82, 72]
      : gen === 'fast' ? [80, 78, 70, 85, 75, 88]
      : gen === 'smr' ? [78, 80, 75, 88, 76, 65]
      : [70, 60, 55, 50, 72, 60],
    { name: `${g.label} · 自主度`, color: g.accent },
  ), [gen, g]);

  // 交互⑤ · 三/四代堆型多维对比（堆叠/分组评分）
  const genCompare = useMemo(() => stackedBarOpt({
    categories: ['安全性', '经济性', '燃料利用', '废料最小化', '厂址灵活'],
    series: [
      { name: '三代(华龙/国和)', data: [85, 88, 60, 55, 50], itemStyle: { color: '#c41e3a', borderRadius: 0 }, stack: null, barWidth: 12 },
      { name: '四代(高温气冷/快堆)', data: [95, 65, 92, 85, 78], itemStyle: { color: '#22d3ee', borderRadius: 0 }, stack: null, barWidth: 12 },
    ],
  }), []);
  // stackedBarOpt 默认 stack:'total';此处覆盖为分组对比
  genCompare.series = genCompare.series.map((s) => ({ ...s, stack: null }));

  return (
    <div>
      <PageHeader badge="Nuclear · 基荷 · 零碳主权" title="核电 · 华龙一号与四代堆" subtitle="可调度的零碳基荷 · 从引进到出海 · 快堆闭循环与聚变长波" />
      <IntroCard>
        在风光波动「靠天吃饭」之后,谁来兜底夜间与无风时段的负荷?核电是答案的物理形态——年利用小时数 7000+、可调度、零碳的<strong style={{ color: 'var(--text-primary)' }}>基荷电源</strong>。它不只是发电,而是一套从堆型设计、核燃料到乏燃料后处理的<strong style={{ color: 'var(--text-primary)' }}>能源主权栈</strong>:华龙一号把三代堆的标准与供应链握进手里,快堆与聚变则是数十年尺度的长波卡位。本页以示意值勾勒这套权力物理的轮廓。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="55+ 台" label="在运机组(量级)" accent="#c41e3a" />
        <Stat value="#1" label="在建核电规模(全球)" accent="#22d3ee" />
        <Stat value="~5%" label="全国发电量占比" accent="#e8a317" />
        <Stat value="4+" label="华龙出海机组(示意)" accent="#10b981" />
      </Grid>

      {/* ─── 交互① 堆型/路线选择器 ─────────────────────────────── */}
      <Card title="交互① · 堆型与技术路线选择器" className="mb-6">
        <SelectorBar items={GENS} activeKey={gen} onSelect={setGen} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${g.accent}` }}>
          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
            <span className="text-base font-semibold" style={{ color: g.accent }}>{g.label}</span>
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: `${g.accent}1a`, color: g.accent }}>{g.tag}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{g.units}</span>
          </div>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{g.desc}</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}><span style={{ color: g.accent }}>战略意义 · </span>{g.strategic}</p>
        </div>
        <Grid cols={3} className="mb-4">
          <Stat value={`${g.maturity}%`} label="技术成熟度(示意)" accent={g.accent} />
          <Stat value={`${g.autonomy}%`} label="自主化率(示意)" accent={g.accent} />
          <Stat value={`${g.commercial}%`} label="商业化进度(示意)" accent={g.accent} />
        </Grid>
        <Grid cols={2}>
          <Card title="装机与在建(双轴 · 随路线切换)"><EChart option={scaleDual} style={{ height: 240 }} /></Card>
          <Card title="路线关键参数(随路线切换)"><EChart option={paramBar} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      {/* ─── 交互② 时间线 ─────────────────────────────────────── */}
      <Card title="交互② · 核电自主化时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ─── 交互③④ 能源结构 + 自主度雷达 ───────────────────────── */}
      <Grid cols={2} className="mb-6">
        <Card title="交互③ · 发电量结构中的核电占比">
          <EChart option={mixDonut} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>核电约 5% 发电量占比,远低于法国(约 65%)、低于全球核电国均值。在「双碳」目标与煤电压减的张力下,这 5% 是仍待释放的基荷提升空间——而提升受厂址(沿海冷却水)、铀供应与公众接受度约束。</p>
        </Card>
        <Card title="交互④ · 技术自主度雷达(随路线切换)">
          <EChart option={autonomyRadar} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>压力容器、核燃料、堆型设计已高度自主;<strong style={{ color: 'var(--text-secondary)' }}>数字仪控(DCS)</strong>与<strong style={{ color: 'var(--text-secondary)' }}>乏燃料后处理</strong>是仍在补齐的两块短板——前者是「核电大脑」的软件主权,后者决定闭式循环能否闭环。</p>
        </Card>
      </Grid>

      {/* ─── 交互⑤ 三/四代对比 + 聚变 ──────────────────────────── */}
      <Grid cols={2} className="mb-6">
        <Card title="交互⑤ · 三代 vs 四代堆型多维对比(示意评分)">
          <EChart option={genCompare} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>三代堆胜在<strong style={{ color: 'var(--text-secondary)' }}>经济性与工程成熟度</strong>(华龙批量化、造价可控);四代堆胜在<strong style={{ color: 'var(--text-secondary)' }}>固有安全、燃料利用与废料最小化</strong>,但经济性与商业化仍待验证。两代不是替代而是分工:三代撑当下基荷,四代解长期燃料与安全。</p>
        </Card>
        <Card title="聚变研发 · 人造太阳的长波卡位">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>裂变是已落地的现实主义;聚变是赌数十年复利的长波下注。EAST、HL-3 刷新等离子体约束参数,BEST 紧凑型装置推进工程化,ITER/CFETR 牵动全球超导与材料供应链。受能量增益(Q值)、第一壁材料与等离子体控制约束,商用仍在数十年外——必须与裂变基荷<strong style={{ color: 'var(--text-primary)' }}>解耦评估</strong>,不可挪用于近期电力规划。</p>
          <div className="space-y-2">
            {[
              ['EAST 长脉冲', '高约束模式下持续刷新稳态运行时长,积累工程数据。', '#22d3ee'],
              ['BEST 紧凑装置', '面向工程化的紧凑型托卡马克,验证发电闭环关键技术。', '#38bdf8'],
              ['ITER 国际合作', '工程进度牵动全球部件交付,中国承担多个关键部件。', '#a855f7'],
            ].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* ─── 三框架 ──────────────────────────────────────────── */}
      <FrameworkTrio cards={[
        {
          title: '基荷压舱石', subtitle: '可调度的零碳基荷', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '核电=年利用小时 7000+、可调度、零碳的基荷;在风光随机出力之外兜底夜间与无风时段的负荷,与抽蓄、特高压共同构成新型电力系统的物理底盘。',
          pillars: [['~5% 占比', '提升空间犹在。'], ['7000+ 小时', '高利用率基荷。'], ['沿海厂址', '冷却水约束。']],
        },
        {
          title: '自主可控', subtitle: '从引进到华龙出海', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '从大亚湾引进、AP1000 消化,到华龙一号设计/设备近 100% 国产并出口——核电是「引进-消化-自主-出海」全链路走通的国之重器样板。',
          pillars: [['华龙批量化', '三代主力出海。'], ['DCS 短板', '仪控软件待补。'], ['后处理', '闭循环关键。']],
        },
        {
          title: '四代与聚变', subtitle: '长波能源卡位', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '高温气冷堆固有安全、快堆闭式循环削弱铀依存、聚变赌数十年材料与超导复利——四代与聚变是跨代际的能源主权布局,与裂变基荷解耦评估。',
          pillars: [['HTR-PM', '固有安全工程化。'], ['快堆', '闭循环解铀套。'], ['EAST/ITER', '聚变长波下注。']],
        },
      ]} />

      <ModuleFooter
        moduleId="nuclear"
        disclaimer="公开资料整理,装机/占比/成熟度/自主化等均为示意量级而非官方统计 · 仅供分析框架参考,聚变商用时间高度不确定,不构成电力规划或投资建议"
        sourceNote="由 china.html「核电」专题迁移升级"
      />
    </div>
  );
}
