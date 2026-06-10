import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 材料门类（卡脖子 vs 反卡筹码）────────────────────────────────────
const TRACKS = [
  {
    key: 'photoresist', label: '光刻胶', group: '半导体材料', accent: '#8b0000',
    autonomy: 12, weight: 96, local: 8,
    bottleneck: 'KrF / ArF 高端光刻胶几近空白，EUV 胶完全依赖进口；树脂、光致产酸剂(PAG)、溶剂全链卡死。',
    firms: ['南大光电', '彤程新材', '晶瑞电材', '华懋科技'],
    leverage: '无反卡筹码——纯受制方，被列为最高优先级攻关。',
  },
  {
    key: 'siwafer', label: '大硅片', group: '半导体材料', accent: '#a01028',
    autonomy: 28, weight: 92, local: 22,
    bottleneck: '12 英寸大硅片良率与缺陷密度仍落后日本信越、SUMCO；外延片、SOI 高端品类受限。',
    firms: ['沪硅产业', '中环股份', '立昂微', '神工股份'],
    leverage: '硅料/多晶硅原料自给充足，但拉单晶—抛光—检测装备仍卡。',
  },
  {
    key: 'gas', label: '电子特气', group: '半导体材料', accent: '#c41e3a',
    autonomy: 45, weight: 85, local: 40,
    bottleneck: '6N/7N 超高纯度气体（含氟特气、稀有气体）纯度壁垒高；提纯—检测—储运全套受制。',
    firms: ['华特气体', '金宏气体', '南大光电', '中船特气'],
    leverage: '氖/氙等稀有气体可借工业副产突破，部分品类已批量替代。',
  },
  {
    key: 'polymer', label: '高端聚合物', group: '高分子', accent: '#e8a317',
    autonomy: 40, weight: 70, local: 38,
    bottleneck: 'PI 聚酰亚胺、PEEK、LCP、高端尼龙单体卡在配方与连续化工艺；电子级 PI 膜仍进口。',
    firms: ['鼎龙股份', '瑞华泰', '中研股份', '沃特股份'],
    leverage: '通用工程塑料完全自给，高端是配方而非原料受制，验证导入周期短。',
  },
  {
    key: 'rare', label: '稀土永磁', group: '功能材料', accent: '#10b981',
    autonomy: 95, weight: 90, local: 95,
    bottleneck: '几乎无短板——高性能钕铁硼、晶界扩散、重稀土回收全球领先。',
    firms: ['中科三环', '金力永磁', '北方稀土', '宁波韵升'],
    leverage: '全球冶炼分离 90%、永磁市占 95%——最强反卡筹码，列入出口管制工具箱。',
  },
  {
    key: 'carbon', label: '碳纤维', group: '复合材料', accent: '#22d3ee',
    autonomy: 70, weight: 82, local: 65,
    bottleneck: 'T800 级已稳定量产，T1000/T1100 级及大丝束、航空级预浸料仍在爬坡；原丝—碳化装备受限。',
    firms: ['中复神鹰', '光威复材', '吉林化纤', '中简科技'],
    leverage: '风电/民用领域已规模替代，航空航天级是最后高地。',
  },
  {
    key: 'superalloy', label: '高温合金', group: '复合材料', accent: '#f97316',
    autonomy: 55, weight: 88, local: 50,
    bottleneck: '航空发动机单晶叶片、粉末高温合金盘材良率与一致性卡顿；母合金纯净度、定向凝固装备受限。',
    firms: ['钢研高纳', '抚顺特钢', '图南股份', '应流股份'],
    leverage: '军用渐次自主，民航涡扇验证导入慢，是发动机产业上限。',
  },
  {
    key: 'battery', label: '电池材料', group: '功能材料', accent: '#34d399',
    autonomy: 90, weight: 80, local: 90,
    bottleneck: '正极/负极/隔膜/电解液国产化率高；高端湿法隔膜、硅基负极、固态电解质是下一代焦点。',
    firms: ['宁德时代', '璞泰来', '恩捷股份', '天赐材料'],
    leverage: '全球正极 70%+、隔膜 60%+——新能源链反卡筹码，锂资源对外仍有缺口。',
  },
  {
    key: 'target', label: '靶材', group: '半导体材料', accent: '#a78bfa',
    autonomy: 35, weight: 75, local: 30,
    bottleneck: '高纯金属溅射靶材（铜/钽/钛）及超高纯溅射工艺受制；半导体级靶材依赖日美。',
    firms: ['江丰电子', '阿石创', '有研新材', '隆华科技'],
    leverage: '平板显示靶材已突破，半导体级仍在验证导入阶段。',
  },
];

// ── 国产替代进度（横向 bar 用）──────────────────────────────────────
const REPLACE = [
  { name: '稀土永磁', rate: 95 }, { name: '电池正极', rate: 90 }, { name: '碳纤维(民用)', rate: 80 },
  { name: '电子特气', rate: 45 }, { name: '高温合金', rate: 50 }, { name: '高端聚合物', rate: 40 },
  { name: '半导体靶材', rate: 35 }, { name: '大硅片(12")', rate: 28 }, { name: '光刻胶(高端)', rate: 8 },
].sort((a, b) => a.rate - b.rate);

// ── 替代路径四阶段（TimelineBar）────────────────────────────────────
const PHASES = [
  { period: '阶段 0', title: '受制', accent: '#8b0000', desc: '关键环节 100% 进口，外部一纸禁令即可断供；国内无合格产线，连样品都难复现。代表：EUV 光刻胶、T1100 碳纤维。' },
  { period: '阶段 1', title: '验证导入', accent: '#e8a317', desc: '国产样品送下游晶圆厂/主机厂上线验证，跑通良率与一致性认证；周期 1—3 年，多数死在「死亡之谷」。代表：高端电子特气、半导体靶材。' },
  { period: '阶段 2', title: '小批量', accent: '#22d3ee', desc: '通过认证进入二供/三供，以价格与供应安全切入低端订单；产能爬坡、成本仍高。代表：12 英寸大硅片、PI 膜。' },
  { period: '阶段 3', title: '规模替代', accent: '#10b981', desc: '成本反超进口、产能溢出、形成出口能力，资源/规模优势转为反卡筹码。代表：稀土永磁、电池材料、风电碳纤维。' },
];

const GROUP_COLORS = { '半导体材料': '#c41e3a', '高分子': '#e8a317', '功能材料': '#10b981', '复合材料': '#22d3ee' };

export default function Page() {
  const [track, setTrack] = useState('photoresist');
  const [phaseIdx, setPhaseIdx] = useState(0);
  const t = TRACKS.find((x) => x.key === track) || TRACKS[0];

  // 散点矩阵：自主度(x) × 战略权重(y)，象限 = 高危卡脖子 / 已突破
  const matrix = useMemo(() => ({
    grid: { left: 48, right: 24, top: 24, bottom: 48 },
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.data[3]}<br/>自主度 ${p.data[0]}% · 战略权重 ${p.data[1]}`,
    },
    xAxis: valueY({ min: 0, max: 100, name: '自主度 →', nameLocation: 'middle', nameGap: 28, nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    yAxis: valueY({ min: 60, max: 100, name: '战略权重', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    series: [{
      type: 'scatter',
      symbolSize: (d) => (d[2] === track ? 26 : 15),
      label: {
        show: true, formatter: (p) => p.data[4], position: 'right', fontSize: 9,
        color: '#93a1b5',
      },
      data: TRACKS.map((x) => [x.autonomy, x.weight, x.key, x.label, x.label]),
      itemStyle: {
        color: (p) => {
          const x = TRACKS.find((m) => m.key === p.data[2]);
          if (p.data[2] === track) return x.accent;
          return x.autonomy < 50 ? 'rgba(196,30,58,0.55)' : 'rgba(16,185,129,0.5)';
        },
        borderColor: (p) => (p.data[2] === track ? '#fff' : 'transparent'),
        borderWidth: 1.5,
      },
      markLine: {
        silent: true, symbol: 'none', lineStyle: { color: 'rgba(148,163,184,0.3)', type: 'dashed' },
        data: [{ xAxis: 50 }],
        label: { show: false },
      },
    }],
  }), [track]);

  // 国产替代进度横向 bar
  const replaceBar = useMemo(() => ({
    grid: { left: 88, right: 36, top: 12, bottom: 16 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].name}: ${p[0].value}%` },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(REPLACE.map((r) => r.name)),
    series: [{
      type: 'bar', barWidth: 13,
      data: REPLACE.map((r) => ({
        value: r.rate,
        itemStyle: {
          color: r.rate >= 70 ? '#10b981' : r.rate >= 40 ? '#e8a317' : '#c41e3a',
          borderRadius: [0, 3, 3, 0],
        },
        label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5', fontSize: 9 },
      })),
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: 'rgba(148,163,184,0.35)', type: 'dashed' },
        data: [{ xAxis: 50, label: { formatter: '替代线', color: '#93a1b5', fontSize: 9 } }],
      },
    }],
  }), []);

  // 稀土反卡筹码 donut（全球冶炼分离份额）
  const rareDonut = useMemo(() => donutOpt([
    { name: '中国', value: 90, itemStyle: { color: '#10b981' } },
    { name: '马来西亚', value: 4, itemStyle: { color: '#e8a317' } },
    { name: '其他', value: 6, itemStyle: { color: 'rgba(100,116,139,0.5)' } },
  ]), []);

  // 自主度雷达（六维：上游矿 / 提纯 / 配方 / 装备 / 良率 / 规模）随门类切换
  const RADAR_DIMS = {
    photoresist: [40, 25, 15, 10, 8, 12], siwafer: [85, 60, 45, 25, 30, 35],
    gas: [70, 55, 50, 35, 45, 48], polymer: [80, 55, 35, 40, 45, 50],
    rare: [98, 95, 92, 80, 90, 96], carbon: [75, 65, 60, 55, 65, 70],
    superalloy: [70, 55, 50, 40, 45, 55], battery: [70, 88, 90, 75, 88, 92],
    target: [60, 45, 35, 30, 35, 38],
  };
  const autonomyRadar = useMemo(() => radarOpt(
    ['上游矿/原料', '提纯', '配方', '专用装备', '良率/一致性', '规模/成本'],
    RADAR_DIMS[track] || RADAR_DIMS.photoresist,
    { name: `${t.label} 自主度`, color: t.accent },
  ), [track, t]);

  // 材料自主化漏斗（产业链上游越深、自给越薄）
  const dependencyFunnel = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'funnel', left: '8%', top: 12, bottom: 12, width: '84%',
      min: 0, max: 100, sort: 'descending', gap: 2,
      label: { show: true, position: 'inside', fontSize: 10, color: '#fff' },
      data: [
        { value: 100, name: '初级原材料（自给）', itemStyle: { color: '#1f6b46' } },
        { value: 65, name: '通用工程材料', itemStyle: { color: '#e8a317' } },
        { value: Math.round((t.local + t.autonomy) / 2), name: `特种先进材料 · ${t.label}`, itemStyle: { color: t.accent } },
        { value: t.autonomy, name: '极端核心辅料层', itemStyle: { color: '#8b0000' } },
      ],
    }],
  }), [t]);

  // 各门类国产化率分组堆叠（已替代 vs 缺口）
  const gapBar = useMemo(() => stackedBarOpt({
    categories: TRACKS.map((x) => x.label),
    series: [
      { name: '已国产替代', data: TRACKS.map((x) => x.local), itemStyle: { color: '#10b981' } },
      { name: '对外缺口', data: TRACKS.map((x) => 100 - x.local), itemStyle: { color: 'rgba(196,30,58,0.55)' } },
    ],
  }), []);

  const breakthroughCount = TRACKS.filter((x) => x.autonomy >= 60).length;
  const choke = TRACKS.filter((x) => x.autonomy < 50).length;

  return (
    <div>
      <PageHeader badge="Advanced Materials · 深度透视" title="关键材料 · 卡脖子与国产替代" subtitle="半导体材料 · 高端聚合物 · 稀土永磁 · 碳纤维 · 高温合金 · 电池材料 · 靶材 —— 剥离口号，以产业链最上游的权力物理衡量受制与反卡" />
      <IntroCard>
        现实主义逻辑下，材料是所有技术的<strong style={{ color: 'var(--text-primary)' }}>最上游容器</strong>——一片光刻胶、一根碳纤维、一块单晶叶片，决定整条产业链的物理上限。卡脖子的本质不是芯片本身，而是配方、提纯与专用装备的<strong style={{ color: 'var(--cyber-cyan)' }}>非对称壁垒</strong>。与此对称，<strong style={{ color: '#10b981' }}>稀土与镓锗</strong>则是在岸系统手中的反向筹码：冶炼分离 90% 的全球份额，使「替代」从单向焦虑变为双向博弈。以下按门类拆解：谁仍受制、谁已突破、谁能反卡。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~45%" label="关键材料整体自给率（示意）" accent="#e8a317" />
        <Stat value="90%" label="稀土冶炼分离全球份额" accent="#10b981" />
        <Stat value={`${breakthroughCount} 类`} label="已突破门类（自主≥60%）" accent="#22d3ee" />
        <Stat value={`${choke} 类`} label="高危卡脖子门类（自主<50%）" accent="#c41e3a" />
      </Grid>

      <Card title="交互① · 材料门类选择器（受制 ↔ 反卡）" className="mb-6">
        <SelectorBar items={TRACKS} activeKey={track} onSelect={setTrack} getLabel={(i) => `${i.label}`} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.label}</span>
            <span className="text-[11px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: GROUP_COLORS[t.group] || t.accent, border: `1px solid ${GROUP_COLORS[t.group] || t.accent}` }}>{t.group}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>自主度 {t.autonomy}% · 战略权重 {t.weight} · 国产化率 {t.local}%</span>
          </div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}><strong style={{ color: '#c41e3a' }}>卡脖子环节：</strong>{t.bottleneck}</p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}><strong style={{ color: '#10b981' }}>反卡/突破筹码：</strong>{t.leverage}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {t.firms.map((f) => (
              <span key={f} className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>{f}</span>
            ))}
          </div>
        </div>
        <Grid cols={2}>
          <Card title="自主度雷达 · 六维拆解（随门类切换）"><EChart option={autonomyRadar} style={{ height: 240 }} /></Card>
          <Card title="材料自主化漏斗 · 越上游越薄（随门类切换）"><EChart option={dependencyFunnel} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="交互② · 自主度 × 战略权重矩阵（点选定位门类）">
          <p className="text-[11px] mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>左侧 = 高危卡脖子（红）· 右侧 = 已突破（绿）· 高亮为当前门类</p>
          <EChart option={matrix} style={{ height: 260 }} />
        </Card>
        <Card title="国产替代进度条 · 关键材料国产化率">
          <p className="text-[11px] mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>绿≥70% 已规模替代 · 黄 40—70% 验证爬坡 · 红&lt;40% 高危受制</p>
          <EChart option={replaceBar} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="反卡筹码 · 稀土冶炼分离全球份额">
          <p className="text-[11px] mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>资源端可争，分离端近乎垄断——「反向卡脖子」的物理基础</p>
          <EChart option={rareDonut} style={{ height: 240 }} />
        </Card>
        <Card title="各门类国产化率 · 已替代 vs 对外缺口">
          <EChart option={gapBar} style={{ height: 240 }} />
        </Card>
      </Grid>

      <Card title="交互③ · 国产替代路径四阶段（点选看阶段定义）" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
        <Grid cols={4} className="mt-4">
          {PHASES.map((p, i) => (
            <div key={p.period} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${p.accent}`, opacity: i === phaseIdx ? 1 : 0.55, transition: 'opacity .15s' }}>
              <div className="text-[10px] mono mb-1" style={{ color: p.accent }}>{p.period} · {p.title}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                {i === 0 ? '光刻胶 · 高温合金叶片' : i === 1 ? '电子特气 · 靶材' : i === 2 ? '大硅片 · PI 膜' : '稀土 · 电池 · 碳纤维'}
              </div>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="核心赛道 · 定义产业上限">
          <div className="space-y-2">
            {[['碳纤维', 'T800 级稳定量产，T1100 仍在爬坡——支撑航空航天减重。', '#22d3ee'],
              ['高温合金', '单晶叶片决定航空发动机产业上限，民航级最难。', '#f97316'],
              ['光刻胶', '半导体最深短板，EUV 胶近乎空白，无反卡筹码。', '#8b0000'],
              ['稀土永磁', '冶炼分离 90%、永磁市占 95%——资源优势转全球垄断。', '#10b981'],
              ['电池材料', '正极/隔膜/电解液全球领先，固态电解质争下一代。', '#34d399']].map(([tit, d, c]) => (
              <div key={tit} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{tit}</div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="替代方法论 · 验证—导入—迭代">
          <div className="space-y-3">
            {[['为何慢', '下游晶圆厂/主机厂换料要重跑全套良率与可靠性认证，单点失效即全线停产——验证周期 1—3 年，多数死在「死亡之谷」。'],
              ['如何破', '国产以「供应安全 + 价格」切入二供/三供，先拿低端订单养产线，再以规模摊薄成本反超进口。'],
              ['筹码逻辑', '一旦规模替代成功、产能溢出形成出口能力，资源/规模优势即转为反卡筹码（稀土、镓锗、电池材料即范本）。']].map(([tit, d]) => (
              <div key={tit}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--cyber-cyan)' }}>{tit}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '卡脖子物理', subtitle: '材料 = 产业链最上游', accent: '#c41e3a', border: '#c41e3a', body: '芯片断供的真实切点在材料：光刻胶、电子特气、大硅片、半导体靶材的配方—提纯—装备壁垒，是非对称限制最集中的物理边界。越上游、越基础，自给率越薄。', pillars: [['光刻胶 8%', '最深短板，无替代。'], ['大硅片 28%', '良率/缺陷受制。'], ['极端核心辅料', '自主化最低层。']] },
        { title: '反卡筹码', subtitle: '稀土 · 镓锗 · 电池', accent: '#10b981', border: '#10b981', body: '在岸系统并非纯受制方：稀土冶炼分离 90%、永磁市占 95%，叠加镓/锗/石墨出口管制——把「替代焦虑」对冲为双向博弈工具，资源优势即谈判杠杆。', pillars: [['90% 分离份额', '近乎垄断。'], ['95% 永磁市占', '战略杠杆。'], ['出口管制', '双向工具。']] },
        { title: '替代方法论', subtitle: '验证 → 导入 → 迭代', accent: '#22d3ee', border: '#22d3ee', body: '替代不是技术问题而是认证—产能—成本的工程长征：送样验证、切入二供、产能爬坡、成本反超。材料基因组与高通量计算把研发周期压至传统约 1/3，缩短「死亡之谷」。', pillars: [['1—3 年验证', '死亡之谷。'], ['二供切入', '供应安全。'], ['~1/3 周期', '材料基因组。']] },
      ]} />

      <ModuleFooter moduleId="materials" disclaimer="示意数据非官方统计，自主度/国产化率为公开资料整理的分析框架估值 · 仅供研究参考，非投资建议" sourceNote="由 china.html「关键材料」专题迁移并大幅扩容" />
    </div>
  );
}
