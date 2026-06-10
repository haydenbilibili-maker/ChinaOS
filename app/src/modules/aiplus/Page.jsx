import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const computeTrend = {
  legend: { data: ['规模 EFLOPS', '占总算力 %'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 44, right: 44, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024', '2025E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: [{ type: 'value', name: 'EFLOPS', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } }, { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { show: false } }],
  series: [
    { name: '规模 EFLOPS', type: 'bar', data: [100, 150, 197, 230, 300], barWidth: 24, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
    { name: '占总算力 %', type: 'line', yAxisIndex: 1, smooth: true, data: [16, 22, 28, 32, 38], lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' } },
  ],
};
const modelRadar = {
  legend: { data: ['国内头部', '海外旗舰'], textStyle: { color: '#93a1b5' }, top: 0 },
  radar: { indicator: [{ name: '多语言', max: 100 }, { name: '工具调用', max: 100 }, { name: '推理成本', max: 100 }, { name: '长上下文', max: 100 }, { name: '多模态', max: 100 }, { name: '开源生态', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [80, 75, 85, 80, 82, 95], name: '国内头部', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [95, 95, 70, 90, 92, 60], name: '海外旗舰', lineStyle: { color: '#22d3ee' } },
  ] }],
};
const investPie = {
  tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 30, name: 'AI+ 制造', itemStyle: { color: '#c41e3a' } },
    { value: 22, name: 'AI+ 政务', itemStyle: { color: '#22d3ee' } },
    { value: 18, name: 'AI+ 医疗', itemStyle: { color: '#10b981' } },
    { value: 16, name: 'AI for Science', itemStyle: { color: '#e8a317' } },
    { value: 14, name: '其他', itemStyle: { color: '#64748b' } },
  ] }],
};

const CHAINS = [
  ['智算与电力', '枢纽节点、绿电交易与 PUE 约束决定训练成本曲线。'],
  ['模型与应用', '开源权重 + 行业微调 vs 闭源 API；多模态与 Agent 拉长评测维度。'],
  ['合规与数据', '深度合成标识、个人信息保护与跨境传输评估抬高合规成本。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="AI+ · 智算主权" title="人工智能+（AI+）行动" subtitle="行业渗透 · 智算主权 · 模型与合规 —— 从「模型热」到「人工智能+」制度化落地" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>国务院「人工智能+」行动意见推动 AI 与制造、政务、医疗、科研融合；地方配套算力券与数据开放。约束变量仍是<strong style={{ color: 'var(--text-primary)' }}>高端训练芯片可得性、高质量行业数据与生成式内容合规</strong>。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="4,500+" label="备案生成式服务(累计)" accent="#c41e3a" />
        <Stat value="190+" label="大模型相关企(示意)" accent="#22d3ee" />
        <Stat value="~30%" label="企业 AI 渗透率(区间)" accent="#10b981" />
        <Stat value="230+ E" label="全国算力规模 (EFLOPS)" accent="#e8a317" />
      </Grid>

      <Card title="政策与产业三条链" className="mb-6">
        <Grid cols={3}>
          {CHAINS.map(([t, d], i) => (
            <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{i + 1} · {t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="智能算力规模与占比（示意）"><EChart option={computeTrend} style={{ height: 240 }} /><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>东数西算与智算中心扩建推动 EFLOPS 级增长；智算占比与 GPU/ASIC 供给及电价强相关。</p></Card>
        <Card title="模型能力维度对比（2024 · 示意）"><EChart option={modelRadar} style={{ height: 240 }} /><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>国产开源权重（Qwen、DeepSeek 路线等）降低试错成本，推动政务与制造私有化部署。</p></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="行业渗透 · AI+ 制造与治理">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>制造侧聚焦质检、排产与设备预测维护；政务侧「一网通办」与公文辅助；科研侧 AI for Science。采购规则、数据分级与审计留痕决定规模化节奏。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AI+ 制造</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>工业软件、MES 与视觉检测闭环；与半导体、汽车链深度绑定。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AI+ 政务</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>城市大脑与应急指挥；需满足等保与信创栈兼容。</p></div>
          </div>
        </Card>
        <Card title="重点领域 AI 投入结构（2025E · 示意）"><EChart option={investPie} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="生成式 AI 治理要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 备案与安全评估', '生成式服务上线需满足算法备案与内容安全；跨境场景叠加数据出境评估。'],
            ['2 · 语料与知识产权', '训练数据授权、开源协议与法院判决塑造成本与风险溢价。'],
            ['3 · 出口与供应链', '高端 GPU 与先进封装管制将「算力主权」固化为地缘变量。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="制度锚点"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>AI+ 的边际收益由算力电价、数据可及性与合规成本共同决定；与半导体、能源、数据要素模块强耦合。</p>
        <div className="flex flex-wrap gap-2 mt-3">{['智算中心', '东数西算', '行业大模型', '备案合规', '多模态', 'Agent', '人工智能+'].map((k) => (<span key={k} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{k}</span>))}</div>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>算力与渗透率为模型与公开报道综合示意；以部委公报与企业披露为准 · 由 china.html「AI+」专题迁移</p>
    </div>
  );
}
