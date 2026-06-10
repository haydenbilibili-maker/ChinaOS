import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const RISKS = [
  { key: 'shadow', label: '影子银行', accent: '#64748b', score: 72, desc: '资管新规以来通道业务、刚性兑付被系统性拆解；理财净值化重塑表外融资生态，传染链条被切断。' },
  { key: 'property', label: '房地产关联', accent: '#c41e3a', score: 85, desc: '三道红线与因城施策降低地产与金融体系的系统性关联；但地方平台与房企交叉担保仍是隐性风险池。' },
  { key: 'cross', label: '跨境资本', accent: '#22d3ee', score: 68, desc: '宏观审慎工具箱应对顺周期波动与预期冲击，平滑汇率与资本流；管道式开放节奏不变。' },
  { key: 'small', label: '中小机构', accent: '#e8a317', score: 78, desc: '高风险中小银行兼并重组与注资化险并行，防止局部风险演变为区域性危机。' },
];

const tsfLine = {
  grid: GRID,
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [{ name: '社融增速', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
    data: [1.9, 2.0, 2.7, 2.3, 4.7, 4.5], lineStyle: { color: '#e8a317', width: 2 },
    itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } }],
};

export default function Page() {
  const [riskKey, setRiskKey] = useState('property');
  const r = RISKS.find((x) => x.key === riskKey) || RISKS[1];

  const stabilityRadar = useMemo(() => radarOpt(
    ['资本充足', '流动性覆盖', '资产质量', '外债风险', '市场深度', '政策响应'],
    [92, 88, r.key === 'property' ? 75 : 85, 75, 80, 95],
    { name: '金融稳定得分', color: r.accent },
  ), [r]);

  const riskBar = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(RISKS.map((x) => x.label)),
    yAxis: valueY({ max: 100, name: '风险指数' }),
    series: [{ type: 'bar', barWidth: 22, data: RISKS.map((x) => ({
      value: x.score, itemStyle: { color: x.key === riskKey ? x.accent : 'rgba(100,116,139,0.4)', borderRadius: 3 },
    })) }],
  }), [riskKey]);

  return (
    <div>
      <PageHeader badge="Finance System · 金融安全与效率" title="系统性风险 · 宏观审慎" subtitle="金融稳定 · 影子银行 · 开放节奏 · 中央金融工委" />
      <IntroCard>金融体制在<strong style={{ color: '#e8a317' }}>开放</strong>与防风险之间再平衡：资本账户可兑换仍渐进推进，人民币跨境使用与 CIPS 扩容降低对单一清算通道依赖。中央金融工委统筹下，宏观审慎框架是守住不发生系统性风险底线的核心制度安排。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="450 家+" label="A 股科创企业（量级示意）" accent="#c41e3a" />
        <Stat value="~4.5%" label="人民币全球支付份额（示意）" accent="#e8a317" />
        <Stat value={r.score} label={`${r.label}风险指数 · 切换`} accent={r.accent} />
        <Stat value="140 国" label="CIPS 参与者覆盖（示意）" accent="#10b981" />
      </Grid>

      <Card title="交互 · 系统性风险维度选择器" className="mb-6">
        <SelectorBar items={RISKS} activeKey={riskKey} onSelect={setRiskKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${r.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="风险维度对比（示意）"><EChart option={riskBar} style={{ height: 220 }} /></Card>
          <Card title="金融稳定雷达（随维度切换）"><EChart option={stabilityRadar} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="社会融资规模增速（% · 示意）"><EChart option={tsfLine} style={{ height: 240 }} /></Card>
        <Card title="宏观审慎与监管协同">
          <div className="space-y-3">
            {[['MPA 与广义信贷', '宏观审慎评估引导银行体系稳健扩张，抑制影子银行回潮。'],
              ['房地产金融审慎', '三道红线与因城施策降低地产与金融体系的系统性关联。'],
              ['跨境资本流动管理', '宏观审慎工具箱应对顺周期波动与预期冲击。']].map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '影子银行治理', subtitle: '资管新规 · 净值化', body: '通道业务、刚性兑付与期限错配被系统性拆解；影子银行规模较峰值显著压降。', pillars: [['打破刚兑', '理财产品全面净值化。'], ['通道压降', '多层嵌套被穿透监管。'], ['中小机构化险', '兼并重组与注资并行。']] },
        { title: '人民币国际化', subtitle: 'CIPS · e-CNY', body: 'CIPS 与 SWIFT 并行，提升极端情景下的清算韧性；e-CNY 零售与跨境双线推进。', pillars: [['本币结算', '货币互换网络扩展。'], ['离岸市场', 'CNH 定价功能。'], ['管道式开放', '资本项目渐进可兑换。']] },
        { title: '资本市场改革', subtitle: '注册制 · 硬科技', body: '科创板、创业板与北交所形成差异化定位；引导长期资金配置新质生产力赛道。', pillars: [['直接融资', '股权融资占比提升。'], ['常态化退市', '压缩壳资源空间。'], ['信息披露', '执法力度强化。']] },
      ]} />

      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>金融系统的真实约束是「开放节奏」与「风险底线」的动态权衡：宏观审慎框架与中央金融工委的统筹，决定了人民币国际化与资本市场开放只能走渐进、管道式的路径——稳定优先于速度。</p>
      </Card>

      <ModuleFooter moduleId="finance" sourceNote="由 china.html「金融系统」专题迁移升级" />
    </div>
  );
}
