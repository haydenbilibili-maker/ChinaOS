/**
 * Premium structure-slice builder for SJ case volumes. Zero CDN; all --sj-* tokens.
 * Case-specific geometry true source: docs/shijian/结构切片几何规格.md
 * Do NOT clone SJ-05 vertical-axis motif — use scripts/lib/sj-slice-geometries.mjs for §1 cases.
 */

const SCROLL = `  <g aria-hidden="true" opacity="0.7">
    <rect x="16" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="20" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
    <rect x="792" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="796" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
  </g>`;

const DEFS = `  <defs>
    <radialGradient id="sj-glow" cx="50%" cy="34%" r="72%">
      <stop offset="0%" stop-color="var(--sj-ink-800)"/>
      <stop offset="100%" stop-color="var(--sj-ink-900)"/>
    </radialGradient>
    <pattern id="sj-xuan" width="8" height="14" patternUnits="userSpaceOnUse">
      <line x1="0" y1="1" x2="8" y2="1" stroke="var(--sj-paper-100)" stroke-width="0.4" opacity="0.35"/>
    </pattern>
    <linearGradient id="sj-base" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#241e19"/><stop offset="100%" stop-color="#100e0c"/>
    </linearGradient>
    <marker id="a-ochre" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-ochre)"/></marker>
    <marker id="a-vermil" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-vermil)"/></marker>
    <marker id="a-celadon" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-celadon)"/></marker>
    <marker id="a-paper" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-paper-300)"/></marker>
  </defs>`;

export function sliceCss(prefix) {
  const P = prefix;
  return `
.${P}-stage{width:100%;max-width:100%;border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900));box-shadow:0 1px 0 rgba(232,221,199,.04),0 18px 48px rgba(0,0,0,.45);padding:8px 8px 4px;overflow:auto}
.${P}-stage svg{display:block;width:100%;height:auto;max-width:100%;margin:0 auto}
.sj-node{cursor:pointer;transition:opacity .2s ease,filter .2s ease}
.sj-node:focus-visible{outline:2px solid var(--sj-ochre);outline-offset:4px}
.sj-edge{transition:opacity .2s ease,filter .2s ease}
.${P}-stage.is-picking .sj-node{opacity:.3}
.${P}-stage.is-picking .sj-node.is-hot{opacity:1;filter:drop-shadow(0 0 6px rgba(184,137,74,.4))}
.${P}-stage.is-picking .sj-edge{opacity:.16}
.${P}-stage.is-picking .sj-edge.is-hot{opacity:1;filter:drop-shadow(0 0 3px rgba(168,59,44,.4))}
.${P}-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,300px);gap:14px;align-items:start;margin-top:14px}
.${P}-aside{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900));padding:14px 16px;position:sticky;top:12px;min-height:150px}
.${P}-aside .k{font-family:var(--sj-mono);font-size:10px;letter-spacing:.16em;color:var(--sj-ochre);margin-bottom:6px}
.${P}-aside h3{font-size:16px;letter-spacing:.08em;margin-bottom:8px}
.${P}-aside p{font-size:13.5px;color:var(--sj-paper-300);line-height:1.7}
.${P}-aside-empty{font-size:13px;color:var(--sj-paper-300);opacity:.85}
.${P}-note{font-size:13px;color:var(--sj-paper-300);line-height:1.65;max-width:74ch}
@media(max-width:900px){.${P}-layout{grid-template-columns:1fr}.${P}-aside{position:static}}
@media(prefers-reduced-motion:reduce){.sj-node,.sj-edge{transition:none}}`;
}

export function sliceScript(nodeData, nodeEdge) {
  return `<script>
(function(){
  const stage=document.getElementById('stage');
  if(!stage) return;
  const nodes=Array.from(stage.querySelectorAll('.sj-node'));
  const edges=Array.from(stage.querySelectorAll('.sj-edge'));
  const asideEmpty=document.getElementById('aside-empty');
  const asideBody=document.getElementById('aside-body');
  const NODE_DATA=${JSON.stringify(nodeData, null, 2)};
  const NODE_EDGE=${JSON.stringify(nodeEdge, null, 2)};
  function clearVisual(){stage.classList.remove('is-picking');nodes.forEach(n=>n.classList.remove('is-hot'));edges.forEach(e=>e.classList.remove('is-hot'));}
  function showAside(id){const d=NODE_DATA[id];if(!d)return;asideEmpty.hidden=true;asideBody.hidden=false;document.getElementById('aside-tag').textContent=d.tag;document.getElementById('aside-name').textContent=d.name;document.getElementById('aside-text').textContent=d.body;}
  function pick(id){if(!NODE_DATA[id])return;clearVisual();stage.classList.add('is-picking');nodes.forEach(n=>n.classList.toggle('is-hot',n.dataset.id===id));const hot=NODE_EDGE[id]||[];edges.forEach(e=>e.classList.toggle('is-hot',hot.indexOf(e.dataset.edge)>=0));showAside(id);}
  nodes.forEach(n=>{const act=()=>pick(n.dataset.id);n.addEventListener('click',act);n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});});
  edges.forEach(e=>{if(!e.dataset.edge||!NODE_DATA[e.dataset.edge])return;const act=()=>pick(e.dataset.edge);e.style.cursor='pointer';e.setAttribute('tabindex','0');e.setAttribute('role','button');e.addEventListener('click',act);e.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();act();}});});
})();
</script>`;
}

/**
 * Remove `<marker id="X">…</marker>` defs whose `url(#X)` is never referenced elsewhere
 * in the SVG. Keeps regeneration idempotent so re-running patch never re-adds the
 * unused markers (a-paper 等) that the architect cleaned by hand (待办 §3b execution constraint).
 */
export function stripUnusedMarkers(svg) {
  return svg.replace(/^\s*<marker id="([^"]+)"[^>]*>[\s\S]*?<\/marker>\n?/gm, (whole, id) => {
    const refRe = new RegExp(`url\\(#${id}\\)`);
    return refRe.test(svg) ? whole : '';
  });
}

export function buildSvg({ title, desc, header, sub, zhupi, edges, edgeLabels, nodes, footer }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 600" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">${title}</title>
  <desc id="sj-desc">${desc}</desc>
${DEFS}
  <rect width="820" height="600" fill="url(#sj-glow)"/>
  <rect x="44" y="96" width="732" height="420" fill="url(#sj-xuan)" opacity="0.05"/>
${SCROLL}
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600" font-family="Songti SC,Noto Serif SC,serif" letter-spacing="0.1em">${header}</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono,JetBrains Mono,monospace" letter-spacing="0.08em">${sub}</text>
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC,Noto Serif SC,serif">${zhupi}</text>
  <g fill="none" stroke-linecap="round">${edges}</g>
  <g font-family="Songti SC,Noto Serif SC,serif" font-size="11">${edgeLabels}</g>
${nodes}
  <text x="764" y="588" text-anchor="end" fill="var(--sj-line)" font-size="9" font-family="Source Han Mono,JetBrains Mono,monospace">${footer}</text>
</svg>`;
  return stripUnusedMarkers(svg);
}

export function buildF2Section(prefix, { prose, svg, legend, nodeData, nodeEdge, railSummary }) {
  const P = prefix;
  return `<section class="sj-ledger-field" id="f2" aria-labelledby="h-f2">
  <div class="sj-ledger-fh"><span class="fnum">02</span><h2 id="h-f2">结构切片</h2><span class="en">SLICE · 步骤①</span></div>
  <p class="${P}-prose">${prose}</p>
  <div class="${P}-stage" id="stage">${svg}</div>
  <div class="${P}-layout">
    <div class="${P}-note" style="margin-top:0">${legend}</div>
    <aside class="${P}-aside" id="aside" aria-live="polite">
      <div id="aside-empty" class="${P}-aside-empty">点选切片中任一节点，展开其在拐点中的角色。</div>
      <div id="aside-body" hidden>
        <div class="k" id="aside-tag">—</div>
        <h3 id="aside-name">—</h3>
        <p id="aside-text">—</p>
      </div>
    </aside>
  </div>
</section>
<!--SLICE_RAIL:${railSummary}-->`;
}

export function nodeRect(id, x, y, w, h, stroke, label, sub, opts = {}) {
  const dash = opts.dash ? ` stroke-dasharray="${opts.dash}"` : '';
  const sw = opts.sw || '2.4';
  const fill = opts.fill || 'var(--sj-ink-800)';
  const fs = opts.fs || '14';
  return `  <g class="sj-node" data-id="${id}" tabindex="0" role="button" aria-label="${label}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}/>
    <text x="${x + w / 2}" y="${y + 28}" text-anchor="middle" fill="${stroke}" font-size="${fs}" font-weight="600" font-family="Songti SC,serif">${label}</text>
    <text x="${x + w / 2}" y="${y + 46}" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">${sub}</text>
  </g>`;
}

export function nodeCircle(id, cx, cy, r, stroke, label, sub) {
  return `  <g class="sj-node" data-id="${id}" tabindex="0" role="button" aria-label="${label}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="2" stroke-dasharray="4 3"/>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="var(--sj-paper-100)" font-size="13" font-family="Songti SC,serif">${label}</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">${sub}</text>
  </g>`;
}

export function nodeBase(id, label, sub, highlight) {
  return `  <g class="sj-node" data-id="${id}" tabindex="0" role="button" aria-label="${label}">
    <rect x="56" y="486" width="708" height="86" rx="6" fill="url(#sj-base)" stroke="var(--sj-line)" stroke-width="1.4"/>
    <text x="410" y="514" text-anchor="middle" fill="var(--sj-paper-100)" font-size="14" font-family="Songti SC,serif">${label}</text>
    <text x="410" y="532" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">${sub}</text>
    ${highlight || ''}
  </g>`;
}

/** Per-volume slice configs */
export const SLICE_CONFIGS = {
  '09': {
    prefix: 'sj-09',
    prose: '权力几何：万历皇权背书 → 张居正首辅纵列（实线较宋案更粗，仍系个人权威）→ 清丈/一条鞭下行汲取 → 地方胥吏执行 → 编户与士绅底盘。清丈触动隐田后以朱红回路反弹，构成与 SJ-05 同构的「财政重建触动精英」死穴。',
    railSummary: '万历背书 → 张居正清丈一条鞭 → 士绅隐田反弹；1582 人亡政息。',
    legend: '色义：皇权=赭金 · 张居正=青瓷 · 士绅=朱红 · 清丈=赭金下行 · 底盘=深墨。实线竖轴＝首辅个人权威；反弹回路笔画最重＝清丈触动隐田，非「小人乱政」。',
    nodeData: {
      huangquan: { name: '皇权 · 万历', tag: '合法性支柱', body: '万历初年强力背书张居正改革。万历十年（1582）张居正卒，支柱抽走 → 反攻倒算、清丈成果部分逆转。' },
      zhang: { name: '张居正 · 首辅', tag: '技术官僚 · 财政重建', body: '考成法强化中枢穿透，清丈田亩、一条鞭统合赋役，短中期充盈国库、缓解边饷。改革引擎，合法性全系首辅一线。' },
      shishen: { name: '东林/士绅', tag: '精英抵制 · 隐田', body: '清丈触动士绅—地主隐田特权，形成强烈反弹；张居正身后遭舆论清算，人亡政息。' },
      qingzhang: { name: '清丈 · 一条鞭', tag: '财政枢纽 · 下行', body: '万历九年（1581）一条鞭推广全国，赋役折银、统一征调。税基从人头/项目分散转向资产统合——汲取力结构性重整。' },
      xuli: { name: '地方胥吏', tag: '执行层 · 加派', body: '清丈与追欠在基层走样，火耗、加派扰民——执行扭曲放大「聚敛」口实，是正史归因与结构实因的落差。' },
      base: { name: '编户齐民 · 隐田地主', tag: '底盘 · 汲取转嫁', body: '明中后期货币化程度高，但小农—地主结构使汲取最终转嫁基层。隐田地主既是清丈对象，又是士绅抵制联盟的社会基础。' },
      rebound: { name: '反弹回路 · 变法死穴', tag: '士绅 → 人亡政息', body: '财政重建触动隐田特权，回流为士绅抵制与舆论反攻——这是一条鞭真正的死因。读成「权臣专权」正是正史对结构实因的遮蔽。' },
    },
    nodeEdge: {
      huangquan: ['spine'], zhang: ['spine', 'zhengdang', 'jiqu1'], shishen: ['zhengdang', 'rebound'],
      qingzhang: ['jiqu1', 'jiqu2'], xuli: ['jiqu2'], base: ['jiqu2', 'rebound'], rebound: ['rebound'],
    },
    svg: () => buildSvg({
      title: '张居正一条鞭法权力几何结构切片图',
      desc: '万历皇权实线支撑张居正首辅；清丈一条鞭下行经胥吏至编户士绅底盘；士绅隐田触动后以朱红粗回路反弹，构成人亡政息死穴。',
      header: '结构切片 · 一条鞭法',
      sub: 'SJ-09 · 张居正改革 · 步骤①',
      zhupi: '朱批：首辅实轴(较宋案粗) + 清丈反弹回路(朱红最重) = 人亡政息',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.95"/>
    <path class="sj-edge" data-edge="zhengdang" d="M306,286 L462,286" stroke="var(--sj-paper-300)" stroke-width="2.2" marker-start="url(#a-paper)" marker-end="url(#a-paper)" opacity="0.9"/>
    <path class="sj-edge" data-edge="jiqu1" d="M220,316 L220,372" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="jiqu2" d="M220,422 L220,486" stroke="var(--sj-celadon)" stroke-width="2.2" marker-end="url(#a-paper)" opacity="0.85"/>
    <path class="sj-edge" data-edge="rebound" d="M640,498 C724,452 716,340 588,320" stroke="var(--sj-vermil)" stroke-width="3.6" marker-end="url(#a-vermil)" opacity="0.95"/>`,
      edgeLabels: `
    <text x="250" y="212" fill="var(--sj-ochre)">首辅背书 · 1582 卒即翻盘</text>
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-paper-300)">清丈触动隐田 · 士绅抵制</text>
    <text x="230" y="352" fill="var(--sj-celadon)">一条鞭下行</text>
    <text x="230" y="462" fill="var(--sj-celadon)">胥吏加派</text>
    <text x="700" y="360" text-anchor="end" fill="var(--sj-vermil)" font-size="12" font-weight="600">触动隐田 → 精英反弹</text>
    <text x="700" y="378" text-anchor="end" fill="var(--sj-vermil)">★ 人亡政息</text>
    <circle cx="708" cy="392" r="5" fill="none" stroke="var(--sj-vermil)" stroke-width="1.4"/>`,
      nodes: `
${nodeRect('huangquan', 320, 112, 180, 46, 'var(--sj-ochre)', '皇权 · 万历', '合法性支柱', { sw: '2.6' })}
${nodeRect('zhang', 130, 250, 176, 60, 'var(--sj-celadon)', '张居正 · 首辅', '考成法 · 财政重建')}
${nodeRect('shishen', 462, 250, 186, 60, 'var(--sj-vermil)', '东林/士绅', '隐田 · 精英抵制')}
${nodeRect('qingzhang', 132, 372, 176, 50, 'var(--sj-ochre)', '清丈 · 一条鞭', '1581 统合赋役 · 折银')}
${nodeRect('xuli', 462, 372, 186, 50, 'var(--sj-paper-300)', '地方胥吏', '执行层 · 火耗加派', { sw: '1.6' })}
${nodeBase('base', '编户齐民 · 隐田地主', '承托一切 · 汲取最终转嫁基层', `    <rect x="556" y="494" width="196" height="70" rx="6" fill="none" stroke="var(--sj-vermil)" stroke-width="1.2" stroke-dasharray="5 4"/>
    <text x="654" y="534" text-anchor="middle" fill="var(--sj-vermil)" font-size="12" font-family="Songti SC,serif">隐田地主</text>`)}`,
      footer: 'viewBox 820×600 · 一条鞭法',
    }),
  },

  '11': {
    prefix: 'sj-11',
    prose: '权力几何：秦孝公皇权背书（虚线）→ 商鞅技术官僚纵列 → 军功爵/县制/连坐法下行 → 编户齐民农战底盘。旧贵族世卿世禄以朱红回路反弹，标示变法死穴——触动特权结构。',
    railSummary: '孝公背书 → 商鞅军功爵县制 → 旧贵族反弹；前356 变法。',
    legend: '色义：皇权=赭金虚线 · 商鞅新法=青瓷 · 军功爵=赭金 · 旧贵族=朱红粗回路 · 底盘=深墨。竖轴虚线＝依赖个人背书；反弹回路笔画最重。',
    nodeData: {
      duke: { name: '秦孝公', tag: '合法性支柱 · 脆弱竖轴', body: '变法依赖孝公个人权威；在其生前商鞅得以推行全套新法。前338 孝公卒，商鞅遭车裂。' },
      shang: { name: '商鞅', tag: '技术官僚 · 制度引擎', body: '废井田、开阡陌，推行县制、连坐法，以军功爵打开精英通道——把秦国改造成高动员战争—农业国家。' },
      junxian: { name: '军功爵 · 县制', tag: '财政—军事枢纽', body: '军功爵以可计量战功分配爵位土地，县制使汲取直达编户——财政与军事动员合一。' },
      lianzuo: { name: '连坐法 · 严刑', tag: '合法性工具', body: '以严刑峻法替代周礼秩序，短期强化服从，长期积累民怨与残暴化隐患。' },
      noble: { name: '旧贵族', tag: '精英抵制 · 世卿世禄', body: '世卿世禄遭摧毁性打击，形成强烈反弹；孝公身后商鞅车裂，旧贵族势力反扑。' },
      base: { name: '编户齐民', tag: '农战底盘', body: '农战体制下的税收与兵役来源，承受严刑峻法的高压——承托一切汲取与动员。' },
      rebound: { name: '反弹回路', tag: '旧贵族 → 车裂', body: '触动世卿世禄特权后回流为政治反扑——变法真正的结构风险，非单纯「刻薄少恩」。' },
    },
    nodeEdge: {
      duke: ['spine'], shang: ['spine', 'down1', 'down2'], junxian: ['down1', 'down2', 'military'],
      lianzuo: ['down2'], noble: ['rebound', 'military'], base: ['down2'], rebound: ['rebound'],
    },
    svg: () => buildSvg({
      title: '商鞅变法军功爵结构切片图',
      desc: '秦孝公虚线背书商鞅；军功爵县制连坐法下行至编户农战底盘；旧贵族触动特权后以朱红回路反弹。',
      header: '结构切片 · 军功爵纵列',
      sub: 'SJ-11 · 商鞅变法 · 步骤①',
      zhupi: '朱批：脆弱竖轴(虚线) + 世卿反弹(朱红最重) = 变法死穴',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="1.8" stroke-dasharray="6 5" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L220,486" stroke="var(--sj-celadon)" stroke-width="2.2" marker-end="url(#a-paper)" opacity="0.85"/>
    <path class="sj-edge" data-edge="military" d="M306,286 L462,286" stroke="var(--sj-ochre)" stroke-width="2" marker-end="url(#a-ochre)" opacity="0.85"/>
    <path class="sj-edge" data-edge="rebound" d="M180,310 C120,250 120,180 310,158" stroke="var(--sj-vermil)" stroke-width="3.6" marker-end="url(#a-vermil)" opacity="0.95"/>`,
      edgeLabels: `
    <text x="250" y="212" fill="var(--sj-ochre)">前338 孝公卒 · 竖轴抽走</text>
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-ochre)">耕战合一 · 军功爵</text>
    <text x="230" y="352" fill="var(--sj-celadon)">县制下行</text>
    <text x="230" y="462" fill="var(--sj-celadon)">编户汲取</text>
    <text x="120" y="200" fill="var(--sj-vermil)" font-size="12" font-weight="600">触动世卿 → 车裂</text>
    <circle cx="128" cy="214" r="5" fill="none" stroke="var(--sj-vermil)" stroke-width="1.4"/>`,
      nodes: `
${nodeRect('duke', 320, 112, 180, 46, 'var(--sj-ochre)', '秦孝公', '皇权背书', { dash: '5 4', sw: '2' })}
${nodeRect('shang', 130, 250, 176, 60, 'var(--sj-celadon)', '商鞅', '变法引擎 · 县制')}
${nodeRect('junxian', 132, 372, 176, 50, 'var(--sj-ochre)', '军功爵 · 县制', '汲取—军事枢纽')}
${nodeRect('lianzuo', 462, 372, 186, 50, 'var(--sj-paper-300)', '连坐法 · 严刑', '合法性工具 · 短期有效', { sw: '1.6' })}
${nodeRect('noble', 462, 250, 186, 60, 'var(--sj-vermil)', '旧贵族', '世卿世禄 · 精英抵制', { sw: '3' })}
${nodeBase('base', '编户齐民 · 农战底盘', '承托汲取与动员 · 承受严刑高压', '')}`,
      footer: 'viewBox 820×600 · 军功爵',
    }),
  },

  '27': {
    prefix: 'sj-27',
    prose: '权力几何：文帝/景帝皇权 → 黄老无为纵列 → 轻徭薄赋下行（汲取降阈）→ 编户农业基座修复。诸侯七国之乱为朱批局部震荡，主轴是基座承载力回升而非加征。',
    railSummary: '文景皇权 → 黄老纵列 → 轻徭薄赋降阈；基座修复主轴。',
    legend: '色义：皇权=赭金 · 黄老=青瓷 · 轻徭=赭金下行 · 诸侯=朱红局部震荡 · 底盘=深墨修复。下行箭头＝汲取主动降阈，非「无为」消极。',
    nodeData: {
      huangquan: { name: '文帝 · 景帝', tag: '皇权 · 休养生息', body: '承秦制而反秦暴，以「与民休息」重建绩效合法性。文帝前180、景帝前157即位（《史记·孝文本纪》）。' },
      huanglao: { name: '黄老之治', tag: '纵列 · 政策取向', body: '无为而治并非消极——核心是减轻刑狱、弛扰民间，为基座修复留出空间。' },
      zhuhou: { name: '诸侯 · 豪强', tag: '局部反扑 · 七国之乱', body: '前154 七国之乱是削藩过程中的局部震荡，未逆转基座修复主轴。' },
      qingfu: { name: '轻徭薄赋', tag: '财政降阈 · 下行', body: '田租十五税一→三十税一〔存疑〕，废除肉刑、劝农——汲取力主动降阈，税基广度恢复。' },
      xiaofan: { name: '削藩 · 推恩前奏', tag: '精英再平衡', body: '景帝削藩引发七国之乱，但中央—地方精英再平衡为后续推恩令奠基。' },
      base: { name: '编户齐民 · 农业基座', tag: '慢变量修复', body: '战乱后人口与耕地重新匹配，基座承载力修复——慢变量回升是文景之治的结构实因〔人口峰值存疑〕。' },
      repair: { name: '修复主轴', tag: '汲取降阈 → 基座', body: '崩解后小农经济自我修复 + 官僚制模块化复用的典型样本——超稳定结构「低水平恢复」。' },
    },
    nodeEdge: {
      huangquan: ['spine'], huanglao: ['spine', 'down1'], zhuhou: ['clash', 'rebound'],
      qingfu: ['down1', 'down2'], xiaofan: ['clash'], base: ['down2', 'repair'], repair: ['repair'],
    },
    svg: () => buildSvg({
      title: '文景之治基座修复结构切片图',
      desc: '文帝景帝皇权支撑黄老纵列；轻徭薄赋下行修复编户农业基座；诸侯七国之乱为朱红局部震荡。',
      header: '结构切片 · 基座修复',
      sub: 'SJ-27 · 文景之治 · 步骤①',
      zhupi: '朱批：汲取降阈下行(赭金) + 诸侯局部震荡(朱红) = 上升期修复',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="2.2" marker-end="url(#a-ochre)" opacity="0.95"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-ochre)" stroke-width="2.6" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L410,486" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="clash" d="M462,310 L555,310" stroke="var(--sj-vermil)" stroke-width="2" marker-end="url(#a-vermil)" opacity="0.8"/>
    <path class="sj-edge" data-edge="rebound" d="M555,280 C600,220 600,180 500,158" stroke="var(--sj-vermil)" stroke-width="2.4" stroke-dasharray="5 4" marker-end="url(#a-vermil)" opacity="0.75"/>
    <path class="sj-edge" data-edge="repair" d="M410,520 L410,486" stroke="var(--sj-line)" stroke-width="2" marker-end="url(#a-paper)" opacity="0.7"/>`,
      edgeLabels: `
    <text x="250" y="212" fill="var(--sj-ochre)">与民休息 · 绩效合法性</text>
    <text x="230" y="352" fill="var(--sj-ochre)">三十税一 · 降阈</text>
    <text x="320" y="462" fill="var(--sj-ochre)">基座回填</text>
    <text x="510" y="296" fill="var(--sj-vermil)">前154 七国之乱</text>`,
      nodes: `
${nodeRect('huangquan', 320, 112, 180, 46, 'var(--sj-ochre)', '文帝 · 景帝', '皇权 · 休养生息')}
${nodeRect('huanglao', 130, 250, 176, 60, 'var(--sj-celadon)', '黄老之治', '无为纵列 · 政策取向')}
${nodeRect('zhuhou', 462, 250, 186, 60, 'var(--sj-vermil)', '诸侯 · 豪强', '七国之乱 · 局部反扑')}
${nodeRect('qingfu', 132, 372, 176, 50, 'var(--sj-ochre)', '轻徭薄赋', '三十税一 · 弛刑')}
${nodeRect('xiaofan', 462, 372, 186, 50, 'var(--sj-celadon)', '削藩 · 推恩前奏', '精英再平衡', { sw: '1.8' })}
${nodeBase('base', '编户齐民 · 农业基座', '人口回填 · 承载修复', '')}`,
      footer: 'viewBox 820×600 · 基座修复',
    }),
  },

  '12': {
    prefix: 'sj-12',
    prose: '权力几何：秦二世合法性透支 → 李斯中枢专权 → 郡县汲取/工程过载下行 → 编户底盘越阈。陈胜吴广戍卒起义为引爆点，「王侯将相宁有种乎」夺合法性话语。',
    railSummary: '秦二世透支 → 郡县汲取越阈 → 戍卒起义引爆；前209 陈胜吴广。',
    legend: '色义：皇权=赭金 · 中枢=青瓷 · 郡县汲取=赭金下行 · 起义=朱红引爆 · 底盘=深墨。汲取越阈箭头最重＝崩解主链。',
    nodeData: {
      qin: { name: '秦二世', tag: '合法性透支', body: '统一功绩大但绩效合法性未及沉淀，严刑替代同意，二世即位后政治失控。' },
      lishi: { name: '李斯', tag: '中枢专权', body: '郡县推行与法令统一，但赵高专权后中枢堵塞，改革遗产无法纠偏。' },
      junxian: { name: '郡县汲取 · 工程', tag: '财政枢纽 · 越阈', body: '徭役赋税直达基层，阿房宫、骊山陵等工程加剧负担——汲取越过民变阈值。' },
      chen: { name: '陈胜吴广', tag: '引爆点 · 戍卒起义', body: '前209 大泽乡起义，「王侯将相宁有种乎」夺合法性话语，标示秦制绩效破产。' },
      liuxiang: { name: '刘邦 · 项羽', tag: '精英旁路', body: '旧贵族与庶民武装力量绕过秦制中枢，以军事力重新分配正统。' },
      base: { name: '编户 · 流民', tag: '底盘崩解', body: '严刑峻法下编户承受力崩溃，流民成为起义基础——基座与财政双引燃。' },
      collapse: { name: '崩解链', tag: '汲取越阈 → 起义', body: '汲取越过民变阈值后，合法性叙事无法兜底——秦末崩解是五力共振而非单因。' },
    },
    nodeEdge: {
      qin: ['spine'], lishi: ['spine', 'down1'], junxian: ['down1', 'down2', 'collapse'],
      chen: ['collapse', 'ignite'], liuxiang: ['ignite'], base: ['down2', 'collapse'], collapse: ['collapse'],
    },
    svg: () => buildSvg({
      title: '秦末崩解汲取越阈结构切片图',
      desc: '秦二世中枢虚化，郡县汲取工程过载下行压垮编户底盘；陈胜吴广起义引爆崩解链。',
      header: '结构切片 · 汲取越阈',
      sub: 'SJ-12 · 秦末崩解 · 步骤①',
      zhupi: '朱批：汲取越阈下行(赭金) + 戍卒起义引爆(朱红最重) = 速亡',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="1.4" stroke-dasharray="5 4" marker-end="url(#a-ochre)" opacity="0.8"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-ochre)" stroke-width="2.8" marker-end="url(#a-ochre)" opacity="0.95"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L220,486" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-paper)" opacity="0.9"/>
    <path class="sj-edge" data-edge="collapse" d="M220,498 C180,420 140,360 133,336" stroke="var(--sj-vermil)" stroke-width="3.6" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="ignite" d="M133,336 C200,300 280,280 360,250" stroke="var(--sj-vermil)" stroke-width="2.8" marker-end="url(#a-vermil)" opacity="0.9"/>`,
      edgeLabels: `
    <text x="230" y="352" fill="var(--sj-ochre)">阿房 · 骊山 · 戍役</text>
    <text x="230" y="462" fill="var(--sj-ochre)">汲取越阈</text>
    <text x="150" y="380" fill="var(--sj-vermil)" font-size="12" font-weight="600">前209 大泽乡</text>
    <text x="280" y="268" fill="var(--sj-vermil)">合法性话语夺权</text>`,
      nodes: `
${nodeRect('qin', 320, 112, 180, 46, 'var(--sj-ochre)', '秦二世', '合法性透支', { dash: '4 4', sw: '1.6' })}
${nodeRect('lishi', 130, 250, 176, 60, 'var(--sj-celadon)', '李斯 · 中枢', '专权 · 堵塞')}
${nodeRect('junxian', 132, 372, 176, 50, 'var(--sj-ochre)', '郡县汲取 · 工程', '阿房骊山 · 过载')}
${nodeRect('chen', 52, 280, 162, 72, 'var(--sj-vermil)', '陈胜吴广', '戍卒起义 · 引爆', { sw: '3' })}
${nodeRect('liuxiang', 462, 250, 186, 60, 'var(--sj-vermil)', '刘邦 · 项羽', '军事力重分正统', { sw: '2' })}
${nodeBase('base', '编户 · 流民底盘', '承受力崩溃 · 起义基础', '')}`,
      footer: 'viewBox 820×600 · 秦末崩解',
    }),
  },

  '13': {
    prefix: 'sj-13',
    prose: '权力几何：王莽禅让包装合法性（虚线）→ 儒生官僚 → 王田/币制托古改制下行 → 豪强底盘强烈反弹。篡位污名使改革失去正统支柱，绿林赤眉起而新莽亡。',
    railSummary: '王莽篡位虚轴 → 托古改制 → 豪强反弹；始建国元年。',
    legend: '色义：王莽=赭金虚线（篡位脆弱）· 改制=青瓷 · 豪强=朱红粗回路 · 流民=灰 · 底盘=深墨。虚线竖轴＝篡位合法性先天不足。',
    nodeData: {
      wang: { name: '王莽', tag: '篡位合法性 · 脆弱竖轴', body: '禅让叙事难掩篡汉污名，改革失去正统支柱。始建国元年（9）代汉（《汉书·王莽传》）。' },
      rushi: { name: '儒生官僚', tag: '技术官僚纵列', body: '托古改制的执行层，以儒家乌托邦话语包装财政—土地重整。' },
      reform: { name: '王田 · 币制', tag: '财政工具 · 下行', body: '王田、私属、币制反复等试图重整汲取，执行混乱加剧民怨。' },
      haoqiang: { name: '豪强', tag: '精英抵制 · 死穴', body: '土地兼并利益集团强烈反弹，是改制真正的结构死穴。' },
      min: { name: '编户 · 流民', tag: '底盘引燃', body: '灾荒与改制失败叠加，流民成为绿林赤眉起义基础〔黄河改道系年存疑〕。' },
      green: { name: '绿林赤眉', tag: '崩解引爆', body: '新莽合法性破产后的武装起义，夺「天命」话语。' },
      rebound: { name: '反弹回路', tag: '豪强 → 篡位破产', body: '财政重建触动豪强特权，叠加篡位污名，改革无法获得同意。' },
    },
    nodeEdge: {
      wang: ['spine'], rushi: ['spine', 'down1'], reform: ['down1', 'down2'],
      haoqiang: ['rebound', 'clash'], min: ['down2', 'ignite'], green: ['ignite'], rebound: ['rebound'],
    },
    svg: () => buildSvg({
      title: '王莽改制托古结构切片图',
      desc: '王莽虚线篡位合法性支撑儒生官僚；王田币制下行触动豪强后以朱红回路反弹，流民引爆新莽崩解。',
      header: '结构切片 · 托古改制',
      sub: 'SJ-13 · 王莽改制 · 步骤①',
      zhupi: '朱批：篡位虚轴(虚线) + 豪强反弹(朱红最重) = 新莽速亡',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="1.6" stroke-dasharray="6 5" marker-end="url(#a-ochre)" opacity="0.85"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L410,486" stroke="var(--sj-celadon)" stroke-width="2.2" marker-end="url(#a-paper)" opacity="0.85"/>
    <path class="sj-edge" data-edge="rebound" d="M180,310 C100,280 80,200 310,158" stroke="var(--sj-vermil)" stroke-width="3.6" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="clash" d="M306,286 L462,286" stroke="var(--sj-vermil)" stroke-width="2.4" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path class="sj-edge" data-edge="ignite" d="M620,336 C520,400 450,460 410,486" stroke="var(--sj-vermil)" stroke-width="2.6" marker-end="url(#a-vermil)" opacity="0.85"/>`,
      edgeLabels: `
    <text x="250" y="212" fill="var(--sj-ochre)">禅让包装 · 篡汉污名</text>
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-vermil)">触动豪强土地</text>
    <text x="230" y="352" fill="var(--sj-celadon)">王田币制下行</text>
    <text x="100" y="240" fill="var(--sj-vermil)" font-size="12" font-weight="600">★ 改制死穴</text>`,
      nodes: `
${nodeRect('wang', 320, 112, 180, 46, 'var(--sj-ochre)', '王莽', '禅让合法性', { dash: '5 4', sw: '1.8' })}
${nodeRect('rushi', 130, 250, 176, 60, 'var(--sj-celadon)', '儒生官僚', '托古改制纵列')}
${nodeRect('reform', 132, 372, 176, 50, 'var(--sj-celadon)', '王田 · 币制', '财政工具 · 下行')}
${nodeRect('haoqiang', 462, 250, 186, 60, 'var(--sj-vermil)', '豪强', '土地兼并 · 抵制', { sw: '3' })}
${nodeRect('green', 586, 280, 182, 72, 'var(--sj-vermil)', '绿林赤眉', '起义 · 夺天命', { sw: '2.4' })}
${nodeRect('min', 462, 372, 186, 50, 'var(--sj-paper-300)', '编户 · 流民', '灾荒叠加 · 底盘', { sw: '1.6' })}
${nodeBase('base', '编户齐民底盘', '承受改制混乱与灾荒', '')}`,
      footer: 'viewBox 820×600 · 王莽改制',
    }),
  },

  '14': {
    prefix: 'sj-14',
    prose: '权力几何：慈禧皇权钟摆 → 洋务派技术官僚 → 军工航运电报北洋下行 → 顽固派抵制；外环列强压力与甲午战败（朱红最重）证伪「中体西用」。',
    railSummary: '慈禧钟摆 → 洋务军工 → 甲午证伪；1862 总理衙门。',
    legend: '色义：皇权=赭金 · 洋务派=青瓷 · 军工=赭金 · 列强/甲午=朱红外环 · 底盘=深墨。外环朱红＝体系外变量，甲午为引爆。',
    nodeData: {
      cixi: { name: '慈禧', tag: '皇权 · 钟摆', body: '在顽固派与洋务派之间钟摆，改革缺乏制度化保障，依赖个人权威集合。' },
      yangwu: { name: '洋务派', tag: '技术官僚', body: '奕訢、李鸿章等推动军工航运，同治元年（1862）设总理衙门——个人权威驱动。' },
      wangu: { name: '顽固派', tag: '精英抵制', body: '满汉保守精英抵制制度变革，使洋务停留在器物层。' },
      industry: { name: '军工 · 航运 · 电报', tag: '汲取工具', body: '江南制造局、轮船招商局等官督商办模式，财政与工业汲取的近代形态。' },
      beiyang: { name: '北洋水师', tag: '边疆军事', body: '军事现代化短期见效，但制度未变，未能支撑合法性绩效。' },
      powers: { name: '甲午 · 列强', tag: '体系外压力 · 引爆', body: '1894 甲午战败证伪「只强器物」，引爆维新思潮——体系外变量击穿被动改革。' },
      base: { name: '厘金 · 关税底盘', tag: '财政基座', body: '关税、厘金支撑军工，但汲取未能支撑全面现代化〔工业化程度存疑〕。' },
    },
    nodeEdge: {
      cixi: ['spine'], yangwu: ['spine', 'down1', 'clash'], wangu: ['clash'],
      industry: ['down1', 'down2'], beiyang: ['down2', 'outer'], powers: ['outer', 'collapse'],
      base: ['down2'], collapse: ['collapse'],
    },
    svg: () => buildSvg({
      title: '洋务运动中体西用结构切片图',
      desc: '慈禧背书洋务派推动军工北洋下行；顽固派抵制；外环列强甲午压力引爆崩解链。',
      header: '结构切片 · 中体西用',
      sub: 'SJ-14 · 洋务运动 · 步骤①',
      zhupi: '朱批：器物层改革(青瓷) + 甲午外环引爆(朱红最重) = 被动改革失败',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="1.8" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="clash" d="M306,286 L462,286" stroke="var(--sj-paper-300)" stroke-width="2.2" marker-start="url(#a-paper)" marker-end="url(#a-paper)" opacity="0.85"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L410,486" stroke="var(--sj-ochre)" stroke-width="2.2" marker-end="url(#a-ochre)" opacity="0.85"/>
    <path class="sj-edge" data-edge="outer" d="M586,300 C680,340 700,400 650,460" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="collapse" d="M400,486 C400,420 500,360 586,320" stroke="var(--sj-vermil)" stroke-width="3.6" marker-end="url(#a-vermil)" opacity="0.95"/>`,
      edgeLabels: `
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-paper-300)">顽固派抵制</text>
    <text x="230" y="352" fill="var(--sj-celadon)">官督商办下行</text>
    <text x="680" y="400" fill="var(--sj-vermil)">列强外压</text>
    <text x="520" y="400" fill="var(--sj-vermil)" font-size="12" font-weight="600">1894 甲午证伪</text>`,
      nodes: `
${nodeRect('cixi', 320, 112, 180, 46, 'var(--sj-ochre)', '慈禧 · 皇权', '钟摆 · 无制度保障')}
${nodeRect('yangwu', 130, 250, 176, 60, 'var(--sj-celadon)', '奕訢 · 李鸿章', '洋务派 · 技术官僚')}
${nodeRect('wangu', 462, 250, 186, 60, 'var(--sj-vermil)', '顽固派', '精英抵制 · 中体')}
${nodeRect('industry', 132, 372, 176, 50, 'var(--sj-ochre)', '军工 · 航运', '江南局 · 招商局')}
${nodeRect('beiyang', 462, 372, 186, 50, 'var(--sj-ochre)', '北洋水师', '军事现代化 · 边疆')}
${nodeRect('powers', 586, 256, 182, 88, 'var(--sj-vermil)', '甲午 · 列强', '体系外变量 · 引爆', { sw: '3' })}
${nodeBase('base', '厘金 · 关税底盘', '支撑军工 · 汲取近代化', '')}`,
      footer: 'viewBox 820×600 · 洋务运动',
    }),
  },

  '15': {
    prefix: 'sj-15',
    prose: '权力几何：清廷帝制合法性归零（空壳）→ 各省督抚割据观望 → 革命党/新军武昌首义 → 铁路外债民变引爆。五力共振：财政越阈、军事离心、叙事破产同步。',
    railSummary: '清廷空壳 → 督抚割据 → 武昌首义；1911.10 起义。',
    legend: '色义：清廷=赭金虚线 · 督抚=青瓷 · 革命党/新军=朱红 · 铁路外债=赭金引爆 · 底盘=深墨。帝制合法性归零后军事力决定正统。',
    nodeData: {
      qingting: { name: '清廷 · 空壳', tag: '合法性归零', body: '帝制「天命」叙事破产，清廷中枢无法有效动员。宣统三年（1911）武昌起义后连锁响应。' },
      dufu: { name: '各省督抚', tag: '地方割据 · 观望', body: '地方精英在革命与保皇之间钟摆，军事—财政事实自治。' },
      geming: { name: '革命党 · 新军', tag: '武昌首义', body: '1911 年10 月武昌新军起义，革命叙事取代天命——军事力决定政治正统。' },
      xinjun: { name: '铁路 · 外债', tag: '财政引爆', body: '1911.5 铁路国有化诏引发四川保路运动，抽调湖北新军入川致武昌空虚；与《辛丑条约》赔款叠加，财政枢纽越阈触发起义。' },
      hui: { name: '绅商 · 会党', tag: '精英旁路', body: '绅商与会党提供资金与动员网络，填补帝制合法性真空。' },
      base: { name: '民众底盘', tag: '多元底盘', body: '人口压力与财政负担叠加，但崩解主因是五力共振而非单因〔人口存疑〕。' },
      collapse: { name: '崩解链', tag: '五力共振', body: '1912.2.12 清帝退位终结两千年帝制，但五力再平衡远未完成。' },
    },
    nodeEdge: {
      qingting: ['spine'], dufu: ['spine', 'clash'], geming: ['clash', 'collapse', 'ignite'],
      xinjun: ['down1', 'ignite'], hui: ['down1'], base: ['down2'], collapse: ['collapse'],
    },
    svg: () => buildSvg({
      title: '辛亥革命五力共振结构切片图',
      desc: '清廷空壳虚化，督抚割据与革命党新军对峙；铁路外债引爆，五力共振导致帝制终结。',
      header: '结构切片 · 帝制终结',
      sub: 'SJ-15 · 辛亥革命 · 步骤①',
      zhupi: '朱批：合法性归零(虚) + 武昌首义(朱红) + 外债引爆(赭金) = 崩解显性节点',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#a-ochre)" opacity="0.7"/>
    <path class="sj-edge" data-edge="clash" d="M306,286 L462,286" stroke="var(--sj-vermil)" stroke-width="2.8" marker-start="url(#a-vermil)" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L410,486" stroke="var(--sj-paper-300)" stroke-width="2" marker-end="url(#a-paper)" opacity="0.8"/>
    <path class="sj-edge" data-edge="ignite" d="M220,372 C300,400 380,420 462,310" stroke="var(--sj-vermil)" stroke-width="2.6" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path class="sj-edge" data-edge="collapse" d="M555,310 C500,380 450,440 410,486" stroke="var(--sj-vermil)" stroke-width="3.4" marker-end="url(#a-vermil)" opacity="0.95"/>`,
      edgeLabels: `
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-vermil)">1911.10 武昌首义</text>
    <text x="230" y="352" fill="var(--sj-ochre)">铁路国有化 · 外债</text>
    <text x="480" y="400" fill="var(--sj-vermil)" font-size="12" font-weight="600">1912 清帝退位</text>`,
      nodes: `
${nodeRect('qingting', 320, 112, 180, 46, 'var(--sj-ochre)', '清廷 · 空壳', '帝制合法性归零', { dash: '4 4', sw: '1.4' })}
${nodeRect('dufu', 130, 250, 176, 60, 'var(--sj-celadon)', '各省督抚', '割据 · 观望')}
${nodeRect('geming', 462, 250, 186, 60, 'var(--sj-vermil)', '革命党 · 新军', '武昌首义 · 连锁', { sw: '3' })}
${nodeRect('xinjun', 132, 372, 176, 50, 'var(--sj-ochre)', '铁路 · 外债', '财政引爆 · 民变')}
${nodeRect('hui', 462, 372, 186, 50, 'var(--sj-celadon)', '绅商 · 会党', '精英旁路 · 动员', { sw: '1.8' })}
${nodeBase('base', '绅商 · 会党 · 民众', '多元底盘 · 五力共振', '')}`,
      footer: 'viewBox 820×600 · 辛亥革命',
    }),
  },

  '35': {
    prefix: 'sj-35',
    prose: '权力几何：隋文帝皇权 → 三省六部纵列 → 均田/租庸调下行重建汲取 → 门阀豪强底盘。开皇九年（589）灭陈统一，制度模块化复用为唐奠基；炀帝工程为后续病灶预埋。',
    railSummary: '隋文帝 → 三省六部 → 均田租庸调；581 开皇统一。',
    legend: '色义：皇权=赭金 · 三省=青瓷 · 均田租庸调=赭金下行 · 门阀=朱红抵制 · 底盘=深墨。下行箭头＝分裂后汲取重建。',
    nodeData: {
      huangquan: { name: '隋文帝', tag: '皇权 · 开皇之治', body: '开皇元年（581）隋代周，开皇九年（589）灭陈统一——统一叙事重建合法性（《隋书·高祖纪》）。' },
      zhidu: { name: '三省六部', tag: '官僚纵列 · 制度重建', body: '官僚制模块化复用，为隋唐鼎盛奠定组织底盘。' },
      menfa: { name: '门阀 · 豪强', tag: '精英抵制 · 均田限田', body: '均田限田触动门阀土地利益，但隋初皇权强势压制。' },
      juntian: { name: '均田 · 租庸调', tag: '财政枢纽 · 下行', body: '以人丁为本的租庸调重建税基；均田制保障税源广度——汲取力从分裂期低水平恢复。' },
      keju: { name: '科举雏形', tag: '精英循环', body: '开皇设进士科雏形，打破门阀垄断，但门阀仍强。' },
      base: { name: '编户齐民 · 均田农民', tag: '税基底盘', body: '分裂后人口重新匹配；均田制试图锁定税基〔实施范围存疑〕。' },
      yangdi: { name: '炀帝病灶', tag: '工程过载预埋', body: '大运河、远征等工程为隋二世而亡埋伏笔——上升期扩张越阈风险。' },
    },
    nodeEdge: {
      huangquan: ['spine'], zhidu: ['spine', 'down1'], menfa: ['clash'],
      juntian: ['down1', 'down2'], keju: ['spine', 'clash'], base: ['down2'], yangdi: ['yangdi-risk', 'risk'],
    },
    svg: () => buildSvg({
      title: '隋文帝改革制度重建结构切片图',
      desc: '隋文帝支撑三省六部纵列；均田租庸调下行重建编户税基；门阀抵制与炀帝工程风险预埋。',
      header: '结构切片 · 制度奠基',
      sub: 'SJ-35 · 隋文帝改革 · 步骤①',
      zhupi: '朱批：分裂后重整(青瓷) + 均田下行(赭金) + 炀帝风险(朱红虚线)',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.95"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L410,486" stroke="var(--sj-ochre)" stroke-width="2.6" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="clash" d="M306,286 L462,286" stroke="var(--sj-vermil)" stroke-width="2" marker-end="url(#a-vermil)" opacity="0.8"/>
    <path class="sj-edge" data-edge="risk" d="M500,158 C620,200 680,280 650,360" stroke="var(--sj-vermil)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#a-vermil)" opacity="0.7"/>
    <path class="sj-edge" data-edge="yangdi-risk" d="M650,360 L600,345" stroke="var(--sj-vermil)" stroke-width="1.4" stroke-dasharray="4 4" opacity="0.6"/>`,
      edgeLabels: `
    <text x="250" y="212" fill="var(--sj-ochre)">589 灭陈统一</text>
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-vermil)">门阀抵制</text>
    <text x="230" y="352" fill="var(--sj-celadon)">租庸调下行</text>
    <text x="660" y="280" fill="var(--sj-vermil)">炀帝工程预埋</text>`,
      nodes: `
${nodeRect('huangquan', 320, 112, 180, 46, 'var(--sj-ochre)', '隋文帝', '开皇之治 · 统一')}
${nodeRect('zhidu', 130, 250, 176, 60, 'var(--sj-celadon)', '三省六部', '官僚纵列 · 制度重建')}
${nodeRect('menfa', 462, 250, 186, 60, 'var(--sj-vermil)', '门阀 · 豪强', '均田限田 · 抵制')}
${nodeRect('juntian', 132, 372, 176, 50, 'var(--sj-ochre)', '均田 · 租庸调', '汲取重建 · 下行')}
${nodeRect('keju', 462, 372, 186, 50, 'var(--sj-celadon)', '科举雏形', '精英循环 · 通道', { sw: '1.8' })}
${nodeRect('yangdi', 600, 320, 160, 50, 'var(--sj-vermil)', '炀帝病灶', '工程过载 · 预埋', { dash: '5 4', sw: '1.8' })}
${nodeBase('base', '编户齐民 · 均田农民', '税基底盘 · 人口匹配', '')}`,
      footer: 'viewBox 820×600 · 隋初改革',
    }),
  },

  '38': {
    prefix: 'sj-38',
    prose: '权力几何：唐太宗皇权 → 纳谏/三省纵列 → 均田/府兵下行 → 门阀关陇底盘（未显）。上升期五力协同均衡，朱批为安史节度使预埋。',
    railSummary: '太宗纳谏 → 均田府兵 → 天可汗；627 贞观改元。',
    legend: '色义：皇权=赭金 · 纳谏=青瓷 · 均田府兵=赭金+朱红军事 · 门阀=灰（未显）· 底盘=深墨宽松。五力协同上升，边线为后期风险预埋。',
    nodeData: {
      huangquan: { name: '唐太宗', tag: '皇权 · 纳谏', body: '贞观元年（627）改元，纳谏、平世使绩效合法性充盈（《旧唐书·太宗本纪》）。' },
      najian: { name: '纳谏 · 三省', tag: '精英循环 · 纵列', body: '科举扩大通道，门阀仍强；纳谏使精英循环相对开放。' },
      menfa: { name: '门阀 · 关陇', tag: '后期俘获 · 未显', body: '关陇集团仍强，但贞观期被皇权—官僚纵列压制，后期才俘获中枢。' },
      fubing: { name: '均田 · 府兵', tag: '汲取+军事 · 下行', body: '承隋租庸调，府兵制使军事力可控、不外包——为开元鼎盛奠基。' },
      tiankehan: { name: '天可汗', tag: '合法性叙事', body: '绩效合法性（纳谏、平世）+ 象征（天可汗）双源充盈〔系年存疑〕。' },
      base: { name: '编户齐民 · 均田农民', tag: '基座宽松', body: '隋末战乱后人口回填，基座承载宽松〔贞观人口存疑〕。' },
      risk: { name: '后期预埋', tag: '均田瓦解 · 募兵', body: '均田后期瓦解、府兵转募兵等种子为安史之乱埋伏笔（→ SJ-06）。' },
    },
    nodeEdge: {
      huangquan: ['spine'], najian: ['spine', 'down1'], menfa: ['clash'],
      fubing: ['down1', 'down2', 'military'], tiankehan: ['spine'], base: ['down2'], risk: ['risk'],
    },
    svg: () => buildSvg({
      title: '贞观之治五力协同结构切片图',
      desc: '唐太宗支撑纳谏三省纵列；均田府兵下行；天可汗叙事充盈；后期节度使风险预埋。',
      header: '结构切片 · 五力协同',
      sub: 'SJ-38 · 贞观之治 · 步骤①',
      zhupi: '朱批：五力协同上升(均衡) + 节度使预埋(朱红虚线) = 盛世底盘',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.95"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L410,486" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="clash" d="M306,286 L462,286" stroke="var(--sj-paper-300)" stroke-width="1.6" marker-end="url(#a-paper)" opacity="0.7"/>
    <path class="sj-edge" data-edge="military" d="M220,372 L462,372" stroke="var(--sj-vermil)" stroke-width="2" marker-end="url(#a-vermil)" opacity="0.8"/>
    <path class="sj-edge" data-edge="risk" d="M520,300 C600,360 640,420 600,480" stroke="var(--sj-vermil)" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#a-vermil)" opacity="0.65"/>`,
      edgeLabels: `
    <text x="250" y="212" fill="var(--sj-ochre)">627 贞观改元</text>
    <text x="340" y="366" fill="var(--sj-vermil)">府兵可控 · 不外包</text>
    <text x="230" y="352" fill="var(--sj-celadon)">均田承续</text>
    <text x="620" y="420" fill="var(--sj-vermil)">募兵预埋 → SJ-06</text>`,
      nodes: `
${nodeRect('huangquan', 320, 112, 180, 46, 'var(--sj-ochre)', '唐太宗', '纳谏 · 天可汗')}
${nodeRect('najian', 130, 250, 176, 60, 'var(--sj-celadon)', '纳谏 · 三省', '精英循环 · 纵列')}
${nodeRect('menfa', 462, 250, 186, 60, 'var(--sj-paper-300)', '门阀 · 关陇', '后期俘获 · 未显', { sw: '1.6' })}
${nodeRect('fubing', 132, 372, 176, 50, 'var(--sj-ochre)', '均田 · 府兵', '汲取可控 · 军事')}
${nodeRect('tiankehan', 462, 372, 186, 50, 'var(--sj-paper-100)', '天可汗叙事', '合法性双源 · 充盈', { sw: '1.8', fill: 'var(--sj-ink-800)' })}
${nodeBase('base', '编户齐民 · 均田农民', '基座承载宽松 · 人口回填', '')}`,
      footer: 'viewBox 820×600 · 贞观之治',
    }),
  },

  '39': {
    prefix: 'sj-39',
    prose: '权力几何：德宗皇权背书 → 杨炎两税法纵列 → 夏税秋粮按资产征调下行 → 藩镇截留（朱红最重）。建中元年（780）税基从人丁转向资产，是僵化期汲取力修复窗口。',
    railSummary: '德宗背书 → 杨炎两税法 → 藩镇截留；780 建中改税。',
    legend: '色义：皇权=赭金 · 杨炎=青瓷 · 两税下行=赭金 · 藩镇=朱红截留 · 底盘=深墨。藩镇截留回路最重＝执行阻力。',
    nodeData: {
      huangquan: { name: '德宗', tag: '皇权 · 改革背书', body: '建中元年（780）杨炎奏两税法，皇权背书税基重整（《旧唐书·杨炎传》）。' },
      liangshui: { name: '杨炎 · 两税法', tag: '技术官僚 · 税基重整', body: '按资产与土产分夏税秋粮征调，不问户籍人丁——汲取力结构性重整。' },
      fanzhen: { name: '藩镇 · 豪强', tag: '截留 · 抵制', body: '藩镇截留两税，中央汲取力被分割——军事力与财政耦合并轨。' },
      xiashang: { name: '夏税 · 秋粮', tag: '下行征调', body: '税基从「人」转向「地+财」，适应均田瓦解后的基座变迁。' },
      xuli: { name: '转运使 · 胥吏', tag: '执行层', body: '两税执行中仍有加派，杨炎后被贬——精英循环内耗。' },
      base: { name: '编户 · 地主 · 商人', tag: '新税基底盘', body: '安史乱后户籍流散，旧均田基座瓦解——两税法是对基座变迁的适应〔人口存疑〕。' },
      rebound: { name: '截留回路', tag: '藩镇 → 中央汲取分割', body: '藩镇军事—财政合一，使中央汲取力结构性衰减——两税法未能突破「分割」母结构。' },
    },
    nodeEdge: {
      huangquan: ['spine'], liangshui: ['spine', 'down1', 'clash'], fanzhen: ['clash', 'rebound'],
      xiashang: ['down1', 'down2'], xuli: ['down2'], base: ['down2', 'rebound'], rebound: ['rebound'],
    },
    svg: () => buildSvg({
      title: '两税法税基重整结构切片图',
      desc: '德宗背书杨炎两税法；夏税秋粮下行；藩镇截留以朱红回路分割中央汲取。',
      header: '结构切片 · 税基重整',
      sub: 'SJ-39 · 两税法 · 步骤①',
      zhupi: '朱批：税基重整(赭金) + 藩镇截留(朱红最重) = 僵化期修复窗口',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="2" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L410,486" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="clash" d="M306,286 L462,286" stroke="var(--sj-vermil)" stroke-width="2.8" marker-start="url(#a-vermil)" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="rebound" d="M640,498 C724,452 716,340 588,320" stroke="var(--sj-vermil)" stroke-width="3.6" marker-end="url(#a-vermil)" opacity="0.95"/>`,
      edgeLabels: `
    <text x="250" y="212" fill="var(--sj-ochre)">780 建中改税</text>
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-vermil)">藩镇截留两税</text>
    <text x="230" y="352" fill="var(--sj-celadon)">夏税秋粮下行</text>
    <text x="700" y="360" text-anchor="end" fill="var(--sj-vermil)" font-size="12" font-weight="600">★ 汲取分割</text>`,
      nodes: `
${nodeRect('huangquan', 320, 112, 180, 46, 'var(--sj-ochre)', '德宗', '改革背书')}
${nodeRect('liangshui', 130, 250, 176, 60, 'var(--sj-celadon)', '杨炎 · 两税法', '税基重整 · 纵列')}
${nodeRect('fanzhen', 462, 250, 186, 60, 'var(--sj-vermil)', '藩镇 · 豪强', '截留 · 抵制', { sw: '3' })}
${nodeRect('xiashang', 132, 372, 176, 50, 'var(--sj-ochre)', '夏税 · 秋粮', '按资产征调 · 下行')}
${nodeRect('xuli', 462, 372, 186, 50, 'var(--sj-paper-300)', '转运使 · 胥吏', '执行层 · 加派', { sw: '1.6' })}
${nodeBase('base', '编户 · 地主 · 商人', '新税基底盘 · 均田瓦解后', '')}`,
      footer: 'viewBox 820×600 · 两税法',
    }),
  },

  '41': {
    prefix: 'sj-41',
    prose: '权力几何：徽钦二帝（空）→ 蔡京/童贯纵列 → 禁军虚线（重文抑武）→ 联金灭辽外交误判。军事力不足（朱红最重）使开封无可靠防务，1127 靖康之变终结北宋。',
    railSummary: '徽宗钦宗空轴 → 禁军虚弱 → 联金误判；1127 靖康。',
    legend: '色义：皇权=赭金虚线 · 蔡童=青瓷 · 禁军=灰虚线 · 联金/金军=朱红最重 · 底盘=深墨。禁军虚线＝重文抑武结构性弱点。',
    nodeData: {
      huangquan: { name: '徽宗 · 钦宗', tag: '皇权 · 空壳', body: '联金灭辽外交策略失误，皇权中枢无法有效应对军事危机。' },
      cai: { name: '蔡京 · 童贯', tag: '中枢纵列', body: '花石纲、联金外交等政策消耗民力与军事信任。' },
      jinjun: { name: '禁军 · 两京', tag: '军事虚弱 · 重文抑武', body: '北宋重文抑武，禁军战斗力不足，开封防务不可靠。' },
      lianjin: { name: '联金灭辽', tag: '外交误判', body: '海上之盟联金灭辽（1125 辽亡）收复燕云，却养大金国威胁——战略误判，与 SJ-24 误判链同型：以短期收益忽略结构性风险。' },
      jin: { name: '金军 · 完颜', tag: '边疆军事 · 外压', body: '1126 金军两次南下，1127 靖康之变徽钦二帝被俘、汴京陷落，北宋灭亡——误判兑现为亡国代价。' },
      base: { name: '汴京 · 漕运底盘', tag: '财政—军事耦合', body: '漕运支撑汴京，但军事力不足使财政枢纽无防务保障。' },
      collapse: { name: '崩解链', tag: '军事力不足 → 亡国', body: '靖康之耻是军事力不足与外交误判共振，非单一昏君叙事。' },
    },
    nodeEdge: {
      huangquan: ['spine'], cai: ['spine', 'down1'], jinjun: ['down1', 'weak'],
      lianjin: ['mistake', 'collapse'], jin: ['collapse', 'outer'], base: ['down2'], collapse: ['collapse'],
    },
    svg: () => buildSvg({
      title: '靖康之耻军事虚弱结构切片图',
      desc: '徽钦皇权虚化，蔡童纵列；禁军虚弱；联金外交误判后金军攻破汴京。',
      header: '结构切片 · 军事虚弱',
      sub: 'SJ-41 · 靖康之耻 · 步骤①',
      zhupi: '朱批：禁军虚弱(虚线) + 联金误判(赭金) + 金军破城(朱红最重)',
      edges: `
    <rect x="300" y="106" width="220" height="360" rx="10" fill="none" stroke="var(--sj-line)" stroke-width="1" stroke-dasharray="3 4" opacity="0.7"/>
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#a-ochre)" opacity="0.75"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-celadon)" stroke-width="2" marker-end="url(#a-celadon)" opacity="0.85"/>
    <path class="sj-edge" data-edge="weak" d="M360,280 L410,318" stroke="var(--sj-paper-300)" stroke-width="1.4" stroke-dasharray="4 4" marker-end="url(#a-paper)" opacity="0.7"/>
    <path class="sj-edge" data-edge="mistake" d="M306,286 L462,286" stroke="var(--sj-ochre)" stroke-width="2.2" marker-end="url(#a-ochre)" opacity="0.85"/>
    <path class="sj-edge" data-edge="collapse" d="M586,320 C520,360 470,400 452,332" stroke="var(--sj-vermil)" stroke-width="3.6" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="outer" d="M520,318 L586,318" stroke="var(--sj-vermil)" stroke-width="2.8" marker-end="url(#a-vermil)" opacity="0.9"/>`,
      edgeLabels: `
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-ochre)">1125 联金灭辽 · 误判</text>
    <text x="556" y="372" text-anchor="end" fill="var(--sj-vermil)" font-size="12" font-weight="600">1127 靖康 · 二帝北狩</text>
    <text x="410" y="486" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10">中央 · 重文抑武</text>`,
      nodes: `
${nodeRect('huangquan', 316, 118, 188, 46, 'var(--sj-ochre)', '徽宗 · 钦宗', '皇权 · 空壳', { dash: '4 4', sw: '1.4' })}
${nodeRect('cai', 130, 250, 176, 60, 'var(--sj-celadon)', '蔡京 · 童贯', '中枢纵列 · 花石纲')}
${nodeCircle('jinjun', 410, 318, 34, 'var(--sj-paper-300)', '禁军 · 两京', '虚弱 · 无防务')}
${nodeRect('lianjin', 462, 250, 186, 60, 'var(--sj-ochre)', '联金灭辽', '外交误判 · 养大金')}
${nodeRect('jin', 586, 256, 182, 88, 'var(--sj-vermil)', '金军 · 完颜', '1127 破汴京 · 亡国', { sw: '3' })}
${nodeBase('base', '汴京 · 漕运底盘', '财政枢纽 · 无军事保障', '')}`,
      footer: 'viewBox 820×600 · 靖康之耻',
    }),
  },

  '49': {
    prefix: 'sj-49',
    prose: '权力几何：康雍乾皇权峰值 → 摊丁入亩/改土归流纵列 → 文字狱/旗籍精英俘获 → 人口压力基座逼近上限。鼎盛期隐性拐点：五力峰值与结构失修同步。',
    railSummary: '康乾峰值 → 摊丁入亩 → 人口拐点预埋；乾隆鼎盛。',
    legend: '色义：皇权=赭金 · 摊丁入亩=赭金下行 · 文字狱=青瓷俘获 · 人口=朱红慢变量 · 底盘=深墨。人口压力朱批＝隐性拐点，非盛世安全。',
    nodeData: {
      huangquan: { name: '康雍乾', tag: '皇权 · 峰值', body: '康乾盛世绩效与象征合法性达传统峰值，疆域扩张至极限。' },
      tanding: { name: '摊丁入亩 · 改土归流', tag: '财政—军事枢纽', body: '雍正摊丁入亩使汲取力达峰值；改土归流整合西南——数目字管理达传统天花板。' },
      wenzi: { name: '文字狱 · 旗籍', tag: '精英俘获', body: '文字狱使精英俘获萌芽；旗籍通道与科举并行但固化。' },
      shengshi: { name: '「盛世」叙事', tag: '合法性通胀', body: '四库全书、南巡等象征通胀开始积累——鼎盛期隐性拐点。' },
      renkou: { name: '人口压力', tag: '基座慢变量 · 拐点', body: '人口逼近承载上限〔学界估计 3–4 亿，存疑〕——慢变量与快变量峰值叠合。' },
      bianjiang: { name: '准噶尔 · 伊犁', tag: '边疆军事峰值', body: '军事力扩张至峰值，但维持成本高昂，为嘉道衰变埋伏笔。' },
      base: { name: '编户 · 农业基座', tag: '承载逼近上限', body: '摊丁入亩后税基广度达峰，但基座慢变量已逼近天花板。' },
      turning: { name: '隐性拐点', tag: '峰值叠合 · 失修', body: '超稳定结构在峰值时已开始失修——盛世是最危险相位（→ SJ-14 洋务下游）。' },
    },
    nodeEdge: {
      huangquan: ['spine'], tanding: ['spine', 'down1'], wenzi: ['clash'],
      shengshi: ['spine'], renkou: ['slow', 'turning'], bianjiang: ['military', 'down2'],
      base: ['down2', 'slow'], turning: ['turning', 'slow'],
    },
    svg: () => buildSvg({
      title: '康乾拐点隐性峰值结构切片图',
      desc: '康雍乾皇权峰值支撑摊丁入亩改土归流；文字狱精英俘获；人口压力慢变量逼近上限标示隐性拐点。',
      header: '结构切片 · 隐性拐点',
      sub: 'SJ-49 · 康乾盛世 · 步骤①',
      zhupi: '朱批：汲取峰值(赭金) + 人口慢变量(朱红) + 合法性通胀 = 鼎盛隐性拐点',
      edges: `
    <path class="sj-edge" data-edge="spine" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="2.6" marker-end="url(#a-ochre)" opacity="0.95"/>
    <path class="sj-edge" data-edge="down1" d="M220,310 L220,372" stroke="var(--sj-ochre)" stroke-width="2.8" marker-end="url(#a-ochre)" opacity="0.95"/>
    <path class="sj-edge" data-edge="down2" d="M220,422 L410,486" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="clash" d="M306,286 L462,286" stroke="var(--sj-celadon)" stroke-width="2" marker-end="url(#a-celadon)" opacity="0.85"/>
    <path class="sj-edge" data-edge="military" d="M220,372 L586,300" stroke="var(--sj-vermil)" stroke-width="2.2" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path class="sj-edge" data-edge="slow" d="M640,498 C724,452 716,340 588,320" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="turning" d="M410,520 L410,486" stroke="var(--sj-vermil)" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#a-vermil)" opacity="0.75"/>`,
      edgeLabels: `
    <text x="250" y="212" fill="var(--sj-ochre)">摊丁入亩 · 汲取峰值</text>
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-celadon)">文字狱 · 精英俘获</text>
    <text x="700" y="360" text-anchor="end" fill="var(--sj-vermil)" font-size="12" font-weight="600">人口 3–4 亿〔存疑〕</text>
    <text x="700" y="378" text-anchor="end" fill="var(--sj-vermil)">★ 隐性拐点</text>
    <circle cx="708" cy="392" r="5" fill="none" stroke="var(--sj-vermil)" stroke-width="1.4"/>`,
      nodes: `
${nodeRect('huangquan', 320, 112, 180, 46, 'var(--sj-ochre)', '康雍乾', '皇权 · 峰值', { sw: '2.8' })}
${nodeRect('tanding', 130, 250, 176, 60, 'var(--sj-ochre)', '摊丁入亩', '改土归流 · 汲取峰值')}
${nodeRect('wenzi', 462, 250, 186, 60, 'var(--sj-celadon)', '文字狱 · 旗籍', '精英俘获 · 固化')}
${nodeRect('shengshi', 132, 372, 176, 50, 'var(--sj-paper-100)', '「盛世」叙事', '合法性通胀 · 南巡', { sw: '1.8' })}
${nodeRect('bianjiang', 586, 256, 182, 72, 'var(--sj-vermil)', '准噶尔 · 伊犁', '边疆峰值 · 高成本', { sw: '2.4' })}
${nodeRect('renkou', 462, 372, 186, 50, 'var(--sj-vermil)', '人口压力', '慢变量 · 拐点预埋', { sw: '2.4' })}
${nodeBase('base', '编户 · 农业基座', '承载逼近上限 · 数目字峰值', '')}`,
      footer: 'viewBox 820×600 · 康乾拐点',
    }),
  },
};
