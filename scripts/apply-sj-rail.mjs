#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..', 'app', 'public', 'shijian');

const SHARED_CSS = `
/* 宽屏双栏：主栏 ~58% + 粘性侧栏 ~38% */
.sj-page-layout{display:flex;flex-direction:column;gap:var(--sj-space)}
@media (min-width:1280px){
  .sj-page-layout{
    display:grid;
    grid-template-columns:minmax(0,58fr) minmax(280px,38fr);
    gap:clamp(16px,2vw,28px);
    align-items:start;
  }
}
.sj-main-col{min-width:0}
.sj-rail{display:flex;flex-direction:column;gap:12px;min-width:0}
@media (min-width:1280px){
  .sj-rail{position:sticky;top:1rem;max-height:85vh;overflow-y:auto;overscroll-behavior:contain}
}
@media (max-width:1279px){
  .sj-page-layout{display:flex;flex-direction:column}
  .sj-main-col{display:contents}
  .sj-rail{order:2;margin:8px 0 20px}
  .sj-rail-mini{display:none}
}
.sj-rail-card{
  border:1px solid var(--sj-line);border-radius:var(--sj-radius);
  background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900));
  padding:14px 16px;
}
.sj-rail-card .k{font-family:var(--sj-mono);font-size:10px;letter-spacing:.16em;color:var(--sj-ochre);margin-bottom:6px}
.sj-rail-card h3,.sj-rail-card h4{font-size:15px;letter-spacing:.06em;margin-bottom:8px;color:var(--sj-paper-100);font-weight:600}
.sj-rail-card p,.sj-rail-card li{font-size:13px;color:var(--sj-paper-300);line-height:1.65}
.sj-rail-card dl{display:grid;gap:6px;margin:0}
.sj-rail-card dt{font-family:var(--sj-mono);font-size:10px;color:var(--sj-ochre);letter-spacing:.06em}
.sj-rail-card dd{font-size:12px;color:var(--sj-paper-300);margin:0;line-height:1.55}
.sj-rail-toc{display:grid;gap:6px;margin-top:8px}
.sj-rail-toc a{
  display:block;border:1px solid var(--sj-line);border-radius:var(--sj-radius);
  padding:8px 10px;text-decoration:none;color:inherit;font-size:13px;
  transition:border-color .18s ease;
}
.sj-rail-toc a:hover,.sj-rail-toc a:focus-visible{border-color:var(--sj-ochre);outline:none}
.sj-rail-toc a.is-active{border-color:var(--sj-vermil)}
.sj-rail-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.sj-rail-chip,.sj-rail-chip:visited{
  display:inline-block;font-family:var(--sj-mono);font-size:10px;letter-spacing:.06em;
  color:var(--sj-celadon);border:1px solid var(--sj-line);padding:3px 8px;
  border-radius:var(--sj-radius);text-decoration:none;
}
.sj-rail-chip:hover,.sj-rail-chip:focus-visible{border-color:var(--sj-ochre);color:var(--sj-ochre);outline:none}
.sj-rail-mini{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-900);padding:6px 6px 2px;overflow:hidden}
.sj-rail-mini svg{display:block;width:100%;height:auto}
.sj-rail-mini-lbl{font-family:var(--sj-mono);font-size:9px;letter-spacing:.1em;color:var(--sj-paper-300);text-align:center;margin:4px 0 2px}
.sj-rail-steps{display:grid;gap:6px}
.sj-rail-step{
  border:1px solid var(--sj-line);border-radius:var(--sj-radius);padding:8px 10px;
  font-size:13px;color:var(--sj-paper-300);border-left:3px solid var(--sj-line);
}
.sj-rail-step.is-on{border-left-color:var(--sj-vermil);color:var(--sj-paper-100);background:color-mix(in srgb,var(--sj-vermil) 8%,var(--sj-ink-900))}
.sj-rail-step .n{font-family:var(--sj-mono);font-size:10px;color:var(--sj-ochre);letter-spacing:.08em;display:block;margin-bottom:2px}
.sj-rail-legend{display:grid;gap:4px;margin-top:8px}
.sj-rail-legend span{font-size:12px;color:var(--sj-paper-300);padding-left:12px;border-left:3px solid var(--sj-line)}
.sj-rail-legend .ochre{border-left-color:var(--sj-ochre)}
.sj-rail-legend .celadon{border-left-color:var(--sj-celadon)}
.sj-rail-legend .vermil{border-left-color:var(--sj-vermil)}
.sj-rail-legend .paper{border-left-color:var(--sj-paper-100)}
.sj-rail-legend .ink{border-left-color:var(--sj-paper-300)}
.sj-rail-vols{display:grid;gap:6px}
.sj-rail-vol{
  display:block;border:1px solid var(--sj-line);border-radius:var(--sj-radius);
  padding:8px 10px;text-decoration:none;color:inherit;font-size:13px;
  transition:border-color .18s ease;
}
.sj-rail-vol:hover,.sj-rail-vol:focus-visible{border-color:var(--sj-ochre);outline:none}
.sj-rail-vol .n{font-family:var(--sj-mono);font-size:10px;color:var(--sj-ochre);letter-spacing:.1em}
@media (min-width:2560px){.sj-rail{max-width:420px;margin-left:auto;width:100%}}
`;

const LIGHT_RAIL = `html[data-theme="light"] .sj-rail-card{box-shadow:0 1px 0 rgba(26,24,20,.05),0 12px 28px rgba(26,24,20,.08)}
html[data-theme="light"] .sj-rail-mini{background:var(--sj-ink-800)}
`;

const TOC_SCRIPT = `
  /* rail toc highlight */
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

function prefixFromFile(file) {
  return file.replace('.html', '').toLowerCase();
}

function fixMaxWidth(html, prefix) {
  html = html.replace(/1680px,100%\)\}\}/g, '1680px,100%)}');
  if (html.includes(`@media (min-width:1280px){.${prefix}-wrap`)) return html;
  const block = `.${prefix}-wrap{max-width:min(1180px,100%);margin:0 auto;padding:var(--sj-space) var(--sj-space) 48px}
@media (min-width:1280px){.${prefix}-wrap{max-width:min(1400px,100%)}}
@media (min-width:1536px){.${prefix}-wrap{max-width:min(1480px,100%)}}
@media (min-width:1920px){.${prefix}-wrap{max-width:min(1560px,100%)}}
@media (min-width:2560px){.${prefix}-wrap{max-width:min(1680px,100%)}}`;
  return html.replace(
    new RegExp(`\\.${prefix}-wrap\\{max-width:min\\(1180px,100%\\);margin:0 auto;padding:var\\(--sj-space\\) var\\(--sj-space\\) 48px\\}`),
    block
  );
}

function injectCss(html) {
  if (!html.includes('.sj-page-layout{display:flex')) {
    const idx = html.indexOf('@keyframes sj-fade-in');
    const insertAt = idx > 0 ? idx : html.indexOf('/* 页眉');
    html = html.slice(0, insertAt) + SHARED_CSS + '\n' + html.slice(insertAt);
  }
  return html;
}

function injectLightTheme(html) {
  if (!html.includes('html[data-theme="light"] .sj-rail-card')) {
    const marker = 'html[data-theme="light"]';
    const idx = html.indexOf(marker);
    html = idx >= 0
      ? html.replace(marker, LIGHT_RAIL + marker)
      : html.replace('</style>', LIGHT_RAIL + '\n</style>');
  }
  return html;
}

function addMobileOrders(html, rules) {
  if (!html.includes('@media (max-width:1279px)')) return html;
  const missing = rules.filter(r => !html.includes(r));
  if (!missing.length) return html;
  return html.replace(
    '@media (max-width:1279px){',
    '@media (max-width:1279px){\n  ' + missing.join('\n  ')
  );
}

function wrapSections(html, startIdx, endIdx, railHtml, mobileRules = []) {
  if (html.includes('class="sj-page-layout"')) return html;
  if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) return html;
  const before = html.slice(0, startIdx);
  const middle = html.slice(startIdx, endIdx);
  const after = html.slice(endIdx);
  let result = before + '<div class="sj-page-layout">\n<div class="sj-main-col">\n\n' + middle +
    '\n</div><!-- /.sj-main-col -->\n\n' + railHtml + '\n</div><!-- /.sj-page-layout -->\n\n' + after;
  return addMobileOrders(result, mobileRules);
}

function findStart(html, prefix) {
  for (const m of [`<!-- 1 引言 -->`, `<section class="${prefix}-sec" id="sec-intro"`, `<!-- ① 一句话拐点 -->`]) {
    const i = html.indexOf(m);
    if (i >= 0) return i;
  }
  return -1;
}

function miniDeltaSvg(domain, rows) {
  const rowY = [52, 88, 124];
  const strokeMap = { celadon: 'var(--sj-celadon)', vermil: 'var(--sj-vermil)', paper: 'var(--sj-paper-100)', ochre: 'var(--sj-ochre)', ink: 'var(--sj-paper-300)' };
  const rowEls = rows.map((r, i) => {
    const y = rowY[i];
    const stroke = strokeMap[r.color] || 'var(--sj-ochre)';
    return `<g opacity="0.9">
    <rect x="8" y="${y - 14}" width="72" height="22" rx="4" fill="var(--sj-ink-800)" stroke="${stroke}" stroke-width="1.2"/>
    <text x="44" y="${y}" text-anchor="middle" fill="${stroke}" font-size="7" font-family="Songti SC,serif">${r.gu}</text>
    <circle cx="92" cy="${y}" r="8" fill="var(--sj-ink-900)" stroke="var(--sj-ochre)" stroke-width="1"/>
    <text x="92" y="${y + 3}" text-anchor="middle" fill="var(--sj-ochre)" font-size="8" font-family="monospace">Δ</text>
    <rect x="104" y="${y - 14}" width="72" height="22" rx="4" fill="var(--sj-ink-800)" stroke="${stroke}" stroke-width="1.2"/>
    <text x="140" y="${y}" text-anchor="middle" fill="${stroke}" font-size="7" font-family="Songti SC,serif">${r.jin}</text>
  </g>`;
  }).join('\n  ');
  return `<div class="sj-rail-mini sj-rail-card" aria-label="差异闸缩略">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184 148" role="img"><title>差异闸 Δ · ${domain}</title>
  <rect width="184" height="148" fill="var(--sj-ink-900)"/>
  <text x="92" y="16" text-anchor="middle" fill="var(--sj-ochre)" font-size="8" font-family="monospace">Δ · ${domain}</text>
  ${rowEls}
</svg>
<p class="sj-rail-mini-lbl">差异闸缩略 · 点击 §03 对照组</p>
</div>`;
}

function mappingRail(domain, pairs, chips) {
  const toc = pairs.map(p => `<a href="#pair-${p.id}">${p.label}</a>`).join('\n    ');
  const chipHtml = chips.map(c => `<a class="sj-rail-chip" href="${c.href}">${c.label}</a>`).join('\n    ');
  return `<aside class="sj-rail" id="sj-rail" aria-label="映射导航侧栏">
  ${miniDeltaSvg(domain, pairs.map(p => ({ gu: p.guShort, jin: p.jinShort, color: p.color })))}
  <div class="sj-rail-card">
    <div class="k">古今映射 · ${domain}域</div>
    <h3>差异闸导航</h3>
    <p>三组对照各须过 Δ 闸；点击下方跳转 §03 双栏组。</p>
    <nav class="sj-rail-toc" aria-label="对照组目录">${toc}</nav>
    <div class="sj-rail-chips" aria-label="交叉引用">${chipHtml}</div>
  </div>
</aside>`;
}

function addPairIds(html, pairs) {
  pairs.forEach(p => {
    const re = new RegExp(`(<article)(>\\s*\\n\\s*<div class="ph"><span class="gu">${p.guMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span>)`);
    if (!html.includes(`id="pair-${p.id}"`)) html = html.replace(re, `<article id="pair-${p.id}"$2`);
  });
  return html;
}

function addTocScript(html) {
  if (html.includes('rail toc highlight')) return html;
  return html.replace(/<\/script>\s*<\/body>\s*<\/html>/, TOC_SCRIPT + '\n</script>\n</body>\n</html>');
}

const MAPPING = {
  'SJ-20': { domain: '政治', pairs: [
    { id: 'keju', guMatch: '科举 · 精英循环', label: '① 科举 → 干部选拔', guShort: '科举', jinShort: '干部', color: 'celadon' },
    { id: 'hefaxing', guMatch: '天命 · 正统叙事', label: '② 天命 → 绩效合法性', guShort: '天命', jinShort: '绩效', color: 'paper' },
    { id: 'yangdi', guMatch: '央地 · 集权—分权钟摆', label: '③ 央地 → 当代央地', guShort: '央地', jinShort: '条块', color: 'ochre' },
  ], chips: [{ href: './SJ-03.html', label: 'SJ-03 五力' },{ href: './SJ-05.html', label: 'SJ-05 变法' },{ href: './SJ-08.html', label: 'SJ-08 央地' },{ href: '/modules/yishixingtai', label: 'GY-02 合法性' }]},
  'SJ-21': { domain: '经济', pairs: [
    { id: 'yantie', guMatch: '盐铁专营 · 官营', label: '① 盐铁 → 国有资本', guShort: '盐铁', jinShort: '国资', color: 'ochre' },
    { id: 'shuizhi', guMatch: '两税 · 一条鞭 · 摊丁入亩', label: '② 税制 → 土地财政', guShort: '税制', jinShort: '土财', color: 'ochre' },
    { id: 'changping', guMatch: '常平仓 · 重农抑商', label: '③ 常平仓 → 宏观调控', guShort: '常平仓', jinShort: '宏观', color: 'celadon' },
  ], chips: [{ href: './SJ-03.html', label: 'SJ-03 财政力' },{ href: './SJ-05.html', label: 'SJ-05 变法' },{ href: './SJ-07.html', label: 'SJ-07 三饷' },{ href: '/modules/guoyun', label: 'GY-01 国运' }]},
  'SJ-22': { domain: '文化', pairs: [
    { id: 'tianming', guMatch: '天命 · 正统叙事', label: '① 天命 → 绩效合法性', guShort: '天命', jinShort: '绩效', color: 'paper' },
    { id: 'wenjiao', guMatch: '文教象征投入', label: '② 文教 → 文化软实力', guShort: '文教', jinShort: '软实力', color: 'celadon' },
    { id: 'wenziyu', guMatch: '文字狱 · 思想管控', label: '③ 文字狱 → 内容治理', guShort: '文字狱', jinShort: '语义', color: 'vermil' },
  ], chips: [{ href: './SJ-03.html', label: 'SJ-03 合法性' },{ href: './SJ-20.html', label: 'SJ-20 政治' },{ href: '/modules/yishixingtai', label: 'GY-02 合法性' }]},
  'SJ-23': { domain: '社会', pairs: [
    { id: 'chengzai', guMatch: '人口 · 耕地承载', label: '① 承载 → 抚养比就业', guShort: '承载', jinShort: '抚养比', color: 'ink' },
    { id: 'liumin', guMatch: '流民 · 揭竿', label: '② 流民 → 灵活就业', guShort: '流民', jinShort: '流动', color: 'vermil' },
    { id: 'huji', guMatch: '黄册 · 户籍编审', label: '③ 户籍 → 网格治理', guShort: '户籍', jinShort: '网格', color: 'celadon' },
  ], chips: [{ href: './SJ-03.html', label: 'SJ-03 基座力' },{ href: './SJ-07.html', label: 'SJ-07 崩解' },{ href: './SJ-24.html', label: 'SJ-24 外交' }]},
  'SJ-24': { domain: '外交', pairs: [
    { id: 'neiya', guMatch: '内亚游牧周期', label: '① 内亚 → 海洋技术金融', guShort: '内亚', jinShort: '海洋', color: 'vermil' },
    { id: 'chaogong', guMatch: '朝贡体系', label: '② 朝贡 → 秩序话语', guShort: '朝贡', jinShort: '规则', color: 'celadon' },
    { id: 'bianxiang', guMatch: '边饷 · 军费财政', label: '③ 边饷 → 国防财政', guShort: '边饷', jinShort: '国防', color: 'ochre' },
  ], chips: [{ href: './SJ-03.html', label: 'SJ-03 边疆' },{ href: './SJ-07.html', label: 'SJ-07 三饷' },{ href: '/diplomacy', label: '外交博弈' },{ href: '/straits', label: '台海局势' }]},
};

function ledgerRail(hookSummary, fields) {
  const toc = fields.map(f => `<a href="#${f.id}">${f.label}</a>`).join('\n    ');
  return `<aside class="sj-rail" id="sj-rail" aria-label="台账导航侧栏">
  <div class="sj-rail-card">
    <div class="k">史鉴台账 · 七字段</div>
    <h3>本案导航</h3>
    <p>${hookSummary}</p>
    <nav class="sj-rail-toc" aria-label="台账字段">${toc}</nav>
  </div>
  <div class="sj-rail-card sj-rail-mini" aria-label="结构切片提示">
    <div class="k">结构切片</div>
    <p>点选 §02 切片图节点，主栏侧 aside 展开角色说明；宽屏侧栏提供字段快跳。</p>
  </div>
</aside>`;
}

const LEDGER_FIELDS = [
  { id: 'f1', label: '01 · 一句话拐点' },
  { id: 'f2', label: '02 · 结构切片' },
  { id: 'f3', label: '03 · 相位定位' },
  { id: 'f4', label: '04 · 五力归因' },
  { id: 'f5', label: '05 · 史家交锋' },
  { id: 'f6', label: '06 · 成败判定' },
  { id: 'f7', label: '07 · 古今映射' },
];

const VOLUME_CONFIG = {
  'SJ-00': {
    end: '<section class="sj-00-sec" id="sec-vols"',
    mobile: ['#sec-intro{order:1}', '#sec-spiral{order:3}'],
    rail: `<aside class="sj-rail" id="sj-rail" aria-label="四卷导航侧栏">
  <div class="sj-rail-card">
    <div class="k">四卷闭环</div>
    <h3>史鉴卷目快跳</h3>
    <nav class="sj-rail-vols" aria-label="四卷导航">
      <a class="sj-rail-vol" href="#vol-method"><span class="n">方法论卷</span> SJ-01 方法 · SJ-02 引擎</a>
      <a class="sj-rail-vol" href="#vol-cycle"><span class="n">周期卷</span> SJ-03 五力 · SJ-04 罗盘</a>
      <a class="sj-rail-vol" href="#vol-cases"><span class="n">案例卷</span> SJ-05–08 台账</a>
      <a class="sj-rail-vol" href="#vol-mirror"><span class="n">映射卷</span> SJ-20–24 五域</a>
    </nav>
    <div class="sj-rail-chips">
      <a class="sj-rail-chip" href="./SJ-01.html">SJ-01</a>
      <a class="sj-rail-chip" href="./SJ-02.html">SJ-02</a>
      <a class="sj-rail-chip" href="./SJ-03.html">SJ-03</a>
      <a class="sj-rail-chip" href="./SJ-20.html">SJ-20</a>
    </div>
  </div>
  <div class="sj-rail-mini sj-rail-card" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" role="img"><title>四卷闭环</title>
      <rect width="160" height="100" fill="var(--sj-ink-900)"/>
      <circle cx="80" cy="50" r="32" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2" stroke-dasharray="4 3"/>
      <text x="80" y="28" text-anchor="middle" fill="var(--sj-celadon)" font-size="8">方法</text>
      <text x="118" y="54" fill="var(--sj-ochre)" font-size="8">周期</text>
      <text x="80" y="82" text-anchor="middle" fill="var(--sj-vermil)" font-size="8">案例</text>
      <text x="38" y="54" text-anchor="end" fill="var(--sj-paper-100)" font-size="8">映射</text>
    </svg>
    <p class="sj-rail-mini-lbl">四卷闭环示意</p>
  </div>
</aside>`,
  },
  'SJ-02': {
    end: '<section class="sj-02-sec" id="sec-steps"',
    mobile: ['#sec-intro{order:1}', '#sec-engine{order:3}'],
    rail: `<aside class="sj-rail" id="sj-rail" aria-label="四步法侧栏">
  <div class="sj-rail-card">
    <div class="k">史鉴引擎 · 四步法</div>
    <h3>流水线导航</h3>
    <nav class="sj-rail-steps" aria-label="四步流程">
      <a class="sj-rail-step" href="#sec-steps"><span class="n">① Structure</span>结构切片 · 金观涛·孔飞力</a>
      <a class="sj-rail-step" href="#sec-steps"><span class="n">② Cycle</span>周期定位 · 金观涛·黄仁宇</a>
      <a class="sj-rail-step" href="#sec-ledger"><span class="n">③ Mechanism</span>机制归因 · 考据+结构双列</a>
      <a class="sj-rail-step" href="#sec-map"><span class="n">④ Mirror</span>古今映射 · 强制双栏</a>
    </nav>
    <p style="margin-top:10px">顶部弧线＝闭环：映射证伪修正切片方式。</p>
  </div>
</aside>`,
  },
  'SJ-03': {
    end: '<section class="sj-03-sec" id="sec-forces"',
    mobile: ['#sec-intro{order:1}', '#sec-forcefield{order:3}'],
    rail: `<aside class="sj-rail" id="sj-rail" aria-label="五力侧栏">
  <div class="sj-rail-card">
    <div class="k">五力衰变模型</div>
    <h3>色义图例</h3>
    <div class="sj-rail-legend" aria-label="五力色义">
      <span class="ochre">财政汲取力 · 枢纽变压器</span>
      <span class="celadon">精英循环力</span>
      <span class="paper">合法性叙事力</span>
      <span class="vermil">边疆—军事压力</span>
      <span class="ink">生态—人口—技术基座 · 慢变量</span>
    </div>
    <p style="margin-top:10px">单力负相位可修复；三力及以上同时负相位 → 超稳定结构失修。</p>
  </div>
  <div class="sj-rail-card" id="rail-snap-hint">
    <div class="k">相位合约</div>
    <p>点选 §02 力场节点或 §05 合约区，主栏展开 sj-snap 评分卡；与 SJ-04 共享数据结构。</p>
    <a class="sj-rail-chip" href="./SJ-04.html">↔ SJ-04 罗盘</a>
  </div>
</aside>`,
  },
  'SJ-04': {
    end: '<section class="sj-04-sec" id="sec-phases"',
    mobile: ['#sec-intro{order:1}', '#sec-compass{order:3}'],
    rail: `<aside class="sj-rail" id="sj-rail" aria-label="罗盘侧栏">
  <div class="sj-rail-mini sj-rail-card" aria-label="罗盘缩略">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img"><title>相位罗盘缩略</title>
      <rect width="120" height="120" fill="var(--sj-ink-900)"/>
      <circle cx="60" cy="60" r="44" fill="none" stroke="var(--sj-line)" stroke-width="1"/>
      <path d="M60,16 A44,44 0 0,1 104,60" fill="none" stroke="var(--sj-celadon)" stroke-width="6" opacity="0.5"/>
      <path d="M104,60 A44,44 0 0,1 60,104" fill="none" stroke="var(--sj-ochre)" stroke-width="6" opacity="0.5"/>
      <path d="M60,104 A44,44 0 0,1 16,60" fill="none" stroke="var(--sj-paper-300)" stroke-width="6" opacity="0.5"/>
      <path d="M16,60 A44,44 0 0,1 60,16" fill="none" stroke="var(--sj-vermil)" stroke-width="6" opacity="0.5"/>
      <circle cx="60" cy="60" r="4" fill="var(--sj-ochre)"/>
    </svg>
    <p class="sj-rail-mini-lbl">治乱循环相位盘 · 与 §02 同步</p>
  </div>
  <div class="sj-rail-card">
    <div class="k">相位合约</div>
    <p>点选 §02 罗盘扇区，主栏与侧栏 snap 卡同步五力评分（示意 0–100）。</p>
    <div class="sj-rail-legend">
      <span class="celadon">上升</span><span class="ochre">鼎盛</span><span class="paper">僵化</span><span class="vermil">崩解</span><span class="celadon">重整</span>
    </div>
  </div>
</aside>`,
  },
  'SJ-05': {
    end: '<section class="sj-ledger-field" id="f3"',
    mobile: ['#f1{order:1}', '#f2{order:3}'],
    rail: ledgerRail('财政重建 vs 精英抵制——台账验证首案。', LEDGER_FIELDS),
  },
  'SJ-06': {
    end: '<section class="sj-ledger-field" id="f3"',
    mobile: ['#f1{order:1}', '#f2{order:3}'],
    rail: ledgerRail('鼎盛隐性拐点：边疆军事外包摧毁内重外轻。', LEDGER_FIELDS),
  },
  'SJ-07': {
    end: '<section class="sj-07-sec" id="sec-table"',
    mobile: ['#sec-intro{order:1}', '#sec-matrix{order:3}'],
    rail: `<aside class="sj-rail" id="sj-rail" aria-label="崩解矩阵侧栏">
  <div class="sj-rail-card">
    <div class="k">跨案综合</div>
    <h3>五朝引燃点</h3>
    <nav class="sj-rail-toc" aria-label="王朝目录">
      <a href="#sec-table">秦 · 合法性未立</a>
      <a href="#sec-table">汉末 · 灾荒+合法性</a>
      <a href="#sec-table">唐 · 边疆军事畸大</a>
      <a href="#sec-table">明 · 基座+三饷</a>
      <a href="#sec-table">清 · 体系外现代性</a>
    </nav>
    <p>实心点＝引燃力；三力共振 → 崩解。</p>
  </div>
  <div class="sj-rail-chips" style="padding:0 4px">
    <a class="sj-rail-chip" href="./SJ-06.html">SJ-06 天宝</a>
    <a class="sj-rail-chip" href="./SJ-05.html">SJ-05 变法</a>
  </div>
</aside>`,
  },
  'SJ-08': {
    end: '<section class="sj-ledger-field" id="f3"',
    mobile: ['#f1{order:1}', '#f2{order:3}'],
    rail: ledgerRail('军事力畸大、合法性归零；宋以反向设计再统一。', LEDGER_FIELDS),
  },
};

function processFile(file, opts = {}) {
  const path = join(ROOT, file);
  let html = readFileSync(path, 'utf8');
  const prefix = prefixFromFile(file);

  html = fixMaxWidth(html, prefix);
  html = injectCss(html);
  html = injectLightTheme(html);

  if (opts.pairs) html = addPairIds(html, opts.pairs);

  if (!html.includes('class="sj-page-layout"') && opts.rail) {
    const start = findStart(html, prefix);
    const end = html.indexOf(opts.end);
    html = wrapSections(html, start, end, opts.rail, opts.mobile || []);
  }

  if (opts.toc) html = addTocScript(html);

  writeFileSync(path, html);
  console.log(html.includes('class="sj-page-layout"') ? '✓' : '△', file);
}

// Mapping volumes
for (const [vol, cfg] of Object.entries(MAPPING)) {
  const file = vol + '.html';
  const prefix = vol.toLowerCase();
  processFile(file, {
    pairs: cfg.pairs,
    end: `<section class="${prefix}-sec" id="sec-pairs"`,
    rail: mappingRail(cfg.domain, cfg.pairs, cfg.chips),
    mobile: ['#sec-intro{order:1}', '#sec-map{order:3}'],
    toc: true,
  });
}

// Other volumes
for (const [vol, cfg] of Object.entries(VOLUME_CONFIG)) {
  processFile(vol + '.html', { ...cfg, toc: true });
}

console.log('Done.');
