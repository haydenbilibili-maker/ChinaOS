import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const axisLine = { lineStyle: { color: '#27324a' } };
const splitLine = { lineStyle: { color: 'rgba(148,163,184,0.1)' } };
const axisLabel = { color: '#93a1b5' };

const tsfLine = {
  grid: { left: 44, right: 16, top: 24, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLine, axisLabel },
  yAxis: { type: 'value', axisLabel: { ...axisLabel, formatter: '{value}%' }, splitLine },
  series: [{ name: '社融增速', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [1.9, 2.0, 2.7, 2.3, 4.7, 4.5], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } }],
};

const rmbCurves = {
  grid: { left: 40, right: 16, top: 32, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, itemWidth: 14 },
  xAxis: { type: 'category', data: ['2016', '2018', '2020', '2022', '2023', '2024E'], axisLine, axisLabel },
  yAxis: { type: 'value', axisLabel: { ...axisLabel, formatter: '{value}%' }, splitLine },
  series: [
    { name: '全球支付份额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [1.6, 1.8, 2.1, 2.7, 4.1, 4.6], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { name: '外汇储备占比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [1.1, 1.9, 2.3, 2.9, 2.7, 2.8], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
  ],
};

const stabilityRadar = {
  radar: { indicator: [{ name: '资本充足', max: 100 }, { name: '流动性覆盖', max: 100 }, { name: '资产质量', max: 100 }, { name: '外债风险', max: 100 }, { name: '市场深度', max: 100 }, { name: '政策响应', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [92, 88, 85, 75, 80, 95], name: '金融稳定得分', lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.12)' } }] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Finance System · 金融安全与效率" title="系统性风险 · 宏观审慎" subtitle="金融稳定 · 影子银行 · 开放节奏 · 中央金融工委" />

      <Card className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          金融体制在<strong style={{ color: '#e8a317' }}>开放</strong>与防风险之间再平衡：资本账户可兑换仍渐进推进，人民币跨境使用与 CIPS 扩容降低对单一清算通道依赖；资本市场改革聚焦注册制、退市与长期资金入市，以匹配产业升级融资需求。中央金融工委统筹下，宏观审慎框架成为守住不发生系统性风险底线的核心制度安排。
        </p>
      </Card>

      <Grid cols={4} className="mb-6">
        <Stat value="450 家+" label="A 股科创企业（量级示意）" accent="#c41e3a" />
        <Stat value="~4.5%" label="人民币全球支付份额（示意）" accent="#e8a317" />
        <Stat value="80 家+" label="A 股外资控股机构（示意）" accent="#22d3ee" />
        <Stat value="140 国" label="CIPS 参与者覆盖（示意）" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="社会融资规模增速（% · 示意）"><EChart option={tsfLine} style={{ height: 240 }} /></Card>
        <Card title="人民币国际使用两条曲线（% · 示意）"><EChart option={rmbCurves} style={{ height: 240 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="金融稳定雷达（示意）"><EChart option={stabilityRadar} style={{ height: 260 }} /></Card>
        <Card title="宏观审慎与监管协同">
          <div className="space-y-3">
            {[['1', 'MPA 与广义信贷', '宏观审慎评估引导银行体系稳健扩张，抑制影子银行回潮。'],
              ['2', '房地产金融审慎', '三道红线与因城施策降低地产与金融体系的系统性关联。'],
              ['3', '跨境资本流动管理', '宏观审慎工具箱应对顺周期波动与预期冲击，平滑汇率与资本流。']].map(([n, t, d]) => (
              <div key={n} className="flex items-start gap-3">
                <span className="mono text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.14)', color: '#c41e3a', flexShrink: 0 }}>{n}</span>
                <div><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="影子银行治理 · 从扩张到压降" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>资管新规以来，通道业务、刚性兑付与期限错配被系统性拆解；理财净值化转型重塑表外融资生态，影子银行规模较峰值显著压降，系统性传染链条被切断。</p>
        <Grid cols={3}>
          {[['资管新规与净值化', '打破刚兑、禁止资金池运作，理财产品全面净值化，风险定价回归市场。'],
            ['通道与嵌套压降', '信托通道、券商资管嵌套等多层链条被穿透监管压缩，降低杠杆与隐匿风险。'],
            ['中小金融机构风险处置', '高风险中小银行兼并重组与注资化险并行，防止局部风险演变为区域性危机。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="人民币国际化 · 基础设施先行">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>人民币跨境支付系统（CIPS）与 SWIFT 并行，提升极端情景下的清算韧性；与 mBridge 等多边安排互为表里，参与方与业务量持续扩容。</p>
          <ul className="text-xs space-y-2" style={{ color: 'var(--text-tertiary)' }}>
            {['本币结算与货币互换网络持续扩展', '离岸人民币市场与回流机制双向疏通', '资本项目可兑换走「管道式开放」路径'].map((t) => (
              <li key={t} className="flex items-center gap-2"><span style={{ width: 6, height: 6, background: '#e8a317', borderRadius: '50%', flexShrink: 0 }} />{t}</li>
            ))}
          </ul>
        </Card>
        <Card title="资本市场服务硬科技">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>科创板、创业板与北交所形成差异化定位；注册制与常态化退市改善定价效率，引导长期资金配置新质生产力赛道。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>直接融资</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>股权融资占比提升，缓解杠杆率与期限错配。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>监管迭代</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>信息披露与执法力度强化，压缩壳资源与炒作空间。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>市值结构</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>主板蓝筹约 55%、双创/北交约 25%、金融权重约 15%（2024 示意）。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="数字人民币（e-CNY）· 零售与跨境双线" className="mb-6">
        <Grid cols={3}>
          {[['零售试点', '零售型 CBDC 侧重 M0 替代与可控匿名，高频小额、智能合约与红包等场景渗透。'],
            ['跨境试验', 'mBridge 等多边央行数字货币桥探索批发结算降本增效，缩短代理行链条。'],
            ['交易规模', '交易额指数由 2021 年的 0.08 升至 2024 上半年约 2.5（相对值示意），仍处早期放量阶段。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: '#22d3ee' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>金融系统的真实约束是「开放节奏」与「风险底线」的动态权衡：宏观审慎框架与中央金融工委的统筹，决定了人民币国际化与资本市场开放只能走渐进、管道式的路径——稳定优先于速度。</p>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为推演与量级示意，引用请以央行、证监会、外汇局及 SWIFT、IMF 等公开出版物为准 · 由 china.html「金融系统」专题迁移</p>
    </div>
  );
}
