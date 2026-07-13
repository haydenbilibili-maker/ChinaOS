import React, { useState, useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { SelectorBar } from '../shared/ModuleParadigm.jsx';
import { AXIS, LABEL, GRID_LINE, CHART_SERIES_PALETTE } from '../shared/chartHelpers.js';

// ============================================================================
// ㉒ 人生决策框架 · 养老 / 医疗 / 教育 / 储蓄
// ----------------------------------------------------------------------------
// 不是「该买什么」，而是「该想清楚哪几件事」——一套结构化的人生规划自查框架，
// 落在一个 35 岁、灵活就业、东北创业者的具体处境上：没有单位代缴的第二支柱、
// 创业现金流波动、社保连续性、终身学习的再投资。
// 声明：本节为一般性规划框架与自查工具 · 非投资建议 · 非个性化财务规划 ·
//      数值为通用经验法则的示意区间、非承诺；养老/医疗/税务/保险等重大决策，
//      请以官方政策与持牌理财/保险/税务顾问意见为准。
// ============================================================================

const C = { cinnabar: '#c41e3a', cyan: '#22d3ee', ochre: '#e8a317', green: '#10b981', violet: '#8b5cf6', slate: '#94a3b8' };

const TABS = [
  { key: 'pension', label: '养老', accent: C.ochre },
  { key: 'medical', label: '医疗', accent: C.cinnabar },
  { key: 'edu', label: '教育', accent: C.cyan },
  { key: 'saving', label: '储蓄', accent: C.green },
  { key: 'overview', label: '总览 · 自查', accent: C.violet },
];

// —— 养老：支柱框架 ——
const PILLARS = [
  { t: '第一支柱 · 社会基本养老', d: '国家基本养老保险。创业者/无单位者按「灵活就业人员」自行缴纳——自己同时承担单位+个人部分，缴费基数与年限直接决定基础养老金。', tag: '基础层', color: C.green },
  { t: '第二支柱 · 企业/职业年金', d: '由用人单位建立。创业者/灵活就业者通常没有这一层——这是你养老结构里最明显的缺口，需要用第三支柱主动补。', tag: '缺口', color: C.cinnabar },
  { t: '第三支柱 · 个人养老金 + 商业养老', d: '个人养老金账户（税收递延）+ 商业养老年金/储蓄。对没有第二支柱的人，这一层从「锦上添花」变成「必须自建」。', tag: '需自建', color: C.ochre },
  { t: '第零支柱 · 家庭与资产', d: '自住房产、家庭互助、长期被动收入。东北房产流动性与增值预期偏弱，不宜作为养老的主力假设。', tag: '辅助', color: C.slate },
];
const PENSION_Q = [
  '灵活就业社保是否连续缴、基数选多少？断缴对年限与待遇的影响算过吗？',
  '没有第二支柱，第三支柱（个人养老金账户）开了吗、年度额度用满了吗？',
  '退休「替代率」目标是多少？（养老金 ÷ 退休前收入，纯社保通常偏低，需自补）',
  '创业收入波动期，养老缴费会不会被现金流挤掉、如何设自动化最低线？',
];

// —— 医疗：三层保障 ——
const MED_LAYERS = [
  { t: '基础层 · 社会医保', d: '职工医保 / 灵活就业医保。创业者要盯紧社保连续性——断缴可能影响报销与连续参保年限、个别地区影响大病待遇。', color: C.green },
  { t: '补充层 · 大病/惠民保', d: '城市定制型商业补充医疗（如各地惠民保），保费低、覆盖大额自付，性价比层。', color: C.cyan },
  { t: '杠杆层 · 商业医疗 + 重疾', d: '百万医疗险（住院大额）+ 重疾险（收入损失补偿）。对一个收入靠自己、无单位兜底的人，重疾=现金流的最大单点风险。', color: C.cinnabar },
];
const MED_NOTE = '创业者的医疗风险有两面：一是「治疗费」（医保+商业医疗险兜），二是更隐蔽的「收入中断」（生病期间业务停摆、现金流断裂）——后者往往比前者更致命，是重疾险与应急金共同要对冲的。';

// —— 教育：两类 ——
const EDU_CHILD = [
  ['0–3 岁', '抚养成本起步，先建教育金「时间换空间」的长期账户雏形'],
  ['学前–小学', '校内 + 兴趣，现金流压力中等，定投/长期账户持续'],
  ['初中–高中', '支出抬升、不确定性大（升学路径分叉）'],
  ['大学 / 海外（可选）', '教育金的兑付高峰，需在前 15 年提前备足'],
];
const EDU_SELF = [
  ['终身学习是 ROI 最高的「教育」', 'AI 工具链 / 出海 2.0 / 新行业认知——对你，给自己的再投资比任何理财都更直接地改写收入曲线'],
  ['把学习预算写进固定支出', '像交社保一样定额投入技能，对冲「红利退潮 + 年龄议价折旧」'],
  ['可迁移技能 > 单一红利技能', '优先投资能跨行业/跨周期复用的能力（增长方法论、跨文化、AI 编排）'],
];

// —— 储蓄：三笔钱 ——
const BUCKETS = [
  { t: '① 应急金 · 要命的钱', d: '随时可取、不波动。创业者/不稳定收入者建议覆盖 6–12 个月刚性支出（打工者 3–6 个月）——这是所有冒险的安全边际，呼应本页 ⑳「现金流是安全边际」。', span: '0–活期', color: C.cinnabar },
  { t: '② 中期 · 要用的钱', d: '3–5 年内有明确用途（换房/教育/扩店）。求稳健与流动性的平衡，不追高波动。', span: '3–5 年', color: C.ochre },
  { t: '③ 长期 · 养老/传承的钱', d: '10 年以上不动用，用时间换复利与抗通胀。第三支柱养老、长期账户落在这一层。', span: '10 年+', color: C.green },
];

// —— 总览：人生阶段时间轴 ——
const STAGES = [
  { age: '35–40', focus: '攒安全垫 · 建第三支柱', d: '应急金补到 6–12 个月、开个人养老金账户、补齐重疾/医疗险、把学习预算固定化。创业期优先「不倒下」。', color: C.cinnabar },
  { age: '40–45', focus: '教育与住房 · 现金流提速', d: '若有子女，教育金长期账户成形；住房决策与区域绑定；业务跑通后提高长期账户比例。', color: C.ochre },
  { age: '45–55', focus: '健康与养老加码', d: '健康投入与体检前置；养老缺口集中补；资产从「搏增长」向「保购买力」过渡。', color: C.cyan },
  { age: '55–65+', focus: '提速养老 · 准备领取', d: '养老金领取规划、医疗保障升级、被动收入与传承安排。', color: C.green },
];

// —— 自查：四支柱覆盖度 ——
const CHECK_ITEMS = [
  '应急金已覆盖 ≥6 个月刚性支出',
  '灵活就业社保连续缴、基数已确认',
  '个人养老金账户已开、年度额度在用',
  '医保 + 百万医疗 + 重疾 三层已配齐',
  '学习/技能再投资已写进固定预算',
  '中长期的钱已与短期应急金分账管理',
];

function bucketAreaOption() {
  // 三笔钱占比随人生阶段的「框架示意」（非建议）
  const ages = ['35', '45', '55', '65'];
  const mk = (name, color, data) => ({ name, type: 'line', stack: 'b', areaStyle: { color, opacity: 0.5 }, lineStyle: { width: 1, color }, symbol: 'none', data });
  return {
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, data: ['应急金', '中期', '长期养老'] },
    grid: { left: 36, right: 16, top: 28, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ages, boundaryGap: false, name: '年龄', nameTextStyle: { color: LABEL.color, fontSize: 9 }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, axisTick: { show: false } },
    yAxis: { type: 'value', max: 100, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, formatter: '{value}%' }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
    series: [
      mk('应急金', C.cinnabar, [30, 20, 15, 12]),
      mk('中期', C.ochre, [45, 40, 30, 23]),
      mk('长期养老', C.green, [25, 40, 55, 65]),
    ],
  };
}

export default function SectionLifePlan() {
  const [tab, setTab] = useState('overview');
  const [checks, setChecks] = useState(() => CHECK_ITEMS.map(() => false));
  const areaOpt = useMemo(bucketAreaOption, []);
  const coverage = useMemo(() => Math.round((checks.filter(Boolean).length / checks.length) * 100), [checks]);
  const covColor = coverage >= 67 ? C.green : coverage >= 34 ? C.ochre : C.cinnabar;
  const toggle = (i) => setChecks((cs) => cs.map((v, k) => (k === i ? !v : v)));

  const Cap = () => (
    <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
      一般性规划框架与自查工具 · 非投资建议 · 非个性化财务规划 · 数值为通用经验法则示意区间 · 养老/医疗/税务/保险重大决策请以官方政策与持牌顾问意见为准。
    </p>
  );
  const List = ({ items, color }) => (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.t || it[0]} className="os-card p-3" style={{ borderLeft: `3px solid ${it.color || color}` }}>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{it.t || it[0]}</span>
            {it.tag && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ color: it.color, border: `1px solid ${it.color}55` }}>{it.tag}</span>}
            {it.span && <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{it.span}</span>}
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{it.d || it[1]}</div>
        </div>
      ))}
    </div>
  );

  return (
    <Card title="㉒ 人生决策框架 · 养老 / 医疗 / 教育 / 储蓄">
      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        不是「该买什么」，而是「该想清楚哪几件事」——把通用的人生规划框架，落在一个 35 岁、灵活就业、东北创业者的具体处境上：
        没有单位代缴的第二支柱、创业现金流波动、社保连续性、以及对你而言 ROI 最高的「教育」其实是给自己的再投资。
      </p>

      <SelectorBar items={TABS} activeKey={tab} onSelect={setTab} />

      {/* 养老 */}
      {tab === 'pension' && (
        <div className="mt-4">
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>养老 · 支柱结构（创业者视角）</div>
          <List items={PILLARS} />
          <div className="text-[11px] mono mt-3 mb-2" style={{ color: 'var(--text-tertiary)' }}>四个该算清的问题</div>
          <div className="space-y-1.5">
            {PENSION_Q.map((q, i) => (
              <div key={i} className="flex items-baseline gap-2 text-[11px]"><span className="mono" style={{ color: C.ochre }}>Q{i + 1}</span><span style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{q}</span></div>
            ))}
          </div>
          <Cap />
        </div>
      )}

      {/* 医疗 */}
      {tab === 'medical' && (
        <div className="mt-4">
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>医疗 · 三层保障</div>
          <List items={MED_LAYERS} />
          <div className="os-card p-3 mt-3 text-[11px]" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, borderLeft: `3px solid ${C.cinnabar}` }}>{MED_NOTE}</div>
          <Cap />
        </div>
      )}

      {/* 教育 */}
      {tab === 'edu' && (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>子女教育金 · 时间轴框架（条件式）</div>
            <List items={EDU_CHILD.map((e) => ({ t: e[0], d: e[1] }))} color={C.cyan} />
          </div>
          <div>
            <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>自身教育 · ROI 最高的再投资</div>
            <List items={EDU_SELF.map((e) => ({ t: e[0], d: e[1] }))} color={C.violet} />
          </div>
          <div className="md:col-span-2"><Cap /></div>
        </div>
      )}

      {/* 储蓄 */}
      {tab === 'saving' && (
        <div className="mt-4">
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>储蓄 · 三笔钱框架</div>
          <List items={BUCKETS} />
          <div className="os-card p-3 mt-3 text-[11px]" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, borderLeft: `3px solid ${C.green}` }}>
            储蓄率比绝对额更早决定安全感：先把「应急金 + 三层保险」这条底线补满，再谈增长。创业者尤其要把应急金当成「能让你在生意低谷期不被迫贱卖、不被迫接受坏条款」的筹码——它买的不是利息，是议价权与睡眠。
          </div>
          <Cap />
        </div>
      )}

      {/* 总览 · 自查 */}
      {tab === 'overview' && (
        <div className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>人生阶段规划时间轴</div>
              <div className="space-y-2">
                {STAGES.map((s) => (
                  <div key={s.age} className="os-card p-3" style={{ borderLeft: `3px solid ${s.color}` }}>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold mono" style={{ color: s.color }}>{s.age}</span>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{s.focus}</span>
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>三笔钱占比随阶段（框架示意 · 非建议）</div>
              <EChart option={areaOpt} style={{ height: 220 }} />
              <div className="text-[11px] mono mt-4 mb-2" style={{ color: 'var(--text-tertiary)' }}>四支柱覆盖自查 · 勾选已落地项</div>
              <div className="os-card p-3">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>覆盖度</span>
                  <span className="text-lg font-bold mono" style={{ color: covColor }}>{coverage}%</span>
                </div>
                <div className="h-1.5 rounded mb-3" style={{ background: 'rgba(148,163,184,0.12)' }}>
                  <div style={{ width: `${coverage}%`, height: '100%', borderRadius: 4, background: covColor, transition: 'width .2s' }} />
                </div>
                <div className="space-y-1.5">
                  {CHECK_ITEMS.map((it, i) => (
                    <button key={i} type="button" onClick={() => toggle(i)} className="flex items-start gap-2 text-left w-full" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <span className="mono text-xs" style={{ color: checks[i] ? C.green : 'var(--text-tertiary)' }}>{checks[i] ? '☑' : '☐'}</span>
                      <span className="text-[11px]" style={{ color: checks[i] ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.5 }}>{it}</span>
                    </button>
                  ))}
                </div>
                <div className="text-[11px] mt-2" style={{ color: covColor, lineHeight: 1.6 }}>
                  {coverage === 100 ? '底线已补齐，可把重心移向增长与长期。' : coverage >= 67 ? '骨架已成，补齐剩余缺口即闭合。' : coverage >= 34 ? '有基础但缺口明显，优先补「应急金 + 三层保险」。' : '底线尚未建立——先把安全垫与保障搭起来，再谈其他。'}
                </div>
              </div>
            </div>
          </div>
          <Cap />
        </div>
      )}
    </Card>
  );
}
