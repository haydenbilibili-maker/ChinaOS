import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';

// ============================================================================
// 未来产业 · 前沿赛道布局 —— 比新质生产力更前沿的「种子期」聚焦
// asOf 2026-06-11 · 公开资料示意，非官方统计
// 与 npf（新质生产力）区分：本模块聚焦尚处实验室/中试的前沿种子赛道。
// ============================================================================

const AS_OF = '2026-06-11';

// 选择器联动雷达维度（示意评分 0—100）
const DIMS = ['技术成熟', '市场潜力', '国家投入', '产业链就绪', '国际位势'];

const TRACKS = [
  {
    key: 'embodied', label: '具身智能', accent: '#22d3ee', trl: 5,
    horizon: '2026—2030 产业化', scores: [62, 92, 80, 65, 70],
    thesis: '具身智能（人形机器人 + 大模型）是 AI 从「数字世界」走向「物理世界」的载体——制造、服务、特种作业的通用执行体，被视为下一个万亿级平台。',
    points: ['人形机器人整机量产爬坡，成本快速下探', '运动控制 + 多模态大模型「大脑—小脑」协同', '工厂/物流/养老等场景试点'],
    bottleneck: '灵巧手、高功率密度关节、具身数据与泛化能力仍是核心瓶颈。',
  },
  {
    key: 'fusion', label: '可控核聚变', accent: '#c41e3a', trl: 4,
    horizon: '2035+ 工程示范', scores: [45, 95, 75, 42, 72],
    thesis: '可控核聚变是「终极能源」——一旦工程化将彻底改写能源压舱石逻辑。中国 EAST、BEST、CRAFT 等装置持续刷新参数，民营聚变创业涌现。',
    points: ['EAST 长脉冲高约束运行纪录持续突破', '紧凑型托卡马克与高温超导磁体路线并进', '聚变产业联盟与资本加速入场'],
    bottleneck: '净能量增益（Q>1 工程意义）、材料耐受、商业堆经济性远未解决。',
  },
  {
    key: 'biomanu', label: '生物制造', accent: '#10b981', trl: 6,
    horizon: '2026—2030 放量', scores: [68, 80, 60, 62, 58],
    thesis: '生物制造（合成生物学）以「细胞工厂」替代化学合成与农业种植——食品、材料、医药、化工的绿色重构，是十五五前沿支柱。',
    points: ['合成生物学生产蛋白、香料、生物基材料', '酶工程与菌株设计平台化（DBTL 循环）', '生物基替代石化路线、降碳'],
    bottleneck: '菌株稳定性、放大发酵成本、法规与生物安全监管。',
  },
  {
    key: 'sixg', label: '6G / 量子', accent: '#8b5cf6', trl: 3,
    horizon: '2030 商用', scores: [40, 88, 82, 50, 68],
    thesis: '6G 与量子信息构成下一代信息基础设施——通信感知一体、空天地海一体化网络，叠加量子计算/通信/测量的算力与安全跃迁。',
    points: ['6G 关键技术研发与频谱预研', '量子计算「祖冲之/九章」路线推进', '量子保密通信干线与星地网络'],
    bottleneck: '6G 标准与频谱博弈；量子纠错、相干时间与工程化规模。',
  },
  {
    key: 'brain', label: '脑机接口', accent: '#e8a317', trl: 4,
    horizon: '2030 临床扩展', scores: [48, 72, 58, 45, 55],
    thesis: '脑机接口（BCI）打通神经与机器——医疗康复先行（瘫痪/渐冻症），远期延伸至人机交互与认知增强，涉及神经数据主权。',
    points: ['侵入式/半侵入式 BCI 临床试验推进', '高通量电极与神经信号解码算法', '康复、控制、交互场景落地'],
    bottleneck: '生物相容性、长期稳定性、伦理审查与神经数据治理。',
  },
  {
    key: 'hydroenergy', label: '新型储能/氢', accent: '#fb923c', trl: 6,
    horizon: '2026—2030 商业化', scores: [70, 85, 68, 72, 65],
    thesis: '新型储能（钠电/固态/液流/重力）与绿氢是新型能源体系的「调节器」——支撑高比例新能源消纳，是能源转型的关键变量。',
    points: ['固态电池、钠离子电池产业化提速', '长时储能（液流/压缩空气）示范', '绿电制氢与氢储运全链'],
    bottleneck: '固态电池量产良率、长时储能经济性、绿氢成本。',
  },
];

// 前沿研发投入强度趋势（示意指数，2020=100）
const investOpt = {
  grid: GRID, tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2020', '2022', '2024', '2025E', '2030E']),
  yAxis: valueY({ name: '投入指数' }),
  series: [{
    type: 'bar', barWidth: 30, data: [100, 142, 198, 235, 420],
    itemStyle: { color: '#8b5cf6', borderRadius: [3, 3, 0, 0] },
    label: { show: true, position: 'top', color: LABEL.color, formatter: '{c}' },
    markLine: { silent: true, data: [{ yAxis: 200, label: { formatter: '倍增基线', color: LABEL.color }, lineStyle: { color: '#e8a317', type: 'dashed' } }] },
  }],
};

// 赛道成熟度散点（TRL vs 市场潜力，示意）
const maturityOpt = {
  grid: { left: 44, right: 24, top: 24, bottom: 40 },
  tooltip: { trigger: 'item', formatter: (p) => `${p.data[2]}<br/>成熟度 TRL ${p.data[0]} · 潜力 ${p.data[1]}` },
  xAxis: { type: 'value', name: 'TRL 成熟度', min: 2, max: 8, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: LABEL.color }, nameTextStyle: { color: '#5b6a82' } },
  yAxis: { type: 'value', name: '市场潜力', min: 40, max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: LABEL.color }, nameTextStyle: { color: '#5b6a82' } },
  series: [{
    type: 'scatter', symbolSize: (d) => d[3],
    data: [
      [5, 92, '具身智能', 42, '#22d3ee'],
      [4, 95, '可控核聚变', 40, '#c41e3a'],
      [6, 80, '生物制造', 36, '#10b981'],
      [3, 88, '6G/量子', 38, '#8b5cf6'],
      [4, 72, '脑机接口', 30, '#e8a317'],
      [6, 85, '新型储能/氢', 38, '#fb923c'],
    ].map((d) => ({ value: d, itemStyle: { color: d[4] } })),
    label: { show: true, formatter: (p) => p.data.value[2], position: 'top', color: LABEL.color, fontSize: 10 },
  }],
};

export default function Page() {
  const [track, setTrack] = useState('embodied');
  const t = TRACKS.find((x) => x.key === track) ?? TRACKS[0];

  return (
    <div>
      <PageHeader
        badge="十五五 · 未来产业布局"
        title="未来产业 · 颠覆性技术布局"
        subtitle="六大种子赛道 · 高不确定性约束 · 种子到支柱跃迁"
      />

      <IntroCard>
        未来产业是由<strong style={{ color: 'var(--text-primary)' }}>前沿与颠覆性技术</strong>驱动、尚处孕育/成长期的潜力产业。
        相较<strong style={{ color: 'var(--text-primary)' }}>新质生产力</strong>（已成势的战略性新兴产业），未来产业更偏<strong style={{ color: 'var(--text-primary)' }}>「种子期」</strong>：
        技术不确定性高、回报周期长，需国家以「耐心资本」与新型举国体制对冲风险，押注下一个技术革命的入场券。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <StatGrid className="mb-6">
        <Stat value="6大赛道" label="前沿种子方向" accent="#22d3ee" />
        <Stat value="TRL 3—6" label="技术成熟度区间" accent="#e8a317" />
        <Stat value="耐心资本" label="新型举国体制" accent="#10b981" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </StatGrid>

      <Card title="未来产业赛道地图 · 成熟度 × 潜力（气泡=投入强度 · 示意）" className="mb-6">
        <EChart option={maturityOpt} style={{ height: 300 }} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          横轴技术成熟度（TRL）越高越接近产业化，纵轴市场潜力越高想象空间越大。左上象限（高潜力、低成熟度）是国家「耐心资本」重点对冲的高风险高回报区。
        </p>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="前沿研发投入强度 · 指数（2020=100 · 示意）"><EChart option={investOpt} style={{ height: 240 }} /></Card>
        <Card title="耐心资本与组合下注">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            未来产业的<strong style={{ color: 'var(--text-primary)' }}>高不确定性</strong>超出市场风险偏好，国家以<strong style={{ color: 'var(--text-primary)' }}>耐心资本</strong>与新型举国体制承接「市场失灵」段。
            关键不在「全押」而在<strong style={{ color: 'var(--text-primary)' }}>组合下注与容错机制</strong>——避免运动式一哄而上造成重复建设与产能过剩。
          </p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #8b5cf6', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>投入侧</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>研发投入强度倍增，长周期耐心资本对冲不确定性回报。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>筛选侧</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>概念验证中心、先导区灰度筛选可行路线，路线收敛。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="交互 · 前沿赛道选择器" className="mb-4">
        <SelectorBar
          items={TRACKS.map((x) => ({ key: x.key, label: x.label, accent: x.accent }))}
          activeKey={track}
          onSelect={setTrack}
        />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-[10px] mono uppercase" style={{ color: t.accent }}>赛道论点</span>
            <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>TRL {t.trl} · {t.horizon}</span>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.thesis}</p>
          <div className="space-y-2 mb-3">
            {t.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#c41e3a' }}>瓶颈 · </span>{t.bottleneck}
          </div>
        </div>
        <Card title={`${t.label} · 赛道五维评估（示意）`}>
          <EChart option={radarOpt(DIMS, t.scores, { name: t.label, color: t.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>布局具身智能、量子、生物制造、6G、核聚变、新型储能/氢等未来产业先导区；研发投入强度倍增，新增长引擎储备成形。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>技术不确定性高、回报周期长、多数赛道会失败；运动式一哄而上易致重复建设与产能过剩。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>实验室 → 中试/概念验证 → 未来产业先导区灰度筛选 → 种子期向新质生产力战略性新兴产业跃迁为支柱。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '国家押注', body: '未来产业的高风险长周期超出市场风险偏好，国家以新型举国体制与耐心资本承接「市场失灵」段——把战略卡位权牢牢握在手中。', pillars: [['押注', '耐心资本。'], ['统筹', '举国体制。'], ['卡位', '标准与专利。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '中试灰度', body: '从实验室到中试到产业化，以场景验证、概念验证中心、未来产业先导区灰度筛选可行路线。', pillars: [['验证', '概念验证。'], ['先导', '先导区。'], ['筛选', '路线收敛。']] },
        { key: 'path', title: '升级路径', subtitle: '种子到支柱', body: '从种子期前沿技术，向新质生产力的战略性新兴产业跃迁，最终成为支撑下一轮长波的支柱产业。', pillars: [['种子', '前沿技术。'], ['成长', '新兴产业。'], ['支柱', '长波引擎。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          未来产业的本质是<strong style={{ color: 'var(--text-primary)' }}>「以确定性投入对冲不确定性回报」</strong>的国家级风险投资——多数赛道会失败，但成功者将定义下一个产业周期。
          关键不在「全押」而在<strong style={{ color: 'var(--text-primary)' }}>组合下注与容错机制</strong>：避免运动式一哄而上造成重复建设与产能过剩，与新质生产力、基础研究、创新体系一体推进。
        </p>
      </Card>

      <ModuleFooter moduleId="futureIndustry" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
