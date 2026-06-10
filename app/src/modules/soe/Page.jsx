import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const profitTrend = {
  legend: { data: ['总资产(万亿)', '净利润(万亿)'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 44, right: 44, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2018', '2021', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: [{ type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } }, { type: 'value', splitLine: { show: false } }],
  series: [
    { name: '总资产(万亿)', type: 'bar', data: [180, 210, 260, 300], barWidth: 24, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
    { name: '净利润(万亿)', type: 'line', yAxisIndex: 1, smooth: true, data: [1.4, 1.7, 2.4, 2.6], lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' } },
  ],
};
const investPie = {
  tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 34, name: '战略性新兴产业', itemStyle: { color: '#c41e3a' } },
    { value: 24, name: '能源/资源', itemStyle: { color: '#e8a317' } },
    { value: 20, name: '基础设施', itemStyle: { color: '#22d3ee' } },
    { value: 14, name: '高端制造', itemStyle: { color: '#10b981' } },
    { value: 8, name: '其他', itemStyle: { color: '#64748b' } },
  ] }],
};
const competeRadar = {
  radar: { indicator: [{ name: '战略安全', max: 100 }, { name: '技术引领', max: 100 }, { name: '资本回报', max: 100 }, { name: '全员效率', max: 100 }, { name: '数字化', max: 100 }, { name: '链主带动', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [95, 78, 65, 70, 85, 88], name: '央企综合', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="SOE · Strategic Control" title="国有企业战略重塑与权力逻辑" subtitle="宏观底座 · 核心功能 · 专业化整合 · 治理效能 —— 国有资本作为主权延伸的物理工具" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>国企不仅是经济主体，更是中枢控制国民经济命脉、应对全球性风险的物理工具。通过占领能源、电信、金融与高端制造等「战略制高点」，构建无法被外部轻易干扰的生存底座。改革逻辑已从「去行政化」转向「增强核心功能」——通过国企实现国家战略意志的精准投放。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="300 万亿" label="国企总资产 (RMB)" accent="#c41e3a" />
        <Stat value="1.1 万亿" label="央企年研发投入" accent="#22d3ee" />
        <Stat value="97 家" label="国资委监管央企" />
        <Stat value="~60%" label="战新产业投资增幅" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="央企净利润与资产规模演进（示意）"><EChart option={profitTrend} style={{ height: 240 }} /><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>从「规模红利」向「效率红利」的收缩与转型。</p></Card>
        <Card title="央企投资方向构成（2024E · 向战新倾斜）"><EChart option={investPie} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="核心功能 · 从「普遍服务」到「战略支撑」" className="mb-6">
        <Grid cols={3}>
          {[['安全保障 (Security)', '能源石油、基础通信、民生水务的「底线思维」。作为「不计成本的备用系统」，确保极端环境下社会机能不断电。', '战略冗余 · 粮食/能源安全'],
            ['技术引领 (Innovation)', '作为「国家队」承担载人航天、国产大飞机、四代核电等重大专项，在「无人区」做大投入长周期创新。', '产业链链主 · 攻克卡脖子'],
            ['宏观调控 (Stability)', '通过国有资本投资平台平抑周期；下行期加大基建，风险期提供流动性，充当系统「避震器」。', '跨周期工具 · 资本再分配']].map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}><div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p><span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="专业化整合 · 拆除「内耗」的物理隔阂">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>为防官僚体系低效竞争（碎片化），推动「横向合并、纵向延伸」。成立中国电气装备、中国物流、中国盐业等集团，实现单一行业意志的最高统一——「资源最大化集约」。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>中国电科 + 中国华录</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>数据存储与信息安全产业链深度缝合，建立自主数字底座。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>钢铁/有色板块整合</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>经中国宝武、中国稀土等巨头，掌握原材料的全球定价权筹码。</p></div>
          </div>
        </Card>
        <Card title="国企核心竞争力模型（2024 评估 · 示意）"><EChart option={competeRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="绩效算法 ·「一利五率」的指挥棒" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>不再只看产值。通过「利润总额、净资产收益率、研发经费投入强度、全员劳动生产率、营业现金比率」综合考核，强迫这个庞然大物在具备「行政力」的同时具备「市场狼性」。</p>
        <Grid cols={2}>
          <Stat value="≤ 65%" label="资产负债率严控" accent="#e8a317" />
          <Stat value="90%" label="数字化率提升目标" accent="#22d3ee" />
        </Grid>
      </Card>

      <Card title="调研结论 · 定义「世界一流」" className="mb-6">
        <Grid cols={3}>
          {[['1 · 从行政化管理到资本化经营', '终点不是私有化，而是「主权意志的证券化」——经高水平上市公司治理，用资本市场反哺主权战略。'],
            ['2 ·「链主」模式的溢价', '掌握产业链核心节点，带动成千上万家民营「专精特新」，形成具打击韧性的产业蜂群。'],
            ['3 · 不可替代的生存冗余', '对能源、粮食、数据的绝对控制，是应对地缘政治「极端场景」的物理底牌。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="调研组总结"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>国企是中国政治体制在经济维度的「重装步兵」，冷酷地追求战略安全性与资本回报率的平衡。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：国资委、统计局、行业机构，部分为示意值 · 由 china.html「国有资本」专题迁移</p>
    </div>
  );
}
