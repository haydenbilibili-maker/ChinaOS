import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import {
  categoryX, valueY, GRID, LABEL, LEGEND, CHART_TOOLTIP, radarOpt, donutOpt,
} from '../shared/chartHelpers.js';
import {
  AS_OF, EVENT_ANCHOR, KEY_STATS, SEVEN_PRESSURES, TREND_COMPARE, FISCAL_2025,
  POP_2025, PRIMACY, AUTO_FACTS, H2_LEDGER, SOURCES, STATUS_META,
} from './data.js';

// ============================================================================
// 吉林&长春政经透视 · IA 见 docs/jilin-changchun-ia.md
// 事件锚点 → 仪表盘 → 七维台账 → 汽车 → 财政土地 → 人口首位度 → 下半年未决 → 出处
// 三层证据：①官方表述 ②可核实统计 ③评论演绎 — 禁止口号堆砌
// ============================================================================

const LAYER_FILTERS = [
  { key: 'all', label: '全部七维', accent: '#22d3ee' },
  { key: 'verified', label: '已核实', accent: '#10b981' },
  { key: 'mixed', label: '部分核实', accent: '#e8a317' },
  { key: 'conflict', label: '与进度冲突', accent: '#c41e3a' },
];

export default function Page() {
  const [layer, setLayer] = useState('all');
  const [activeDim, setActiveDim] = useState(SEVEN_PRESSURES[0].key);

  const filtered = useMemo(
    () => (layer === 'all' ? SEVEN_PRESSURES : SEVEN_PRESSURES.filter((p) => p.status === layer)),
    [layer],
  );

  const active = SEVEN_PRESSURES.find((p) => p.key === activeDim) ?? SEVEN_PRESSURES[0];

  const radarOption = useMemo(
    () => radarOpt(
      SEVEN_PRESSURES.map((p) => ({ name: p.dim, max: 100 })),
      SEVEN_PRESSURES.map((p) => p.pressureScore),
      { name: '结构压力示意', color: '#c41e3a' },
    ),
    [],
  );

  const trendOption = useMemo(() => ({
    grid: { ...GRID, top: 36, left: 48 },
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    legend: { ...LEGEND, top: 0, data: TREND_COMPARE.series.map((s) => s.name) },
    xAxis: categoryX(TREND_COMPARE.categories, { interval: 0, rotate: 18 }),
    yAxis: valueY({ name: '%', axisLabel: { formatter: '{value}' } }),
    series: TREND_COMPARE.series.map((s) => ({
      name: s.name,
      type: 'bar',
      barMaxWidth: 22,
      data: s.data.map((v) => ({
        value: v,
        itemStyle: {
          color: v < 0 ? (s.name.includes('2025') ? '#c41e3a' : '#fb923c') : s.color,
          borderRadius: v < 0 ? [0, 0, 3, 3] : [3, 3, 0, 0],
        },
      })),
      label: {
        show: true,
        position: 'top',
        color: LABEL.color,
        fontSize: 10,
        formatter: (p) => `${p.value > 0 ? '+' : ''}${p.value}`,
      },
    })),
  }), []);

  const fiscalOption = useMemo(() => ({
    grid: { left: 56, right: 24, top: 24, bottom: 28 },
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    xAxis: categoryX(['地方财政收入', '地方财政支出', '政府性基金收入', '土地出让收入']),
    yAxis: valueY({ name: '亿元' }),
    series: [{
      type: 'bar',
      barWidth: 36,
      data: [
        { value: FISCAL_2025.revenue, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
        { value: FISCAL_2025.expenditure, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
        { value: FISCAL_2025.fundRevenue, itemStyle: { color: '#e8a317', borderRadius: [3, 3, 0, 0] } },
        { value: FISCAL_2025.landTransfer, itemStyle: { color: '#fb923c', borderRadius: [3, 3, 0, 0] } },
      ],
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 10, formatter: '{c}' },
    }],
  }), []);

  const popOption = useMemo(() => ({
    grid: { left: 48, right: 16, top: 28, bottom: 28 },
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    legend: { ...LEGEND, top: 0 },
    xAxis: categoryX(['出生', '死亡', '自然变动', '跨市净流入']),
    yAxis: valueY({ name: '万人' }),
    series: [{
      name: '2025 年',
      type: 'bar',
      barWidth: 32,
      data: [
        { value: POP_2025.births, itemStyle: { color: '#10b981', borderRadius: [3, 3, 0, 0] } },
        { value: POP_2025.deaths, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
        { value: POP_2025.naturalChange, itemStyle: { color: '#e8a317', borderRadius: [0, 0, 3, 3] } },
        { value: POP_2025.netInflow, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
      ],
      label: {
        show: true,
        position: 'top',
        color: LABEL.color,
        fontSize: 10,
        formatter: (p) => (p.value > 0 ? `+${p.value}` : `${p.value}`),
      },
    }],
  }), []);

  const primacyOption = useMemo(
    () => donutOpt(
      PRIMACY.cities.map((c) => ({ name: c.name, value: +((c.gdp / PRIMACY.jilinGdp) * 100).toFixed(1), itemStyle: { color: c.color } })),
      { center: ['50%', '46%'], radius: ['40%', '66%'] },
    ),
    [],
  );

  return (
    <div>
      <PageHeader
        badge="区域政经 · 吉林 / 长春"
        title="吉林&长春政经透视"
        subtitle="事件锚点 · 七维台账 · 首位度传导"
      >
        <span className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>asOf {AS_OF}</span>
      </PageHeader>

      <IntroCard>
        2026-07-22，长春市委常委会扩大会议把全市经济形势定性为
        <strong style={{ color: 'var(--china-red)' }}>「前所未有的困难和挑战」</strong>
        。自媒体随之拆解出「七重崩盘」叙事。本模块不做口号复读：把
        <strong style={{ color: 'var(--text-primary)' }}>①官方表述 / ②可核实统计 / ③评论演绎</strong>
        分层对照——年报跌幅不得偷换成进度崩盘，媒体转述不得冒充企业法定披露。
        长春 GDP 约占吉林全省一半以上，属地工业高度绑定一汽：
        <strong style={{ color: 'var(--cyber-cyan)' }}>长春一动，全省读数共振</strong>
        。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>。
      </IntroCard>

      {/* ① 事件锚点 */}
      <Card title="① 事件锚点 · 官方会议与原话" className="mb-6">
        <div
          className="os-card p-4 mb-4"
          style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--china-red)' }}
          role="note"
          aria-label="官方原话"
        >
          <div className="text-[10px] mono uppercase mb-2" style={{ color: 'var(--china-red)' }}>
            {EVENT_ANCHOR.date} · {EVENT_ANCHOR.title}
          </div>
          <p className="text-base leading-relaxed mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif, Georgia, serif)' }}>
            「{EVENT_ANCHOR.quote}」
          </p>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            {EVENT_ANCHOR.quoteContext}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            <span>主持 · {EVENT_ANCHOR.chair}</span>
            <span>{EVENT_ANCHOR.mayorBrief}</span>
            <span>通稿发布 · {EVENT_ANCHOR.published}</span>
          </div>
        </div>
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--cyber-cyan)' }}>下半年部署关键词</div>
            <ul className="space-y-1.5 m-0 p-0 list-none">
              {EVENT_ANCHOR.h2Deploy.map((item) => (
                <li key={item} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', paddingLeft: 10, borderLeft: '2px solid var(--cyber-cyan)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--fire-gold)' }}>通稿来源</div>
            <ul className="space-y-1.5 m-0 p-0 list-none">
              {EVENT_ANCHOR.sources.map((s) => (
                <li key={s.url} className="text-[11px] leading-relaxed">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyber-cyan)' }}>{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Card>

      {/* ② 仪表盘 */}
      <StatGrid className="mb-6">
        {KEY_STATS.map((s) => (
          <Stat key={s.key} value={s.value} label={s.label} sub={s.sub} accent={s.accent} />
        ))}
      </StatGrid>

      <FrameworkTrio
        cards={[
          {
            key: 'salt',
            title: '盐铁逻辑 · 一汽与财政',
            subtitle: '命脉垄断 · 转移支付底盘',
            body: '汽车产业链与一般公共预算构成双命脉：前者决定规上工业脉搏，后者靠上级补助填补收支缺口。土地财政退潮后，盐铁式「命脉」更显刚性。',
            pillars: [
              ['一企敏感', '整车仅一汽一家'],
              ['收支倒挂', '424 亿 vs 1145 亿'],
              ['土出让', '2025 −23.2%'],
            ],
          },
          {
            key: 'stone',
            title: '摸石头 · 证据分层',
            subtitle: '通稿 · 进度 · 评论',
            body: '先锚定官方原话，再核对统计局/财政局数字，最后才对照自媒体演绎。凡混读年报与进度、或无出处的制造业投资跌幅，一律降级为评论口径。',
            pillars: [
              ['①表述', '会议原话'],
              ['②统计', '年报/进度'],
              ['③评论', '七崩叙事'],
            ],
          },
          {
            key: 'path',
            title: '升级路径 · 首位度传导',
            subtitle: '长春 → 吉林全省',
            body: '长春约占全省 GDP 一半以上。属地工业与投资波动会迅速投射到省际读数——这是评论「长春一动全省震动」的可核实内核，无需夸张为七重崩盘。',
            pillars: [
              ['首位度', '~53.5%'],
              ['百日行动', '工业稳生产'],
              ['未决', 'H1 正式快报'],
            ],
          },
        ]}
      />

      {/* ③ 七维台账 */}
      <Card title="③ 七维压力台账 · 官方可核实 vs 评论演绎" className="mb-4">
        <SelectorBar items={LAYER_FILTERS} activeKey={layer} onSelect={setLayer} />
        <p className="text-[11px] mb-4" style={{ color: 'var(--text-tertiary)' }}>
          点击维度展开对照。雷达为结构压力<strong>示意分</strong>（非官方评分），仅作相对比较。
        </p>
        <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="七维选择">
          {filtered.map((p) => {
            const meta = STATUS_META[p.status];
            const on = p.key === activeDim;
            return (
              <button
                key={p.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActiveDim(p.key)}
                className={`os-filter-chip mono ${on ? 'is-active' : ''}`}
                style={{ '--chip-accent': meta.color }}
              >
                {p.dim}
                <span className="ml-1 opacity-70">{meta.label}</span>
              </button>
            );
          })}
        </div>
        <div
          className="os-card p-4 mb-4"
          style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${STATUS_META[active.status].color}` }}
          role="tabpanel"
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{active.dim}</span>
            <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ color: STATUS_META[active.status].color, border: `1px solid ${STATUS_META[active.status].color}` }}>
              {STATUS_META[active.status].label}
            </span>
          </div>
          <Grid cols={2} className="mb-3">
            <div>
              <div className="text-[10px] mono uppercase mb-1" style={{ color: '#fb923c' }}>评论 / 自媒体主张</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{active.commentClaim}</p>
            </div>
            <div>
              <div className="text-[10px] mono uppercase mb-1" style={{ color: '#10b981' }}>可核实统计 / 交叉结论</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{active.verified}</p>
            </div>
          </Grid>
          <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{active.note}</p>
          <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            出处 · {active.sources.join('；')}
          </div>
        </div>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="结构压力雷达（示意分 · 越高压力越大）">
          <EChart option={radarOption} style={{ height: 300 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
            人口自然减少与土地财政退潮得分最高；固投因 2026 进度转正而相对下调——避免把年报一次性跌幅固化为「当前崩盘」。
          </p>
        </Card>
        <Card title="年报 vs 进度 · 工业 / 投资对照">
          <EChart option={trendOption} style={{ height: 300 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
            {TREND_COMPARE.note} 评论常用的「固投 −16.5%」是 2025 全年，不是 2026 H1。
          </p>
        </Card>
      </Grid>

      {/* ④ 汽车 */}
      <Card title="④ 汽车 / 一汽产业链 · 集团叙事 vs 属地约束" className="mb-6">
        <div className="space-y-3">
          {AUTO_FACTS.map((f) => {
            const color = f.layer === 'comment' ? '#fb923c' : f.layer === 'media' ? '#e8a317' : f.layer === 'verified' ? '#10b981' : '#22d3ee';
            const label = f.layer === 'comment' ? '评论' : f.layer === 'media' ? '媒体转述' : f.layer === 'verified' ? '可核实' : '结构';
            return (
              <div key={f.text.slice(0, 24)} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 12 }}>
                <div className="text-[10px] mono mb-1" style={{ color }}>{label}</div>
                <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{f.text}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ⑤ 财政土地 */}
      <Grid cols={2} className="mb-6">
        <Card title="⑤ 财政与土地 · 2025 年报量级（亿元）">
          <EChart option={fiscalOption} style={{ height: 280 }} />
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
            一般公共预算收支比约 1 : 2.7，税收占比约 {FISCAL_2025.taxShare}%。政府性基金收入 {FISCAL_2025.fundRevenue} 亿（{FISCAL_2025.fundRevenueYoY}%），
            其中土地出让 {FISCAL_2025.landTransfer} 亿（{FISCAL_2025.landTransferYoY}%）。缺口主要靠上级补助与债务转贷填补——这是
            <strong style={{ color: 'var(--text-primary)' }}>结构性依赖</strong>，不宜简化为「财政崩盘」瞬间叙事。
          </p>
        </Card>
        <Card title="⑥ 人口自然变动 · 2025（万人）">
          <EChart option={popOption} style={{ height: 280 }} />
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
            出生 {POP_2025.births} 万、死亡 {POP_2025.deaths} 万，自然增长率 {POP_2025.naturalRate}‰。
            跨市净流入 +{POP_2025.netInflow} 万部分对冲自然减少；城镇化率 {POP_2025.urbanRate}%。
            「死亡翻倍于出生」属实，但总人口变动还需看机械增长。
          </p>
        </Card>
      </Grid>

      {/* 首位度 */}
      <Grid cols={2} className="mb-6">
        <Card title="长春首位度 · 2025 年各市州 GDP 份额（%）">
          <EChart option={primacyOption} style={{ height: 300 }} />
        </Card>
        <Card title="传导机制 · 为何全省跟动">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            长春 GDP {PRIMACY.changchunGdp} 亿元，吉林全省 {PRIMACY.jilinGdp} 亿元，份额约
            <strong style={{ color: 'var(--cyber-cyan)' }}> {PRIMACY.share}%</strong>。
            在规上工业与重大项目投资上，省会往往贡献一半以上拉动——故属地汽车链波动、固投起伏与财政压力，会迅速进入省际「稳增长」议程。
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            这与评论结论「长春一动吉林震动」同向，但机制表述应是
            <strong style={{ color: 'var(--text-primary)' }}>高首位度 + 单一支柱敏感</strong>
            ，而非七维同时「崩盘」的情绪叠加。            交叉阅读：
            <Link to="/northeast" style={{ color: 'var(--cyber-cyan)' }}>东北振兴</Link>
            {' · '}
            <Link to="/automotive" style={{ color: 'var(--cyber-cyan)' }}>汽车主权</Link>
            {' · '}
            <Link to="/econ-dashboard" style={{ color: 'var(--cyber-cyan)' }}>经济大盘</Link>
            {' · '}
            <Link to="/debt" style={{ color: 'var(--cyber-cyan)' }}>地方债务</Link>。
          </p>
        </Card>
      </Grid>

      {/* ⑦ 下半年 */}
      <Card title="⑦ 下半年政策应对与未决项" className="mb-6">
        <Grid cols={3}>
          {[
            { key: 'done', title: '已显现 / 可观察', accent: '#10b981', items: H2_LEDGER.done },
            { key: 'ongoing', title: '进行中 · 官方部署', accent: '#22d3ee', items: H2_LEDGER.ongoing },
            { key: 'open', title: '未决 · 待核验', accent: '#e8a317', items: H2_LEDGER.open },
          ].map((col) => (
            <div key={col.key} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${col.accent}` }}>
              <div className="text-xs font-semibold mb-3" style={{ color: col.accent }}>{col.title}</div>
              <ul className="space-y-2 m-0 p-0 list-none">
                {col.items.map((t) => (
                  <li key={t} className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)', paddingLeft: 8, borderLeft: `2px solid ${col.accent}55` }}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Grid>
      </Card>

      {/* 出处 */}
      <Card title="⑧ 出处与核验说明" className="mb-6">
        <ol className="m-0 pl-4 space-y-1.5">
          {SOURCES.map((s) => (
            <li key={s.id} className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{s.id}</span>
              {' · '}
              {s.text}
            </li>
          ))}
        </ol>
        <p className="text-[11px] mt-4 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          核验协议：会议原话与年报/进度数字经 WebSearch 交叉；无法核实项保留〔存疑〕或「评论口径」；
          一汽销量采用媒体转述并降级标注。完整 IA 见 <span className="mono">docs/jilin-changchun-ia.md</span>。
        </p>
      </Card>

      <ModuleFooter
        moduleId="jilinChangchun"
        sourceNote="长春市政府网 / 市统计局 / 市财政局 / 吉林省统计局 · 三层证据台账"
        disclaimer="公开资料整理 · 示意非投资建议 · 评论数字未经核实不得当作事实"
      />
    </div>
  );
}
