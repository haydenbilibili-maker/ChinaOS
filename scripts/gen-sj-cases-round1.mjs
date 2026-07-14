#!/usr/bin/env node
/**
 * Round 1 · 生成 SJ-11~14 案例卷 HTML（自足单文件，七字段台账）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../app/public/shijian');

function extractCss(prefix) {
  const raw = fs.readFileSync(path.join(OUT, 'SJ-09.html'), 'utf8')
    .match(/<style>[\s\S]*?<\/style>/)[0];
  return raw.replace(/sj-09/g, `sj-${prefix}`);
}

const THEME_SCRIPT = fs.readFileSync(path.join(OUT, 'SJ-09.html'), 'utf8')
  .match(/<script>\s*\(function\(\)\{[\s\S]*?c2os-sj-theme[\s\S]*?\}\)\(\);\s*<\/script>/)[0];

const RAIL_TOC_SCRIPT = `
  (function(){
    var links=document.querySelectorAll('.sj-rail-toc a[href^="#"]');
    if(!links.length) return;
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          links.forEach(function(a){a.classList.toggle('is-active',a.getAttribute('href')==='#'+e.target.id);});
        }
      });
    },{rootMargin:'-20% 0px -60% 0px',threshold:0});
    links.forEach(function(a){
      var t=document.querySelector(a.getAttribute('href'));
      if(t) obs.observe(t);
    });
  })();`;

function shell(c) {
  const p = c.prefix;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${c.id} · ${c.title}</title>
<meta name="description" content="${c.desc}"/>
${extractCss(p)}
${THEME_SCRIPT}
</head>
<body>
<div class="sj-${p}-wrap sj-reveal-stagger" id="sj-${p}-top">
<header class="sj-${p}-mast">
  <div>
    <div class="badge">${c.badge}</div>
    <h1>${c.h1}<em>${c.sub}</em></h1>
    <div class="sj-${p}-chips sj-xlinks">${c.chips}</div>
  </div>
  <div class="sj-${p}-meta">${c.meta}<br/><b>AS_OF 2026-07-15</b> · v0.1</div>
</header>
<p class="sj-zhupi">${c.zhupi}</p>
<article class="sj-ledger">
<div class="sj-page-layout">
<div class="sj-main-col">
<section class="sj-ledger-field" id="f1" aria-labelledby="h-f1">
  <div class="sj-ledger-fh"><span class="fnum">01</span><h2 id="h-f1">一句话拐点</h2><span class="en">HOOK</span></div>
  <div class="sj-${p}-hook"><p>${c.hook}</p><div class="yr">${c.yr}</div></div>
</section>
<section class="sj-ledger-field" id="f2" aria-labelledby="h-f2">
  <div class="sj-ledger-fh"><span class="fnum">02</span><h2 id="h-f2">结构切片</h2><span class="en">SLICE · 步骤①</span></div>
  <p class="sj-${p}-prose">${c.sliceProse}</p>
  <div class="sj-${p}-stage" id="stage">${c.svg}</div>
  <div class="sj-${p}-layout">
    <div class="sj-${p}-note" style="margin-top:0">${c.sliceNote}</div>
    <aside class="sj-${p}-aside" id="aside" aria-live="polite">
      <div id="aside-empty" class="sj-${p}-aside-empty">点选切片节点查看角色说明。</div>
      <div id="aside-body" hidden>
        <div class="k" id="aside-tag">—</div>
        <h3 id="aside-name">—</h3>
        <p id="aside-text">—</p>
      </div>
    </aside>
  </div>
</section>
</div>
<aside class="sj-rail" aria-label="台账导航侧栏">
  <div class="sj-rail-card">
    <div class="k">史鉴台账 · 七字段</div>
    <h3>本案导航</h3>
    <nav class="sj-rail-toc" aria-label="台账字段">
      <a href="#f1">01 · 一句话拐点</a>
      <a href="#f2">02 · 结构切片</a>
      <a href="#f3">03 · 相位定位</a>
      <a href="#f4">04 · 五力归因</a>
      <a href="#f5">05 · 史家交锋</a>
      <a href="#f6">06 · 成败判定</a>
      <a href="#f7">07 · 古今映射</a>
    </nav>
  </div>
  <div class="sj-rail-chips">${c.railChips}</div>
</aside>
</div>
<section class="sj-ledger-field" id="f3" aria-labelledby="h-f3">
  <div class="sj-ledger-fh"><span class="fnum">03</span><h2 id="h-f3">相位定位</h2><span class="en">PHASE · 步骤②</span></div>
  <div class="sj-${p}-phase"><span class="pb">${c.phase}</span><a class="sj-${p}-chip" href="./SJ-04.html">在 SJ-04 相位盘定位 →</a></div>
  <p class="sj-${p}-prose">${c.phaseProse}</p>
</section>
<section class="sj-ledger-field" id="f4" aria-labelledby="h-f4">
  <div class="sj-ledger-fh"><span class="fnum">04</span><h2 id="h-f4">五力归因台账</h2><span class="en">FORCES · 步骤③</span></div>
  <div class="sj-${p}-table-wrap"><table class="sj-${p}-table"><thead><tr><th>力</th><th>正史归因</th><th>结构实因</th></tr></thead><tbody>${c.forces}</tbody></table></div>
</section>
<section class="sj-ledger-field" id="f5" aria-labelledby="h-f5">
  <div class="sj-ledger-fh"><span class="fnum">05</span><h2 id="h-f5">史家交锋</h2><span class="en">HISTORIANS</span></div>
  <div class="sj-${p}-hist">${c.hist}</div>
</section>
<section class="sj-ledger-field" id="f6" aria-labelledby="h-f6">
  <div class="sj-ledger-fh"><span class="fnum">06</span><h2 id="h-f6">成败判定</h2><span class="en">VERDICT</span></div>
  <div class="sj-${p}-verdict">${c.verdict}</div>
</section>
<section class="sj-ledger-field" id="f7" aria-labelledby="h-f7">
  <div class="sj-ledger-fh"><span class="fnum">07</span><h2 id="h-f7">古今映射</h2><span class="en">MIRROR</span></div>
  <div class="sj-${p}-mirror">${c.mirror}</div>
</section>
</article>
<section class="sj-ledger-field" id="fx"><div class="sj-ledger-fh"><span class="fnum">◆</span><h2>交叉引用</h2></div>
  <div class="sj-${p}-xref">${c.xref}</div>
</section>
<footer class="sj-${p}-foot">
  <span>ChinaOS · 史鉴 ${c.id} · v0.1 · AS_OF 2026-07-15 · ${c.source}</span>
  <span><a href="./SJ-00.html">← 返回 SJ-00</a> · <a href="#sj-${p}-top">↑ 顶</a></span>
  <span>${c.footerNext}</span>
</footer>
</div>
<script>
(function(){
  const stage=document.getElementById('stage');
  if(!stage) return;
  const nodes=Array.from(stage.querySelectorAll('.sj-node'));
  const NODE_DATA=${c.nodeData};
  const asideEmpty=document.getElementById('aside-empty');
  const asideBody=document.getElementById('aside-body');
  function showAside(id){
    const d=NODE_DATA[id]; if(!d) return;
    asideEmpty.hidden=true; asideBody.hidden=false;
    document.getElementById('aside-tag').textContent=d.tag;
    document.getElementById('aside-name').textContent=d.name;
    document.getElementById('aside-text').textContent=d.body;
  }
  nodes.forEach(n=>{
    const act=()=>{ nodes.forEach(x=>x.classList.remove('is-hot')); n.classList.add('is-hot'); showAside(n.dataset.id); };
    n.addEventListener('click',act);
    n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});
  });
})();
${RAIL_TOC_SCRIPT}
</script>
</body>
</html>`;
}

const svgBase = (title, nodes) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" role="img" aria-label="${title}">
  <rect width="800" height="520" fill="var(--sj-ink-900)"/>
  <text x="48" y="48" fill="var(--sj-ochre)" font-size="11" font-family="ui-monospace,monospace">${title}</text>
  ${nodes}
</svg>`;

const CASES = [
  {
    id: 'SJ-11', prefix: '11', file: 'SJ-11.html',
    title: '商鞅变法', desc: 'ChinaOS 史鉴变法卷先秦案：商鞅变法——军功爵与编户齐民重塑秦国。',
    badge: 'SJ-11 · 变法改革案例卷 · 先秦案',
    h1: '商鞅变法', sub: '军功爵 · 编户齐民 · 废世卿世禄',
    chips: `<a class="sj-11-chip" href="./SJ-00.html">↔ SJ-00</a><a class="sj-11-chip" href="./SJ-12.html">↔ SJ-12 秦末</a><a class="sj-11-chip" href="./SJ-05.html">↔ SJ-05 王安石</a>`,
    meta: '战国秦国制度奠基 · 竞争态跃迁',
    zhupi: '朱批：本案是先秦「上升期制度奠基」而非僵化期修补——以《史记·商君列传》为口径，与 SJ-05/09 构成跨时代变法谱系。七字段台账复用冻结组件。',
    hook: '列国竞争压力下，秦孝公任用商鞅推行<b>军功爵</b>、<b>编户齐民</b>、废井田开阡陌，摧毁世卿世禄，把秦国改造成高动员的战争—农业国家，为统一奠基；然严刑峻法、触动旧贵族，孝公身后遭反扑，秦政残暴化亦埋秦末速亡之种。',
    yr: '系年：前356 第一次变法 · 前350 迁都咸阳、第二次变法（《史记·商君列传》）',
    sliceProse: '权力几何：秦孝公皇权背书 → 商鞅技术官僚纵列 → 县制/军功爵/连坐法下行汲取 → 旧贵族底盘。朱红反弹回路标示变法死穴——触动世卿世禄。',
    sliceNote: '色义：皇权=赭金；商鞅新法=青瓷；旧贵族反弹=朱红粗回路（视觉最重）。',
    svg: svgBase('SJ-11 · 权力几何 · 军功爵纵列', `
  <g class="sj-node" data-id="duke" tabindex="0" role="button"><rect x="310" y="60" width="180" height="44" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="1.6"/><text x="400" y="88" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-family="serif">秦孝公 · 皇权背书</text></g>
  <g class="sj-node" data-id="shang" tabindex="0" role="button"><rect x="280" y="150" width="240" height="56" rx="8" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="2.2"/><text x="400" y="182" text-anchor="middle" fill="var(--sj-celadon)" font-size="15" font-family="serif">商鞅 · 县制军功爵</text></g>
  <g class="sj-node" data-id="noble" tabindex="0" role="button"><rect x="80" y="280" width="200" height="52" rx="8" fill="#2a1a16" stroke="var(--sj-vermil)" stroke-width="2.8"/><text x="180" y="312" text-anchor="middle" fill="var(--sj-vermil)" font-size="14" font-family="serif">旧贵族 · 世卿世禄</text></g>
  <g class="sj-node" data-id="base" tabindex="0" role="button"><rect x="520" y="280" width="200" height="52" rx="8" fill="var(--sj-ink-800)" stroke="var(--sj-paper-300)" stroke-width="1.4"/><text x="620" y="312" text-anchor="middle" fill="var(--sj-paper-100)" font-size="14" font-family="serif">编户齐民 · 农战底盘</text></g>
  <path d="M400,104 L400,150" stroke="var(--sj-ochre)" stroke-width="1.4" stroke-dasharray="4 4"/>
  <path d="M400,206 L180,280" stroke="var(--sj-vermil)" stroke-width="3" marker-end="url(#none)"/>
  <text x="260" y="250" fill="var(--sj-vermil)" font-size="12" font-family="serif">触动特权 → 反弹</text>`),
    railChips: `<a class="sj-rail-chip" href="./SJ-05.html">SJ-05</a><a class="sj-rail-chip" href="./SJ-12.html">SJ-12</a>`,
    phase: '上升期 · <b>制度奠基窗口</b>',
    phaseProse: '战国竞争态下的制度跃迁，非僵化期修补。秦国由弱转强，五力中财政汲取与军事动员同步强化，精英循环被军功爵打开但旧贵族遭摧毁性打击。',
    forces: `<tr><td>财政汲取</td><td>「苛政」「重农」</td><td class="shi">废井田、统一度量衡、县制直控编户，汲取与动员合一</td></tr>
<tr><td>精英循环</td><td>「刑过于德」</td><td class="shi">军功爵打开上升通道，世卿世禄遭摧毁——变法真正触及的利益结构</td></tr>
<tr><td>合法性叙事</td><td>「霸道」</td><td class="shi">法家富国强兵叙事取代周礼贵族秩序，孝公在世时合法性充足</td></tr>
<tr><td>边疆军事</td><td>「耕战」</td><td class="shi">农战体制直接服务兼并战争，军事力与汲取同步强化</td></tr>
<tr><td>生态—人口基座</td><td>—</td><td class="shi">关中农业基座+水利；〔人口具体数字存疑〕</td></tr>`,
    hist: `<article><div class="who">李敖式考据</div><p>剥离「暴秦」道德叙事——商鞅变法是先秦制度竞争的结构选择，非单纯暴君意志。</p></article>
<article><div class="who">钱穆</div><p>《国史大纲》对秦制批评与对其统一贡献并存；强调变法对贵族秩序的破坏。</p></article>
<article><div class="who">金观涛</div><p>秦国完成了一次「操作系统」级制度跃迁，为后世郡县制奠基；但仍未突破低水平均衡天花板。</p></article>
<article><div class="who">黄仁宇</div><p>秦制缺乏数目字管理的精细会计，以严刑弥补组织不足——统一后迅速透支。</p></article>
<article style="grid-column:1/-1"><div class="who">西方汉学</div><p>Legalism studies：商鞅改革是「国家建构」(state-building) 经典案例，军功爵是可计量的激励接口。</p></article>`,
    verdict: `<article class="ok"><div class="vh">已兑现</div><p>秦国由弱转强</p><p>统一六国制度奠基</p><p>军功爵通道打开</p></article>
<article class="fail"><div class="vh">已失败</div><p>商鞅车裂</p><p>严刑峻法残暴化</p><p>旧贵族反扑埋秦末隐患</p></article>
<article class="open"><div class="vh">未决〔反事实〕</div><p>若统一后收敛汲取、沉淀合法性，能否避免二世而亡？</p></article>`,
    mirror: `<article class="same"><div class="mh">相似机制</div><p>自上而下制度重塑 vs 既得利益抵制；改革依赖最高权力个人背书。</p></article>
<article class="diff"><div class="mh">关键差异</div><p>现代法治边界、组织穿透与数目字管理已质变；但「改革触动精英特权」张力同构（→ SJ-20）。</p></article>`,
    xref: `<a href="./SJ-12.html"><div class="n">SJ-12</div><h3>秦末崩解</h3><p>变法遗产与速亡的对照链。</p></a>
<a href="./SJ-05.html"><div class="n">SJ-05</div><h3>王安石变法</h3><p>跨时代变法谱系对照。</p></a>
<a href="./SJ-03.html"><div class="n">SJ-03</div><h3>五力模型</h3><p>本案病灶在汲取与精英。</p></a>`,
    footerNext: `<a href="./SJ-12.html">下一案 SJ-12 →</a>`,
    source: '真源《史记·商君列传》+ 母本规律⑤',
    nodeData: JSON.stringify({
      duke: { name: '秦孝公', tag: '合法性支柱', body: '变法依赖孝公个人权威；在其生前商鞅得以推行全套新法。' },
      shang: { name: '商鞅', tag: '技术官僚', body: '军功爵、县制、连坐法——把秦国改造成战争—农业国家。' },
      noble: { name: '旧贵族', tag: '精英抵制', body: '世卿世禄遭摧毁，形成强烈反弹；孝公后商鞅车裂。' },
      base: { name: '编户齐民', tag: '汲取底盘', body: '农战体制下的税收与兵役来源，承受严刑峻法的高压。' },
    }),
  },
  {
    id: 'SJ-12', prefix: '12', file: 'SJ-12.html',
    title: '秦末崩解', desc: 'ChinaOS 史鉴崩解卷秦案：秦末陈胜吴广起义与二世而亡。',
    badge: 'SJ-12 · 崩解案例卷 · 秦案',
    h1: '秦末崩解', sub: '合法性未立 · 汲取无度 · 二世而亡',
    chips: `<a class="sj-12-chip" href="./SJ-00.html">↔ SJ-00</a><a class="sj-12-chip" href="./SJ-11.html">↔ SJ-11 商鞅</a><a class="sj-12-chip" href="./SJ-07.html">↔ SJ-07 矩阵</a>`,
    meta: 'SJ-07 秦行单案深描',
    zhupi: '朱批：本案是 SJ-07 崩解矩阵「秦」行之单案深描——统一后合法性未及沉淀，汲取无度即崩，印证母本规律②多力共振（共振最浅最速例）。',
    hook: '秦灭六国后军事强、制度新，但<b>开国合法性未及沉淀</b>；修阿房、戍边、严刑峻法使汲取越过民变阈值，前209 陈胜吴广揭竿，<b>二世而亡</b>——传统循环中最速崩解样本。',
    yr: '系年：前209 大泽乡起义 · 前207 秦王子婴降刘邦（《史记·陈涉世家》）',
    sliceProse: '权力几何：秦始皇纵轴透支合法性 → 李斯中枢 → 郡县汲取直达戍卒/编户；缺少精英缓冲与绩效合法性，严刑不能替代同意。',
    sliceNote: '色义：汲取下行箭头=赭金；戍卒起义=朱红引爆点（视觉最重）。',
    svg: svgBase('SJ-12 · 秦末权力几何 · 汲取越阈', `
  <g class="sj-node" data-id="qin" tabindex="0" role="button"><rect x="300" y="50" width="200" height="48" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="1.4"/><text x="400" y="80" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-family="serif">秦始皇 · 合法性透支</text></g>
  <g class="sj-node" data-id="lishi" tabindex="0" role="button"><rect x="310" y="130" width="180" height="44" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="1.6"/><text x="400" y="158" text-anchor="middle" fill="var(--sj-celadon)" font-size="14" font-family="serif">李斯 · 中枢</text></g>
  <g class="sj-node" data-id="junxian" tabindex="0" role="button"><rect x="280" y="220" width="240" height="48" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="2"/><text x="400" y="250" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-family="serif">郡县 · 徭役赋税</text></g>
  <g class="sj-node" data-id="chen" tabindex="0" role="button"><rect x="260" y="340" width="280" height="56" rx="8" fill="#2a1a16" stroke="var(--sj-vermil)" stroke-width="3"/><text x="400" y="374" text-anchor="middle" fill="var(--sj-vermil)" font-size="15" font-weight="600" font-family="serif">戍卒 · 陈胜吴广 · 引爆</text></g>`),
    railChips: `<a class="sj-rail-chip" href="./SJ-07.html">SJ-07</a><a class="sj-rail-chip" href="./SJ-11.html">SJ-11</a>`,
    phase: '崩解期 · <b>速亡</b>',
    phaseProse: '上升期未及沉淀即进入崩解：合法性叙事与财政汲取双引燃，军事强未能转化为统治合法性。SJ-07 矩阵秦行深描。',
    forces: `<tr><td>财政汲取〔引燃〕</td><td>「暴政」「苛税」</td><td class="shi">阿房、骊山、戍边徭役，汲取无缓冲直达基层</td></tr>
<tr><td>精英循环</td><td>「奸臣」</td><td class="shi">李斯专权、赵高篡诏，精英通道封闭为宫廷斗争</td></tr>
<tr><td>合法性叙事〔引燃〕</td><td>「失德」</td><td class="shi">统一后天命叙事未及沉淀；陈胜「王侯将相宁有种乎」夺话语</td></tr>
<tr><td>边疆军事</td><td>「戍边」</td><td class="shi">军事强但戍卒起义显示军队未能维系认同</td></tr>
<tr><td>生态—人口基座</td><td>—</td><td class="shi">连年大型工程叠加，基层承载逼近极限〔存疑〕</td></tr>`,
    hist: `<article><div class="who">李敖式考据</div><p>「暴秦」叙事含汉初政治合法化书写，但汲取无度与严刑结构属实。</p></article>
<article><div class="who">钱穆</div><p>秦制严酷、统一过速，未能与编户齐民建立绩效合法性。</p></article>
<article><div class="who">金观涛</div><p>超稳定结构重启前的最短崩解：制度新但修复力未建立。</p></article>
<article><div class="who">黄仁宇</div><p>秦缺乏数目字管理与中层组织，以严刑替代，统一后迅速失控。</p></article>
<article style="grid-column:1/-1"><div class="who">西方汉学</div><p>秦汉帝国研究：秦亡是「国家能力过强但合法性不足」的经典悖论。</p></article>`,
    verdict: `<article class="ok"><div class="vh">已兑现</div><p>郡县制遗产</p><p>统一度量衡</p><p>中央集权范式</p></article>
<article class="fail"><div class="vh">已失败</div><p>二世而亡</p><p>陈胜吴广起义</p><p>楚汉易代</p></article>
<article class="open"><div class="vh">未决〔反事实〕</div><p>若始皇后收敛大型工程与严刑，秦祚能否延续至制度化沉淀？</p></article>`,
    mirror: `<article class="same"><div class="mh">相似机制</div><p>汲取越民变阈值引爆；合法性绩效枯竭先于崩解。</p></article>
<article class="diff"><div class="mh">关键差异</div><p>现代数目字管理、社会保障与舆情回应机制已质变（→ SJ-21）。</p></article>`,
    xref: `<a href="./SJ-07.html"><div class="n">SJ-07</div><h3>崩解矩阵</h3><p>秦行定位。</p></a>
<a href="./SJ-11.html"><div class="n">SJ-11</div><h3>商鞅变法</h3><p>前史：制度奠基与残暴化隐患。</p></a>`,
    footerNext: `<a href="./SJ-13.html">下一案 SJ-13 →</a>`,
    source: '真源《史记》+ SJ-07 秦行',
    nodeData: JSON.stringify({
      qin: { name: '秦始皇', tag: '合法性透支', body: '统一功绩大但绩效合法性未及沉淀，严刑替代同意。' },
      lishi: { name: '李斯', tag: '中枢专权', body: '郡县推行与法令统一，但二世即位后政治失控。' },
      junxian: { name: '郡县汲取', tag: '财政枢纽', body: '徭役赋税直达基层，阿房骊山等工程加剧负担。' },
      chen: { name: '陈胜吴广', tag: '引爆点', body: '戍卒起义，「王侯将相宁有种乎」夺合法性话语。' },
    }),
  },
  {
    id: 'SJ-13', prefix: '13', file: 'SJ-13.html',
    title: '王莽改制', desc: 'ChinaOS 史鉴变法卷新莽案：王莽托古改制与豪强反弹。',
    badge: 'SJ-13 · 变法改革案例卷 · 新莽案',
    h1: '王莽改制', sub: '托古改制 · 豪强反弹 · 新莽速亡',
    chips: `<a class="sj-13-chip" href="./SJ-00.html">↔ SJ-00</a><a class="sj-13-chip" href="./SJ-05.html">↔ SJ-05</a><a class="sj-13-chip" href="./SJ-21.html">↔ SJ-21</a>`,
    meta: '西汉末僵化期末端改革',
    zhupi: '朱批：本案是僵化期末端「托古改制」——以《汉书·王莽传》为口径，与 SJ-05 王安石同构「财政重建触动豪强」结构，但篡位合法性污点是额外死穴。',
    hook: '西汉末土地兼并、币制混乱，王莽以<b>托古改制</b>（王田、私属、币制等）试图重整汲取，却触动豪强利益、改革执行混乱，<b>篡汉</b>合法性迅速破产，绿林赤眉起而新莽亡。',
    yr: '系年：始建国元年（9）王莽代汉 · 天凤年间改制全面推行（《汉书·王莽传》）',
    sliceProse: '权力几何：王莽（禅让包装的合法性）→ 儒生官僚 → 王田/币制改革下行 → 豪强底盘强烈反弹。',
    sliceNote: '色义：王莽=赭金虚线（篡位合法性脆弱）；豪强反弹=朱红回路最重。',
    svg: svgBase('SJ-13 · 新莽权力几何 · 托古改制', `
  <g class="sj-node" data-id="wang" tabindex="0" role="button"><rect x="290" y="55" width="220" height="50" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="1.4" stroke-dasharray="5 4"/><text x="400" y="86" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-family="serif">王莽 · 禅让合法性</text></g>
  <g class="sj-node" data-id="reform" tabindex="0" role="button"><rect x="270" y="150" width="260" height="54" rx="8" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="2"/><text x="400" y="182" text-anchor="middle" fill="var(--sj-celadon)" font-size="14" font-family="serif">王田 · 币制 · 托古改制</text></g>
  <g class="sj-node" data-id="haoqiang" tabindex="0" role="button"><rect x="60" y="290" width="220" height="54" rx="8" fill="#2a1a16" stroke="var(--sj-vermil)" stroke-width="3"/><text x="170" y="322" text-anchor="middle" fill="var(--sj-vermil)" font-size="14" font-family="serif">豪强 · 土地兼并</text></g>
  <g class="sj-node" data-id="min" tabindex="0" role="button"><rect x="520" y="290" width="200" height="54" rx="8" fill="var(--sj-ink-800)" stroke="var(--sj-paper-300)" stroke-width="1.4"/><text x="620" y="322" text-anchor="middle" fill="var(--sj-paper-100)" font-size="14" font-family="serif">编户 · 流民</text></g>`),
    railChips: `<a class="sj-rail-chip" href="./SJ-05.html">SJ-05</a>`,
    phase: '僵化期末端 · <b>改革窗口（篡位合法性）</b>',
    phaseProse: '西汉末僵化期末端，土地兼并与币制混乱开启改革窗口；但王莽篡位使合法性叙事先天不足，改革更易被解读为「僭越」。',
    forces: `<tr><td>财政汲取</td><td>「复古」</td><td class="shi">王田、均输平准式改革试图重整税基与货币</td></tr>
<tr><td>精英循环〔死穴〕</td><td>「侵夺富民」</td><td class="shi">王田触动豪强土地特权，精英联盟反扑</td></tr>
<tr><td>合法性叙事</td><td>「禅让」</td><td class="shi">篡汉污名使改革失去正统支撑，绿林赤眉夺话语</td></tr>
<tr><td>边疆军事</td><td>「四夷」</td><td class="shi">匈奴等边疆压力消耗财政，改革未能稳边</td></tr>
<tr><td>生态—人口基座</td><td>灾荒</td><td class="shi">黄河改道等灾荒叠加，流民引爆〔具体系年存疑〕</td></tr>`,
    hist: `<article><div class="who">李敖式考据</div><p>剥离儒家「篡贼」道德叙事，仍可见改革触动豪强之结构实因。</p></article>
<article><div class="who">钱穆</div><p>对王莽托古批评甚烈，视为儒生理想脱离现实的典型。</p></article>
<article><div class="who">金观涛</div><p>又一次低水平修复失败，未能突破地主—官僚结构。</p></article>
<article><div class="who">黄仁宇</div><p>改制缺乏可操作的数目字管理，币制反复加剧混乱。</p></article>
<article style="grid-column:1/-1"><div class="who">西方汉学</div><p>Han studies：王莽改革是儒家乌托邦与政治现实碰撞的案例。</p></article>`,
    verdict: `<article class="ok"><div class="vh">已兑现</div><p>儒生理想话语短暂实践</p><p>部分土地政策尝试</p></article>
<article class="fail"><div class="vh">已失败</div><p>新莽速亡</p><p>币制混乱</p><p>豪强反弹</p></article>
<article class="open"><div class="vh">未决〔反事实〕</div><p>若无篡位污名、渐进改革，能否延续西汉修复路径？</p></article>`,
    mirror: `<article class="same"><div class="mh">相似机制</div><p>顶层设计改革 vs 豪强抵制；货币与土地政策牵动汲取枢纽。</p></article>
<article class="diff"><div class="mh">关键差异</div><p>现代土地制度、货币主权与宏观调控工具已质变（→ SJ-21）。</p></article>`,
    xref: `<a href="./SJ-05.html"><div class="n">SJ-05</div><h3>王安石</h3><p>跨时代变法对照。</p></a>
<a href="./SJ-21.html"><div class="n">SJ-21</div><h3>经济映射</h3><p>货币与汲取映射。</p></a>`,
    footerNext: `<a href="./SJ-14.html">下一案 SJ-14 →</a>`,
    source: '真源《汉书·王莽传》',
    nodeData: JSON.stringify({
      wang: { name: '王莽', tag: '篡位合法性', body: '禅让叙事难掩篡汉污名，改革失去正统支柱。' },
      reform: { name: '托古改制', tag: '财政工具', body: '王田、币制等试图重整汲取，执行混乱。' },
      haoqiang: { name: '豪强', tag: '精英抵制', body: '土地兼并利益集团强烈反弹，是改制死穴。' },
      min: { name: '编户流民', tag: '底盘', body: '灾荒与改制失败叠加，流民成为起义基础。' },
    }),
  },
  {
    id: 'SJ-14', prefix: '14', file: 'SJ-14.html',
    title: '洋务运动', desc: 'ChinaOS 史鉴改革卷近代案：洋务运动与甲午证伪。',
    badge: 'SJ-14 · 改革案例卷 · 洋务案',
    h1: '洋务运动', sub: '中体西用 · 体系外冲击 · 甲午证伪',
    chips: `<a class="sj-14-chip" href="./SJ-00.html">↔ SJ-00</a><a class="sj-14-chip" href="./SJ-07.html">↔ SJ-07 清行</a><a class="sj-14-chip" href="./SJ-24.html">↔ SJ-24</a>`,
    meta: '近代前夜 · 体系外变量',
    zhupi: '朱批：本案引入母本清行「体系外变量」——鸦片战争后的冲击-回应改革。口径：《清史稿》洋务诸传 + 费正清框架，保守推演。',
    hook: '鸦片战争后列强冲击下，清廷洋务派以<b>「自强求富」「中体西用」</b>兴办军工、航运、电报，北洋水师等短期见效；然制度未变，<b>甲午战败</b>证伪「只强器物」路径，边疆军事力仍不足以支撑合法性。',
    yr: '系年：同治元年（1862）设总理衙门 · 1894 甲午战争战败（《清史稿》）',
    sliceProse: '权力几何：慈禧皇权 → 奕訢·李鸿章洋务派 → 江南制造局/北洋水师 → 顽固派与地方督抚；外环列强军事财政压力。',
    sliceNote: '色义：洋务派=青瓷；列强压力=朱红外环；甲午战败=朱红引爆。',
    svg: svgBase('SJ-14 · 洋务权力几何 · 中体西用', `
  <g class="sj-node" data-id="cixi" tabindex="0" role="button"><rect x="300" y="40" width="200" height="44" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="1.4"/><text x="400" y="68" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-family="serif">慈禧 · 皇权</text></g>
  <g class="sj-node" data-id="yangwu" tabindex="0" role="button"><rect x="250" y="130" width="300" height="56" rx="8" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="2.2"/><text x="400" y="162" text-anchor="middle" fill="var(--sj-celadon)" font-size="14" font-family="serif">奕訢 · 李鸿章 · 洋务派</text></g>
  <g class="sj-node" data-id="industry" tabindex="0" role="button"><rect x="200" y="230" width="400" height="48" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="1.8"/><text x="400" y="260" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-family="serif">军工 · 航运 · 电报 · 北洋水师</text></g>
  <g class="sj-node" data-id="powers" tabindex="0" role="button"><rect x="220" y="340" width="360" height="52" rx="8" fill="#2a1a16" stroke="var(--sj-vermil)" stroke-width="3"/><text x="400" y="372" text-anchor="middle" fill="var(--sj-vermil)" font-size="14" font-weight="600" font-family="serif">甲午战败 · 列强压力外环</text></g>`),
    railChips: `<a class="sj-rail-chip" href="./SJ-24.html">SJ-24</a><a class="sj-rail-chip" href="./SJ-07.html">SJ-07</a>`,
    phase: '僵化期末端 · <b>被动改革（体系外变量）</b>',
    phaseProse: '清晚期僵化期末端叠加体系外冲击（现代性），洋务是被动改革窗口；财政—军事现代化未能同步制度变革。',
    forces: `<tr><td>财政汲取</td><td>「自强」</td><td class="shi">官督商办、关税、厘金支撑军工，汲取未能支撑全面现代化</td></tr>
<tr><td>精英循环</td><td>「顽固派」</td><td class="shi">满汉精英分裂，顽固派抵制，洋务派系个人权威集合</td></tr>
<tr><td>合法性叙事</td><td>「中体西用」</td><td class="shi">甲午战败使「自强」叙事破产，合法性绩效枯竭</td></tr>
<tr><td>边疆军事〔引燃〕</td><td>「甲午」</td><td class="shi">北洋水师覆没，军事现代化证伪，引爆后续维新思潮</td></tr>
<tr><td>生态—人口基座</td><td>—</td><td class="shi">人口压力与财政负担仍在；工业化初启〔存疑〕</td></tr>`,
    hist: `<article><div class="who">李敖式考据</div><p>剥离「卖国」标签，可见洋务派在体制约束内的真实努力与结构局限。</p></article>
<article><div class="who">钱穆</div><p>中国近代史脉络中，洋务为传统政体最后一次自我修补。</p></article>
<article><div class="who">金观涛</div><p>低水平均衡上的局部技术引进，未触及操作系统升级。</p></article>
<article><div class="who">黄仁宇</div><p>数目字管理仍不足，近代会计与组织未能建立。</p></article>
<article style="grid-column:1/-1"><div class="who">费正清</div><p>冲击-回应：西方压力倒逼改革，但回应停留在器物层，制度惰性致失败。</p></article>`,
    verdict: `<article class="ok"><div class="vh">已兑现</div><p>江南制造局等工业启蒙</p><p>新式海军与人才</p><p>「自强」话语开启近代思潮</p></article>
<article class="fail"><div class="vh">已失败</div><p>甲午战败</p><p>制度未变</p><p>主权丧失加剧</p></article>
<article class="open"><div class="vh">未决〔反事实〕</div><p>若戊戌级制度改革与洋务同步，清末路径会否不同？</p></article>`,
    mirror: `<article class="same"><div class="mh">相似机制</div><p>外部压力倒逼改革；军事—财政—合法性三联共振。</p></article>
<article class="diff"><div class="mh">关键差异</div><p>当代自主创新与举国体制已非「中体西用」；体系外变量形态变为技术—金融地缘（→ SJ-24）。</p></article>`,
    xref: `<a href="./SJ-07.html"><div class="n">SJ-07</div><h3>崩解矩阵</h3><p>清行体系外变量。</p></a>
<a href="./SJ-24.html"><div class="n">SJ-24</div><h3>外交映射</h3><p>冲击-回应当代接口。</p></a>`,
    footerNext: `<a href="./SJ-00.html#sec-case-hub">案例库 Hub →</a>`,
    source: '真源《清史稿》+ 费正清冲击-回应',
    nodeData: JSON.stringify({
      cixi: { name: '慈禧', tag: '皇权', body: '在顽固派与洋务派之间钟摆，改革缺乏制度化保障。' },
      yangwu: { name: '洋务派', tag: '技术官僚', body: '奕訢、李鸿章等推动军工航运，个人权威驱动。' },
      industry: { name: '洋务企业', tag: '汲取工具', body: '官督商办模式，财政与工业汲取的近代形态。' },
      powers: { name: '列强/甲午', tag: '体系外压力', body: '1894 战败证伪「只强器物」，引爆维新思潮。' },
    }),
  },
];

for (const c of CASES) {
  const html = shell(c);
  const outPath = path.join(OUT, c.file);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Wrote', outPath);
}
