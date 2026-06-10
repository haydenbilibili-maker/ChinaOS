import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const axisColor = '#27324a';
const gridColor = 'rgba(148,163,184,0.1)';
const textColor = '#93a1b5';

const riskClear = {
  grid: { left: 40, right: 16, top: 28, bottom: 28 },
  legend: { top: 0, textStyle: { color: textColor, fontSize: 10 }, itemWidth: 14 },
  xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024E'], axisLine: { lineStyle: { color: axisColor } }, axisLabel: { color: textColor } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: gridColor } }, axisLabel: { color: textColor } },
  series: [
    { name: '房企杠杆率', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [120, 95, 82, 70], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { name: '交付率预期', type: 'bar', data: [40, 65, 88, 95], barWidth: 18, itemStyle: { color: '#e8a317', borderRadius: 3 } },
  ],
};
const dualTrack = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  legend: { bottom: 0, textStyle: { color: textColor, fontSize: 10 }, itemWidth: 12 },
  series: [{
    type: 'pie', radius: ['58%', '78%'], center: ['50%', '44%'], avoidLabelOverlap: true, label: { show: false },
    data: [
      { value: 50, name: '市场化商品房', itemStyle: { color: '#c41e3a' } },
      { value: 25, name: '保租房', itemStyle: { color: '#22d3ee' } },
      { value: 15, name: '配售型保障房', itemStyle: { color: '#e8a317' } },
      { value: 10, name: '共有产权', itemStyle: { color: '#10b981' } },
    ],
  }],
};
const investMix = {
  radar: {
    indicator: [{ name: '城中村改造', max: 100 }, { name: '保租房建设', max: 100 }, { name: '高品质改善', max: 100 }, { name: '数字化社区', max: 100 }, { name: '平急两用基建', max: 100 }],
    axisName: { color: textColor }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: axisColor } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [95, 88, 75, 92, 80], name: '未来投向权重（2024–2030 · 示意）', lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.15)' } }] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Housing · De-financialization & New Model" title="商品房周期 · 保障房与新模式" subtitle="房住不炒 · 保交楼 · 租购并举 · 城中村改造 —— 从「金融杠杆中心」到「民生保障中心」" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>房地产正从「金融杠杆中心」转向「民生保障中心」。体制通过限制开发商融资（三道红线）与引导预期下行，切断房价单边上涨的系统动力——这种「主动刺破」旨在防止资产泡沫对制造业与科技创新的虹吸效应，把国家资本腾挪向新质生产力。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="HIGH" label="房住不炒指数（理性回归）" accent="#c41e3a" />
        <Stat value="300 万+" label="保交楼交付（套 · 存量风险出清中）" accent="#e8a317" />
        <Stat value="35%" label="租购并举占比（向 2030 目标推进）" accent="#22d3ee" />
        <Stat value="ACTIVE" label="保障性住房投资（三大工程核心拉动）" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="风险出清与交付预期（2021–2024E · 示意）"><EChart option={riskClear} style={{ height: 250 }} /></Card>
        <Card title="住房「双轨制」结构（% · 示意）"><EChart option={dualTrack} style={{ height: 250 }} /></Card>
      </Grid>

      <Card title="核心逻辑 · 去金融化与系统重启" className="mb-6">
        <Grid cols={3}>
          {[['三道红线 · 切断杠杆', '以剔除预收款资产负债率、净负债率、现金短债比三条线限制房企融资，房企杠杆率从约 120% 回落至 70% 区间，强制行业去金融化。'],
            ['保交楼 · 守住底线', '以城市政府为主体、专项借款与白名单机制兜底交付，累计交付超 300 万套，将期房违约的社会风险压缩在可控阈值内。'],
            ['土地财政脱钩', '「Decoupling land finance from local governance」——切断地方治理对土地出让金的依赖，是恢复产业竞争力的前提，也是转型最痛的环节。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="住房双轨制 · 市场归市场，保障归保障">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>新体系把住房拆成两条轨道：市场轨（商品房）回归高品质、高溢价的改善逻辑；保障轨（保租房、共有产权、配售型保障房）走普惠化、封闭化管理。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>市场轨（商品房 · 约 50%）</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>取消限购限价后回归供需定价，竞争维度转向品质、物业与社区运营。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>保障轨（保租房/配售 · 约 50%）</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>封闭流转、不可上市套利——保障房的闭环管理正消解住房的「投机红利」。</p></div>
          </div>
        </Card>
        <Card title="未来住房投资结构演进（2024–2030 · 示意）"><EChart option={investMix} style={{ height: 260 }} /></Card>
      </Grid>

      <Card title="三大工程 · 存量博弈的新支点" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>「三大工程」——保障性住房建设、城中村改造、「平急两用」公共基础设施——是房地产新模式的物理载体。它不再依赖新区盲目扩张，而是深挖超大特大城市的内部空间，实现生产力与居住环境的再平衡；这种「城市更新算法」是释放内需、消化存量杠杆的最后王牌。</p>
        <Grid cols={3}>
          {[['保障性住房建设', '以配售型保障房锚定新市民与青年群体的「上车」预期，同时为收缩中的开发投资提供逆周期托底。'],
            ['城中村改造', '聚焦 21 个超大特大城市，以净地出让 + 房票安置替代大拆大建，是未来投向权重最高的板块（示意权重 95）。'],
            ['平急两用基建', '平时服务文旅康养、急时转换隔离保障，把韧性基建嵌入城市更新，对冲传统地产链条的就业缺口。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="高品质居住进化 · 构建居住确定性" className="mb-6">
        <Grid cols={3}>
          {[['1 · 历史性回摆', '房地产从「高速增长」向「平稳运营」回摆：市场泡沫缓释（MARKET_BUBBLE: MITIGATED）、双轨制落地实施、城市韧性重构同步推进。'],
            ['2 · 好房子标准', '未来居住生态由数字化社区管理、适老化硬件标准与绿色低碳能耗共同定义——竞争从「有没有」转向「好不好」。'],
            ['3 · 战略腾挪', '平衡资产价值不仅是支柱产业更迭，更是为新一轮全要素生产率爆发腾挪物理空间与金融资源。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>「住房属性的回归是系统稳定的最终保障。」去金融化的代价由土地财政与居民资产负债表共同承担；新模式能否成立，取决于保障轨的供给速度能否跑赢市场轨的出清速度。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供结构性参考 · 由 china.html「住房」专题迁移</p>
    </div>
  );
}
