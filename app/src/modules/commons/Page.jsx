import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 公地悲剧与集体行动（哈丁 / 奥尔森 / 奥斯特罗姆）
// ----------------------------------------------------------------------------
// 公共资源因个体理性叠加而集体崩溃；规模越大越难自发约束（搭便车）；
// 奥斯特罗姆证明：社群自主治理是私有化/国有化之外的第三条路。
// ============================================================================

// 资源动态：存量 R，自然再生 g*R*(1−R/K)；每期消耗 = 人数 × 人均放牧。
// 人均放牧随「治理强度」下降；规模越大、治理越弱 → 越快越过临界点而崩溃。
function simulate(herders, governance) {
  const K = 100; const g = 0.32; const steps = 24;
  let R = 90; const series = [];
  const perHead = 1.15 * (1 - governance / 100); // 治理压低人均索取
  for (let t = 0; t <= steps; t++) {
    series.push(Math.max(0, Math.round(R)));
    const regen = g * R * (1 - R / K);
    const take = Math.min(R, herders * perHead);
    R = R + regen - take;
    if (R < 0) R = 0;
  }
  return series;
}

const SOLUTIONS = [
  ['产权 · 私有化', '#e8a317', '把公地切给个体（科斯）：边界清晰则外部性内部化，但分割成本高、生态系统难切分（一条河、一片大气切给谁？）。', '适用：资源可分割、产权可执行', '失灵：测量/排他成本过高，或切分破坏生态整体性'],
  ['管制 · 利维坦', '#22d3ee', '由国家设配额、征税、强制（哈丁原解）：自上而下监控成本高，且地方信息不对称，易僵化与寻租。', '适用：危害剧烈、需快速统一行动', '失灵：信息不对称→一刀切；监管被俘获；执行成本爆炸'],
  ['自治 · 奥斯特罗姆', '#10b981', '社群自定规则、分级制裁、低成本冲突调解（八项设计原则）：在边界可识别、可重复博弈处往往最优——破解「必然私有化或国有化」的迷思。', '适用：社群稳定、博弈可重复、边界可识别', '失灵：成员流动性高、外部冲击大、上级不承认自治权'],
];

const MAPPINGS = [
  ['碳排放 / 双碳', '大气是全球公地，减排成本自付、收益共享 → 典型搭便车；需配额（管制）+ 碳市场（准产权）。'],
  ['过度捕捞', '公海渔业无主，竞相抢捞 → 渔业崩溃；区域配额与渔民自治社群是有效解。'],
  ['内卷', '注意力/分数是固定公地，个体理性加码 → 集体收益不增反降的负和竞争。'],
  ['地方债共担', '隐性担保使举债收益归地方、风险上移共担 → 软预算约束下的公地透支。'],
];

// —— 奥斯特罗姆八项设计原则（1990《公共事物的治理之道》）——
const PRINCIPLES = [
  ['边界清晰', '谁有权取用、资源边界在哪，必须明确——模糊边界是搭便车的温床。'],
  ['规则与本地条件匹配', '取用规则与当地资源禀赋/劳动投入挂钩，而非照搬外来模板。'],
  ['集体选择参与', '受规则影响的人能参与修改规则——被治理者即立法者。'],
  ['有效监督', '监督者对使用者负责（或就是使用者自己），监督成本内嵌于日常。'],
  ['分级惩罚', '初犯轻罚、累犯重罚——维持声誉机制而非一棍打死。'],
  ['低成本冲突解决', '有快速、廉价的本地仲裁场所，纠纷不必上法庭。'],
  ['自治权被承认', '上级政府不否定社群自定规则的合法性——最常被忽视的一条。'],
  ['嵌套分层治理', '大系统由多层小单元嵌套组成（多中心），而非单一中心包揽。'],
];

// —— 全球公地案例库 ——
const COMMONS_CASES = [
  { key: 'climate', label: '气候大气层', attr: '全球纯公地：完全非排他、强竞争（碳预算有限）', freeride: '减排成本国别自担、增温损害全球共摊 → 最大规模搭便车结构', regime: '《巴黎协定》自主贡献（NDC）+ 碳市场 + 边境碳税（CBAM）', failure: '无强制执行；NDC 加总远超 1.5°C 预算；退约零成本', score: 3 },
  { key: 'fishery', label: '海洋渔业', attr: '公海无主 + 专属经济区分割：流动性资源跨界游动', freeride: '别国少捕＝我多捕的空间 → 补贴竞赛、IUU 捕捞', regime: '区域渔业管理组织（RFMO）配额 + 2023 BBNJ 公海条约', score: 5, failure: '配额谈判被产业俘获；公海执法稀薄；鱼群不认国界' },
  { key: 'orbit', label: '太空轨道（Kessler）', attr: '低轨是有限「车道」：碎片链式碰撞可使整层轨道报废', freeride: '发射收益归己、碎片风险共摊 → 星座竞赛抢轨', regime: '《外空条约》原则性约束 + ITU 频轨登记 + 自愿减碎片准则', failure: '无强制离轨义务；反卫星试验制造碎片无追责；先到先得', score: 2 },
  { key: 'river', label: '跨境河流水权', attr: '上下游不对称公地：上游截留即下游枯竭（尼罗河/湄公河）', freeride: '上游建坝收益归己、断流成本下游扛 → 地理位置即权力', regime: '流域委员会（湄公河委员会）+ 双边条约 + 联合国水道公约', failure: '强国不入约；委员会无否决权；气候变化改写水文基线', score: 4 },
  { key: 'spectrum', label: '无线频谱', attr: '准公地→已基本「产权化」：拍卖排他使用权', freeride: '历史上信号互相干扰；今日主要是抢占与囤积', regime: 'ITU 全球协调 + 国家拍卖（科斯式产权解的成功样本）', failure: '低轨卫星巨型星座重新冲击频轨协调；先占规则利于先发国', score: 7 },
  { key: 'ai', label: 'AI 安全（新兴公地）', attr: '「安全冗余」是公地：人人受益于他人减速，自己抢跑', freeride: '抢先部署收益归己、失控风险全人类共摊 → 竞速结构', regime: '自愿承诺 + 安全峰会宣言 + 个别立法（EU AI Act）', failure: '军备竞赛逻辑压倒协调；无验证机制；技术扩散快于规则', score: 1 },
];

// —— 中国语境治理设计对照 ——
const CHINA_CASES = [
  ['黄河水权分配', '管制为骨 + 准产权为肉', '「八七分水」方案按省分配额度 + 水权交易试点（宁夏→内蒙古）；统一调度委员会扮演嵌套层级中的协调中心。', '#22d3ee'],
  ['碳排放配额', '管制 × 产权混合', '全国碳市场（ETS）：总量由国家定（利维坦），配额可交易（产权），MRV 监测对应「有效监督」原则。', '#e8a317'],
  ['渔业伏季休渔', '管制 + 社群执行', '统一禁渔期自上而下设定，但渔村互监、渔政与合作社共治——隐含分级惩罚与本地匹配两原则。', '#10b981'],
  ['数据公地', '规则真空期', '数据可复制（非竞争）但隐私/安全外部性强；《数据二十条》尝试「三权分置」造准产权，公共数据开放对应公地正向供给。', '#c41e3a'],
];

// —— 理论演进时间轴 ——
const TIMELINE = [
  { period: '1965', title: '奥尔森 · 集体行动', accent: '#e8a317', desc: '《集体行动的逻辑》：大集团比小集团更难供给公共品——搭便车随规模上升，需「选择性激励」才能组织起来。' },
  { period: '1968', title: '哈丁 · 公地悲剧', accent: '#c41e3a', desc: '《Science》经典论文：自由取用的公地必然过载——「公地自由毁掉一切」。给出私有化或国家管制两条出路。' },
  { period: '1990', title: '奥斯特罗姆 · 实证反击', accent: '#10b981', desc: '《公共事物的治理之道》：对全球数百个灌溉/渔场/森林社群的实证——自主治理真实存在，提炼八项设计原则。' },
  { period: '2009', title: '诺贝尔经济学奖', accent: '#10b981', desc: '奥斯特罗姆成为首位经济学奖女性得主——表彰「对经济治理尤其是公地治理的分析」。' },
  { period: '2010s', title: '多中心治理', accent: '#22d3ee', desc: '气候治理从单一全球条约转向多中心：城市联盟、行业协议、国家政策并行嵌套，呼应第八条原则。' },
  { period: '2020s', title: '全球公地时代', accent: '#a78bfa', desc: '气候/太空轨道/AI 安全把公地问题推到全球尺度——恰是奥尔森「最大集团」最难自治的区间。' },
];

// 八原则勾选数 → 自治可持续概率（S 型：少数原则不顶用，过半后边际收益陡升）
function sustainProb(n) {
  return Math.round(100 / (1 + Math.exp(-(n - 4) * 0.95)));
}

export default function Page() {
  const [herders, setHerders] = useState(20);
  const [governance, setGovernance] = useState(15);
  const [checked, setChecked] = useState([true, true, false, true, false, false, false, false]);
  const [caseKey, setCaseKey] = useState('climate');
  const [tlIdx, setTlIdx] = useState(2);

  const series = useMemo(() => simulate(herders, governance), [herders, governance]);
  const endStock = series[series.length - 1];
  const collapsed = endStock <= 5;
  // 集体行动难度 ≈ 规模惩罚 − 治理（搭便车随规模上升）
  const difficulty = useMemo(() => Math.max(0, Math.min(100, Math.round(herders * 1.6 - governance * 0.6))), [herders, governance]);

  const nChecked = checked.filter(Boolean).length;
  const prob = sustainProb(nChecked);
  const verdict = nChecked >= 6 ? ['自治可行', '#10b981', '制度齐备：自主治理大概率可持续，且比外部管制更低成本。'] : nChecked >= 4 ? ['脆弱均衡', '#e8a317', '部分原则在位：常态下可维持，遇外部冲击（移民/市场化/上级干预）易瓦解。'] : ['走向悲剧', '#c41e3a', '设计原则缺位过多：搭便车无人制止，公地将按哈丁剧本枯竭——只剩私有化或利维坦。'];
  const toggle = (i) => setChecked((arr) => arr.map((v, j) => (j === i ? !v : v)));

  const cs = COMMONS_CASES.find((c) => c.key === caseKey);

  const chart = {
    grid: { left: 40, right: 16, top: 24, bottom: 24 },
    xAxis: { type: 'category', boundaryGap: false, data: series.map((_, i) => i), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color } },
    yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: LABEL.color } },
    series: [{
      type: 'line', smooth: true, data: series, showSymbol: false,
      lineStyle: { color: collapsed ? '#c41e3a' : '#10b981', width: 2 },
      areaStyle: { color: collapsed ? 'rgba(196,30,58,0.12)' : 'rgba(16,185,129,0.12)' },
      markLine: { silent: true, symbol: 'none', label: { color: LABEL.color, fontSize: 10 }, lineStyle: { color: '#e8a317', type: 'dashed' }, data: [{ yAxis: 20, name: '临界存量' }] },
    }],
  };

  // 八原则 → 自治可持续概率曲线（标出当前勾选位置）
  const probChart = useMemo(() => ({
    grid: { left: 44, right: 18, top: 28, bottom: 28 },
    xAxis: categoryX([0, 1, 2, 3, 4, 5, 6, 7, 8].map(String)),
    yAxis: valueY({ max: 100, name: '自治概率 %', nameTextStyle: { color: '#5b6a82' } }),
    series: [{
      type: 'line', smooth: true, showSymbol: true, symbolSize: 6,
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => sustainProb(n)),
      lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' },
      areaStyle: { color: 'rgba(16,185,129,0.10)' },
      markPoint: { data: [{ coord: [nChecked, prob], symbolSize: 44, itemStyle: { color: verdict[1] }, label: { show: true, formatter: `${prob}%`, color: '#0b1120', fontSize: 10, fontWeight: 700 } }] },
    }],
  }), [nChecked, prob, verdict]);

  // 奥尔森：群体规模 vs 搭便车率 / 人均组织成本（双轴双线）
  const olsonChart = useMemo(() => {
    const sizes = [5, 10, 20, 50, 100, 300, 1000, 5000];
    const freeride = sizes.map((n) => Math.round(100 * (1 - 1 / Math.pow(n, 0.32))));
    const orgCost = sizes.map((n) => Math.round(8 + 14 * Math.log10(n) * Math.log10(n)));
    return {
      grid: { left: 44, right: 44, top: 36, bottom: 28 },
      legend: { top: 4, textStyle: { color: LABEL.color, fontSize: 10 }, data: ['搭便车率 %', '组织成本指数'] },
      xAxis: categoryX(sizes.map(String)),
      yAxis: [valueY({ max: 100, name: '搭便车率 %', nameTextStyle: { color: '#5b6a82' } }), { type: 'value', name: '组织成本', nameTextStyle: { color: '#5b6a82' }, splitLine: { show: false }, axisLabel: { color: LABEL.color } }],
      series: [
        { name: '搭便车率 %', type: 'line', smooth: true, data: freeride, showSymbol: false, lineStyle: { color: '#c41e3a', width: 2 } },
        { name: '组织成本指数', type: 'line', smooth: true, yAxisIndex: 1, data: orgCost, showSymbol: false, lineStyle: { color: '#e8a317', width: 2, type: 'dashed' } },
      ],
    };
  }, []);

  const Slider = ({ val, set, min, max, label, color }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span className="mono" style={{ color }}>{val}</span></div>
      <input type="range" min={min} max={max} value={val} onChange={(e) => set(Number(e.target.value))} style={{ width: '100%', accentColor: color }} />
    </div>
  );

  return (
    <div>
      <PageHeader badge="Cognition · 公地悲剧" title="公地悲剧与集体行动 · 个体理性如何拖垮集体"
        subtitle="哈丁的牧场 / 奥尔森的搭便车 / 奥斯特罗姆的自主治理 —— 拖动滑杆看公共资源随时间枯竭或可持续" />
      <IntroCard>
        哈丁（1968）的牧场寓言：每个牧民多养一头牛，<strong style={{ color: 'var(--text-primary)' }}>收益归己、损耗共担</strong>，于是人人理性扩张，公地必然过载枯竭。奥尔森补充：<strong style={{ color: 'var(--text-primary)' }}>大集团比小集团更难集体行动</strong>——人越多越易搭便车，需「选择性激励」。奥斯特罗姆（1990）则用实证反驳了「不私有化即国有化」的二分：<strong style={{ color: 'var(--text-primary)' }}>社群自主治理是真实存在的第三条路</strong>。
      </IntroCard>

      <div className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={tlIdx} onSelect={setTlIdx} />
      </div>

      <Grid cols={3} className="mb-6">
        <Stat value={endStock} label="期末资源存量（满分100）" accent={collapsed ? '#c41e3a' : endStock > 40 ? '#10b981' : '#e8a317'} />
        <Stat value={collapsed ? '已崩溃' : '可持续'} label="公地终局" accent={collapsed ? '#c41e3a' : '#10b981'} />
        <Stat value={difficulty} label="集体行动难度指数（奥尔森）" accent="#22d3ee" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="参数 · 拖动调参">
          <Slider val={herders} set={setHerders} min={3} max={60} label="放牧者数量 / 集团规模" color="#c41e3a" />
          <Slider val={governance} set={setGovernance} min={0} max={90} label="治理强度（规则/制裁/激励）" color="#10b981" />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>规模越大越快越过临界线（虚线＝再生跟不上索取）；唯有把治理拉够高，曲线才从崩溃转为可持续。这正是「规模 vs 自律」的张力。</p>
        </Card>
        <Card title="资源存量演化（示意）">
          <EChart option={chart} style={{ height: 240 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>绿＝可持续，红＝跌破临界后崩溃。横轴为时间期数。</p>
        </Card>
      </Grid>

      <Card title="奥斯特罗姆八原则评估器 · 勾选你的社群满足哪几条" className="mb-6">
        <Grid cols={2}>
          <div>
            {PRINCIPLES.map(([t, d], i) => (
              <label key={t} className="flex items-start gap-2 mb-2 cursor-pointer" style={{ opacity: checked[i] ? 1 : 0.55 }}>
                <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} style={{ accentColor: '#10b981', marginTop: 2 }} />
                <span>
                  <span className="text-xs font-semibold" style={{ color: checked[i] ? '#10b981' : 'var(--text-secondary)' }}>{i + 1}. {t}</span>
                  <span className="text-[11px] block leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</span>
                </span>
              </label>
            ))}
          </div>
          <div>
            <EChart option={probChart} style={{ height: 220 }} />
            <div className="os-card p-3 mt-2" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${verdict[1]}` }}>
              <div className="text-sm font-semibold" style={{ color: verdict[1] }}>{nChecked}/8 项满足 → 自治可持续概率 {prob}% · {verdict[0]}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{verdict[2]} 概率为 S 型：前几条原则单独不顶用，过半（≥4）后每补一条边际收益陡升——制度是互补品，不是替代品。</p>
            </div>
          </div>
        </Grid>
      </Card>

      <Card title="全球公地案例选择器 · 哪些公地正在悲剧中" className="mb-6">
        <SelectorBar items={COMMONS_CASES} activeKey={caseKey} onSelect={setCaseKey} />
        <Grid cols={2} className="mt-3">
          <div>
            {[['公地属性', cs.attr, '#22d3ee'], ['搭便车结构', cs.freeride, '#c41e3a'], ['现有治理', cs.regime, '#10b981'], ['失灵点', cs.failure, '#e8a317']].map(([t, d, c]) => (
              <div key={t} className="mb-2" style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: c }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>八原则达标数（粗评）：<span className="mono font-semibold" style={{ color: cs.score >= 6 ? '#10b981' : cs.score >= 4 ? '#e8a317' : '#c41e3a' }}>{cs.score}/8</span></div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 8, borderRadius: 2, background: i < cs.score ? (cs.score >= 6 ? '#10b981' : cs.score >= 4 ? '#e8a317' : '#c41e3a') : 'rgba(148,163,184,0.15)' }} />
              ))}
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              对照评估器可见：频谱（已产权化）得分最高，AI 安全几乎全缺——边界不清、无监督、无分级惩罚、无被承认的自治。全球公地的共同短板是<strong style={{ color: 'var(--text-primary)' }}>第 7 条（自治权被承认）</strong>：没有世界政府，任何「上级」都不存在，规则只能靠多中心嵌套与声誉机制。
            </p>
          </div>
        </Grid>
      </Card>

      <Card title="奥尔森曲线 · 为什么大集团更难自治" className="mb-6">
        <Grid cols={2}>
          <EChart option={olsonChart} style={{ height: 230 }} />
          <div>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
              规模上升 → 单人贡献占比趋零、偷懒被发现概率趋零 → <strong style={{ color: '#c41e3a' }}>搭便车率攀升</strong>；同时谈判/监督的<strong style={{ color: '#e8a317' }}>组织成本超线性增长</strong>。这解释了：
            </p>
            <ul className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)', paddingLeft: 16, listStyle: 'disc' }}>
              <li>奥斯特罗姆的成功案例多在数十到数百人的村社尺度；</li>
              <li>气候谈判（约 200 国 + 80 亿人）位于曲线最右端——全人类是「最大集团」；</li>
              <li>破局靠「化大为小」：俱乐部式减排联盟、行业自律小圈、嵌套分层（原则 8）把大集团拆成可重复博弈的小集团。</li>
            </ul>
          </div>
        </Grid>
      </Card>

      <Card title="三种破局解 · 产权 / 管制 / 自治" className="mb-6">
        <Grid cols={3}>
          {SOLUTIONS.map(([t, c, d, fit, fail]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${c}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: c }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <p className="text-[11px] mt-2" style={{ color: '#10b981' }}>✓ {fit}</p>
              <p className="text-[11px]" style={{ color: '#c41e3a' }}>✗ {fail}</p>
            </div>
          ))}
        </Grid>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          奥斯特罗姆的洞见：<strong style={{ color: 'var(--text-primary)' }}>没有万能解</strong>——选哪条路取决于资源边界是否清晰、博弈是否可重复、监督成本几何。三条路常组合使用（碳市场＝产权×管制）。
        </p>
      </Card>

      <Card title="中国语境映射 · 公地治理的本土设计" className="mb-6">
        <Grid cols={2}>
          {CHINA_CASES.map(([t, mode, d, c]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${c}` }}>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</span>
                <span className="text-[10px] mono" style={{ color: c }}>{mode}</span>
              </div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>共同特征：以利维坦定总量、以准产权配资源、以社群机制降低监督成本——三解混搭而非单选，与奥斯特罗姆「制度多样性」的结论暗合。</p>
      </Card>

      <Card title="现实映射 · 与生态 / 债务模块呼应" className="mb-6">
        <Grid cols={2}>
          {MAPPINGS.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>
<FrameworkTrio cards={[
        { key: 'salt', body: '公地悲剧：个体理性 → 集体资源崩溃。' },
        { key: 'stone', body: '产权/管制/自治三解，取决于边界与监督成本。' },
        { key: 'path', body: '碳市场、数据要素、生态红线 = 现代公地治理。' },
      ]} />
      <p className="text-[10px] mt-4" style={{ color: 'var(--text-tertiary)' }}>免责声明：本页模拟与评分均为教学示意（参数为定性设定），非任何治理体系的实证评估；案例评分为作者粗判，仅用于演示八原则框架的使用方式。</p>
<ModuleFooter moduleId="commons" />
    </div>
  );
}
