import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const scaleLine = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [90, 135, 150, 180, 230, 300], lineStyle: { color: '#22d3ee', width: 3 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};
const hubBar = {
  grid: { left: 56, right: 36, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'category', data: ['京津冀', '长三角', '粤港澳', '成渝', '甘肃', '贵州', '宁夏', '内蒙'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  series: [{ type: 'bar', data: [58, 65, 70, 75, { value: 88, itemStyle: { color: '#c41e3a' } }, { value: 92, itemStyle: { color: '#c41e3a' } }, { value: 95, itemStyle: { color: '#c41e3a' } }, { value: 98, itemStyle: { color: '#c41e3a' } }], barWidth: 14, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }],
};
const competenceRadar = {
  radar: { indicator: [{ name: '芯片', max: 100 }, { name: '框架', max: 100 }, { name: 'IDC', max: 100 }, { name: '网络', max: 100 }, { name: '人才', max: 100 }, { name: '绿电', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [72, 95, 88, 92, 85, 98], name: '2024 评估', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } }] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Computing · 算力主权" title="算力基础设施 · 东数西算" subtitle="枢纽节点 · 智算中心 · 能效约束" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>智算中心与绿色电力绑定：大模型训练与推理推高 GPU/加速卡需求，「东数西算」把算力布局与西部风光、水电耦合。PUE、水耗与芯片对外依存构成长期约束。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="230+ EF" label="智能算力（EFLOPS · 区间）" accent="#22d3ee" />
        <Stat value="~30%" label="全球智算份额（示意）" accent="#c41e3a" />
        <Stat value="#2" label="算力规模排名" accent="#e8a317" />
        <Stat value="< 1.25" label="新建 IDC PUE 上限（政策）" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="智能算力规模（EFLOPS · 示意）"><EChart option={scaleLine} style={{ height: 240 }} /><p className="text-[11px] mt-2 text-center" style={{ color: 'var(--text-tertiary)' }}>年增速显著高于通用算力。</p></Card>
        <Card title="枢纽投资热度指数（2024 · 示意）"><EChart option={hubBar} style={{ height: 240 }} /><p className="text-[11px] mt-2 text-center" style={{ color: 'var(--text-tertiary)' }}>红色为西部枢纽：算力西移与电价差套利。</p></Card>
      </Grid>

      <Card title="国家枢纽与集群 · 八大枢纽、十集群" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>八大枢纽、十集群引导算力西移与电价差套利；网络时延决定实时业务布局。</p>
        <Grid cols={4}>
          {[['内蒙古 / 贵州', '风光与水电优势；冷源与土地成本较低。', '#c41e3a'],
            ['长三角 / 粤港澳', '贴近用户与出海光缆；电价与土地约束更紧。', '#22d3ee'],
            ['成渝', '承接东部备份与西南数字产业。', '#10b981'],
            ['网络时延', '骨干网优化目标：枢纽间毫秒级（示意）。', '#e8a317']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="算电协同 · 绿电占比与碳足迹">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>数据中心年耗电占全社会用电比重持续上升；绿证、绿电交易与自备新能源成为降碳路径。绿电占比由 2020 年约 15% 升至 2024 年约 45%，电网排放因子同期由 100 降至 80（指数 · 示意）。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>绿电直供</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>园区级源网荷储一体化降低外购火电比例。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>液冷与余热</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>高功率 GPU 推动液冷渗透；余热可利用于市政供暖（北方）。</p></div>
          </div>
        </Card>
        <Card title="算力产业链能力（2024 · 示意）"><EChart option={competenceRadar} style={{ height: 260 }} /></Card>
      </Grid>

      <Card title="芯片与框架 · 供应链安全" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>高端 GPU 仍受出口管制；国产加速卡与开源框架生态决定替代节奏。算力券与政府采购可阶段性托底需求。</p>
        <Grid cols={2}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>框架 · PyTorch 等</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>社区与合规：开源框架生态决定模型迁移与适配成本。</p></div>
          <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>国产卡渗透 ~40%+</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>推理场景先行，训练侧仍依赖高端进口加速卡。</p></div>
        </Grid>
      </Card>

      <Card title="算力需求结构（示意）" className="mb-6">
        <Grid cols={6}>
          {[['大模型训练', '35%', '#c41e3a'], ['推理', '20%', '#22d3ee'], ['政企云', '15%', '#e8a317'], ['渲染', '12%', '#10b981'], ['科研', '10%', '#93a1b5'], ['其他', '8%', '#27324a']].map(([t, v, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{v}</div><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{t}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 算力即服务', '云厂商 Capex 周期与模型迭代强相关，存在产能过剩风险。'],
            ['2 · 电价与碳成本', '进入模型 TCO；出口算力服务面临碳边境规则压力。'],
            ['3 · 边缘与 6G', '低时延业务驱动 MEC；与卫星回传、车联网联动。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="数据说明"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>本页为信通院等行业材料与模型示意；与官方统计口径可能不一致。参考：中国信通院《中国算力发展指数白皮书》等公开资料。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供结构性参考 · 由 china.html「算力」专题迁移</p>
    </div>
  );
}
