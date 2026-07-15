#!/usr/bin/env node
/** Generate SJ-28/36/40/42/43/44 Round 6 cases. Premium §02 inline. */
import fs from 'node:fs';
import path from 'node:path';
import { ROUND6_CASES } from './data/round6-cases.mjs';

const OUT = path.resolve(import.meta.dirname, '../app/public/shijian');
const DOCS = path.resolve(import.meta.dirname, '../docs/shijian');
const PAGES = path.resolve(import.meta.dirname, '../app/src/modules/shijian');

function sjRoute(ref) {
  const m = ref.match(/SJ-(\d+)/);
  return m ? `/modules/shijian/sj-${m[1]}` : '/modules/shijian/sj-00';
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderNodes(nodes) {
  return nodes.map((n) => {
    const ty = n.y + (n.h > 60 ? 32 : 28);
    const sy = n.y + (n.h > 60 ? 50 : 0);
    const sub = n.sub ? `<text x="${n.x + n.w / 2}" y="${ty + (sy ? 18 : 0)}" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">${esc(n.sub)}</text>` : '';
    return `<g class="sj-node" data-id="${n.id}" tabindex="0" role="button" aria-label="${esc(n.title)}">
    <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6" fill="${n.fill}" stroke="${n.stroke}" stroke-width="2.4"/>
    <text x="${n.x + n.w / 2}" y="${ty}" text-anchor="middle" fill="${n.tfill}" font-size="14" font-weight="600" font-family="Songti SC,serif">${esc(n.title)}</text>
    ${sub}
  </g>`;
  }).join('\n');
}

function renderEdges(edges) {
  return edges.map((e) => {
    const dash = e.dash ? ` stroke-dasharray="${e.dash}"` : '';
    const me = e.marker ? ` marker-end="url(#${e.marker})"` : '';
    const lbl = e.label ? `<text x="${e.lx}" y="${e.ly}" text-anchor="middle" fill="${e.stroke}" font-size="11" font-family="Songti SC,serif">${esc(e.label)}</text>` : '';
    return `<path class="sj-edge" data-edge="${e.id}" d="${e.d}" stroke="${e.stroke}" stroke-width="${e.w}"${dash}${me}/>${lbl}`;
  }).join('\n');
}

function renderForces(forces) {
  return forces.map(([f, z, s]) => `<tr><td>${esc(f)}</td><td class="zheng">${esc(z)}</td><td class="shi">${esc(s)}</td></tr>`).join('\n');
}

function renderHist(hist) {
  return hist.map(([w, s, p], i) => {
    const span = i === hist.length - 1 ? ' style="grid-column:1/-1"' : '';
    return `<article${span}><div class="who">${esc(w)}<span>${esc(s)}</span></div><p>${esc(p)}</p></article>`;
  }).join('\n');
}

function renderHtml(c) {
  const nodeData = Object.fromEntries(c.nodes.map((n) => [n.id, { name: n.title, tag: n.tag, body: n.body }]));
  const svgNodes = renderNodes(c.nodes);
  const svgEdges = renderEdges(c.edges);
  const xrefs = c.xrefs.map(([n, h, p]) =>
    `<a href="${sjRoute(n)}"><div class="n">${esc(n)}</div><h3>${esc(h)}</h3><p>${esc(p)}</p></a>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>SJ-${c.num} · ${esc(c.title)}</title>
<meta name="description" content="ChinaOS 史鉴系列案例卷 SJ-${c.num}：${esc(c.title)}——${esc(c.subtitle)}。史鉴台账七字段。"/>
<style>
:root{
  --sj-ink-900:#14110f;--sj-ink-800:#1d1916;--sj-paper-100:#e8ddc7;--sj-paper-300:#cdbe9f;
  --sj-vermil:#a83b2c;--sj-celadon:#5f7a6f;--sj-ochre:#b8894a;--sj-line:#3a322b;
  --sj-radius:6px;--sj-space:clamp(12px,2vw,24px);
  --sj-serif:"Songti SC","Noto Serif SC","Source Han Serif SC",serif;
  --sj-mono:"Source Han Mono","JetBrains Mono",ui-monospace,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{min-height:100vh;background:radial-gradient(1000px 560px at 72% -8%,#2a221c 0%,transparent 55%),var(--sj-ink-900);color:var(--sj-paper-100);font-family:var(--sj-serif);line-height:1.75}
.${c.cls}-wrap{max-width:min(100%,1180px);margin:0 auto;padding:var(--sj-space) var(--sj-space) 48px}
@media(min-width:1280px){.${c.cls}-wrap{max-width:min(100%,1480px)}}
.sj-page-layout{display:flex;flex-direction:column;gap:var(--sj-space)}
@media(min-width:1280px){.sj-page-layout{display:grid;grid-template-columns:minmax(0,58fr) minmax(280px,38fr);gap:clamp(16px,2vw,28px);align-items:start}}
.sj-main-col{min-width:0}
.sj-rail{display:flex;flex-direction:column;gap:12px}
@media(min-width:1280px){.sj-rail{position:sticky;top:1rem;align-self:start;max-height:calc(100vh - 2rem);overflow-y:auto}}
@media(max-width:1279px){.sj-page-layout{flex-direction:column}.sj-main-col{display:contents}.sj-rail{order:2;margin:8px 0 20px}}
.sj-rail-card{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900));padding:14px 16px}
.sj-rail-card .k{font-family:var(--sj-mono);font-size:10px;letter-spacing:.16em;color:var(--sj-ochre);margin-bottom:6px}
.sj-rail-toc{display:grid;gap:6px;margin-top:8px}
.sj-rail-toc a{display:block;border:1px solid var(--sj-line);border-radius:var(--sj-radius);padding:8px 10px;text-decoration:none;color:inherit;font-size:13px}
.sj-rail-toc a:hover,.sj-rail-toc a:focus-visible,.sj-rail-toc a.is-active{border-color:var(--sj-ochre);outline:none}
.sj-rail-chip{display:inline-block;font-family:var(--sj-mono);font-size:10px;color:var(--sj-celadon);border:1px solid var(--sj-line);padding:3px 8px;border-radius:var(--sj-radius);text-decoration:none;margin:4px 4px 0 0}
.${c.cls}-mast{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;padding-bottom:16px;border-bottom:1px solid var(--sj-line);margin-bottom:20px}
.${c.cls}-mast .badge{font-family:var(--sj-mono);font-size:11px;letter-spacing:.18em;color:var(--sj-ochre);margin-bottom:6px}
.${c.cls}-mast h1{font-size:clamp(22px,3vw,28px);font-weight:600;letter-spacing:.16em}
.${c.cls}-mast h1 em{font-style:normal;color:var(--sj-paper-300);font-weight:400;font-size:.72em;display:block;margin-top:4px}
.${c.cls}-meta{font-family:var(--sj-mono);font-size:11px;color:var(--sj-paper-300);text-align:right}
.${c.cls}-chip{display:inline-block;font-family:var(--sj-mono);font-size:10px;color:var(--sj-celadon);border:1px solid var(--sj-line);padding:3px 8px;border-radius:var(--sj-radius);text-decoration:none;margin:2px}
.${c.cls}-dynasty{color:var(--sj-ochre);border-color:var(--sj-ochre)}
.sj-zhupi{color:var(--sj-vermil);font-size:13.5px;margin:0 0 18px;padding-left:12px;border-left:2px solid var(--sj-vermil);max-width:74ch}
.sj-ledger{display:grid;gap:8px}
.sj-ledger-field{margin:20px 0 8px;scroll-margin-top:24px}
.sj-ledger-fh{display:flex;align-items:baseline;gap:12px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--sj-line)}
.sj-ledger-fh .fnum{font-family:var(--sj-mono);font-size:11px;color:var(--sj-ochre);border:1px solid var(--sj-line);border-radius:4px;padding:1px 7px}
.sj-ledger-fh h2{font-size:clamp(16px,2.1vw,19px);font-weight:600}
.${c.cls}-prose{font-size:15.5px;max-width:74ch}
.${c.cls}-hook{border:1px solid var(--sj-line);border-left:3px solid var(--sj-vermil);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:18px 22px}
.${c.cls}-hook p{font-size:clamp(16px,2.3vw,20px);line-height:1.7}
.${c.cls}-hook .yr{margin-top:10px;font-family:var(--sj-mono);font-size:11px;color:var(--sj-ochre)}
.${c.cls}-stage{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:8px;overflow:auto}
.${c.cls}-stage svg{display:block;width:100%;height:auto}
.sj-node{cursor:pointer;transition:opacity .2s ease,filter .2s ease}
.sj-node:focus-visible{outline:2px solid var(--sj-ochre);outline-offset:4px}
.sj-edge{transition:opacity .2s ease,filter .2s ease}
.${c.cls}-stage.is-picking .sj-node{opacity:.3}
.${c.cls}-stage.is-picking .sj-node.is-hot{opacity:1;filter:drop-shadow(0 0 6px rgba(184,137,74,.4))}
.${c.cls}-stage.is-picking .sj-edge{opacity:.16}
.${c.cls}-stage.is-picking .sj-edge.is-hot{opacity:1;filter:drop-shadow(0 0 3px rgba(168,59,44,.4))}
.${c.cls}-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,300px);gap:14px;align-items:start;margin-top:14px}
.${c.cls}-aside{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900));padding:14px 16px;position:sticky;top:12px;min-height:150px}
.${c.cls}-aside .k{font-family:var(--sj-mono);font-size:10px;letter-spacing:.16em;color:var(--sj-ochre);margin-bottom:6px}
.${c.cls}-aside h3{font-size:16px;letter-spacing:.08em;margin-bottom:8px}
.${c.cls}-aside p{font-size:13.5px;color:var(--sj-paper-300);line-height:1.7}
.${c.cls}-aside-empty{font-size:13px;color:var(--sj-paper-300);opacity:.85}
.${c.cls}-note{font-size:13px;color:var(--sj-paper-300);line-height:1.65;max-width:74ch}
@media(max-width:900px){.${c.cls}-layout{grid-template-columns:1fr}.${c.cls}-aside{position:static}}
.${c.cls}-phase .pb{font-family:var(--sj-mono);font-size:12px;color:var(--sj-vermil);border:1px solid var(--sj-vermil);border-radius:20px;padding:6px 16px}
.${c.cls}-table-wrap{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);overflow:auto}
.${c.cls}-table{width:100%;border-collapse:collapse;font-size:13px}
.${c.cls}-table th{background:var(--sj-ink-900);color:var(--sj-ochre);font-family:var(--sj-mono);font-size:10px;padding:10px 12px;text-align:left;border-bottom:1px solid var(--sj-line)}
.${c.cls}-table td{padding:10px 12px;border-bottom:1px solid var(--sj-line);color:var(--sj-paper-300);vertical-align:top}
.${c.cls}-table td:first-child{color:var(--sj-paper-100);font-weight:600}
.${c.cls}-hist{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.${c.cls}-hist article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.${c.cls}-hist .who{font-size:14px;font-weight:600;color:var(--sj-celadon);margin-bottom:6px}
.${c.cls}-hist .who span{font-family:var(--sj-mono);font-size:10px;color:var(--sj-paper-300);margin-left:6px}
.${c.cls}-hist p{font-size:13px;color:var(--sj-paper-300);line-height:1.65}
.${c.cls}-verdict{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.${c.cls}-verdict article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.${c.cls}-verdict .vh{font-family:var(--sj-mono);font-size:10px;margin-bottom:8px}
.${c.cls}-verdict article.ok .vh{color:var(--sj-celadon)}
.${c.cls}-verdict article.fail .vh{color:var(--sj-vermil)}
.${c.cls}-verdict article.open .vh{color:var(--sj-ochre)}
.${c.cls}-verdict p{font-size:13px;color:var(--sj-paper-300)}
.${c.cls}-mirror{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.${c.cls}-mirror article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.${c.cls}-mirror .mh{font-family:var(--sj-mono);font-size:10px;margin-bottom:8px}
.${c.cls}-mirror article.same .mh{color:var(--sj-celadon)}
.${c.cls}-mirror article.diff .mh{color:var(--sj-ochre)}
.${c.cls}-mirror p{font-size:13px;color:var(--sj-paper-100);line-height:1.68}
.${c.cls}-xref{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
.${c.cls}-xref a{display:block;border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px;text-decoration:none;color:inherit}
.${c.cls}-xref .n{font-family:var(--sj-mono);font-size:10px;color:var(--sj-ochre);margin-bottom:4px}
.${c.cls}-xref h3{font-size:14px;margin-bottom:6px}
.${c.cls}-xref p{font-size:12.5px;color:var(--sj-paper-300)}
.${c.cls}-foot{margin-top:40px;padding-top:14px;border-top:1px solid var(--sj-line);font-family:var(--sj-mono);font-size:10px;color:var(--sj-paper-300);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
.${c.cls}-foot a{color:var(--sj-celadon);text-decoration:none}
@media(max-width:768px){.${c.cls}-hist,.${c.cls}-mirror,.${c.cls}-verdict,.${c.cls}-xref{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.sj-node,.sj-edge{transition:none}}
.sj-rail-mini{font-size:12.5px;color:var(--sj-paper-300);line-height:1.6;margin-top:6px}
</style>
</head>
<body>
<div class="${c.cls}-wrap" id="${c.cls}-top">
<header class="${c.cls}-mast">
  <div>
    <div class="badge">${esc(c.badge)}</div>
    <h1>${esc(c.title)}<em>${esc(c.subtitle)}</em></h1>
    <div>
      <span class="${c.cls}-chip ${c.cls}-dynasty" data-dynasty="${c.dynastyId}">朝代 · ${esc(c.dynasty)}</span>
      <span class="${c.cls}-chip">${esc(c.type)}</span>
      <a class="${c.cls}-chip" href="/modules/shijian/sj-00">↔ SJ-00</a>
      <a class="${c.cls}-chip" href="/modules/shijian/sj-03">↔ SJ-03</a>
      <a class="${c.cls}-chip" href="/modules/shijian/sj-04">↔ SJ-04</a>
      ${c.extraChip || ''}
    </div>
  </div>
  <div class="${c.cls}-meta">史鉴台账七字段 · ${esc(c.dynasty.split('/')[0])}<br/><b>AS_OF 2026-07-15</b> · v0.1</div>
</header>
<p class="sj-zhupi">${c.zhupi}</p>
<article class="sj-ledger">
<div class="sj-page-layout">
<div class="sj-main-col">
<section class="sj-ledger-field" id="f1"><div class="sj-ledger-fh"><span class="fnum">01</span><h2>一句话拐点</h2></div>
  <div class="${c.cls}-hook"><p>${c.hook}</p><div class="yr">${esc(c.chronology)}</div></div>
</section>
<section class="sj-ledger-field" id="f2" aria-labelledby="h-f2">
  <div class="sj-ledger-fh"><span class="fnum">02</span><h2 id="h-f2">结构切片</h2><span class="en">SLICE · 步骤①</span></div>
  <p class="${c.cls}-prose">${c.sliceProse}</p>
  <div class="${c.cls}-stage" id="stage"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 600" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">结构切片 · ${esc(c.title)}</title>
  <desc id="sj-desc">${esc(c.sliceProse.replace(/<[^>]+>/g, ''))}</desc>
  <defs>
    <radialGradient id="sj-glow" cx="50%" cy="34%" r="72%"><stop offset="0%" stop-color="var(--sj-ink-800)"/><stop offset="100%" stop-color="var(--sj-ink-900)"/></radialGradient>
    <pattern id="sj-xuan" width="8" height="14" patternUnits="userSpaceOnUse"><line x1="0" y1="1" x2="8" y2="1" stroke="var(--sj-paper-100)" stroke-width="0.4" opacity="0.35"/></pattern>
    <linearGradient id="sj-base" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#241e19"/><stop offset="100%" stop-color="#100e0c"/></linearGradient>
    <marker id="a-ochre" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-ochre)"/></marker>
    <marker id="a-vermil" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-vermil)"/></marker>
    <marker id="a-celadon" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-celadon)"/></marker>
    <marker id="a-paper" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-paper-100)"/></marker>
  </defs>
  <rect width="820" height="600" fill="url(#sj-glow)"/>
  <rect x="44" y="96" width="732" height="420" fill="url(#sj-xuan)" opacity="0.05"/>
  <g aria-hidden="true" opacity="0.7">
    <rect x="16" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="20" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
    <rect x="792" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="796" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
  </g>
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600" font-family="Songti SC,serif">结构切片 · ${esc(c.title)}</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono,monospace">SJ-${c.num} · ${esc(c.dynasty)} · ${esc(c.type)}</text>
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC,serif">朱批 · 五力色义 · 点击节点交互</text>
  <g fill="none" stroke-linecap="round">${svgEdges}</g>
  ${svgNodes}
  <text x="764" y="588" text-anchor="end" fill="var(--sj-line)" font-size="9" font-family="Source Han Mono,monospace">viewBox 820×600 · SJ-${c.num}</text>
</svg></div>
  <div class="${c.cls}-layout">
    <div class="${c.cls}-note" style="margin-top:0">点选节点展开机制链；色义见 premium 切片图例。</div>
    <aside class="${c.cls}-aside" id="aside" aria-live="polite">
      <div id="aside-empty" class="${c.cls}-aside-empty">点选切片中任一节点，展开其在拐点中的角色。</div>
      <div id="aside-body" hidden>
        <div class="k" id="aside-tag">—</div>
        <h3 id="aside-name">—</h3>
        <p id="aside-text">—</p>
      </div>
    </aside>
  </div>
</section>
</div>
<aside class="sj-rail"><div class="sj-rail-card"><div class="k">台账 · 七字段</div>
  <nav class="sj-rail-toc"><a href="#f1">01 · 拐点</a><a href="#f2">02 · 切片</a><a href="#f3">03 · 相位</a><a href="#f4">04 · 五力</a><a href="#f5">05 · 交锋</a><a href="#f6">06 · 成败</a><a href="#f7">07 · 映射</a></nav>
  <a class="sj-rail-chip" href="/modules/shijian/sj-00#sec-case-hub">案例库 Hub</a>
  <a class="sj-rail-chip" href="/modules/shijian/sj-03">SJ-03 五力</a>
  <a class="sj-rail-chip" href="/modules/shijian/sj-04">SJ-04 相位盘</a>
</div></aside>
</div>
<section class="sj-ledger-field" id="f3"><div class="sj-ledger-fh"><span class="fnum">03</span><h2>相位定位</h2></div>
  <div class="${c.cls}-phase"><span class="pb">${esc(c.phase)}</span></div>
  <p class="${c.cls}-prose">${c.phaseProse}</p>
</section>
<section class="sj-ledger-field" id="f4"><div class="sj-ledger-fh"><span class="fnum">04</span><h2>五力归因台账</h2></div>
  <div class="${c.cls}-table-wrap"><table class="${c.cls}-table"><thead><tr><th>力</th><th>正史归因</th><th>结构实因</th></tr></thead><tbody>${renderForces(c.forces)}</tbody></table></div>
</section>
<section class="sj-ledger-field" id="f5"><div class="sj-ledger-fh"><span class="fnum">05</span><h2>史家交锋</h2></div>
  <div class="${c.cls}-hist">${renderHist(c.hist)}</div>
</section>
<section class="sj-ledger-field" id="f6"><div class="sj-ledger-fh"><span class="fnum">06</span><h2>成败判定</h2></div>
  <div class="${c.cls}-verdict">
    <article class="ok"><div class="vh">已兑现</div>${c.verdict.ok.map((p) => `<p>${esc(p)}</p>`).join('')}</article>
    <article class="fail"><div class="vh">已失败</div>${c.verdict.fail.map((p) => `<p>${esc(p)}</p>`).join('')}</article>
    <article class="open"><div class="vh">未决</div>${c.verdict.open.map((p) => `<p>${esc(p)}</p>`).join('')}</article>
  </div>
</section>
<section class="sj-ledger-field" id="f7"><div class="sj-ledger-fh"><span class="fnum">07</span><h2>古今映射</h2></div>
  <div class="${c.cls}-mirror">
    <article class="same"><div class="mh">相似机制</div><p>${esc(c.mirror.same)}</p></article>
    <article class="diff"><div class="mh">关键差异</div><p>${esc(c.mirror.diff)}</p></article>
  </div>
</section>
<section class="sj-ledger-field" id="fx"><div class="sj-ledger-fh"><span class="fnum">◆</span><h2>交叉引用</h2></div>
  <div class="${c.cls}-xref">${xrefs}</div>
</section>
</article>
<footer class="${c.cls}-foot">
  <span>ChinaOS · 史鉴 SJ-${c.num} · v0.1 · ${esc(c.dynasty)}</span>
  <span><a href="/modules/shijian/sj-00">← SJ-00</a> · <a href="${sjRoute(c.footerPrev)}">← ${c.footerPrev}</a></span>
  <span><a href="${sjRoute(c.footerNext)}">${c.footerNext} →</a></span>
</footer>
</div>
<script>
(function(){
  const stage=document.getElementById('stage');
  if(!stage) return;
  const nodes=Array.from(stage.querySelectorAll('.sj-node'));
  const edges=Array.from(stage.querySelectorAll('.sj-edge'));
  const asideEmpty=document.getElementById('aside-empty');
  const asideBody=document.getElementById('aside-body');
  const NODE_DATA=${JSON.stringify(nodeData, null, 2)};
  const NODE_EDGE=${JSON.stringify(c.nodeEdge, null, 2)};
  function clearVisual(){stage.classList.remove('is-picking');nodes.forEach(n=>n.classList.remove('is-hot'));edges.forEach(e=>e.classList.remove('is-hot'));}
  function showAside(id){const d=NODE_DATA[id];if(!d)return;asideEmpty.hidden=true;asideBody.hidden=false;document.getElementById('aside-tag').textContent=d.tag;document.getElementById('aside-name').textContent=d.name;document.getElementById('aside-text').textContent=d.body;}
  function pick(id){if(!NODE_DATA[id])return;clearVisual();stage.classList.add('is-picking');nodes.forEach(n=>n.classList.toggle('is-hot',n.dataset.id===id));const hot=NODE_EDGE[id]||[];edges.forEach(e=>e.classList.toggle('is-hot',hot.indexOf(e.dataset.edge)>=0));showAside(id);}
  nodes.forEach(n=>{const act=()=>pick(n.dataset.id);n.addEventListener('click',act);n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});});
  edges.forEach(e=>{if(!e.dataset.edge||!NODE_DATA[e.dataset.edge])return;const act=()=>pick(e.dataset.edge);e.style.cursor='pointer';e.setAttribute('tabindex','0');e.setAttribute('role','button');e.addEventListener('click',act);e.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();act();}});});
})();
</script>
</body>
</html>`;
}

function renderSpec(c) {
  return `# SJ-${c.num} · ${c.title} —— 建设规格

> ${c.badge}。朝代：${c.dynasty} · 类型：${c.type} · eventYear：${c.eventYear}

## 模块头

- 系年：见 HTML §01
- 交叉引用：见 HTML §◆；SJ-03 五力 / SJ-04 相位盘

## 七字段摘要

① ${c.hook.replace(/<[^>]+>/g, '').slice(0, 100)}…

② ${c.sliceProse.replace(/<[^>]+>/g, '').slice(0, 80)}…

③ ${c.phase}

④ 五力：见 HTML 台账表

⑤ 史家交锋：李敖/钱穆/金观涛/黄仁宇/汉学

⑥ 成败三列：已兑现/已失败/未决

⑦ 古今映射：相似机制 + 关键差异双栏

## 结构切片

- 节点数：${c.nodes.length} · NODE_DATA 交互 · premium 卷轴 SVG
- Tier：T2
`;
}

for (const c of ROUND6_CASES) {
  fs.writeFileSync(path.join(OUT, `SJ-${c.num}.html`), renderHtml(c), 'utf8');
  fs.writeFileSync(path.join(DOCS, `SJ-${c.num}-${c.title}-建设规格.md`), renderSpec(c), 'utf8');
  const pageNum = c.num;
  const pageName = `Sj${pageNum}Page.jsx`;
  const pagePath = path.join(PAGES, pageName);
  fs.writeFileSync(pagePath, `import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj${pageNum}Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ${pageNum}"
      badge="SJ-${pageNum} · 史鉴"
      title="${c.title.replace(/"/g, '\\"')}"
      subtitle="${c.subtitle.replace(/"/g, '\\"')}"
      htmlSrc="/shijian/SJ-${pageNum}.html"
      frameTitle="SJ-${pageNum} ${c.title}"
      hintLinks={[{ href: '/shijian/SJ-${pageNum}.html', label: '/shijian/SJ-${pageNum}.html' }]}
    />
  );
}
`, 'utf8');
  console.log('Wrote SJ-' + c.num);
}
console.log('Done:', ROUND6_CASES.length, 'Round 6 case volumes');
