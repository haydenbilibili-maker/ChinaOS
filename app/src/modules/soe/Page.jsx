import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const profitTrend = {
  legend: { data: ['总资产(万亿)', '净利润(万亿)'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 44, right: 44, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2018', '2021', '2024'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: [{ type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } }, { type: 'value', splitLine: { show: false }, axisLabel: { color: '#93a1b5' } }],
  series: [
    { name: '总资产(万亿)', type: 'bar', data: [180, 210, 260, 300], barWidth: 24, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
    { name: '净利润(万亿)', type: 'line', yAxisIndex: 1, smooth: true, data: [1.4, 1.7, 2.4, 2.6], lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' } },
  ],
};
const investPie = {
  tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 34, name: '战略性新兴产业', itemStyle: { color: '#c41e3a' } },
    { value: 24, name: '能源/资源', itemStyle: { color: '#e8a317' } },
    { value: 20, name: '基础设施', itemStyle: { color: '#22d3ee' } },
    { value: 14, name: '高端制造', itemStyle: { color: '#10b981' } },
    { value: 8, name: '其他', itemStyle: { color: '#64748b' } },
  ] }],
};
const competeRadar = {
  radar: { indicator: [{ name: '战略安全', max: 100 }, { name: '技术引领', max: 100 }, { name: '资本回报', max: 100 }, { name: '全员效率', max: 100 }, { name: '数字化', max: 100 }, { name: '链主带动', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [95, 78, 65, 70, 85, 88], name: '央企综合', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};

// 板块资产占比 donut（示意）
const sectorAssetPie = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  legend: { type: 'scroll', bottom: 0, textStyle: { color: '#93a1b5' }, icon: 'circle' },
  series: [{ type: 'pie', radius: ['42%', '68%'], center: ['50%', '42%'], label: { show: false }, data: [
    { value: 22, name: '能源电力', itemStyle: { color: '#c41e3a' } },
    { value: 24, name: '金融', itemStyle: { color: '#e8a317' } },
    { value: 8, name: '军工航天', itemStyle: { color: '#8b5cf6' } },
    { value: 18, name: '基建交通', itemStyle: { color: '#22d3ee' } },
    { value: 10, name: '电信', itemStyle: { color: '#10b981' } },
    { value: 10, name: '资源矿产', itemStyle: { color: '#fb923c' } },
    { value: 8, name: '装备制造', itemStyle: { color: '#64748b' } },
  ] }],
};

// 板块战略权重条形（命脉控制力 vs 市场化空间，示意）
const sectorWeightBar = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['命脉控制力', '市场化空间'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 72, right: 24, top: 30, bottom: 16 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'category', data: ['装备制造', '资源矿产', '电信', '基建交通', '军工航天', '金融', '能源电力'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  series: [
    { name: '命脉控制力', type: 'bar', stack: 'total', data: [60, 78, 88, 70, 98, 82, 92], itemStyle: { color: '#c41e3a' }, barWidth: 14 },
    { name: '市场化空间', type: 'bar', stack: 'total', data: [40, 22, 12, 30, 2, 18, 8], itemStyle: { color: '#22d3ee' } },
  ],
};

// ── 央企板块数据 ──
const SECTORS = [
  {
    key: 'energy', name: '能源电力', accent: '#c41e3a', position: '命脉 · 不计成本的底座',
    leaders: ['国家电网', '南方电网', '中石油', '中石化', '国家能源集团', '中核集团'],
    desc: '电力与油气是「不能熄火的引擎」。国网/南网构成全球最大输配电网络，承担兜底性普遍服务；油气三桶油锁定能源自主，确保极端断供场景下社会机能不断电。',
    boundary: '上游勘探、骨干电网、核电为绝对禁区；分布式光伏、充电桩、加油站零售向民营开放。',
    project: '特高压「西电东送」骨干网 · 华龙一号四代核电 · 沙戈荒大型风光基地',
  },
  {
    key: 'finance', name: '金融', accent: '#e8a317', position: '压舱石 · 系统流动性闸门',
    leaders: ['工农中建交', '国开行', '中投公司', '中国人寿', '中信集团'],
    desc: '国有大行是货币政策的传导末端与系统性风险的最后防线。下行期注入流动性、上行期收紧水龙头，金融国资是宏观调控的「避震器」与资本再分配总阀门。',
    boundary: '货币创造、政策性信贷、主权基金牢牢国有；消费金融、支付、财富管理留给市场竞争。',
    project: '逆周期信贷投放 · 化债与城投风险处置 · 一带一路项目融资',
  },
  {
    key: 'defense', name: '军工航天', accent: '#8b5cf6', position: '主权底牌 · 暴力垄断延伸',
    leaders: ['航天科技', '航天科工', '中国兵器', '中航工业', '中国电科', '中船集团'],
    desc: '军工是国家暴力垄断的物理载体，绝不外包。从载人航天、北斗、大飞机到舰船导弹，在「无人区」做最长周期、最高保密的投入，回报率让位于战略安全。',
    boundary: '核心总装、武器系统、卫星载荷全封闭；配套零部件、商业航天发射逐步引入民营「国家队预备役」。',
    project: '天宫空间站 · 北斗全球组网 · C919 国产大飞机 · 福建舰电磁弹射',
  },
  {
    key: 'infra', name: '基建交通', accent: '#22d3ee', position: '链主 · 跨周期投资工具',
    leaders: ['中国建筑', '中国中铁', '中国铁建', '中国交建', '国铁集团', '招商局'],
    desc: '基建央企是逆周期调控的「重型机械」。下行期一声令下即可拉动数万亿投资，对冲经济失速；同时作为「基建出海」链主，带动设备、标准、资本一体输出。',
    boundary: '高铁路网、骨干公路、港口枢纽国有控盘；市政、房建、运维大量分包民营专精特新。',
    project: '京沪/八纵八横高铁网 · 港珠澳大桥 · 雅鲁藏布江下游水电 · 一带一路港口群',
  },
  {
    key: 'telecom', name: '电信', accent: '#10b981', position: '命脉 · 数字底座管道',
    leaders: ['中国移动', '中国电信', '中国联通', '中国铁塔'],
    desc: '通信网络是数字时代的「神经与血管」。三大运营商垄断基础网络，铁塔公司统一基站资源，确保 5G/算力底座的自主可控与全域覆盖——信息主权的物理管道。',
    boundary: '骨干网、频谱、基站为国有专营；增值电信、云服务、内容应用层向 BAT 等民营全面竞争开放。',
    project: '5G 全国覆盖 · 东数西算算力枢纽 · 国家级一体化算力网',
  },
  {
    key: 'resource', name: '资源矿产', accent: '#fb923c', position: '链主 · 定价权筹码',
    leaders: ['中国宝武', '中国五矿', '中国稀土集团', '中铝集团', '中国黄金'],
    desc: '原材料是产业链最上游的「咽喉」。宝武锁定钢铁规模、稀土集团整合战略金属、五矿掌控海外矿权——目标是夺取全球大宗商品的定价权筹码，反制资源「卡脖子」。',
    boundary: '稀土、战略金属、海外大型矿权国家集约；普通建材、深加工、贸易环节市场化。',
    project: '稀土全产业链整合 · 海外铜钴锂矿权布局 · 钢铁产能集中度提升',
  },
  {
    key: 'equipment', name: '装备制造', accent: '#64748b', position: '链主 · 攻克卡脖子',
    leaders: ['中国中车', '中国电气装备', '哈电/东方电气', '中国一重', '国机集团'],
    desc: '高端装备是制造业的「母机」。中车输出高铁标准、电气装备统一电网设备、重型装备攻克核电与超超临界机组——承担高端制造国产替代与「专精特新」链主带动。',
    boundary: '重大技术装备、核心母机国有攻坚；通用机械、零部件配套大量民营协同。',
    project: '复兴号高铁 · 特高压成套设备 · 大型核电主泵/汽轮机国产化',
  },
];

const REFORM_STAGES = [
  { period: '2003–2013', title: '管资产 · 出资人到位', accent: '#64748b', desc: '国资委成立，结束「九龙治水」。明确出资人代表，做大做强央企规模，奠定「世界 500 强」基本盘。' },
  { period: '2013–2018', title: '管资本 · 混改破冰', accent: '#22d3ee', desc: '从管企业转向管资本。两类公司（国有资本投资/运营公司）试点，电信、电力、油气引入战略投资者混改。' },
  { period: '2018–2022', title: '专业化整合', accent: '#e8a317', desc: '横向合并、纵向延伸。组建电气装备、物流、稀土、矿产等集团，拆除碎片化内耗，单一行业意志最高统一。' },
  { period: '2022–至今', title: '市值管理 · 一利五率', accent: '#c41e3a', desc: '「一利五率」考核接管指挥棒，提出「中国特色估值体系」，把市值纳入央企负责人考核——主权意志的证券化。' },
];

export default function Page() {
  const [sectorKey, setSectorKey] = useState('energy');
  const [stageIdx, setStageIdx] = useState(REFORM_STAGES.length - 1);
  const sector = SECTORS.find((s) => s.key === sectorKey) || SECTORS[0];
  const stage = REFORM_STAGES[stageIdx];

  return (
    <div>
      <PageHeader badge="SOE · Strategic Control" title="国有企业战略重塑与权力逻辑" subtitle="宏观底座 · 核心功能 · 专业化整合 · 治理效能 —— 国有资本作为主权延伸的物理工具" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>国企不仅是经济主体，更是中枢控制国民经济命脉、应对全球性风险的物理工具。通过占领能源、电信、金融与高端制造等「战略制高点」，构建无法被外部轻易干扰的生存底座。改革逻辑已从「去行政化」转向「增强核心功能」——通过国企实现国家战略意志的精准投放。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="97 家" label="国资委监管央企" accent="#c41e3a" />
        <Stat value="300 万亿" label="国企总资产 (RMB)" accent="#22d3ee" />
        <Stat value="7 大" label="命脉链主板块" accent="#8b5cf6" />
        <Stat value="~70%" label="央企混改企业占比" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="央企净利润与资产规模演进（示意）"><EChart option={profitTrend} style={{ height: 240 }} /><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>从「规模红利」向「效率红利」的收缩与转型。</p></Card>
        <Card title="央企投资方向构成（2024E · 向战新倾斜）"><EChart option={investPie} style={{ height: 240 }} /></Card>
      </Grid>

      {/* ── 央企板块选择器 ── */}
      <Card title="央企板块控制图谱 · 点选切换" className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {SECTORS.map((s) => {
            const active = s.key === sectorKey;
            return (
              <button key={s.key} onClick={() => setSectorKey(s.key)} className="text-xs px-3 py-1.5 rounded mono"
                style={{
                  background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${active ? s.accent : 'var(--border-subtle)'}`,
                  cursor: 'pointer', transition: 'all .15s',
                }}>{s.name}</button>
            );
          })}
        </div>
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${sector.accent}` }}>
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
            <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{sector.name}</div>
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)', color: sector.accent }}>战略定位 · {sector.position}</span>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{sector.desc}</p>
          <Grid cols={2}>
            <div>
              <div className="text-[11px] mono mb-1.5" style={{ color: 'var(--text-tertiary)' }}>代表性链主央企</div>
              <div className="flex flex-wrap gap-1.5">
                {sector.leaders.map((l) => (
                  <span key={l} className="text-[11px] px-2 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>{l}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] mono mb-1.5" style={{ color: 'var(--text-tertiary)' }}>国进 / 民退 边界</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sector.boundary}</p>
            </div>
          </Grid>
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>典型超级工程 / 卡位 · </span>
            <span className="text-xs" style={{ color: 'var(--cyber-cyan)' }}>{sector.project}</span>
          </div>
        </div>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="七大板块资产占比（示意 · donut）"><EChart option={sectorAssetPie} style={{ height: 260 }} /></Card>
        <Card title="板块战略权重 · 命脉控制力 vs 市场化空间（示意）"><EChart option={sectorWeightBar} style={{ height: 260 }} /></Card>
      </Grid>

      {/* ── 盐铁逻辑框架卡 ── */}
      <div className="os-card p-5 mb-6" style={{ background: 'var(--bg-surface)', borderLeft: '3px solid var(--fire-gold)' }}>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-semibold" style={{ color: 'var(--fire-gold)' }}>盐铁逻辑</span>
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>The Salt-and-Iron Doctrine · 公元前 81 →  当代</span>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          自汉武帝盐铁官营起，国家垄断命脉行业（盐、铁、酒、铸币）从来不只是为利，而是为「维稳」——掌握命脉即掌握战争潜力、财政底盘与社会动员能力。两千年后，盐铁换成了电网、油气、稀土、算力与货币闸门，逻辑未变：<span style={{ color: 'var(--text-primary)' }}>谁控制命脉，谁就拥有不被外部颠覆的生存冗余。</span>国有资本是这一古老治理算法在工业文明维度的重装实现。
        </p>
        <Grid cols={3}>
          {[['财政底盘', '垄断利润内化为国家可调度的财政与战略储备，绕开税收阻力。'],
            ['动员能力', '极端场景下可一声令下集中调度能源、运力、产能，民营无此义务。'],
            ['反颠覆冗余', '命脉自主即「断供免疫」，对冲地缘脱钩与封锁的物理底牌。']].map(([t, d]) => (
            <div key={t}><div className="text-xs font-semibold mb-1" style={{ color: 'var(--fire-gold)' }}>{t}</div><p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </div>

      {/* ── 国资改革阶段时间线（交互） ── */}
      <Card title="国资改革阶段时间线 · 点选展开" className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {REFORM_STAGES.map((st, i) => {
            const active = i === stageIdx;
            return (
              <button key={st.period} onClick={() => setStageIdx(i)} className="text-xs px-3 py-1.5 rounded mono flex-1"
                style={{
                  minWidth: 130,
                  background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${active ? st.accent : 'var(--border-subtle)'}`,
                  cursor: 'pointer', transition: 'all .15s', textAlign: 'left',
                }}>
                <div style={{ color: active ? st.accent : 'var(--text-tertiary)' }}>{st.period}</div>
                <div>{st.title}</div>
              </button>
            );
          })}
        </div>
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${stage.accent}` }}>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{stage.period} · {stage.title}</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{stage.desc}</p>
        </div>
      </Card>

      <Card title="核心功能 · 从「普遍服务」到「战略支撑」" className="mb-6">
        <Grid cols={3}>
          {[['安全保障 (Security)', '能源石油、基础通信、民生水务的「底线思维」。作为「不计成本的备用系统」，确保极端环境下社会机能不断电。', '战略冗余 · 粮食/能源安全'],
            ['技术引领 (Innovation)', '作为「国家队」承担载人航天、国产大飞机、四代核电等重大专项，在「无人区」做大投入长周期创新。', '产业链链主 · 攻克卡脖子'],
            ['宏观调控 (Stability)', '通过国有资本投资平台平抑周期；下行期加大基建，风险期提供流动性，充当系统「避震器」。', '跨周期工具 · 资本再分配']].map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}><div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p><span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="专业化整合 · 拆除「内耗」的物理隔阂">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>为防官僚体系低效竞争（碎片化），推动「横向合并、纵向延伸」。成立中国电气装备、中国物流、中国盐业等集团，实现单一行业意志的最高统一——「资源最大化集约」。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>中国电科 + 中国华录</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>数据存储与信息安全产业链深度缝合，建立自主数字底座。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>钢铁/有色板块整合</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>经中国宝武、中国稀土等巨头，掌握原材料的全球定价权筹码。</p></div>
          </div>
        </Card>
        <Card title="国企核心竞争力模型（2024 评估 · 示意）"><EChart option={competeRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="绩效算法 ·「一利五率」的指挥棒" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>不再只看产值。通过「利润总额、净资产收益率、研发经费投入强度、全员劳动生产率、营业现金比率」综合考核，强迫这个庞然大物在具备「行政力」的同时具备「市场狼性」。</p>
        <Grid cols={2}>
          <Stat value="≤ 65%" label="资产负债率严控" accent="#e8a317" />
          <Stat value="90%" label="数字化率提升目标" accent="#22d3ee" />
        </Grid>
      </Card>

      <Card title="调研结论 · 定义「世界一流」" className="mb-6">
        <Grid cols={3}>
          {[['1 · 从行政化管理到资本化经营', '终点不是私有化，而是「主权意志的证券化」——经高水平上市公司治理，用资本市场反哺主权战略。'],
            ['2 ·「链主」模式的溢价', '掌握产业链核心节点，带动成千上万家民营「专精特新」，形成具打击韧性的产业蜂群。'],
            ['3 · 不可替代的生存冗余', '对能源、粮食、数据的绝对控制，是应对地缘政治「极端场景」的物理底牌。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研组总结" className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>国企是中国政治体制在经济维度的「重装步兵」，冷酷地追求战略安全性与资本回报率的平衡。盐铁两千年，命脉从未旁落——只是从盐与铁，换成了电网、算力与货币的闸门。</p></Card>

      <CrossLinks links={[
        { to: '/civilization', label: '文明透视 · 卷十二「盐铁逻辑」' },
        { to: '/private', label: '民营经济 · 国进民退的边界' },
      ]} />

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：国资委、统计局、行业机构综合，板块占比/权重/链主清单为示意值，仅供分析框架参考，非投资建议 · 由 china.html「国有资本」专题迁移升级</p>
    </div>
  );
}
