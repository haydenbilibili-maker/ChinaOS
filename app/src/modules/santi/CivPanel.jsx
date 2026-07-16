import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CIV_CHAIN,
  CIV_LEDGERS,
  LENS_BOUNDARIES,
  QUAD_TO_CARDS,
  getCard,
} from './santiCanon.js';
import DarkForestChart from './DarkForestChart.jsx';

function DualMirror({ card }) {
  if (!card) return null;
  return (
    <div className="st-dual st-dual--inline">
      <div className="st-dual__col st-dual__similar">
        <h4>相似机制</h4>
        <ul>
          {card.similarMechanisms.map((m) => (
            <li key={m.text}>
              {m.to ? <Link to={m.to}>{m.text}</Link> : m.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="st-dual__col st-dual__diff">
        <h4>关键差异</h4>
        <ul>
          {card.criticalDiffs.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CausalChain({ activeId, onSelect, onJumpSpectrum }) {
  const mains = CIV_CHAIN.filter((n) => n.role === 'main');
  const branches = CIV_CHAIN.filter((n) => n.role === 'branch');
  const active = useMemo(() => getCard(activeId), [activeId]);
  const activeMeta = CIV_CHAIN.find((n) => n.id === activeId);

  return (
    <div className="st-chain">
      <div className="st-chain__rail" role="list" aria-label="文明博弈因果主链">
        {mains.map((node, i) => {
          const card = getCard(node.id);
          const isOn = activeId === node.id;
          return (
            <React.Fragment key={node.id}>
              <button
                type="button"
                role="listitem"
                className={`st-chain__node${isOn ? ' is-active' : ''}`}
                aria-pressed={isOn}
                aria-label={`${node.id} ${card?.title || ''}`}
                onClick={() => onSelect(node.id)}
              >
                <span className="st-chain__id mono">{node.id}</span>
                <strong>{card?.title}</strong>
                <span className="st-chain__hint">{node.abstract}</span>
              </button>
              {i < mains.length - 1 && (
                <div className="st-chain__edge" aria-hidden="true">
                  <span className="mono">{node.edge || '→'}</span>
                  <span className="st-chain__arrow">→</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="st-chain__branches" role="group" aria-label="降维与锁死旁支">
        <p className="st-chain__branch-label mono">旁支 · 打断 / 碾压技术爆炸路径</p>
        <div className="st-chain__branch-row">
          {branches.map((node) => {
            const card = getCard(node.id);
            const isOn = activeId === node.id;
            return (
              <button
                key={node.id}
                type="button"
                className={`st-chain__node st-chain__node--branch${isOn ? ' is-active' : ''}`}
                aria-pressed={isOn}
                aria-label={`${node.branchLabel}：${node.id} ${card?.title || ''}`}
                onClick={() => onSelect(node.id)}
              >
                <span className="st-chain__branch-tag mono">{node.branchLabel}</span>
                <span className="st-chain__id mono">{node.id}</span>
                <strong>{card?.title}</strong>
                <span className="st-chain__hint">{node.abstract}</span>
              </button>
            );
          })}
        </div>
      </div>

      {active && (
        <div className="st-chain__detail" aria-live="polite">
          <div className="st-chain__detail-head">
            <span className="mono">{active.id}</span>
            <h3>{active.title}</h3>
            {activeMeta?.role === 'branch' && (
              <span className="st-badge-branch mono">{activeMeta.branchLabel}</span>
            )}
          </div>
          <p className="st-chain__oneliner">{active.oneLiner}</p>
          <DualMirror card={active} />
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
          点击主链或旁支节点，展开「相似机制 / 关键差异」双栏映射。
        </p>
      )}
    </div>
  );
}

function LedgerSamples({ onJumpSpectrum }) {
  return (
    <div className="st-civ-ledgers">
      {CIV_LEDGERS.map((L) => (
        <article key={L.id} className={`st-civ-ledger st-civ-ledger--${L.status}`}>
          <header className="st-civ-ledger__head">
            <span className="mono">{L.id}</span>
            <span className={`st-civ-ledger__status mono st-civ-ledger__status--${L.status}`}>
              {L.statusLabel}
            </span>
            <h3>{L.title}</h3>
          </header>
          <p className="st-civ-ledger__thesis">{L.thesis}</p>
          <div className="st-dual st-dual--inline">
            <div className="st-dual__col st-dual__similar">
              <h4>相似机制</h4>
              <ul>
                {L.similarMechanisms.map((m) => (
                  <li key={m.text}>
                    {m.to ? <Link to={m.to}>{m.text}</Link> : m.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="st-dual__col st-dual__diff">
              <h4>关键差异</h4>
              <ul>
                {L.criticalDiffs.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
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

function LensBoundaryBlock() {
  return (
    <div className="st-lens-bound">
      <p className="st-lede st-lede--tight">
        三体透镜 ≠ 修昔底德叙事 ≠ 经典博弈论工具箱。三者可交叉深链，但适用边界不同——深链旁强制标注差异。
      </p>
      <div className="st-lens-bound__grid">
        {LENS_BOUNDARIES.map((b) => (
          <article key={b.id} className="st-lens-bound__card" data-lens={b.id}>
            <h3>
              {b.to ? <Link to={b.to}>{b.label}</Link> : b.label}
            </h3>
            <p className="st-lens-bound__one">{b.oneLiner}</p>
            <dl>
              <div>
                <dt>适用</dt>
                <dd>{b.appliesWhen}</dd>
              </div>
              <div>
                <dt>不适用</dt>
                <dd>{b.notFor}</dd>
              </div>
              {b.diffVsSanti && (
                <div>
                  <dt>与三体差异</dt>
                  <dd>{b.diffVsSanti}</dd>
                </div>
              )}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}

/**
 * Round 2 · 文明博弈深描
 * @param {{ onJumpSpectrum: (ids: string[], focusId?: string) => void }} props
 */
export default function CivPanel({ onJumpSpectrum }) {
  const [chainId, setChainId] = useState('ST-01');

  const handleQuad = useCallback(
    (quadId) => {
      const ids = QUAD_TO_CARDS[quadId] || [];
      if (ids.length) onJumpSpectrum(ids, ids[0]);
    },
    [onJumpSpectrum],
  );

  const jump = useCallback(
    (ids) => {
      if (ids?.length) onJumpSpectrum(ids, ids[0]);
    },
    [onJumpSpectrum],
  );

  return (
    <div className="st-civ">
      <section className="st-sec" aria-labelledby="st-chain-h">
        <div className="st-sec-head">
          <h2 id="st-chain-h">因果链 · 公理 → 黑暗森林 → 技术爆炸</h2>
          <span className="st-sec-tag mono">ST-01 · ST-02 · ST-03 · 旁支 ST-04 / ST-07</span>
        </div>
        <p className="st-lede">
          主链串联宇宙社会学前提、黑暗森林策略与技术爆炸窗口；智子锁死与水滴作为「打断 / 碾压」旁支挂接，不另开平行叙事。
        </p>
        <CausalChain activeId={chainId} onSelect={setChainId} onJumpSpectrum={jump} />
      </section>

      <section className="st-sec" aria-labelledby="st-civ-forest-h">
        <div className="st-sec-head">
          <h2 id="st-civ-forest-h">图 A · 与光谱卡联动</h2>
          <span className="st-sec-tag mono">点选象限 → 高亮概念卡</span>
        </div>
        <p className="st-lede">
          点选象限节点将跳转「理论光谱」并高亮对应概念卡（键盘 Enter / Space 可达；尊重 prefers-reduced-motion）。
        </p>
        <DarkForestChart onSelectQuad={handleQuad} />
        <ul className="st-quad-map mono" aria-label="象限与概念卡映射">
          <li>先发沉默 → ST-02 · ST-03</li>
          <li>可控威慑 → ST-06 · ST-03</li>
          <li>重复博弈 → ST-01</li>
          <li>脆弱均衡 → ST-01 · ST-02</li>
        </ul>
      </section>

      <section className="st-sec" aria-labelledby="st-civ-ledger-h">
        <div className="st-sec-head">
          <h2 id="st-civ-ledger-h">文明博弈台账样例</h2>
          <span className="st-sec-tag mono">已兑现 · 进行中 · 未决</span>
        </div>
        <p className="st-lede">
          跨概念主题台账：每份强制「相似机制 + 关键差异」。解释力判定显式分列，禁止虚假收束。
        </p>
        <LedgerSamples onJumpSpectrum={jump} />
      </section>

      <section className="st-sec" aria-labelledby="st-lens-bound-h">
        <div className="st-sec-head">
          <h2 id="st-lens-bound-h">透镜划界</h2>
          <span className="st-sec-tag mono">三体 ≠ 修昔底德 ≠ 博弈论</span>
        </div>
        <LensBoundaryBlock />
      </section>
    </div>
  );
}
