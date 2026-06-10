import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 科技树作战盘 · 12 大战略科技领域
// ----------------------------------------------------------------------------
// 数值为示意值（公开信息综合），用于定位「换道超车」的领先 / 追赶 / 受制分层。
// 配色：#c41e3a(中国红/受制) #22d3ee(青/追赶) #e8a317(金/攻坚) #10b981(绿/领先)
// ============================================================================

// tier: lead 领先梯队 / chase 并跑追赶 / locked 受制卡脖子
const TIER_COLOR = { lead: '#10b981', chase: '#22d3ee', locked: '#c41e3a' };
const TIER_LABEL = { lead: '领先梯队', chase: '并跑追赶', locked: '受制卡脖子' };

// 雷达维度：自主可控 / 工程化 / 人才储备 / 产业生态 / 投资强度
const RADAR_IND = [
  { name: '自主可控', max: 100 },
  { name: '工程化', max: 100 },
  { name: '人才储备', max: 100 },
  { name: '产业生态', max: 100 },
  { name: '投资强度', max: 100 },
];

// trl: 技术成熟度 0-9 · auto: 自主度% · weight: 战略权重 0-100 · gapCN/gapUS: 中美能力(0-100)
const DOMAINS = [
  {
    k: 'ai', name: 'AI / 大模型', tier: 'chase', trl: 8, auto: 72, weight: 98,
    route: '稠密+MoE 大模型、端到端具身、军事 AI；算力调度为硬约束。',
    neck: '高端 AI 算力(GPU)、HBM、先进制程供给',
    radar: [72, 80, 78, 75, 95], cn: 82, us: 95,
    verdict: '模型与应用并跑、算力受制——以系统优化与开源生态补偿硬件代差。',
  },
  {
    k: 'semi', name: '半导体', tier: 'locked', trl: 6, auto: 38, weight: 99,
    route: '成熟制程筑底、Chiplet 换道、特色工艺；先进逻辑受 EUV 约束。',
    neck: 'EUV 光刻、高端 EDA、部分电子特气/光刻胶',
    radar: [38, 60, 62, 65, 96], cn: 55, us: 96,
    verdict: '最硬卡脖子环节——成熟制程+先进封装构成可辩护的主权防御带。',
  },
  {
    k: 'quantum', name: '量子信息', tier: 'chase', trl: 5, auto: 70, weight: 80,
    route: '超导/光量子计算、量子通信(京沪干线/墨子号)、量子精密测量。',
    neck: '稀释制冷机、高保真度量子比特控制电子学',
    radar: [70, 50, 72, 55, 78], cn: 80, us: 88,
    verdict: '量子通信工程化领先、量子计算并跑——稀释制冷与控制链待补。',
  },
  {
    k: 'fusion', name: '可控核聚变', tier: 'chase', trl: 4, auto: 75, weight: 76,
    route: 'EAST/HL-3 托卡马克、BEST 工程堆、紧凑高场路线并进。',
    neck: '高温超导带材规模化、第一壁耐辐照材料',
    radar: [75, 45, 70, 50, 82], cn: 78, us: 82,
    verdict: '装置参数世界前列、商业化仍远——超导带材是工程化的关键瓶颈。',
  },
  {
    k: 'space', name: '航天 / 重型运载', tier: 'chase', trl: 7, auto: 88, weight: 90,
    route: '长征系列、可复用火箭、低轨星座(GW/千帆)、载人登月与空间站。',
    neck: '大推力可复用发动机迭代、星座批产成本',
    radar: [88, 78, 80, 70, 85], cn: 85, us: 94,
    verdict: '体系完整自主度高、可复用与星座成本待追——轨道资产争夺加速。',
  },
  {
    k: 'biotech', name: '生物科技 / 合成生物', tier: 'chase', trl: 6, auto: 60, weight: 78,
    route: '合成生物制造、mRNA/细胞治疗、基因编辑、生物育种。',
    neck: '高端科研仪器、关键酶/试剂、生物信息基础工具',
    radar: [60, 62, 70, 58, 75], cn: 70, us: 92,
    verdict: '应用规模快速放量、上游工具链受制——仪器与试剂是隐性卡脖子。',
  },
  {
    k: 'material', name: '新材料', tier: 'chase', trl: 6, auto: 58, weight: 85,
    route: '碳纤维、高温合金、第三代半导体衬底、稀土功能材料。',
    neck: '高端航空高温合金、特种光学/电子材料认证',
    radar: [58, 65, 68, 62, 80], cn: 68, us: 90,
    verdict: '稀土与中低端材料具优势、高端认证周期长——是诸多产业的共性底座。',
  },
  {
    k: 'robot', name: '机器人 / 具身智能', tier: 'chase', trl: 6, auto: 65, weight: 88,
    route: '人形机器人、工业机器人国产化、具身大模型+本体协同。',
    neck: '高精度减速器、力矩电机、专用 SoC',
    radar: [65, 68, 72, 70, 88], cn: 75, us: 90,
    verdict: '本体与场景规模领先、核心零部件追赶——具身智能是 AI 落地最大增量。',
  },
  {
    k: 'comm', name: '6G 与通信', tier: 'lead', trl: 5, auto: 82, weight: 84,
    route: '6G 太赫兹/空天地一体、5G-A 商用、通信设备全球份额。',
    neck: '高端射频器件、部分核心芯片仍依赖供给链',
    radar: [82, 72, 80, 78, 80], cn: 90, us: 85,
    verdict: '标准与设备全球领先、6G 卡位先发——专利与生态构成长期护城河。',
  },
  {
    k: 'energy', name: '新能源 / 储能', tier: 'lead', trl: 9, auto: 90, weight: 92,
    route: '光伏全链、动力/储能电池、特高压电网、钠电与固态电池。',
    neck: '部分高端电池材料/设备、电力电子高端器件',
    radar: [90, 88, 82, 85, 90], cn: 95, us: 75,
    verdict: '全产业链统治级领先——成本与规模优势已形成，是确定性现金牛。',
  },
  {
    k: 'bci', name: '脑机接口', tier: 'locked', trl: 3, auto: 50, weight: 62,
    route: '侵入式/非侵入式 BCI、神经解码、脑科学大设施。',
    neck: '高密度柔性电极、神经信号专用芯片、临床数据',
    radar: [50, 35, 60, 45, 60], cn: 55, us: 90,
    verdict: '与领先者代差明显、临床与器件双约束——属早期换道窗口型领域。',
  },
  {
    k: 'mfg', name: '先进制造', tier: 'chase', trl: 7, auto: 64, weight: 86,
    route: '高端数控机床、工业母机、增材制造、精密检测装备。',
    neck: '五轴联动高端数控系统、高端轴承/丝杠、工业软件',
    radar: [64, 70, 72, 68, 82], cn: 72, us: 92,
    verdict: '中端制造统治、工业母机受制——数控系统与高端基础件是攻坚核心。',
  },
];

// ---- 图① 全领域 TRL × 自主度 散点矩阵（一眼看卡脖子）----
const scatterOption = {
  grid: { left: 56, right: 28, top: 28, bottom: 44 },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' },
    formatter: (p) => `${p.data.name}<br/>TRL ${p.data.value[0]} · 自主度 ${p.data.value[1]}%<br/>分层：${TIER_LABEL[p.data.tier]}`,
  },
  xAxis: {
    type: 'value', name: 'TRL 成熟度', min: 2, max: 9, nameTextStyle: { color: '#5b6a82' },
    axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } },
  },
  yAxis: {
    type: 'value', name: '自主度 %', min: 30, max: 100, nameTextStyle: { color: '#5b6a82' },
    axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } },
  },
  series: [{
    type: 'scatter',
    symbolSize: (v) => 14 + v[2] * 0.22,
    data: DOMAINS.map((d) => ({
      name: d.name, value: [d.trl, d.auto, d.weight], tier: d.tier,
      itemStyle: { color: TIER_COLOR[d.tier], opacity: 0.85, borderColor: 'rgba(255,255,255,0.25)', borderWidth: 1 },
    })),
    label: {
      show: true, position: 'top', formatter: (p) => p.data.name, fontSize: 10, color: '#93a1b5',
    },
    markArea: {
      silent: true,
      itemStyle: { color: 'rgba(196,30,58,0.06)' },
      data: [[{ xAxis: 2, yAxis: 30 }, { xAxis: 6, yAxis: 60 }]],
    },
  }],
};

// ---- 图③ 全领域战略权重条形 ----
const sortedByWeight = [...DOMAINS].sort((a, b) => a.weight - b.weight);
const weightOption = {
  grid: { left: 110, right: 40, top: 12, bottom: 24 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' } },
  xAxis: { type: 'value', max: 100, name: '战略权重', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
  yAxis: { type: 'category', data: sortedByWeight.map((d) => d.name), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 11 } },
  series: [{
    type: 'bar', barWidth: 13,
    data: sortedByWeight.map((d) => ({ value: d.weight, itemStyle: { color: TIER_COLOR[d.tier], borderRadius: [0, 3, 3, 0] } })),
    label: { show: true, position: 'right', formatter: '{c}', color: '#93a1b5', fontSize: 10 },
  }],
};

// ---- Stat 派生 ----
const cnt = (t) => DOMAINS.filter((d) => d.tier === t).length;
const avgAuto = Math.round(DOMAINS.reduce((s, d) => s + d.auto, 0) / DOMAINS.length);
const avgTrl = (DOMAINS.reduce((s, d) => s + d.trl, 0) / DOMAINS.length).toFixed(1);

export default function Page() {
  const [sel, setSel] = useState('ai');
  const d = DOMAINS.find((x) => x.k === sel);

  // ---- 图② 选中领域 中美能力对比雷达 ----
  const radarOption = {
    legend: { data: ['中国', '美国'], textStyle: { color: '#93a1b5' }, top: 0 },
    radar: {
      indicator: RADAR_IND, axisName: { color: '#93a1b5', fontSize: 11 }, radius: '62%',
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: true, areaStyle: { color: ['rgba(148,163,184,0.03)', 'transparent'] } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
    },
    series: [{
      type: 'radar',
      data: [
        { value: d.radar, name: '中国', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.18)' }, itemStyle: { color: '#c41e3a' } },
        // 美国基线以「能力位势」近似映射到五维（示意）
        { value: RADAR_IND.map(() => d.us), name: '美国', lineStyle: { color: '#22d3ee', type: 'dashed' }, areaStyle: { color: 'rgba(34,211,238,0.08)' }, itemStyle: { color: '#22d3ee' } },
      ],
    }],
  };

  return (
    <div>
      <PageHeader
        badge="Tech Tree · 科技作战盘"
        title="科技树作战盘"
        subtitle="12 大战略科技领域 · TRL × 自主度定位卡脖子 · 中美位势分层 —— 锚定换道超车的节点"
      />

      <Card className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          以 <strong style={{ color: 'var(--text-primary)' }}>技术成熟度(TRL)、自主可控度、战略权重、中美相对位势</strong>四把尺子横扫战略科技版图：
          <span style={{ color: '#10b981' }}> 绿=领先梯队</span>（新能源/6G）、
          <span style={{ color: '#22d3ee' }}> 青=并跑追赶</span>（AI/航天/机器人）、
          <span style={{ color: '#c41e3a' }}> 红=受制卡脖子</span>（半导体/脑机）。
          换道超车的逻辑——在受制领域守住可辩护防御带，在并跑领域以工程化与生态反超。
        </p>
      </Card>

      <Grid cols={5} className="mb-6">
        <Stat value="12" label="战略科技领域" accent="#e8a317" />
        <Stat value={cnt('lead')} label="领先梯队(领域)" accent="#10b981" />
        <Stat value={cnt('chase')} label="并跑追赶(领域)" accent="#22d3ee" />
        <Stat value={cnt('locked')} label="受制卡脖子(领域)" accent="#c41e3a" />
        <Stat value={`${avgAuto}%`} label={`自主度均值 · 均 TRL ${avgTrl}`} />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="① 全领域 TRL × 自主度矩阵（左下红区=卡脖子 · 气泡=战略权重）">
          <EChart option={scatterOption} style={{ height: 320 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>气泡越大战略权重越高；落入左下红色阴影区者为低成熟+低自主的攻坚优先级。</p>
        </Card>
        <Card title="③ 全领域战略权重排序（颜色=分层）">
          <EChart option={weightOption} style={{ height: 320 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>半导体、新能源、AI 居权重顶端；红色高权重领域=最需国家级资源倾斜。</p>
        </Card>
      </Grid>

      <Card title="点选领域 · 切换右侧作战详情" className="mb-3">
        <div className="flex gap-1.5 flex-wrap">
          {DOMAINS.map((x) => (
            <button
              key={x.k}
              onClick={() => setSel(x.k)}
              className="text-xs px-2.5 py-1 rounded mono"
              style={{
                background: x.k === sel ? TIER_COLOR[x.tier] : 'var(--bg-elevated)',
                color: x.k === sel ? '#0b1220' : 'var(--text-secondary)',
                border: `1px solid ${x.k === sel ? TIER_COLOR[x.tier] : 'var(--border-subtle)'}`,
                cursor: 'pointer', fontWeight: x.k === sel ? 700 : 400,
              }}
            >
              {x.name}
            </button>
          ))}
        </div>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title={`② ${d.name} · 中美能力对比雷达（示意）`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.2)', color: TIER_COLOR[d.tier], border: `1px solid ${TIER_COLOR[d.tier]}` }}>
              {TIER_LABEL[d.tier]}
            </span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>TRL {d.trl} · 自主度 {d.auto}% · 战略权重 {d.weight}</span>
          </div>
          <EChart option={radarOption} style={{ height: 280 }} />
        </Card>

        <Card title={`${d.name} · 战略判读`}>
          <div className="space-y-3">
            <div style={{ borderLeft: `2px solid ${TIER_COLOR[d.tier]}`, paddingLeft: 12 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>主导路线 / 代表项目</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.route}</p>
            </div>
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 12 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--china-red)' }}>卡脖子环节</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.neck}</p>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-lg font-bold mono" style={{ color: '#c41e3a' }}>{d.cn}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>中国位势</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-lg font-bold mono" style={{ color: '#22d3ee' }}>{d.us}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>美国位势</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-lg font-bold mono" style={{ color: d.cn - d.us >= 0 ? '#10b981' : '#e8a317' }}>{d.cn - d.us >= 0 ? `+${d.cn - d.us}` : d.cn - d.us}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>相对差(中-美)</div>
              </div>
            </div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 12 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>战略判读</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.verdict}</p>
            </div>
          </div>
        </Card>
      </Grid>

      <Card title="换道超车 · 三层结论" className="mb-6">
        <Grid cols={3}>
          {[
            ['领先梯队 · 守扩护城河', '#10b981', '新能源、6G 已形成全链优势——以标准、成本与生态把领先转化为长期规则话语权。'],
            ['并跑追赶 · 工程化反超', '#22d3ee', 'AI、航天、机器人、量子在并跑区——以场景规模与系统优化弥补单点硬件代差，争取反超窗口。'],
            ['受制卡脖子 · 守防御带', '#c41e3a', '半导体、脑机接口受制于上游——守住成熟制程/封装等可辩护防御带，沿换道窗口长期攻坚。'],
          ].map(([t, c, body]) => (
            <div key={t}>
              <div className="text-sm font-semibold" style={{ color: c }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <CrossLinks title="理论透镜 · 科技树背后的长波逻辑" className="mb-4" links={[
        { to: '/cognition', label: '康波周期', note: '为什么不惜代价押注 AI/半导体/聚变——长波窗口错过即一代落后。' },
        { to: '/middleincometrap', label: '中等收入陷阱', note: '产业升级能否突破，决定能否跨过陷阱。' },
        { to: '/thucydides', label: '修昔底德陷阱', note: '关键技术自主度曲线，正是实力转移的物质底层。' },
      ]} />
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        TRL / 自主度 / 战略权重 / 中美位势均为示意值（公开信息综合），仅用于相对定位与分层判读，不代表精确测度；请以官方规划、行业报告与企业披露为准。
      </p>
    </div>
  );
}
