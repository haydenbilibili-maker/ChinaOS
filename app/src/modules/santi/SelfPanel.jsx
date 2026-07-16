import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  SELF_CHAIN,
  SELF_LEDGERS,
  SELF_XLINKS,
  MIRROR_MATRIX,
  ETHICS_TREE,
  getCard,
  CANON,
} from './santiCanon.js';
import EthicsTreeChart from './EthicsTreeChart.jsx';
import { StChartCard, StChartGrid, ChainStepper, DualMirror } from './StViz.jsx';
import {
  buildSelfFlowOption,
  buildSteelImprintRadarOption,
  buildLadderEntropyOption,
  buildThemeLedgerBarOption,
  buildDimRadarOption,
  buildMirrorHeatOption,
} from './stCharts.js';

function CausalChain({ nodes, activeId, onSelect, onJumpSpectrum }) {
  const active = useMemo(() => getCard(activeId), [activeId]);
  const activeMeta = nodes.find((n) => n.id === activeId);

  return (
    <div className="st-chain">
      <ChainStepper nodes={nodes} activeId={activeId} onSelect={onSelect} />
      <div className="st-chain__rail" role="list" aria-label="自我探索编排节点">
        {nodes.map((node, i) => {
          const card = getCard(node.id);
          const isOn = activeId === node.id;
          return (
            <React.Fragment key={node.id}>
              <button
                type="button"
                role="listitem"
                className={`st-chain__node st-reveal${isOn ? ' is-active' : ''}`}
                style={{ '--st-i': i }}
                aria-pressed={isOn}
                aria-label={`${node.id} ${card?.title || ''}`}
                onClick={() => onSelect(node.id)}
              >
                <span className="st-chain__id mono">{node.id}</span>
                <strong>{card?.title}</strong>
                <span className="st-chain__hint">{node.abstract}</span>
              </button>
              {i < nodes.length - 1 && (
                <div className="st-chain__edge" aria-hidden="true">
                  <span className="mono">{node.edge || '→'}</span>
                  <span className="st-chain__arrow">→</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {active && (
        <div className="st-chain__detail st-reveal" aria-live="polite">
          <div className="st-chain__detail-head">
            <span className="mono">{active.id}</span>
            <h3>{active.title}</h3>
            {activeMeta?.sensitive && <span className="st-badge-sensitive mono">受控</span>}
          </div>
          <p className="st-chain__oneliner">{active.oneLiner}</p>
          <DualMirror
            similar={active.similarMechanisms}
            diffs={active.criticalDiffs}
            LinkComp={Link}
          />
          <button
            type="button"
            className="st-chain__jump"
            onClick={() => onJumpSpectrum([active.id])}
          >
            在理论光谱中高亮 {active.id} →
          </button>
        </div>
      )}

      {!active && (
        <p className="st-chain__prompt">
          点击节点或步进播放，展开「相似机制 / 关键差异」。禁止鸡汤化：此处谈机制与成本，不谈励志。
        </p>
      )}
    </div>
  );
}

function LedgerBlock({ ledgers, onJumpSpectrum }) {
  return (
    <div className="st-civ-ledgers">
      {ledgers.map((L, i) => (
        <article
          key={L.id}
          className={`st-civ-ledger st-civ-ledger--${L.status} st-reveal`}
          style={{ '--st-i': i }}
        >
          <header className="st-civ-ledger__head">
            <span className="mono">{L.id}</span>
            <span className={`st-civ-ledger__status mono st-civ-ledger__status--${L.status}`}>
              {L.statusLabel}
            </span>
            <h3>{L.title}</h3>
          </header>
          <p className="st-civ-ledger__thesis">{L.thesis}</p>
          <DualMirror
            similar={L.similarMechanisms}
            diffs={L.criticalDiffs}
            LinkComp={Link}
          />
          <div className="st-civ-ledger__links">
            <span className="mono">关联卡</span>
            {L.linkedCards.map((id) => (
              <button
                key={id}
                type="button"
                className="st-pill mono"
                onClick={() => onJumpSpectrum([id])}
              >
                {id}
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function XLinkRow({ links }) {
  return (
    <div className="st-xlinks">
      {links.map((l) => (
        <Link key={l.to} to={l.to} className="st-xlink">
          <span className="st-xlink__label">{l.label}</span>
          <span className="st-xlink__note">{l.note}</span>
        </Link>
      ))}
    </div>
  );
}

const DIM_FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'C', label: 'C 文明' },
  { key: 'N', label: 'N 国家' },
  { key: 'G', label: 'G 治理' },
  { key: 'S', label: 'S 自我' },
];

function MirrorMatrix({ onJumpSpectrum }) {
  const [dimFilter, setDimFilter] = useState('all');
  const [focusId, setFocusId] = useState(null);

  const rows = useMemo(() => {
    if (dimFilter === 'all') return MIRROR_MATRIX;
    return MIRROR_MATRIX.filter((r) => r.dims?.[dimFilter]);
  }, [dimFilter]);

  const heat = useMemo(() => buildMirrorHeatOption(rows), [rows]);
  const focus = useMemo(() => rows.find((r) => r.id === focusId) || rows[0], [rows, focusId]);

  return (
    <div className="st-mirror">
      <div className="st-mirror__filters" role="group" aria-label="映射维筛选">
        {DIM_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`st-pill st-mirror__filter${dimFilter === f.key ? ' is-on' : ''}`}
            aria-pressed={dimFilter === f.key}
            onClick={() => {
              setDimFilter(f.key);
              setFocusId(null);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <StChartGrid>
        <StChartCard
          title="跨柱映射张力热力"
          tag="示意密度"
          illustrative
          option={heat}
          height={Math.max(280, 40 + rows.length * 36)}
        />
      </StChartGrid>

      <div className="st-mirror__table-wrap">
        <table className="st-mirror__table">
          <thead>
            <tr>
              <th scope="col">概念</th>
              {(dimFilter === 'all' ? ['C', 'N', 'G', 'S'] : [dimFilter]).map((d) => (
                <th key={d} scope="col">
                  {d}
                </th>
              ))}
              <th scope="col">关键差异（一句）</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className={`st-reveal${focus?.id === r.id ? ' is-focus' : ''}`}
                style={{ '--st-i': i }}
                onClick={() => setFocusId(r.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFocusId(r.id);
                  }
                }}
                tabIndex={0}
              >
                <td>
                  <strong>{r.concept}</strong>
                  <div className="st-mirror__cards">
                    {r.cardIds.map((id) => (
                      <button
                        key={id}
                        type="button"
                        className="st-pill mono"
                        onClick={(e) => {
                          e.stopPropagation();
                          onJumpSpectrum([id]);
                        }}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </td>
                {(dimFilter === 'all' ? ['C', 'N', 'G', 'S'] : [dimFilter]).map((d) => (
                  <td key={d}>{r.dims[d]}</td>
                ))}
                <td className="st-mirror__diff">{r.criticalDiff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {focus && (
        <aside className="st-mirror__detail st-reveal" aria-live="polite">
          <header>
            <span className="mono">{focus.id}</span>
            <h3>{focus.concept}</h3>
          </header>
          <p>
            <strong>相似机制摘要</strong> · {focus.similar}
          </p>
          <p className="st-mirror__diff-block">
            <strong>关键差异</strong> · {focus.criticalDiff}
          </p>
          <div className="st-dual st-dual--inline">
            <div className="st-dual__col st-dual__similar">
              <h4>四维映射</h4>
              <ul>
                {Object.entries(focus.dims).map(([k, v]) => (
                  <li key={k}>
                    <span className="mono">{k}</span> {v}
                  </li>
                ))}
              </ul>
            </div>
            <div className="st-dual__col st-dual__diff">
              <h4>为何不可平移</h4>
              <ul>
                <li>{focus.criticalDiff}</li>
              </ul>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

/**
 * Round 4 · 自我探索（S）+ Mirror 对照矩阵
 */
export default function SelfPanel({ onJumpSpectrum }) {
  const [zone, setZone] = useState('self'); // self | mirror
  const [selfId, setSelfId] = useState('ST-06');

  const jump = useCallback(
    (ids) => {
      if (ids?.length) onJumpSpectrum(ids, ids[0]);
    },
    [onJumpSpectrum],
  );

  const onEthicsNode = useCallback(
    (nodeId) => {
      const node = ETHICS_TREE.find((n) => n.id === nodeId);
      if (node?.cards?.length) jump(node.cards);
    },
    [jump],
  );

  const sCards = useMemo(() => CANON.filter((c) => c.dims?.includes('S')), []);
  const selfFlow = useMemo(() => buildSelfFlowOption(), []);
  const steelRadar = useMemo(() => buildSteelImprintRadarOption(), []);
  const ladder = useMemo(() => buildLadderEntropyOption(), []);
  const ledgerBar = useMemo(() => buildThemeLedgerBarOption(SELF_LEDGERS), []);
  const sRadar = useMemo(() => buildDimRadarOption(sCards), [sCards]);

  return (
    <div className="st-self">
      <div className="st-zone-tabs" role="tablist" aria-label="自我探索与 Mirror">
        <button
          type="button"
          role="tab"
          aria-selected={zone === 'self'}
          className={`st-zone-tab${zone === 'self' ? ' is-active' : ''}`}
          onClick={() => setZone('self')}
        >
          自我探索 · S
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={zone === 'mirror'}
          className={`st-zone-tab${zone === 'mirror' ? ' is-active' : ''}`}
          onClick={() => setZone('mirror')}
        >
          Mirror 对照
        </button>
      </div>

      {zone === 'self' && (
        <div className="st-zone st-zone--self" role="tabpanel">
          <section className="st-sec" aria-labelledby="st-ethics-h">
            <div className="st-sec-head">
              <h2 id="st-ethics-h">图 D · 执剑伦理决策树</h2>
              <span className="st-sec-tag mono">个体抉择面 · 联动光谱</span>
            </div>
            <p className="st-lede">
              抽象路径刻画相互摧毁局面下「按下 / 克制 / 制度接管」——伦理是制度缺口的残余计算，不是励志鸡汤。
              点选节点跳转光谱高亮关联卡。
            </p>
            <EthicsTreeChart onSelectNode={onEthicsNode} />
          </section>

          <section className="st-sec" aria-labelledby="st-self-viz-h">
            <div className="st-sec-head">
              <h2 id="st-self-viz-h">自我探索可视化</h2>
              <span className="st-sec-tag mono">桑基 · 钢印雷达 · 阶梯熵 · 台账</span>
            </div>
            <StChartGrid>
              <StChartCard title="执剑 → 钢印 → 阶梯 → 关键岗" tag="S 轴流" option={selfFlow} height={300} />
              <StChartCard
                title="思想钢印 · 认知边界"
                tag="ST-09 个体面"
                illustrative
                option={steelRadar}
                height={300}
              />
              <StChartCard
                title="阶梯抉择 · 信息熵与杠杆"
                tag="ST-10"
                illustrative
                option={ladder}
                height={300}
              />
              <StChartCard title="自我台账状态" tag="SL 分布" option={ledgerBar} height={240} variant="compact" />
              <StChartCard title="S 维概念覆盖" tag="雷达" option={sRadar} height={280} />
            </StChartGrid>
          </section>

          <section className="st-sec" aria-labelledby="st-self-chain-h">
            <div className="st-sec-head">
              <h2 id="st-self-chain-h">自我探索编排</h2>
              <span className="st-sec-tag mono">ST-06 · 09 · 10 · 22</span>
            </div>
            <p className="st-lede">
              执剑伦理、思想钢印个体面、阶梯抉择，收束于领航员/关键岗位杠杆（含流浪者—领航员身份张力的机制层）。
              每节点强制双栏；不提供「如何成为更好的人」处方。
            </p>
            <CausalChain
              nodes={SELF_CHAIN}
              activeId={selfId}
              onSelect={setSelfId}
              onJumpSpectrum={jump}
            />
          </section>

          <section className="st-sec" aria-labelledby="st-identity-h">
            <div className="st-sec-head">
              <h2 id="st-identity-h">身份张力 · 流浪者 / 领航员</h2>
              <span className="st-sec-tag mono">ST-20 / ST-22 · 个体层</span>
            </div>
            <p className="st-lede">
              《流浪地球》中「带走家园」与「关键岗位杠杆」在个体层形成身份—责任结构：不是路线站队口号，而是系统耦合下退出成本与可替换性的对照。
            </p>
            <div className="st-identity-dual">
              <article className="st-identity-card st-reveal" style={{ '--st-i': 0 }}>
                <span className="mono">ST-20 侧</span>
                <h3>危机倒逼下的路线分裂</h3>
                <p>
                  生存环境恶化时，个体被卷入「带走 / 抛弃」叙事。相似机制：风险偏好与代际贴现分歧。关键差异：现实危机多为渐进+不确定，非单一末日倒计时。
                </p>
                <button type="button" className="st-chain__jump" onClick={() => jump(['ST-20'])}>
                  光谱高亮 ST-20 →
                </button>
              </article>
              <article className="st-identity-card st-reveal" style={{ '--st-i': 1 }}>
                <span className="mono">ST-22 侧</span>
                <h3>关键岗位的不成比例杠杆</h3>
                <p>
                  超大规模工程使极少数席位对系统存续敏感。相似机制：超级工程关键岗与沙盒压力席位。关键差异：现实有冗余、科层备份与问责——禁止英雄史观。
                </p>
                <button type="button" className="st-chain__jump" onClick={() => jump(['ST-22'])}>
                  光谱高亮 ST-22 →
                </button>
              </article>
            </div>
          </section>

          <section className="st-sec" aria-labelledby="st-self-ledger-h">
            <div className="st-sec-head">
              <h2 id="st-self-ledger-h">自我探索台账</h2>
              <span className="st-sec-tag mono">SL-01～03 · 强制双栏</span>
            </div>
            <LedgerBlock ledgers={SELF_LEDGERS} onJumpSpectrum={jump} />
          </section>

          <section className="st-sec" aria-labelledby="st-self-x-h">
            <div className="st-sec-head">
              <h2 id="st-self-x-h">深链划界</h2>
              <span className="st-sec-tag mono">deterrence · powerlogic · antifragile · sandbox</span>
            </div>
            <XLinkRow links={SELF_XLINKS} />
          </section>
        </div>
      )}

      {zone === 'mirror' && (
        <div className="st-zone st-zone--mirror" role="tabpanel">
          <section className="st-sec" aria-labelledby="st-mirror-h">
            <div className="st-sec-head">
              <h2 id="st-mirror-h">Mirror 对照矩阵</h2>
              <span className="st-sec-tag mono">C / N / G / S · 可筛选</span>
            </div>
            <p className="st-lede">
              同一概念在四维的映射差异并置；筛选维度后热力与表格同步。每行保留「关键差异」——缺栏不得当作合格对照。
              可与史鉴治乱、修昔底德、威慑战略交叉阅读，但不合并动力学模型。
            </p>
            <MirrorMatrix onJumpSpectrum={jump} />
          </section>
        </div>
      )}
    </div>
  );
}
