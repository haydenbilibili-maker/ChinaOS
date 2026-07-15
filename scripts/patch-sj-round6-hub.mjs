#!/usr/bin/env node
/** Patch SJ-00 Hub: Round 6 cards + stats (43单案 + 5矩阵 = 48卷) */
import fs from 'node:fs';
import path from 'node:path';

const HUB = path.resolve(import.meta.dirname, '../app/public/shijian/SJ-00.html');

const newCards = `
    <article class="sj-00-case-card" data-dynasty="qin" data-built="1" data-year="-221">
      <div class="top"><span class="sj-num">SJ-25</span><span class="dyn">秦</span><span class="yr-badge">前221</span></div>
      <h3><a href="/modules/shijian/sj-25">秦统一六国</a></h3>
      <p>前221 称皇帝，郡县度量衡统一，制度封装与征服同步。</p>
      <div class="type">上升 · 统一奠基</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="qin" data-built="1" data-year="-213">
      <div class="top"><span class="sj-num">SJ-26</span><span class="dyn">秦</span><span class="yr-badge">前213</span></div>
      <h3><a href="/modules/shijian/sj-26">焚书坑儒</a></h3>
      <p>前213 焚书、前212 坑诸生，合法性叙事自我封缄。</p>
      <div class="type">合法性 · 思想封缄</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="han" data-built="1" data-year="166">
      <div class="top"><span class="sj-num">SJ-29</span><span class="dyn">东汉</span><span class="yr-badge">166</span></div>
      <h3><a href="/modules/shijian/sj-29">东汉党锢</a></h3>
      <p>延熹九年诏捕党人，清流与宦官恶斗，精英循环堵塞。</p>
      <div class="type">精英 · 党锢</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="han" data-built="1" data-year="184">
      <div class="top"><span class="sj-num">SJ-30</span><span class="dyn">东汉</span><span class="yr-badge">184</span></div>
      <h3><a href="/modules/shijian/sj-30">黄巾起义</a></h3>
      <p>太平道「苍天已死」起事，东汉崩解总引爆。</p>
      <div class="type">崩解 · 基座引燃</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="sui" data-built="1" data-year="618">
      <div class="top"><span class="sj-num">SJ-37</span><span class="dyn">隋</span><span class="yr-badge">618</span></div>
      <h3><a href="/modules/shijian/sj-37">隋末崩解</a></h3>
      <p>江都兵变炀帝被杀，运河+三征高句丽双透支总清算。</p>
      <div class="type">崩解 · 多力共振</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="ming" data-built="1" data-year="1405">
      <div class="top"><span class="sj-num">SJ-48</span><span class="dyn">明</span><span class="yr-badge">1405</span></div>
      <h3><a href="/modules/shijian/sj-48">郑和下西洋</a></h3>
      <p>永乐三年首航，朝贡秩序与合法性象征投入达峰。</p>
      <div class="type">外交 · 朝贡</div>
    </article>
    <article class="sj-00-case-card" data-dynasty="ming" data-built="1" data-year="1449">
      <div class="top"><span class="sj-num">SJ-47</span><span class="dyn">明</span><span class="yr-badge">1449</span></div>
      <h3><a href="/modules/shijian/sj-47">土木之变</a></h3>
      <p>正统十四年土木堡兵败，英宗被俘，精锐尽丧。</p>
      <div class="type">军事 · 决策失败</div>
    </article>`;

let html = fs.readFileSync(HUB, 'utf8');

html = html.replace(
  /<span>已建 <b id="sj-stat-built">\d+<\/b> 卷<\/span>/,
  '<span>已建 <b id="sj-stat-built">48</b> 卷</span>',
);
html = html.replace(
  /<span>单案 <b>\d+<\/b> · 综合矩阵 <b>\d+<\/b><\/span>/,
  '<span>单案 <b>43</b> · 综合矩阵 <b>5</b></span>',
);
html = html.replace(
  /<span>显示 <b id="sj-stat-visible">\d+<\/b> \/ <b id="sj-stat-total">\d+<\/b><\/span>/,
  '<span>显示 <b id="sj-stat-visible">48</b> / <b id="sj-stat-total">48</b></span>',
);

if (!html.includes('SJ-25')) {
  html = html.replace(
    /(<article class="sj-00-case-card" data-dynasty="chunqiu" data-built="1" data-year="-300">\s*<div class="top"><span class="sj-num">SJ-57)/,
    `${newCards}\n    $1`,
  );
}

fs.writeFileSync(HUB, html);
console.log('Patched SJ-00 Hub for Round 6');
