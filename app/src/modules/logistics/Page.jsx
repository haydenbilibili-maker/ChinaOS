import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const expressTrend = {
  grid: { left: 48, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2016', '2018', '2020', '2022', '2023', '2024E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '亿件', nameTextStyle: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [312, 507, 833, 1106, 1320, 1500], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }],
};
const techAutomation = {
  grid: { left: 44, right: 44, top: 30, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: [
    { type: 'value', name: '%', nameTextStyle: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    { type: 'value', name: '指数', nameTextStyle: { color: '#93a1b5' }, splitLine: { show: false } },
  ],
  series: [
    { name: '科技投入占比', type: 'bar', data: [15, 22, 18, 25, 30], barWidth: 18, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    { name: '自动化指数', type: 'line', yAxisIndex: 1, smooth: true, data: [100, 145, 182, 230, 285], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};
const globalSpeed = {
  grid: { left: 70, right: 36, top: 16, bottom: 24 },
  xAxis: { type: 'value', name: '日', nameTextStyle: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['跨境均值', '日本', '美国', '欧盟', '中国'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [7.5, 5.2, 4.8, 4.5, { value: 3.5, itemStyle: { color: '#10b981' } }], barWidth: 16, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c} 日', color: '#93a1b5', fontSize: 10 } }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Logistics · 多式联运" title="社会物流 · 多式联运" subtitle="物流总费用占比 · 枢纽网络 · 降本增效" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>社会物流总额 2023 年约 352 万亿元、2024 年预计超 380 万亿元；物流总费用占 GDP 约 14.4%，仍高于美日欧，快递业务量超 1,320 亿件居全球第一。规模红利见顶之后，竞争转向效率与韧性 —— 降本空间来自多式联运、库存周转等结构优化与数字化。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="352 万亿" label="社会物流总额 (2023)" accent="#c41e3a" />
        <Stat value="14.4%" label="物流费用占 GDP 比" accent="#e8a317" />
        <Stat value="1,320 亿+" label="快递业务量 (件)" accent="#22d3ee" />
        <Stat value="#1" label="全球快递规模" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="快递业务量走势（亿件 · 2016–2024E）"><EChart option={expressTrend} style={{ height: 240 }} /></Card>
        <Card title="科技投入占比与自动化指数（示意 · 2020–2024）"><EChart option={techAutomation} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="仓配自动化与智能调度" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>头部电商与三方物流加大 AGV/AMR、立体仓与算法排程投入；自动化渗透率与单均履约成本呈反向相关，示意区间约 25%→35%。</p>
        <Grid cols={3}>
          {[['立体仓与机器人', '高密度存储 + AGV 接驳，缩短拣选路径；与 WMS/TMS 联动形成可审计的履约闭环。场景：3C / 冷链。', '#22d3ee'],
            ['预测补货与库存 AI', '以销量、天气与促销因子做多步预测，降低安全库存水位；预测命中率示意约 98%（区域仓）。', '#e8a317'],
            ['多式联运与关务', '铁海公空组合压缩干线时效；口岸数字化缩短在途不确定性，跨境「一单制」试点服务全国统一大市场要素对流。', '#10b981']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="主要经济体快递时效对比（示意 · 日）">
          <EChart option={globalSpeed} style={{ height: 230 }} />
          <p className="text-[10px] mt-2" style={{ color: 'var(--text-tertiary)' }}>同城/同省/跨境标准件综合示意，非企业官方口径。</p>
        </Card>
        <Card title="跨境与快递：时效即护城河">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>国内电商快递已形成规模化单均成本优势；跨境段仍受航线、清关与末端合作制约，国际三大快递（DHL/FedEx/UPS）在高端时效市场仍占品牌溢价。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>国家物流枢纽</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>约 120+ 个国家物流枢纽与示范园区带动干支衔接与产业集聚（量级示意）。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>末端共配与进村</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>快递进村覆盖率与驿站共配降低单票成本，头部企业 CR8 长期维持高位。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="物流总费用与 GDP 之比 · 降本路径" className="mb-6">
        <Grid cols={3}>
          <div><div className="text-sm font-semibold" style={{ color: '#e8a317' }}>当前区间 ~14.4%</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>近年公布区间；仍显著高于美日欧成熟经济体，差距主要在结构而非单环节效率。</p></div>
          <div><div className="text-sm font-semibold" style={{ color: '#10b981' }}>目标 8%–10%（中长期示意）</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>政策目标导向由约 14% 向 8%–10% 区间收敛，降本潜力示意 20%+。</p></div>
          <div><div className="text-sm font-semibold" style={{ color: '#22d3ee' }}>路径：结构 + 数字化</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>多式联运提升铁水分担率、库存周转加快与全链路数字化，是占比收敛的三个主杠杆。</p></div>
        </Grid>
      </Card>

      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 规模红利见顶', '竞争转向「效率与韧性」：库存周转、准时率与绿色指标进入 KPI 核心。'],
            ['2 · 产业链人质效应', '关键设备与软件仍存对外依存，极端情景下的替代预案构成隐性成本。'],
            ['3 · 政策与基建耦合', '国家物流枢纽、冷链与「一带一路」陆海通道共同重塑干线—末端成本曲线。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>物流是统一大市场的「血管系统」：枢纽网络决定要素能否低摩擦对流，费用率每收敛一个百分点，相当于释放万亿级实体利润。网络韧性（覆盖/时效/成本/绿色/数字化/应急）的短板在数字化与应急两维，正是政策与资本下一阶段的着力点。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>口径参考：中物联、交通运输部及公开行业报告；图表为行业区间与模型推演示意，与正式发布值可能不一致 · 由 china.html「物流」专题迁移</p>
    </div>
  );
}
