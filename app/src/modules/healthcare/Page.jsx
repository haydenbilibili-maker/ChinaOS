import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// 三医联动拓扑：医疗服务 / 医保基金 / 医药流通 的闭环关系图
const triadGraph = {
  series: [{
    type: 'graph', layout: 'circular', symbolSize: 58, roam: false,
    label: { show: true, fontSize: 10, color: '#93a1b5' },
    data: [
      { name: '医疗服务', itemStyle: { color: '#c41e3a' } },
      { name: '医保基金', itemStyle: { color: '#10b981' } },
      { name: '医药流通', itemStyle: { color: '#e8a317' } },
    ],
    links: [
      { source: '医药流通', target: '医保基金', label: { show: true, formatter: '挤水分', color: '#93a1b5' }, lineStyle: { curveness: 0.2, color: '#e8a317' } },
      { source: '医保基金', target: '医疗服务', label: { show: true, formatter: '调价/支付', color: '#93a1b5' }, lineStyle: { curveness: 0.2, color: '#10b981' } },
      { source: '医疗服务', target: '医药流通', label: { show: true, formatter: '处方外流', color: '#93a1b5' }, lineStyle: { curveness: 0.2, color: '#c41e3a' } },
    ],
    lineStyle: { opacity: 0.9, width: 2 },
  }],
};
// 价值采购（VBP）：历批集采品种平均降幅
const vbpBar = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2021', '2023', '2024E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [52, 56, 48, 55], barWidth: 22, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'top', formatter: '-{c}%', color: '#93a1b5' } }],
};
// DRG/DIP 执行后的基金支出效率画像
const drgRadar = {
  radar: {
    indicator: [{ name: '基金结余率', max: 100 }, { name: '次均住院费降幅', max: 100 }, { name: '临床路径规范度', max: 100 }, { name: '患者满意度', max: 100 }, { name: '管理响应速度', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLine: { lineStyle: { color: '#27324a' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [92, 85, 95, 78, 90], name: 'DRG/DIP 执行后', lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.15)' } }] }],
};

const reformStages = [
  ['1978-1992 · 改革探索起步期', '公费医疗与劳保医疗沿袭计划经济模式，财政负担沉重、效率低下；开始尝试「放权让利、扩大医院自主权」的初步改革。', '#c41e3a'],
  ['1992-2001 · 市场化改革探索期', '医疗领域引入市场机制，医院走向自负盈亏，「看病难、看病贵」问题逐步显现。', '#e8a317'],
  ['2001-2012 · 全民医保体系建设期', '启动「新医改」，建立城镇职工、城镇居民与新型农村合作医疗三大体系，到 2010 年基本实现全民医保广覆盖。', '#22d3ee'],
  ['2012至今 · 医改深化攻坚期', '围绕「强基层」「保基本」深化综合改革：分级诊疗、公立医院三医联动、基本药物制度与医保支付方式改革。', '#10b981'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Healthcare · 三医联动" title="基本医保 · DRG 与集采" subtitle="全民医保 · 集采降价 · 公立医院改革 · 分级诊疗" />
      <Card className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          中国医改并非单纯的财政投入，而是一场精密的<strong style={{ color: 'var(--text-primary)' }}>「结构性大迁徙」</strong>：通过「医药」环节挤出虚高价格水分，腾出的空间用于调增「医疗」服务价值（体现医生劳务价值），并纳入「医保」支付闭环。这种不增加财政总负担的平衡术，是在 13.6 亿人参保、人均资源有限的背景下实现全民覆盖的关键。
        </p>
      </Card>
      <Grid cols={4} className="mb-6">
        <Stat value="13.6亿" label="基本医保参保人数" accent="#c41e3a" />
        <Stat value="95%+" label="基本医保覆盖率" accent="#e8a317" />
        <Stat value="6,000亿" label="集采累计节约资金" accent="#22d3ee" />
        <Stat value="78.6岁" label="人均预期寿命 · 超越部分中高收入国家" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="核心逻辑 · 三医联动的效率模型">
          <EChart option={triadGraph} style={{ height: 250 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>"Squeezing out procurement fat to nourish clinical service muscle." —— 挤出采购的水分，滋养临床服务的肌肉。</p>
        </Card>
        <Card title="价值采购（VBP）· 集采品种降价均幅">
          <EChart option={vbpBar} style={{ height: 200 }} />
          <div className="flex justify-between text-[11px] mt-3"><span style={{ color: 'var(--text-tertiary)' }}>心脏支架降幅</span><span className="font-bold" style={{ color: '#c41e3a' }}>-90%</span></div>
          <div className="flex justify-between text-[11px] mt-1"><span style={{ color: 'var(--text-tertiary)' }}>人工关节降幅</span><span className="font-bold" style={{ color: '#c41e3a' }}>-82%</span></div>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="DRG/DIP · 医院行为的算法重塑">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            支付方式改革是医保控费的「撒手锏」。按病种付费（DRG/DIP）将医院从「利润中心」强制转化为「成本中心」：超支由医院自担，医生不再倾向过度检查与长期住院。这套精算博弈模型正在根本上改写公立医院的运行代码，实现从「规模扩张」向「效率运营」的被迫转轨。
          </p>
          <div className="flex gap-2 flex-wrap mt-4">
            {['Clinical Protocol Alignment', 'Cost Control Engine'].map((t) => (
              <span key={t} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ border: '1px solid #27324a', color: '#22d3ee' }}>{t}</span>
            ))}
          </div>
        </Card>
        <Card title="医保基金支出构成与效率预测（DRG/DIP 执行后）"><EChart option={drgRadar} style={{ height: 260 }} /></Card>
      </Grid>

      <Card title="医改四十年 · 阶段时间轴" className="mb-6">
        <Grid cols={4}>
          {reformStages.map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={3} className="mb-6">
        <Card title="集采 · 不只是压价">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>国家组织药品与高值耗材带量采购以「量价挂钩」重构定价权：心脏支架从万元级降至千元级（-90%）。集采更深层的作用，是倒逼药企从「销售驱动」转向「研发驱动」。</p>
        </Card>
        <Card title="公立医院改革 · 三明医改样本">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>福建三明以「腾笼换鸟」打通三医联动：挤压药品耗材水分、上调诊疗服务价格、推行院长与医生年薪制，成为全国推广的公立医院综合改革范本。</p>
        </Card>
        <Card title="分级诊疗网格 · 数字化渗透">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>5G 远程手术与县域医共体逐步普及，异地就医结算走向「无感化」，以数字化手段消解地理上的医疗资源不均，筑牢基层首诊与双向转诊网格。</p>
        </Card>
      </Grid>

      <Card title="调研结论 · 构建普惠韧性">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          中国医疗体系的未来不在于单纯的私有化或绝对的政府包办，而在于<strong style={{ color: 'var(--text-primary)' }}>「数字治理下的动态平衡」</strong>：以集采与 DRG 守住基金安全，以三医联动重排利益结构，以分级诊疗与数字化构建一个具备「极致成本效率」的现代化健康保障网络。「效率是医改的第一性原理」。
        </p>
        <div className="flex gap-6 flex-wrap text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <span>// FUND_SECURITY: GUARANTEED</span><span>// REFORM_LINKAGE: SYNCED</span><span>// PUBLIC_HEALTH: RESILIENT</span>
        </div>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供结构性参考 · 由 china.html「医保」专题迁移</p>
    </div>
  );
}
