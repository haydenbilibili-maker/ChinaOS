import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, LEGEND, stackedBarOpt, radarOpt } from '../shared/chartHelpers.js';

// ============================================================================
// 边疆治理 · 兴边富民 / 铸牢共同体 / 对口支援
// asOf 2026-06-11 · 公开资料示意
// ============================================================================

const AS_OF = '2026-06-11';

const REGIONS = [
  {
    key: 'xinjiang', label: '新疆', accent: '#c41e3a',
    scores: [88, 82, 75, 70, 65],
    thesis: '反恐维稳转入常态化治理，「八大产业集群」与中欧班列枢纽重塑内陆开放前沿——安全与发展是同一枚硬币的两面。',
    points: ['自贸试验区乌鲁木齐片区制度创新', '棉花、光伏、煤化工产业链集聚', '南疆就业与普通话推广工程', '口岸经济带与中亚互联互通'],
    lever: '对口援疆 + 中央财政转移支付 + 产业援疆项目库。',
  },
  {
    key: 'xizang', label: '西藏', accent: '#e8a317',
    scores: [85, 78, 72, 68, 80],
    thesis: '生态红线刚性约束下，清洁能源（水光风）与文旅康养是增长主通道——高原特色现代化路径不同于平原工业化模板。',
    points: ['雅江下游水电战略储备与绿电外送', '边境小康村与国防交通协同建设', '藏医药与特色农牧业品牌化', '格桑花行动人才援藏机制'],
    lever: '对口援藏 + 生态补偿转移支付 + 重大基建专项。',
  },
  {
    key: 'neimeng', label: '内蒙古', accent: '#22d3ee',
    scores: [75, 85, 80, 72, 70],
    thesis: '能源基地向绿电枢纽转型，向北开放（中蒙俄经济走廊）与生态屏障（三北防护林）双重定位——资源型省份的再工业化样本。',
    points: ['新能源装机全国前列，绿电制氢试点', '满洲里/二连浩特口岸贸易枢纽', '草畜平衡与草原生态补偿', '稀土与新材料战略资源管控'],
    lever: '能源革命政策 + 向北开放通道 + 生态转移支付。',
  },
  {
    key: 'guangxi', label: '桂滇黔', accent: '#10b981',
    scores: [70, 68, 82, 78, 75],
    thesis: '面向东盟的陆海新通道与跨境民族地区治理交织——兴边富民与民族团结进步示范区建设同步推进。',
    points: ['西部陆海新通道海铁联运', '边境贸易互市与跨境劳务', '少数民族特色村寨保护与开发', '滇桂黔石漠化片区连片振兴'],
    lever: '兴边富民行动 + RCEP 通道红利 + 乡村振兴衔接。',
  },
];

const PHASES = [
  { period: '2012–2017', title: '兴边富民', accent: '#64748b', desc: '边境基础设施与民生改善工程启动，「十三五」兴边富民行动规划落地。' },
  { period: '2018–2022', title: '精准支援', accent: '#e8a317', desc: '对口支援从「输血」转向产业与人才「造血」，脱贫攻坚与边疆稳定耦合。' },
  { period: '2023–', title: '共同体意识', accent: '#c41e3a', desc: '铸牢中华民族共同体意识写入法治与治理主线，边疆高质量发展纳入十五五布局。' },
];

const DIMS = ['安全韧性', '产业造血', '转移支付', '生态约束', '开放通道'];

export default function Page() {
  const [region, setRegion] = useState('xinjiang');
  const [phaseIdx, setPhaseIdx] = useState(2);
  const r = REGIONS.find((x) => x.key === region) ?? REGIONS[0];

  const transferOpt = useMemo(() => ({
    grid: GRID, tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['中央转移支付', '对口支援投入'] },
    xAxis: categoryX(['2018', '2020', '2022', '2024', '2026E']),
    yAxis: valueY({ name: '万亿元' }),
    series: [
      { name: '中央转移支付', type: 'bar', stack: 't', barWidth: 22, data: [6.2, 7.1, 7.8, 8.4, 9.0], itemStyle: { color: '#c41e3a' } },
      { name: '对口支援投入', type: 'bar', stack: 't', data: [0.16, 0.18, 0.20, 0.22, 0.24], itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  const borderTradeOpt = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['满洲里', '霍尔果斯', '瑞丽', '东兴', '阿拉山口']),
    yAxis: valueY({ name: '亿元' }),
    series: [{
      type: 'bar', barWidth: 20,
      data: region === 'xinjiang' ? [120, 1850, 680, 420, 2100]
        : region === 'xizang' ? [80, 45, 320, 180, 60]
        : region === 'neimeng' ? [2100, 120, 90, 70, 180]
        : [150, 95, 920, 1100, 85],
      itemStyle: { color: r.accent, borderRadius: 3 },
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 9 },
    }],
  }), [region, r]);

  const ethnicShareOpt = stackedBarOpt({
    categories: ['2010', '2015', '2020', '2025E'],
    series: [
      { name: '边疆九省区 GDP 占比', data: [8.5, 9.2, 9.8, 10.5], itemStyle: { color: '#22d3ee' } },
      { name: '全国其余地区', data: [91.5, 90.8, 90.2, 89.5], itemStyle: { color: AXIS.lineStyle.color } },
    ],
  });

  return (
    <div>
      <PageHeader
        badge="政府工作报告 · 边疆民族"
        title="边疆治理 · 兴边富民与共同体"
        subtitle="对口支援 · 转移支付 · 开放通道"
      />

      <IntroCard>
        边疆九省区占国土面积过半、战略通道与资源禀赋高度集中，治理逻辑是<strong style={{ color: 'var(--text-primary)' }}>安全底线 × 发展造血 × 生态红线</strong>的三重约束。
        2024—2025 政府工作报告强调铸牢中华民族共同体意识、兴边富民行动与边疆产业振兴——财政转移支付与对口支援是「输血」，口岸经济与特色产业是「造血」。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~56%" label="国土面积占比" accent="#c41e3a" />
        <Stat value="~10%" label="GDP 贡献（边疆九省区）" accent="#22d3ee" />
        <Stat value="22对" label="对口支援省市" accent="#e8a317" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="中央转移支付与对口支援（示意）"><EChart option={transferOpt} style={{ height: 240 }} /></Card>
        <Card title="边疆九省区经济份额演变"><EChart option={ethnicShareOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="政策演进 · 时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Card title="交互 · 重点边疆板块" className="mb-4">
        <SelectorBar items={REGIONS} activeKey={region} onSelect={setRegion} />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${r.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: r.accent }}>{r.label} · 治理论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{r.thesis}</p>
          <div className="space-y-2 mb-3">
            {r.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${r.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#e8a317' }}>政策杠杆 · </span>{r.lever}
          </div>
        </div>
        <Card title={`${r.label} · 治理五维评估`}>
          <EChart option={radarOpt(DIMS, r.scores, { name: r.label, color: r.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="重点口岸贸易流量（示意 · 随板块切换）" className="mb-6">
        <EChart option={borderTradeOpt} style={{ height: 220 }} />
      </Card>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>边疆地区 GDP 增速高于全国平均、居民收入与全国差距收窄；口岸贸易额与特色产业产值持续抬升。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>生态红线与国土安全刚性约束；人才流失与产业空心化；对口支援「输血」依赖与可持续造血能力不足。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>兴边富民行动 2.0 → 特色产业与口岸经济 → 人才回流与数字化治理 → 铸牢共同体意识的制度化嵌入。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '边疆控盘', body: '边疆是国土安全的物理底线与资源通道的战略阀门——中央财政转移支付与对口支援是维持边疆秩序与发展的「盐铁专营」式制度安排。', pillars: [['安全', '国土底线。'], ['输血', '转移支付。'], ['控盘', '对口支援。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '试点先行', body: '自贸试验区、边境经济合作区、兴边富民试点县——在边疆灰度试验开放政策与产业引进，评估安全与发展平衡点。', pillars: [['灰度', '自贸试点。'], ['评估', '安全平衡。'], ['推广', '经验复制。']] },
        { key: 'path', title: '升级路径', subtitle: '输血到造血', body: '从财政输血与基建补短板，转向特色产业、口岸经济与人才回流——边疆高质量发展不能简单复制东部工业化模板。', pillars: [['输血', '基建民生。'], ['造血', '特色产业。'], ['可持续', '人才回流。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          边疆治理的底层代码是<strong style={{ color: 'var(--text-primary)' }}>安全与发展的一体两面</strong>——没有稳定的边疆就没有内陆发展的战略纵深，没有产业造血则转移支付不可持续。
          十五五的关键是从「输血」转向「造血」，以口岸经济、清洁能源与特色文旅打开增长空间，同时以铸牢共同体意识固化制度认同。
        </p>
      </Card>

      <ModuleFooter moduleId="frontierGov" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
