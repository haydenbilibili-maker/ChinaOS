import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const AXIS = { lineStyle: { color: '#27324a' } };
const SPLIT = { lineStyle: { color: 'rgba(148,163,184,0.1)' } };

const trend = {
  grid: { left: 40, right: 16, top: 24, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['2016', '2018', '2020', '2022', '2023', '2025E'], axisLine: AXIS, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', name: '万亿', splitLine: SPLIT, axisLabel: { color: '#93a1b5' } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [2.1, 2.8, 3.6, 4.2, 4.5, 5.8], lineStyle: { color: '#c41e3a', width: 3 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }],
};

const patent = {
  grid: { left: 48, right: 48, top: 36, bottom: 24 },
  tooltip: { trigger: 'axis' },
  legend: { textStyle: { color: '#93a1b5' }, top: 0 },
  xAxis: { type: 'category', data: ['2015', '2017', '2019', '2021', '2023'], axisLine: AXIS, axisLabel: { color: '#93a1b5' } },
  yAxis: [
    { type: 'value', name: '件', splitLine: SPLIT, axisLabel: { color: '#93a1b5' } },
    { type: 'value', name: '%', max: 50, splitLine: { show: false }, axisLabel: { color: '#93a1b5', formatter: '{value}%' } },
  ],
  series: [
    { name: '专利申请', type: 'bar', data: [450, 820, 1500, 2800, 3900], barWidth: 22, itemStyle: { color: '#22d3ee', borderRadius: 4 } },
    { name: '国内占比', type: 'line', yAxisIndex: 1, smooth: true, data: [12, 15, 22, 28, 33], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};

const radar = {
  tooltip: {},
  legend: { textStyle: { color: '#93a1b5' }, bottom: 0 },
  radar: {
    indicator: [{ name: 'First-in-class', max: 100 }, { name: '临床效率', max: 100 }, { name: 'CRO 生态', max: 100 }, { name: '监管科学', max: 100 }, { name: '资本深度', max: 100 }, { name: '全球注册', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false }, axisLine: { lineStyle: { color: '#27324a' } },
  },
  series: [{
    type: 'radar', data: [
      { value: [65, 95, 98, 82, 75, 70], name: '中国', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' }, itemStyle: { color: '#c41e3a' } },
      { value: [98, 90, 80, 95, 95, 98], name: '美国', lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' }, itemStyle: { color: '#22d3ee' } },
    ],
  }],
};

const platforms = [
  ['造 · 平台菌株与底盘', '大宗化学品与平台分子路线成熟度高，成本曲线接近传统化工；高附加值功能分子仍依赖菌株迭代与代谢网络优化。', '国产化 40%+ · 材料/食品', '#c41e3a'],
  ['编 · 基因编辑与递送', 'CRISPR 等工具在科研与临床前广泛使用；体内递送、脱靶控制与伦理边界构成商业化与出海合规的核心约束。', '临床管线快速增长 · 附条件审批', '#10b981'],
  ['算 · AI + 蛋白质设计', '结构预测与生成模型缩短先导化合物发现周期；数据质量、实验验证与知识产权布局决定能否形成护城河。', '智算依赖 · 专利/许可产出', '#22d3ee'],
];

const pharma = [
  ['医保谈判与支付', '以价换量缩短创新药入院周期；续约规则与参照药选择直接影响峰值销售与研发回报模型。', '#c41e3a'],
  ['药械协同', '伴随诊断、影像与放疗设备与靶向药、免疫疗法（ADC/双抗/CGT）绑定；入院与合规链条共享。', '#e8a317'],
  ['国家基因库 CNGB', '种质与组学数据的战略储备与共享机制，平衡科研开放与国家安全审查。', '#10b981'],
  ['高等级生物安全实验室', 'P3/P4 布局支撑新发传染病与疫苗研发，建设与运维成本极高，区域分布不均。', '#22d3ee'],
];

const conclusions = [
  ['1 · BT + IT 深度融合', 'AI for Science 与自动化实验降低试错成本，但高质量标注数据与算力向头部集中，需公共平台对冲。'],
  ['2 · 支付改革塑造创新节奏', '集采与医保谈判决定现金流；企业需在「国内以价换量」与「出海临床与注册」之间做组合优化。'],
  ['3 · 生物安全即产业政策', '人类遗传资源、病原与数据出境规则抬高合规门槛，亦可能成为对外技术合作的非关税壁垒。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Bio · 生物世纪与 AI for Science" title="生物医药 · 基因技术与生物安全" subtitle="创新药 · CXO · 基因编辑 · 生物安全治理" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>生物医药、生物制造与合成生物学被列为新质生产力重点；License-out 增加反映全球分工中的资产定价权博弈。本模块从产业规模、研发投入、创新药生态与生物安全治理四维呈现生命科技布局——目标 2035 年生物经济占 GDP 约 10%。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="4.5 万亿" label="2023 生物产业规模 (RMB)" accent="#c41e3a" />
        <Stat value="15.5%" label="年均复合增速" accent="#10b981" />
        <Stat value="100 家+" label="生物医药上市企业" accent="#22d3ee" />
        <Stat value="#2" label="全球生物专利排名" accent="#e8a317" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="生物产业规模趋势（万亿 · 示意）"><EChart option={trend} style={{ height: 260 }} /></Card>
        <Card title="合成生物专利申请 vs 国内占比（示意）"><EChart option={patent} style={{ height: 260 }} /></Card>
      </Grid>

      <Card title="合成生物与生物制造 · 设计—构建—测试—学习循环" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>发酵工程、酶工程与 AI 蛋白设计结合，向材料、食品、能源延伸；监管框架、伦理审查与生物安全同步成为制度变量。</p>
        <Grid cols={3}>
          {platforms.map(([t, d, tag, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <div className="text-[10px] mt-2 font-semibold" style={{ color: c }}>{tag}</div>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="中美创新药生态对比（示意雷达）"><EChart option={radar} style={{ height: 300 }} /></Card>
        <Card title="创新药与生物安全 · 制度链条">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>国家集采（VBP）压降仿制药价格，倒逼企业转向创新；ADC、双抗、细胞与基因治疗（CGT）等前沿赛道融资与临床并行。人类遗传资源管理条例与数据出境安全评估交叉适用，构成「生物数据主权」的现实边界。</p>
          <div className="space-y-2">
            {pharma.map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="战略结论" className="mb-6">
        <Grid cols={3}>
          {conclusions.map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>生物经济是新质生产力中「长周期、强监管、高外部性」赛道；国家战略能力体现在种质、数据与实验室网络的可调度性，而非单一企业市值。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>规模为行业区间与模型示意；专利与临床数据以公开披露及 Nature Index 等为准 · 由 china.html「生物医药」专题迁移</p>
    </div>
  );
}
