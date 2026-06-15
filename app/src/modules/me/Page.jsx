import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 私享切片 · 李贺 / 独菽 / Hayden（GY-∞ · 不入公开图谱）
// ----------------------------------------------------------------------------
// 一个 1992 年从东北小镇 spawn 的进程的迁移日志：高考换页到江南，毕业进京挂载
// 互联网内核，赶上出海红利被调度到东亚/东南亚多个地域，又选择 fork 一次创业，
// 最后回迁到距出生地 32 公里的长春——在 35 岁的时钟中断里重新寻找调度策略。
// 口径：本人自述 + 简历公开口径，自画像、仅自用；非任何机构人事评价。
// ============================================================================

const AX = { line: '#27324a', text: '#93a1b5', split: 'rgba(148,163,184,0.1)' };

// —— 迁移日志（时间轴）——
const MIGRATION = [
  { period: '1992 · 起点', title: '东辽·白泉镇', accent: '#64748b',
    desc: '吉林省东辽县白泉镇出生。东北小镇的默认进程：资源有限、半径很小，但读书是唯一一条可被全国调度的出口。' },
  { period: '2011 · 换页', title: '无锡·江南大学', accent: '#22d3ee',
    desc: '高考把进程从东北换页到江南——江南大学（211 / 双一流 / 教育部直属）日语专业。第一次跨地域迁移，也是第一次把方言、气候与生活半径全部重写。' },
  { period: '2015 · 挂载内核', title: '北京·内容运营起步', accent: '#10b981',
    desc: '毕业进京，挂载互联网内核。优酷土豆短视频 UGC（单月引入 7.6 万条原创）、大鱼号、播客主播——在内容分发的底层练手，攒下第一段「从 0 搭体系」的肌肉记忆。' },
  { period: '2018 · 出海', title: '快手·东亚区域', accent: '#e8a317',
    desc: '赶上出海红利窗口。快手国际区域运营负责人，带 30 人团队做东亚/东南亚；在越南输出「老铁文化」，推 Kwai 登顶双榜第一、日活 50W+，主导 Snack Video 0-1 冷启动。' },
  { period: '2020 · 中枢', title: '杭州·支付宝分发', accent: '#8b5cf6',
    desc: '蚂蚁集团支付宝搜索推荐运营专家，做亿级流量首页分发与内容化转型冷启动。从「出海开拓」切回「巨型中枢调度」，看清了流量这门生意的另一面。' },
  { period: '2021 · 1 号位', title: 'B站·国家经理', accent: '#c41e3a',
    desc: '哔哩哔哩菲律宾/东南亚 1 号员工，从零搭 20 人本地团队，DAU 从 0 突破 300 万、次留 50%+、ACG 圈层渗透 0→17%。出海生涯的峰值校准点。' },
  { period: '2023 · fork', title: 'AI 社交·增长创业', accent: '#fb923c',
    desc: 'MetaDream（Bondee / Vibbe.ai）东南亚增长运营负责人，转身扑进 AIGC：用 Gemini/Flux 微调 200+ NPC、大五人格构虚拟生态，Cursor 写过 10W+ 行代码。从打工的确定性 fork 出一条自负盈亏的进程。' },
  { period: '2026 · 回迁', title: '长春·重新调度', accent: '#94a3b8',
    desc: '回到东北，落在长春——距白泉镇 32 公里的原点附近。出海十年攒下的 SOP 在这里水土不服，红利窗口在身后关闭，35 岁的时钟里有迷茫，也有第一次为自己而非为平台调度资源的清醒。' },
];

// —— 城市迁移图（语义布局：x 西→东 / y 北→南，海外聚在下方）——
const CITY_NODES = [
  { name: '白泉镇', x: 86, y: 8, kind: 'origin' },
  { name: '长春', x: 82, y: 4, kind: 'now' },
  { name: '北京', x: 60, y: 22 },
  { name: '杭州', x: 70, y: 50 },
  { name: '无锡', x: 73, y: 46 },
  { name: '首尔', x: 92, y: 34 },
  { name: '胡志明', x: 58, y: 88 },
  { name: '雅加达', x: 70, y: 96 },
  { name: '曼谷', x: 50, y: 86 },
  { name: '新加坡', x: 64, y: 92 },
];
const CITY_EDGES = [
  ['白泉镇', '无锡'], ['无锡', '北京'], ['北京', '首尔'], ['北京', '胡志明'],
  ['首尔', '杭州'], ['杭州', '雅加达'], ['雅加达', '曼谷'], ['曼谷', '新加坡'],
  ['新加坡', '长春'],
];

// —— 多维定位：出海期 vs 回迁期 ——
const RADAR_DIMS = ['地域跨度', '行业红利', '国际化', '组织规模', '风险敞口', '本地适应'];
const RADAR_SERIES = [
  { name: '出海峰值期（2018–2022）', color: '#e8a317', value: [95, 90, 92, 80, 45, 70] },
  { name: '回迁创业期（2023–2026）', color: '#22d3ee', value: [55, 40, 70, 30, 88, 45] },
];

// —— 互联网/出海红利窗口 vs 个人节奏 ——
const DIVIDEND_YEARS = ['2015', '2017', '2019', '2021', '2023', '2025', '2026'];
const DIVIDEND_WAVE = [55, 78, 92, 88, 62, 38, 30]; // 出海红利大势（示意）
const SELF_RHYTHM = [40, 65, 90, 95, 72, 50, 48]; // 个人在浪上的位置（示意）

// —— 履历锚点 ——
const CAREER = [
  { co: 'MetaDream · Bondee / Vibbe.ai', role: '东南亚增长运营负责人', span: '2023.11–至今', win: 'AI Agent 社交冷启动 · Gemini/Flux 微调 200+ NPC · 大五人格虚拟生态', color: '#fb923c' },
  { co: '哔哩哔哩 Bilibili', role: '国家经理 & 内容中台负责人', span: '2021.11–2022.12', win: '菲律宾/东南亚 1 号位 · DAU 0→300 万 · 次留 50%+ · ACG 渗透 0→17%', color: '#c41e3a' },
  { co: '蚂蚁集团 · 支付宝', role: '搜索推荐运营专家', span: '2020.07–2021.11', win: '亿级流量首页分发 · 内容化转型 Tab3 冷启动 · 行为经济学分析', color: '#8b5cf6' },
  { co: '快手 Kuaishou International', role: '东亚区域运营负责人', span: '2018.05–2020.07', win: '越南「老铁文化」出海 · Kwai 双榜第一 · 日活 50W+ · Snack Video 0-1', color: '#e8a317' },
  { co: '阿里 · 优酷土豆 + 青蜜科技', role: 'UGC 运营 / 大鱼号 / 播客主播', span: '2015.05–2018.05', win: '土豆短视频 UGC 单月 7.6 万条 · 内容签约结算 SOP · 高校科幻活动', color: '#10b981' },
];

// —— 能力栈 ——
const SKILLS = ['国际化增长 Global Growth', '社区生态构建', '跨国团队管理（中/印/菲/泰/越 50+）', 'P&L 经营分析', 'AIGC 应用', 'Gemini / Flux / Comfy UI', 'Cursor 10W+ 行', 'SEO & 增长策略', '日语 N2 · 英语 CET-6'];

// —— 35 岁的系统张力 ——
const TENSIONS = [
  { title: '红利窗口的关闭', subtitle: '时机不可重放', body: '2018–2022 出海红利是被时代调度上的那班车；窗口关上后，同样的打法不再有同样的弹性。',
    pillars: [['路径依赖', '出海 SOP 是资产也是包袱'], ['窗口', '不可逆的时间结构'], ['再校准', '从乘势到造势']] },
  { title: '地域的水土不服', subtitle: '东京湾的图纸落在松花江', body: '十年攒在一线与海外的方法论，回到东北中等城市后，节奏、资源密度、人才半径全部错配——回迁不是回家，是又一次跨地域迁移。',
    pillars: [['错配', '一线 SOP × 三线土壤'], ['半径', '人才与资本的稀薄'], ['重学', '把本地当新市场'] ] },
  { title: '35 岁的时钟中断', subtitle: '为自己而非为平台调度', body: '同辈时钟、创业现金流、身份从「大厂操盘手」重写为「独立进程」——迷茫是真的，但第一次，资源的分配权也真的在自己手里。',
    pillars: [['同辈时钟', '社会的默认计时器'], ['现金流', '自负盈亏的清醒'], ['主体性', '调度权的回收']] },
];

function migrationGraphOption() {
  const idx = Object.fromEntries(CITY_NODES.map((n, i) => [n.name, i]));
  const colorOf = (n) => (n.kind === 'now' ? '#22d3ee' : n.kind === 'origin' ? '#c41e3a' : '#e8a317');
  return {
    tooltip: { trigger: 'item', formatter: (p) => (p.dataType === 'edge' ? `${p.data.source} → ${p.data.target}` : p.name) },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    grid: { left: 8, right: 8, top: 12, bottom: 12 },
    series: [{
      type: 'graph', coordinateSystem: 'cartesian2d', layout: 'none',
      edgeSymbol: ['none', 'arrow'], edgeSymbolSize: 8,
      lineStyle: { color: 'rgba(232,163,23,0.45)', width: 1.4, curveness: 0.18 },
      label: { show: true, position: 'right', color: AX.text, fontSize: 11, fontFamily: 'var(--font-mono)' },
      symbolSize: (v, p) => (CITY_NODES[p.dataIndex]?.kind ? 18 : 12),
      itemStyle: { color: (p) => colorOf(CITY_NODES[p.dataIndex]) },
      data: CITY_NODES.map((n) => ({ name: n.name, value: [n.x, n.y], itemStyle: { color: colorOf(n) } })),
      links: CITY_EDGES.map(([s, t]) => ({ source: s, target: t })),
    }],
  };
}

function radarOption() {
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: AX.text, fontSize: 11 }, data: RADAR_SERIES.map((s) => s.name) },
    radar: {
      indicator: RADAR_DIMS.map((d) => ({ name: d, max: 100 })),
      axisName: { color: AX.text, fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: AX.split } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: RADAR_SERIES.map((s) => ({
        name: s.name, value: s.value,
        lineStyle: { color: s.color, width: 2 }, itemStyle: { color: s.color },
        areaStyle: { color: s.color, opacity: 0.12 },
      })),
    }],
  };
}

function dividendOption() {
  return {
    legend: { top: 0, textStyle: { color: AX.text, fontSize: 11 }, data: ['出海红利大势', '个人在浪上的位置'] },
    grid: { left: 36, right: 16, top: 30, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: DIVIDEND_YEARS, boundaryGap: false, axisLine: { lineStyle: { color: AX.line } }, axisLabel: { color: AX.text }, axisTick: { show: false } },
    yAxis: { type: 'value', max: 100, axisLine: { lineStyle: { color: AX.line } }, axisLabel: { color: AX.text }, splitLine: { lineStyle: { color: AX.split } } },
    series: [
      { name: '出海红利大势', type: 'line', smooth: true, symbol: 'none', areaStyle: { color: '#e8a317', opacity: 0.14 }, lineStyle: { width: 2, color: '#e8a317' }, data: DIVIDEND_WAVE,
        markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(196,30,58,0.5)', type: 'dashed' }, data: [{ xAxis: '2022', label: { formatter: '窗口收口', color: '#c41e3a', fontSize: 10 } }] } },
      { name: '个人在浪上的位置', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width: 2, color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, data: SELF_RHYTHM },
    ],
  };
}

export default function Page() {
  const [stage, setStage] = useState(MIGRATION.length - 1); // 默认停在「回迁·长春」

  const graphOpt = useMemo(migrationGraphOption, []);
  const radarOpt = useMemo(radarOption, []);
  const divOpt = useMemo(dividendOption, []);

  return (
    <div>
      <PageHeader
        badge="私享切片 · GY-∞ · 不入公开图谱"
        title="李贺 / 独菽 / Hayden · 一个进程的迁移日志"
        subtitle="1992 东辽白泉镇 spawn · 高考换页江南 · 进京挂载互联网 · 出海东亚东南亚 · fork 一次创业 · 回迁长春"
      />
      <IntroCard>
        把自己也当成一片人群切片来读：一个 1992 年从东北小镇启动的进程，靠高考被全国调度网捕获，
        在北京挂载互联网内核，赶上出海红利窗口被分发到东亚与东南亚多个地域，又主动 fork 出一次 AI 创业，
        最后回迁到距出生地 32 公里的长春。本页用全站一致的「系统 / 调度」语言，给这条轨迹做一次冷静的自我标定——
        既看清十年攒下的资产，也直面 35 岁这次时钟中断里的迷茫与不适应。口径：本人自述 + 简历公开口径，自画像、仅自用。
      </IntroCard>

      <Grid cols={4} className="mb-8">
        <Stat value="1992" label="启动年 · 东辽白泉镇" accent="#c41e3a" />
        <Stat value="7" label="迁居城市 · 含 5 国出海" accent="#22d3ee" />
        <Stat value="10年+" label="泛娱乐出海操盘" accent="#e8a317" />
        <Stat value="35" label="当前年龄 · 回迁长春" accent="#94a3b8" />
      </Grid>

      {/* ① 迁移日志 */}
      <Card title="① 迁移日志 · 一条被时代调度的轨迹">
        <TimelineBar stages={MIGRATION} activeIdx={stage} onSelect={setStage} />
      </Card>

      {/* ② 地理迁徙图 + 红利窗口 */}
      <Grid cols={2} className="mt-6">
        <Card title="② 地理迁徙轨迹 · 换页路径">
          <EChart option={graphOpt} style={{ height: 360 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            红=出生地（白泉镇）· 青=当前（长春）· 金=途经枢纽。出海十年把生活半径拉到五国，最后一条边又把它收回了东北原点附近。
          </p>
        </Card>
        <Card title="③ 红利窗口 vs 个人节奏 · 踩在浪上的十年">
          <EChart option={divOpt} style={{ height: 360 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            个人节奏几乎贴着出海红利大势爬升（2018–2021 同步见顶）；2022 窗口收口之后，势退而人未退——这正是回迁与迷茫的时间起点。（示意标定）
          </p>
        </Card>
      </Grid>

      {/* ④ 多维定位雷达 */}
      <Card title="④ 多维定位 · 出海峰值期 vs 回迁创业期" className="mt-6">
        <EChart option={radarOpt} style={{ height: 380 }} />
        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          同一个进程，两个版本：出海期地域跨度/红利/规模拉满、风险敞口低；回迁创业期规模与红利收缩、风险敞口陡升，
          国际化的底子还在，但「本地适应」成了新的短板维度。（自评示意）
        </p>
      </Card>

      {/* ⑤ 能力栈 */}
      <Card title="⑤ 能力栈 · 十年攒下的资产" className="mt-6">
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span key={s} className="text-xs mono px-3 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>{s}</span>
          ))}
        </div>
      </Card>

      {/* ⑥ 履历锚点 */}
      <Card title="⑥ 履历锚点 · 公开战绩" className="mt-6">
        <div className="space-y-2">
          {CAREER.map((c) => (
            <div key={c.co} className="os-card p-4" style={{ borderLeft: `3px solid ${c.color}` }}>
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.co}</span>
                <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{c.span}</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: c.color }}>{c.role}</div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{c.win}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ⑦ 35 岁的系统张力 */}
      <div className="mt-6">
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>⑦ 35 岁的系统张力 · 迷茫的结构</h3>
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          迷茫不是软弱，是几股力在同一时刻拉扯：窗口的不可重放、地域的错配、时钟的中断。把它拆开看，至少不再是一团模糊的焦虑。
        </p>
        <FrameworkTrio cards={TENSIONS} />
      </div>

      <ModuleFooter
        moduleId="haydenSlice"
        disclaimer="私享自画像 · 本人自述与简历公开口径 · 仅自用，非任何机构人事评价"
        sourceNote="数据锚点：个人简历（2026-01）· 迁徙/红利/雷达为本人自评示意标定"
      />
    </div>
  );
}
