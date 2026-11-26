import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { SelectorBar } from '../shared/ModuleParadigm.jsx';
import { networkOption } from './charts.js';
import { buildNetwork, eventsMentioning } from './modelLogic.js';
import { CIRCLES, CIRCLE_ALIAS, EVENTS, EXTRA_NODES, PIPELINES, POLITBURO } from './model.seed.js';
import StatusPill from './StatusPill.jsx';

const SNAPSHOTS = [
  { key: '2026', label: '当前（2026-11）' },
  { key: '2022', label: '二十大组成（2022-10）' },
];

function MemberRows({ people }) {
  return (
    <ul className="om-members">
      {people.map((r) => (
        <li key={r.name}>
          <span className="om-members__name">{r.name}</span>
          <span className="om-members__post">{r.post}</span>
          <StatusPill status={r.netStatus || r.status} />
        </li>
      ))}
    </ul>
  );
}

function ProtectBar({ from, to }) {
  return (
    <div className="om-protect" aria-label={`保护力 ${from} → ${to}（满分 3）`}>
      <div className="om-protect__row"><span>2022</span><span className="om-protect__track"><span style={{ width: `${(from / 3) * 100}%` }} /></span><b className="mono">{from}</b></div>
      <div className="om-protect__row is-now"><span>2026</span><span className="om-protect__track"><span style={{ width: `${(to / 3) * 100}%` }} /></span><b className="mono">{to}</b></div>
    </div>
  );
}

function NodeDetail({ node, network, snapshot }) {
  if (!node) return <p className="om-note">点击网络中的任一节点查看详情。</p>;
  const members = network.nodes.filter((n) => n.kind === 'member').map((n) => ({ ...n.person, netStatus: n.status }));

  if (node.kind === 'hub') {
    const purged = members.filter((m) => m.netStatus === '被查处').length;
    return (
      <>
        <div className="om-detail__kicker">枢纽</div>
        <h4 className="om-detail__title">习近平</h4>
        <p className="om-detail__sub">总书记 · 国家主席 · 军委主席</p>
        <dl className="om-kv">
          <dt>权力管道</dt><dd className="mono">{PIPELINES.length}</dd>
          <dt>人事圈层</dt><dd className="mono">{CIRCLES.length}</dd>
          <dt>网络中成员</dt><dd className="mono">{members.length}</dd>
          <dt>其中被查处</dt><dd className="mono" style={{ color: purged ? 'var(--status-negative)' : undefined }}>{purged}</dd>
        </dl>
        <p className="om-note">切换到“二十大组成”可对照 2022 年的网络：当时这些边全部完好。</p>
      </>
    );
  }

  if (node.kind === 'pipeline') {
    const p = PIPELINES.find((x) => x.id === node.id);
    const people = members.filter((m) => p.members.includes(m.name));
    const bad = people.filter((m) => m.netStatus === '被查处').length;
    return (
      <>
        <div className="om-detail__kicker">权力管道</div>
        <h4 className="om-detail__title">{p.name}</h4>
        <p className="om-detail__sub">{p.note}</p>
        <p className="om-detail__stat"><b className="mono">{people.length - bad}</b> 在任 · <b className="mono" style={{ color: bad ? 'var(--status-negative)' : undefined }}>{bad}</b> 被查处</p>
        <MemberRows people={people} />
      </>
    );
  }

  if (node.kind === 'circle') {
    const c = CIRCLES.find((x) => `circle:${x.id}` === node.id);
    const people = members.filter((m) => (CIRCLE_ALIAS[m.circle] || m.circle) === c.id);
    return (
      <>
        <div className="om-detail__kicker">人事圈层 · 边类型：{c.edge}</div>
        <h4 className="om-detail__title">{c.id}</h4>
        <p className="om-detail__sub">{c.note}</p>
        <ProtectBar from={c.protect2022} to={c.protect2026} />
        <MemberRows people={people} />
      </>
    );
  }

  const r = node.person;
  const evs = eventsMentioning(EVENTS, r.name);
  return (
    <>
      <div className="om-detail__kicker">节点 · {CIRCLE_ALIAS[r.circle] || r.circle}</div>
      <h4 className="om-detail__title">{r.name} <StatusPill status={node.status} /></h4>
      <p className="om-detail__sub">{r.post}</p>
      <dl className="om-kv">
        <dt>出生年</dt><dd className="mono">{r.birthYear ?? '—'}</dd>
        <dt>2027 到龄</dt><dd>{r.ageOut2027 == null ? '—' : r.ageOut2027 ? '是' : '否'}</dd>
        <dt>核实等级</dt><dd className="mono">{r.grade}</dd>
        <dt>快照</dt><dd>{snapshot === '2022' ? '二十大组成' : '当前'}</dd>
      </dl>
      {evs.length > 0 && (
        <>
          <div className="om-detail__kicker" style={{ marginTop: 12 }}>相关事件</div>
          <ul className="om-evlist">
            {evs.map((e) => <li key={`${e.date}-${e.event}`}><span className="mono">{e.date}</span> {e.event}</li>)}
          </ul>
        </>
      )}
    </>
  );
}

/** 网络结构图 + 节点详情 */
export default function NetworkPanel() {
  const [snapshot, setSnapshot] = useState('2026');
  const [selectedId, setSelectedId] = useState('pipe-cmc');
  const network = useMemo(
    () => buildNetwork({ politburo: POLITBURO, extra: EXTRA_NODES, pipelines: PIPELINES, circles: CIRCLES, alias: CIRCLE_ALIAS, snapshot }),
    [snapshot],
  );
  const option = useMemo(() => networkOption(network, null), [network]);
  const selectRef = useRef(setSelectedId);
  selectRef.current = setSelectedId;
  const onReady = useCallback((chart) => {
    chart.on('click', (p) => {
      if (p.dataType === 'node' && p.data?.id) selectRef.current(p.data.id);
    });
  }, []);
  const node = network.nodes.find((n) => n.id === selectedId) || null;
  const purged = network.nodes.filter((n) => n.kind === 'member' && n.status === '被查处').length;

  return (
    <div className="om-split">
      <Card title="权力网络 · 一个枢纽、五条管道、六个人事圈层" className="om-split__main" asSection={false}>
        <div className="om-toolbar">
          <SelectorBar items={SNAPSHOTS} activeKey={snapshot} onSelect={setSnapshot} />
          <span className="om-toolbar__meta mono">节点 {network.nodes.length} · 边 {network.links.length} · 被查处 <b style={{ color: purged ? 'var(--status-negative)' : undefined }}>{purged}</b></span>
        </div>
        <EChart option={option} onReady={onReady} style={{ height: 500 }} />
        <p className="om-note">圈层菱形大小与金色连线粗细表示“边的保护力”（0–3）；红色虚线为已因查处断开的边。可拖动节点，点击查看详情，点图例隐藏某类节点。</p>
      </Card>
      <Card title="节点详情" className="om-split__side om-detail" asSection={false}>
        <NodeDetail node={node} network={network} snapshot={snapshot} />
        <div className="om-divider" />
        <div className="om-detail__kicker">各圈层边的保护力 · 2022 → 当前（满分 3）</div>
        <div className="om-circles">
          {CIRCLES.map((c) => (
            <button key={c.id} type="button" className={`om-circles__row ${selectedId === `circle:${c.id}` ? 'is-on' : ''}`} onClick={() => setSelectedId(`circle:${c.id}`)}>
              <span>{c.id}</span>
              <span className="om-circles__track" aria-hidden="true">
                <i className="was" style={{ width: `${(c.protect2022 / 3) * 100}%` }} />
                <i className={`now ${c.protect2026 < c.protect2022 ? 'is-drop' : ''}`} style={{ width: `${(c.protect2026 / 3) * 100}%` }} />
              </span>
              <span className="mono">{c.protect2022} → {c.protect2026}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
