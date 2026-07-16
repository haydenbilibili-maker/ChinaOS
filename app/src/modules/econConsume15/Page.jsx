import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { KEY_INDICATORS } from '../econdash/econData.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// ============================================================================
// 十五五促消费解读 · 《扩大消费「十五五」规划》
// ----------------------------------------------------------------------------
// 口径声明：政策信息取自中国政府网《国务院关于〈扩大消费「十五五」规划〉的批复》
// （国函〔2026〕66 号，成文 2026-07-02，发布 2026-07-13）及国家发展改革委、商务部
// 有关负责人答记者问（新华社 2026-07-13）。前置文件《提振消费专项行动方案》取自
// 中办国办印发文本（新华社受权发布 2025-03-16）。H1 读数取自 KEY_INDICATORS /
// 国家统计局 2026-07-15 上半年国民经济运行情况，不臆造。无法核实处标〔存疑〕。
// 分析为冷峻中立研究框架，非投资建议、非预测。
// ============================================================================

const POLICY_AS_OF = '2026-07-13';
const H1_AS_OF = '2026-07-15';
const SRC_POLICY = '中国政府网 · 国函〔2026〕66 号；发改委/商务部答记者问（新华社 2026-07-13）';
const SRC_ACTION = '中办国办《提振消费专项行动方案》（新华社受权发布 2025-03-16）';
const SRC_H1 = '国家统计局 2026-07-15 上半年国民经济运行情况';

/** 从 KEY_INDICATORS 取数，缺省时不硬编 */
function ki(id) {
  return KEY_INDICATORS.find((k) => k.id === id) || null;
}
const retail = ki('retail');
const fai = ki('fai');
const iva = ki('iva');
const gdp = ki('gdp_h1');

const META = {
  title: '扩大消费「十五五」规划',
  aliasNote: '用户所称「十五五促进消费意见」对应本规划；国务院以国函形式原则同意并印发批复。',
  issuer: '国务院批复 · 发改委、商务部牵头编制',
  docNo: '国函〔2026〕66 号',
  drafted: '2026-07-02',
  published: '2026-07-13',
  prior: '提振消费专项行动方案（中办国办，2025-03-16）',
};

/** 一句话研判 */
const VERDICT =
  '政策要闭合的是「供强需弱」——生产端扩张与社零偏弱、固投拖累并存；规划把扩内需从年度专项升格为十五五消费领域纲领，'
  + '以增收能力 + 服务/商品供给 + 场景与制度长效机制三轨并进，回应 H1 读数里服务强、商品弱的 K 形消费结构。';

/** 目标 · 抓手 · 约束 */
const FRAME = [
  {
    key: 'goal', label: '目标', accent: '#c41e3a',
    title: '扩量提质 · 锚定 2030',
    body: '消费市场总体规模持续扩大：居民消费率明显提高，全社会商品和服务消费较快增长，社会消费品零售总额达到 60 万亿元左右，消费对经济增长的拉动作用进一步增强。（发改委/商务部答记者问）',
    bullets: [
      ['规模', '社零 2030 年约 60 万亿元（2025 年已达 50.1 万亿元）'],
      ['结构', '服务性消费占比稳步提高，数字消费扩容'],
      ['能力', '收入与增长同步，社保更可持续'],
    ],
  },
  {
    key: 'lever', label: '抓手', accent: '#22d3ee',
    title: '六面 28 条 + 九专栏',
    body: '重点任务围绕服务消费提质惠民、商品消费扩容升级、新业态新模式新场景、提升消费能力、优化消费环境、完善制度机制等 6 个方面部署 28 条举措；银发、育儿、文旅、健康、汽车等设 9 个专栏。批复要求「深入实施提振消费专项行动」。',
    bullets: [
      ['服务', '养老 · 托育 · 文旅 · 健康置前'],
      ['商品', '以旧换新与品质升级延续'],
      ['能力', '就业增收与减负并重'],
    ],
  },
  {
    key: 'bind', label: '约束', accent: '#e8a317',
    title: '意愿 · 预期 · 资产负债表',
    body: '规划承认消费领域仍有矛盾制约潜力释放。H1 显示居民收入实际增速略低于 GDP、财产净收入偏弱、地产链条持续拖累——增收与预期修复是硬约束，单靠供给侧场景创新难以闭合供需缺口。',
    bullets: [
      ['收入—消费', '传导仍待观察（H1 收入实际 +4.2%）'],
      ['地产财富', '开发投资 −18.0% 压制耐用品与信心'],
      ['外需替代', '出口高增难长期填补内需'],
    ],
  },
];

/** 六大领域拆解（对齐规划六方面表述） */
const PILLARS = [
  {
    key: 'service', label: '服务消费', accent: '#22d3ee',
    title: '促进服务消费提质惠民',
    thesis: '规划将养老、托育、文旅、健康等服务消费置于突出位置——与 H1「服务零售 +5.3% 明显快于商品 +1.1%」同向：服务已是扩内需的相对亮点，下一步要解决的是高品质供给不足与可及性。',
    moves: [
      '扩大普惠养老服务供给，鼓励社会力量参与',
      '加快普惠托育体系建设、支持托育综合服务中心',
      '文旅、健康体检/咨询/管理等新型服务业态扩容',
    ],
    h1Link: 'H1 服务零售 +5.3%、餐饮 +2.8%——政策顺势加码「体验型」需求。',
  },
  {
    key: 'goods', label: '商品消费', accent: '#c41e3a',
    title: '推动商品消费扩容升级',
    thesis: '商品零售 H1 仅 +1.1%、限上商品 −1.0%，耐用品与中高端偏冷。规划延续大宗更新与品质升级逻辑，与 2025《提振消费专项行动方案》中以旧换新、汽车消费链条相衔接。',
    moves: [
      '商品消费扩容升级（规划六面之一）',
      '汽车消费专栏：延伸产业链、更新换代',
      '与专项行动「大宗消费更新升级」政策库接力',
    ],
    h1Link: 'H1 通讯器材 +14.4% 等结构性亮点难掩商品整体乏力。',
  },
  {
    key: 'scene', label: '场景创新', accent: '#8b5cf6',
    title: '培育新业态新模式新场景',
    thesis: '规划将「培育打造消费新业态新模式新场景」作为贯穿主线：数字消费、首发经济、体验式消费等——意图用供给创新创造有效需求，而非仅补贴存量。',
    moves: [
      '数字消费规模扩大（目标表述）',
      '因地制宜推进首发经济、体验式消费',
      '九专栏落地银发 / 育儿 / 文旅 / 健康 / 汽车等场景',
    ],
    h1Link: '网上商品和服务零售额 H1 +5.2%，线上场景仍是增量通道。',
  },
  {
    key: 'income', label: '收入分配', accent: '#e8a317',
    title: '着力提升消费能力',
    thesis: '消费的底层约束是收入与预期。规划目标写明「居民收入增长和经济增长同步」「居民消费底气更足」。专项行动把「城乡居民增收」置首——能力端优先于场景端，是政策逻辑的关键校正。',
    moves: [
      '高质量充分就业取得新进展（目标表述）',
      '社会保障制度更加优化更可持续',
      '衔接专项行动：工资性 / 财产性收入与农民增收',
    ],
    h1Link: 'H1 居民人均可支配收入实际 +4.2%，财产净收入仅 +1.1%。',
  },
  {
    key: 'env', label: '流通与环境', accent: '#10b981',
    title: '大力优化消费环境',
    thesis: '便利度、标准与信用体系是意愿端的基础设施。规划要求重要产品和服务标准体系、信用体系更加健全，消费基础设施完善——对应专项行动中的环境改善与限制措施清理。',
    moves: [
      '消费便利度、舒适度、满意度大幅提升（目标）',
      '清理优化不合理限制性措施取得积极成效',
      '消费统计与监测评估写入组织实施',
    ],
    h1Link: '环境改善是慢变量，难在季度内扭转社零斜率。',
  },
  {
    key: 'inst', label: '制度机制', accent: '#64748b',
    title: '加力完善促进消费制度机制',
    thesis: '从年度专项到五年规划，本质是把促消费从「脉冲刺激」升格为「长效机制」。批复强调健全制度政策、完善扩大居民消费长效机制，并要求地方把扩消费作为十五五重要任务。',
    moves: [
      '消费政策与其他经济社会政策协同联动',
      '坚持党的领导、抓好落实、加强统计与监测评估',
      '深入实施提振消费专项行动（批复原文要求）',
    ],
    h1Link: '制度落地速度决定能否在供强需弱窗口期闭合缺口。',
  },
];

/** H1 联动读数卡 */
const H1_CARDS = [
  {
    label: '社零总额',
    value: retail ? `${retail.value > 0 ? '+' : ''}${retail.value}%` : '—',
    sub: '248722 亿元 · 需求侧仍偏弱',
    accent: '#22d3ee',
  },
  {
    label: '服务零售',
    value: '+5.3%',
    sub: '明显快于商品零售 +1.1%',
    accent: '#10b981',
  },
  {
    label: '固投 / 地产',
    value: fai ? `${fai.value}%` : '—',
    sub: '地产开发投资 −18.0% 主拖累',
    accent: '#e8a317',
  },
  {
    label: '规上工业',
    value: iva ? `+${iva.value}%` : '—',
    sub: gdp ? `GDP H1 +${gdp.value}% · 供强需弱` : '供强需弱剪刀差',
    accent: '#c41e3a',
  },
];

/** 台账 */
const LEDGER = {
  done: {
    label: '已兑现', accent: '#10b981',
    items: [
      ['纲领文件落地', '国务院原则同意《扩大消费「十五五」规划》并以国函印发批复（2026-07-13 中国政府网公布）。'],
      ['目标数字公开', '2030 年社零约 60 万亿元；2025 年社零已达 50.1 万亿元（答记者问口径）。'],
      ['专项行动在先', '2025-03《提振消费专项行动方案》八方面 30 项已构成操作库，批复要求「深入实施」。'],
      ['服务消费顺势', 'H1 服务零售 +5.3%，与规划「服务消费置前」方向一致。'],
    ],
  },
  ongoing: {
    label: '进行中', accent: '#e8a317',
    items: [
      ['地方落实分工', '各省市要把扩消费作为十五五重要任务，因地制宜探索路径（批复要求）。'],
      ['能力端修复', '增收减负、就业与社保优化——专项行动首要行动，效果取决于就业与财产收入。'],
      ['商品与耐用品', '以旧换新 / 汽车专栏能否抬升商品零售斜率，仍待下半年数据验证。'],
      ['场景与首发经济', '新业态新场景培育为慢变量，与数字消费扩容同步推进。'],
    ],
  },
  doubt: {
    label: '存疑 / 未决', accent: '#c41e3a',
    items: [
      ['规划全文细则', '公开渠道以批复 + 答记者问为主；28 条逐条全文若未同步公开，细节以正式文本为准。〔存疑〕'],
      ['60 万亿路径斜率', '自 50.1 万亿至约 60 万亿需约 5 年复合增速——在 H1 社零仅 +1.3% 下，路径压力大。〔测算示意〕'],
      ['收入—消费闭合', '财产净收入偏弱 + 地产财富效应未修复，能力端能否跟上供给创新仍开放。'],
      ['外需回摆风险', '出口高增含基数与抢出口成分，若外需回摆而内需未起，扩消费压力上升。〔存疑〕'],
    ],
  },
};

const PRIOR_ACTIONS = [
  ['城乡居民增收促进行动', '工资性 / 财产性收入 · 农民增收 · 清欠'],
  ['消费能力保障支持行动', '生育、教育、养老、医疗减负'],
  ['服务消费提质惠民行动', '一老一小 · 文体旅游 · 入境消费'],
  ['大宗消费更新升级行动', '以旧换新 · 住房 · 汽车链条'],
  ['消费品质提升行动', '数字消费 ·「人工智能+消费」'],
  ['消费环境改善提升行动', '市场环境与标准规范'],
  ['限制措施清理优化行动', '隐性壁垒 · 购车等限制'],
  ['完善支持政策', '财政、金融、投资、统计协同'],
];

export default function Page() {
  const [frame, setFrame] = useState('goal');
  const [pillar, setPillar] = useState('service');
  const f = FRAME.find((x) => x.key === frame) || FRAME[0];
  const p = PILLARS.find((x) => x.key === pillar) || PILLARS[0];

  return (
    <div>
      <PageHeader
        badge="Consume · 15th Five-Year Plan"
        title="十五五促消费解读 · 扩大消费规划"
        subtitle={`国函〔2026〕66 号 · 发布 ${POLICY_AS_OF} · 衔接提振消费专项行动 · H1 读数截至 ${H1_AS_OF}`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          <Link to="/econ-dashboard" className="econ-cross-chip" style={chipStyle}>经济大盘 ↗</Link>
          <Link to="/econ-dashboard?tab=consume15" className="econ-cross-chip" style={chipStyle}>大盘 · 促消费 Tab ↗</Link>
          <Link to="/econ-h1-review" className="econ-cross-chip" style={{ ...chipStyle, borderColor: 'rgba(232,163,23,0.45)', color: '#e8a317' }}>半年经济解读 ↗</Link>
          <Link to="/consumption" className="econ-cross-chip" style={chipStyle}>扩大内需 · 消费率 ↗</Link>
        </div>
      </PageHeader>

      {/* 页眉政策元数据 */}
      <Card title="政策元数据 · 与十五五定位" className="mb-6" asSection={false}>
        <Grid cols={4} className="mb-3">
          {[
            ['文件', META.title],
            ['文号', META.docNo],
            ['发文机关', META.issuer],
            ['发布时间', META.published],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-[11px] mono mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{k}</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{v}</div>
            </div>
          ))}
        </Grid>
        <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
          {META.aliasNote}
          成文日期 {META.drafted}；前置操作文件为{META.prior}。
          十五五开局之年，消费从「年度首要任务」升格为专项规划锚点——与科技自立自强并列，构成扩大内需战略基点的五年制度安排。
        </p>
      </Card>

      <IntroCard>
        <strong style={{ color: 'var(--text-primary)' }}>一句话研判：</strong>
        {VERDICT}
        {' '}批复明确「坚持扩大内需这个战略基点」，并把服务消费、商品升级、业态场景、消费能力、消费环境、制度政策连成闭环——政策叙事已从「刺激销量」转向「能力—供给—环境」系统工程。
      </IntroCard>

      <StatGrid className="mb-8">
        <Stat value="≈60 万亿" label="2030 社零目标" accent="#c41e3a" sub="答记者问口径 · 左右" />
        <Stat value="50.1 万亿" label="2025 社零基数" accent="#e8a317" sub="突破 50 万亿大关" />
        <Stat value="6×28" label="重点任务结构" accent="#22d3ee" sub="六方面 · 二十八条" />
        <Stat value="58.8%" label="十四五最终消费贡献率" accent="#10b981" sub="较十三五 +10pct" />
      </StatGrid>

      {/* 目标 · 抓手 · 约束 */}
      <Card title="政策框架 · 目标 / 抓手 / 约束" className="mb-8">
        <SelectorBar items={FRAME} activeKey={frame} onSelect={setFrame} />
        <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${f.accent}` }}>
          <div className="text-sm font-semibold mb-2" style={{ color: f.accent }}>{f.title}</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{f.body}</p>
          <Grid cols={3}>
            {f.bullets.map(([k, v]) => (
              <div key={k} className="os-card p-3" style={{ background: 'var(--bg-surface)' }}>
                <div className="text-[11px] mono mb-1" style={{ color: f.accent }}>{k}</div>
                <p className="text-xs m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{v}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Card>

      {/* 与 H1 / 经济大盘联动 */}
      <Card title={`与经济大盘联动 · H1 读数（数据截至 ${H1_AS_OF}）`} className="mb-8">
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          下列读数取自经济大盘 <span className="mono">KEY_INDICATORS</span> 与半年经济解读同源口径，用于锚定政策回应的现实矛盾——非新编统计。
        </p>
        <Grid cols={4} className="mb-4">
          {H1_CARDS.map((c) => (
            <div key={c.label} className="os-card p-3" style={{ borderLeft: `3px solid ${c.accent}` }}>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{c.label}</div>
              <div className="text-lg font-semibold mono" style={{ color: c.accent }}>{c.value}</div>
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{c.sub}</div>
            </div>
          ))}
        </Grid>
        <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
          官方 H1 定调「国内供强需弱矛盾突出」。规划在十五五开局窗口发布，实质是对这一结构矛盾的中期制度回应：
          短期继续吃「提振消费专项行动」存量政策，中期用五年规划把服务消费、增收能力与长效机制钉死——避免只靠脉冲补贴抬季度社零。
        </p>
      </Card>

      {/* 举措拆解 */}
      <Card title="举措拆解 · 六领域" className="mb-8">
        <SelectorBar items={PILLARS} activeKey={pillar} onSelect={setPillar} />
        <div className="os-card p-4 mb-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${p.accent}` }}>
          <div className="text-sm font-semibold mb-2" style={{ color: p.accent }}>{p.title}</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{p.thesis}</p>
          <ul className="space-y-2 mb-3">
            {p.moves.map((m) => (
              <li key={m} className="text-xs pl-4 relative leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                <span className="absolute left-0" style={{ color: p.accent }}>▸</span>
                {m}
              </li>
            ))}
          </ul>
          <p className="text-xs m-0 mono" style={{ color: 'var(--text-secondary)' }}>联动 · {p.h1Link}</p>
        </div>
      </Card>

      {/* 前置专项行动 */}
      <Card title="前置真源 · 提振消费专项行动方案（2025-03）" className="mb-8">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          规划批复要求「深入实施提振消费专项行动」。该方案由中办、国办印发，按「增收减负提升消费能力、高质量供给创造有效需求、优化消费环境增强消费意愿」三思路，
          部署八方面 30 项重点任务——是十五五规划的操作前传与政策库存。二者关系：专项行动管「立刻能做的增量」，五年规划管「五年长效机制」。
        </p>
        <Grid cols={2}>
          {PRIOR_ACTIONS.map(([t, d]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-surface)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3 m-0" style={{ color: 'var(--text-tertiary)' }}>出处：{SRC_ACTION}</p>
      </Card>

      {/* 风险台账 */}
      <Card title="风险与未决 · 台账（已兑现 / 进行中 / 存疑）" className="mb-8">
        <Grid cols={3}>
          {[LEDGER.done, LEDGER.ongoing, LEDGER.doubt].map((col) => (
            <div key={col.label}>
              <div className="text-sm font-semibold mb-3 mono" style={{ color: col.accent }}>
                <span className="os-badge os-badge--sm mr-1" style={{ background: `${col.accent}22`, color: col.accent }}>●</span>
                {col.label}
              </div>
              <div className="flex flex-col gap-3">
                {col.items.map(([t, d]) => (
                  <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${col.accent}` }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
                    <p className="text-[11px] leading-relaxed m-0" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        {
          title: '能力端：增收减负', subtitle: '意愿的物理约束',
          body: '消费不是场景不够热闹，是资产负债表与收入预期在约束支出函数。专项行动把增收置首，规划把「收入与增长同步」写入目标——这是对「就消费谈消费」的纠偏。',
          pillars: [['工资性', '就业与最低工资机制。'], ['财产性', '股市/社保资金入市堵点。'], ['减负', '一老一小与医保教育。']],
        },
        {
          title: '供给端：服务强于商品', subtitle: 'K 形结构的政策镜像',
          body: 'H1 服务零售显著快于商品；规划将服务消费提质惠民列为六面之首，商品侧则靠更新升级与汽车专栏托底——政策承认结构性分化并顺势加码。',
          pillars: [['服务', '养老托育文旅健康。'], ['商品', '以旧换新与品质。'], ['场景', '数字与首发经济。']],
        },
        {
          title: '制度端：从脉冲到长效', subtitle: '五年规划的真正增量',
          body: '年度补贴可以抬月度读数，难以修复预防性储蓄。规划把统计监测、限制清理、政策协同写入组织实施，意图把扩消费从「运动式」改为「机制式」。',
          pillars: [['协同', '财政货币产业联动。'], ['清理', '不合理限制性措施。'], ['评估', '监测评估写进实施。']],
        },
      ]} />

      <ModuleFooter
        moduleId="econConsume15"
        links={[
          { to: '/econ-dashboard', label: '经济大盘 · 2026 H1', note: 'NBS 快照 + 金丝雀 + 三次产业，与本页读数同源。' },
          { to: '/econ-dashboard?tab=consume15', label: '经济大盘 · 促消费 Tab', note: '规划摘要速览，深链回本页。' },
          { to: '/econ-h1-review', label: '半年经济解读 · 2026 H1', note: '供强需弱与三驾马车拆解，本页政策对象。' },
          { to: '/consumption', label: '扩大内需 · 消费率', note: '消费占 GDP 与预防性储蓄长周期。' },
          { to: '/econ-dashboard?tab=worldbank', label: '世行经济简报 · 2026-07', note: '基线预测与政策叙事交叉验证。' },
        ]}
        sourceNote={`政策：${SRC_POLICY} · 专项行动：${SRC_ACTION} · H1：${SRC_H1} · 政策截至 ${POLICY_AS_OF} · H1 截至 ${H1_AS_OF}`}
        disclaimer={`公开政策梳理 · 冷峻中立分析框架 · 非投资建议 · 非预测 · 基准 ${AS_OF_BASELINE} · 无法核实处已标〔存疑〕`}
      />
    </div>
  );
}

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 11,
  padding: '4px 10px',
  borderRadius: 6,
  border: '1px solid rgba(34,211,238,0.35)',
  color: '#22d3ee',
  textDecoration: 'none',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
};
