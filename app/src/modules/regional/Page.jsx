import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const gdpStack = {
  grid: { left: 40, right: 16, top: 32, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
  xAxis: { type: 'category', data: ['2010', '2015', '2020', '2022', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '东部', type: 'line', stack: 'gdp', smooth: true, symbol: 'none', data: [55, 53, 51, 51, 50], lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.25)' } },
    { name: '中部', type: 'line', stack: 'gdp', smooth: true, symbol: 'none', data: [19, 21, 22, 22, 23], lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.2)' } },
    { name: '西部', type: 'line', stack: 'gdp', smooth: true, symbol: 'none', data: [18, 19, 21, 21, 22], lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.2)' } },
    { name: '东北', type: 'line', stack: 'gdp', smooth: true, symbol: 'none', data: [8, 7, 6, 6, 5], lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.2)' } },
  ],
};
const plateRadar = {
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
  radar: { indicator: [{ name: '创新', max: 100 }, { name: '开放', max: 100 }, { name: '财政', max: 100 }, { name: '协同', max: 100 }, { name: '生态', max: 100 }], radius: '62%', center: ['50%', '56%'], axisName: { color: '#93a1b5' }, axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [98, 95, 88, 92, 95], name: '东部', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
    { value: [85, 78, 92, 90, 85], name: '中部', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' } },
    { value: [75, 82, 85, 75, 80], name: '西部', lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' } },
    { value: [70, 75, 88, 70, 65], name: '东北', lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' } },
  ] }],
};
const urbanBar = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['户籍城镇化', '城区人口', '都市圈', '县域载体'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', min: 55, max: 70, axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [60.2, 63.9, 65.2, 66.2], barWidth: 28, itemStyle: { color: '#22d3ee', borderRadius: 4 }, label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10, formatter: '{c}%' } }],
};

const plates = [
  ['东部沿海发展带', '龙头牵引 · 新质生产力集群', '外向型经济、数字与新质产业集群密集，承担全要素生产率与全球价值链攀升主阵地；财政与金融资源集聚度高，外溢效应显著。研发强度 3.5%+（示意）。', '#c41e3a'],
  ['中部崛起板块', '承东启西 · 先进制造与物流', '制造业梯度转移与综合交通枢纽叠加，内需市场纵深大；在统一大市场下承担产业链备份与区域均衡器角色。研发强度 2.8%+（示意）。', '#22d3ee'],
  ['西部大开发', '战略纵深 · 能源与陆路开放', '能源、矿产与生态屏障功能突出，清洁能源基地与陆海新通道重塑内陆开放几何；约束在生态红线与投融资效率。研发强度 2.1%+（示意）。', '#e8a317'],
  ['东北全面振兴', '老工业基地 · 产业与粮食双安全', '装备制造与粮食安全双底牌，人口流出与债务历史包袱并存；产业升级与东北亚合作窗口构成长期变量。研发强度 2.4%+（示意）。', '#10b981'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Regional · 区域协调" title="四大板块 · 转移支付与省际协作" subtitle="东中西东北 · 对口支援 · 飞地经济 —— 从行政分割到规则与要素的一体化" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>建设全国统一大市场的要义，在于降低制度性交易成本、打通劳动力与资本跨区域配置堵点，并在财税与考核机制上抑制地方保护。区域政策的演进方向，是在统一规则下让四大板块形成清晰分工，而非行政指令式的「齐步走」。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~25%" label="东部地区 GDP 占比（约 · 示意）" accent="#c41e3a" />
        <Stat value="10%" label="跨省迁移人口占比（示意）" accent="#22d3ee" />
        <Stat value="~14%" label="中西部 GDP 增量贡献" accent="#e8a317" />
        <Stat value="6 群+" label="国家级城市群布局" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="四大板块 GDP 占比堆叠（2010–2024 · 示意）"><EChart option={gdpStack} style={{ height: 260 }} /></Card>
        <Card title="四大板块五维得分雷达（创新/开放/财政/协同/生态 · 示意）"><EChart option={plateRadar} style={{ height: 260 }} /></Card>
      </Grid>

      <Card title="四大板块对比 · 定位与约束" className="mb-6">
        <Grid cols={4}>
          {plates.map(([t, tag, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <div className="text-[10px] mt-0.5 mono" style={{ color: c }}>{tag}</div>
              <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="统一大市场的三条政策杠杆">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>反垄断与公平竞争审查、政府采购与招投标统一、要素市场化配置改革共同压缩「本地偏好」空间。</p>
          <div className="space-y-2">
            {[['公平竞争', '破除显性与隐性壁垒，降低跨区域投资的制度不确定性。', '#10b981'],
              ['要素流动', '户籍、土地、数据与资本定价机制联动，提高配置效率。', '#22d3ee'],
              ['财税激励校正', '弱化单纯以 GDP 论英雄的扩张冲动，向质量与协同倾斜。', '#e8a317']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
        <Card title="常住人口城镇化分层指标（2018–2024 · 示意）"><EChart option={urbanBar} style={{ height: 230 }} /></Card>
      </Grid>

      <Card title="人口与产业的再布局" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>城市群与都市圈承载主要增量；县域与乡村振兴承接返乡与县域消费，形成多层级空间结构。</p>
        <Grid cols={2}>
          {[['集聚 · 城市群', '核心城市研发与高端服务密度继续上升，全国一体化进程在规则统一、数据互通、劳动力流动维度推进最快（示意得分 88–95）。', '#c41e3a'],
            ['下沉 · 县域', '县域基础设施与公共服务补短板释放内需，承接产业梯度转移与返乡人口，是统一大市场的「毛细血管」。', '#22d3ee']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研要点 · 三个结构性张力" className="mb-6">
        <Grid cols={3}>
          {[['1 · 省际差距', '人均 GDP 与财政收入仍呈梯度，转移支付与生态补偿需精准挂钩，对口支援与飞地经济是省际协作的两类工具。'],
            ['2 · 产业同构', '部分省份在新能源、半导体等领域存在低水平重复招商风险，统一大市场的公平竞争审查正是对冲机制。'],
            ['3 · 开放节点', '自贸港、自贸试验区与边境口岸构成「受控开放」的多层接口，区域韧性依赖财政缓冲与产业多元（示意得分 85–95）。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>区域政策的终局不是齐步走，而是在全国统一规则下形成清晰分工与可预期的要素价格，以对冲外部冲击与内部债务压力。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本页图表与段落为逻辑推演与示意数据，引用请以统计公报与部委发布为准 · 由 china.html「区域协调」专题迁移</p>
    </div>
  );
}
