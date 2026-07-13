import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, LEGEND, stackedBarOpt, radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';

// ============================================================================
// 扩大内需 · 消费 —— 从投资驱动转向消费主拉动的结构再平衡
// asOf 2026-06-11 · 公开资料示意，非官方统计
// ============================================================================

const AS_OF = '2026-06-11';

// 最终消费率国际对比（占 GDP %，示意）
const finalConsumeOpt = {
  grid: { left: 56, right: 24, top: 16, bottom: 24 }, tooltip: { trigger: 'axis' },
  xAxis: categoryX(['中国', '日本', '德国', '韩国', '美国']),
  yAxis: valueY({ max: 90, name: '% of GDP' }),
  series: [{
    type: 'bar', barWidth: 28,
    data: [
      { value: 56, itemStyle: { color: '#c41e3a' } },
      { value: 75, itemStyle: { color: '#64748b' } },
      { value: 73, itemStyle: { color: '#64748b' } },
      { value: 66, itemStyle: { color: '#64748b' } },
      { value: 82, itemStyle: { color: '#64748b' } },
    ],
    label: { show: true, position: 'top', color: LABEL.color, formatter: '{c}%' },
  }],
};

// 居民储蓄率与消费倾向（示意 %）
const savingOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  legend: { ...LEGEND, top: 0, data: ['居民储蓄率', '平均消费倾向'] },
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024', '2025E']),
  yAxis: valueY({ name: '%' }),
  series: [
    { name: '居民储蓄率', type: 'line', smooth: true, data: [30, 34, 31, 33, 35, 34, 33], lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.08)' } },
    { name: '平均消费倾向', type: 'line', smooth: true, data: [70, 66, 69, 67, 65, 66, 67], lineStyle: { color: '#22d3ee', width: 2 } },
  ],
};

// 消费结构演变（占比 %，示意）
const structureOpt = stackedBarOpt({
  categories: ['2010', '2015', '2020', '2025E'],
  series: [
    { name: '商品消费', data: [78, 72, 66, 60], itemStyle: { color: '#c41e3a' } },
    { name: '服务消费', data: [22, 28, 34, 40], itemStyle: { color: '#22d3ee' } },
  ],
});

// 选择器联动雷达维度（示意评分 0—100）
const DIMS = ['增量空间', '政策可撬动', '需求刚性', '供给就绪', '可持续性'];

const TRACKS = [
  {
    key: 'goods', label: '商品消费', accent: '#c41e3a',
    scores: [55, 85, 60, 80, 50],
    thesis: '商品消费基本盘趋稳，增量来自「以旧换新」（汽车/家电/家装/数码）与品质升级——属政策可直接撬动的短期抓手。',
    points: ['消费品以旧换新带动汽车、家电更新需求', '新能源汽车渗透率过半，绿色消费扩面', '国货「新国潮」品牌力提升，进口替代消费'],
    lever: '财政补贴 + 消费券撬动，杠杆效应明确但持续性依赖收入预期。',
  },
  {
    key: 'service', label: '服务消费', accent: '#22d3ee',
    scores: [82, 55, 78, 60, 75],
    thesis: '服务消费是消费升级主线——文旅、餐饮、体育、健康、养老、教育培训占比持续上升，对应居民从「物质」向「体验」迁移。',
    points: ['餐饮、文旅、演出经济强劲复苏', '健康、养老、托育等民生服务需求刚性', '服务业扩大开放（医疗/教育/电信试点）'],
    lever: '供给侧扩容 + 准入放宽，受制于服务业开放与监管节奏。',
  },
  {
    key: 'county', label: '县域/下沉', accent: '#10b981',
    scores: [78, 60, 65, 50, 68],
    thesis: '县域与下沉市场是内需纵深——3 亿县域人口的消费扩容，依赖物流下沉、收入增长与城乡公共服务均等化。',
    points: ['县域商业体系建设、即时零售下沉', '农村电商与冷链补短板', '返乡置业与县域文旅消费'],
    lever: '基础设施 + 收入增长，与乡村振兴、城镇化深度联动。',
  },
  {
    key: 'silver', label: '银发/新群体', accent: '#8b5cf6',
    scores: [72, 45, 70, 48, 65],
    thesis: '人口结构变化催生新消费群体——银发经济、单身经济、Z 世代「悦己消费」分化，消费市场从同质走向分层。',
    points: ['银发康养、适老化产品需求扩张', 'Z 世代情绪消费、谷子经济、二次元', '单身/小家庭催生「一人食」「小家电」'],
    lever: '结构性供给创新，与人口政策、收入分配交织。',
  },
];

export default function Page() {
  const [track, setTrack] = useState('service');
  const t = TRACKS.find((x) => x.key === track) ?? TRACKS[0];

  return (
    <div>
      <PageHeader
        badge="十五五 · 扩大内需战略"
        title="扩大内需 · 消费结构再平衡"
        subtitle="最终消费率偏低 · 预防性储蓄约束 · 补贴到长效消费"
      />

      <IntroCard>
        扩大内需的核心是把<strong style={{ color: 'var(--text-primary)' }}>居民消费</strong>从被压抑的「剩余项」抬升为增长主引擎。
        中国最终消费率长期低于发达经济体 15—25pp，背后是<strong style={{ color: 'var(--text-primary)' }}>高储蓄、预防性储蓄与收入分配</strong>的结构性约束。
        提振消费短期靠以旧换新与消费券，长期靠<strong style={{ color: 'var(--text-primary)' }}>收入增长、社会保障与房价预期</strong>的修复。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~56%" label="最终消费率" accent="#c41e3a" />
        <Stat value="~40%" label="服务消费占比" accent="#22d3ee" />
        <Stat value="~33%" label="居民储蓄率" accent="#e8a317" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="最终消费率 · 国际对比（示意）"><EChart option={finalConsumeOpt} style={{ height: 240 }} /></Card>
        <Card title="居民储蓄率与消费倾向（示意）"><EChart option={savingOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="商品 vs 服务消费结构演变（占比 % · 示意）" className="mb-6">
        <EChart option={structureOpt} style={{ height: 220 }} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          服务消费占比稳步抬升，是消费升级与经济服务化的同步映射；商品消费向品质化、绿色化、智能化迁移。
        </p>
      </Card>

      <Card title="交互 · 消费板块选择器" className="mb-4">
        <SelectorBar
          items={TRACKS.map((x) => ({ key: x.key, label: x.label, accent: x.accent }))}
          activeKey={track}
          onSelect={setTrack}
        />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: t.accent }}>板块论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.thesis}</p>
          <div className="space-y-2 mb-3">
            {t.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#e8a317' }}>政策杠杆 · </span>{t.lever}
          </div>
        </div>
        <Card title={`${t.label} · 内需潜力五维评估（示意）`}>
          <EChart option={radarOpt(DIMS, t.scores, { name: t.label, color: t.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>最终消费率向发达经济体区间收敛、消费对增长贡献率抬升；服务消费占比持续上行（向 50% 迈进）。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>高储蓄源于社保/医疗/教育/养老不确定性与房价对资产负债表的占用；「不敢花、没钱花」根植于收入分配。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>以旧换新/消费券短期脉冲 → 服务业扩容与准入放宽 → 收入增长、社保兜底、房价企稳支撑长效消费能力。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '储蓄动员', body: '高储蓄长期被动员为投资（基建/地产），消费被压抑为「剩余」。提振消费意味着把储蓄从国家主导的投资循环，向居民自主消费循环再分配。', pillars: [['压抑', '预防性储蓄。'], ['动员', '投资优先。'], ['再分配', '收入与社保。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '补贴试验', body: '以旧换新、消费券、首发经济、免税购物——以财政撬动试探消费弹性，灰度评估乘数效应与持续性。', pillars: [['撬动', '以旧换新。'], ['试点', '消费券。'], ['评估', '乘数效应。']] },
        { key: 'path', title: '升级路径', subtitle: '短期到长效', body: '从补贴拉动的短期脉冲，转向收入增长、社会保障、房价企稳支撑的长效消费能力——「能消费、敢消费、愿消费」。', pillars: [['短期', '补贴脉冲。'], ['中期', '服务扩容。'], ['长期', '收入社保。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          消费不足的根源不在「不愿花」而在<strong style={{ color: 'var(--text-primary)' }}>「不敢花」与「没钱花」</strong>——预防性储蓄源于社保、医疗、教育、养老的不确定性与房价对资产负债表的占用。
          以旧换新等是有效的短期对冲，但内需的可持续抬升取决于<strong style={{ color: 'var(--text-primary)' }}>收入分配改革与社会保障的「兜底」厚度</strong>，与共同富裕、人口政策、住房同构。
        </p>
      </Card>

      <ModuleFooter moduleId="consumption" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
