import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const jobDistPie = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['50%', '85%'], avoidLabelOverlap: false,
    itemStyle: { borderRadius: 2, borderColor: 'transparent', borderWidth: 2 },
    label: { show: true, color: '#93a1b5', fontSize: 11 },
    data: [
      { value: 40, name: '外卖配送与物流', itemStyle: { color: '#c41e3a' } },
      { value: 25, name: '直播、自媒体与内容', itemStyle: { color: '#e8a317' } },
      { value: 20, name: '网约车与出行服务', itemStyle: { color: '#22d3ee' } },
      { value: 15, name: '知识技能/设计开发', itemStyle: { color: '#10b981' } },
    ],
  }],
};
const algRadar = {
  radar: {
    indicator: [{ name: '定价权分配', max: 100 }, { name: '劳动时间限制', max: 100 }, { name: '派单算法中立', max: 100 }, { name: '评价体系公正', max: 100 }, { name: '个人数据可携', max: 100 }, { name: '争议申诉效率', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [65, 88, 75, 82, 40, 85], name: '治理水位', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }] }],
};
const bufferLogic = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['劳动力流入量', '就业吸纳耐性'], textStyle: { color: '#93a1b5', fontSize: 11 }, top: 0 },
  grid: { left: 44, right: 24, top: 32, bottom: 28 },
  xAxis: { type: 'category', data: ['制造业低迷期', '服务业复苏期', '出口波动期', '节日需求峰值'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  series: [
    { name: '劳动力流入量', type: 'bar', data: [180, 120, 210, 150], barWidth: 22, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
    { name: '就业吸纳耐性', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [90, 85, 95, 88], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Gig Economy · Digital Labor Market & Elastic Economy" title="平台灵活就业 · 算法治理" subtitle="就业蓄水池 · 社保覆盖 · 骑手与算法 —— 零工经济与数字劳动力" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>零工经济是中国经济面临人口结构变化与产业升级时的「系统级自适应」：体制通过数字平台将 2 亿+ 劳动力「原子化」，以推荐算法实现超大规模劳务市场的毫秒级匹配；治理重心则从「极致效率」转向「合理劳动强度」与新型安全网重构。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="2.3 亿+" label="灵活就业总人数 · 占城镇就业 ~23%" accent="#e8a317" />
        <Stat value="8,400 万" label="平台注册骑手/司机 · 数字化深度介入" />
        <Stat value="72.5%" label="算法透明度指数 · 治理 2.0 阶段" accent="#22d3ee" />
        <Stat value="45%" label="职业伤害险渗透率 · 试点加速中" accent="#c41e3a" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="01 · 劳动力重构：数字化身与原子化生存">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>个体不再依附于固定组织，而是依附于<strong style={{ color: 'var(--text-primary)' }}>「评分系统」</strong>——平台将劳动力的损耗控制在极低水平，实现碎片化与最优化并存。<span className="mono text-[10px]" style={{ color: '#22d3ee' }}> Status: Fragmented &amp; Optimized</span></p>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>灵活就业岗位构成分布（2024E · %）</div>
          <EChart option={jobDistPie} style={{ height: 220 }} />
        </Card>
        <Card title="02 · 算法治理边界（治理水位 · 0-100）">
          <EChart option={algRadar} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>数据揭示：治理逻辑正从「极致效率」转向「合理劳动强度」。通过强制休息机制与算法备案制，系统正在防止<strong style={{ color: 'var(--text-secondary)' }}>「系统性怠工」</strong>；个人数据可携（40）仍是最大短板。</p>
        </Card>
      </Grid>

      <Card title="03 · 就业蓄水池：社会的避震器" className="mb-6">
        <Grid cols={2}>
          <div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>零工经济承载了中国经济转型中的<strong style={{ color: 'var(--text-primary)' }}>「摩擦性失业」</strong>，是制造业出海、出口波动时的社会稳定器。当传统行业收缩时，平台经济以极低的进入门槛迅速吸收冗余劳动力，防止结构性失业引发震荡——这种<strong style={{ color: '#c41e3a' }}>「瞬间吸纳力」</strong>是国家治理韧性的重要物理体现。</p>
            <Grid cols={2}>
              <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-lg font-bold mono" style={{ color: '#e8a317' }}>3.5%</div><div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>零工收入对基尼系数的调节度</div></div>
              <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-lg font-bold mono" style={{ color: '#e8a317' }}>82%</div><div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>劳动力在行业转换间的平均停留天数（指数）</div></div>
            </Grid>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>经济波动下的零工流入/流出敏感度</div>
            <EChart option={bufferLogic} style={{ height: 260 }} />
          </div>
        </Grid>
      </Card>

      <Card title="04 · 新型安全网重构：职业伤害保障 · 算法下的安全锁" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中国正尝试通过「第三种劳动关系」解决社保难题——既不完全等同于正式员工，也不是纯粹的独立承包。通过建立由平台出资、政府统筹的<strong style={{ color: 'var(--text-primary)' }}>「职业伤害保障」</strong>试点，体制在不摧毁平台效率的前提下，为原子化劳动者提供基础的安全冗余，实现治理风险的社会化再分配。</p>
        <Grid cols={3}>
          {[['Digital Asset Entitlement', '数字资产确权', '骑手账号、评分与接单记录构成数字劳动资产，可携性决定劳动者议价能力。'],
            ['Social Insurance Portability', '社保可携转', '打破户籍与单位绑定的缴纳结构，让保障跟人走而非跟岗位走。'],
            ['Platform Liability Protocol', '平台责任协议', '按单缴费、平台出资的职业伤害保障，将算法派单的风险外部性内部化。']].map(([en, t, d]) => (
            <div key={en} style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
              <div className="text-[10px] mono uppercase tracking-wider" style={{ color: '#10b981' }}>{en}</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>零工经济的本质是一场三方博弈：平台要效率、劳动者要保障、体制要稳定。算法备案制与职业伤害险试点表明，治理目标不是消灭弹性，而是给弹性装上「安全锁」——就业蓄水池能否长期蓄水，取决于安全网能否跟上原子化的速度。</p>
        <div className="flex flex-wrap gap-6 text-[10px] font-bold mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <span>// LABOR: ELASTIC</span><span>// ALGORITHM: CALIBRATED</span><span>// SOCIAL_STABILITY: HIGH</span>
        </div>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供结构性参考 · 由 china.html「零工经济」专题迁移</p>
    </div>
  );
}
