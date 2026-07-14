import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, stackedBarOpt, radarOpt, AXIS, LABEL, LEGEND } from '../shared/chartHelpers.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// ============================================================================
// 服务贸易 · 数字贸易 / 服贸会 / 知识密集型出口
// asOf 2026-07-14 · 公开资料示意
// ============================================================================

const AS_OF = AS_OF_BASELINE;

const SEGMENTS = [
  {
    key: 'digital', label: '数字贸易', accent: '#22d3ee',
    scores: [92, 85, 78, 88, 75],
    thesis: '跨境电商、数字服务出口与数据流动规则构成服务贸易新增长极——「数字贸易」首次写入政府工作报告，制度规则竞争加剧。',
    points: ['跨境电商综试区与海外仓网络', '游戏/短视频/云服务出海', '数据跨境流动安全评估框架', 'DEPA/CPTPP 数字贸易条款对接'],
    lever: '商务部数字贸易政策 + 网信办数据出境规则。',
  },
  {
    key: 'knowledge', label: '知识密集', accent: '#c41e3a',
    scores: [80, 88, 72, 75, 82],
    thesis: '电信、计算机与信息服务、知识产权使用费、研发服务——知识密集型服务贸易是附加值最高的出口品类，也是「新三样」之后的服务版升级。',
    points: ['软件与 IT 服务外包出口', '知识产权许可与技术服务', '海外工程设计与咨询', '文化、教育、医疗等服务出口试点'],
    lever: '服贸负面清单缩减 + 服务业扩大开放试点。',
  },
  {
    key: 'travel', label: '旅行运输', accent: '#e8a317',
    scores: [65, 70, 85, 60, 70],
    thesis: '入境旅游复苏与跨境运输（航空/海运）是服务贸易传统支柱——签证便利化与航线恢复是短期弹性最大的变量。',
    points: ['144小时过境免签扩围', '国际航线恢复与运力投放', '邮轮与游艇入境政策', '离境退税与消费便利化'],
    lever: '文旅部 + 移民局签证政策 + 航司运力。',
  },
  {
    key: 'finance', label: '金融服务', accent: '#10b981',
    scores: [75, 78, 68, 82, 80],
    thesis: '跨境金融服务贸易（银行、保险、资管）随人民币国际化与离岸市场拓展——CIPS 与 e-CNY 是支付基础设施的制度红利。',
    points: ['跨境理财通与资金池', 'QFII/RQFII 额度与准入', '保险跨境再保险', '离岸人民币债券与点心债'],
    lever: '央行 + 金融监管总局 + 离岸市场（香港）。',
  },
];

const PHASES = [
  { period: '2012–2019', title: '服贸试点', accent: '#64748b', desc: '服务贸易创新发展试点启动，服贸会成为制度展示平台。' },
  { period: '2020–2023', title: '数字加速', accent: '#e8a317', desc: '疫情催化在线服务与跨境电商爆发，数字贸易规模快速扩张。' },
  { period: '2024–', title: '制度竞争', accent: '#c41e3a', desc: '政府工作报告首提「数字贸易」，服贸负面清单缩减，对接高标准经贸规则。' },
];

const DIMS = ['增长潜力', '附加值', '规则壁垒', '数字赋能', '开放试点'];

export default function Page() {
  const [seg, setSeg] = useState('digital');
  const [phaseIdx, setPhaseIdx] = useState(2);
  const s = SEGMENTS.find((x) => x.key === seg) ?? SEGMENTS[0];

  const tradeBalanceOpt = useMemo(() => ({
    grid: GRID, tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['服务出口', '服务进口'] },
    xAxis: categoryX(['2018', '2020', '2022', '2024', '2026E']),
    yAxis: valueY({ name: '亿美元' }),
    series: [
      { name: '服务出口', type: 'bar', barWidth: 16, data: [2660, 2800, 3200, 3800, 4500], itemStyle: { color: '#c41e3a', borderRadius: 3 } },
      { name: '服务进口', type: 'bar', barWidth: 16, data: [5200, 4800, 4400, 4200, 4000], itemStyle: { color: AXIS.lineStyle.color, borderRadius: 3 } },
    ],
  }), []);

  const structureOpt = stackedBarOpt({
    categories: ['2015', '2018', '2021', '2024', '2026E'],
    series: [
      { name: '旅行运输', data: [35, 32, 18, 22, 25], itemStyle: { color: '#e8a317' } },
      { name: '知识密集型', data: [28, 32, 38, 42, 45], itemStyle: { color: '#c41e3a' } },
      { name: '数字与其他', data: [37, 36, 44, 36, 30], itemStyle: { color: '#22d3ee' } },
    ],
  });

  const digitalExportOpt = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['跨境电商', '云服务', '游戏', '短视频', '软件外包']),
    yAxis: valueY({ name: '亿美元' }),
    series: [{
      type: 'bar', barWidth: 18,
      data: seg === 'digital' ? [3200, 280, 185, 95, 420] : [2800, 250, 170, 88, 400],
      itemStyle: { color: s.accent, borderRadius: 3 },
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 9 },
    }],
  }), [seg, s]);

  return (
    <div>
      <PageHeader
        badge="政府工作报告 · 服务贸易"
        title="服务贸易 · 数字贸易新引擎"
        subtitle="服贸创新 · 知识密集 · 跨境数据"
      />

      <IntroCard>
        货物贸易「新三样」之后，<strong style={{ color: 'var(--text-primary)' }}>服务贸易与数字贸易</strong>是外贸结构升级的下一战场。
        2024—2025 政府工作报告首次写入「数字贸易」，服贸负面清单持续缩减——知识密集型与数字服务是附加值与增长潜力的双高赛道。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~4500亿$" label="服务出口（2026E）" accent="#c41e3a" />
        <Stat value="~45%" label="知识密集型占比" accent="#22d3ee" />
        <Stat value="~3200亿$" label="跨境电商规模" accent="#e8a317" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="服务进出口规模（示意）"><EChart option={tradeBalanceOpt} style={{ height: 240 }} /></Card>
        <Card title="服务贸易结构演变（占比 %）"><EChart option={structureOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="政策演进 · 时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Card title="交互 · 服务贸易板块" className="mb-4">
        <SelectorBar items={SEGMENTS} activeKey={seg} onSelect={setSeg} />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${s.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: s.accent }}>{s.label} · 贸易论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{s.thesis}</p>
          <div className="space-y-2 mb-3">
            {s.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${s.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#e8a317' }}>政策杠杆 · </span>{s.lever}
          </div>
        </div>
        <Card title={`${s.label} · 贸易五维评估`}>
          <EChart option={radarOpt(DIMS, s.scores, { name: s.label, color: s.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="数字服务出口细分（示意 · 亿美元）" className="mb-6">
        <EChart option={digitalExportOpt} style={{ height: 220 }} />
      </Card>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>服务贸易逆差收窄；知识密集型服务出口占比超 50%；数字贸易规模持续扩张；服贸负面清单进一步缩减。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>数据跨境流动规则与主权平衡；服务贸易壁垒（资质、标准、本地化）；地缘政治与「脱钩」对数字服务出口的压制。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>服贸负面清单缩减 → 数字贸易制度创新 → 高标准规则对接 → 服贸会与试点经验全国推广。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '规则壁垒', body: '服务贸易的壁垒不在关税而在规则——资质许可、数据本地化、标准认证是新时代的「盐铁专营」，开放是规则对接而非简单降税。', pillars: [['壁垒', '规则准入。'], ['开放', '负面清单。'], ['竞争', '标准对接。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '服贸试点', body: '服务贸易创新发展试点、服务业扩大开放综合试点——在局部区域灰度测试跨境服务与数据流动规则。', pillars: [['灰度', '服贸试点。'], ['测试', '数据流动。'], ['推广', '经验复制。']] },
        { key: 'path', title: '升级路径', subtitle: '货物到服务', body: '从货物贸易「新三样」到服务贸易「知识密集+数字」——外贸结构升级的第二曲线，附加值与规则话语权同步抬升。', pillars: [['1.0', '货物新三样。'], ['2.0', '知识密集。'], ['3.0', '数字贸易。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          服务贸易是中国外贸从「规模优势」转向<strong style={{ color: 'var(--text-primary)' }}>「规则优势与附加值优势」</strong>的关键战场。
          数字贸易写入政府工作报告标志着制度竞争进入新阶段——数据流动规则、服贸负面清单与高标准经贸规则对接，将决定未来十年服务出口的天花板。
        </p>
      </Card>

      <ModuleFooter moduleId="serviceTrade" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
