import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, stackedBarOpt, radarOpt, AXIS, LABEL, LEGEND } from '../shared/chartHelpers.js';

// ============================================================================
// 国防动员 · 后备力量 / 平战结合 / 新域新质动员
// asOf 2026-06-11 · 公开资料示意
// ============================================================================

const AS_OF = '2026-06-11';

const DOMAINS = [
  {
    key: 'reserve', label: '后备力量', accent: '#c41e3a',
    scores: [88, 82, 75, 70, 78],
    thesis: '预备役与民兵是国防动员的「蓄水池」——编组训练、装备预置与快速征召机制是平战转换的物理基础。',
    points: ['预备役部队编组与训练改革', '民兵应急分队与海上民兵建设', '退役军人纳入后备力量体系', '征兵「五率」与兵员质量提升'],
    lever: '国防部动员局 + 省军区系统。',
  },
  {
    key: 'civil', label: '经济动员', accent: '#e8a317',
    scores: [80, 85, 78, 82, 72],
    thesis: '国民经济动员是将民用产能快速转为军用供给的制度安排——战略物资储备、交通保障与工业转产是核心链条。',
    points: ['战略物资储备与轮换机制', '国防交通路网与战备公路', '军民两用技术标准统一', '关键产业链动员预案'],
    lever: '发改委国防动员办 + 交通战备系统。',
  },
  {
    key: 'newdomain', label: '新域新质', accent: '#22d3ee',
    scores: [75, 70, 92, 85, 80],
    thesis: '网络、太空、电磁、认知等新域新质作战力量需要新型动员模式——民营科技企业、算力设施与数据资源纳入动员潜力库。',
    points: ['网络攻防民兵与红队力量', '商业航天与低轨星座动员接口', '算力设施国防动员预案', '无人机/eVTOL 民用转军用通道'],
    lever: '军委联指 + 工信部动员潜力调查。',
  },
  {
    key: 'local', label: '地方动员', accent: '#10b981',
    scores: [82, 78, 70, 75, 85],
    thesis: '省域国防动员委员会是平战转换的「最后一公里」——人防工程、应急避难与双拥共建构成基层动员网络。',
    points: ['人民防空工程与平急两用设施', '国防动员潜力统计与数据库', '双拥模范城与拥军支前', '应急管理与国防动员预案衔接'],
    lever: '省级国动委 + 应急管理厅局协同。',
  },
];

const PHASES = [
  { period: '2016–2019', title: '改革重组', accent: '#64748b', desc: '深化国防和军队改革延伸动员体系，省军区系统调整，动员职能归口。' },
  { period: '2020–2023', title: '潜力调查', accent: '#e8a317', desc: '国民经济动员潜力调查与数据库建设，新域新质力量纳入动员体系。' },
  { period: '2024–', title: '平战结合', accent: '#c41e3a', desc: '政府工作报告强调「巩固提高一体化国家战略体系和能力」，平急两用设施与动员预案深化。' },
];

const DIMS = ['规模储备', '转换速度', '新域覆盖', '潜力质量', '预案完备'];

export default function Page() {
  const [domain, setDomain] = useState('newdomain');
  const [phaseIdx, setPhaseIdx] = useState(2);
  const d = DOMAINS.find((x) => x.key === domain) ?? DOMAINS[0];

  const reserveOpt = useMemo(() => ({
    grid: GRID, tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['预备役', '民兵'] },
    xAxis: categoryX(['2015', '2018', '2021', '2024', '2026E']),
    yAxis: valueY({ name: '万人' }),
    series: [
      { name: '预备役', type: 'bar', stack: 'r', barWidth: 22, data: [50, 48, 45, 42, 40], itemStyle: { color: '#c41e3a' } },
      { name: '民兵', type: 'bar', stack: 'r', data: [800, 750, 700, 680, 650], itemStyle: { color: AXIS.lineStyle.color } },
    ],
  }), []);

  const potentialOpt = stackedBarOpt({
    categories: ['工业', '交通', '通信', '能源', '新域新质'],
    series: [
      { name: '动员潜力指数', data: [85, 90, 78, 88, 65], itemStyle: { color: '#c41e3a' } },
      { name: '转化就绪度', data: [70, 82, 72, 80, 55], itemStyle: { color: '#22d3ee' } },
    ],
  });

  const readinessOpt = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['征召', '训练', '装备', '交通', '通信', '新域']),
    yAxis: valueY({ max: 100, name: '就绪度' }),
    series: [{
      type: 'bar', barWidth: 18,
      data: domain === 'reserve' ? [82, 78, 70, 75, 72, 60]
        : domain === 'civil' ? [70, 65, 75, 92, 80, 55]
        : domain === 'newdomain' ? [60, 68, 72, 65, 85, 88]
        : [78, 80, 72, 85, 75, 62],
      itemStyle: { color: d.accent, borderRadius: 3 },
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 9 },
    }],
  }), [domain, d]);

  return (
    <div>
      <PageHeader
        badge="政府工作报告 · 国防动员"
        title="国防动员 · 平战结合体系"
        subtitle="后备力量 · 经济动员 · 新域新质"
      />

      <IntroCard>
        国防动员是<strong style={{ color: 'var(--text-primary)' }}>平战转换的物理接口</strong>——将国民经济潜力、后备兵员与民用基础设施快速转化为作战能力。
        2024—2025 政府工作报告强调「巩固提高一体化国家战略体系和能力」，新域新质作战力量与民营科技动员潜力是动员体系现代化的主攻方向。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~690万" label="后备力量（示意）" accent="#c41e3a" />
        <Stat value="31" label="省级国动委" accent="#e8a317" />
        <Stat value="5大" label="动员潜力领域" accent="#22d3ee" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="后备力量规模演变（示意）"><EChart option={reserveOpt} style={{ height: 240 }} /></Card>
        <Card title="国民经济动员潜力 vs 转化就绪度"><EChart option={potentialOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="政策演进 · 时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Card title="交互 · 动员领域" className="mb-4">
        <SelectorBar items={DOMAINS} activeKey={domain} onSelect={setDomain} />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${d.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: d.accent }}>{d.label} · 动员论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{d.thesis}</p>
          <div className="space-y-2 mb-3">
            {d.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${d.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#e8a317' }}>政策杠杆 · </span>{d.lever}
          </div>
        </div>
        <Card title={`${d.label} · 动员五维评估`}>
          <EChart option={radarOpt(DIMS, d.scores, { name: d.label, color: d.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="平战转换就绪度分项（示意 · 随领域切换）" className="mb-6">
        <EChart option={readinessOpt} style={{ height: 220 }} />
      </Card>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>动员潜力数据库全覆盖；新域新质动员力量编组；平急两用设施与国防动员预案衔接；后备力量训练质量提升。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>平战转换速度与民用经济效率的权衡；动员潜力统计的精度与更新频率；新域新质力量的体制归属与指挥链条。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>潜力调查与数据库 → 预案演练与编组训练 → 新域新质力量纳入 → 平急两用设施标准化。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '平战储备', body: '国防动员是国家对民用资源与后备力量的战略储备与快速征召权——平时隐藏于国民经济之中，战时一键切换。', pillars: [['储备', '战略物资。'], ['征召', '后备兵员。'], ['切换', '平战转换。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '预案演练', body: '国防动员演练、潜力调查与编组训练——在和平时期灰度测试平战转换速度与瓶颈，迭代动员预案。', pillars: [['灰度', '动员演练。'], ['验证', '转换速度。'], ['迭代', '预案修订。']] },
        { key: 'path', title: '升级路径', subtitle: '传统到新域', body: '从传统后备力量与工业动员，扩展到网络、太空、算力、无人机等新域新质动员——一体化国家战略体系能力的物理延伸。', pillars: [['传统', '后备民兵。'], ['经济', '工业转产。'], ['新域', '算力网络。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          国防动员的本质是<strong style={{ color: 'var(--text-primary)' }}>国家战略能力的「弹性冗余」</strong>——平时嵌入国民经济，战时快速释放。
          新域新质作战力量与民营科技动员潜力是十五五动员体系现代化的关键增量，与军事力量、公共安全、算力设施模块形成互链。
        </p>
      </Card>

      <ModuleFooter moduleId="defenseMobilization" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
