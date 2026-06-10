import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ───────────────────────────────────────────────────────────────────────────
// 民航与大飞机 · 数据皆为公开资料整理后的教学示意值，非官方口径
// ───────────────────────────────────────────────────────────────────────────

// 1) 机型 / 赛道选择器数据 —— 切换看进度、国产化率、卡脖子点、市场空间
const TRACKS = [
  {
    key: 'c919', name: 'C919 干线', color: '#c41e3a',
    seat: '158–192 座', stage: '商业运营放量', progress: 62, localize: 60,
    market: '万亿级 · 20 年约 9000 架窄体需求',
    rival: '直插 A320neo / 737 MAX 双寡头',
    choke: ['LEAP-1C 发动机仍全进口', 'EASA/FAA 适航互认未取得', '航电与飞控核心芯片依赖'],
    desc: '国产大飞机主力，已载客商运并进入产能爬坡。机体结构国产化高，但动力与适航认证构成两道硬壁垒。',
  },
  {
    key: 'arj21', name: 'ARJ21 支线', color: '#e8a317',
    seat: '78–97 座', stage: '规模交付迭代', progress: 88, localize: 65,
    market: '支线网络 · 累计交付逾 150 架',
    rival: '对标巴航工业 E 系列 / CRJ',
    choke: ['仍用 GE CF34 发动机', '支线航网经济性偏弱', '高原与极寒适应性持续验证'],
    desc: '中国首款喷气支线客机，已成熟交付并执飞数十条支线航线，是大飞机产业链的练兵场与供应链验证平台。',
  },
  {
    key: 'c929', name: 'C929 宽体', color: '#22d3ee',
    seat: '280–350 座', stage: '研制与试验', progress: 28, localize: 50,
    market: '远程双通道 · 航程约 12000 公里级',
    rival: '瞄准 A330neo / 787 远程市场',
    choke: ['宽体级大推力发动机空白', '复合材料机翼工艺攻关', '远程双通道适航经验缺失'],
    desc: '面向远程国际航线的双通道宽体项目，处于详细设计与关键技术验证阶段，是产业链向价值链顶端的跃迁尝试。',
  },
  {
    key: 'cj1000', name: '国产发动机 CJ-1000', color: '#10b981',
    seat: '大涵道比涡扇', stage: '装机验证', progress: 40, localize: 45,
    market: '替代 LEAP-1C · 单机价值数千万美元',
    rival: '对标 CFM LEAP / PW1000G',
    choke: ['单晶高温合金叶片良率', '热端部件寿命与可靠性', '整机适航取证周期漫长'],
    desc: '大飞机产业链上最难啃的硬骨头。从台架试车走向装机验证（TRL 7-8），决定 C919 能否真正实现动力自主。',
  },
  {
    key: 'evtol', name: '低空经济 eVTOL', color: '#a855f7',
    seat: '城市空中交通', stage: '商业化前夜', progress: 35, localize: 80,
    market: '2030 年规模有望破万亿 · 新蓝海',
    rival: '与 Joby / Archer 同台竞速',
    choke: ['适航标准与空域管理待立规', '电池能量密度限制航程', '城市起降基建与噪声接受度'],
    desc: 'eVTOL / 无人机 / 通航打开三维交通新空间。国产化率天然较高，竞争焦点在适航规则、电池与运营场景。',
  },
  {
    key: 'ga', name: '通用航空', color: '#93a1b5',
    seat: '通航 + 公务机', stage: '低空开放牵引', progress: 30, localize: 55,
    market: '通航作业 + 飞行培训 + 应急救援',
    rival: '机队规模远低于美国通航存量',
    choke: ['低空空域开放节奏', '通航机场密度不足', '高端公务机与航电仍进口'],
    desc: '低空经济的存量底盘。空域管理改革与通航机场网络建设是关键变量，长期承接飞行培训与应急救援需求。',
  },
];

// 2) C919 国产化率提升曲线（按年 · 示意）
const localizeCurve = {
  grid: GRID,
  tooltip: { trigger: 'axis', valueFormatter: (v) => v + '%' },
  xAxis: categoryX(['首飞', '取证', '首运', '+2y', '+4y', '目标']),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  series: [{
    type: 'line', smooth: true, symbol: 'circle', symbolSize: 7,
    data: [42, 48, 55, 60, 68, 75],
    lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' },
    areaStyle: { color: 'rgba(196,30,58,0.12)' },
    markLine: { silent: true, symbol: 'none', lineStyle: { color: '#e8a317', type: 'dashed' }, data: [{ yAxis: 100, label: { formatter: '全自主', color: '#e8a317', fontSize: 10 } }] },
  }],
};

// 3) C919 关键部件来源 donut（按价值占比 · 示意）
const partsSource = donutOpt([
  { value: 40, name: '国内供应（机体/结构/内饰）', itemStyle: { color: '#10b981' } },
  { value: 22, name: '发动机 LEAP-1C（进口）', itemStyle: { color: '#c41e3a' } },
  { value: 18, name: '航电系统（合资/进口）', itemStyle: { color: '#e8a317' } },
  { value: 12, name: '飞控/液压/起落架（进口为主）', itemStyle: { color: '#f97316' } },
  { value: 8, name: '其它机载（进口）', itemStyle: { color: '#93a1b5' } },
]);

// 4) 大飞机产业链自主度雷达（单系列 · radarOpt）
const autonomyRadar = radarOpt(
  ['机体结构', '发动机', '航电', '飞控', '航空材料', '适航认证'],
  [82, 35, 50, 45, 60, 30],
  { name: '国产自主度', color: '#c41e3a' },
);

// 5) 全球窄体机交付份额 donut（双寡头格局，C919 切入 · 示意）
const makerShare = donutOpt([
  { value: 45, name: 'Airbus（A320neo 家族）', itemStyle: { color: '#22d3ee' } },
  { value: 44, name: 'Boeing（737 MAX）', itemStyle: { color: '#e8a317' } },
  { value: 8, name: 'COMAC（C919）', itemStyle: { color: '#c41e3a' } },
  { value: 3, name: '其它（庞巴迪/巴航等）', itemStyle: { color: '#93a1b5' } },
]);

// 6) 民航市场规模：机队规模 + 客运量趋势（双轴 · 自写内联 option）
const fleetTrend = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['机队规模（架）', '客运量（亿人次）'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
  grid: { left: 48, right: 52, top: 30, bottom: 24 },
  xAxis: categoryX(['2019', '2023', '2027', '2031', '2035', '2043']),
  yAxis: [
    { type: 'value', name: '架', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
    { type: 'value', name: '亿人次', nameTextStyle: { color: '#5b6a82' }, splitLine: { show: false }, axisLabel: { color: '#93a1b5' } },
  ],
  series: [
    { name: '机队规模（架）', type: 'bar', barWidth: 22, data: [3800, 4200, 5200, 6300, 7400, 9900], itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
    { name: '客运量（亿人次）', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', data: [6.6, 6.2, 9.0, 11.5, 14.0, 20.0], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
  ],
};

// 7) 低空经济市场规模预测 bar（按细分 · 万亿元 · 示意）
const lowAltitudeBar = {
  legend: { data: ['2025', '2030'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  xAxis: categoryX(['无人机物流', 'eVTOL 载人', '通航作业', '应急救援', '飞行培训']),
  yAxis: valueY({ name: '千亿元', nameTextStyle: { color: '#5b6a82' } }),
  series: [
    { name: '2025', type: 'bar', barWidth: 14, data: [2.2, 0.3, 1.5, 0.6, 0.8], itemStyle: { color: '#5b6a82', borderRadius: 3 } },
    { name: '2030', type: 'bar', barWidth: 14, data: [6.0, 3.2, 3.0, 1.6, 1.5], itemStyle: { color: '#a855f7', borderRadius: 3 } },
  ],
};

// 8) 大飞机之路时间线
const ROAD = [
  { period: '1970–80s', title: '运十下马', accent: '#93a1b5', desc: '运十 (Y-10) 完成首飞并多次试飞，却因体制、配套与市场判断终止。自主大飞机的第一次尝试搁浅，留下「换不来核心技术」的教训。' },
  { period: '2008–2015', title: 'ARJ21 支线破冰', accent: '#e8a317', desc: '商飞成立，ARJ21 支线客机取证并交付。中国重建喷气客机研制体系，跑通设计—制造—适航—交付全流程，为干线机练兵。' },
  { period: '2017–2023', title: 'C919 首飞至商运', accent: '#c41e3a', desc: 'C919 首飞、取得型号合格证并交付东航载客商运。国产窄体干线机正式切入波音空客双寡头垄断的主战场。' },
  { period: '2024–2030', title: '国产发动机装机', accent: '#10b981', desc: 'CJ-1000A 大涵道比涡扇从台架走向装机验证，目标逐步替代 LEAP-1C。动力自主是产业链国产化的最后、也是最硬的一关。' },
  { period: '2030+', title: 'C929 宽体 · 适航出海', accent: '#22d3ee', desc: 'C929 远程宽体推进研制，叠加 EASA/FAA 适航互认突破，国产大飞机谋求从国内放量走向全球航线的远程市场。' },
];

export default function Page() {
  const [trackKey, setTrackKey] = useState('c919');
  const [stageIdx, setStageIdx] = useState(2);
  const track = useMemo(() => TRACKS.find((t) => t.key === trackKey) || TRACKS[0], [trackKey]);

  // 赛道进度条选择器联动图（进度/国产化双指标条 · 内联 option）
  const trackBar = useMemo(() => ({
    grid: { left: 70, right: 40, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => v + '%' },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: ['国产化率', '研制/商用进度'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
    series: [{
      type: 'bar', barWidth: 18,
      data: [track.localize, track.progress],
      itemStyle: { color: track.color, borderRadius: 4 },
      label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5', fontSize: 11 },
    }],
  }), [track]);

  return (
    <div>
      <PageHeader badge="Civil Aviation · Trillion Market" title="民航与国产大飞机布局" subtitle="C919 · ABC 产品线 · CJ-1000 发动机攻坚 · 低空经济 · 适航出海" />
      <IntroCard>
        大飞机不是一架飞机，而是一国高端制造、材料、电子与适航制度能力的综合检验，是制造业皇冠上的明珠。C919 取证商运标志产业链自主可控迈出关键一步，但<strong style={{ color: '#c41e3a' }}>发动机</strong>与<strong style={{ color: '#e8a317' }}>适航认证</strong>仍是两道硬壁垒。与此同时，eVTOL 与通航撑起的低空经济正打开三维交通的新蓝海。这是一场关于产业链权力与制造业纵深的长期博弈，本页数值为公开资料教学示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="1,200+ 架" label="C919 累计订单（示意）" accent="#c41e3a" />
        <Stat value="~60% → 75%" label="C919 国产化率（现状→目标）" accent="#10b981" />
        <Stat value="~9,900 架" label="2043 机队规模（示意）" accent="#22d3ee" />
        <Stat value="~万亿" label="2030 低空经济规模（示意）" accent="#a855f7" />
      </Grid>

      {/* ── 1) 机型 / 赛道选择器 ── */}
      <Card title="赛道选择器 · 机型与产业方向（切换看进度 / 国产化率 / 卡脖子点 / 市场空间）" className="mb-6">
        <SelectorBar items={TRACKS} activeKey={trackKey} onSelect={setTrackKey} />
        <Grid cols={2}>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-base font-semibold" style={{ color: track.color }}>{track.name}</span>
              <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{track.seat} · {track.stage}</span>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{track.desc}</p>
            <div className="os-card p-3 mb-3" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>市场空间</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{track.market}</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>竞争格局：{track.rival}</div>
            </div>
            <div className="text-[11px] mono mb-1" style={{ color: '#c41e3a' }}>卡脖子点</div>
            <ul className="space-y-1">
              {track.choke.map((c) => (
                <li key={c} className="text-xs flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: '#c41e3a' }}>▸</span>{c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs mono mb-2" style={{ color: 'var(--text-tertiary)' }}>进度 / 国产化双指标（% · 示意）</div>
            <EChart option={trackBar} style={{ height: 200 }} />
          </div>
        </Grid>
      </Card>

      {/* ── 2) C919 国产化率提升曲线 + 关键部件来源 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="C919 国产化率提升曲线（% · 示意）"><EChart option={localizeCurve} style={{ height: 240 }} /></Card>
        <Card title="C919 关键部件来源 · 按价值占比（% · 示意）"><EChart option={partsSource} style={{ height: 240 }} /></Card>
      </Grid>

      {/* ── 3)+4) 自主度雷达 + 三巨头格局 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="大飞机产业链自主度雷达（机体强 · 动力/适航弱 · 示意）"><EChart option={autonomyRadar} style={{ height: 280 }} /></Card>
        <Card title="全球窄体机交付份额 · C919 切入双寡头（% · 示意）"><EChart option={makerShare} style={{ height: 280 }} /></Card>
      </Grid>

      {/* ── 5) 民航市场规模 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="民航市场规模 · 机队规模 vs 客运量（示意）"><EChart option={fleetTrend} style={{ height: 260 }} /></Card>
        <Card title="国产机渗透的空间">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            未来 20 年中国机队接近翻三倍、客运量重回并大幅超越疫情前高点。这意味着每年数百架的新机刚性需求——而当前主力窄体几乎全部来自波音空客。国产机每提升一个百分点渗透率，对应的就是数十亿美元级别的进口替代与产业链留存。
          </p>
          <Grid cols={2}>
            <Stat value="~9,000 架" label="20 年窄体新机需求（示意）" accent="#22d3ee" />
            <Stat value="< 5% → 15%" label="国产窄体渗透率（现状→2035目标）" accent="#c41e3a" />
          </Grid>
        </Card>
      </Grid>

      {/* ── 6) 低空经济 ── */}
      <Card title="低空经济新蓝海 · 细分市场规模预测（千亿元 · 2025 vs 2030 示意）" className="mb-6">
        <EChart option={lowAltitudeBar} style={{ height: 260 }} />
        <Grid cols={4} className="mt-4">
          {[['无人机物流', '即时配送与干支线货运无人化，规模最大、落地最快。', '#a855f7'],
            ['eVTOL 载人', '城市空中出租与点对点通勤，增速最快、想象空间最大。', '#c41e3a'],
            ['通航作业', '农林、巡检、测绘等作业飞行，低空开放直接受益。', '#22d3ee'],
            ['应急救援', '医疗转运与灾害响应，公共属性强、政策驱动明确。', '#10b981']].map(([t, d, c]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${c}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ── 7) 时间线：大飞机之路 ── */}
      <Card title="大飞机之路 · 从运十下马到适航出海" className="mb-6">
        <TimelineBar stages={ROAD} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ── 发动机攻坚补充叙事（保留并强化原内容） ── */}
      <Grid cols={2} className="mb-6">
        <Card title="动力攻坚 · CJ-1000A 是产业链最后一关">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>发动机是大飞机产业链上最难攻克的核心环节，单机价值占整机两成以上，决定 C919 能否真正实现动力自主。国产 CJ-1000A 大涵道比涡扇处于研制与适航验证阶段，目标逐步替代进口 LEAP-1C。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>动力进口依赖（短板）</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>现役 LEAP-1C 全部依赖进口，单晶高温合金叶片、热端部件良率与寿命是核心难关。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>自主动力研制提速</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>整机试验推进，从台架走向装机验证（TRL 7-8），但适航取证周期漫长。</p></div>
          </div>
        </Card>
        <Card title="走向全球 · 适航互认是第二道壁垒">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>走向国际市场的核心门槛是 EASA / FAA 适航取证与互认。机造得出来不等于卖得出去——没有海外适航背书，C919 只能在国内航线放量。一旦获得 EASA 型号认可，才能真正打开海外市场。</p>
          <Grid cols={2}>
            <Stat value="审定推进中" label="EASA 适航 · 目标 2025-26（示意）" accent="#e8a317" />
            <Stat value="~15% (2035)" label="单通道全球份额目标（示意）" accent="#22d3ee" />
          </Grid>
        </Card>
      </Grid>

      {/* ── 8) FrameworkTrio ── */}
      <FrameworkTrio cards={[
        {
          key: 'salt', title: '万亿级产业链拉动', subtitle: '大飞机 = 制造业皇冠', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '整机牵引材料、电子、机电与精密制造协同升级，产值放大约 1:8，是高端制造纵深的总抓手。',
          pillars: [['链主效应', '一架机带动上下游千家供应商'], ['价值留存', '进口替代留住产业链利润'], ['制造跃迁', '倒逼材料与工艺整体升级']],
        },
        {
          key: 'stone', title: '卡脖子双壁垒', subtitle: '发动机 + 适航认证', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '机体可造，动力与适航难破。发动机决定能不能真自主，适航互认决定能不能卖出去——两关皆是长周期硬骨头。',
          pillars: [['动力关', 'CJ-1000 装机替代 LEAP'], ['适航关', 'EASA/FAA 型号互认'], ['周期长', '取证以十年计']],
        },
        {
          key: 'path', title: '低空新蓝海', subtitle: 'eVTOL / 通航 / 无人机', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: 'eVTOL 与通航打开三维交通新空间，国产化率天然较高，竞争焦点从制造转向适航规则、电池与运营场景。',
          pillars: [['三维交通', '城市空中出行新维度'], ['规则先行', '空域与适航立规博弈'], ['场景驱动', '物流/救援/培训先落地']],
        },
      ]} />

      <Card title="系统结论" className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>C919 的真正意义不在短期市场份额，而在打通自主可控的产业链与适航制度能力。机体的胜利已经到手，发动机与适航互认才是决定成败的下半场；而低空经济则是同一套航空工业能力在三维交通上的增量延伸。这是一场以十年为单位、关于制造业纵深与产业链权力的长期博弈。</p></Card>

      <ModuleFooter moduleId="civilAviation" disclaimer="公开资料整理，机型进度 / 国产化率 / 市场规模 / 份额均为教学示意值，非官方口径 · 仅供分析框架参考，非投资建议" />
    </div>
  );
}
