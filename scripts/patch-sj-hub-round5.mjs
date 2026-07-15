#!/usr/bin/env node
/** Patch SJ-00 Hub: stats, data-year, Round 5 cards, time sort */
import fs from 'node:fs';
import path from 'node:path';

const HUB = path.resolve(import.meta.dirname, '../app/public/shijian/SJ-00.html');
const CASE_YEARS = path.resolve(import.meta.dirname, '../app/src/lib/shijian/caseYears.js');

const yearsSrc = fs.readFileSync(CASE_YEARS, 'utf8');
const yearMap = {};
for (const m of yearsSrc.matchAll(/shijianSJ(\d+):\s*(-?\d+)/g)) {
  yearMap[`SJ-${m[1]}`] = Number(m[2]);
}
for (const m of yearsSrc.matchAll(/shijianSJ(\d+):\s*(-?\d+)/g)) {
  // synthesis block duplicate ids skipped - use second block
}
const synthBlock = yearsSrc.match(/SYNTHESIS_EVENT_YEARS = \{([\s\S]*?)\};/);
if (synthBlock) {
  for (const m of synthBlock[1].matchAll(/shijianSJ(\d+):\s*(-?\d+)/g)) {
    yearMap[`SJ-${m[1]}`] = Number(m[2]);
  }
}

let html = fs.readFileSync(HUB, 'utf8');

html = html.replace(
  /<span>已建 <b id="sj-stat-built">\d+<\/b> 卷<\/span>/,
  '<span>已建 <b id="sj-stat-built">41</b> 卷</span>',
);
html = html.replace(
  /<span>单案 <b>\d+<\/b> · 综合矩阵 <b>\d+<\/b><\/span>/,
  '<span>单案 <b>36</b> · 综合矩阵 <b>5</b></span>',
);
html = html.replace(
  /<span>显示 <b id="sj-stat-visible">\d+<\/b> \/ <b id="sj-stat-total">\d+<\/b><\/span>/,
  '<span>显示 <b id="sj-stat-visible">41</b> / <b id="sj-stat-total">41</b></span>',
);

const newCards = `
    <article class="sj-00-case-card" data-dynasty="han" data-built="1" data-year="-119">
      <div class="top"><span class="sj-num">SJ-28</span><span class="dyn">西汉</span><span class="yr-badge">前119</span></div>
      <h3><a href="/modules/shijian/sj-28">汉武帝扩张</a></h3>
      <p>元狩四年漠北之战封狼居胥，盐铁官营同步越阈。</p>
      <div class="type">军事 · 财政透支</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="sui" data-built="1" data-year="605">
      <div class="top"><span class="sj-num">SJ-36</span><span class="dyn">隋</span><span class="yr-badge">605</span></div>
      <h3><a href="/modules/shijian/sj-36">大运河</a></h3>
      <p>大业元年开凿贯通南北，基座—财政耦合亦埋崩解引信。</p>
      <div class="type">基建 · 工程过载</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="tang" data-built="1" data-year="875">
      <div class="top"><span class="sj-num">SJ-40</span><span class="dyn">唐</span><span class="yr-badge">875</span></div>
      <h3><a href="/modules/shijian/sj-40">黄巢起义</a></h3>
      <p>875 聚众，880 破长安，晚唐崩解总引爆。</p>
      <div class="type">崩解 · 基座引燃</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="song" data-built="1" data-year="1138">
      <div class="top"><span class="sj-num">SJ-42</span><span class="dyn">南宋</span><span class="yr-badge">1138</span></div>
      <h3><a href="/modules/shijian/sj-42">南宋偏安</a></h3>
      <p>定都临安，守江必守淮，绍兴和议锁定积弱路径。</p>
      <div class="type">偏安 · 区域再配置</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="song" data-built="1" data-year="1005">
      <div class="top"><span class="sj-num">SJ-43</span><span class="dyn">辽宋</span><span class="yr-badge">1005</span></div>
      <h3><a href="/modules/shijian/sj-43">澶渊之盟</a></h3>
      <p>岁币换百年和平，边疆—财政交易样本。</p>
      <div class="type">外交 · 岁币</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="yuan" data-built="1" data-year="1219">
      <div class="top"><span class="sj-num">SJ-44</span><span class="dyn">蒙古</span><span class="yr-badge">1219</span></div>
      <h3><a href="/modules/shijian/sj-44">蒙古西征</a></h3>
      <p>1219 灭花剌子模，军事力扩张达欧亚内陆峰值。</p>
      <div class="type">军事 · 西征</div>
    </article>`;

if (!html.includes('SJ-28')) {
  html = html.replace(
    /(<article class="sj-00-case-card" data-dynasty="chunqiu" data-built="1">\s*<div class="top"><span class="sj-num">SJ-57)/,
    `${newCards}\n    $1`,
  );
}

// inject data-year on existing cards from sj-num
html = html.replace(
  /<article class="sj-00-case-card"([^>]*)>\s*<div class="top"><span class="sj-num">(SJ-\d+)<\/span>/g,
  (full, attrs, sjNum) => {
    if (attrs.includes('data-year')) return full;
    const y = yearMap[sjNum];
    if (y == null) return full;
    const badge = y < 0 ? `前${Math.abs(y)}` : String(y);
    const yearAttr = ` data-year="${y}"`;
    const newAttrs = attrs.includes('data-built') ? attrs.replace('>', `${yearAttr}>`) : `${attrs}${yearAttr}`;
    return `<article class="sj-00-case-card"${newAttrs}>\n      <div class="top"><span class="sj-num">${sjNum}</span>`;
  },
);

// yr-badge in top row where missing
for (const [sj, y] of Object.entries(yearMap)) {
  const badge = y < 0 ? `前${Math.abs(y)}` : String(y);
  const re = new RegExp(
    `(<article[^>]*data-year="${y}"[^>]*>[\\s\\S]*?<span class="sj-num">${sj}</span><span class="dyn">[^<]+</span>)(?!\\s*<span class="yr-badge">)`,
  );
  html = html.replace(re, `$1<span class="yr-badge">${badge}</span>`);
}

if (!html.includes('.yr-badge')) {
  html = html.replace(
    '.sj-00-case-card .top .dyn{color:var(--sj-celadon);font-size:11px}',
    `.sj-00-case-card .top .dyn{color:var(--sj-celadon);font-size:11px}
.sj-00-case-card .top .yr-badge{font-family:var(--sj-mono);font-size:10px;color:var(--sj-ochre);border:1px solid var(--sj-line);padding:1px 6px;border-radius:4px;margin-left:auto}`,
  );
}

// time sort in filter script
if (!html.includes('sortCardsByYear')) {
  html = html.replace(
    `  var cards = Array.from(grid.querySelectorAll('.sj-00-case-card'));`,
    `  function sortCardsByYear(){
    var items = Array.from(grid.querySelectorAll('.sj-00-case-card'));
    items.sort(function(a,b){
      var ta = a.dataset.type === 'synthesis' ? 1 : 0;
      var tb = b.dataset.type === 'synthesis' ? 1 : 0;
      if(ta !== tb) return ta - tb;
      var ya = parseInt(a.dataset.year || '9999', 10);
      var yb = parseInt(b.dataset.year || '9999', 10);
      return ya - yb;
    });
    items.forEach(function(c){ grid.appendChild(c); });
    cards = items;
  }
  sortCardsByYear();
  var cards = Array.from(grid.querySelectorAll('.sj-00-case-card'));`,
  );
}

html = html.replace(
  '案例库 Hub（朝代 + 类型 filter）',
  '案例库 Hub（默认按事件时间序 · 朝代 + 类型 filter）',
);

fs.writeFileSync(HUB, html);
console.log('Patched SJ-00 Hub for Round 5 + time sort');
