#!/usr/bin/env node
/**
 * 史鉴 polish 轨道：布局/动效/主题/断点一致性批量注入（不改分析正文）
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SJ_DIR = path.join(ROOT, 'app/public/shijian');

const REVEAL_CSS = `
/* 章节入场 · 尊重 prefers-reduced-motion */
@keyframes sj-fade-in{
  from{opacity:0;transform:translateY(8px)}
  to{opacity:1;transform:none}
}
.sj-reveal-stagger > header,
.sj-reveal-stagger > .sj-zhupi,
.sj-reveal-stagger > .sj-ledger,
.sj-reveal-stagger > [class*="-sec"],
.sj-reveal-stagger > footer{
  animation:sj-fade-in .34s cubic-bezier(.22,.61,.36,1) both;
}
.sj-reveal-stagger > *:nth-child(1){animation-delay:.03s}
.sj-reveal-stagger > *:nth-child(2){animation-delay:.06s}
.sj-reveal-stagger > *:nth-child(3){animation-delay:.09s}
.sj-reveal-stagger > *:nth-child(4){animation-delay:.12s}
.sj-reveal-stagger > *:nth-child(5){animation-delay:.15s}
.sj-reveal-stagger > *:nth-child(6){animation-delay:.18s}
.sj-reveal-stagger > *:nth-child(7){animation-delay:.21s}
.sj-reveal-stagger > *:nth-child(8){animation-delay:.24s}
`;

const BREAK_2560 = `@media (min-width:2560px){`;

const LIGHT_PANEL = `
html[data-theme="light"] .sj-zhupi{color:var(--sj-vermil)}
html[data-theme="light"] [class*="-stage"],
html[data-theme="light"] [class*="-aside"],
html[data-theme="light"] [class*="-table-wrap"],
html[data-theme="light"] [class*="-hook"],
html[data-theme="light"] [class*="-ledger"]{
  box-shadow:0 1px 0 rgba(26,24,20,.05),0 12px 28px rgba(26,24,20,.08);
}
html[data-theme="light"] .sj-snap-track{background:var(--sj-ink-900);border-color:var(--sj-line)}
html[data-theme="light"] .sj-snap-repair{background:var(--sj-ink-800)}
`;

const PREVIEW_WRAP = `.wrap{max-width:min(1180px,100%);margin:0 auto}
@media (min-width:1536px){.wrap{max-width:min(1360px,100%)}}
@media (min-width:1920px){.wrap{max-width:min(1520px,100%)}}
@media (min-width:2560px){.wrap{max-width:min(1680px,100%)}}`;

const VOLUMES = ['SJ-02', 'SJ-05', 'SJ-06', 'SJ-07', 'SJ-08', 'SJ-20', 'SJ-21'];

function read(f) {
  return fs.readFileSync(path.join(SJ_DIR, f), 'utf8');
}

function write(f, content) {
  fs.writeFileSync(path.join(SJ_DIR, f), content, 'utf8');
}

function patchVolume(file) {
  let html = read(file);
  const prefix = file.replace('.html', '').toLowerCase().replace('sj-', 'sj-');
  const wrapClass = `${prefix}-wrap`;

  if (!html.includes('sj-reveal-stagger')) {
    const wrapRe = new RegExp(`(\\.${wrapClass.replace('-', '\\-')}\\{[^}]+\\}\\n(?:@media[^\\n]+\\{[^}]+\\}\\n)+)`);
    if (wrapRe.test(html)) {
      html = html.replace(wrapRe, `$1${REVEAL_CSS}`);
    } else {
      const simple = new RegExp(`(\\.${wrapClass.replace('-', '\\-')}\\{max-width:[^}]+\\}\\n)`);
      html = html.replace(simple, `$1@media (min-width:1536px){.${wrapClass}{max-width:min(1360px,100%)}}\n@media (min-width:1920px){.${wrapClass}{max-width:min(1520px,100%)}}\n@media (min-width:2560px){.${wrapClass}{max-width:min(1680px,100%)}}\n${REVEAL_CSS}`);
    }
    html = html.replace(
      new RegExp(`(<div class="${wrapClass}")`),
      `<div class="${wrapClass} sj-reveal-stagger"`,
    );
  }

  if (!html.includes('@media (min-width:2560px)')) {
    html = html.replace(
      new RegExp(`(@media \\(min-width:1920px\\)\\{\\.${wrapClass.replace('-', '\\-')}\\{max-width:min\\(1520px,100%\\)\\}\\})`),
      `$1\n@media (min-width:2560px){.${wrapClass}{max-width:min(1680px,100%)}}`,
    );
  }

  if (!html.includes('.sj-reveal-stagger > *{animation:none}')) {
    html = html.replace(
      /@media \(prefers-reduced-motion:reduce\)\{([^}]*)\}/,
      (m, inner) => `@media (prefers-reduced-motion:reduce){${inner}  .sj-reveal-stagger > *{animation:none}\n}`,
    );
  }

  if (!html.includes('e.origin !== window.location.origin')) {
    html = html.replace(
      /window\.addEventListener\('message', function\(e\)\{\s*(var d=e&&e\.data;)/,
      "window.addEventListener('message', function(e){\n    if(e.origin !== window.location.origin) return;\n    $1",
    );
    html = html.replace(
      /window\.addEventListener\('message', function\(e\)\{ var d=e&&e\.data;/,
      "window.addEventListener('message', function(e){ if(e.origin !== window.location.origin) return; var d=e&&e.data;",
    );
  }

  if (html.includes('html[data-theme="light"] body') && !html.includes('html[data-theme="light"] .sj-zhupi')) {
    html = html.replace(
      /(html\[data-theme="light"\] body\{[^}]+\})/,
      `$1${LIGHT_PANEL}`,
    );
  }

  write(file, html);
  console.log('patched volume', file);
}

function patchPreviews() {
  const previews = fs.readdirSync(SJ_DIR).filter((f) => f.includes('-preview.html'));
  for (const file of previews) {
    let html = read(file);
    html = html.replace(/\.wrap\{max-width:\d+px;margin:0 auto\}/, PREVIEW_WRAP);
    if (!html.includes('.foot .draft') && html.includes('class="foot"')) {
      html = html.replace(
        /(<span>)ChinaOS · 史鉴 SJ · (preview[^<]*)/,
        '$1<span class="draft" style="color:var(--sj-ochre);margin-right:8px">草稿预览</span>ChinaOS · 史鉴 SJ · $2',
      );
    }
    if (!html.includes('prefers-reduced-motion')) {
      html = html.replace('</style>', `@media (prefers-reduced-motion:reduce){.btn,.sj-dot{transition:none}}\n</style>`);
    }
    html = html.replace(/background:#241612/g, 'background:color-mix(in srgb, var(--sj-vermil) 12%, var(--sj-ink-900))');
    html = html.replace(/background:linear-gradient\(180deg,#1f1a16,#14110f\)/g, 'background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900))');
    write(file, html);
    console.log('patched preview', file);
  }
}

function patchSJ00() {
  let html = read('SJ-00.html');
  html = html.replace(
    '<span class="vol">方法论卷</span><span class="sj-00-tag is-dev">开发中</span>',
    '<span class="vol">方法论卷</span><span class="sj-00-tag is-done">已出 v0.1</span>',
  );
  html = html.replace(
    '<span class="vol">案例卷</span><span class="sj-00-tag is-plan">规划</span>',
    '<span class="vol">案例卷</span><span class="sj-00-tag is-done">已出 v0.1</span>',
  );
  html = html.replace(
    '<span class="vol">古今映射卷</span><span class="sj-00-tag is-plan">规划</span>',
    '<span class="vol">古今映射卷</span><span class="sj-00-tag is-dev">开发中</span>',
  );
  html = html.replace(
    '<div class="ids">SJ-05 · SJ-06 · SJ-07 · SJ-08</div>',
    '<div class="ids"><a href="./SJ-05.html" style="color:inherit">SJ-05</a> · <a href="./SJ-06.html" style="color:inherit">SJ-06</a> · <a href="./SJ-07.html" style="color:inherit">SJ-07</a> · <a href="./SJ-08.html" style="color:inherit">SJ-08</a></div>',
  );
  html = html.replace(
    '<div class="ids">SJ-20 · SJ-21 · SJ-22 · SJ-23 · SJ-24</div>',
    '<div class="ids"><a href="./SJ-20.html" style="color:inherit">SJ-20</a> · <a href="./SJ-21.html" style="color:inherit">SJ-21</a> · SJ-22 · SJ-23 · SJ-24</div>',
  );
  html = html.replace(
    '<h4>案例卷 · 占位（含分裂期）</h4>\n    <p>SJ-05 变法改革；SJ-06 盛衰拐点；SJ-07 王朝崩解；SJ-08 分裂—重整。统一输出史鉴台账字段。</p>',
    `<h4>案例卷 · 首轮收束</h4>
    <p><a href="./SJ-05.html" style="color:var(--sj-celadon)">SJ-05 王安石变法</a>（台账七字段首验）· <a href="./SJ-06.html" style="color:var(--sj-celadon)">SJ-06 天宝之乱</a>（拐点样板）· <a href="./SJ-07.html" style="color:var(--sj-celadon)">SJ-07 崩解对比</a>（跨案矩阵）· <a href="./SJ-08.html" style="color:var(--sj-celadon)">SJ-08 五代十国</a>（分裂重整）。单案卷统一输出史鉴台账七字段。</p>`,
  );
  html = html.replace(
    '<h4>古今映射卷 · 占位</h4>\n    <p>SJ-20 政治 · SJ-21 经济 · SJ-22 文化 · SJ-23 社会 · SJ-24 外交。禁止缺「关键差异」栏的裸类比。</p>',
    `<h4>古今映射卷 · 开篇</h4>
    <p><a href="./SJ-20.html" style="color:var(--sj-celadon)">SJ-20 政治映射</a> · <a href="./SJ-21.html" style="color:var(--sj-celadon)">SJ-21 经济映射</a> 已交付 v0.1；SJ-22 文化 · SJ-23 社会 · SJ-24 外交 规划中。每条映射强制相似机制与关键差异双栏。</p>`,
  );
  html = html.replace(
    '本轮卡片仅作页内锚点占位，不跳转外部模块。',
    '卡片链至已交付卷页；未交付条目仍保留占位锚点。',
  );
  write('SJ-00.html', html);
  console.log('patched SJ-00 nav');
}

for (const v of VOLUMES) patchVolume(`${v}.html`);
patchPreviews();
patchSJ00();
