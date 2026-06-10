import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';

// ============================================================================
// 治国沙盒 · 区域治理人才配置（思维训练沙盘）
// ----------------------------------------------------------------------------
// 训练逻辑：省域挑战画像（向量化）→ 主政能力需求 → 履历池匹配（画像而非真人）。
// 东北三省为已配置样板；其余省份按同一方法论模板逐步扩展（→ 全部省级+省会）。
// 声明：本沙盘为治理思维训练模型，人才均为「画像/原型」，不指向任何真实人事评价。
// ============================================================================

// 省域治理挑战指数（示意 · 越高越难）——地图着色用
const CHALLENGE = [
  { name: '新疆维吾尔自治区', value: 92 }, { name: '西藏自治区', value: 90 }, { name: '黑龙江省', value: 88 },
  { name: '吉林省', value: 82 }, { name: '甘肃省', value: 80 }, { name: '辽宁省', value: 78 },
  { name: '贵州省', value: 76 }, { name: '青海省', value: 75 }, { name: '云南省', value: 74 },
  { name: '山西省', value: 72 }, { name: '宁夏回族自治区', value: 72 }, { name: '内蒙古自治区', value: 70 },
  { name: '广西壮族自治区', value: 68 }, { name: '河北省', value: 66 }, { name: '天津市', value: 65 },
  { name: '河南省', value: 64 }, { name: '四川省', value: 62 }, { name: '江西省', value: 60 },
  { name: '陕西省', value: 60 }, { name: '湖南省', value: 58 }, { name: '海南省', value: 58 },
  { name: '湖北省', value: 56 }, { name: '重庆市', value: 55 }, { name: '安徽省', value: 54 },
  { name: '山东省', value: 52 }, { name: '北京市', value: 48 }, { name: '福建省', value: 45 },
  { name: '上海市', value: 42 }, { name: '广东省', value: 40 }, { name: '江苏省', value: 38 },
  { name: '浙江省', value: 35 },
];

// 已配置省份（东北样板）：挑战画像 → 体征雷达 → 班子画像 → KPI 权重
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
};

const RADAR_IND = [
  { name: '财政自给', max: 100 }, { name: '人口活力', max: 100 }, { name: '产业动能', max: 100 },
  { name: '粮食权重', max: 100 }, { name: '边防敏感', max: 100 }, { name: '维稳压力', max: 100 },
];

// 情景推演：情景 → 班子调整逻辑
const SCENARIOS = {
  fiscal: {
    label: '财政持续恶化',
    rec: '配置向「财经型省长」倾斜：转移支付谈判与债务重组能力优先；压缩基建类 KPI，民生兜底刚性化；省财政厅长升格为班子核心岗。对应熵增信号：财政自给率连续下行 + 城投利差走阔。',
  },
  population: {
    label: '人口加速流失',
    rec: '引入「收缩式规划」人才：公共服务按实际常住人口再布局（学校/医院合并），停止按户籍规模铺摊子；省会主官改配「留人工程」操盘手——产业留人优于补贴留人。对应熵增信号：小学在校生数领先指标恶化。',
  },
  breakthrough: {
    label: '产业突破窗口',
    rec: '书记改配「产业操盘手」型：扩大容错授权与「揭榜挂帅」，KPI 从均衡考核切换为单点突破（如吉林押注一汽电动化）；引入科创/链主企业背景副省长，打通央企总部资源。对应信号：细分赛道全国份额拐点。',
  },
};

export default function Page() {
  const [sel, setSel] = useState('黑龙江省');
  const [scn, setScn] = useState('fiscal');
  const cfg = CONFIG[sel];
  const idx = CHALLENGE.find((c) => c.name === sel)?.value;
  return (
    <div>
      <PageHeader
        badge="Sandbox · 思维训练"
        title="治国沙盒 · 区域治理人才配置"
        subtitle="挑战画像 → 能力需求 → 履历池匹配 —— 「治大国如烹小鲜」的人岗匹配训练沙盘"
      />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        治理的第一道工序是「把对的人放进对的省」。本沙盘把每个省域的问题<strong style={{ color: 'var(--text-primary)' }}>向量化</strong>（财政/人口/产业/粮食/边防/维稳），推导主政能力需求，再从履历池匹配班子<strong style={{ color: 'var(--text-primary)' }}>画像</strong>。东北三省为已配置样板，后续按同一方法论扩展到全部省级单位与省会。
        <span style={{ color: 'var(--text-tertiary)' }}> 本页为思维训练模型，所有「人才」均为画像/原型，不指向任何真实人事评价。</span>
      </p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="31" label="省级单位" />
        <Stat value="3 / 31" label="已配置（东北样板）" accent="#10b981" />
        <Stat value="6 维" label="挑战向量" accent="#22d3ee" />
        <Stat value="3 类" label="情景推演" accent="#e8a317" />
      </Grid>

      <Card title="省域治理挑战指数（示意 · 点击省份调出人才配置）" className="mb-6">
        <ChinaMap
          metrics={[{ key: 'challenge', label: '挑战指数', valueName: '治理挑战指数', max: 100, data: CHALLENGE }]}
          enableDrill={false}
          onRegionClick={(name) => setSel(name)}
          style={{ height: 460 }}
        />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title={`${sel} · 治理体征`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: cfg ? 'rgba(16,185,129,0.15)' : 'var(--bg-elevated)', color: cfg ? '#10b981' : 'var(--text-tertiary)' }}>{cfg ? cfg.tag : '待配置 · 按方法论模板生成'}</span>
            {idx != null && <span className="text-[11px] mono" style={{ color: 'var(--fire-gold)' }}>挑战指数 {idx}</span>}
          </div>
          {cfg ? (
            <>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>挑战画像：</span>{cfg.challenge}</p>
              <EChart option={{
                radar: { indicator: RADAR_IND, axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
                series: [{ type: 'radar', data: [{ value: cfg.radar, name: sel, lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
              }} style={{ height: 220 }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>六维挑战向量（示意值）：低分项即治理痛点，高分项即政治权重。</p>
            </>
          ) : (
            <div className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              <p className="mb-2">该省尚未配置。按方法论生成步骤：</p>
              <p className="mono text-xs">1. 挑战画像 → 财政/人口/产业/粮食/边防/维稳六维打分<br />2. 能力需求 → 由短板与政治权重推导主政画像<br />3. 履历池匹配 → 书记/省长/省会主官/关键厅局逐岗配置</p>
              <p className="mt-2 text-xs">扩展队列：东北 ✅ → 西北/西南边疆 → 中部 → 沿海 → 全部省会。</p>
            </div>
          )}
        </Card>

        <Card title={cfg ? `${sel} · 班子配置（画像）` : '人岗匹配方法论'}>
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
            <div className="space-y-3">
              {[['1 · 挑战画像（向量化）', '把省域问题拆成财政/人口/产业/粮食/边防/维稳六维——不同省份的「难」是不同性质的难，不可用同一把尺子。'],
                ['2 · 能力需求（由题定人）', '挑战向量决定主政画像：边疆省要稳边固防履历，债务省要财经外科医生，转型省要产业操盘手——先有题，后有人。'],
                ['3 · 履历池匹配（组合配置）', '中央空降 × 本地成长 × 异地交流的配比即权力设计：书记省长互补、省会主官实为「第二省长」、关键厅局按短板加强。']].map(([t, d]) => (
                <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Grid>

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

      <Grid cols={3}>
        <Card title="熵增监控 · 接口">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>治理熵 ≈ 财政缺口 × 人口流出 × 债务利差的复合指标；指数持续抬升即触发情景推演与班子再配置。待接 DataBus 实拉省级数据。</p>
        </Card>
        <Card title="与「政府体系」叠读">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>本沙盘是「组织算法」（多岗位轮换、政绩评价矩阵）的应用层：压力型体制的责任状，最终落在人岗匹配的精度上。</p>
        </Card>
        <Card title="扩展路线">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>东北 3 省 ✅ → 边疆带（新疆/西藏/云南/内蒙古）→ 债务带（贵州/甘肃/天津）→ 沿海大省 → 31 省级 + 省会城市全覆盖。</p>
        </Card>
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>挑战指数与雷达为训练沙盘示意值；人才均为画像/原型，不构成对任何真实人物或人事安排的评价</p>
    </div>
  );
}
