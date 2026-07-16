import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  STATE_CHAIN,
  STATE_LEDGERS,
  STATE_XLINKS,
  GOV_CHAIN,
  GOV_LEDGERS,
  GOV_XLINKS,
  SWORD_NODES,
  getCard,
} from './santiCanon.js';
import SwordChart from './SwordChart.jsx';
import { StChartCard, StChartGrid, ChainStepper, DualMirror } from './StViz.jsx';
import {
  buildStateFlowOption,
  buildDeterrenceFieldOption,
  buildThemeLedgerBarOption,
  buildMobilizationCostOption,
  buildDimRadarOption,
} from './stCharts.js';
import { CANON } from './santiCanon.js';

function CausalChain({ nodes, activeId, onSelect, onJumpSpectrum, sensitiveNote }) {
  const active = useMemo(() => getCard(activeId), [activeId]);
  const activeMeta = nodes.find((n) => n.id === activeId);

  return (
    <div className="st-chain">
      <ChainStepper nodes={nodes} activeId={activeId} onSelect={onSelect} />
      <div className="st-chain__rail" role="list" aria-label="编排节点">
        {nodes.map((node, i) => {
          const card = getCard(node.id);
          const isOn = activeId === node.id;
          return (
            <React.Fragment key={node.id}>
              <button
                type="button"
                role="listitem"
                className={`st-chain__node st-reveal${isOn ? ' is-active' : ''}${node.sensitive ? ' st-chain__node--sensitive' : ''}`}
                style={{ '--st-i': i }}
                aria-pressed={isOn}
                aria-label={`${node.id} ${card?.title || ''}`}
                onClick={() => onSelect(node.id)}
              >
                {node.sensitive && <span className="st-badge-sensitive mono">受控</span>}
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
            {activeMeta?.sensitive && <span className="st-badge-sensitive mono">受控深描</span>}
          </div>
          <p className="st-chain__oneliner">{active.oneLiner}</p>
          {active.costNote && (
            <p className="st-cost-note" role="note">
              <strong>动员成本栏</strong> · {active.costNote}
            </p>
          )}
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
          点击节点或使用步进播放，展开「相似机制 / 关键差异」双栏。
          {sensitiveNote ? ` ${sensitiveNote}` : ''}
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
          {L.costNote && (
            <p className="st-cost-note" role="note">
              <strong>成本栏</strong> · {L.costNote}
            </p>
          )}
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

/**
 * Round 3 · 国家竞争 + 社会治理（合并 Tab · 二分区）
 */
export default function StateGovPanel({ onJumpSpectrum }) {
  const [stateId, setStateId] = useState('ST-04');
  const [govId, setGovId] = useState('ST-09');
  const [zone, setZone] = useState('state'); // state | gov

  const jump = useCallback(
    (ids) => {
      if (ids?.length) onJumpSpectrum(ids, ids[0]);
    },
    [onJumpSpectrum],
  );

  const onSwordNode = useCallback(
    (nodeId) => {
      const node = SWORD_NODES.find((n) => n.id === nodeId);
      if (node?.cards?.length) jump(node.cards);
    },
    [jump],
  );

  const nCards = useMemo(() => CANON.filter((c) => c.dims?.includes('N')), []);
  const gCards = useMemo(() => CANON.filter((c) => c.dims?.includes('G')), []);

  const stateFlow = useMemo(() => buildStateFlowOption(), []);
  const deterField = useMemo(() => buildDeterrenceFieldOption(), []);
  const stateLedgerBar = useMemo(() => buildThemeLedgerBarOption(STATE_LEDGERS), []);
  const govLedgerBar = useMemo(() => buildThemeLedgerBarOption(GOV_LEDGERS), []);
  const mobil = useMemo(() => buildMobilizationCostOption(), []);
  const nRadar = useMemo(() => buildDimRadarOption(nCards), [nCards]);
  const gRadar = useMemo(() => buildDimRadarOption(gCards), [gCards]);

  return (
    <div className="st-state-gov">
      <div className="st-zone-tabs" role="tablist" aria-label="国家与治理分区">
        <button
          type="button"
          role="tab"
          aria-selected={zone === 'state'}
          className={`st-zone-tab${zone === 'state' ? ' is-active' : ''}`}
          onClick={() => setZone('state')}
        >
          国家竞争 · N
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={zone === 'gov'}
          className={`st-zone-tab${zone === 'gov' ? ' is-active' : ''}`}
          onClick={() => setZone('gov')}
        >
          社会治理 · G
        </button>
      </div>

      {zone === 'state' && (
        <div className="st-zone st-zone--state" role="tabpanel">
          <section className="st-sec" aria-labelledby="st-sword-h">
            <div className="st-sec-head">
              <h2 id="st-sword-h">图 C · 威慑执剑剖面</h2>
              <span className="st-sec-tag mono">可信承诺链 · 联动光谱</span>
            </div>
            <p className="st-lede">
              抽象节点刻画相互摧毁能力下的授权与执行层——非人物立绘。点选跳转光谱高亮关联卡。
            </p>
            <SwordChart onSelectNode={onSwordNode} />
          </section>

          <section className="st-sec" aria-labelledby="st-state-viz-h">
            <div className="st-sec-head">
              <h2 id="st-state-viz-h">国家层可视化</h2>
              <span className="st-sec-tag mono">桑基 · 力场 · 台账分布</span>
            </div>
            <StChartGrid>
              <StChartCard title="锁死 → 面壁 → 执剑 → 水滴" tag="国家竞争流" option={stateFlow} height={300} />
              <StChartCard title="威慑力场对照" tag="小说执剑 vs 制度链" illustrative option={deterField} height={300} />
              <StChartCard title="国家层台账状态" tag="NL 分布" option={stateLedgerBar} height={240} variant="compact" />
              <StChartCard title="N 维概念覆盖" tag="雷达" option={nRadar} height={280} />
            </StChartGrid>
          </section>

          <section className="st-sec" aria-labelledby="st-state-chain-h">
            <div className="st-sec-head">
              <h2 id="st-state-chain-h">国家竞争编排</h2>
              <span className="st-sec-tag mono">ST-04 · 05 · 06 · 07</span>
            </div>
            <p className="st-lede">
              智子锁死、面壁/破壁、执剑人、水滴串联为国家层映射主链；每节点强制双栏。
            </p>
            <CausalChain
              nodes={STATE_CHAIN}
              activeId={stateId}
              onSelect={setStateId}
              onJumpSpectrum={jump}
            />
          </section>

          <section className="st-sec" aria-labelledby="st-state-ledger-h">
            <div className="st-sec-head">
              <h2 id="st-state-ledger-h">国家层台账</h2>
              <span className="st-sec-tag mono">NL-01～04 · 强制双栏</span>
            </div>
            <LedgerBlock ledgers={STATE_LEDGERS} onJumpSpectrum={jump} />
          </section>

          <section className="st-sec" aria-labelledby="st-state-x-h">
            <div className="st-sec-head">
              <h2 id="st-state-x-h">深链划界</h2>
              <span className="st-sec-tag mono">deterrence · straits · military</span>
            </div>
            <XLinkRow links={STATE_XLINKS} />
          </section>
        </div>
      )}

      {zone === 'gov' && (
        <div className="st-zone st-zone--gov" role="tabpanel">
          <section className="st-sec" aria-labelledby="st-gov-viz-h">
            <div className="st-sec-head">
              <h2 id="st-gov-viz-h">治理层可视化</h2>
              <span className="st-sec-tag mono">动员成本 · 台账 · 雷达</span>
            </div>
            <StChartGrid>
              <StChartCard
                title="集体动员：执行力 vs 信任损耗"
                tag="ST-23 受控"
                illustrative
                option={mobil}
                height={300}
              />
              <StChartCard title="治理台账状态" tag="GL 分布" option={govLedgerBar} height={240} variant="compact" />
              <StChartCard title="G 维概念覆盖" tag="雷达" option={gRadar} height={280} />
            </StChartGrid>
          </section>

          <section className="st-sec" aria-labelledby="st-gov-chain-h">
            <div className="st-sec-head">
              <h2 id="st-gov-chain-h">社会治理编排</h2>
              <span className="st-sec-tag mono">ST-09 · 30 · 20 · 22 · 23</span>
            </div>
            <p className="st-lede">
              思想钢印、儿童政权、太阳危机与行星工程动员母题，收束于绝对主义动员（ST-23 受控深描，强制成本栏）。
            </p>
            <CausalChain
              nodes={GOV_CHAIN}
              activeId={govId}
              onSelect={setGovId}
              onJumpSpectrum={jump}
              sensitiveNote="ST-23 仅机制对照，禁止口号化与煽情。"
            />
          </section>

          <section className="st-sec" aria-labelledby="st-gov-ledger-h">
            <div className="st-sec-head">
              <h2 id="st-gov-ledger-h">治理台账</h2>
              <span className="st-sec-tag mono">GL-01～03 · 含成本栏</span>
            </div>
            <LedgerBlock ledgers={GOV_LEDGERS} onJumpSpectrum={jump} />
          </section>

          <section className="st-sec" aria-labelledby="st-gov-x-h">
            <div className="st-sec-head">
              <h2 id="st-gov-x-h">深链划界</h2>
              <span className="st-sec-tag mono">powerlogic · demographic · sandbox</span>
            </div>
            <XLinkRow links={GOV_XLINKS} />
          </section>
        </div>
      )}
    </div>
  );
}
