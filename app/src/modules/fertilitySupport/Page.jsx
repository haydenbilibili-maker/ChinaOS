import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, LEGEND, donutOpt, radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// ============================================================================
// 生育支持 · 托育服务 —— 建设生育友好型社会，降低生育养育教育成本
// asOf 2026-07-14 · 公开资料示意，非官方统计
// 与 demographic（人口结构）区分：本模块聚焦生育支持政策与托育供给。
// ============================================================================

const AS_OF = AS_OF_BASELINE;

// 总和生育率与出生人口（示意）
const tfrOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  legend: { ...LEGEND, top: 0, data: ['总和生育率', '出生人口(万)'] },
  xAxis: categoryX(['2016', '2018', '2020', '2022', '2024', '2025E']),
  yAxis: [
    valueY({ name: 'TFR', max: 2 }),
    valueY({ name: '万', max: 2000, position: 'right', splitLine: { show: false } }),
  ],
  series: [
    { name: '总和生育率', type: 'line', smooth: true, data: [1.30, 1.18, 1.07, 1.05, 1.02, 1.00], lineStyle: { color: '#c41e3a', width: 2 },
      markLine: { silent: true, data: [{ yAxis: 2.1, label: { formatter: '更替水平 2.1', color: LABEL.color }, lineStyle: { color: '#10b981', type: 'dashed' } }] } },
    { name: '出生人口(万)', type: 'bar', yAxisIndex: 1, barWidth: 18, data: [1786, 1523, 1200, 956, 954, 920], itemStyle: { color: 'rgba(34,211,238,0.6)' } },
  ],
};

// 生育养育成本结构（示意 %）
const costOpt = donutOpt([
  { name: '教育/课外', value: 34, itemStyle: { color: '#c41e3a' } },
  { name: '住房', value: 26, itemStyle: { color: '#e8a317' } },
  { name: '托育/照护', value: 16, itemStyle: { color: '#22d3ee' } },
  { name: '医疗保健', value: 12, itemStyle: { color: '#10b981' } },
  { name: '日常养育', value: 12, itemStyle: { color: '#8b5cf6' } },
]);

// 托育供给缺口（千人口托位数，示意）
const careOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  legend: { ...LEGEND, top: 0, data: ['现有托位', '十五五目标'] },
  xAxis: categoryX(['2020', '2022', '2024', '2025E', '2030E']),
  yAxis: valueY({ name: '个/千人' }),
  series: [
    { name: '现有托位', type: 'bar', barWidth: 20, data: [1.8, 2.5, 3.4, 4.0, 0], itemStyle: { color: '#22d3ee' } },
    { name: '十五五目标', type: 'line', smooth: true, data: [null, null, null, 4.5, 6.0], lineStyle: { color: '#e8a317', width: 2, type: 'dashed' } },
  ],
};

// 选择器联动雷达维度（示意评分 0—100）
const DIMS = ['政策力度', '降本效果', '可持续性', '覆盖广度', '社会接受'];

const LEVERS = [
  {
    key: 'birth', label: '生育补贴', accent: '#c41e3a',
    scores: [65, 50, 45, 60, 70],
    thesis: '现金补贴是最直接的政策工具——多地试点育儿补贴、一次性生育奖励，对冲生育的直接经济成本，但弹性有限。',
    points: ['地方育儿补贴（按孩次月度发放）试点扩面', '生育医疗费用报销、生育津贴扩围', '个税专项附加扣除（婴幼儿照护）提标'],
    limit: '国际经验显示纯现金补贴对生育率提振边际有限，需「组合拳」。',
  },
  {
    key: 'care', label: '托育服务', accent: '#22d3ee',
    scores: [70, 68, 55, 50, 72],
    thesis: '普惠托育是降低照护成本的关键——0—3 岁托育供给严重不足，发展普惠托位、用人单位办托、社区嵌入式托育是补短板主线。',
    points: ['每千人口托位数向 4.5（十五五）迈进', '普惠托育服务体系、社区+单位+家庭多元供给', '托幼一体化（幼儿园下延托班）'],
    limit: '普惠与可持续运营的成本平衡难，专业照护人才短缺。',
  },
  {
    key: 'leave', label: '假期/就业', accent: '#10b981',
    scores: [55, 60, 50, 55, 48],
    thesis: '产假/育儿假与女性就业保护——延长育儿假、推广男性育儿假、保障女性就业权益，降低生育的「职业惩罚」与机会成本。',
    points: ['育儿假、护理假制度落地与成本分担', '反就业性别歧视、弹性工作制', '生育成本社会化（用人单位—社保—财政分担）'],
    limit: '假期成本若由企业独担，反加剧对育龄女性的隐性歧视。',
  },
  {
    key: 'housing', label: '住房/教育', accent: '#e8a317',
    scores: [58, 72, 60, 52, 65],
    thesis: '住房与教育是生育成本的「两座大山」——多孩家庭住房支持、教育「双减」与优质均衡，是降低长期养育成本的结构性变量。',
    points: ['多子女家庭购房/租房支持、公积金倾斜', '「双减」减轻课外培训负担', '基础教育优质均衡、学位供给'],
    limit: '住房与教育成本根植于更深的分配与资源配置结构，调整周期长。',
  },
];

export default function Page() {
  const [lever, setLever] = useState('care');
  const l = LEVERS.find((x) => x.key === lever) ?? LEVERS[0];

  return (
    <div>
      <PageHeader
        badge="十五五 · 人口高质量发展"
        title="生育支持 · 托育服务体系"
        subtitle="总和生育率1.0 · 三重成本叠加 · 放开到支持友好"
      />

      <IntroCard>
        生育支持政策体系的目标是<strong style={{ color: 'var(--text-primary)' }}>降低生育、养育、教育成本</strong>，建设生育友好型社会。
        总和生育率已跌至约 <strong style={{ color: 'var(--text-primary)' }}>1.0</strong>，远低于 2.1 的更替水平——生育的<strong style={{ color: 'var(--text-primary)' }}>直接成本（养育）、机会成本（女性职业）与预期成本（教育/住房）</strong>三重叠加，
        使「能生」未必「愿生」。这是人口高质量发展的供给侧抓手（与人口结构模块的趋势分析互补）。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~1.0" label="总和生育率" accent="#c41e3a" />
        <Stat value="~920万" label="2025E 出生人口" accent="#22d3ee" />
        <Stat value="4.5(目标)" label="每千人托位数" accent="#e8a317" />
        <Stat value={AS_OF} label="数据截至" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="总和生育率与出生人口（示意）"><EChart option={tfrOpt} style={{ height: 240 }} /></Card>
        <Card title="生育养育成本结构（示意）"><EChart option={costOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="普惠托育供给 · 每千人口托位数（示意）" className="mb-6">
        <EChart option={careOpt} style={{ height: 220 }} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          0—3 岁婴幼儿托育是「最缺」环节——供给从约 4 个/千人向十五五目标 4.5—6 个/千人爬坡，普惠性与可及性是关键。
        </p>
      </Card>

      <Card title="交互 · 生育支持杠杆选择器" className="mb-4">
        <SelectorBar
          items={LEVERS.map((x) => ({ key: x.key, label: x.label, accent: x.accent }))}
          activeKey={lever}
          onSelect={setLever}
        />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${l.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: l.accent }}>杠杆论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{l.thesis}</p>
          <div className="space-y-2 mb-3">
            {l.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${l.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#c41e3a' }}>局限 · </span>{l.limit}
          </div>
        </div>
        <Card title={`${l.label} · 政策杠杆五维评估（示意）`}>
          <EChart option={radarOpt(DIMS, l.scores, { name: l.label, color: l.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>每千人口托位数向 4.5—6 个爬坡；普惠托育覆盖、育儿补贴与生育津贴扩围；托住总和生育率与出生人口。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>直接成本（养育）、机会成本（女性职业）、预期成本（住房/教育）三重叠加；纯现金补贴边际有限。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>从「放开生育」到「支持生育」——成本社会化分担（财政/社保/用人单位），托育、住房、教育、就业保护组合拳。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '生育外部性', body: '人口再生产是全社会的正外部性，但成本主要由家庭—尤其女性—私人承担。生育支持本质是把「生物税」通过财政与社保再分配回家庭。', pillars: [['外部性', '社会受益。'], ['私人成本', '家庭承担。'], ['再分配', '社保财政。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '地方试点', body: '育儿补贴、普惠托育、育儿假——以地方差异化试点探索有效且可持续的政策组合与成本分担。', pillars: [['试点', '地方补贴。'], ['普惠', '托育扩容。'], ['迭代', '组合政策。']] },
        { key: 'path', title: '升级路径', subtitle: '放开到支持', body: '从「放开生育」到「支持生育」——从取消限制转向真金白银降低成本、建设生育友好型社会与劳动力市场。', pillars: [['放开', '三孩政策。'], ['支持', '成本分担。'], ['友好', '社会环境。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          生育支持的核心是<strong style={{ color: 'var(--text-primary)' }}>「成本的社会化分担」</strong>——把养育、住房、教育、女性职业的多重成本，从家庭私人承担向财政、社保、用人单位再分配。
          国际经验表明单一现金补贴效果有限，唯有<strong style={{ color: 'var(--text-primary)' }}>托育、住房、教育、就业保护的系统性组合拳</strong>才可能托住生育率，与人口结构、银发经济、消费、住房深度联动。
        </p>
      </Card>

      <ModuleFooter moduleId="fertilitySupport" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
