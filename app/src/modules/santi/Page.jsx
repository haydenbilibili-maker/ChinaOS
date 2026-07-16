import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../app/ui.jsx';
import { IntroCard, ModuleFooter, SelectorBar } from '../shared/ModuleParadigm.jsx';
import { METHOD_STEPS, MODULE_META, DIMS, countFullCards, CANON, QUAD_TO_CARDS } from './santiCanon.js';
import DarkForestChart from './DarkForestChart.jsx';
import SpectrumPanel from './SpectrumPanel.jsx';
import CivPanel from './CivPanel.jsx';
import StateGovPanel from './StateGovPanel.jsx';
import { StChartCard, StChartGrid } from './StViz.jsx';
import {
  buildDimRadarOption,
  buildLedgerDistOption,
  buildTechExplosionOption,
  buildCausalSankeyOption,
} from './stCharts.js';
import './santi.css';

const TABS = [
  { key: 'overview', label: 'ST-00 总论' },
  { key: 'spectrum', label: '理论光谱' },
  { key: 'civ', label: '文明博弈' },
  { key: 'state', label: '国家与治理' },
];

const QUICK_LINKS = [
  { to: '/deterrence', label: '威慑战略', note: '执剑人 ↔ 可信承诺与指挥链（关键差异：人格化 vs 法理链）' },
  { to: '/gametheory', label: '博弈理论', note: '猜疑链 ↔ 囚徒困境——工具箱 ≠ 黑暗森林处方' },
  { to: '/thucydides', label: '修昔底德', note: '安全困境 ↔ 公理前提——权力转移 ≠ 宇宙接触策略' },
  { to: '/straits', label: '台海局势', note: '仅机制层对照，禁止情节套裁' },
  { to: '/military', label: '军事力量', note: '代差/拒止可对照；≠ 同人战术复盘' },
  { to: '/powerlogic', label: '权力逻辑', note: '思想钢印 ↔ 语义与叙事锁定' },
  { to: '/sandbox', label: '治国沙盒', note: '动员杠杆 ↔ 情景压力测试' },
  { to: '/demographic', label: '人口结构', note: '代际交接 ↔ 制度缓冲（禁止年龄歧视表述）' },
];

export default function SantiPage() {
  const [tab, setTab] = useState('overview');
  const [highlightIds, setHighlightIds] = useState([]);
  const [focusId, setFocusId] = useState(null);
  const fullN = countFullCards();

  const jumpToSpectrum = useCallback((ids, focus = null) => {
    setHighlightIds(ids || []);
    setFocusId(focus || (ids && ids[0]) || null);
    setTab('spectrum');
  }, []);

  const onSelectQuadOverview = useCallback(
    (quadId) => {
      const ids = QUAD_TO_CARDS[quadId] || [];
      if (ids.length) jumpToSpectrum(ids, ids[0]);
    },
    [jumpToSpectrum],
  );

  const onHighlightConsumed = useCallback(() => {
    setFocusId(null);
  }, []);

  const radar = useMemo(() => buildDimRadarOption(CANON), []);
  const ledgerPie = useMemo(() => buildLedgerDistOption(CANON), []);
  const techCurve = useMemo(() => buildTechExplosionOption(), []);
  const sankey = useMemo(() => buildCausalSankeyOption(), []);

  return (
    <div className="st-page">
      <div className="st-starfield" aria-hidden="true" />
      <PageHeader
        badge="ST-00 · 推演与训练"
        title={MODULE_META.title}
        subtitle={MODULE_META.subtitle}
      />

      <IntroCard>
        本模块以刘慈欣作品中的<strong>可抽象机制</strong>为思想实验透镜，映射文明博弈、国家竞争、社会治理与自我探索。
        它不是同人站或剧情百科——每张概念卡强制写出「相似机制」与「关键差异」。
        方法论：<strong>三体透镜·四步映射法</strong>（概念提纯 → 机制抽象 → 现实对照 → 台账判定）。
        当前 Round 3：总论 + 光谱 + 文明博弈 + <strong>国家与治理</strong>；完整双栏卡 {fullN} 张 / 母本 {CANON.length} 条 · v{MODULE_META.version}。
      </IntroCard>

      <SelectorBar
        items={TABS}
        activeKey={tab}
        onSelect={setTab}
        getAccent={() => 'var(--st-signal)'}
      />

      {tab === 'overview' && (
        <div className="st-overview st-tab-panel">
          <section className="st-sec" aria-labelledby="st-ov-viz-h">
            <div className="st-sec-head">
              <h2 id="st-ov-viz-h">总论可视化</h2>
              <span className="st-sec-tag mono">雷达 · 台账 · 因果 · 爆炸曲线</span>
            </div>
            <StChartGrid>
              <StChartCard title="四维映射覆盖" tag="全库雷达" option={radar} height={280} />
              <StChartCard title="台账字段分布" tag="已兑现 / 未决 / 慎用" option={ledgerPie} height={280} />
              <StChartCard title="因果主链流量" tag="桑基" option={sankey} height={280} />
              <StChartCard title="技术爆炸窗口" tag="相对能力" illustrative option={techCurve} height={280} />
            </StChartGrid>
          </section>

          <section className="st-sec" aria-labelledby="st-method-h">
            <div className="st-sec-head">
              <h2 id="st-method-h">三体透镜·四步映射法</h2>
              <span className="st-sec-tag mono">Extract · Abstract · Mirror · Ledger</span>
            </div>
            <p className="st-lede">
              与史鉴「四步法」刻意区分命名：此处是思想实验到现实的<strong>映射</strong>，而非史料动力学切片。
              Mirror 步缺「关键差异」栏即视为不合格内容。
            </p>
            <div className="st-steps">
              {METHOD_STEPS.map((s, i) => (
                <article key={s.key} className="st-step st-reveal" style={{ '--st-i': i }}>
                  <span className="st-step__n mono">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}<small className="mono">{s.en}</small></h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="st-sec" aria-labelledby="st-forest-h">
            <div className="st-sec-head">
              <h2 id="st-forest-h">签名视觉 · 黑暗森林坐标系</h2>
              <span className="st-sec-tag mono">图 A · 猜疑链 × 技术爆炸 · 联动光谱</span>
            </div>
            <p className="st-lede">
              两轴刻画极端思想实验的策略空间；点选象限将跳转理论光谱并高亮对应概念卡。
              亦可进入「文明博弈」「国家与治理」阅读编排与台账。
            </p>
            <DarkForestChart onSelectQuad={onSelectQuadOverview} />
          </section>

          <section className="st-sec" aria-labelledby="st-dims-h">
            <div className="st-sec-head">
              <h2 id="st-dims-h">四维映射轴</h2>
              <span className="st-sec-tag mono">C · N · G · S</span>
            </div>
            <div className="st-dim-grid">
              {DIMS.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  className="st-dim-tile st-reveal"
                  data-dim={d.key}
                  onClick={() => {
                    if (d.key === 'C') setTab('civ');
                    else if (d.key === 'N' || d.key === 'G') setTab('state');
                    else setTab('spectrum');
                  }}
                >
                  <span className="mono">{d.key}</span>
                  <strong>{d.label}</strong>
                  <span className="st-dim-tile__go">
                    {d.key === 'C' && '进入文明博弈 →'}
                    {(d.key === 'N' || d.key === 'G') && '进入国家与治理 →'}
                    {d.key === 'S' && '进入光谱（R4 深描）→'}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="st-sec" aria-labelledby="st-xlink-h">
            <div className="st-sec-head">
              <h2 id="st-xlink-h">ChinaOS 交叉入口</h2>
              <span className="st-sec-tag mono">深链 + 差异一句</span>
            </div>
            <p className="st-lede">
              光谱卡内亦嵌模块深链；此处提供总论级快速入口。映射停在机制层，不臆造政治内幕。
            </p>
            <div className="st-xlinks">
              {QUICK_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="st-xlink">
                  <span className="st-xlink__label">{l.label}</span>
                  <span className="st-xlink__note">{l.note}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="st-sec st-boundary" aria-labelledby="st-bound-h">
            <h2 id="st-bound-h">边界速查</h2>
            <div className="st-bound-grid">
              <div>
                <h3>本模块是</h3>
                <ul>
                  <li>文明 / 治理 / 博弈的机制透镜</li>
                  <li>概念提纯 → 现实对照的台账产品</li>
                  <li>与威慑、博弈、台海等的交叉入口</li>
                </ul>
              </div>
              <div>
                <h3>本模块不是</h3>
                <ul>
                  <li>史鉴 SJ（史料·五力·治乱相位）</li>
                  <li>科幻同人、剧情百科、二创叙事</li>
                  <li>用小说情节「证明」现实结论</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === 'spectrum' && (
        <div className="st-tab-panel">
          <SpectrumPanel
            highlightIds={highlightIds}
            focusId={focusId}
            onHighlightConsumed={onHighlightConsumed}
          />
        </div>
      )}

      {tab === 'civ' && (
        <div className="st-tab-panel">
          <CivPanel onJumpSpectrum={jumpToSpectrum} />
        </div>
      )}

      {tab === 'state' && (
        <div className="st-tab-panel">
          <StateGovPanel onJumpSpectrum={jumpToSpectrum} />
        </div>
      )}

      <ModuleFooter
        moduleId="santi"
        disclaimer="思想实验透镜 · 公开作品机制概括，非文学评论站 · 禁止裸类比与阴谋论臆造 · 示意曲线非预测"
        sourceNote={`v${MODULE_META.version}`}
      />
    </div>
  );
}
