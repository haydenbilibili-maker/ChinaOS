/**
 * Convert Round 4/5 case seed objects → premium slice config (buildSvg + NODE_DATA).
 * True source: scripts/data/round4-cases*.mjs, round5-cases.mjs
 */
import { buildSvg, nodeRect, nodeBase } from './sj-premium-slice.mjs';

function escSvgText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function caseToSliceConfig(c) {
  const prefix = c.cls;
  const nodeData = Object.fromEntries(
    c.nodes.map((n) => [n.id, { name: n.title, tag: n.tag || n.sub || '—', body: n.body }]),
  );

  const edgesBlock = c.edges
    .map((e) => {
      const dash = e.dash ? ` stroke-dasharray="${e.dash}"` : '';
      const me = e.marker ? ` marker-end="url(#${e.marker})"` : '';
      const lbl = e.label
        ? `\n    <text x="${e.lx}" y="${e.ly}" text-anchor="middle" fill="${e.stroke}" font-size="11" font-family="Songti SC,serif">${escSvgText(e.label)}</text>`
        : '';
      return `    <path class="sj-edge" data-edge="${e.id}" d="${e.d}" stroke="${e.stroke}" stroke-width="${e.w}"${dash}${me}/>${lbl}`;
    })
    .join('\n');

  const nodesBlock = c.nodes
    .map((n) => {
      if (n.id === 'base' && n.y >= 420) {
        return nodeBase(n.id, n.title, n.sub || '', '');
      }
      const opts = { fill: n.fill || 'var(--sj-ink-800)' };
      if (/王|帝|孝公|悼王|和会|中枢/.test(n.title) && n.stroke === 'var(--sj-ochre)') {
        opts.dash = '5 4';
        opts.sw = '1.6';
      }
      return nodeRect(n.id, n.x, n.y, n.w, n.h, n.stroke, n.title, n.sub || '', opts);
    })
    .join('\n');

  const railShort = c.sliceProse.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').slice(0, 72);

  return {
    prefix,
    prose: c.sliceProse,
    railSummary: `${railShort}…`,
    legend:
      '色义：赭金=合法性/财政枢纽 · 青瓷=制度/精英通道 · 朱红=张力/引爆/死穴 · 宣纸=叙事主轴 · 深墨=编户底盘。点击节点展开机制链；几何依本案类型母题（禁王安石竖轴克隆）。',
    nodeData,
    nodeEdge: c.nodeEdge,
    svg: () =>
      buildSvg({
        title: `结构切片 · ${c.title}`,
        desc: c.sliceProse.replace(/<[^>]+>/g, ''),
        header: `结构切片 · ${c.title}`,
        sub: `SJ-${c.num} · ${c.dynasty} · ${c.type}`,
        zhupi: `朱批 · ${c.zhupi.replace(/<[^>]+>/g, '').slice(0, 56)}…`,
        edges: edgesBlock,
        edgeLabels: '',
        nodes: nodesBlock,
        footer: `viewBox 820×600 · SJ-${c.num}`,
      }),
  };
}

export function buildRoundSliceConfigs(cases) {
  return Object.fromEntries(cases.map((c) => [c.num, caseToSliceConfig(c)]));
}
