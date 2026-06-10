import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const rmbShare = {
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ name: '全球支付份额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [1.8, 2.1, 2.4, 2.8, 4.1, 4.6], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.15)' } }],
};
const cipsNodes = {
  tooltip: { trigger: 'axis' },
  grid: { left: 90, right: 36, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'category', data: ['日均交易额', '结算行覆盖', '间接参与者', '直接参与者'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  series: [{ type: 'bar', data: [
    { value: 88, itemStyle: { color: '#22d3ee' } },
    { value: 78, itemStyle: { color: '#10b981' } },
    { value: 92, itemStyle: { color: '#c41e3a' } },
    { value: 85, itemStyle: { color: '#e8a317' } },
  ], barWidth: 14, itemStyle: { borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }],
};
const ecnyRadar = {
  radar: {
    indicator: [{ name: '民生支付', max: 100 }, { name: '跨境结算', max: 100 }, { name: '政务发放', max: 100 }, { name: '供应链金融', max: 100 }, { name: '智能合约自动化', max: 100 }],
    axisName: { color: '#93a1b5', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [95, 78, 92, 85, 88], name: '试点能级', lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.15)' } }] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="RMB Intl · 金融主权" title="人民币国际化 · CIPS 与数字货币" subtitle="跨境支付 · 本币结算 · e-CNY · 去美元化博弈" />

      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>在现实主义博弈中，货币不仅是中介，更是「主权信用的算法载体」。中国正利用其作为全球最大贸易国的地位，推进「去美元化」：通过在石油、大宗商品领域推行本币结算，构建一个平行于美元体系的<strong style={{ color: 'var(--text-primary)' }}>「非对称货币引力场」</strong>，对冲单极霸权带来的「金融脱钩」风险。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="4.61%" label="RMB 全球支付份额 · 全球第四大货币" accent="#e8a317" />
        <Stat value="114" label="CIPS 覆盖国家/地区 · 独立跨境协议" accent="#22d3ee" />
        <Stat value="3.2 万亿$" label="外汇储备规模 · 系统流动性压舱石" />
        <Stat value="TIER 1" label="金融防火墙能级 · Risk Isolation Active" accent="#c41e3a" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="RMB 全球支付份额走势（% · SWIFT 口径）"><EChart option={rmbShare} style={{ height: 250 }} /></Card>
        <Card title="CIPS 网络节点能级（指数 · 示意）"><EChart option={cipsNodes} style={{ height: 250 }} /></Card>
      </Grid>

      <Card title="核心逻辑 · 从「贸易货币」向「主权信用」的跃迁" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>人民币国际化的本质不是汇率竞争，而是信用体系竞争：先以贸易结算渗透（份额由 2019 年 1.8% 升至 2024 年约 4.6%），再以离岸清算与储备货币职能逐级跃迁，将贸易规模优势转译为货币话语权。</p>
        <div className="text-xs italic p-3" style={{ color: 'var(--text-tertiary)', borderLeft: '2px solid #e8a317', background: 'rgba(232,163,23,0.06)' }}>"Currency is the digital extension of a nation's kinetic power."</div>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="CIPS · 主权备份协议">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>人民币跨境支付系统（CIPS）覆盖 114 个国家/地区，提供独立于 SWIFT 的清算通道：SWIFT 替代系数持续上升（RISING），跨境清算延时实时化（REAL-TIME）。</p>
          <p className="text-[11px] italic p-3 rounded" style={{ color: 'var(--text-tertiary)', background: 'rgba(148,163,184,0.08)' }}>分析：CIPS 正从备用选项进化为「全球南方」贸易的底层基座。</p>
        </Card>
        <Card title="e-CNY · 主权信用的数字化身">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>数字人民币不是简单的电子钱包，而是「可编程的主权货币」：通过加载智能合约实现资金流向穿透式监管，拦截资本外逃与洗钱；在离岸接口中为跨境支付「最后一百米」提供基于区块链的物理级方案。</p>
          <Grid cols={2}>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-sm font-bold mono" style={{ color: '#e8a317' }}>2.0 T+</div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>累计交易总额（RMB）</div></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-sm font-bold mono" style={{ color: '#22d3ee' }}>mBridge</div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>多边央行数字货币桥参与度</div></div>
          </Grid>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="数字人民币试点场景渗透（指数 · 示意）"><EChart option={ecnyRadar} style={{ height: 280 }} /></Card>
        <Card title="四大支柱 · 体系化推进">
          <div className="space-y-3">
            {[['01 人民币国际化算法', '贸易结算先行，离岸市场跟进，储备职能渐进，以「渗透」替代「冲锋」。', '#e8a317'],
              ['02 跨境支付备份协议', 'CIPS 独立报文与清算体系，确保极端制裁场景下跨境结算不中断。', '#22d3ee'],
              ['03 数字人民币沙盒', 'e-CNY 多城试点 + mBridge 跨境实验，技术护城河先于规模扩张。', '#10b981'],
              ['04 金融风险防火墙', '资本项目有序开放与风险隔离并行，守住不发生系统性风险的底线。', '#c41e3a']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="调研结论 · 构建「抗封锁」的金融系统" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>中国金融体制改革的终点不是简单的「自由化」，而是「安全保障下的高效配置」。通过人民币国际化的逐步渗透、CIPS 协议的全球铺设、以及数字人民币的技术护城河，中国正在物理层面构建一套即便面对极端制裁，仍能维持工业机器持续运转、资源精准调配的金融利维坦。</p>
        <div className="flex flex-wrap gap-4 text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>
          <span>// CREDIT_SOVEREIGNTY: 100.00%</span>
          <span>// RISK_BARRIER: STRENGTHENED</span>
          <span>// STATUS: STRATEGICALLY_READY</span>
        </div>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>「信用的边界即是主权的射程」 · 数据为公开信息综合整理与示意值 · 由 china.html「人民币国际化」专题迁移</p>
    </div>
  );
}
