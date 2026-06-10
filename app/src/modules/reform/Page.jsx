import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ─── 阶段定义 · 1978 至今的「现实主义算法演进」五段 ───
const PHASES = [
  {
    id: 0, label: '① 放权让利', range: '1978–1984', color: '#c41e3a',
    theme: '解冻系统 · 农村包产到户 · 特区试点',
    gdpRange: '0.36 → 0.73 万亿元', openness: '外贸依存度 ~10% · 外资几乎为零',
    events: ['1978 十一届三中全会 · 工作重心转向经济建设', '1978 小岗村「大包干」按下红手印', '1980 深圳/珠海/汕头/厦门 四大特区设立', '1984 十四个沿海开放城市'],
    institution: '家庭联产承包责任制确立两权分离；特区作为「主权项下外部接口」做物理隔离的灰度测试。',
    realist: '系统濒临生存阈值，最高优先级从「纯洁度」切到「生产力」。包产到户本质是把激励权下放到最小生产单元——压力倒逼下的第一次试错。无为而治：松绑即增长。',
  },
  {
    id: 1, label: '② 城市闯关', range: '1984–1992', color: '#e8a317',
    theme: '城市改革 · 双轨制 · 价格闯关',
    gdpRange: '0.73 → 2.7 万亿元', openness: '外贸依存度 ~25% · 外资起步',
    events: ['1984 城市经济体制改革启动 · 国企扩权', '1988 价格闯关受挫 · 抢购与通胀', '1989–1991 治理整顿期', '1990 上交所/深交所开业'],
    institution: '双轨制（计划价+市场价并行）作为新旧系统共存的软着陆缓冲层；价格闯关失败暴露了激进路径的系统性摩擦。',
    realist: '一次过快迭代触发系统震荡——价格闯关是试错代价的标价。均值回归：体制随即回收速度、换取稳定。证明渐进主义并非保守，而是对超大规模系统熵增的清醒定价。',
  },
  {
    id: 2, label: '③ 市场经济', range: '1992–2001', color: '#22d3ee',
    theme: '社会主义市场经济 · 南方谈话 · 抓大放小',
    gdpRange: '2.7 → 11 万亿元', openness: '外贸依存度 ~38% · 外资规模化涌入',
    events: ['1992 邓小平南方谈话 · 「胆子要大一些」', '1993 分税制改革 · 中央财权上收', '1994 汇率并轨 · 国企抓大放小', '1997 十五大确立基本经济制度'],
    institution: '正式确立「社会主义市场经济」目标模式；分税制重构央地财政契约；国企从普遍存量改革转向「抓大放小」结构性出清。',
    realist: '南方谈话是对 1989 后停滞的强制重启——意识形态争论让位于绩效证据。分税制是一次集中算力的再分配：地方竞争（分布式算力）与中央汲取（财政主权）的再平衡。',
  },
  {
    id: 3, label: '④ 入世红利', range: '2001–2012', color: '#10b981',
    theme: '入世 · 全球化红利 · 世界工厂',
    gdpRange: '11 → 54 万亿元', openness: '外贸依存度峰值 ~64% · 外资引力陷阱成型',
    events: ['2001 加入 WTO · 嵌入全球分工', '2008 北京奥运 · 四万亿刺激', '2010 GDP 超日本 · 全球第二', '2010 制造业产值居世界第一'],
    institution: '以制度对接 WTO 规则换取市场准入；庞大劳动力与全球资本、技术对撞，构建无法逃逸的「世界工厂」重力场。',
    realist: '资源汲取的巅峰——主权规模扩张。在全球分工中占据不可替代节点，把贸易流量变成动员工具（你中有我）。市场换技术，数十年压缩西方两百年工业化积累。红利越大，路径依赖越深。',
  },
  {
    id: 4, label: '⑤ 全面深改', range: '2012–今', color: '#8b5cf6',
    theme: '全面深改 · 供给侧 · 新发展格局 · 统筹发展与安全',
    gdpRange: '54 → 134 万亿元', openness: '外贸依存度回落 ~33% · 转向制度型开放',
    events: ['2013 十八届三中全会 · 全面深化改革', '2015 供给侧结构性改革 · 三去一降一补', '2020 「双循环」新发展格局', '2021 共同富裕 · 统筹发展与安全'],
    institution: '从要素驱动转向创新驱动（新质生产力）；从「全方位开放」转向「受控开放」——确保供应链主权前提下的更高水平制度型开放。',
    realist: '增速进入 L 型换挡期，绩效合法性红利递减。体制注入「公平」与「安全」两个新变量做二次校准——用共同富裕与安全冗余在低增速环境维持契约有效性。改革从扩张转向收拢熵值。',
  },
];

// 阶段年份与 GDP 锚点（用于趋势图高亮）
const TREND_YEARS = ['1978', '1984', '1992', '2001', '2012', '2024'];
const TREND_GDP = [0.36, 0.73, 2.7, 11, 54, 134];
// 每个阶段覆盖的年份索引区间
const PHASE_SPAN = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]];

function gdpTrendOpt(activeId) {
  const span = PHASE_SPAN[activeId];
  return {
    grid: { left: 48, right: 16, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: TREND_YEARS, axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
    yAxis: { type: 'log', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: TREND_GDP.map((v, i) => ({
        value: v,
        itemStyle: { color: (i >= span[0] && i <= span[1]) ? '#22d3ee' : '#c41e3a', borderWidth: (i >= span[0] && i <= span[1]) ? 2 : 0, borderColor: '#fff' },
        symbolSize: (i >= span[0] && i <= span[1]) ? 9 : 5,
      })),
      lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.1)' },
      markArea: { silent: true, itemStyle: { color: 'rgba(34,211,238,0.08)' }, data: [[{ xAxis: TREND_YEARS[span[0]] }, { xAxis: TREND_YEARS[span[1]] }]] },
    }],
  };
}

const industryTrend = {
  legend: { data: ['第一产业', '第二产业', '第三产业'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 40, right: 16, top: 30, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['1978', '1990', '2005', '2015', '2024'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '第一产业', type: 'line', stack: 't', areaStyle: { color: 'rgba(16,185,129,0.3)' }, data: [28, 27, 12, 9, 7], lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' } },
    { name: '第二产业', type: 'line', stack: 't', areaStyle: { color: 'rgba(196,30,58,0.3)' }, data: [48, 41, 47, 41, 38], lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' } },
    { name: '第三产业', type: 'line', stack: 't', areaStyle: { color: 'rgba(34,211,238,0.3)' }, data: [24, 32, 41, 50, 55], lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' } },
  ],
};

// 开放度多维趋势：外贸依存度 / 实际利用外资 / 出口全球占比
const opennessTrend = {
  legend: { data: ['外贸依存度 %', '实际利用外资(十亿$)', '出口全球占比 %'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 44, right: 44, top: 30, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['1980', '1992', '2001', '2008', '2015', '2024'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: [
    { type: 'value', axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    { type: 'value', axisLabel: { color: '#93a1b5' }, splitLine: { show: false } },
  ],
  series: [
    { name: '外贸依存度 %', type: 'line', smooth: true, data: [13, 35, 38, 57, 36, 33], lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
    { name: '实际利用外资(十亿$)', type: 'bar', yAxisIndex: 1, data: [1, 11, 47, 92, 126, 163], itemStyle: { color: 'rgba(232,163,23,0.7)' } },
    { name: '出口全球占比 %', type: 'line', smooth: true, data: [1, 2.3, 4.3, 8.9, 13.8, 14.5], lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' } },
  ],
};

const compRadar = {
  radar: { indicator: [{ name: '市场化', max: 100 }, { name: '制度型开放', max: 100 }, { name: '产业链', max: 100 }, { name: '科技自立', max: 100 }, { name: '社会公平', max: 100 }, { name: '安全冗余', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [82, 75, 95, 78, 65, 88], name: '中国式现代化', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};

const TAB_ACTIVE = { background: 'rgba(196,30,58,0.2)', color: '#fff' };
const TAB_IDLE = { background: 'var(--bg-elevated)', color: 'var(--text-secondary)' };

export default function Page() {
  const [active, setActive] = useState(4);
  const p = PHASES[active];

  return (
    <div>
      <PageHeader badge="Reform · Realist Evolution" title="改革开放的现实主义逻辑" subtitle="系统重启 · 灰度测试 · 资源汲取 · 绩效契约 —— 一场彻底的「生存算法切换」" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>1978 年的改革开放是把系统最高优先级从「纯洁度」调整为「生产力」的务实权力交易：通过向社会释放局部经济自由（两权分离），换取系统在剧变时代的整体稳定与绝对领导权。指数级增长是「绩效合法性」最强硬的物理证据。下方时间线把四十余年读作一段<span style={{ color: 'var(--cyber-cyan)' }}>「现实主义算法演进」</span>——压力倒逼、灰度试错、均值回归。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="372 倍" label="名义 GDP 增幅(1978→2024)" accent="#c41e3a" />
        <Stat value="5 阶段" label="算法迭代版本" accent="#8b5cf6" />
        <Stat value="8 亿+" label="累计减贫规模" accent="#10b981" />
        <Stat value="16+" label="标志性制度节点" accent="#22d3ee" />
      </Grid>

      {/* ─── 可点击改革阶段时间线 ─── */}
      <Card title="改革阶段时间线 · 点选切换 → 现实主义解读" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>把 1978 至今切为五个迭代版本。点选任一阶段，下方与 GDP 趋势图同步高亮。</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {PHASES.map((ph) => (
            <button
              key={ph.id}
              onClick={() => setActive(ph.id)}
              className="px-3 py-2 rounded text-xs mono transition-colors"
              style={{
                ...(active === ph.id ? TAB_ACTIVE : TAB_IDLE),
                border: active === ph.id ? `1px solid ${ph.color}` : '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <span style={{ color: active === ph.id ? '#fff' : ph.color, fontWeight: 600 }}>{ph.label}</span>
              <span className="ml-2" style={{ opacity: 0.8 }}>{ph.range}</span>
            </button>
          ))}
        </div>

        {/* 时间轴进度条 */}
        <div className="flex items-center mb-5" style={{ height: 4, borderRadius: 2, overflow: 'hidden', background: 'var(--bg-base)' }}>
          {PHASES.map((ph) => (
            <div key={ph.id} style={{ flex: 1, height: '100%', background: ph.id <= active ? ph.color : 'var(--bg-elevated)', opacity: ph.id === active ? 1 : 0.5 }} />
          ))}
        </div>

        <Grid cols={2}>
          <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${p.color}` }}>
            <div className="text-[10px] mono mb-1" style={{ color: p.color }}>{p.range}</div>
            <div className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{p.label.replace(/^[①②③④⑤]\s?/, '')}</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{p.theme}</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div style={{ background: 'var(--bg-surface)', borderRadius: 6, padding: '8px 10px' }}>
                <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>GDP 区间</div>
                <div className="text-xs font-semibold" style={{ color: 'var(--fire-gold)' }}>{p.gdpRange}</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', borderRadius: 6, padding: '8px 10px' }}>
                <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>开放度</div>
                <div className="text-xs font-semibold" style={{ color: 'var(--cyber-cyan)' }}>{p.openness}</div>
              </div>
            </div>
            <div className="text-[10px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>标志性事件</div>
            <div className="space-y-1.5">
              {p.events.map((e) => (
                <div key={e} className="text-xs flex" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: p.color, marginRight: 6 }}>▸</span><span>{e}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-[10px] mono mb-2" style={{ color: 'var(--cyber-cyan)' }}>制度变化 · INSTITUTIONAL DELTA</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.institution}</p>
            </div>
            <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${p.color}` }}>
              <div className="text-[10px] mono mb-2" style={{ color: 'var(--china-red)' }}>现实主义解读 · REALIST READING</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>{p.realist}</p>
            </div>
          </div>
        </Grid>
      </Card>

      {/* ─── 图表区 · GDP 趋势随阶段高亮 ─── */}
      <Grid cols={2} className="mb-6">
        <Card title={`GDP 指数增长（万亿元 · 对数轴 · 高亮 ${p.range} · 示意）`}><EChart option={gdpTrendOpt(active)} style={{ height: 240 }} /></Card>
        <Card title="三大产业贡献结构变迁（% · 示意）"><EChart option={industryTrend} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="开放度多维度 · 外贸依存 / 利用外资 / 出口全球占比（示意）" className="mb-6">
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>外贸依存度在 2008 见顶后回落，外资与出口占比仍处高位——开放从「数量扩张」切到「结构升级」，与阶段⑤的「受控开放」同构。</p>
        <EChart option={opennessTrend} style={{ height: 260 }} />
      </Card>

      {/* ─── 「摸着石头过河」方法论框架 ─── */}
      <Card title="方法论框架 · 「摸着石头过河」的工程学" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>超大规模社会直接改底层代码风险极高。该方法论本质是一套对系统熵增清醒定价的工程范式。</p>
        <Grid cols={4}>
          {[['灰度测试', '特区作主权项下外部接口，引入资本主义要素做隔离压力测试，成功后逐步推广。', '点状突破→面状覆盖', '#c41e3a'],
            ['分布式算力', '财政承包/分税制把发展动能下放地方，锦标赛激励驱动生产力爆发。', '地方竞争 = 并行算力', '#e8a317'],
            ['渐进主义', '拒绝休克疗法，双轨制软着陆，新旧系统共存缓慢切换，消解改革摩擦。', '稳定 > 速度', '#22d3ee'],
            ['反馈回环', '微观试错→效果观测→宏观收拢，可吸收外部熵值的自我演化治理软件。', '试错→观测→收拢', '#8b5cf6']].map(([t, d, tag, c]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${c}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: c }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="资源汲取 · 入世后的「引力陷阱」">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>加入 WTO 是利用全球化红利的「主权规模扩张」——把庞大劳动力与全球资本、技术对撞，构建无法逃逸的「世界工厂」重力场，在全球分工中占据不可替代节点。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>贸易作为动员工具</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>经进出口流量把经济嵌合进世界体系，实现「你中有我」。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>逆向工程与技术沉淀</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>市场换技术，数十年完成西方两百年的工业化积累。</p></div>
          </div>
        </Card>
        <Card title="中国式现代化竞争力（示意）"><EChart option={compRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="隐形契约 · 增长与服从的置换" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>四十年核心政治契约：体制提供持续增长与生活改善，社会让渡政治决策参与度。增速进入换挡期（L 型拐点）后，体制正通过「新质生产力」更新契约，用「共同富裕」与「安全冗余」在低增速环境维持有效性。</p>
      </Card>

      <Card title="调研结论 · 算法的终极校准" className="mb-6">
        <Grid cols={3}>
          {[['1 · 从「开放」转向「受控开放」', '从全方位对接世界转向以我为主的全球布局；在确保供应链主权前提下实施更高水平制度型开放。'],
            ['2 · 绩效合法性红利递减', '单纯 GDP 增长已不足以支撑长期共识，体制注入「公平」与「安全」两个新变量二次校准。'],
            ['3 · 永无止境的系统优化', '改革没有终点，是能吸收外部熵值、微观试错、宏观收拢的自我演化治理软件。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研组终评" className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>改革开放是中国权力逻辑中最成功的「版本迭代」——以极致的实用主义，把一个濒临崩溃的系统转化为全球最具规模的复杂协同体。无为而无不为：真正的控制不在于规定每一步，而在于松绑后均值回归到秩序。</p></Card>

      <CrossLinks links={[
        { to: '/private', label: '民营经济 · 算力外包' },
        { to: '/soe', label: '国有经济 · 战略基座' },
        { to: '/civilization', label: '文明 OS · 长周期视角' },
      ]} />

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：国家统计局(NBS)、世界银行(WB)、WTO 等，部分为示意值 · 由 china.html「体制改革」专题迁移</p>
    </div>
  );
}
