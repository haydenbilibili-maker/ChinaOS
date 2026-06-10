import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const qubitTrend = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '比特', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [12, 24, 66, 113, 176, 255], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};
const cnUsRadar = {
  legend: { data: ['中国', '美国'], textStyle: { color: '#93a1b5' }, top: 0 },
  radar: { indicator: [{ name: '量子计算', max: 100 }, { name: '量子通信', max: 100 }, { name: '量子测量', max: 100 }, { name: '软件工具链', max: 100 }, { name: '仪器自主', max: 100 }, { name: '论文专利', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [82, 95, 80, 60, 50, 92], name: '中国', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [95, 70, 90, 95, 88, 88], name: '美国', lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } },
  ] }],
};
const maturityBar = {
  grid: { left: 70, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['量子计算', '量子测量', '量子通信'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [40, 70, 85], barWidth: 16, itemStyle: { color: (p) => ['#e8a317', '#22d3ee', '#10b981'][p.dataIndex], borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' } }],
};

const ROUTES = [
  ['量子计算 (Computing)', 'NISQ 时代算法、纠错编码与低温测控决定有效算力；与经典超算混合编排是近期产业接口。', '瓶颈纠错与相干 · 场景材料/优化'],
  ['量子通信 (QKD)', '城域与城际 QKD 网络、量子卫星与地面站协同；与后量子密码 PQC 形成互补与替代之争。', '标准 ITU/国标 · 成本光纤/卫星'],
  ['量子精密测量', '原子钟、重力仪、磁力计服务导航、资源勘探与基础物理；供应链要求低于通用量子计算。', '落地导航/勘探 · 出口军民两用审查'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Quantum · 国家专项" title="量子计算 · 通信 · 精密测量" subtitle="量子优越性 · 保密通信干线 · 新质生产力前沿 —— 从实验室优越性到产业接口" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>光量子与超导路线并进，「九章」「祖冲之」体现采样优越性；量子保密通信「京沪干线」及城际网络拓展。纠错、相干时间与专用软件栈仍是全球共性瓶颈，工程化远未到替代经典超算的拐点。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="255+" label="可编程量子比特(报道峰值)" accent="#22d3ee" />
        <Stat value="100+ 比特" label="超导量子比特(公开级)" />
        <Stat value="4,600 km+" label="量子保密干线(量级)" accent="#10b981" />
        <Stat value="第一梯队" label="论文与专利(示意)" accent="#c41e3a" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="量子比特规模趋势（示意）"><EChart option={qubitTrend} style={{ height: 240 }} /><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>不同技术路线不可直接横向比较物理比特与逻辑比特。</p></Card>
        <Card title="技术成熟度 vs 政策期望（示意）"><EChart option={maturityBar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="计算、通信、测量 · 三条路线" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>三条路线成熟度差异极大：通信与部分传感更接近落地，通用量子计算仍以科研与专用模拟为主。</p>
        <Grid cols={3}>
          {ROUTES.map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="中美综合竞争力（2024 · 示意）"><EChart option={cnUsRadar} style={{ height: 280 }} /></Card>
        <div className="space-y-4">
          <Card title="科研强度与生态差异">
            <div className="space-y-2">
              <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>CN 路径</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>大科学装置 + 专项工程 + 地方产业园；强调保密通信与可演示算力里程碑。</p></div>
              <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>US 路径</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>IBM/Google 等云原生量子服务 + 风险资本；与 PQC 标准化、出口清单联动。</p></div>
            </div>
          </Card>
          <Card title="人才与仪器依赖">
            <div className="space-y-2">
              <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>极低温工程</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>稀释制冷机、mK 级制冷与热负载管理决定比特规模上限，长期依赖进口。</p></div>
              <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>量子软件栈</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>编译、纠错、误差缓解与云调度 API 是商业化接口。</p></div>
            </div>
          </Card>
        </div>
      </Grid>

      <Card title="战略结论" className="mb-6">
        <Grid cols={3}>
          {[['1 · 通信与测量先行变现', 'QKD 与量子传感更易嵌入现有基础设施，计算仍处高投入演示阶段。'],
            ['2 · 标准与密码迁移', 'NIST PQC 与 QKD 路线博弈影响政府采购与金融专网架构。'],
            ['3 · 仪器制裁外溢', '低温与测控设备纳入出口管制后，全栈自主成为国家安全叙事的一部分。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="制度锚点"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>量子属于「高投入、长周期、强保密」赛道，适宜国家实验室领衔；若过度产业园化而缺乏仪器与人才底层，易形成叙事泡沫。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>比特数与干线长度为公开报道量级与模型示意；请以科技部专项、WIPO 及权威论文为准 · 由 china.html「量子」专题迁移</p>
    </div>
  );
}
