import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';

// ============================================================================
// 全国统一大市场 · 破除地方保护与市场分割 —— 制度型开放的内部底座
// asOf 2026-06-11 · 公开资料示意，非官方统计
// ============================================================================

const AS_OF = '2026-06-11';

// 市场分割指数（示意，越高分割越严重）
const fragOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2012', '2015', '2018', '2021', '2024', '2025E']),
  yAxis: valueY({ name: '指数', min: 0.5, max: 1.0 }),
  series: [{
    type: 'line', smooth: true, data: [0.92, 0.86, 0.80, 0.78, 0.72, 0.68],
    lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.1)' },
    markLine: { silent: true, data: [{ yAxis: 0.6, label: { formatter: '统一市场目标', color: '#93a1b5' }, lineStyle: { color: '#10b981', type: 'dashed' } }] },
  }],
};

// 要素流动壁垒（示意，分值越高壁垒越高）
const barrierOpt = {
  grid: { left: 72, right: 24, top: 16, bottom: 24 }, tooltip: { trigger: 'axis' },
  xAxis: valueY({ max: 100, name: '壁垒指数' }),
  yAxis: categoryX(['劳动力(户籍)', '土地', '资本', '数据', '技术', '能源']),
  series: [{
    type: 'bar', barWidth: 14,
    data: [78, 72, 45, 68, 52, 58],
    itemStyle: { color: (p) => ['#c41e3a', '#e8a317', '#10b981', '#8b5cf6', '#22d3ee', '#fb923c'][p.dataIndex] },
    label: { show: true, position: 'right', color: '#93a1b5' },
  }],
};

// 选择器联动雷达维度（示意评分 0—100，分越高越接近「统一」）
const DIMS = ['推进力度', '壁垒拆除', '制度完备', '执行到位', '利益相容'];

const PILLARS = [
  {
    key: 'property', label: '产权统一', accent: '#c41e3a',
    scores: [70, 55, 65, 50, 48],
    thesis: '统一的产权保护与市场准入是大市场的法理地基——以全国一张「负面清单」消除隐性壁垒，让不同所有制、不同地域主体同台竞争。',
    measures: ['市场准入负面清单全国统一，破除「玻璃门/弹簧门」', '产权保护司法标准统一，民营/外资平等保护', '清理招投标/政府采购中的地域歧视性条款'],
    blocker: '地方以「备案」「资质」「目录」等隐性手段变相设限，执行端识别难、纠偏滞后。',
  },
  {
    key: 'facility', label: '设施统一', accent: '#22d3ee',
    scores: [75, 70, 72, 60, 65],
    thesis: '物流、信息、能源等基础设施互联互通，是商品要素跨域流动的物理前提——降低制度性交易成本与「最后一公里」的地方割据。',
    measures: ['国家物流枢纽网络、多式联运标准统一', '统一电子证照、信用信息、电力交易平台', '现代流通体系降本（社会物流总费用/GDP 下行）'],
    blocker: '跨省结算、数据互认、收费公路等存在路径依赖与地方利益固化。',
  },
  {
    key: 'factor', label: '要素统一', accent: '#10b981',
    scores: [62, 42, 55, 40, 35],
    thesis: '土地、劳动力、资本、技术、数据五大要素的城乡/区域自由流动，是统一大市场的核心——也是与城乡矛盾、央地矛盾交汇最深的领域。',
    measures: ['户籍制度改革，公共服务随人走（市民化）', '城乡统一建设用地市场，集体经营性建设用地入市', '全国性技术/数据交易市场培育，数据基础制度落地'],
    blocker: '户籍与土地是地方财政与治理的命脉，要素市场化触动深层利益分配。',
  },
  {
    key: 'regulation', label: '监管统一', accent: '#e8a317',
    scores: [68, 58, 70, 55, 52],
    thesis: '统一的市场监管规则与执法标准，避免「逐底竞争」与监管套利——监管一致性本身就是营商环境的公共品。',
    measures: ['统一质量、标准、计量、认证认可体系', '跨区域监管协同、信用联合奖惩', '清理废除妨碍统一市场的政策措施（公平竞争审查）'],
    blocker: '地方监管尺度差异源于考核激励，「一刀切」与「宽松洼地」并存。',
  },
  {
    key: 'competition', label: '竞争统一', accent: '#8b5cf6',
    scores: [72, 50, 60, 45, 38],
    thesis: '强化反垄断与反不正当竞争、规范地方招商引资的财税优惠，是大市场的「秩序之手」——防止以补贴战割裂全国市场。',
    measures: ['公平竞争审查制度刚性化，清理违规财税优惠/补贴', '反垄断常态化（平台/原料药/公用事业）', '规范地方政府招商引资行为，遏制「内卷式」竞争'],
    blocker: '招商优惠是地方增长工具，清理触及 GDP 锦标赛的考核根基。',
  },
];

export default function Page() {
  const [pillar, setPillar] = useState('factor');
  const p = PILLARS.find((x) => x.key === pillar) ?? PILLARS[0];

  return (
    <div>
      <PageHeader
        badge="十五五 · 现代化经济体系"
        title="全国统一大市场 · 破除分割与地方保护"
        subtitle="五个统一 · 央地利益再平衡 · 要素到规则深化"
      />

      <IntroCard>
        全国统一大市场指在全国范围内建立<strong style={{ color: 'var(--text-primary)' }}>统一的产权制度、市场设施、要素市场、监管规则与竞争秩序</strong>。
        其要害是破除<strong style={{ color: 'var(--text-primary)' }}>地方保护与市场分割</strong>——这本质上是一场<strong style={{ color: 'var(--text-primary)' }}>央地之间的再集权博弈</strong>：
        中央以统一规则收回被地方锦标赛切碎的市场，换取规模效率与制度型开放的内部底盘。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="5个统一" label="制度框架支柱" accent="#c41e3a" />
        <Stat value="14亿" label="超大规模市场" accent="#22d3ee" />
        <Stat value="公平竞争审查" label="刚性化抓手" accent="#10b981" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="国内市场分割指数 · 趋势（示意）"><EChart option={fragOpt} style={{ height: 240 }} /></Card>
        <Card title="五大要素流动壁垒 · 对照（示意）"><EChart option={barrierOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="交互 · 五个统一选择器" className="mb-4">
        <SelectorBar
          items={PILLARS.map((x) => ({ key: x.key, label: x.label, accent: x.accent }))}
          activeKey={pillar}
          onSelect={setPillar}
        />
      </Card>

      <div className="os-card p-5 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${p.accent}` }}>
        <div className="text-[10px] mono uppercase mb-2" style={{ color: p.accent }}>支柱论点</div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{p.thesis}</p>
        <div className="text-xs font-semibold mb-2" style={{ color: p.accent }}>关键举措</div>
        <ul className="space-y-1.5 mb-3">
          {p.measures.map((m) => (
            <li key={m} className="text-[11px] leading-relaxed flex gap-2" style={{ color: 'var(--text-tertiary)' }}>
              <span style={{ color: p.accent }}>·</span><span>{m}</span>
            </li>
          ))}
        </ul>
        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span style={{ color: '#c41e3a' }}>梗阻 · </span>{p.blocker}
        </div>
      </div>

      <Grid cols={2} className="mb-6">
        <Card title={`${p.label} · 统一进度五维评估（示意）`}>
          <EChart option={radarOpt(DIMS, p.scores, { name: p.label, color: p.accent })} style={{ height: 260 }} />
        </Card>
        <Card title="与制度型开放的耦合">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            统一大市场是<strong style={{ color: 'var(--text-primary)' }}>「以内促外」</strong>的关键：内部规则统一、与国际高标准经贸规则（CPTPP/DEPA）对接，
            才能把超大规模市场转化为<strong style={{ color: 'var(--text-primary)' }}>规则话语权</strong>与全球资源配置能力。
          </p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>对内</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>破除分割→降低制度性交易成本→规模效率。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>对外</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>规则统一→对接国际高标准→制度型开放。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>市场分割指数持续下行（趋于 0.6 目标）；社会物流总费用/GDP 下降；负面清单、公平竞争审查覆盖增量政策全口径。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>地方保护根植于财政命脉与 GDP 锦标赛考核；户籍、土地、招商优惠触动深层利益分配，隐性壁垒识别纠偏滞后。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>商品市场统一 → 要素市场（土地/劳动力/数据）城乡区域流动 → 监管与竞争规则全国一致并对接国际高标准。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '规则收权', body: '统一大市场是中央对市场规则制定权的再集中——把被地方锦标赛切碎的统一市场重新「官营」，以规则垄断换规模红利。', pillars: [['命脉', '规则制定权。'], ['切割', '地方保护壁垒。'], ['收回', '公平竞争审查。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '清理纠偏', body: '以公平竞争审查、妨碍统一市场政策清理为抓手，先立后破、边试边改，逐步识别并拆除隐性壁垒。', pillars: [['审查', '增量把关。'], ['清理', '存量纠偏。'], ['迭代', '负面清单。']] },
        { key: 'path', title: '升级路径', subtitle: '要素到规则', body: '从商品市场统一，向要素市场（土地/劳动力/数据）统一深化，最终落到监管与竞争规则的全国一致与国际对接。', pillars: [['商品', '流通设施。'], ['要素', '城乡流动。'], ['规则', '国际对接。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          全国统一大市场的难点不在「建设」而在「破除」——破除地方保护必然触动<strong style={{ color: 'var(--text-primary)' }}>地方财政命脉与 GDP 锦标赛的考核根基</strong>。
          它与央地矛盾、城乡要素流动、区域协调高度交织，是一场需要重塑激励相容的<strong style={{ color: 'var(--text-primary)' }}>长期制度工程</strong>，进度取决于央地利益再平衡的节奏。
        </p>
      </Card>

      <ModuleFooter moduleId="unifiedMarket" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
