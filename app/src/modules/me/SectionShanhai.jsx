import React, { useState, useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { SelectorBar, TimelineBar } from '../shared/ModuleParadigm.jsx';
import { AXIS, LABEL, GRID_LINE, CHART_SERIES_PALETTE } from '../shared/chartHelpers.js';

// ============================================================================
// ㉑ 山海造物 · 副业实体 · 把山海带回家
// ----------------------------------------------------------------------------
// Hayden 在长春的文创/标本/策展零售品牌：从「山川造物」单店验证到「山海造物」
// 品牌化扩张。这是本页 ⑮推演器「AI 超级个体 / 东北落子」、⑨「调度权优先于确定性」、
// ⑪「东北性 · 回迁是逆向下注」三条线在现实里的合流。
// 口径：本人创业项目自述（资料截至 2026-06），财务/估值为内部模型口径、非公开披露、
// 非投资建议；合伙人以角色代称，不披露第三方个人信息。
// ============================================================================

const C = { cinnabar: '#c41e3a', cyan: '#22d3ee', ochre: '#e8a317', green: '#10b981', violet: '#8b5cf6', slate: '#94a3b8' };

const SUBTABS = [
  { key: 'overview', label: '概览', accent: C.cinnabar },
  { key: 'finance', label: '财务模型', accent: C.green },
  { key: 'site', label: '选址谈判', accent: C.ochre },
  { key: 'expand', label: '扩张融资', accent: C.cyan },
  { key: 'digital', label: '数字资产 · AI', accent: C.violet },
  { key: 'gov', label: '治理 · 克制', accent: C.slate },
];

const EVOLUTION = [
  { period: '2025.10', title: '山川造物成立', accent: C.slate, desc: '三方合作经营，总投资 30 万（含 10 万装修），落位长春「这有山」春天海洋商场，注册公司取得执照。' },
  { period: '2025.11.20', title: '首店开业', accent: C.green, desc: '70㎡ 单店开业。首 28 天营收 16.9 万、净利 8.1 万、2016 单、毛利率 48.1%；12 月环比 +47%，单店模型快速验证。' },
  { period: '2026.02–05', title: '稳定运营期', accent: C.cyan, desc: '单店持续盈利，财务备份高频迭代（15 份）；自建两套本地系统：财务管理 + 档案库存。' },
  { period: '2026.04', title: '公司化与融资筹备', accent: C.ochre, desc: '投资说明、加盟说明书、股权架构终版、路演 BP 密集成稿；完成 17 份对标研究（V&A / 泡泡玛特 / 中川政七 / Aesop / MUJI 等）。' },
  { period: '2026.05', title: '品牌升级「山海造物」', accent: C.violet, desc: '正式改名，发布品牌 v2.0、Vision 与战略原则、克制守则、不做清单；官网 shanhaizaowu.com v0.4 上线，官网+小程序+ERP monorepo 整合。' },
  { period: '2026.06', title: '旗舰店选址谈判', accent: C.cinnabar, desc: '完成商埠地 vs 水文化园双选址全维分析与三模式财务建模；水文化园 19 号楼物业合作提案 v1 已出，谈判要点就绪。' },
];

// 大店三模式对比
const MODELS = [
  { k: 'A · 纯租金', invest: '120 万+', cash5: '弱（难回本）', payback: '>5 年或亏损', irr: '~16%', reco: false },
  { k: 'B · 租金+超额抽成', invest: '120 万+', cash5: '较弱', payback: '3.6–4.4 年', irr: '~17%', reco: false },
  { k: 'C · 净利分润（推荐）', invest: '80 万', cash5: '强（240–480 万）', payback: '2.1–3.4 年', irr: '~20–56%', reco: true },
];

// 双选址
const SITES = [
  { name: '水文化园 19 号楼（主选）', score: 3.64, area: '1000㎡（经营 600）', rev: '360 万/年', cash: '稳定期年净现金 48 万', note: '老工业改造 + 文艺生态 + 艺术高校客群 · 双地铁', color: C.green },
  { name: '商埠地（备选 / 轻试错）', score: 2.98, area: '500㎡（经营 250）', rev: '180 万/年', cash: '天花板低 · 年净 9 万', note: '业态混杂 · 停车稀缺 · 回报上限低', color: C.slate },
];

const REVENUE_STREAMS = [
  ['门店股权分红', '各门店 40% 股权的利润分红（长期主力）'],
  ['产品供货差价', '统一供应链加价'],
  ['品牌管理费', '门店月营收的 3–5%'],
  ['线上直营', '小程序商城收入'],
  ['B 端 / IP 授权', '造物 IP 系列、马上有等（远期）'],
];

const FUND_RULES = ['投资人进入公司层、不进门店层', '每轮出让 ≤20% 股权', '创始人合计持股 ≥51% 底线', '期权池 20% 不参与融资稀释', '当前不开放加盟（已给 2 年路线图）'];

const SYSTEMS = [
  { name: '数智化中台 · shanchuan-admin', pct: 55, note: '55 组件 + 22 个 AI 虚拟员工 + AI 战略智脑 + 经营助理「马上有」· 多模型故障转移（Gemini/OpenAI/DeepSeek/Ollama）', color: C.violet },
  { name: '官网 shanhaizaowu.com（Astro）', pct: 90, note: '26 页 + 15 组件 · 六观信息架构 · 物业/加盟/投资人三角色入口', color: C.cyan },
  { name: 'ERP 管理端（Vue3 · monorepo）', pct: 85, note: '50+ 模块 · 11 个百炼 AI 助手 · 财务双向云同步', color: C.green },
  { name: '微信小程序', pct: 80, note: '43 页 + 40+ 云函数 · 商城/社区/鉴定/定制/宠物纪念 · 游戏化会员', color: C.ochre },
];

const NO_LIST = [
  ['只签净利分润 C 模式', '甲方/园区承担装修，否则 5 年无法回本——绝不签 A/B 自投重装修'],
  ['保留自有会员闭环', '小程序+会员+积分不让渡；只按净利分润、不按营收抽成（甲方分润 ≤40%）'],
  ['标本/策展 IP 归乙方', '货品、策展 IP 所有权是底线，不接受强夺'],
  ['不做加盟（当前）', '诚实版加盟说明书：先把单店模型与系统打磨好，再谈复制'],
];

function financeBarOption() {
  return {
    grid: { left: 40, right: 16, top: 28, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, data: ['月营收(万)', '月净利(万)'] },
    xAxis: { type: 'category', data: ['2025.11', '2025.12'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
    series: [
      { name: '月营收(万)', type: 'bar', barWidth: 22, data: [6.83, 10.07], itemStyle: { color: C.cyan } },
      { name: '月净利(万)', type: 'bar', barWidth: 22, data: [3.2, 4.1], itemStyle: { color: C.green } },
    ],
  };
}

function siteRadarOption() {
  return {
    tooltip: {},
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, data: SITES.map((s) => s.name) },
    radar: {
      indicator: [
        { name: '决策得分', max: 4 }, { name: '年营收(百万)', max: 4 }, { name: '年净现金(十万)', max: 5 },
        { name: '调性匹配', max: 100 }, { name: '交通', max: 100 },
      ],
      axisName: { color: LABEL.color, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: GRID_LINE.lineStyle.color } }, splitArea: { show: false },
    },
    series: [{
      type: 'radar', data: [
        { name: SITES[0].name, value: [3.64, 3.6, 4.8, 90, 88], lineStyle: { color: C.green }, itemStyle: { color: C.green }, areaStyle: { color: C.green, opacity: 0.12 } },
        { name: SITES[1].name, value: [2.98, 1.8, 0.9, 50, 35], lineStyle: { color: C.slate }, itemStyle: { color: C.slate }, areaStyle: { color: C.slate, opacity: 0.1 } },
      ],
    }],
  };
}

export default function SectionShanhai() {
  const [tab, setTab] = useState('overview');
  const [evo, setEvo] = useState(EVOLUTION.length - 1);
  const finOpt = useMemo(financeBarOption, []);
  const siteOpt = useMemo(siteRadarOption, []);

  const Cap = ({ children }) => <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>{children}</p>;
  const tail = '本人创业项目自述（资料截至 2026-06）· 财务/估值为内部模型口径、非公开披露、非投资建议 · 合伙人以角色代称';

  return (
    <Card title="㉑ 山海造物 · 副业实体 · 把山海带回家">
      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        长春的文创 / 标本 / 策展零售品牌——从「山川造物」单店验证到「山海造物」品牌化扩张。
        这正是本页 ⑮ 推演器「AI 超级个体 / 东北落子」、⑨「调度权优先于确定性」、⑪「回迁是逆向下注」三条线在现实里的合流：
        一个人用自建的 AI 中台，把一家 70㎡ 的店跑成了可复制的品牌系统。
      </p>

      <SelectorBar items={SUBTABS} activeKey={tab} onSelect={setTab} />

      {/* 概览 */}
      {tab === 'overview' && (
        <div className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {[['30 万', '首店总投资', C.slate], ['16.9 万', '首 28 天营收', C.cyan], ['8.1 万', '首 28 天净利', C.green], ['48.1%', '毛利率', C.ochre]].map(([v, l, c]) => (
              <div key={l} className="os-card p-3" style={{ borderLeft: `3px solid ${c}` }}>
                <div className="text-lg font-bold" style={{ color: c }}>{v}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>演进线 · 山川造物 → 山海造物</div>
          <TimelineBar stages={EVOLUTION} activeIdx={evo} onSelect={setEvo} />
          <Cap>定位：把山海带回家——自然标本 + 造物 IP（马上有 / 小黄）+ 策展零售 + 鉴定 / 定制 / 宠物纪念。年化模型口径约 232 万营收、93 万净利、净利率 ~40%。{tail}</Cap>
        </div>
      )}

      {/* 财务模型 */}
      {tab === 'finance' && (
        <div className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>单店实测 · 这有山 70㎡（首两月，+47%）</div>
              <EChart option={finOpt} style={{ height: 220 }} />
            </div>
            <div>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>大店三模式 · 5 年模型对比</div>
              <div className="space-y-1.5">
                {MODELS.map((m) => (
                  <div key={m.k} className="os-card p-3" style={{ borderLeft: `3px solid ${m.reco ? C.green : C.slate}` }}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-semibold" style={{ color: m.reco ? C.green : 'var(--text-primary)' }}>{m.k}</span>
                      <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>IRR {m.irr}</span>
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>期初投资 {m.invest} · 回款 {m.payback} · 5 年现金流 {m.cash5}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="os-card p-3 mt-3" style={{ borderLeft: `3px solid ${C.cinnabar}` }}>
            <span className="text-xs" style={{ color: C.cinnabar }}>铁底线：</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}> 无论哪个选址，只有「甲方/园区承担装修 + 净利分润 C 模式」才成立。自投重装修走 A/B 模式，5 年无法回本——绝不签约。</span>
          </div>
          <Cap>{tail}</Cap>
        </div>
      )}

      {/* 选址谈判 */}
      {tab === 'site' && (
        <div className="mt-4">
          <EChart option={siteOpt} style={{ height: 300 }} />
          <div className="grid md:grid-cols-2 gap-2 mt-3">
            {SITES.map((s) => (
              <div key={s.name} className="os-card p-3" style={{ borderLeft: `3px solid ${s.color}` }}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  <span className="text-sm font-bold mono" style={{ color: s.color }}>{s.score}</span>
                </div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.area} · {s.rev} · {s.cash}<br /><span style={{ color: 'var(--text-tertiary)' }}>{s.note}</span></div>
              </div>
            ))}
          </div>
          <Cap>谈判杠杆：用这有山店实测盈利数据证明「已验证盈利品牌」身份——山海不是求租商家，而是为园区填闲置、提调性、持续产生内容的主力店。{tail}</Cap>
        </div>
      )}

      {/* 扩张融资 */}
      {tab === 'expand' && (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>双层架构 · 五条收入流</div>
            <div className="os-card p-3 mb-2 text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <b style={{ color: 'var(--text-primary)' }}>上层</b> 品牌平台公司（品牌/供应链/数字化）→ 投资门店实体取 40% 股权 + 管理费；<b style={{ color: 'var(--text-primary)' }}>下层</b> 各门店投资实体（合营/加盟）。
            </div>
            <div className="space-y-1.5">
              {REVENUE_STREAMS.map(([n, d], i) => (
                <div key={n} className="flex items-baseline gap-2 text-xs">
                  <span className="mono" style={{ color: C.cyan }}>{i + 1}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{n}</span>
                  <span style={{ color: 'var(--text-tertiary)' }}>· {d}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>融资原则（已定）· 股权 30 / 30 / 40 双阶段分润</div>
            <div className="space-y-1.5">
              {FUND_RULES.map((r) => (
                <div key={r} className="os-card p-2.5 text-xs" style={{ color: 'var(--text-secondary)', borderLeft: `3px solid ${C.cyan}` }}>{r}</div>
              ))}
            </div>
          </div>
          <Cap>合伙结构：经营股东 + 两名联创，回本前 40/40/20 → 回本后 30/30/40（累计净利 30 万为切换点）。{tail}</Cap>
        </div>
      )}

      {/* 数字资产 · AI */}
      {tab === 'digital' && (
        <div className="mt-4">
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            全部系统由 CEO 独立开发，「AI 驱动超级个体」是核心竞争力——这正是本页 ⑮ 推演器「用 AI 把一个人放大成一支团队」的现实样本。后端统一腾讯云 CloudBase，官网部署 Cloudflare Pages。
          </p>
          <div className="space-y-2">
            {SYSTEMS.map((s) => (
              <div key={s.name} className="os-card p-3">
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  <span className="text-[11px] mono" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded mb-1.5" style={{ background: 'rgba(148,163,184,0.12)' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', borderRadius: 4, background: s.color }} />
                </div>
                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{s.note}</div>
              </div>
            ))}
          </div>
          <Cap>三期规划：AI 从咨询工具 → 业务决策引擎。22 个 AI 虚拟员工 + AI 战略智脑 + 经营助理「马上有」，多模型故障转移保业务连续性。{tail}</Cap>
        </div>
      )}

      {/* 治理 · 克制 */}
      {tab === 'gov' && (
        <div className="mt-4">
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>不做清单 · 克制守则（节选）</div>
          <div className="grid md:grid-cols-2 gap-2">
            {NO_LIST.map(([t, d]) => (
              <div key={t} className="os-card p-3" style={{ borderLeft: `3px solid ${C.cinnabar}` }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>✕ {t}</div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
          <div className="os-card p-3 mt-3 text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, borderLeft: `3px solid ${C.violet}` }}>
            治理基石：Vision 与战略原则、克制守则、自我感动检查 SOP、文档体系治理总览——把「不做什么」写进制度，比「要做什么」更早定稿。这是大厂十年攒下的方法论，第一次完整地用在自己的进程上。
          </div>
          <Cap>{tail}</Cap>
        </div>
      )}
    </Card>
  );
}
