import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const distortionTrend = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2012', '2016', '2020', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '损耗指数', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [100, 72, 50, 35], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }],
};
const efficacyRadar = {
  legend: { data: ['中国', '发达经济体均值'], textStyle: { color: '#93a1b5' }, top: 0 },
  radar: { indicator: [{ name: '动员广度', max: 100 }, { name: '执行速度', max: 100 }, { name: '资源调配', max: 100 }, { name: '政策修正', max: 100 }, { name: '透明度', max: 100 }, { name: '容错弹性', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [98, 92, 95, 80, 55, 60], name: '中国', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [60, 55, 65, 80, 88, 82], name: '发达经济体均值', lineStyle: { color: '#22d3ee' } },
  ] }],
};
const costTrend = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2013', '2017', '2021', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [18, 15, 13, 11], barWidth: 28, itemStyle: { color: '#10b981', borderRadius: [3, 3, 0, 0] } }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Administrative System" title="政府体系与行政执行逻辑" subtitle="权力架构 · 压力传导 · 组织算法 · 执行效能 —— 党政耦合的「统领式」行政架构" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>政府体系的本质是「大脑与四肢」的高度契合。党对政府工作的全面领导解决了官僚机构在多目标冲突下的决策迟滞，「双轨合一」确保政治意志无阻碍转化为行政指令，实现跨部门、跨层级的「总动员」能力。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="垂直化" label="指挥链条穿透" accent="#c41e3a" />
        <Stat value="模块化" label="大部制职能整合" accent="#22d3ee" />
        <Stat value="穿透性" label="指令抵达深度" accent="#e8a317" />
        <Stat value="一致性" label="全域政策对齐" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="行政命令传导损耗趋势（模型示意）"><EChart option={distortionTrend} style={{ height: 240 }} /><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>「垂直管理」改革对官僚层级信息扭曲的抑制成效。</p></Card>
        <Card title="行政成本占财政支出比重（去冗余化 · 示意）"><EChart option={costTrend} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="压力型体制 · 目标分解的执行算法" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>把宏伟蓝图量化为层层加压的考核指标，将地方政府与官僚个体转化为高强度的「执行单位」。</p>
        <Grid cols={3}>
          {[['目标承包制', '中枢设定核心目标（脱贫、双碳、GDP），逐级签「责任状」，完成情况挂钩行政资源与政治晋升。', '压力层层传递'],
            ['限期「拆弹」逻辑', '针对突发系统性风险，「即时响应、驻场办公、督查回访」特战模式，资源饱和式打击。', '应急动员机制'],
            ['督查与「回头看」', '中枢直接指挥的督查系统，不定期「穿透式抽检」，防执行末端的「过滤效应」与打折扣。', '随机抽检/审计']].map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}><div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p><span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="组织算法 · 精英官僚的淘汰与筛选">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>晋升建立在「基层主政经验」与「跨部门历练」的复合履历之上，确保决策层既有宏观视野，又有处理复杂矛盾的「地感」。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>多岗位轮换制度</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>省部级官员通常有至少 3 个省份或 2 个以上关键部门任职经历，拆除利益藩篱。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>政绩评价权重模型</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>从单一经济指标向安全、民生、生态、党建的多维矩阵演进，引导行为预期。</p></div>
          </div>
        </Card>
        <Card title="全球行政效能对比（2024 · 示意）"><EChart option={efficacyRadar} style={{ height: 260 }} /></Card>
      </Grid>

      <Card title="调研结论 · 构建韧性利维坦" className="mb-6">
        <Grid cols={3}>
          {[['1 · 从「命令式」向「算法式」', '经数字化指标实现对社会的自动控制，决策不再依赖直觉，而依赖多源数据反馈下的算法推荐。'],
            ['2 · 压力释放机制', '长期高压执行可能增加系统脆性，经「基层减负」与「容错纠错」建立动态平衡，防「官僚性躺平」。'],
            ['3 · 权力中枢的「穿透力」', '经政治巡视与数字化审计，实现对超大规模官僚体系最强效的垂直约束。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="调研组总结"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>政府体系是一套经两千年迭代、在现代技术加持下的「权力处理引擎」，冷酷地计算效率、风险与成本，致力于在复杂博弈中实现「秩序的最大化」。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：国家统计局、中组部公报及政治学前沿建模，部分为示意值 · 由 china.html「党政机构职能」专题迁移</p>
    </div>
  );
}
