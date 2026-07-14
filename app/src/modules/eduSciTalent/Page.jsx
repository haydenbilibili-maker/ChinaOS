import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, LEGEND, radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// ============================================================================
// 教育科技人才一体化 · 三位一体 —— 教育链/创新链/人才链协同
// asOf 2026-07-14 · 公开资料示意，非官方统计
// ============================================================================

const AS_OF = AS_OF_BASELINE;

// 三大投入趋势（示意）
const inputOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  legend: { ...LEGEND, top: 0, data: ['R&D投入(万亿)', '教育经费/GDP(%)', 'R&D人员(百万人年)'] },
  xAxis: categoryX(['2015', '2018', '2021', '2024', '2025E']),
  yAxis: valueY({ name: '' }),
  series: [
    { name: 'R&D投入(万亿)', type: 'bar', barWidth: 18, data: [1.42, 1.97, 2.79, 3.61, 3.95], itemStyle: { color: '#22d3ee' } },
    { name: '教育经费/GDP(%)', type: 'line', smooth: true, data: [4.0, 4.1, 4.0, 4.0, 4.1], lineStyle: { color: '#e8a317', width: 2 } },
    { name: 'R&D人员(百万人年)', type: 'line', smooth: true, data: [3.8, 4.4, 5.6, 6.4, 6.8], lineStyle: { color: '#10b981', width: 2 } },
  ],
};

// 创新产出（示意）
const outputOpt = {
  grid: { left: 56, right: 24, top: 16, bottom: 24 }, tooltip: { trigger: 'axis' },
  xAxis: categoryX(['高被引论文', 'PCT专利', '高企数量', 'STEM毕业生']),
  yAxis: valueY({ max: 100, name: '全球位势' }),
  series: [{
    type: 'bar', barWidth: 26,
    data: [
      { value: 85, itemStyle: { color: '#22d3ee' } },
      { value: 78, itemStyle: { color: '#10b981' } },
      { value: 72, itemStyle: { color: '#e8a317' } },
      { value: 92, itemStyle: { color: '#c41e3a' } },
    ],
    label: { show: true, position: 'top', color: LABEL.color },
  }],
};

// 选择器联动雷达维度（示意评分 0—100）
const DIMS = ['投入规模', '产出质量', '体制协同', '国际位势', '转化效率'];

const CHAINS = [
  {
    key: 'edu', label: '教育链', accent: '#22d3ee',
    scores: [78, 65, 58, 62, 55],
    thesis: '教育是基础工程——从基础教育公平到高等教育「双一流」，再到职业教育产教融合，为创新与人才提供源头供给。',
    points: ['分类推进高校改革，建设世界一流大学与学科', '学科专业动态调整，对接战略需求与未来产业', '职普融通、产教融合培养卓越工程师'],
    gap: '基础学科拔尖人才与应用型技能人才「两端」供给不足，学用脱节。',
  },
  {
    key: 'sci', label: '创新链(科技)', accent: '#c41e3a',
    scores: [82, 70, 55, 75, 48],
    thesis: '科技是核心动力——以国家战略科技力量为骨干，强化原始创新与关键核心技术攻关，把论文与专利转化为现实生产力。',
    points: ['国家实验室 + 高校 + 院所 + 科技领军企业协同', '基础研究投入占比提升（向 8%+ 迈进）', '科技成果转化与「评价指挥棒」改革'],
    gap: '原始创新与「从0到1」短板；成果转化「死亡之谷」尚未跨越。',
  },
  {
    key: 'talent', label: '人才链', accent: '#10b981',
    scores: [72, 62, 52, 58, 50],
    thesis: '人才是第一资源——构建战略人才力量梯队（战略科学家、领军人才、青年人才、卓越工程师、技能人才），并以制度留人用人。',
    points: ['一体推进引育用留，破除「四唯」', '青年人才挑大梁、当主角的机制', '海外高层次人才引进与全球竞争'],
    gap: '顶尖人才外流与「卡脖子」领域人才缺口；激励与评价机制行政化。',
  },
];

export default function Page() {
  const [chain, setChain] = useState('sci');
  const c = CHAINS.find((x) => x.key === chain) ?? CHAINS[0];

  return (
    <div>
      <PageHeader
        badge="十五五 · 教育科技人才一体化"
        title="教育科技人才一体化 · 三链协同"
        subtitle="三链统筹布局 · 条块分割梗阻 · 分割到一体集成"
      />

      <IntroCard>
        「教育、科技、人才一体化」是把原本分属不同部门的<strong style={{ color: 'var(--text-primary)' }}>教育链、创新链、人才链</strong>统筹为一个系统工程的新提法。
        其要害在于打破<strong style={{ color: 'var(--text-primary)' }}>「条块分割、各自为政」</strong>：教育供给源头、科技攻关主战场、人才支撑底座三者闭环联动，
        共同服务于<strong style={{ color: 'var(--text-primary)' }}>高水平科技自立自强</strong>。这是一次治理结构上的「再集成」。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~3.95万亿" label="R&D 投入" accent="#22d3ee" />
        <Stat value="~4%" label="教育经费/GDP" accent="#e8a317" />
        <Stat value="~6.8M" label="R&D 人员(人年)" accent="#10b981" />
        <Stat value={AS_OF} label="数据截至" accent="#c41e3a" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="教育/科技/人才三大投入趋势（示意）"><EChart option={inputOpt} style={{ height: 240 }} /></Card>
        <Card title="创新产出全球位势（示意）"><EChart option={outputOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="交互 · 三链选择器" className="mb-4">
        <SelectorBar
          items={CHAINS.map((x) => ({ key: x.key, label: x.label, accent: x.accent }))}
          activeKey={chain}
          onSelect={setChain}
        />
      </Card>

      <div className="os-card p-5 mb-6" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c.accent}` }}>
        <div className="text-[10px] mono uppercase mb-2" style={{ color: c.accent }}>链条论点</div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{c.thesis}</p>
        <Grid cols={3} className="mb-3">
          {c.points.map((pt) => (
            <div key={pt} style={{ borderLeft: `2px solid ${c.accent}`, paddingLeft: 10 }}>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
            </div>
          ))}
        </Grid>
        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span style={{ color: '#c41e3a' }}>断点 · </span>{c.gap}
        </div>
      </div>

      <Grid cols={2} className="mb-6">
        <Card title={`${c.label} · 链条五维评估（示意）`}>
          <EChart option={radarOpt(DIMS, c.scores, { name: c.label, color: c.accent })} style={{ height: 260 }} />
        </Card>
        <Card title="一体化的治理逻辑">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            过去教育（教育部）、科技（科技部）、人才（组织/人社）分属不同条线，存在<strong style={{ color: 'var(--text-primary)' }}>目标错位与资源重复</strong>。
            一体化要求以<strong style={{ color: 'var(--text-primary)' }}>战略需求为牵引</strong>，倒逼学科设置、攻关方向与人才培养对齐。
          </p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>需求牵引</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>未来产业/卡脖子清单倒推学科与人才培养。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>评价改革</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>破「四唯」，以创新质量与贡献为导向。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>R&D 投入强度与基础研究占比（向 8%+）提升；高被引论文、PCT 专利、STEM 毕业生位势抬升；战略人才梯队成形。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>教育/科技/人才条块分割、目标错位与资源重复；「钱变知识」（原始创新）与「知识变钱」（成果转化）两环效率不足。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>以战略需求牵引倒推学科与人才培养 → 破「四唯」评价改革 → 教育—科技—人才闭环联动支撑高水平科技自立自强。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '战略科技力量', body: '国家战略科技力量是创新体系的「盐铁」骨干——国家实验室、新型举国体制把最关键的攻关方向纳入国家直接统筹。', pillars: [['骨干', '国家实验室。'], ['统筹', '举国体制。'], ['卡位', '自立自强。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '评价改革', body: '科技评价改革、教育评价改革、人才分类评价——以试点破除「四唯」，灰度探索创新友好的激励机制。', pillars: [['试点', '评价改革。'], ['破除', '四唯指挥棒。'], ['迭代', '分类激励。']] },
        { key: 'path', title: '升级路径', subtitle: '分割到一体', body: '从条块分割的部门治理，转向以战略需求牵引的教育—科技—人才闭环，支撑高水平科技自立自强。', pillars: [['分割', '条块各自为政。'], ['集成', '三链联动。'], ['目标', '自立自强。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          教育科技人才一体化的真正难点是<strong style={{ color: 'var(--text-primary)' }}>跨部门协同与评价指挥棒</strong>——投入规模已居世界前列，但「钱变知识」（原始创新）与「知识变钱」（成果转化）两个环节效率仍有差距。
          其成败取决于能否以<strong style={{ color: 'var(--text-primary)' }}>战略需求牵引</strong>真正打通三链，而非停留在文件层面的「物理拼装」，与未来产业、基础研究、创新体系一脉相承。
        </p>
      </Card>

      <ModuleFooter moduleId="eduSciTalent" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
