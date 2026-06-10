import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const axisLine = { lineStyle: { color: '#27324a' } };
const splitLine = { lineStyle: { color: 'rgba(148,163,184,0.1)' } };

const intelligenceLine = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024E'], axisLine, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', splitLine, axisLabel: { color: '#93a1b5' } },
  series: [{ name: '智能泛化能力指数', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [15, 30, 65, 95], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.15)' } }],
};
const sectorPie = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  series: [{ type: 'pie', radius: ['45%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5', fontSize: 10, formatter: '{b} {c}%' }, data: [
    { value: 35, name: '汽车制造', itemStyle: { color: '#c41e3a' } },
    { value: 25, name: '电子集成', itemStyle: { color: '#22d3ee' } },
    { value: 15, name: '物流仓储', itemStyle: { color: '#e8a317' } },
    { value: 12, name: '新能源/电力', itemStyle: { color: '#10b981' } },
    { value: 13, name: '服务/医疗', itemStyle: { color: '#93a1b5' } },
  ] }],
};
const humanoidPatentRadar = {
  tooltip: {},
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  radar: { indicator: [{ name: '本体结构', max: 100 }, { name: '灵巧手', max: 100 }, { name: '平衡控制', max: 100 }, { name: '感知交互', max: 100 }, { name: '核心部件', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [95, 88, 82, 90, 85], name: '中国', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [90, 95, 98, 92, 90], name: '美国', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
  ] }],
};

const componentRows = [
  ['精密减速器', 85, '谐波减速器已具备全球竞争力，国产化约 60%，正冲击行星滚柱丝杠等高端环节。'],
  ['伺服驱动', 75, '高性能伺服电机国产化约 45%，编码器精度与动态响应仍在攻坚。'],
  ['控制器', 60, '运动控制算法与实时总线生态追赶外资四大家族。'],
  ['传感器', 55, '六维力矩、触觉与视觉传感是具身智能落地的短板环节。'],
  ['结构材料', 95, '轻量化结构件与铸件供应链最为完备，成本优势显著。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Robotics · 具身智能" title="工业机器人 · 人形产业化" subtitle="机器人密度 · 具身智能 · 核心零部件" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>中国机器人产业的崛起是一场「以资本替代劳动」的长期博弈：全球过半工业机器人装机于中国，机器人密度达每万名工人 392 台；下一阶段的胜负手在核心零部件自给率与人形机器人的量产能力。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="52%" label="工业机器人装机量全球份额 · 连续十年第一" accent="#e8a317" />
        <Stat value="45%" label="核心零部件国产化率 · 减速器/伺服攻坚中" accent="#c41e3a" />
        <Stat value="392 台" label="机器人密度（每万名工人）· 制造强国核心指标" accent="#22d3ee" />
        <Stat value="2025" label="人形机器人量产预期 · Scale-up Phase" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="01 具身智能 · 智能泛化能力指数（示意）">
          <EChart option={intelligenceLine} style={{ height: 230 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>具身智能（Embodied AI）是人工智能进入物理世界的最后一块拼图。中国正通过「大模型 + 机器身体」的结合，利用庞大的工厂实景数据进行强化学习，让机器人从执行固定程序的「机器」进化为自主应对复杂环境的「数字劳动力」。</p>
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)', borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}>"Giving AI a physical presence to solve the labor bottleneck."</p>
        </Card>
        <Card title="03 工业机器人应用需求分布（估算 · %）">
          <EChart option={sectorPie} style={{ height: 260 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>汽车制造、电子集成、物流仓储等场景构成主要装机需求。</p>
        </Card>
      </Grid>

      <Card title="02 核心零部件突围 · 国产化成熟度" className="mb-6">
        <Grid cols={5}>
          {componentRows.map(([name, score, desc]) => (
            <div key={name} style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</div>
              <div className="text-lg font-bold" style={{ color: '#e8a317' }}>{score}</div>
              <div style={{ height: 4, background: 'rgba(148,163,184,0.15)', borderRadius: 2, margin: '4px 0' }}>
                <div style={{ width: `${score}%`, height: '100%', background: '#c41e3a', borderRadius: 2 }} />
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>精密减速器国产化约 60%、高性能伺服电机约 45%；谐波减速器领域已具备全球竞争力，正冲击行星滚柱丝杠等高端环节。</p>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="04 人形机器人全球专利布局对比（中 vs 美 · 示意）">
          <EChart option={humanoidPatentRadar} style={{ height: 280 }} />
        </Card>
        <Card title="人形机器人 · 终极工业母机">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中国正举全国之力打造人形机器人产业集群：在北京、上海、深圳建立国家级机器人创新中心，将人形机器人打造成继智能手机、新能源汽车之后的「第三个超级终端」。谁掌握了通用机器人的量产能力，谁就掌握了未来 50 年的生产力主权。</p>
          <Grid cols={2}>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-lg font-bold" style={{ color: '#e8a317' }}>20%</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>预计 2030 年人形机器人降本空间</p></div>
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-lg font-bold" style={{ color: '#c41e3a' }}>Top 1</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>中国人形机器人相关专利公开量</p></div>
          </Grid>
        </Card>
      </Grid>

      <Card title="产业逻辑与关键变量" className="mb-6">
        <Grid cols={3}>
          {[['1 · 密度即竞争力', '机器人密度（每万名工人 392 台）是制造强国的核心指标，决定单位劳动成本曲线与产业链留存能力。'],
            ['2 · 零部件决定利润', '减速器、伺服、控制器占整机成本约七成；国产化率从 45% 向上突破，决定本土厂商的定价权。'],
            ['3 · 数据闭环定终局', '未来的竞争不仅是硬件堆叠，更是对「物理世界大数据」的采集与算法模型的闭环能力。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研结论 · 构建自动化生产红利">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>中国机器人产业的崛起是一场「以资本替代劳动」的长期博弈。通过建立全球最完备的机器人供应链，中国正在将人口老龄化的挑战转化为「自动化溢价」。</p>
        <div className="flex flex-wrap gap-4 text-[10px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'monospace', textTransform: 'uppercase' }}>
          <span>// AUTONOMY: SCALING</span><span>// PRECISION: CALIBRATING</span><span>// DOMINANCE: INCREASING</span>
        </div>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：IFR、行业白皮书及公开研报，部分为估算/示意值，仅供研究参考 · 由 china.html「机器人」专题迁移</p>
    </div>
  );
}
