import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, GRID_WIDE, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// 赛道：规模(亿元示意)、国际地位、卡脖子点、出海进展
const TRACKS = [
  { key: 'innov', label: '创新药', accent: '#c41e3a', share: 32,
    scale: '~12,000 亿', status: '快速追赶 · me-too 转 first-in-class', choke: '原创靶点 / 源头机理 / 长周期资本',
    going: 'License-out 爆发，2023 出海交易额首超引进', desc: 'First-in-class 突破加速，临床效率与 CRO 生态全球领先，但源头创新与原创靶点仍弱。' },
  { key: 'biosim', label: '生物类似药', accent: '#f97316', share: 11,
    scale: '~1,200 亿', status: '产能领先 · 同质化内卷', choke: '高端培养基 / 一次性反应器 / 工艺放大',
    going: '欧美注册起步，新兴市场为主战场', desc: '单抗类似药扎堆申报，价格战激烈；上游耗材与培养基仍高度依赖进口。' },
  { key: 'cgt', label: '细胞与基因治疗', accent: '#a855f7', share: 8,
    scale: '~600 亿', status: '临床数量全球第一 · 商业化薄', choke: '载体 / 质粒 / 自动化生产 / 支付',
    going: 'CAR-T 海外授权，传奇生物领跑', desc: 'IND 数量全球居前，但 CDMO 产能、病毒载体与支付环境制约商业化放量。' },
  { key: 'vaccine', label: '疫苗', accent: '#22d3ee', share: 9,
    scale: '~1,000 亿', status: '产能全球领先 · 生物安全核心', choke: 'mRNA 平台 / 佐剂 / 递送系统',
    going: '传统疫苗援外铺开，mRNA 出海受阻', desc: '灭活与重组疫苗产能巨大并承担援外，但 mRNA 平台与佐剂技术落后欧美。' },
  { key: 'device', label: '医疗器械(诊断)', accent: '#10b981', share: 18,
    scale: '~5,500 亿', status: '中低端替代完成 · 高端攻坚', choke: '高端影像核心件 / 测序仪 / 质谱',
    going: 'IVD 与监护出海，高端依赖进口', desc: '影像、植入与手术机器人进口替代加速，三类证批量突破；高端核心部件仍卡脖子。' },
  { key: 'synbio', label: '合成生物', accent: '#84cc16', share: 12,
    scale: '~900 亿', status: 'BT+IT 新质赛道 · 工程化早期', choke: '菌株设计 / 酶元件库 / 量产经济性',
    going: '生物基材料与原料出海', desc: 'BT+IT 融合，生物制造与新质生产力交叉；底盘菌株与高通量元件库仍待补课。' },
  { key: 'cxo', label: 'CXO 外包', accent: '#e8a317', share: 10,
    scale: '~3,000 亿', status: '全球份额第二 · 工程师红利', choke: '高端分析设备 / 客户集中 / 地缘政策',
    going: '欧美订单为主，地缘扰动加剧', desc: '工程师红利下的「卖水人」，CDMO 产能与临床资源构成比较优势，但客户与地缘高度敏感。' },
];

const PHASES = [
  { period: '–2015', title: '仿制为主', accent: '#64748b', desc: '以仿制药与原料药出口为主，创新药占比极低，审评积压严重。' },
  { period: '2015–2018', title: '药审改革 · 4+7 集采', accent: '#f97316', desc: '一致性评价 + 4+7 带量采购挤出仿制泡沫，倒逼企业转型创新。' },
  { period: '2018–2021', title: '创新崛起 · 港股 18A', accent: '#e8a317', desc: '港交所 18A 与科创板第五套打开未盈利 Biotech 融资通道，管线爆发。' },
  { period: '2021–2023', title: 'License-out 出海', accent: '#22d3ee', desc: '医保谈判压估值、内卷加剧，企业转向海外授权，出海交易额跃升。' },
  { period: '2024–', title: '源头创新 · 合成生物', accent: '#c41e3a', desc: '从 fast-follow 走向 first-in-class，合成生物与生物制造成为新质生产力抓手。' },
];

export default function Page() {
  const [track, setTrack] = useState('innov');
  const [phaseIdx, setPhaseIdx] = useState(3);
  const t = TRACKS.find((x) => x.key === track) || TRACKS[0];

  // 产业规模趋势（按赛道切换，万亿示意）
  const trend = useMemo(() => ({
    grid: GRID_WIDE,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(['2016', '2018', '2020', '2022', '2023', '2025E']),
    yAxis: valueY({ name: '万亿' }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: track === 'innov' ? [2.1, 2.8, 3.6, 4.2, 4.5, 5.8]
        : track === 'cxo' ? [0.8, 1.2, 1.9, 2.6, 3.0, 4.1]
        : track === 'cgt' ? [0.1, 0.2, 0.35, 0.5, 0.6, 1.0]
        : [1.8, 2.2, 2.8, 3.2, 3.5, 4.2],
      lineStyle: { color: t.accent, width: 3 }, areaStyle: { color: `${t.accent}18` } }],
  }), [track, t]);

  // 创新药研发管线 + License-out 出海（双轴多线）
  const pipeline = useMemo(() => ({
    grid: GRID_WIDE,
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#93a1b5' }, top: 0 },
    xAxis: categoryX(['2018', '2019', '2020', '2021', '2022', '2023', '2024']),
    yAxis: [valueY({ name: '个' }), valueY({ name: '亿美元', splitLine: { show: false } })],
    series: [
      { name: 'IND 受理', type: 'bar', data: [380, 530, 700, 1050, 1250, 1450, 1700], barWidth: 16, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
      { name: 'NDA 受理', type: 'bar', data: [60, 85, 110, 150, 180, 210, 250], barWidth: 16, itemStyle: { color: '#10b981', borderRadius: 3 } },
      { name: 'License-out 交易额', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 7,
        data: [50, 80, 120, 180, 270, 460, 520], lineStyle: { color: '#c41e3a', width: 3 } },
    ],
  }), []);

  // 创新实力雷达（六维，按赛道切换中国值，对照美国）
  const radar = useMemo(() => {
    const cn = track === 'innov' ? [55, 92, 90, 70, 60, 68]
      : track === 'cgt' ? [62, 80, 50, 60, 45, 55]
      : track === 'device' ? [50, 78, 85, 72, 65, 60]
      : [58, 82, 75, 68, 58, 62];
    return {
      legend: { textStyle: { color: '#93a1b5' }, bottom: 0, data: ['中国', '美欧'] },
      radar: {
        indicator: ['原创靶点', '临床能力', '产业化', '审评效率', '支付环境', '国际化'].map((n) => ({ name: n, max: 100 })),
        axisName: { color: '#93a1b5', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
        axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
        splitArea: { show: false },
      },
      series: [{ type: 'radar', data: [
        { value: cn, name: '中国', lineStyle: { color: t.accent, width: 2 }, itemStyle: { color: t.accent }, areaStyle: { color: `${t.accent}22` } },
        { value: [95, 90, 88, 85, 92, 96], name: '美欧', lineStyle: { color: '#64748b', width: 2 }, itemStyle: { color: '#64748b' } },
      ] }],
    };
  }, [track, t]);

  // 全球创新药格局：中国全球占比 vs 美欧（首发新药来源地，多年）
  const globalShare = useMemo(() => stackedBarOpt({
    categories: ['2015', '2018', '2021', '2023', '2025E'],
    series: [
      { name: '美国', data: [55, 50, 46, 42, 40], itemStyle: { color: '#64748b' } },
      { name: '欧洲', data: [28, 27, 25, 23, 22], itemStyle: { color: '#22d3ee' } },
      { name: '中国', data: [5, 9, 14, 20, 25], itemStyle: { color: '#c41e3a' } },
      { name: '其他', data: [12, 14, 15, 15, 13], itemStyle: { color: '#3f4a5e' } },
    ],
  }), []);

  // CXO 全球份额 donut（卖水人优势）
  const cxoDonut = useMemo(() => donutOpt([
    { name: '中国 CRO/CDMO', value: 28, itemStyle: { color: '#e8a317' } },
    { name: '北美', value: 34, itemStyle: { color: '#64748b' } },
    { name: '欧洲', value: 22, itemStyle: { color: '#22d3ee' } },
    { name: '印度', value: 9, itemStyle: { color: '#10b981' } },
    { name: '其他', value: 7, itemStyle: { color: '#3f4a5e' } },
  ]), []);

  // 集采 vs 创新双轨：仿制药降价幅度 vs 创新药谈判准入数
  const dualTrack = useMemo(() => ({
    grid: GRID_WIDE,
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#93a1b5' }, top: 0 },
    xAxis: categoryX(['2018', '2019', '2020', '2021', '2022', '2023']),
    yAxis: [valueY({ name: '降幅%', max: 100 }), valueY({ name: '准入数', splitLine: { show: false } })],
    series: [
      { name: '集采平均降幅', type: 'bar', data: [52, 59, 53, 56, 48, 50], barWidth: 20, itemStyle: { color: '#64748b', borderRadius: 3 } },
      { name: '创新药医保新增', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 7,
        data: [17, 70, 96, 67, 108, 121], lineStyle: { color: '#c41e3a', width: 3 } },
    ],
  }), []);

  // 出海结构横向 bar（按赛道切换）
  const goingBar = useMemo(() => ({
    grid: { left: 72, right: 40, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(['本土市场', 'License-out', '海外临床', '新兴市场', '原料/耗材出口']),
    series: [{ type: 'bar', barWidth: 14, itemStyle: { borderRadius: 3, color: t.accent },
      data: track === 'innov' ? [85, 72, 55, 45, 40]
        : track === 'cxo' ? [40, 30, 25, 35, 88]
        : track === 'vaccine' ? [80, 25, 30, 70, 55]
        : [75, 45, 35, 55, 60],
      label: { show: true, position: 'right', color: '#93a1b5', formatter: '{c}' } }],
  }), [track, t]);

  return (
    <div>
      <PageHeader badge="Bio · 生命科技" title="生物医药 · 创新药与生物安全" subtitle="创新药 · 类似药 · 细胞基因 · 疫苗 · 器械 · 合成生物 · CXO" />
      <IntroCard>生物医药从仿制药红利转向<strong style={{ color: 'var(--text-primary)' }}>创新药与全球注册</strong>；集采挤泡沫、谈判促创新的双轨结构倒逼产业升级，工程师红利经 CXO「卖水人」变现，而疫苗、生物制造与基因数据则构成<strong style={{ color: 'var(--text-primary)' }}>生物安全</strong>的边界。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="1,700+" label="年度 IND 受理 (2024 示意)" accent="#22d3ee" />
        <Stat value="~520 亿$" label="License-out 交易额 (2024)" accent="#c41e3a" />
        <Stat value="~28%" label="CXO 全球份额" accent="#e8a317" />
        <Stat value="~4.5 万亿" label="医药市场规模 (2023)" accent="#10b981" />
      </Grid>

      <Card title="交互① · 赛道选择器" className="mb-6">
        <SelectorBar items={TRACKS} activeKey={track} onSelect={setTrack} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
          <Grid cols={4}>
            <div><div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>市场规模</div><div className="text-sm font-semibold" style={{ color: t.accent }}>{t.scale}</div></div>
            <div><div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>国际地位</div><div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.status}</div></div>
            <div><div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>卡脖子点</div><div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.choke}</div></div>
            <div><div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>出海进展</div><div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.going}</div></div>
          </Grid>
        </div>
        <Grid cols={2}>
          <Card title="产业规模趋势（万亿 · 随赛道切换）"><EChart option={trend} style={{ height: 240 }} /></Card>
          <Card title="出海结构指数（随赛道切换）"><EChart option={goingBar} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="交互② · 创新药研发管线 · 从仿制到出海"><EChart option={pipeline} style={{ height: 280 }} /><p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>IND/NDA 受理量持续攀升，License-out 出海交易额 2023 起跃升——产业逻辑从「卖产品」转向「卖管线」。</p></Card>
        <Card title="创新实力雷达 · 中国 vs 美欧（随赛道切换）"><EChart option={radar} style={{ height: 280 }} /><p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>临床与产业化逼近第一梯队，原创靶点与支付环境仍是短板。</p></Card>
      </Grid>

      <Card title="交互③ · 医药产业政策时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="全球创新药格局 · 首发新药来源地占比（%）"><EChart option={globalShare} style={{ height: 260 }} /><p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>中国从 me-too 跟随走向 first-in-class，全球占比逼近欧洲，但仍受制于原创机理与监管互认。</p></Card>
        <Card title="CXO 全球份额 · 工程师红利下的「卖水人」"><EChart option={cxoDonut} style={{ height: 260 }} /><p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>CRO/CDMO 全球份额约四分之一，临床资源与产能构成比较优势，但客户集中与地缘政策为风险敞口。</p></Card>
      </Grid>

      <Card title="交互④ · 集采与创新双轨 · 挤泡沫与促创新" className="mb-6">
        <EChart option={dualTrack} style={{ height: 260 }} />
        <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          仿制药集采以 50%+ 降幅挤出价格泡沫，腾出医保空间；创新药通过年度谈判批量准入放量。<strong style={{ color: 'var(--text-primary)' }}>「以量换价」与「谈判促创新」构成双轨</strong>——产业结构被迫从同质化仿制转向差异化创新。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { title: '从仿制到创新', subtitle: '集采 · 谈判双轨', body: '集采挤出仿制泡沫、医保谈判压估值，双轨倒逼企业从 me-too 走向 first-in-class。', pillars: [['集采挤泡沫', '降价腾空间。'], ['谈判促创新', '批量准入放量。'], ['18A 通道', '未盈利 Biotech 融资。']] },
        { title: '工程师红利变现', subtitle: 'CXO 卖水人', body: 'CRO/CDMO 凭借工程师红利与临床资源承接全球外包，是不押注靶点的稳定现金流。', pillars: [['CDMO 产能', '全球份额 #2。'], ['临床资源', '患者入组优势。'], ['地缘敞口', '客户与政策风险。']] },
        { title: '生物安全', subtitle: '疫苗 · 制造 · 数据', body: '疫苗产能、生物制造与基因组数据构成生物安全维度，涉及伦理红线与两用审查。', pillars: [['疫苗产能', '援外与战备。'], ['基因数据', '基因组主权。'], ['两用审查', '出口与伦理规制。']] },
      ]} />

      <ModuleFooter moduleId="bio" disclaimer="公开资料整理，数值为示意非官方 · 仅供产业分析框架参考，非投资或医疗建议" sourceNote="由 china.html「生物医药」专题迁移并扩容" />
    </div>
  );
}
