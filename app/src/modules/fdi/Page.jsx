import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const hiTechLine = {
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2020', '2022', '2024E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ name: '高技术产业引资占比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [20, 25, 34, 39], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } }],
};
const negativeList = {
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2013', '2017', '2019', '2021', '2024'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ name: '全国版负面清单限制条目', type: 'line', step: 'end', data: [190, 63, 40, 31, 29], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.1)' }, label: { show: true, color: '#93a1b5', fontSize: 10 } }],
};
const rdCenterPie = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['40%', '70%'],
    data: [
      { value: 40, name: '生物医药', itemStyle: { color: '#22d3ee' } },
      { value: 25, name: '汽车与智驾', itemStyle: { color: '#c41e3a' } },
      { value: 20, name: '新材料', itemStyle: { color: '#10b981' } },
      { value: 15, name: '数字技术', itemStyle: { color: '#e8a317' } },
    ],
    label: { show: true, fontSize: 10, color: '#93a1b5' },
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="FDI · 双向直投" title="跨境直接投资 · 双向流动" subtitle="负面清单 · 国家安全审查 · 外资留存 · 对外投资 —— 外资布局与高水平开放" />

      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>在现实主义框架下，中国对外资的吸引力已从「低成本要素」转向「全产业链效率」。全球唯一的全工业门类配套体系形成物理级的「产业粘性」：对跨国巨头而言，撤离意味着放弃最优的响应速度与成本平衡，这种经济重力确保了高端制造外资在「去风险」叙事下逆势深耕。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="37.3%" label="高技术产业吸纳外资占比" accent="#22d3ee" />
        <Stat value="12,000+" label="新设外商投资企业数（2024 Q1 同比明显增长）" />
        <Stat value="29 条" label="全国版负面清单条目（持续压减）" accent="#e8a317" />
        <Stat value="~1,000 亿" label="利润再投资规模（RMB · 链式锁定）" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="高技术产业引资占比走势（% · 示意）"><EChart option={hiTechLine} style={{ height: 240 }} /></Card>
        <Card title="负面清单压减演进（限制条目数）"><EChart option={negativeList} style={{ height: 240 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="01 · 市场重力场效应">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>吸引力的核心不再是劳动力价格，而是无可比拟的供应链密度。从「低成本洼地」到「全链条效率高地」，外资的留存决策被嵌入产业网络本身。</p>
          <div className="p-3 text-xs italic" style={{ borderLeft: '2px solid #22d3ee', background: 'rgba(34,211,238,0.06)', color: 'var(--text-tertiary)' }}>"The magnetic pull is no longer about labor, but about the unparalleled density of the supply chain."</div>
        </Card>
        <Card title="02 · 负面清单缩减算法">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-xs"><span style={{ color: 'var(--text-tertiary)' }}>制造业条目限制</span><span className="font-bold mono" style={{ color: '#10b981' }}>ZERO（清零）</span></div>
            <div className="flex justify-between items-center text-xs"><span style={{ color: 'var(--text-tertiary)' }}>服务业开放深度</span><span className="font-bold mono" style={{ color: '#22d3ee' }}>ACCELERATING</span></div>
          </div>
          <p className="text-xs leading-relaxed italic" style={{ color: 'var(--text-tertiary)' }}>从 2013 年的 190 条压减至 29 条；制造业限制清零标志着中国正以绝对的产业自信迎接全球竞争。安全边界则由外商投资国家安全审查制度单独守住——开放与审查并行，是双向流动的制度底座。</p>
        </Card>
      </Grid>

      <Card title="03 · 制度型开放：主权项下的规则接轨" className="mb-6">
        <Grid cols={2}>
          <div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中国正从「边境开放」转向「境内开放」：在自贸试验区测试 CPTPP、DEPA 等国际高标准经贸规则，重塑内部的行政、法律与数据监管算法。现实主义逻辑认为：<strong style={{ color: 'var(--text-primary)' }}>谁定义了规则的本地化闭环，谁就掌握了在岸市场的准入话语权</strong>。</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest mono" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>Regulatory Alignment</span>
              <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest mono" style={{ border: '1px solid #22d3ee', color: '#22d3ee' }}>Institutional Dividend</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{ color: 'var(--text-tertiary)' }}>外资在华研发中心行业分布（示意）</div>
            <EChart option={rdCenterPie} style={{ height: 240 }} />
          </div>
        </Grid>
      </Card>

      <Card title="04 · 利润再投资锁定 × 双向流动" className="mb-6">
        <Grid cols={3}>
          {[['利润再投资 · 留存外资', '约千亿级利润不汇出而转为再投资（Chain Locking），税收递延等政策把存量外资转化为增量，留住外资与新引外资同等重要。', '#10b981'],
            ['国家安全审查 · 安全阀', '对关键领域并购实施事前审查，与负面清单互为表里：清单管「能不能进」，审查管「会不会伤」，为更大尺度开放提供政治保险。', '#c41e3a'],
            ['对外投资 · ODI 出海', '双向流动的另一翼：制造业产能、新能源与数字平台加速出海，FDI 与 ODI 共同构成「以市场换安全、以效率锁利益」的资本回路。', '#e8a317']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研结论：构建深层利益嵌合">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>中国对外资的吸引力已进入「质变期」。未来的外资不再是离岸的掠夺者，而是深度的「在岸合作伙伴」。通过引导外资流向高技术制造、现代服务业及研发中心，中国正利用全球资本的共利本能，对冲外部的政治脱钩压力——这是一种<strong style={{ color: 'var(--text-primary)' }}>「以市场换安全，以效率锁利益」</strong>的长周期博弈。</p>
        <div className="flex flex-wrap gap-4 text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <span>// FDI_QUALITY: UPGRADING</span>
          <span>// INSTITUTIONAL_SYNC: CALIBRATING</span>
          <span>// STATUS: STRATEGICALLY_SECURE</span>
        </div>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>「资本的流动是现实主义最诚实的投票」· 数据来源：商务部及公开研报（含示意值）· 由 china.html「FDI」专题迁移</p>
    </div>
  );
}
