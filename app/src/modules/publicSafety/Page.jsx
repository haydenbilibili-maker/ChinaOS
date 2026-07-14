import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt } from '../shared/chartHelpers.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// ============================================================================
// 平急两用 · 公共安全 —— 防灾减灾救灾 + 平急两用基础设施
// asOf 2026-07-14 · 公开资料示意，非官方统计
// ============================================================================

const AS_OF = AS_OF_BASELINE;

// 自然灾害直接经济损失（亿元，示意）
const lossOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024', '2025E']),
  yAxis: valueY({ name: '亿元' }),
  series: [{
    type: 'line', smooth: true, data: [3270, 3701, 3340, 2386, 3454, 4011, 3600],
    lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.1)' },
    markPoint: { data: [{ type: 'max', name: '峰值' }], itemStyle: { color: '#c41e3a' } },
  }],
};

// 灾害类型损失结构（示意 %）
const typeOpt = donutOpt([
  { name: '洪涝/地质', value: 42, itemStyle: { color: '#22d3ee' } },
  { name: '台风', value: 18, itemStyle: { color: '#8b5cf6' } },
  { name: '干旱', value: 14, itemStyle: { color: '#e8a317' } },
  { name: '地震', value: 12, itemStyle: { color: '#c41e3a' } },
  { name: '低温冰冻/其他', value: 14, itemStyle: { color: '#10b981' } },
]);

// 选择器联动雷达维度（示意评分 0—100）
const DIMS = ['制度成熟', '投入强度', '响应能力', '社会协同', '可持续性'];

const TRACKS = [
  {
    key: 'dual', label: '平急两用设施', accent: '#22d3ee',
    scores: [55, 60, 50, 58, 65],
    thesis: '平急两用是核心新提法——基础设施平时正常运营（旅游/康养/物流/会展），急时快速转换为隔离、救治、安置、保供空间，把冗余成本「商业化摊薄」。',
    points: ['平急两用旅居设施、医疗应急设施', '城市大型场馆「平急转换」预案', '应急物资储备与保供通道双用'],
    note: '化解「平时闲置 vs 急时不足」的两难，关键在转换预案与产权/运营机制。',
  },
  {
    key: 'disaster', label: '防灾减灾', accent: '#c41e3a',
    scores: [70, 68, 62, 55, 60],
    thesis: '从「重救轻防」转向「关口前移」——以监测预警、风险普查、工程防御降低灾害暴露度，减少人员伤亡与经济损失。',
    points: ['全国自然灾害综合风险普查成果应用', '气象/地质/洪涝监测预警一张网', '城市内涝、地质灾害工程治理'],
    note: '极端天气常态化抬升尾部风险，防御标准与气候变化赛跑。',
  },
  {
    key: 'emergency', label: '应急体系', accent: '#e8a317',
    scores: [72, 75, 78, 60, 62],
    thesis: '构建统一指挥、专常兼备、反应灵敏的应急管理体系——国家综合性消防救援队伍 + 专业 + 社会力量协同响应。',
    points: ['国家综合性消防救援队伍正规化', '航空应急、重型工程救援能力建设', '应急预案演练与基层第一响应'],
    note: '跨部门、跨区域协同与「最后一公里」响应仍是短板。',
  },
  {
    key: 'production', label: '安全生产/城市', accent: '#10b981',
    scores: [65, 58, 60, 52, 55],
    thesis: '安全生产与城市运行安全是基本盘——危化品、矿山、燃气、消防、自建房等重点领域的隐患排查与韧性城市建设。',
    points: ['危化品/矿山/燃气安全专项整治', '城市生命线工程安全监测', '韧性城市与地下管网更新'],
    note: '城镇化存量风险（老旧管网/自建房）累积，治理依赖持续投入。',
  },
];

export default function Page() {
  const [track, setTrack] = useState('dual');
  const t = TRACKS.find((x) => x.key === track) ?? TRACKS[0];

  return (
    <div>
      <PageHeader
        badge="十五五 · 统筹发展与安全"
        title="平急两用 · 公共安全体系"
        subtitle="大安全底盘 · 冗余成本困境 · 重救到重防前移"
      />

      <IntroCard>
        公共安全体系以<strong style={{ color: 'var(--text-primary)' }}>「人民至上、生命至上」</strong>为底线，统筹防灾减灾救灾、安全生产与城市运行安全。
        其中<strong style={{ color: 'var(--text-primary)' }}>「平急两用」</strong>是十五五关键提法——让基础设施平时商业运营、急时应急转换，
        以<strong style={{ color: 'var(--text-primary)' }}>「冗余的商业化」</strong>破解应急能力「平时闲置、急时不足」的成本困境，是大安全观在城市层面的物理落地。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="平急两用" label="冗余商业化范式" accent="#22d3ee" />
        <Stat value="关口前移" label="防大于救" accent="#c41e3a" />
        <Stat value="风险普查" label="全国一张底图" accent="#e8a317" />
        <Stat value={AS_OF} label="数据截至" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="自然灾害直接经济损失 · 亿元（示意）"><EChart option={lossOpt} style={{ height: 240 }} /></Card>
        <Card title="灾害类型损失结构（示意）"><EChart option={typeOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="交互 · 公共安全板块选择器" className="mb-4">
        <SelectorBar
          items={TRACKS.map((x) => ({ key: x.key, label: x.label, accent: x.accent }))}
          activeKey={track}
          onSelect={setTrack}
        />
      </Card>

      <div className="os-card p-5 mb-6" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
        <div className="text-[10px] mono uppercase mb-2" style={{ color: t.accent }}>板块论点</div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.thesis}</p>
        <Grid cols={3} className="mb-3">
          {t.points.map((pt) => (
            <div key={pt} style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 10 }}>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
            </div>
          ))}
        </Grid>
        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span style={{ color: '#e8a317' }}>要点 · </span>{t.note}
        </div>
      </div>

      <Grid cols={2} className="mb-6">
        <Card title={`${t.label} · 板块五维评估（示意）`}>
          <EChart option={radarOpt(DIMS, t.scores, { name: t.label, color: t.accent })} style={{ height: 260 }} />
        </Card>
        <Card title="平急两用的成本逻辑">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            纯应急设施的本质矛盾是<strong style={{ color: 'var(--text-primary)' }}>「养兵千日」的高冗余成本</strong>——平时闲置即沉没成本。
            平急两用通过<strong style={{ color: 'var(--text-primary)' }}>「一设施两用途」</strong>把冗余转化为可经营资产，急时再快速征用转换。
          </p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>纯应急</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>高冗余、低利用率，财政持续负担。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>平急两用</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>商业运营摊薄成本，预案保障急时转换。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>平急两用基础设施布点、城市生命线安全监测覆盖、风险普查成果应用、综合消防救援与航空应急能力提升。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>「为低概率高损失事件付费」的成本难题；纯应急设施高冗余沉没成本；极端天气常态化抬升尾部风险。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>风险普查一张底图 → 平急两用把冗余嵌入日常经济循环 → 监测预警关口前移、韧性城市生命线工程升级。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '安全命脉', body: '公共安全是国家提供的最基本公共品——救援力量、战略物资储备是国家垄断的「盐铁」底盘，不容市场失灵。', pillars: [['底线', '生命至上。'], ['储备', '战略物资。'], ['垄断', '国家救援队。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '平急试点', body: '平急两用基础设施试点、韧性城市试点、风险普查——以局部探索冗余商业化与转换机制。', pillars: [['试点', '平急两用。'], ['普查', '风险底图。'], ['迭代', '韧性城市。']] },
        { key: 'path', title: '升级路径', subtitle: '重救到重防', body: '从「重救灾、轻防灾」转向「关口前移、防救并重」——以平急两用降低冗余成本，以监测预警降低灾害暴露。', pillars: [['前移', '监测预警。'], ['冗余', '平急两用。'], ['韧性', '城市生命线。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          公共安全的核心是<strong style={{ color: 'var(--text-primary)' }}>「为低概率高损失事件付费」</strong>的成本难题。
          平急两用是一种<strong style={{ color: 'var(--text-primary)' }}>制度创新</strong>——把应急冗余嵌入日常经济循环，降低「养兵」成本；
          但其成败取决于转换预案的真实可执行性与产权运营机制，需与大安全观、新型城镇化、超级工程协同推进。
        </p>
      </Card>

      <ModuleFooter moduleId="publicSafety" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
