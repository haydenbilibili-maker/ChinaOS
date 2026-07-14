import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, LEGEND, donutOpt, radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// ============================================================================
// 银发经济 · 养老服务体系 —— 把老龄化压力转化为产业增量
// asOf 2026-07-14 · 公开资料示意，非官方统计
// 与 demographic（人口结构）区分：本模块聚焦产业/服务供给侧。
// ============================================================================

const AS_OF = AS_OF_BASELINE;

// 60岁以上人口规模与占比（示意）
const popOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  legend: { ...LEGEND, top: 0, data: ['60+ 人口(亿)', '占总人口(%)'] },
  xAxis: categoryX(['2020', '2025E', '2030E', '2035E', '2040E']),
  yAxis: [
    valueY({ name: '亿人', max: 5 }),
    valueY({ name: '%', max: 40, position: 'right', splitLine: { show: false } }),
  ],
  series: [
    { name: '60+ 人口(亿)', type: 'bar', barWidth: 24, data: [2.64, 3.10, 3.70, 4.20, 4.55], itemStyle: { color: '#8b5cf6', borderRadius: [3, 3, 0, 0] } },
    { name: '占总人口(%)', type: 'line', yAxisIndex: 1, smooth: true, data: [18.7, 22.0, 26.5, 30.5, 33.2], lineStyle: { color: '#c41e3a', width: 2 } },
  ],
};

// 银发经济规模预测（万亿元，示意）
const marketOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2023', '2025E', '2030E', '2035E']),
  yAxis: valueY({ name: '万亿元' }),
  series: [{
    type: 'bar', barWidth: 30, data: [7, 12, 22, 30],
    itemStyle: { color: '#10b981', borderRadius: [3, 3, 0, 0] },
    label: { show: true, position: 'top', color: LABEL.color, formatter: '{c}' },
  }],
};

// 养老模式结构 9073（示意）
const modeOpt = donutOpt([
  { name: '居家养老 ~90%', value: 90, itemStyle: { color: '#22d3ee' } },
  { name: '社区养老 ~7%', value: 7, itemStyle: { color: '#e8a317' } },
  { name: '机构养老 ~3%', value: 3, itemStyle: { color: '#c41e3a' } },
]);

// 选择器联动雷达维度（示意评分 0—100）
const DIMS = ['市场规模', '需求刚性', '供给成熟', '支付能力', '政策支持'];

const TRACKS = [
  {
    key: 'homecare', label: '居家社区养老', accent: '#22d3ee',
    scores: [85, 88, 52, 50, 78],
    thesis: '「9073」格局下居家社区是绝对主体——发展嵌入式社区养老、家庭养老床位、助餐助浴助医，是养老服务体系的基本盘。',
    points: ['社区嵌入式养老机构、长者食堂扩面', '家庭养老床位、适老化改造补贴', '居家上门照护与喘息服务'],
    pain: '失能半失能照护人力短缺，护理员缺口大、流失率高；普惠与可持续的成本平衡难。',
  },
  {
    key: 'institution', label: '机构养老', accent: '#c41e3a',
    scores: [45, 75, 48, 42, 70],
    thesis: '机构养老承接刚需失能群体，但床位结构性错配——空置与一床难求并存，公办兜底与民办高端两极分化。',
    points: ['公办养老机构兜底特困/失能老人', '医养结合机构、护理型床位扩容', '社会资本进入中高端康养'],
    pain: '护理型床位不足、运营盈利难；医保与长护险衔接不畅。',
  },
  {
    key: 'aging', label: '适老化/老年用品', accent: '#e8a317',
    scores: [62, 58, 60, 48, 55],
    thesis: '适老化改造与老年用品是制造业的银发增量——辅具、康复器械、智能监护、适老家电，对接新质生产力与消费升级。',
    points: ['居家适老化改造（防跌倒/无障碍）', '智能穿戴、跌倒监测、健康管理设备', '康复辅具与老年代步工具产业化'],
    pain: '标准缺失、支付能力分层，市场教育成本高。',
  },
  {
    key: 'health', label: '康养文旅/金融', accent: '#10b981',
    scores: [58, 50, 45, 55, 48],
    thesis: '康养文旅、旅居养老与养老金融是消费侧延伸——把健康老人的时间与储蓄转化为服务消费与第三支柱。',
    points: ['旅居养老、康养小镇、候鸟式养老', '个人养老金、商业养老保险第三支柱', '老年教育、老年大学、银发文娱'],
    pain: '养老金融渗透率低，旅居供给同质化、季节性强。',
  },
];

export default function Page() {
  const [track, setTrack] = useState('homecare');
  const t = TRACKS.find((x) => x.key === track) ?? TRACKS[0];

  return (
    <div>
      <PageHeader
        badge="十五五 · 积极应对老龄化"
        title="银发经济 · 养老服务体系"
        subtitle="9073 养老格局 · 未富先老约束 · 服务到产业升级"
      />

      <IntroCard>
        银发经济是面向老年群体及为老龄阶段做准备的<strong style={{ color: 'var(--text-primary)' }}>经济活动总和</strong>。
        中国 60 岁以上人口已超 3 亿并加速攀升，养老从「负担叙事」转向<strong style={{ color: 'var(--text-primary)' }}>「产业机遇」</strong>：
        既要补居家社区照护的民生短板，也要发展适老制造、康养文旅与养老金融的增量市场。
        本模块聚焦<strong style={{ color: 'var(--text-primary)' }}>供给侧产业与服务体系</strong>（与人口结构模块的需求侧分析互补）。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="3.1亿+" label="60岁以上人口" accent="#8b5cf6" />
        <Stat value="~12万亿" label="2025E 银发经济规模" accent="#10b981" />
        <Stat value="9073" label="居家/社区/机构格局" accent="#22d3ee" />
        <Stat value={AS_OF} label="数据截至" accent="#c41e3a" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="60岁以上人口规模与占比（示意）"><EChart option={popOpt} style={{ height: 240 }} /></Card>
        <Card title="银发经济规模预测 · 万亿元（示意）"><EChart option={marketOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="养老模式结构 · 9073（示意）"><EChart option={modeOpt} style={{ height: 240 }} /></Card>
        <Card title="养老服务体系成熟度 · 雷达（示意）">
          <EChart option={radarOpt(
            ['居家照护', '社区嵌入', '机构护理', '医养结合', '长护险', '适老制造'],
            [58, 52, 48, 55, 42, 60], { name: '成熟度', color: '#8b5cf6' },
          )} style={{ height: 240 }} />
        </Card>
      </Grid>

      <Card title="交互 · 银发子赛道选择器" className="mb-4">
        <SelectorBar
          items={TRACKS.map((x) => ({ key: x.key, label: x.label, accent: x.accent }))}
          activeKey={track}
          onSelect={setTrack}
        />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: t.accent }}>赛道论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.thesis}</p>
          <div className="space-y-2 mb-3">
            {t.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#c41e3a' }}>痛点 · </span>{t.pain}
          </div>
        </div>
        <Card title={`${t.label} · 子赛道五维评估（示意）`}>
          <EChart option={radarOpt(DIMS, t.scores, { name: t.label, color: t.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>银发经济规模 2030E 约 22 万亿、2035E 约 30 万亿；护理型床位占比、社区嵌入式与家庭养老床位、长护险参保覆盖抬升。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>「未富先老」——支付能力滞后于照护需求爆发；护理人力短缺、流失率高，普惠与可持续的成本平衡难。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>居家社区补短板与适老化改造 → 长护险全国落地、医养结合 → 适老制造与养老金第三支柱打通完整产业链。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '兜底与市场', body: '养老是代际契约的公共品底盘——政府兜底特困失能，市场供给品质需求。基本养老服务清单是国家保留的「盐铁」底线。', pillars: [['兜底', '基本服务清单。'], ['市场', '品质供给。'], ['契约', '长护险。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '长护险试点', body: '长期护理保险试点扩面、家庭养老床位、医养结合——以局部试点探索可持续的筹资与照护模式。', pillars: [['试点', '长护险。'], ['灰度', '家庭床位。'], ['迭代', '医养结合。']] },
        { key: 'path', title: '升级路径', subtitle: '负担到产业', body: '从「养老负担」叙事转向「银发产业」增量——把照护刚需、适老制造与康养消费打通为完整产业链。', pillars: [['服务', '照护体系。'], ['制造', '适老用品。'], ['金融', '第三支柱。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          银发经济的关键张力在于<strong style={{ color: 'var(--text-primary)' }}>「未富先老」</strong>——支付能力滞后于照护需求的爆发。
          短期靠居家社区补短板与适老化改造撬动，长期取决于<strong style={{ color: 'var(--text-primary)' }}>长护险全国落地、护理人力供给与养老金第三支柱</strong>的制度建设，与人口结构、健康中国、消费升级深度耦合。
        </p>
      </Card>

      <ModuleFooter moduleId="silverEconomy" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
