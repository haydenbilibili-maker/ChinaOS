import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 极地议题选择器：每个议题给出现状 / 中国布局 / 战略价值 / 约束 ──
const ISSUES = [
  {
    key: 'route', label: '北极航道', accent: '#22d3ee',
    status: '全球暖化使北冰洋夏季海冰退缩，东北航道（俄北方海航道）通航窗口逐年拉长，2030 年代有望进入半全年通航。航道控制权目前几乎完全握于俄罗斯之手。',
    layout: '以「冰上丝绸之路」嵌入俄北方海航道运营，参股亚马尔 LNG、组织商船试航、推进核动力破冰平台预研，争取从「过境者」升级为「共建者」。',
    value: '航程缩短约 40%，绕过马六甲—苏伊士单一节点链。这是对海权封锁的物理级备份——把贸易引力线从他人控制的咽喉，部分迁往北方开阔水道。',
    constraint: '航道沿岸主权属俄；冰区导航、保险、港口补给链尚不成熟；地缘上深度依赖中俄关系稳定，单点风险高。',
  },
  {
    key: 'resource', label: '极地资源', accent: '#e8a317',
    status: '北极蕴藏全球约 13% 未探明石油、30% 未探明天然气，外加渔业、稀土与深海矿产。多数储量位于沿岸国专属经济区，公海与大陆架划界仍存争端。',
    layout: '以能源企业嵌入（亚马尔/北极 LNG-2）、远洋渔业作业、科考数据积累，建立「在场即权利」的资源卡位，而非直接主权主张。',
    value: '资源争夺的前置卡位：在储量尚未开采、规则尚未固化之时占住席位，确保未来再分配中的表决权与供应链份额。',
    constraint: '高纬开采成本极高、生态脆弱、制裁敏感；资源多在他国管辖海域，须借合作而非占领；技术与极地装备仍受限。',
  },
  {
    key: 'station', label: '科考存在', accent: '#22c55e',
    status: '南极由《南极条约》冻结主权主张，科考站是事实上的存在凭证。中国已建长城、中山、昆仑、泰山、秦岭五站，覆盖沿海、内陆冰盖与罗斯海。',
    layout: '雪龙/雪龙2 双船破冰科考，秦岭站补齐罗斯海空白，星地一体监测网建设，向「科考强国」目标推进。',
    value: '科考是合法占位的低对抗入口：在条约框架内积累在场年限、数据与基础设施，为未来条约重谈与资源议题储备发言权。',
    constraint: '南极条约 2048 年环保议定书可能重审，主权与资源问题悬而未决；后勤补给链漫长，内陆站运维成本高昂。',
  },
  {
    key: 'governance', label: '治理话语', accent: '#a78bfa',
    status: '北极理事会由八个北极国家主导，中国 2013 年获观察员身份。乌克兰危机后理事会运作受阻，西方与俄阵营分化，治理结构进入重构期。',
    layout: '以「近北极国家」身份参与规则制定，发布北极政策白皮书，主张航道自由、科研合作与可持续利用，争取非沿岸国的制度性发言权。',
    value: '规则即长期权力：在治理框架定型前嵌入议程，把「地理上的局外人」转化为「制度上的利益相关方」。',
    constraint: '观察员无表决权；「近北极」身份不被部分沿岸国承认；治理话语高度依赖与俄合作，西方警惕度上升。',
  },
  {
    key: 'icebreaker', label: '破冰装备', accent: '#c41e3a',
    status: '破冰船是极地一切活动的物理前提。俄罗斯拥有全球唯一核动力破冰船队（40+ 艘各型），中国以雪龙、雪龙2（首艘自主建造）为核心，规模与梯队仍有差距。',
    layout: '雪龙2 自主双向破冰，预研 3 万吨级核动力破冰综合保障平台，解决极地长航程补能与全季节通航瓶颈。',
    value: '装备自主决定行动自由：没有重型/核动力破冰能力，航道、资源、科考都只是纸面权利。这是极地战略的算法底座。',
    constraint: '核动力破冰平台尚未服役，重型破冰船数量远逊俄；高纬全季节运维、舰载核动力工程化仍是硬骨头。',
  },
  {
    key: 'antarctic', label: '南极权益', accent: '#38bdf8',
    status: '《南极条约》体系冻结主权、禁止军事化、保护环境，2048 年矿产开采禁令可重审。七国历史主权主张被搁置，实际影响力由科考存在与制度参与决定。',
    layout: '以五站布局 + 雪龙集群 + 条约协商国身份，深度参与南极治理与环境议程，储备 2048 年节点后的规则话语权。',
    value: '为长周期博弈卡位：南极是地球最后的资源与战略冗余仓，今天的科考在场年限即明日的谈判筹码。',
    constraint: '矿产禁令尚在，无法直接开发；环保派与资源派张力大；任何「军事化」嫌疑都将损害条约协商国信誉。',
  },
];

// ── 北极航道 vs 传统航线 ──
const ROUTES = [
  { key: 'suez', label: '苏伊士运河线', accent: '#64748b', distance: 12000, days: 35, desc: '传统亚欧贸易主通道，经马六甲—印度洋—苏伊士。地缘风险集中：海盗、封锁、运河拥堵（参见 2021 长赐号搁浅）。' },
  { key: 'nep', label: '北极东北航道', accent: '#22d3ee', distance: 7200, days: 22, desc: '冰上丝绸之路：航程缩短约 40%，燃油成本显著下降，绕过传统海权封锁带——马六甲困境的物理级备份。' },
];

// ── 极地综合存在雷达：中国 vs 第一梯队（俄美） ──
const RADAR_DIMS = ['科考站网', '破冰船队', '极地航运', '资源开发', '治理话语', '装备技术'];
const RADAR_SETS = {
  china: { name: '中国', color: '#c41e3a', value: [72, 45, 38, 40, 55, 58] },
  russia: { name: '俄罗斯（第一梯队）', color: '#22d3ee', value: [80, 98, 90, 78, 85, 88] },
  usa: { name: '美国（第一梯队）', color: '#e8a317', value: [70, 30, 35, 60, 80, 65] },
};

// ── 极地参与时间线 ──
const STAGES = [
  { period: '1984—1989', title: '南极破壁', accent: '#38bdf8', desc: '1984 首次南极考察队出征，1985 建长城站、1989 建中山站。从零起步，以科考身份切入南极条约协商国体系，获得规则桌前的一席。' },
  { period: '2004—2009', title: '北极落点 · 内陆登顶', accent: '#22c55e', desc: '2004 建北极黄河站（斯瓦尔巴），2009 建昆仑站登顶南极冰盖最高点 Dome A。极地存在从沿海延伸至最难抵达的内陆与高纬。' },
  { period: '2013', title: '北极理事会观察员', accent: '#a78bfa', desc: '获北极理事会观察员身份，以「近北极国家」自我定位，正式进入北极治理的制度边缘——从地理局外人转为制度参与者。' },
  { period: '2017—2018', title: '冰上丝绸之路', accent: '#22d3ee', desc: '「一带一路」对接北极航道，发布《中国的北极政策》白皮书，提出「冰上丝绸之路」。资源（亚马尔 LNG）与航道战略正式成形。' },
  { period: '2019—2024', title: '装备自主 · 秦岭站', accent: '#c41e3a', desc: '2019 雪龙2 首艘自主破冰船服役，2024 罗斯海秦岭站建成（第五站）。极地战略从「借船出海」转向「自主在场」，核动力破冰平台进入预研。' },
];

// ── 科考站布局 ──
const STATIONS = [
  { name: '长城站', year: 1985, type: '南极·沿海', accent: '#38bdf8' },
  { name: '中山站', year: 1989, type: '南极·沿海', accent: '#38bdf8' },
  { name: '黄河站', year: 2004, type: '北极·斯瓦尔巴', accent: '#22d3ee' },
  { name: '昆仑站', year: 2009, type: '南极·内陆冰盖最高点', accent: '#22c55e' },
  { name: '泰山站', year: 2014, type: '南极·内陆中继', accent: '#22c55e' },
  { name: '秦岭站', year: 2024, type: '南极·罗斯海', accent: '#c41e3a' },
];

export default function Page() {
  const [issueKey, setIssueKey] = useState('route');
  const [routeKey, setRouteKey] = useState('nep');
  const [stageIdx, setStageIdx] = useState(4);
  const [radarKey, setRadarKey] = useState('all');

  const issue = ISSUES.find((i) => i.key === issueKey) || ISSUES[0];
  const route = ROUTES.find((r) => r.key === routeKey) || ROUTES[1];

  // 航道对比
  const routeCompare = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    xAxis: categoryX(ROUTES.map((r) => r.label)),
    yAxis: [valueY({ name: '海里', position: 'left' }), valueY({ name: '天', position: 'right', splitLine: { show: false } })],
    series: [
      { name: '航程 (海里)', type: 'bar', yAxisIndex: 0, barWidth: 44,
        data: ROUTES.map((r) => ({ value: r.distance, itemStyle: { color: r.key === routeKey ? r.accent : 'rgba(100,116,139,0.5)', borderRadius: [4, 4, 0, 0] } })),
        label: { show: true, position: 'top', formatter: '{c} nm', color: '#93a1b5' } },
      { name: '航时 (天)', type: 'line', yAxisIndex: 1, symbol: 'circle', symbolSize: 9,
        data: ROUTES.map((r) => r.days), lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' },
        label: { show: true, position: 'top', formatter: '{c}d', color: '#e8a317' } },
    ],
  }), [routeKey]);

  // 极地资源潜力 donut
  const resourceDonut = useMemo(() => donutOpt([
    { name: '油气（未探明，全球占比高）', value: 48, itemStyle: { color: '#e8a317' } },
    { name: '航道经济', value: 22, itemStyle: { color: '#22d3ee' } },
    { name: '极地渔业', value: 16, itemStyle: { color: '#22c55e' } },
    { name: '稀土与深海矿产', value: 14, itemStyle: { color: '#a78bfa' } },
  ]), []);

  // 综合存在雷达
  const presenceRadar = useMemo(() => {
    const sets = radarKey === 'all' ? Object.values(RADAR_SETS) : [RADAR_SETS[radarKey]];
    const base = radarOpt(RADAR_DIMS, sets[0].value, { name: sets[0].name, color: sets[0].color });
    base.tooltip = { trigger: 'item' };
    base.legend = { textStyle: { color: '#93a1b5', fontSize: 10 }, bottom: 0 };
    base.series[0].data = sets.map((s) => ({
      value: s.value, name: s.name,
      lineStyle: { color: s.color, width: 2 }, itemStyle: { color: s.color },
      areaStyle: { color: 'rgba(0,0,0,0)' },
    }));
    return base;
  }, [radarKey]);

  // 破冰船队对比（保留原数据）
  const icebreakerBar = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ name: '重型破冰船 (艘·示意)' }),
    yAxis: categoryX(['美国', '芬兰', '加拿大', '中国', '俄罗斯']),
    series: [{ type: 'bar', data: [2, 8, 12, 5, 40], barWidth: 14,
      itemStyle: { color: (p) => (p.dataIndex === 3 ? '#c41e3a' : '#334155'), borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: 'right', color: '#93a1b5' } }],
  }), []);

  // 科考站布局时间线 bar
  const stationBar = useMemo(() => ({
    grid: { left: 36, right: 24, top: 16, bottom: 42 },
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name}<br/>建成 ${p[0].value} · ${STATIONS[p[0].dataIndex].type}` },
    xAxis: categoryX(STATIONS.map((s) => s.name)),
    yAxis: valueY({ name: '建成年', min: 1980, max: 2030 }),
    series: [{ type: 'bar', barWidth: 30,
      data: STATIONS.map((s) => ({ value: s.year, itemStyle: { color: s.accent, borderRadius: [4, 4, 0, 0] } })),
      label: { show: true, position: 'top', formatter: '{c}', color: '#93a1b5', fontSize: 10 } }],
  }), []);

  // 极地综合实力堆叠（中国 vs 俄 vs 美 分维度）
  const stackBar = useMemo(() => stackedBarOpt({
    categories: RADAR_DIMS,
    horizontal: false,
    series: [
      { name: '中国', data: RADAR_SETS.china.value, itemStyle: { color: '#c41e3a' } },
      { name: '俄罗斯', data: RADAR_SETS.russia.value, itemStyle: { color: '#22d3ee' } },
      { name: '美国', data: RADAR_SETS.usa.value, itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="Polar Strategy · 第三极" title="极地科考 · 航道与资源" subtitle="冰上丝绸之路 · 破冰船 · 南极条约 · 资源主张" />
      <IntroCard>北极航道是摆脱<strong style={{ color: 'var(--text-primary)' }}>马六甲困境</strong>的物理级备份：与俄罗斯协作构建「冰上丝绸之路」，缩短约 40% 航程，使贸易流向绕过传统海权封锁带。极地由此成为太平洋、印度洋之外的海洋战略「第三支柱」——一块由全球暖化重新打开、由破冰能力定义准入门槛的<strong style={{ color: 'var(--text-primary)' }}>权力新边疆</strong>。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="5 + 1" label="南北极科考站 · 含秦岭站" accent="#22c55e" />
        <Stat value="2 艘" label="雪龙系列破冰科考船" accent="#22d3ee" />
        <Stat value="~40%" label="北极东北航道里程缩短 vs 苏伊士" accent="#e8a317" />
        <Stat value="40+ 次" label="南极科考航次（1984 起 · 示意）" accent="#c41e3a" />
      </Grid>

      {/* ── 极地议题选择器 ── */}
      <Card title="交互 · 极地议题透视 · 现状 / 中国布局 / 战略价值 / 约束" className="mb-6">
        <SelectorBar items={ISSUES} activeKey={issueKey} onSelect={setIssueKey} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${issue.accent}` }}>
            <div className="text-xs font-semibold mb-1" style={{ color: issue.accent }}>现状 · 权力物理</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{issue.status}</p>
            <div className="text-xs font-semibold mb-1" style={{ color: issue.accent }}>中国布局</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{issue.layout}</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #64748b' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22c55e' }}>战略价值</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{issue.value}</p>
            <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>约束 · 现实主义底线</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{issue.constraint}</p>
          </div>
        </Grid>
      </Card>

      {/* ── 航道对比切换 ── */}
      <Card title="交互 · 航道对比切换 · 航程 / 天数" className="mb-6">
        <SelectorBar items={ROUTES} activeKey={routeKey} onSelect={setRouteKey} />
        <Grid cols={2}>
          <EChart option={routeCompare} style={{ height: 240 }} />
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${route.accent}` }}>
            <Grid cols={2} className="mb-3">
              <Stat value={route.distance} label="航程 (海里)" accent={route.accent} />
              <Stat value={`~${route.days} 天`} label="典型航时" accent="#64748b" />
            </Grid>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{route.desc}</p>
            <p className="text-xs mt-3 mono" style={{ color: 'var(--text-tertiary)' }}>「冰上丝绸之路」：东北航道把亚欧贸易引力线从他人控制的咽喉，部分迁往北方开阔水道。</p>
          </div>
        </Grid>
      </Card>

      {/* ── 资源潜力 + 破冰船 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="极地资源潜力结构（经济价值占比 · 示意）"><EChart option={resourceDonut} style={{ height: 250 }} /></Card>
        <Card title="全球重型破冰船数量对比（示意）"><EChart option={icebreakerBar} style={{ height: 250 }} /></Card>
      </Grid>

      {/* ── 综合存在雷达（切换） ── */}
      <Card title="交互 · 极地综合存在雷达 · 中国 vs 第一梯队（俄美）" className="mb-6">
        <SelectorBar
          items={[
            { key: 'all', label: '三方对比', accent: '#93a1b5' },
            { key: 'china', label: '中国', accent: '#c41e3a' },
            { key: 'russia', label: '俄罗斯', accent: '#22d3ee' },
            { key: 'usa', label: '美国', accent: '#e8a317' },
          ]}
          activeKey={radarKey} onSelect={setRadarKey}
        />
        <Grid cols={2}>
          <EChart option={presenceRadar} style={{ height: 280 }} />
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #22d3ee' }}>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              六维度看：俄罗斯凭核动力破冰船队与北方海航道运营，几乎全维领先，是无可争议的极地霸主；美国治理话语与资源开发强、但破冰船队羸弱（仅 2 艘重型可用）；中国在<strong style={{ color: 'var(--text-primary)' }}>科考站网</strong>追近，但破冰装备、极地航运、资源开发仍是补课区——这正是核动力破冰平台预研的战略指向。
            </p>
            <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>权力物理：破冰吨位决定行动自由，没有破冰能力，航道与资源都只是纸面权利。</p>
          </div>
        </Grid>
        <div className="mt-4">
          <div className="text-xs mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>分维度堆叠（中 / 俄 / 美 · 示意分）</div>
          <EChart option={stackBar} style={{ height: 220 }} />
        </div>
      </Card>

      {/* ── 科考站布局 ── */}
      <Card title="科考站布局 · 从沿海到内陆冰盖（1985 → 2024）" className="mb-6">
        <EChart option={stationBar} style={{ height: 240 }} />
        <Grid cols={3} className="mt-4">
          {STATIONS.map((s) => (
            <div key={s.name} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${s.accent}` }}>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                <span className="text-[11px] mono" style={{ color: s.accent }}>{s.year}</span>
              </div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{s.type}</div>
            </div>
          ))}
        </Grid>
        <p className="text-xs mt-3 mono" style={{ color: 'var(--text-tertiary)' }}>雪龙、雪龙2（首艘自主双向破冰）构成双船科考集群，支撑五站补给与海上调查。</p>
      </Card>

      {/* ── 极地参与时间线 ── */}
      <Card title="交互 · 极地参与时间线 · 从南极破壁到装备自主" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      <FrameworkTrio cards={[
        { title: '航道革命', subtitle: '暖化打开新通道', body: '全球暖化退缩海冰，东北航道把地缘引力线向北方开阔水道转移。北极不是边缘板块，而是全球贸易引力闭环正在重排的物理必经之路——谁控制破冰与航道，谁就握住下一代海权的侧翼。', pillars: [['航程 -40%', '7200 vs 12000 海里。'], ['封锁规避', '绕过马六甲单一节点。'], ['引力转移', '贸易重力向北迁移。']] },
        { title: '资源前置', subtitle: '储量卡位 · 摸石头', body: '北极藏 13% 未探明石油、30% 天然气。在储量未采、规则未固之时，以科考在场与能源嵌入（亚马尔 LNG）占住席位——这是对未来资源再分配的前置下注，而非当下的占领。', pillars: [['科考站 5+1', '秦岭站补齐罗斯海。'], ['能源嵌入', '亚马尔/北极 LNG。'], ['深海占位', '矿产与渔业卡位。']] },
        { title: '治理话语', subtitle: '近北极国家身份', body: '规则即长期权力。以「近北极国家」身份参与北极理事会与南极条约议程，把地理上的局外人转化为制度上的利益相关方——为 2048 南极重审等长周期节点储备发言权。', pillars: [['观察员席位', '北极理事会 2013。'], ['政策白皮书', '《中国的北极政策》。'], ['2048 卡位', '南极条约重审筹码。']] },
      ]} />

      <Card title="调研结论 · 定义第三极均势"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>通过构建星地一体极地监测网、建设战略冗余的破冰集群，中国正从「极地参与者」向「规则共建者」攀爬。但现实主义不容浪漫：俄罗斯仍是无可争议的极地霸主，中国在破冰吨位与航运运营上是补课方，航道权益高度系于中俄关系稳定。极地的本质是<strong style={{ color: 'var(--text-primary)' }}>用今天的在场年限，购买明天的表决权</strong>——北极是规避地缘包围的战略侧翼，南极是地球最后的资源冗余仓，而破冰能力，是这一切权利得以兑现的物理底座。</p></Card>

      <ModuleFooter moduleId="polar" disclaimer="公开资料整理，数据为示意值 · 仅供地缘分析框架参考，非官方立场、非投资建议" sourceNote="由 china.html「极地战略」专题迁移升级" />
    </div>
  );
}
