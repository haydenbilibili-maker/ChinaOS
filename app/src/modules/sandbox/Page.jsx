import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import { IntroCard, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { CRISIS_DOMAINS, CRISES, TOOLS, mitigatedImpact, compositeImpact, buildCrisisReport } from './crisisData.js';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';
import DataBus from '../../lib/data/DataBus.js';
import * as DB from '../../lib/db/localdb.js';
import { useDataset, useFigures } from '../../lib/db/useDataset.js';
import { Link } from 'react-router-dom';

// ============================================================================
// 治国沙盒 · 区域治理人才配置 + 熵增监控（实测）
// ----------------------------------------------------------------------------
// 熵增指数为「实测」：经 DataBus 加载 2023 年各省财政决算/统计公报真实数据
// （public/data/province-stats.json），按公式现场计算，非手设示意值。
//   熵增指数 = 0.4×(100−财政自给率) + 0.3×min(100, 债务率/3)
//            + 0.3×min(100, 人口流出强度‰×12)
// 人才配置训练逻辑：挑战画像 → 能力需求 → 履历池匹配（画像而非真人）。
// 声明：人才均为「画像/原型」，不指向任何真实人事评价。
// ============================================================================

function entropyOf(p) {
  const fiscalGap = 100 - p.fiscal_self;
  const debtScore = Math.min(100, p.debt_ratio / 3);
  const outflowPerMille = Math.max(0, -p.pop_change) / p.pop * 1000;
  const outflowScore = Math.min(100, outflowPerMille * 12);
  return Math.round(0.4 * fiscalGap + 0.3 * debtScore + 0.3 * outflowScore);
}

// 东北样板人才配置（训练画像）
const CONFIG = {
  '黑龙江省': {
    tag: '东北样板 · 已配置',
    challenge: '人口净流出全国前列 · 财政自给率低 · 资源型城市转型（鹤岗/双鸭山）· 粮食安全压舱石 · 对俄边境口岸带',
    radar: [30, 25, 40, 95, 80, 55],
    team: [
      ['省委书记 · 画像', '中央空降型 + 农业/边疆治理复合履历。首要抓手是粮食安全政治责任与边境稳定，其次才是经济增长——KPI 权重与南方省份根本不同。'],
      ['省长 · 画像', '财经/国企背景的「债务外科医生」：处理财政倒挂、资源型城市退出与转移支付谈判，需要对央地财政规则的精细操作能力。'],
      ['哈尔滨市委书记 · 关键岗', '省会首位度高但辐射力弱，需「振兴标杆」操盘手：对俄合作枢纽 + 冰雪经济 + 留人工程的组合拳。'],
      ['边境州市主官 · 关键岗', '黑河/绥芬河等口岸城市：稳边固防优先于发展指标，需边疆民族与外事复合经验。'],
    ],
    kpi: '粮食产能 > 稳边固防 > 民生兜底 > GDP 增速',
  },
  '吉林省': {
    tag: '东北样板 · 已配置',
    challenge: '一汽独大 · 产业结构单一 · 人口流失 · 长春首位度极高 · 图们江出海口与半岛地缘风险',
    radar: [35, 30, 45, 85, 75, 50],
    team: [
      ['省委书记 · 画像', '产业转型操盘手：汽车/装备制造背景优先——核心命题是「一汽电动化转型」这一仗输不起，需要协调央企总部与地方利益的能级。'],
      ['省长 · 画像', '央企/工信系统出身，能直接对话一汽集团与工信部；同时处理人口收缩下的财政与公共服务再布局。'],
      ['长春市委书记 · 关键岗', '省会占全省经济半壁，实质是「第二省长」：汽车城转型 + 都市圈收缩式规划双重任务。'],
      ['延边州委书记 · 关键岗', '朝鲜族自治州 + 对朝边境：民族政策与地缘风险管理优先，需民族地区履历。'],
    ],
    kpi: '汽车产业转型 > 粮食产能 > 边境与民族稳定 > 人口留存',
  },
  '辽宁省': {
    tag: '东北样板 · 已配置',
    challenge: '数据挤水分后的信用修复 · 「投资不过山海关」营商环境 · 央企国企重镇 · 大连港航 + 海军母港配套',
    radar: [50, 40, 60, 60, 70, 60],
    team: [
      ['省委书记 · 画像', '政治整肃 + 营商环境重建双重任务：纪检或经济大省主政履历，核心是重建「山海关内外」的制度信用。'],
      ['省长 · 画像', '金融/国资背景：辽宁是国企改革深水区，需处理债务重组、央企地方协同与「链主」再造。'],
      ['沈阳/大连双核主官 · 关键岗', '沈阳抓装备制造与都市圈，大连抓港航开放与海防配套——双核分工明确，互不内耗。'],
      ['省国资委主任 · 关键岗', '国企改革的实际执行人：混改、重组与「一利五率」考核落地。'],
    ],
    kpi: '营商环境修复 > 国企改革 > 海防配套 > 增长质量',
  },
  '新疆维吾尔自治区': {
    tag: '边疆带 · 已配置',
    challenge: '反恐维稳与长治久安 · 民族团结 · 油气煤与棉花保供 · 一带一路核心区 · 兵团特殊体制 · 南北疆发展落差',
    radar: [30, 55, 50, 60, 98, 95],
    team: [
      ['自治区党委书记 · 画像', '维稳、民族与发展「三位一体」操盘手，通常高配（政治局委员级）。社会稳定与长治久安是压倒一切的总目标，经济增长服从于此。'],
      ['政府主席 · 画像', '少数民族干部惯例，主抓民生改善、就业与南疆脱贫成果巩固；以发展促稳定、以民生赢人心。'],
      ['新疆生产建设兵团司令员 · 关键岗', '党政军企合一的特殊体制：屯垦戍边、维稳支援与向南发展，需军地协调与组织动员能级。'],
      ['喀什/和田地委书记 · 关键岗', '南疆反恐维稳前沿：基层组织、去极端化与产业就业（劳动密集型）的复合任务。'],
    ],
    kpi: '社会稳定与长治久安 > 民族团结 > 能源/棉花保供 > 一带一路核心区 > 增长',
  },
  '西藏自治区': {
    tag: '边疆带 · 已配置',
    challenge: '反分裂与中印边境国防 · 宗教事务管理 · 国家生态安全屏障 · 财政自给率全国最低（近乎全靠转移支付）· 极端低人口承载',
    radar: [10, 35, 25, 30, 100, 85],
    team: [
      ['自治区党委书记 · 画像', '反分裂、边防与宗教事务三重高压任务，高配。核心是国家安全与主权完整，几乎不以 GDP 论英雄。'],
      ['政府主席 · 画像', '藏族干部惯例，主抓民生兜底、生态保护与对口援藏资源落地。'],
      ['军地协调一线主官 · 关键岗', '中印边境实控线一线：稳边固防、兴边富民与突发事件处置，需军地一体经验。'],
      ['宗教事务/统战主官 · 关键岗', '寺庙管理、活佛转世规制与意识形态阵地，是长治久安的关键变量。'],
    ],
    kpi: '反分裂与边防 > 宗教事务管理 > 生态屏障 > 民生兜底 > 增长（弱考核）',
  },
  '云南省': {
    tag: '边疆带 · 已配置',
    challenge: '中缅老越边境 + 缅北电诈/毒品跨境治理 · 25 个世居少数民族 · 生物多样性屏障 · 面向南亚东南亚辐射中心 · 中老铁路通道',
    radar: [33, 50, 45, 55, 90, 80],
    team: [
      ['省委书记 · 画像', '强边固防 + 打击跨境犯罪（电诈/毒品）+ 民族团结复合操盘手，对外事与政法系统协同要求高。'],
      ['省长 · 画像', '面向南亚东南亚开放枢纽建设：中老铁路经济带、口岸经济与文旅，外向型经济履历优先。'],
      ['德宏/西双版纳/普洱州市主官 · 关键岗', '跨境治理一线：边民管理、缅北遣返协作与口岸管控的高强度复合任务。'],
      ['禁毒/打击跨境犯罪专班 · 关键岗', '毒品与电诈跨境产业链打击，需政法、外事与情报协同的特战能力。'],
    ],
    kpi: '强边固防与跨境犯罪打击 > 民族团结 > 沿边开放（中老铁路）> 生态屏障 > 增长',
  },
  '内蒙古自治区': {
    tag: '边疆带 · 已配置',
    challenge: '能源保供基地（煤电外送/风光大基地）· 草原荒漠化生态屏障 · 中蒙俄边境 · 民族团结 · 煤炭领域反腐倒查 ·「两个屏障」定位',
    radar: [42, 45, 65, 70, 75, 65],
    team: [
      ['自治区党委书记 · 画像', '「两个屏障」（北疆安全稳定 + 北方生态安全）操盘手，叠加煤炭反腐与能源保供政治责任，需纪律与发展双能力。'],
      ['政府主席 · 画像', '蒙古族干部惯例，主抓能源经济（煤电、风光大基地外送）与生态修复的协同。'],
      ['能源/电力外送统筹岗 · 关键岗', '保障东送电力与煤炭稳价稳供，是全国能源安全的关键节点。'],
      ['边境盟市主官 · 关键岗', '中蒙俄口岸（满洲里/二连浩特）通道治理与兴边富民。'],
    ],
    kpi: '生态屏障 > 能源保供（外送）> 民族团结与边防 > 反腐倡廉 > 增长',
  },
};

const RADAR_IND = [
  { name: '财政自给', max: 100 }, { name: '人口活力', max: 100 }, { name: '产业动能', max: 100 },
  { name: '粮食权重', max: 100 }, { name: '边防敏感', max: 100 }, { name: '维稳压力', max: 100 },
];

const SCENARIOS = {
  fiscal: { label: '财政持续恶化', rec: '配置向「财经型省长」倾斜：转移支付谈判与债务重组能力优先；压缩基建类 KPI，民生兜底刚性化；省财政厅长升格为班子核心岗。对应熵增信号：财政自给率连续下行 + 城投利差走阔。' },
  population: { label: '人口加速流失', rec: '引入「收缩式规划」人才：公共服务按实际常住人口再布局（学校/医院合并），停止按户籍规模铺摊子；省会主官改配「留人工程」操盘手——产业留人优于补贴留人。对应熵增信号：小学在校生数领先指标恶化。' },
  breakthrough: { label: '产业突破窗口', rec: '书记改配「产业操盘手」型：扩大容错授权与「揭榜挂帅」，KPI 从均衡考核切换为单点突破（如吉林押注一汽电动化）；引入科创/链主企业背景副省长，打通央企总部资源。对应信号：细分赛道全国份额拐点。' },
};

// ============================================================================
// 国家级危机情景引擎：数据与算法层抽至 ./crisisData.js（含缓解矩阵/复合耦合/报告生成）

export default function Page() {
  const [sel, setSel] = useState('黑龙江省');
  const [scn, setScn] = useState('fiscal');
  const [crisisKey, setCrisisKey] = useState('chipBan');
  const [secondCrisis, setSecondCrisis] = useState(''); // 复合危机叠加（空=单一情景）
  const [alloc, setAlloc] = useState({ fiscal: 20, monetary: 20, industry: 20, diplomacy: 20, mobilize: 20 }); // 政策资源 Σ≤100
  const [reportMd, setReportMd] = useState('');
  const [reportCopied, setReportCopied] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [national, setNational] = useState(null); // WB 实时全国基线
  const [natState, setNatState] = useState('loading'); // loading | live | offline

  // ★ 数据↔模块联动：从本地库读省级数据（写入即刷新）；库中无则自播种自 JSON 快照
  const { rows: dbRows, ready } = useDataset('stock_province-stats');
  const figures = useFigures();
  const source = dbRows ? 'db' : 'local';
  useEffect(() => {
    if (ready && !dbRows) {
      DataBus.getJSON('data/province-stats.json').then((j) => DB.putDataset({
        id: 'stock_province-stats', name: '省级财政/人口/债务（实测）', category: '经济运行',
        source: j.meta?.source || '统计公报 2023', origin: 'stock', rows: j.provinces, stampMs: Date.now(),
      }));
    }
  }, [ready, dbRows]);
  useEffect(() => {
    DataBus.chinaIndicators()
      .then((r) => { setNational(r); setNatState(r.gdpGrowth || r.population ? 'live' : 'offline'); })
      .catch(() => setNatState('offline'));
  }, []);

  // 实测熵增指数（由本地库真实数据现场计算）
  const computed = useMemo(() => {
    if (!dbRows) return null;
    const rows = dbRows.map((p) => ({ ...p, entropy: entropyOf(p) }));
    rows.sort((a, b) => b.entropy - a.entropy);
    return rows;
  }, [dbRows]);

  const metrics = useMemo(() => {
    if (!computed) return [];
    return [
      { key: 'entropy', label: '熵增指数(实测)', valueName: '熵增指数(实测)', max: 80, data: computed.map((p) => ({ name: p.name, value: p.entropy })) },
      { key: 'fiscal', label: '财政自给率', valueName: '财政自给率(%)', max: 90, data: computed.map((p) => ({ name: p.name, value: p.fiscal_self })) },
      { key: 'pop', label: '人口净变动', valueName: '人口净变动(万)', max: 50, data: computed.map((p) => ({ name: p.name, value: p.pop_change })) },
    ];
  }, [computed]);

  const cfg = CONFIG[sel];
  const row = computed ? computed.find((p) => p.name === sel) : null;
  const rank = row && computed ? computed.indexOf(row) + 1 : null;

  const top10Option = useMemo(() => {
    if (!computed) return null;
    const top = computed.slice(0, 10).reverse();
    return {
      grid: { left: 110, right: 30, top: 10, bottom: 24 },
      xAxis: { type: 'value', max: 80, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
      yAxis: { type: 'category', data: top.map((p) => p.name.replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '')), axisLine: { lineStyle: { color: '#27324a' } } },
      series: [{ type: 'bar', data: top.map((p) => p.entropy), barWidth: 12, itemStyle: { color: '#c41e3a', borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }],
    };
  }, [computed]);

  // ── 国家级危机情景引擎：缓解矩阵 + 复合耦合（算法层见 crisisData.js） ──
  const crisis = useMemo(() => (
    secondCrisis && secondCrisis !== crisisKey
      ? compositeImpact(CRISES[crisisKey], CRISES[secondCrisis], intensity)
      : CRISES[crisisKey]
  ), [crisisKey, secondCrisis, intensity]);
  const allocTotal = TOOLS.reduce((sum, t) => sum + alloc[t.id], 0);
  const engine = useMemo(() => mitigatedImpact(crisis, intensity, alloc), [crisis, intensity, alloc]);
  const crisisScore = engine.score;
  const crisisVerdict = { tier: engine.verdict[0], color: engine.verdict[1], read: engine.verdict[2] };
  // 应对前 vs 应对后 双系列对比
  const crisisOption = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['应对前', '应对后'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, itemWidth: 10, itemHeight: 10 },
    grid: { left: 44, right: 24, top: 26, bottom: 16 },
    xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    yAxis: { type: 'category', data: [...CRISIS_DOMAINS].reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
    series: [
      { name: '应对前', type: 'bar', barWidth: 8, data: [...engine.raw].reverse(), itemStyle: { color: 'rgba(196,30,58,0.35)', borderRadius: [0, 3, 3, 0] } },
      { name: '应对后', type: 'bar', barWidth: 8, data: [...engine.net].reverse(), itemStyle: { color: '#c41e3a', borderRadius: [0, 3, 3, 0] } },
    ],
  }), [engine]);
  // 应对小组组建器：按危机画像关键词在真实履历池打分匹配（画像推演，非人事评价）
  const team = useMemo(() => {
    if (!figures || !crisis.talentKeywords) return [];
    return figures
      .map((f) => {
        const hay = [f.raw, f.org, f.fields?.title, ...(f.career || []).map((c) => c.desc)].filter(Boolean).join(' ');
        const hits = crisis.talentKeywords.filter((k) => hay.includes(k));
        return hits.length ? { name: f.name, title: f.fields?.title || f.org || f.role || '', score: hits.length, hits } : null;
      })
      .filter(Boolean)
      .sort((x, y) => y.score - x.score)
      .slice(0, 5);
  }, [figures, crisis]);
  const genReport = () => {
    setReportMd(buildCrisisReport({ crisisLabel: crisis.label, intensity, alloc, raw: engine.raw, net: engine.net, score: engine.score, verdict: engine.verdict, team }));
    setReportCopied(false);
  };
  const copyReport = async () => {
    try { await navigator.clipboard.writeText(reportMd); setReportCopied(true); setTimeout(() => setReportCopied(false), 2000); } catch (_) { /* noop */ }
  };

  return (
    <div>
      <PageHeader
        badge="Sandbox · 思维训练 + 实测熵增"
        title="治国沙盒 · 区域治理人才配置"
        subtitle="挑战画像 → 能力需求 → 履历池匹配 —— 全国基线实时(WB)、省级熵增实测、东北+边疆带 7 省人才配置"
      />
      <IntroCard>
        治理的第一道工序是「把对的人放进对的省」。本沙盘把每个省域的问题<strong style={{ color: 'var(--text-primary)' }}>向量化</strong>，推导主政能力需求，再从履历池匹配班子<strong style={{ color: 'var(--text-primary)' }}>画像</strong>。熵增指数由各省<strong style={{ color: 'var(--text-primary)' }}>真实财政/人口/债务数据</strong>现场计算。已配置 7 省：东北三省 + 边疆带四省区——两类省份的挑战向量根本不同。
      </IntroCard>
      <Grid cols={4} className="mb-6">
        <Stat value={computed ? (source === 'db' ? '31 · 本地库' : '31 · 快照') : '加载中…'} label="省级数据态（联动）" accent="#22d3ee" />
        <Stat value="7 / 31" label="人才已配置（东北+边疆带）" accent="#10b981" />
        <Stat value={computed ? computed[0].name.replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '') + ' ' + computed[0].entropy : '—'} label="熵增最高省（实测）" accent="#c41e3a" />
        <Stat value="2023" label="省级数据年份（公报口径）" accent="#e8a317" />
      </Grid>

      <Card title="全国实时基线 · World Bank API" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: natState === 'live' ? 'rgba(16,185,129,0.16)' : 'var(--bg-elevated)', color: natState === 'live' ? '#10b981' : 'var(--text-tertiary)' }}>
            {natState === 'live' ? '● 实时已连通' : natState === 'loading' ? '○ 连接中…' : '○ 离线兜底'}
          </span>
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>api.worldbank.org · 每次加载实时拉取最新非空值</span>
        </div>
        {natState === 'live' ? (
          <Grid cols={3}>
            <Stat value={national.gdpGrowth ? `${national.gdpGrowth.value.toFixed(2)}%` : '—'} label={`GDP 增速 · ${national.gdpGrowth?.date || ''}（实时）`} accent="#c41e3a" />
            <Stat value={national.population ? `${(national.population.value / 1e8).toFixed(2)} 亿` : '—'} label={`总人口 · ${national.population?.date || ''}（实时）`} accent="#22d3ee" />
            <Stat value={national.gdp ? `${(national.gdp.value / 1e12).toFixed(1)} 万亿$` : '—'} label={`GDP 现价 · ${national.gdp?.date || ''}（实时）`} accent="#e8a317" />
          </Grid>
        ) : (
          <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
            {natState === 'loading' ? '// 正在连接世界银行 API…' : '// WB API 暂不可达；省级熵增仍按本地快照实测运行。'}
          </p>
        )}
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>全国基线为真·实时 API（WB）；省级粒度无免费公开实时源，故用 2023 公报快照（DataBus 已留 remote 接口，配置 <span className="mono">VITE_PROVINCE_API</span> 即自动切「实时」并标注）。</p>
      </Card>

      <Card title="省域熵增地图（实测 · 可切换指标 · 点击省份调出配置）" className="mb-6">
        {metrics.length > 0 ? (
          <ChinaMap metrics={metrics} enableDrill={false} onRegionClick={(name) => setSel(name)} style={{ height: 460 }} />
        ) : (
          <div className="mono text-xs py-20 text-center" style={{ color: 'var(--text-tertiary)' }}>// 加载省级数据…</div>
        )}
        <p className="text-[11px] mt-2 mono" style={{ color: 'var(--text-tertiary)' }}>
          熵增指数 = 0.4×(100−财政自给率) + 0.3×min(100, 债务率/3) + 0.3×min(100, 人口流出强度‰×12)
        </p>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title={`${sel} · 治理体征`}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: cfg ? 'rgba(16,185,129,0.15)' : 'var(--bg-elevated)', color: cfg ? '#10b981' : 'var(--text-tertiary)' }}>{cfg ? cfg.tag : '人才待配置'}</span>
            {row && <span className="text-[11px] mono" style={{ color: 'var(--fire-gold)' }}>熵增 {row.entropy}（实测 · 全国第 {rank}）</span>}
          </div>
          {row && (
            <Grid cols={4} className="mb-3">
              <Stat value={`${row.fiscal_self}%`} label="财政自给率" accent={row.fiscal_self < 35 ? '#c41e3a' : '#22d3ee'} />
              <Stat value={`${row.pop} 万`} label="常住人口" />
              <Stat value={`${row.pop_change > 0 ? '+' : ''}${row.pop_change} 万`} label="年净变动" accent={row.pop_change < 0 ? '#c41e3a' : '#10b981'} />
              <Stat value={`~${row.debt_ratio}%`} label="债务率(估)" accent={row.debt_ratio > 200 ? '#e8a317' : undefined} />
            </Grid>
          )}
          {cfg ? (
            <>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>挑战画像：</span>{cfg.challenge}</p>
              <EChart option={{
                radar: { indicator: RADAR_IND, axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
                series: [{ type: 'radar', data: [{ value: cfg.radar, name: sel, lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
              }} style={{ height: 200 }} />
            </>
          ) : (
            <div className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              <p className="mb-2">该省人才尚未配置。按方法论生成：</p>
              <p className="mono text-xs">1. 挑战画像 → 六维打分（实测体征已就位）<br />2. 能力需求 → 由短板与政治权重推导主政画像<br />3. 履历池匹配 → 书记/省长/省会主官/关键厅局逐岗配置</p>
              <p className="mt-2 text-xs">扩展队列：东北 ✅ · 边疆带（新疆/西藏/云南/内蒙古）✅ → 债务带（贵州/甘肃/天津）→ 沿海大省 → 全部省会。</p>
            </div>
          )}
        </Card>

        <Card title={cfg ? `${sel} · 班子配置（画像）` : '熵增监控 · 实测 Top 10'}>
          {cfg ? (
            <>
              <div className="space-y-3">
                {cfg.team.map(([t, d]) => (
                  <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                    <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <span className="text-[10px] mono uppercase" style={{ color: 'var(--cyber-cyan)' }}>KPI 权重序</span>
                <p className="text-xs mt-1 mono" style={{ color: 'var(--text-primary)' }}>{cfg.kpi}</p>
              </div>
            </>
          ) : (
            top10Option && <EChart option={top10Option} style={{ height: 320 }} />
          )}
        </Card>
      </Grid>

      <Card title={`可选简历 · 匹配「${sel.replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '')}」（来自简历库）`} className="mb-6">
        {(() => {
          const short = sel.replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
          const matched = (figures || []).filter((f) => f.province === sel || (f.raw && f.raw.includes(short)) || (f.fields?.native && f.fields.native.includes(short)));
          if (figures === null) return <div className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>// 加载简历库…</div>;
          if (!matched.length) return (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              中国政要库中暂无匹配「{short}」的履历。到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座 · 人才精英</Link> 上传并解析（含该省份关键词即自动关联）。
            </p>
          );
          return (
            <Grid cols={3}>
              {matched.map((f) => (
                <div key={f.id} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{f.fields?.title || ''}{f.fields?.edu ? ' · ' + f.fields.edu : ''}</div>
                  {f.career?.length > 0 && <div className="text-[11px] mt-1 mono" style={{ color: 'var(--cyber-cyan)' }}>履历 {f.career.length} 条 · 最近 {f.career[0]?.from}</div>}
                </div>
              ))}
            </Grid>
          );
        })()}
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>简历由数据底座 admin 上传解析、按省份关键词自动关联；均为用户提供的政要公开任职信息，供研究检索，不构成人事评价。</p>
      </Card>

      <Card title="熵增监控 · 实测 Top 10（全国）" className="mb-6">
        {top10Option ? <EChart option={top10Option} style={{ height: 280 }} /> : <div className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>// 加载中…</div>}
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>由 2023 年各省真实财政自给率、人口净变动与债务率估算计算；与 china.html 熵增监控的全国模型（Net_Entropy = Aging/25 − Tech/100）构成「全国—省域」两层监控。指数持续抬升即触发情景推演与班子再配置。</p>
      </Card>

      <Card title="情景推演 · 条件变化时班子如何调整（点击切换）" className="mb-6">
        <div className="flex gap-1 flex-wrap mb-3">
          {Object.keys(SCENARIOS).map((k) => (
            <button key={k} onClick={() => setScn(k)} className="text-xs px-3 py-1 rounded mono"
              style={{ background: k === scn ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === scn ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
              {SCENARIOS[k].label}
            </button>
          ))}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{SCENARIOS[scn].rec}</p>
      </Card>

      {/* ════════ 国家级危机情景引擎（压力测试） ════════ */}
      <div className="os-card p-5 mb-6" style={{ borderColor: `${crisis.color}66` }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div>
            <div className="text-[10px] mono uppercase tracking-wider" style={{ color: crisis.color }}>Crisis Engine · 国家级压力测试</div>
            <h3 className="text-base font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>危机情景引擎 · 六情景 × 烈度推演</h3>
          </div>
          <div className="text-right">
            <span className="text-[11px] mono px-2.5 py-1 rounded" style={{ background: `${crisisVerdict.color}22`, color: crisisVerdict.color, border: `1px solid ${crisisVerdict.color}55` }}>
              总冲击 {crisisScore} · {crisisVerdict.tier}
            </span>
          </div>
        </div>

        <div className="flex gap-1 flex-wrap mb-4">
          {Object.keys(CRISES).map((k) => (
            <button key={k} onClick={() => setCrisisKey(k)} className="text-xs px-3 py-1 rounded mono"
              style={{
                background: k === crisisKey ? `${CRISES[k].color}26` : 'var(--bg-elevated)',
                color: k === crisisKey ? CRISES[k].color : 'var(--text-secondary)',
                border: k === crisisKey ? `1px solid ${CRISES[k].color}66` : '1px solid transparent', cursor: 'pointer',
              }}>
              {CRISES[k].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>烈度 0—100</span>
          <input type="range" min={0} max={100} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))}
            style={{ width: '100%', accentColor: crisis.color }} />
          <span className="text-sm mono font-semibold w-10 text-right shrink-0" style={{ color: crisis.color }}>{intensity}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-[11px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>叠加第二危机</span>
          <button onClick={() => setSecondCrisis('')} className="text-[10px] px-2 py-0.5 rounded mono"
            style={{ background: !secondCrisis ? 'rgba(148,163,184,0.18)' : 'var(--bg-elevated)', color: !secondCrisis ? 'var(--text-primary)' : 'var(--text-tertiary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>无</button>
          {Object.keys(CRISES).filter((k) => k !== crisisKey).map((k) => (
            <button key={k} onClick={() => setSecondCrisis(secondCrisis === k ? '' : k)} className="text-[10px] px-2 py-0.5 rounded mono"
              style={{ background: secondCrisis === k ? 'rgba(239,68,68,0.2)' : 'var(--bg-elevated)', color: secondCrisis === k ? '#ef4444' : 'var(--text-tertiary)', border: `1px solid ${secondCrisis === k ? '#ef444466' : 'var(--border-subtle)'}`, cursor: 'pointer' }}>
              + {CRISES[k].label}
            </button>
          ))}
          {secondCrisis && <span className="text-[10px] mono" style={{ color: '#ef4444' }}>⚠ 非线性耦合：救援资源互相挤占，工具效力打 85 折</span>}
        </div>

        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)' }}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="text-[10px] mono uppercase" style={{ color: 'var(--cyber-cyan)' }}>政策资源配置器 · 预算 100 点</span>
            <span className="flex items-center gap-2">
              <span className="text-[11px] mono" style={{ color: allocTotal > 100 ? '#ef4444' : allocTotal === 100 ? '#10b981' : 'var(--text-secondary)' }}>已配 {allocTotal} / 100</span>
              <button onClick={() => setAlloc({ fiscal: 0, monetary: 0, industry: 0, diplomacy: 0, mobilize: 0 })} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>清零</button>
            </span>
          </div>
          <Grid cols={5}>
            {TOOLS.map((t) => {
              const others = allocTotal - alloc[t.id];
              const max = Math.max(0, 100 - others);
              return (
                <div key={t.id}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span style={{ color: t.color }}>{t.label}</span>
                    <span className="mono" style={{ color: 'var(--text-secondary)' }}>{alloc[t.id]}</span>
                  </div>
                  <input type="range" min={0} max={100} value={alloc[t.id]}
                    onChange={(e) => { const v = Math.min(Number(e.target.value), max); setAlloc((prev) => ({ ...prev, [t.id]: v })); }}
                    style={{ width: '100%', accentColor: t.color }} />
                  <p className="text-[9px] leading-snug mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{t.desc}</p>
                </div>
              );
            })}
          </Grid>
          <p className="text-[10px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
            缓解量 = Σ 工具点数 × 该工具对各域的边际效率（工具-危机错配则边际趋零：货币宽松救不了芯片断供）· 总冲击 {Math.round(engine.raw.reduce((x, y) => x + y, 0) / 6)} → {crisisScore}
          </p>
        </div>

        <Grid cols={2}>
          <div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>机理：</span>{crisis.intro}
            </p>
            <div className="text-[10px] mono uppercase mb-2" style={{ color: crisis.color }}>传导链（{crisis.chain.length} 步）</div>
            <div className="space-y-1.5 mb-4" style={{ borderLeft: `2px solid ${crisis.color}44`, paddingLeft: 10 }}>
              {crisis.chain.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="text-[10px] mono w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${crisis.color}22`, color: crisis.color }}>{i + 1}</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded mb-3" style={{ background: 'var(--bg-elevated)' }}>
              <span className="text-[10px] mono uppercase" style={{ color: crisisVerdict.color }}>判定 · {crisisVerdict.tier}</span>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{crisisVerdict.read}</p>
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>先行指标：</span>
              {crisis.watch.join(' · ')}（详见 <Link to="/watchtower" className="mono" style={{ color: 'var(--cyber-cyan)' }}>风险瞭望塔</Link>）
            </div>
          </div>

          <div>
            <div className="text-[10px] mono uppercase mb-1" style={{ color: '#93a1b5' }}>六域冲击 · 应对前 vs 应对后（烈度 {intensity} · 已配 {allocTotal} 点）</div>
            <EChart option={crisisOption} style={{ height: 230 }} />
            <div className="text-[10px] mono uppercase mt-3 mb-2" style={{ color: crisis.color }}>应对工具箱</div>
            <div className="space-y-2 mb-3">
              {crisis.toolbox.map(([t, d]) => (
                <div key={t} style={{ borderLeft: `2px solid ${crisis.color}`, paddingLeft: 10 }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded" style={{ background: 'var(--bg-elevated)' }}>
              <span className="text-[10px] mono uppercase" style={{ color: 'var(--fire-gold)' }}>班子画像需求</span>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {crisis.talentNeed} <Link to="/talent" className="mono" style={{ color: 'var(--cyber-cyan)' }}>→ 干部画像库</Link>
              </p>
            </div>
            <div className="p-3 rounded mt-3" style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <span className="text-[10px] mono uppercase" style={{ color: 'var(--fire-gold)' }}>应对小组自动组建 · 履历池画像匹配 Top5</span>
              {!team.length && <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>// 履历池加载中或无匹配（到人才库载入内置数据后重试）</p>}
              <div className="space-y-1.5 mt-2">
                {team.map((m) => (
                  <div key={m.name + m.title} className="flex items-center gap-2">
                    <span className="text-xs font-semibold shrink-0" style={{ color: 'var(--text-primary)' }}>{m.name}</span>
                    <span className="text-[10px] truncate flex-1" style={{ color: 'var(--text-tertiary)' }}>{m.title}</span>
                    <span className="flex gap-1 shrink-0">
                      {m.hits.slice(0, 3).map((h) => (
                        <span key={h} className="text-[9px] mono px-1 rounded" style={{ background: 'rgba(212,175,55,0.14)', color: 'var(--fire-gold)' }}>{h}</span>
                      ))}
                    </span>
                    <span className="text-[10px] mono shrink-0" style={{ color: 'var(--cyber-cyan)' }}>匹配 {m.score}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] mt-2" style={{ color: 'var(--text-tertiary)' }}>按履历关键词命中自动排序——画像匹配仅供推演，不构成人事评价。</p>
            </div>
          </div>
        </Grid>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button onClick={genReport} className="os-btn os-btn-primary os-btn-sm">生成推演报告</button>
          {reportMd && <button onClick={copyReport} className="os-btn os-btn-sm">{reportCopied ? '✓ 已复制' : '复制 Markdown'}</button>}
          <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>聚合 情景×烈度×配置×判定×小组 为可归档推演纪要</span>
        </div>
        {reportMd && (
          <pre className="os-card p-4 mt-3 text-xs mono" style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', maxHeight: 260, overflowY: 'auto', lineHeight: 1.7, background: 'var(--bg-elevated)' }}>{reportMd}</pre>
        )}
        <p className="text-[11px] mt-4" style={{ color: 'var(--text-tertiary)' }}>
          情景为思想实验/压力测试框架，非预测；传导系数为示意标定，烈度由用户设定，不构成对任何事件概率的判断。
        </p>
      </div>

      <FrameworkTrio cards={[
        { title: '盐铁逻辑', subtitle: '命脉省域 · 压舱石', body: '东北粮食安全、边疆稳边固防、能源保供——这些省份的 KPI 权重与南方增长型省份根本不同，是当代盐铁专营的地理映射。', pillars: [['粮食', '政治责任压舱石。'], ['边疆', '稳边固防优先。'], ['财政', '倒挂与转移支付。']] },
        { title: '摸石头方法论', subtitle: '画像 · 灰度 · 迭代', body: '人才均为画像/原型而非真人评价——通过挑战向量推导能力需求，在履历池中灰度匹配，是组织算法的训练沙盒。', pillars: [['向量化', '省域挑战画像。'], ['匹配', '履历池联动。'], ['情景', '条件变化推演。']] },
        { title: '升级路径', subtitle: '从熵增到再配置', body: '熵增指数持续抬升即触发班子再配置推演——财政倒挂、人口流出、债务压力的三维合成，是治理精度的量化入口。', pillars: [['实测', '2023 公报口径。'], ['全国', 'WB 实时基线。'], ['监控', 'Top10 预警。']] },
      ]} />

      <ModuleFooter moduleId="sandbox" disclaimer="人才均为画像/原型，不构成对任何真实人物或人事安排的评价；熵增公式为训练模型，不替代官方统计口径" />
    </div>
  );
}
