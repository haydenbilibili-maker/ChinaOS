import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// 五大军种（迁自 china.html militaryOrgData）
const ORG = {
  army: { title: '陆军 (PLAA)', tag: '规模第一', stat: '~85万 · 合成旅80+', desc: '世界规模最大的地面部队。持续推进合成化改革，由师团制向旅营制转型，强调全域机动与立体攻防，重点提升空突力量和远程火力。', mission: '保卫陆地疆土，维护主权安全，参与国际维和与人道救援。', equip: '99A主战坦克、04A步战车、PCL-181车载榴弹炮、直-20、远程火箭炮。' },
  navy: { title: '海军 (PLAN)', tag: '走向深蓝', stat: '350+艘 · 航母3', desc: '从近海防御型向远海防卫型转变。北海/东海/南海三大舰队快速换装，航母战斗群建设为核心。', mission: '近海防御、远海防卫，维护海上交通线与海外利益。', equip: '辽宁舰/山东舰/福建舰，055型万吨大驱，052D，075两栖攻击舰，094/093核潜艇。' },
  air: { title: '空军 (PLAAF)', tag: '跨代升级', stat: '1,300+架 · 歼-20 200+', desc: '建设空天一体、攻防兼备的强大空军。由国土防空向攻势防空转变，五代机数量快速增长。', mission: '国土防空、空中进攻、战略投送、支援陆海作战。', equip: '歼-20、运-20、轰-6K/N、空警-500、红旗-9。' },
  rocket: { title: '火箭军 (PLARF)', tag: '战略威慑', stat: '350+枚 · MIRV', desc: '战略威慑核心力量。核常兼备、射程衔接，具备对陆上要点与海上移动目标的精确打击能力。', mission: '遏制核威胁，遂行核反击与常规导弹精确打击。', equip: '东风-17(高超)、东风-21D/26、东风-41(洲际)、东风-100(巡航)。' },
  support: { title: '战略支援与联勤 (SSF)', tag: '信息主导', stat: '全域 · 一体化', desc: '整合太空、网络、电子战、心理战等新型作战力量及全军联勤保障，是信息化战争的力量倍增器。', mission: '战场环境/信息通信保障、信息攻防、战略投送与物资供应。', equip: '北斗导航、电子侦察卫星、网络攻防平台、综合补给体系。' },
};

// 弹道导弹谱系（迁自 militaryMissileData）
const MISSILE = {
  srbm: { title: '近程弹道导弹 (SRBM)', variants: 'DF-11/15/16', range: '600 – 1,000 km', width: 10, desc: '精确打击周边高价值目标（机场、港口、指挥中心），数量庞大、精度高。', target: '覆盖第一岛链内目标，重点针对台湾岛及周边海域。' },
  mrbm: { title: '中程/反舰弹道导弹 (MRBM)', variants: 'DF-21D 航母杀手', range: '1,500 – 2,500 km', width: 25, desc: '「反介入/区域拒止」(A2/AD) 核心武器，DF-21D 具备打击海上移动目标能力。', target: '覆盖第一至第二岛链海域，含日本、菲律宾及南海。' },
  irbm: { title: '中远程弹道导弹 (IRBM)', variants: 'DF-26 关岛快递', range: '3,000 – 4,000 km', width: 40, desc: '核常兼备、快速反应，DF-26 可打击第二岛链关键节点。', target: '覆盖关岛安德森基地及印度洋北部，威慑第二岛链。' },
  icbm: { title: '洲际弹道导弹 (ICBM)', variants: 'DF-31AG/41', range: '12,000 – 15,000 km', width: 100, desc: '战略核威慑基石。固体燃料，机动/井基部署，具备多弹头分导 (MIRV)。', target: '覆盖全球大部，确保二次核打击能力。' },
};

const budgetChart = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2014', '2016', '2018', '2020', '2022', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: 'B$', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [131, 146, 168, 178, 200, 236], barWidth: 26, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } }],
};

const navyChart = {
  grid: { left: 80, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['075型两栖', '航母', '055型大驱', '052D驱逐舰'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [3, 3, 8, 25], barWidth: 14, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }],
};

const airChart = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['52%', '72%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 55, name: '四/五代机', itemStyle: { color: '#c41e3a' } },
    { value: 45, name: '三代及以下', itemStyle: { color: '#27324a' } },
  ] }],
};

export default function Page() {
  const [org, setOrg] = useState('army');
  const [mis, setMis] = useState('srbm');
  const o = ORG[org]; const m = MISSILE[mis];
  return (
    <div>
      <PageHeader badge="Military" title="中国军事力量全维度透视" subtitle="三步走 · 战区体制 · 五大军种 · 战略威慑 —— 机械化信息化智能化融合" />
      <Grid cols={3} className="mb-4">
        {[['2027', '建军百年', '机械化信息化智能化融合，具备捍卫主权与统一的战略能力。'],
          ['2035', '国防现代化', '基本实现国防和军队现代化，理论/组织/人员/装备全面升级。'],
          ['2049', '世界一流', '全面建成世界一流军队，支撑民族复兴战略高度。']].map(([y, t, d]) => (
          <Card key={y}><div className="flex items-baseline gap-2"><span className="text-xl font-bold mono" style={{ color: 'var(--china-red)' }}>{y}</span><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t}</span></div><p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <Grid cols={6} className="mb-6">
        <Stat value="~200万" label="现役总兵力" />
        <Stat value="350+" label="主要水面舰艇" accent="#22d3ee" />
        <Stat value="1,300+" label="现代化战机" />
        <Stat value="350+" label="洲际弹道导弹" accent="#c41e3a" />
        <Stat value="$236B" label="国防预算 2024" accent="#e8a317" />
        <Stat value="~1.2%" label="占 GDP" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="国防预算趋势 2014–2024（B$ · 示意）"><EChart option={budgetChart} style={{ height: 240 }} /></Card>
        <Card title="组织架构与战区体制 · 军委管总/战区主战/军种主建">
          <div className="flex gap-1 flex-wrap mb-3">
            {Object.keys(ORG).map((k) => (
              <button key={k} onClick={() => setOrg(k)} className="text-xs px-2 py-1 rounded mono"
                style={{ background: k === org ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === org ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                {ORG[k].title.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2"><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{o.title}</span><span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.16)', color: 'var(--china-red)' }}>{o.tag}</span></div>
          <p className="text-xs mono mt-1" style={{ color: 'var(--fire-gold)' }}>{o.stat}</p>
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{o.desc}</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div><div className="font-semibold" style={{ color: 'var(--text-primary)' }}>核心任务</div><div style={{ color: 'var(--text-tertiary)' }}>{o.mission}</div></div>
            <div><div className="font-semibold" style={{ color: 'var(--text-primary)' }}>主要装备</div><div style={{ color: 'var(--text-tertiary)' }}>{o.equip}</div></div>
          </div>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="海军力量：走向深蓝（艘 · 示意）"><EChart option={navyChart} style={{ height: 220 }} /></Card>
        <Card title="空军力量：跨代升级（四/五代机占比 · 示意）"><EChart option={airChart} style={{ height: 220 }} /></Card>
      </Grid>

      <Card title="火箭军与战略威慑 · 弹道导弹谱系" className="mb-6">
        <div className="flex gap-1 flex-wrap mb-3">
          {Object.keys(MISSILE).map((k) => (
            <button key={k} onClick={() => setMis(k)} className="text-xs px-2 py-1 rounded mono"
              style={{ background: k === mis ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === mis ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
              {m && MISSILE[k].title.match(/\(([^)]+)\)/)?.[1] || k.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between"><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{m.title}</span><span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{m.variants}</span></div>
        <p className="text-xs mt-2 mb-3" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
        <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-tertiary)' }}>射程</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{m.range}</span></div>
        <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}><div style={{ width: `${m.width}%`, height: '100%', background: 'linear-gradient(90deg,#c41e3a,#e8a317)', transition: 'width .4s' }} /></div>
        <div className="mt-3 text-xs"><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>战略覆盖：</span><span style={{ color: 'var(--text-tertiary)' }}>{m.target}</span></div>
      </Card>

      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>数据来源：公开防务白皮书、IISS 及五角大楼年度报告整理；具体数值为示意。仅供研究参考，不代表官方立场 · 由 china.html「军事」专题迁移</p>
    </div>
  );
}
