import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const dependencyRadar = {
  radar: { indicator: [{ name: '铁矿石', max: 100 }, { name: '原油', max: 100 }, { name: '锂金属', max: 100 }, { name: '精炼铜', max: 100 }, { name: '天然气', max: 100 }, { name: '大豆', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [82, 72, 65, 78, 45, 85], name: '对外依存度 (%)', lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } }] }],
};
const mineralTreemap = {
  series: [{
    type: 'treemap', breadcrumb: { show: false }, roam: false, nodeClick: false,
    label: { show: true, fontSize: 11, color: '#f8fafc' },
    data: [
      { name: '东南亚 (镍/铝) 35%', value: 35, itemStyle: { color: '#e8a317' } },
      { name: '非洲 (钴/铁/铜) 30%', value: 30, itemStyle: { color: '#c41e3a' } },
      { name: '拉美 (锂/铜/铁) 25%', value: 25, itemStyle: { color: '#22d3ee' } },
      { name: '中亚 (油气/铀) 10%', value: 10, itemStyle: { color: '#10b981' } },
    ],
  }],
};
const assetBar = {
  grid: { left: 36, right: 16, top: 28, bottom: 24 },
  xAxis: { type: 'category', data: ['资源获取', '初级加工', '物流枢纽', '安保投入'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  series: [{ type: 'bar', data: [95, 78, 62, 45], barWidth: 26, itemStyle: { color: (p) => ['#c41e3a', '#e8a317', '#22d3ee', '#10b981'][p.dataIndex], borderRadius: 3 }, label: { show: true, position: 'top', formatter: '{c}%', color: '#93a1b5', fontSize: 10 } }],
};
const resilienceTrend = {
  grid: { left: 36, right: 16, top: 24, bottom: 44 },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  xAxis: { type: 'category', data: ['2016', '2018', '2020', '2022', '2024'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  series: [
    { name: '纯进口依赖指数', type: 'line', smooth: true, data: [80, 75, 60, 50, 40], lineStyle: { color: '#93a1b5', type: 'dashed' }, itemStyle: { color: '#93a1b5' } },
    { name: '海外权益+冶炼覆盖', type: 'line', smooth: true, data: [10, 25, 40, 70, 95], lineStyle: { color: '#e8a317', width: 3 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.08)' } },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Overseas Resources · 权益矿" title="海外战略资源 · 权益矿与运输安全" subtitle="锂钴镍 · 铁矿 · 权益矿布局 · 航道安全" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>资源主权是工业文明的生命线。中国通过「海外权益矿」战略将生产关系延伸至全球资源腹地——这不仅为平抑大宗商品价格波动，更是在面临地缘极端封锁（如海运禁运）时，凭借对矿山的「决策主权」确保工业机器的最低限度运转。Securing the upstream to define the downstream's survival margin.</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="80%+" label="铁矿石对外依存度 · 战略级风险点" accent="#c41e3a" />
        <Stat value="1.8 万亿" label="海外资源类累计投资 · 非洲+拉美双极" accent="#e8a317" />
        <Stat value="~75%" label="关键矿产加工全球占比" accent="#22d3ee" />
        <Stat value="STABLE" label="战略矿产储备安全指数" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="全球权益矿布局图谱（区域 × 矿种 · 示意权重）"><EChart option={mineralTreemap} style={{ height: 240 }} /></Card>
        <Card title="资源进口依赖度矩阵（% · 示意）"><EChart option={dependencyRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="对外依存度算法 · 风险分层" className="mb-6">
        <Grid cols={3}>
          {[['锂/钴 供应链风险 · MODERATE', '锂钴高度集中于刚果(金)与「锂三角」，价格与政局波动并存；通过股权与长协对冲，风险降至中等。', '#e8a317'],
            ['铜矿长期可及性 · HIGH', '在秘鲁、刚果(金)、塞尔维亚等地的权益铜矿持续放量，长期可及性评级为高。', '#10b981'],
            ['电池金属基准线', '通过刚果(金)与印尼的资产布局，基本锁定未来 10 年电池金属（镍/钴/锂）的供应基准线。', '#22d3ee']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="海外基建与资源项目地域集中度（% · 示意）"><EChart option={assetBar} style={{ height: 260 }} /></Card>
        <Card title="护航主权 · 非战争军事行动与资产安全">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>海外资源布局的下半场是「保护」。通过提升远海护航频率、深化与「一带一路」国家的安保协作，并构建基于卫星监测的「资产全息感知系统」，确保海外矿山、油田及港口的物理安全。现实主义逻辑认为：无法防御的资产本质上是他人的财富。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>航道安全节点（Logistics Security Node）</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>马六甲—印度洋—亚丁湾航线为铁矿与油气运输命脉，护航编队与海外保障点构成运输安全底座。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>风险评估算法（Risk Assessment Algorithm)</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>对项目所在国政局、债务与社区关系进行动态评分，指导权益结构与保险安排。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="供应链韧性冗余 · 从纯进口到权益+冶炼覆盖（指数 · 示意）" className="mb-6">
        <EChart option={resilienceTrend} style={{ height: 240 }} />
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>纯进口依赖指数持续下行，海外权益与冶炼加工覆盖指数升至 95：定价与加工环节的掌控力替代了单纯的买卖关系。</p>
      </Card>

      <Card title="四大支柱 · 结构透视" className="mb-6">
        <Grid cols={4}>
          {[['01 全球矿产图谱', '东南亚（镍/铝）、非洲（钴/铁/铜）、拉美（锂/铜/铁）、中亚（油气/铀）构成四大资源腹地。'],
            ['02 对外依存度算法', '铁矿石 82%、精炼铜 78%、原油 72%、锂 65%、大豆 85%——依存度矩阵决定权益矿的优先级排序。'],
            ['03 海外资产护航', '远海护航 + 安保协作 + 卫星感知，把「物理安全」嵌入资源资产负债表。'],
            ['04 供应链韧性冗余', '权益矿 + 本土冶炼 + 战略储备的三重冗余，对冲断供与价格武器化。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研结论 · 构建「重力场」制衡"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>中国的海外资源战略已完成从「单纯买卖」向「深度嵌合」的转变。通过在印尼建设镍铁园区、在几内亚开发西芒杜铁矿，正在全球制造一个以中国需求和技术为核心的「资源重力场」。其最终目标是构建「非对称相互依赖」：外部世界可以试图断供，但中国掌控的初级加工权将使全球制造业面临不可承受的崩溃成本。GLOBAL_FOOTPRINT: EXPANDING · SUPPLY_RESILIENCE: RECONSTRUCTING · STATUS: STRATEGIC_STABILITY</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>「资源的掌控力即是工业文明的呼吸频率」 · 数据来源：公开资源与供应链研报，部分为示意值 · 由 china.html「海外资源」专题迁移</p>
    </div>
  );
}
