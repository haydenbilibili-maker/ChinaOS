import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { FrameworkTrio } from '../shared/ModuleParadigm.jsx';
import {
  VOLUMES, STACK_ORDER, REGIME, REGIME_TAG, VOL_LINKS, CIV_META, wordEstimate,
} from './volumes.js';

const COMPARE_DIMS = [
  { name: '个体 / 集体', max: 100 },
  { name: '超越性来源', max: 100 },
  { name: '权力合法性', max: 100 },
  { name: '变革方式', max: 100 },
  { name: '商业地位', max: 100 },
  { name: '法律 / 关系', max: 100 },
];
const COMPARE_TABLE = [
  ['个体 / 集体', '个人主义 · 契约社会', '集体 / 关系 · 家国同构', 85],
  ['超越性来源', '人格神 · 彼岸超越', '天命 · 祖先 · 现世内在', 80],
  ['权力合法性', '神授君权 / 民约', '绩效合法性 · 敬天保民', 75],
  ['变革方式', '革命 · 断裂 · 制度重设', '均值回归 · 治乱循环 · 改良', 70],
  ['商业地位', '商人入主流 · 资本驱动', '士农工商 · 资本政治天花板', 88],
  ['法律 / 关系', '成文法 · 罪感约束', '人情面子 · 耻感约束', 78],
];
const compareRadar = {
  tooltip: {},
  radar: { indicator: COMPARE_DIMS, axisName: { color: '#93a1b5', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } } },
  legend: { data: ['中华文明栈', '西方文明栈（理想型）'], textStyle: { color: '#93a1b5' }, bottom: 0 },
  series: [{
    type: 'radar',
    data: [
      { value: COMPARE_TABLE.map((r) => r[3]), name: '中华文明栈', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.16)' }, itemStyle: { color: '#c41e3a' } },
      { value: COMPARE_TABLE.map((r) => 100 - r[3]), name: '西方文明栈（理想型）', lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.10)' }, itemStyle: { color: '#22d3ee' } },
    ],
  }],
};

function StackBars({ active, onPick, dimFor }) {
  return (
    <div className="space-y-1">
      {[...STACK_ORDER].reverse().map((k) => {
        const x = VOLUMES[k];
        const sel = k === active;
        const op = dimFor ? dimFor(k) : 1;
        return (
          <button key={k} onClick={() => onPick(k)}
            className="w-full text-left rounded flex items-stretch gap-0 overflow-hidden transition-all"
            style={{ background: sel ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)', border: `1px solid ${sel ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer', opacity: op }}>
            <span style={{ width: 5, background: x.color, flexShrink: 0 }} />
            <span className="flex items-center gap-3 px-3 py-2 flex-1">
              <span className="text-[10px] mono shrink-0" style={{ width: 132, color: x.color }}>{x.role}</span>
              <span className="text-xs flex-1" style={{ color: sel ? '#fff' : 'var(--text-secondary)' }}>{x.num} · {x.title}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function VolumeCard({ volId, compact }) {
  const v = VOLUMES[volId];
  const [rtag, rcolor] = REGIME_TAG[REGIME[volId]];
  const words = wordEstimate(v);
  return (
    <div className="os-card p-4 flex flex-col h-full" style={{ borderLeft: `3px solid ${v.color}` }}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{v.num}</span>
        <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: v.color }}>{v.role}</span>
        <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${rcolor}1a`, color: rcolor }}>{rtag}</span>
      </div>
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{v.title}</div>
      {!compact && <p className="text-xs leading-relaxed flex-1 mb-3" style={{ color: 'var(--text-secondary)' }}>{v.thesis.slice(0, 120)}…</p>}
      <div className="flex flex-wrap gap-1 mb-3">
        {v.tags?.slice(0, 3).map((t) => (
          <span key={t} className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}>{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{v.sections?.length} 节 · ~{words} 字</span>
        <Link to={`/civilization/v/${volId}`} className="text-xs mono px-2.5 py-1 rounded"
          style={{ background: `${v.color}22`, color: '#fff', border: `1px solid ${v.color}` }}>
          进入全文 →
        </Link>
      </div>
    </div>
  );
}

const TABS = [['stack', '文明栈总览'], ['read', '逐卷精读'], ['schedule', '治乱调度算法'], ['compare', '中西对照']];

export default function Page() {
  const [vol, setVol] = useState('v2');
  const [tab, setTab] = useState('stack');
  const [regime, setRegime] = useState('boom');
  const v = VOLUMES[vol];
  const [rtag, rcolor] = REGIME_TAG[REGIME[vol]];
  const btn = (a) => ({ background: a ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: a ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '6px 14px', fontSize: 13 });
  const dimFor = (k) => {
    const r = REGIME[k];
    if (r === regime || r === 'both') return 1;
    if (r === 'base') return 0.5;
    return 0.16;
  };

  return (
    <div>
      <PageHeader badge="Civilization Lens · 12 卷"
        title="文明透视 · 文明源代码栈"
        subtitle="把文明拆成一台可分层调试的操作系统：地理物理底座 → 宇宙观 → 法家内核 → 儒家源代码 → 道家减震器 → 汉字科举硬件 → 佛学心理补丁 → 人情非正式层 → 盐铁财富闭环，以总纲串成引导扇区" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        与「<Link to="/depth" className="mono" style={{ color: 'var(--cyber-cyan)' }}>深度透视</Link>」经济—地缘主线并列的文化战略长篇。核心隐喻：每一卷是一层，自下而上叠成全栈；<strong style={{ color: 'var(--text-primary)' }}>外儒内法剂之以道</strong>不是并列，而是<strong style={{ color: 'var(--text-primary)' }}>分时调度</strong>——顺境儒法扩张、逆境切道家熬冬。点击「逐卷精读」或「进入全文」可打开完整报告详情页。
      </p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value={`${CIV_META.volumeCount}/${CIV_META.volumeCount}`} label="全栈卷数 · 已就绪" accent="#c41e3a" />
        <Stat value={`${CIV_META.stackDepth} 层`} label="OS 栈深度（9+总纲）" accent="#22d3ee" />
        <Stat value={`${Math.round(CIV_META.totalWords / 1000)}k`} label="总字数约" accent="#e8a317" />
        <Stat value="6 维" label="中西对照维度" accent="#10b981" />
      </Grid>

      <div className="flex gap-1 flex-wrap mb-4">
        {TABS.map(([k, label]) => <button key={k} onClick={() => setTab(k)} style={btn(k === tab)} className="mono">{label}</button>)}
      </div>

      {tab === 'stack' && (
        <Grid cols={2} className="mb-6">
          <Card title="文明 OS 栈 · 自下而上（点层切换）">
            <StackBars active={vol} onPick={setVol} />
            <p className="text-[11px] mono mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>// 左侧色条 = 各层在栈中的位置；下层为上层提供运行前提</p>
          </Card>
          <Card title={`${v.num} · ${v.title}`}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: v.color }}>{v.role}</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${rcolor}1a`, color: rcolor }}>{rtag}</span>
              <Link to={`/civilization/v/${vol}`} className="text-[11px] mono px-2 py-0.5 rounded"
                style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)', border: '1px solid rgba(34,211,238,0.25)' }}>
                → 全文报告
              </Link>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{v.thesis}</p>
            {v.frameworks && <FrameworkTrio cards={v.frameworks} />}
            <Link to={`/civilization/v/${vol}`} className="text-xs mono inline-block mt-2"
              style={{ color: 'var(--cyber-cyan)' }}>
              展开完整报告（{v.sections?.length} 节 + 框架卡）→
            </Link>
          </Card>
        </Grid>
      )}

      {tab === 'read' && (
        <div className="mb-6">
          <div className="flex gap-1.5 flex-wrap mb-4">
            {[...STACK_ORDER].reverse().map((k) => (
              <Link key={k} to={`/civilization/v/${k}`}
                className="text-xs px-2.5 py-1 rounded mono"
                style={{ background: k === vol ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === vol ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === vol ? VOLUMES[k].color : 'transparent'}` }}>
                {VOLUMES[k].num}
              </Link>
            ))}
          </div>
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {[...STACK_ORDER].reverse().map((k) => <VolumeCard key={k} volId={k} />)}
          </div>
          <Card className="mb-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{v.num} · {v.title}</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: v.color }}>{v.role}</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${rcolor}1a`, color: rcolor }}>{rtag}</span>
              <Link to={`/civilization/v/${vol}`} className="text-[11px] mono ml-auto" style={{ color: 'var(--cyber-cyan)' }}>→ 进入全文报告</Link>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.thesis}</p>
          </Card>
          <Grid cols={2} className="mb-4">
            {v.sections.map((sec) => (
              <Card key={sec.id} title={sec.title}>
                {sec.lead && <p className="text-[11px] mono mb-2" style={{ color: v.color }}>{sec.lead}</p>}
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sec.body[0]}</p>
              </Card>
            ))}
          </Grid>
          {VOL_LINKS[vol] && <CrossLinks title={`${v.num} · 现实接口 · 直跳业务模块`} links={VOL_LINKS[vol]} />}
        </div>
      )}

      {tab === 'schedule' && (
        <Grid cols={2} className="mb-6">
          <Card title="治乱调度算法 · 同一套栈的两种系统态">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setRegime('boom')} className="flex-1 text-sm py-2 rounded mono"
                style={{ background: regime === 'boom' ? 'rgba(232,163,23,0.2)' : 'var(--bg-elevated)', color: regime === 'boom' ? '#e8a317' : 'var(--text-secondary)', border: `1px solid ${regime === 'boom' ? '#e8a317' : 'transparent'}`, cursor: 'pointer' }}>顺境 · 儒法扩张</button>
              <button onClick={() => setRegime('bust')} className="flex-1 text-sm py-2 rounded mono"
                style={{ background: regime === 'bust' ? 'rgba(16,185,129,0.2)' : 'var(--bg-elevated)', color: regime === 'bust' ? '#10b981' : 'var(--text-secondary)', border: `1px solid ${regime === 'bust' ? '#10b981' : 'transparent'}`, cursor: 'pointer' }}>逆境 · 道家熬冬</button>
            </div>
            <StackBars active={vol} onPick={setVol} dimFor={dimFor} />
            <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>// 亮 = 当前态主调度层 · 半亮 = 结构常量底座 · 暗 = 另一态才激活</p>
          </Card>
          <Card title={regime === 'boom' ? '顺境调度 · 儒法驱动扩张' : '逆境调度 · 道家低耗熬冬'}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {regime === 'boom'
                ? '王朝上升期 / 经济扩张期：法家内核（L2）以 KPI 与动员驱动增长，儒家源代码（L3）供合法性与愿景，汉字—科举（L5）持续收敛精英入口。系统高整合、高动员，代价是低方差、压抑高风险创新（李约瑟难题之果）。现实回响：强监管、超级工程、集中力量办大事。'
                : '王朝末年 / 经济崩溃期：切换道家减震器（L4）——轻徭薄赋、与民休息、放松管制、负面清单，靠自发秩序修复元气；佛学心理补丁（L6）卸载意义溢出。系统低耗、容错、均值回归。现实回响：从强监管转向稳预期、休养生息、「我无为而民自化」。'}
            </p>
            <div className="space-y-2">
              {Object.entries(REGIME).filter(([, r]) => r === regime || r === 'both').map(([k]) => (
                <Link key={k} to={`/civilization/v/${k}`} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded block"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: VOLUMES[k].color }} />
                  <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{VOLUMES[k].num} · {VOLUMES[k].title}</span>
                  <span className="text-[10px] mono ml-auto" style={{ color: 'var(--text-tertiary)' }}>{VOLUMES[k].role}</span>
                </Link>
              ))}
            </div>
            <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>暴力强制层（L2b）两态常驻——无论扩张或收缩，对暴力的垄断始终是内核的最终保障。</p>
          </Card>
        </Grid>
      )}

      {tab === 'compare' && (
        <Grid cols={2} className="mb-6">
          <Card title="中西文明操作系统对照 · 雷达（理想型 · 非实证）">
            <EChart option={compareRadar} style={{ height: 300 }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>刻度向外（红）= 偏中华栈取向，向内反向（青）= 偏西方理想型；二者每一维度互为镜像，仅作思想史对照，不代表优劣或精确测量。</p>
          </Card>
          <Card title="维度逐项对照表">
            <div className="space-y-2">
              {COMPARE_TABLE.map(([dim, west, china]) => (
                <div key={dim} className="pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{dim}</div>
                  <div className="flex gap-2 text-[11px] leading-snug">
                    <div className="flex-1" style={{ color: 'var(--cyber-cyan)' }}>西 · {west}</div>
                    <div className="flex-1 text-right" style={{ color: 'var(--china-red)' }}>{china} · 华</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Grid>
      )}

      <CrossLinks title="叠读提示 · 文明栈与现实模块的接口" links={[
        { to: '/powerlogic', label: '权力逻辑', note: '卷二法家内核 ↔ 儒表法里的当代运行。' },
        { to: '/military', label: '军事力量', note: '卷九暴力垄断 ↔ 枪杆子里出政权。' },
        { to: '/soe', label: '国有资本', note: '卷十二盐铁逻辑 ↔ 战略底座与链主。' },
        { to: '/redweb', label: '红网结构', note: '非正式层与人情面子 ↔ 权贵网络。' },
        { to: '/straits', label: '台海局势', note: '卷十一地理密室 ↔ 地缘重力与硅盾。' },
        { to: '/private', label: '民营经济', note: '卷十交换层 ↔ 缝隙内卷与资本天花板。' },
      ]} />
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>全文报告已内嵌至 React 详情页（/civilization/v/:id）；原 civilization-*.html 独立报告仍保留于仓库根目录 · 思想史隐喻，非实证结论</p>
    </div>
  );
}
