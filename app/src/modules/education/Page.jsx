import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

/* ============ 学段数据（示意） ============ */
const STAGES = [
  {
    key: 'pre', label: '学前教育', accent: '#e8a317',
    scale: '4,700 万在园', gross: '91.1%', cohort: '0–6 岁',
    contradiction: '普惠性资源不足 · 城乡与公民办结构失衡 · 入园成本仍偏高',
    lever: '「公办园 + 普惠民办园」双轨扩容；学前纳入基本公共服务，财政生均补贴托底。',
  },
  {
    key: 'compulsory', label: '义务教育', accent: '#c41e3a',
    scale: '1.6 亿在校', gross: '95.7%', cohort: '6–15 岁',
    contradiction: '县域优质资源虹吸 · 城镇大班额 · 「学区房」资本化 · 师资倒挂',
    lever: '集团化办学 + 教师交流轮岗；义务教育优质均衡评估，遏制掐尖与跨区择校。',
  },
  {
    key: 'highschool', label: '普通高中', accent: '#f97316',
    scale: '2,800 万在校', gross: '—', cohort: '15–18 岁',
    contradiction: '普职分流的「中考焦虑」前置 · 县中塌陷 · 县城优质生源外流',
    lever: '扩大普高学位供给；「县中振兴计划」回流师资生源；推动综合高中试点。',
  },
  {
    key: 'vocational', label: '职业教育', accent: '#22d3ee',
    scale: '3,500 万在校', gross: '—', cohort: '中职 + 高职',
    contradiction: '社会地位偏低 · 升学天花板 · 产教「两张皮」· 企业参与意愿弱',
    lever: '职教高考制度化打通学历通道；职教本科扩容；市域产教联合体 + 行业产教融合共同体。',
  },
  {
    key: 'higher', label: '高等教育', accent: '#10b981',
    scale: '4,760 万在校', gross: '60.2%', cohort: '本专科',
    contradiction: '学历通胀 · 专业与产业错位 · 毕业生就业压力 · 「慢就业」与考研内卷',
    lever: '「双一流」+ 新工科 / 新医科 / 新农科 / 新文科；学科专业动态调整对接战略产业。',
  },
  {
    key: 'graduate', label: '研究生', accent: '#a78bfa',
    scale: '388 万在校', gross: '—', cohort: '硕博',
    contradiction: '基础学科拔尖人才不足 · 「卡脖子」领域博士供给缺口 · 学硕专硕定位',
    lever: '专业学位扩招对接工程实践；「强基计划」+ 基础学科拔尖人才培养基地；超常规博士点布局。',
  },
  {
    key: 'lifelong', label: '终身教育', accent: '#93a1b5',
    scale: '体系建设中', gross: '—', cohort: '全年龄',
    contradiction: '技能折旧加速 · 数字鸿沟 · 成人继续教育认证体系碎片化',
    lever: '国家终身教育「学分银行」；技能型社会与学习型社会，AIGC 时代技能实时刷新。',
  },
];

/* ============ 保留：STEM 占比趋势 ============ */
const stemGrowth = {
  grid: { ...GRID, left: 40 },
  tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2018', '2020', '2022', '2024E']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [{ name: 'STEM 毕业生占比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [35, 38, 42, 47], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.1)' } }],
};

/* ============ 保留：职教地位升格雷达 ============ */
const vocationalRadar = {
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
  radar: { indicator: [{ name: '社会地位', max: 100 }, { name: '薪酬水平', max: 100 }, { name: '升学通道', max: 100 }, { name: '企业认可度', max: 100 }, { name: '实操设施', max: 100 }], axisName: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [30, 45, 20, 55, 50], name: '2020', lineStyle: { color: LABEL.color }, itemStyle: { color: LABEL.color } },
    { value: [65, 75, 80, 85, 92], name: '2024E', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } },
  ] }],
};

/* ============ 保留：家庭教育投入预期雷达（双减） ============ */
const eduCostRadar = {
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
  radar: { indicator: [{ name: '校外培训支出', max: 100 }, { name: '素质教育关注度', max: 100 }, { name: '职业技能投资', max: 100 }, { name: '校内资源利用率', max: 100 }, { name: '家庭心理压力', max: 100 }], axisName: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [95, 40, 30, 60, 98], name: '「双减」前', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' } },
    { value: [15, 85, 75, 92, 60], name: '「双减」后预期', lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.15)' } },
  ] }],
};

/* ============ 普职分流：普高 vs 中职 招生占比演进（示意） ============ */
const trackYears = ['2010', '2014', '2018', '2021', '2023', '2025E'];
const splitOpt = {
  ...stackedBarOpt({
    categories: trackYears,
    series: [
      { name: '普通高中', data: [50, 53, 57, 60, 62, 63], itemStyle: { color: '#c41e3a' } },
      { name: '中职 / 职高', data: [50, 47, 43, 40, 38, 37], itemStyle: { color: '#22d3ee' } },
    ],
  }),
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => `${v}%` },
};

/* ============ 毕业生规模 vs 城镇调查失业率（双轴，示意） ============ */
const gradYears = ['2015', '2017', '2019', '2021', '2023', '2024', '2025E'];
const gradPressureOpt = {
  tooltip: { trigger: 'axis' },
  legend: { textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
  grid: { ...GRID, left: 44, right: 44, top: 30 },
  xAxis: categoryX(gradYears),
  yAxis: [
    valueY({ name: '万人', nameTextStyle: { color: LABEL.color }, axisLabel: { color: LABEL.color } }),
    valueY({ name: '%', position: 'right', splitLine: { show: false }, axisLabel: { formatter: '{value}%', color: LABEL.color } }),
  ],
  series: [
    { name: '高校毕业生规模', type: 'bar', barWidth: 18, data: [749, 795, 834, 909, 1158, 1179, 1222], itemStyle: { color: '#e8a317' } },
    { name: '16–24 岁城镇调查失业率', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: [10.5, 10.1, 11.6, 14.3, 18.2, 16.5, 15.8], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
  ],
};

/* ============ 人口受教育结构 donut（示意，15 岁及以上人口） ============ */
const eduStructureOpt = donutOpt([
  { name: '小学及以下', value: 31, itemStyle: { color: '#475569' } },
  { name: '初中', value: 34, itemStyle: { color: '#64748b' } },
  { name: '高中 / 中职', value: 17, itemStyle: { color: '#22d3ee' } },
  { name: '大专', value: 9, itemStyle: { color: '#e8a317' } },
  { name: '本科及以上', value: 9, itemStyle: { color: '#c41e3a' } },
]);

/* ============ 工科毕业生规模国际对比 bar（示意，万人/年） ============ */
const engineerBarOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => `${v} 万/年` },
  grid: { left: 64, right: 24, top: 16, bottom: 24 },
  xAxis: valueY(),
  yAxis: { type: 'category', data: ['中国', '印度', '美国', '俄罗斯', '日本', '德国'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color } },
  series: [{
    type: 'bar', barWidth: 16,
    data: [
      { value: 470, itemStyle: { color: '#c41e3a' } },
      { value: 260, itemStyle: { color: '#64748b' } },
      { value: 56, itemStyle: { color: '#64748b' } },
      { value: 45, itemStyle: { color: '#64748b' } },
      { value: 34, itemStyle: { color: '#64748b' } },
      { value: 22, itemStyle: { color: '#64748b' } },
    ],
    label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 },
  }],
};

/* ============ 教育竞争力雷达（多维） ============ */
const compIndicators = ['基础教育', 'STEM 培养', '职业教育', '高校科研', '国际化', '教育普惠'];
const COMP = {
  cn: { name: '中国', color: '#c41e3a', value: [88, 82, 58, 74, 52, 80] },
  bench: { name: 'OECD 高位参照', color: '#22d3ee', value: [80, 78, 82, 90, 88, 72] },
};

/* ============ R&D 人才结构 donut（示意） ============ */
const rdOpt = donutOpt([
  { name: '企业研发人员', value: 62, itemStyle: { color: '#c41e3a' } },
  { name: '高校 / 科研院所', value: 28, itemStyle: { color: '#22d3ee' } },
  { name: '政府属研究机构', value: 10, itemStyle: { color: '#e8a317' } },
]);

/* ============ 改革时间线 ============ */
const REFORMS = [
  { period: '1986–2000', title: '普及九年义务', accent: '#93a1b5', desc: '《义务教育法》立法，「两基」攻坚。教育从精英筛选转向普及托底，建立全民人力资本的基础底盘。' },
  { period: '1999–2010', title: '高校扩招', accent: '#e8a317', desc: '高校大规模扩招，毛入学率从个位数跃升至接近普及化。学历红利释放，但也埋下结构性错位与学历通胀的伏笔。' },
  { period: '2014–2019', title: '职教体系化', accent: '#22d3ee', desc: '现代职业教育体系框架确立，「双高计划」启动。职教从「断头路」向「立交桥」转型，但社会认可滞后。' },
  { period: '2021', title: '「双减」校准', accent: '#c41e3a', desc: '校外学科类培训资本化被取缔，作业与校外负担双减。教育竞争被引回公共资源公平轨道，去杠杆社会总成本。' },
  { period: '2022–2024', title: '普职分流 / 职教高考', accent: '#10b981', desc: '新《职业教育法》明确「同等重要」，职教高考打通升学通道，职教本科扩容。分流从「淘汰赛」转向「分轨制」。' },
  { period: '2025–', title: '拔尖创新人才', accent: '#a78bfa', desc: '聚焦基础学科与「卡脖子」领域，强基计划 + 拔尖基地 + 超常规博士布局。从数量红利转向质量与密度红利。' },
];

export default function Page() {
  const [stageKey, setStageKey] = useState('vocational');
  const [reformIdx, setReformIdx] = useState(4);
  const [compMode, setCompMode] = useState('cmp'); // cn | bench | cmp

  const stage = useMemo(() => STAGES.find((s) => s.key === stageKey) || STAGES[0], [stageKey]);

  const compOpt = useMemo(() => {
    const base = {
      legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
      radar: {
        indicator: compIndicators.map((n) => ({ name: n, max: 100 })),
        axisName: { color: LABEL.color, fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
        axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
        splitArea: { show: false },
      },
    };
    const seriesData = [];
    if (compMode === 'cn' || compMode === 'cmp') {
      seriesData.push({ value: COMP.cn.value, name: COMP.cn.name, lineStyle: { color: COMP.cn.color, width: 2 }, itemStyle: { color: COMP.cn.color }, areaStyle: { color: 'rgba(196,30,58,0.14)' } });
    }
    if (compMode === 'bench' || compMode === 'cmp') {
      seriesData.push({ value: COMP.bench.value, name: COMP.bench.name, lineStyle: { color: COMP.bench.color, width: 2 }, itemStyle: { color: COMP.bench.color }, areaStyle: { color: 'rgba(34,211,238,0.1)' } });
    }
    return { ...base, series: [{ type: 'radar', data: seriesData }] };
  }, [compMode]);

  return (
    <div>
      <PageHeader badge="Education · Talent Supply Chain" title="人才供给与分流 · 高教与职教" subtitle="学段分流 · 双减 · 普职分轨 · 工程师红利 · 学历通胀 —— 教育系统的人才算法重构" />
      <IntroCard>中国正通过「新工科」与职教体系化重塑人才算法，核心是修复高校输出与产业需求之间的结构性「错位」：引导资源向集成电路、人工智能、新能源等战略领域倾斜，将海量毕业生转化为支撑复杂工业体系的「卓越工程师兵团」——从学历红利转向能力溢价，从人口红利转向人才红利。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="95.7%" label="九年义务教育巩固率" accent="#c41e3a" />
        <Stat value="60.2%" label="高等教育毛入学率" accent="#e8a317" />
        <Stat value="1,222 万" label="年高校毕业生规模 · 全球最大" accent="#a78bfa" />
        <Stat value="3,500 万" label="职业教育在校生 · 技能型社会转型" accent="#22d3ee" />
      </Grid>

      {/* ===== 学段选择器 ===== */}
      <Card title="学段透视 — 规模 · 毛入学率 · 关键矛盾 · 政策抓手" className="mb-6">
        <SelectorBar items={STAGES} activeKey={stageKey} onSelect={setStageKey} />
        <Grid cols={3} className="mb-4">
          <div className="os-card p-4" style={{ borderLeft: `3px solid ${stage.accent}` }}>
            <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>规模（示意）</div>
            <div className="text-lg font-semibold" style={{ color: stage.accent }}>{stage.scale}</div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>覆盖群体 · {stage.cohort}</div>
          </div>
          <div className="os-card p-4" style={{ borderLeft: '3px solid #e8a317' }}>
            <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>毛入学率 / 巩固率</div>
            <div className="text-lg font-semibold" style={{ color: '#e8a317' }}>{stage.gross}</div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>普及度量（示意）</div>
          </div>
          <div className="os-card p-4" style={{ borderLeft: '3px solid #c41e3a' }}>
            <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>关键矛盾</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{stage.contradiction}</p>
          </div>
        </Grid>
        <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${stage.accent}` }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>政策抓手 · {stage.label}</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{stage.lever}</p>
        </div>
      </Card>

      {/* ===== 普职分流 + 毕业生压力 ===== */}
      <Grid cols={2} className="mb-6">
        <Card title="普职分流 — 普高 vs 中职招生占比演进（% · 示意）">
          <EChart option={splitOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>分流比例从「五五开」向普高倾斜；「职教高考」把中职从断头路接入升学立交桥，分流逻辑本质是产业结构的人才映射。</p>
        </Card>
        <Card title="毕业生规模 vs 青年失业率（双轴 · 示意）">
          <EChart option={gradPressureOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>毕业生规模逐年攀升至 1,200 万级，与 16–24 岁失业率形成「数量—就业」张力，倒逼专业结构与产业需求对齐。</p>
        </Card>
      </Grid>

      {/* ===== 学历结构 + 工程师红利 ===== */}
      <Grid cols={2} className="mb-6">
        <Card title="人口受教育结构 — 15 岁及以上（% · 示意）">
          <EChart option={eduStructureOpt} style={{ height: 250 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>本科及以上仅约一成 —— 学历金字塔仍宽底高塔，「学历通胀」是结构尾部的局部现象而非全局过剩。</p>
        </Card>
        <Card title="工科毕业生规模国际对比（万人/年 · 示意）">
          <EChart option={engineerBarOpt} style={{ height: 250 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>理工科毕业生年规模数倍于发达国家总和 —— 这是「工程师红利」的人口基底，密度对冲劳动力总量缺口。</p>
        </Card>
      </Grid>

      {/* ===== 教育竞争力雷达（可切换） ===== */}
      <Card title="教育竞争力多维评估 — 中国 vs OECD 高位参照（示意）" className="mb-6">
        <SelectorBar
          items={[
            { key: 'cmp', label: '对比', accent: '#a78bfa' },
            { key: 'cn', label: '仅中国', accent: '#c41e3a' },
            { key: 'bench', label: '仅参照', accent: '#22d3ee' },
          ]}
          activeKey={compMode}
          onSelect={setCompMode}
        />
        <Grid cols={2}>
          <EChart option={compOpt} style={{ height: 280 }} />
          <div className="space-y-3">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>基础教育与 STEM 培养处于全球高位，构成人才供给的「厚度」；短板集中在<strong style={{ color: '#22d3ee' }}> 职业教育认可度 </strong>与<strong style={{ color: '#22d3ee' }}> 国际化 / 高校科研顶尖产出</strong>——从「规模优势」迈向「质量优势」是下一阶段主战场。</p>
            <div className="space-y-2">
              {compIndicators.map((n, i) => {
                const gap = COMP.cn.value[i] - COMP.bench.value[i];
                const lead = gap >= 0;
                return (
                  <div key={n} className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-tertiary)' }}>{n}</span>
                    <span className="font-semibold mono" style={{ color: lead ? '#10b981' : '#c41e3a' }}>{lead ? '+' : ''}{gap} {lead ? '领先' : '差距'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Grid>
      </Card>

      {/* ===== 保留图表组 ===== */}
      <Grid cols={2} className="mb-6">
        <Card title="STEM 毕业生占比趋势（% · 示意）"><EChart option={stemGrowth} style={{ height: 240 }} /></Card>
        <Card title="职教「地位升格」多维评估（2020 vs 2024E · 示意）"><EChart option={vocationalRadar} style={{ height: 240 }} /></Card>
      </Grid>

      {/* ===== 改革时间线 ===== */}
      <Card title="教育改革时间线 — 从普及托底到拔尖创新" className="mb-6">
        <TimelineBar stages={REFORMS} activeIdx={reformIdx} onSelect={setReformIdx} />
      </Card>

      {/* ===== 工程师红利算法（保留+扩展） ===== */}
      <Card title="01 · 工程师红利算法 — 从学历红利到能力溢价" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>"Shifting from academic filters to industrial precision supply." 体制正在把教育系统从「学历筛选器」改造为「产业精准供给链」。</p>
        <Grid cols={3}>
          {[['新工科建设', '资源向集成电路、人工智能、新能源等战略领域倾斜，重塑高校专业结构以对接产业需求。'],
            ['卓越工程师兵团', '将年均千万级毕业生转化为支撑复杂工业体系的工程师群体，人才密度持续上升。'],
            ['错位修复', '核心问题是高校输出与产业需求的结构性错位 —— 学历通胀的另一面是技能缺口。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      {/* ===== R&D 人才 + 职教重构 ===== */}
      <Grid cols={2} className="mb-6">
        <Card title="02 · R&D 人才结构 — 研发人员总量世界第一（% · 示意）">
          <EChart option={rdOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>研发人员总量约 635 万（全时当量），主体沉淀于企业一线 —— 工程师红利正从「数量池」转化为「创新当量」。</p>
        </Card>
        <Card title="03 · 职教价值重构">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>职教本科的建立正在打破蓝领阶层的「成长天花板」：升学通道、薪酬水平与企业认可度全面抬升，普职分流从「淘汰赛」转向「分轨制」。</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>职教高考制度</span><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>已确立</span></div>
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>产教融合共同体</span><span className="font-semibold" style={{ color: '#22d3ee' }}>加速布局</span></div>
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>职教本科通道</span><span className="font-semibold" style={{ color: '#10b981' }}>打破天花板</span></div>
          </div>
        </Card>
      </Grid>

      {/* ===== 双减 + 家庭投入预期 ===== */}
      <Grid cols={2} className="mb-6">
        <Card title="04 · 「双减」政策 — 消解内耗的系统校准">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>「双减」在现实主义视角下是一场「社会总成本的结构性去杠杆」：取缔资本化的教培市场，阻止中等收入家庭把绝大部分资源投入「内卷式」教育军备竞赛，释放家庭消费潜力，并把教育竞争引回公共教育资源的公平轨道。</p>
          <div className="mt-4 space-y-2">
            {[['De-commodification of Education', '教育去商品化 —— 校外培训支出与家庭心理压力大幅回落，校内资源利用率回升。'],
              ['Social Capital Reset', '社会资本重置 —— 素质教育关注度与职业技能投资取代「军备竞赛式」补课支出。']].map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
        <Card title="家庭教育投入预期变化（「双减」前后 · 示意）"><EChart option={eduCostRadar} style={{ height: 280 }} /></Card>
      </Grid>

      {/* ===== AI 时代育人 ===== */}
      <Card title="05 · AI 时代的育人范式 — 构建终身技能体系" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>教育改革的终极目标是实现「人的现代化」与「产业智能化」的同步。随着 AIGC 技术对传统认知的冲击，中国教育正从「知识灌输」转向「批判性思维与人机协作」；未来的教育不仅发生在校园，而是通过数字基建实现全生命周期的技能实时刷新，确保 14 亿人作为生产要素的持续性增值。</p>
        <div className="flex gap-6 flex-wrap mt-4 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>// TALENT_DENSITY: RISING</span>
          <span>// VOCATIONAL_VALUE: UPGRADING</span>
          <span>// LIFELONG_LEARNING: BUILDING</span>
          <span>// AI_READY: CALIBRATING...</span>
        </div>
      </Card>

      <FrameworkTrio cards={[
        { title: '数量到质量', subtitle: '人口红利 → 人才红利', body: '人口总量红利衰减，体制转向「人才密度」红利：以单位人口的工程师与研发当量，对冲劳动力总量与老龄化的下行压力。', pillars: [['工程师池', '理工科毕业生年规模全球居首'], ['密度对冲', '质量替代数量支撑复杂工业体系']] },
        { title: '分流即映射', subtitle: '普职分轨 = 产业结构', body: '普职分流本质是教育系统对产业结构的人才映射：制造业升级需要大批高素质技术技能人才，职教高考把分流从淘汰赛改造为分轨制。', pillars: [['职教高考', '打通中职—职教本科升学通道'], ['产教融合', '市域联合体对接区域产业链']] },
        { title: '卡脖子人才', subtitle: '基础学科 · 拔尖创新', body: '「卡脖子」的底层是拔尖创新与基础学科人才缺口：强基计划 + 拔尖基地 + 超常规博士布局，定向供给战略领域的高端智力。', pillars: [['基础学科', '数理化生等长周期投入'], ['超常规博士', '集成电路 / AI 等定向扩招']] },
      ]} />

      <Card title="系统观察" className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>「教育主权是人才红利的最终防御壁垒」—— 普职分流与双减重塑供给结构，工程师红利的密度对冲劳动力总量缺口；但学历通胀与技能缺口的错位修复，仍取决于职教社会地位能否真正落地、拔尖创新人才能否定向突破「卡脖子」环节。</p></Card>

      <ModuleFooter moduleId="education" disclaimer="教育规模 / 毛入学率 / 毕业生与失业率 / 国际对比等均为公开资料整理后的示意值，非官方统计 · 仅供分析框架参考，非投资或政策建议" />
    </div>
  );
}
