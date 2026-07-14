import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, LEGEND, radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// ============================================================================
// 制度型开放 · 自贸试验区 / 海南自贸港 / 规则对接
// asOf 2026-07-14 · 公开资料示意
// ============================================================================

const AS_OF = AS_OF_BASELINE;

const ZONES = [
  {
    key: 'shanghai', label: '上海', accent: '#c41e3a',
    scores: [95, 88, 92, 85, 80],
    thesis: '金融开放与制度创新「桥头堡」——临港新片区离岸金融、跨境数据流动与外资准入负面清单先行先试。',
    points: ['跨境贸易投资高水平开放', '国际金融资产交易平台', '数据跨境安全评估试点', '生物医药特殊物品通关'],
    lever: '自贸试验区提升战略 + 浦东引领区政策叠加。',
  },
  {
    key: 'guangdong', label: '粤港澳', accent: '#22d3ee',
    scores: [90, 85, 88, 82, 78],
    thesis: '大湾区规则衔接试验田——港澳与内地要素流动、职业资格互认、标准对接的制度摩擦消解前沿。',
    points: ['横琴、前海、南沙三大平台', '港澳专业人士执业准入', '跨境理财通与资金池', 'CEPA 升级版经贸规则'],
    lever: '大湾区规划纲要 + 自贸试验区联动创新。',
  },
  {
    key: 'hainan', label: '海南', accent: '#e8a317',
    scores: [88, 80, 75, 70, 92],
    thesis: '自贸港封关运作是制度型开放的「压力测试」——零关税、低税率、简税制与一线放开、二线管住的海关监管新模式。',
    points: ['2025 全岛封关运作准备', '零关税进口商品清单扩容', '鼓励类产业 15% 企业所得税', '国际旅游消费中心建设'],
    lever: '海南自贸港法 + 封关软硬件建设专项。',
  },
  {
    key: 'inland', label: '内陆自贸', accent: '#10b981',
    scores: [72, 78, 70, 88, 75],
    thesis: '内陆自贸试验区（陕西、四川、湖北等）承担「向西开放」与「中部崛起」的制度试验——中欧班列与产业转移的制度接口。',
    points: ['中欧班列集结中心制度创新', '先进制造与服务贸易开放', '内陆口岸经济与国际物流通道', '产业转移承接与制度复制'],
    lever: '自贸试验区扩容 + 西部陆海新通道联动。',
  },
];

const PHASES = [
  { period: '2013–2017', title: '首批试点', accent: '#64748b', desc: '上海自贸试验区挂牌，负面清单管理模式诞生，复制推广至第二批试点。' },
  { period: '2018–2022', title: '扩容深化', accent: '#e8a317', desc: '自贸试验区扩至 21 个，海南自贸港法颁布，制度创新成果向全国推广。' },
  { period: '2023–', title: '提升战略', accent: '#c41e3a', desc: '政府工作报告「深入实施自贸试验区提升战略」，对接 CPTPP/ DEPA 高标准经贸规则。' },
];

const DIMS = ['制度创新', '外资准入', '规则对接', '内陆开放', '风险可控'];

export default function Page() {
  const [zone, setZone] = useState('shanghai');
  const [phaseIdx, setPhaseIdx] = useState(2);
  const z = ZONES.find((x) => x.key === zone) ?? ZONES[0];

  const fdiOpt = useMemo(() => ({
    grid: GRID, tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['全国实际使用外资', '自贸试验区内资占'] },
    xAxis: categoryX(['2018', '2020', '2022', '2024', '2026E']),
    yAxis: valueY({ name: '亿美元' }),
    series: [
      { name: '全国实际使用外资', type: 'line', smooth: true, data: [1350, 1444, 1891, 1160, 1250], lineStyle: { color: '#64748b', width: 2 } },
      { name: '自贸试验区内资占', type: 'bar', barWidth: 18, data: [280, 320, 380, 350, 420], itemStyle: { color: z.accent, borderRadius: 3 } },
    ],
  }), [z]);

  const negativeListOpt = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2013', '2017', '2019', '2021', '2024']),
    yAxis: valueY({ name: '条', inverse: false }),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [190, 122, 40, 31, 27],
      lineStyle: { color: '#10b981', width: 2 },
      areaStyle: { color: 'rgba(16,185,129,0.1)' },
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 9 },
    }],
  }), []);

  const ruleRadar = useMemo(() => radarOpt(
    ['数据流动', '知识产权', '政府采购', '竞争政策', '劳工标准', '环境条款'],
    zone === 'hainan' ? [70, 65, 72, 68, 55, 60] : zone === 'shanghai' ? [88, 85, 80, 75, 60, 65] : [75, 72, 78, 70, 58, 62],
    { name: '规则对接度', color: z.accent },
  ), [zone, z]);

  const innovationOpt = useMemo(() => ({
    grid: { left: 56, right: 24, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(['贸易便利化', '投资自由化', '金融开放', '数据跨境', '事中事后监管']),
    series: [{
      type: 'bar', barWidth: 14, itemStyle: { borderRadius: 3, color: z.accent },
      data: zone === 'shanghai' ? [92, 88, 95, 85, 80] : zone === 'hainan' ? [90, 85, 78, 70, 75] : [80, 82, 72, 68, 78],
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 9 },
    }],
  }), [zone, z]);

  return (
    <div>
      <PageHeader
        badge="政府工作报告 · 制度型开放"
        title="制度开放 · 自贸试验区提升"
        subtitle="负面清单 · 规则对接 · 封关运作"
      />

      <IntroCard>
        制度型开放区别于商品与要素流动型开放——核心是<strong style={{ color: 'var(--text-primary)' }}>规则、规制、管理、标准</strong>与国际高标准经贸规则对接。
        2024—2025 政府工作报告明确「深入实施自贸试验区提升战略」，海南自贸港封关运作是制度压力测试的旗舰工程。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="22" label="自贸试验区（个）" accent="#c41e3a" />
        <Stat value="27条" label="外资准入负面清单（2024）" accent="#10b981" />
        <Stat value="~3500" label="制度创新成果（累计）" accent="#e8a317" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="外资利用与自贸试验区贡献（示意）"><EChart option={fdiOpt} style={{ height: 240 }} /></Card>
        <Card title="外资准入负面清单缩减（全国版）"><EChart option={negativeListOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="政策演进 · 时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Card title="交互 · 重点开放平台" className="mb-4">
        <SelectorBar items={ZONES} activeKey={zone} onSelect={setZone} />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${z.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: z.accent }}>{z.label} · 制度论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{z.thesis}</p>
          <div className="space-y-2 mb-3">
            {z.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${z.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#e8a317' }}>政策杠杆 · </span>{z.lever}
          </div>
        </div>
        <Card title={`${z.label} · 开放五维评估`}>
          <EChart option={radarOpt(DIMS, z.scores, { name: z.label, color: z.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="制度创新领域成熟度（示意）"><EChart option={innovationOpt} style={{ height: 220 }} /></Card>
        <Card title="高标准经贸规则对接度"><EChart option={ruleRadar} style={{ height: 220 }} /></Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>自贸试验区制度创新成果全国复制推广率提升；海南自贸港封关运作平稳；对接 CPTPP/DEPA 规则试点项扩容。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>金融开放与资本流动风险管控；数据跨境安全与主权平衡；地缘政治下外资信心波动。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>负面清单再缩减 → 规则对接试点 → 压力测试与风险预案 → 成熟经验全国推广。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '开放阀门', body: '自贸试验区是可控开放的「阀门」——在局部区域试验高风险制度创新，成功则推广，失败则隔离。开放节奏服从金融安全与产业安全底线。', pillars: [['阀门', '局部试验。'], ['隔离', '风险可控。'], ['推广', '成熟复制。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '压力测试', body: '海南封关、跨境数据流动、离岸金融——每一项都是灰度压力测试，在真实流量中验证制度可行性与风险边界。', pillars: [['灰度', '封关测试。'], ['验证', '真实流量。'], ['迭代', '规则修订。']] },
        { key: 'path', title: '升级路径', subtitle: '流动到规则', body: '从商品要素流动型开放，升级到规则规制标准型开放——对接 CPTPP、DEPA 是制度型开放的标尺与倒逼机制。', pillars: [['1.0', '要素流动。'], ['2.0', '制度创新。'], ['3.0', '规则对接。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          制度型开放是中国高水平对外开放的<strong style={{ color: 'var(--text-primary)' }}>「规则竞赛」入口</strong>——自贸试验区是试验田，海南自贸港是旗舰，全国复制推广是终局。
          核心张力在于：开放深度与风险可控之间的动态平衡，以及在地缘博弈中维持外资与制度创新的双向信心。
        </p>
      </Card>

      <ModuleFooter moduleId="instOpen" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
