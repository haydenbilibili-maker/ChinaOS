#!/usr/bin/env node
/** Patch SJ-18/19 matrix HTML from SJ-16/17 templates */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../app/public/shijian');
const PAGES = path.resolve(import.meta.dirname, '../app/src/modules/shijian');

// --- SJ-18 拐点谱系 ---
let s18 = fs.readFileSync(path.join(OUT, 'SJ-18.html'), 'utf8');
s18 = s18.replace(/sj-16/g, 'sj-18').replace(/SJ-16/g, 'SJ-18');
s18 = s18.replace(/变法谱系矩阵/g, '拐点谱系矩阵');
s18 = s18.replace(/五变法跨案对比 · 改革的两难/g, '三拐点跨案对比 · 鼎盛隐性危机');
s18 = s18.replace(/案例库综合层 · 变法谱系/g, '案例库综合层 · 拐点谱系');
s18 = s18.replace(/五场变法，同一逻辑/g, '三场拐点，同一逻辑');
s18 = s18.replace(
  /<p class="sj-18-prose">变法是[\s\S]*?<\/p>\s*<p class="sj-18-prose">另一条贯穿线[\s\S]*?<\/p>/,
  `<p class="sj-18-prose">拐点是<strong>鼎盛顶点的隐性危机</strong>（母本规律一）：表面盛世，实则某一力被过度强化或慢变量（人口/僵化）积累。天宝强化军事外包、康乾人口逼近承载、贞观埋府兵隐患——三案并置，「盛世即拐点」清晰可见：<strong>显性拐点急崩，隐性拐点慢酿。</strong></p>
  <p class="sj-18-prose">另一条贯穿线是<strong>强化的单力</strong>：强化边疆军事力（天宝）或忽视基座承载（康乾）或五力协同下埋隐患（贞观），皆指向 SJ-06 同源逻辑——单力强化反降整体稳定。</p>`
);
s18 = s18.replace(/02 · 签名视觉[\s\S]*?<h2 id="h-matrix">变法谱系矩阵<\/h2>/, '02 · 签名视觉</span><h2 id="h-matrix">拐点谱系矩阵</h2>');
s18 = s18.replace(
  /行为五场变法[\s\S]*?点击任一行展开该案的汲取工具、死穴与印证规律。/,
  '行为三场拐点案（按时序）。列示<strong>主导力</strong>、<strong>强化的单力</strong>、<strong>隐性程度</strong>、<strong>崩解距离</strong>。点击任一行展开该案机制与印证规律。'
);
// Replace SVG rows section - find between column headers and legend
const s18svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 560" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">拐点谱系矩阵</title>
  <desc id="sj-desc">三行为天宝、康乾、贞观；列示主导力、强化单力、隐性程度、崩解距离。</desc>
  <defs>
    <radialGradient id="sj-glow" cx="50%" cy="34%" r="72%"><stop offset="0%" stop-color="var(--sj-ink-800)"/><stop offset="100%" stop-color="var(--sj-ink-900)"/></radialGradient>
    <pattern id="sj-xuan" width="8" height="14" patternUnits="userSpaceOnUse"><line x1="0" y1="1" x2="8" y2="1" stroke="var(--sj-paper-100)" stroke-width="0.4" opacity="0.35"/></pattern>
  </defs>
  <rect width="820" height="560" fill="url(#sj-glow)"/>
  <rect x="44" y="96" width="732" height="392" fill="url(#sj-xuan)" opacity="0.05"/>
  <g aria-hidden="true" opacity="0.7">
    <rect x="16" y="104" width="12" height="392" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="20" y="108" width="4" height="384" rx="2" fill="var(--sj-line)"/>
    <rect x="792" y="104" width="12" height="392" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="796" y="108" width="4" height="384" rx="2" fill="var(--sj-line)"/>
  </g>
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600" font-family="Songti SC,serif">拐点谱系矩阵</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono,monospace">SJ-18 · 三拐点跨案对比 · 综合层</text>
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC,serif">朱批：显性急崩 · 隐性慢酿 · 强化单力反降稳定</text>
  <text x="60" y="150" fill="var(--sj-paper-300)" font-size="11" font-family="Source Han Mono,monospace">拐点 · 朝代</text>
  <text x="280" y="150" text-anchor="middle" fill="var(--sj-paper-300)" font-size="11">主导力</text>
  <text x="440" y="150" text-anchor="middle" fill="var(--sj-paper-300)" font-size="11">强化单力</text>
  <text x="580" y="150" text-anchor="middle" fill="var(--sj-paper-300)" font-size="11">隐性程度</text>
  <text x="720" y="150" text-anchor="middle" fill="var(--sj-paper-300)" font-size="11">崩解距离</text>
  <line x1="44" y1="164" x2="776" y2="164" stroke="var(--sj-line)"/>
  <g class="sj-row" data-id="tianbao" tabindex="0" role="button"><rect x="44" y="170" width="732" height="56" rx="6" fill="var(--sj-ink-800)" opacity="0.3" pointer-events="all"/>
    <text x="60" y="194" fill="var(--sj-paper-100)" font-size="14">天宝之乱</text><text x="60" y="212" fill="var(--sj-paper-300)" font-size="9">唐 · SJ-06</text>
    <text x="280" y="202" text-anchor="middle" fill="var(--sj-vermil)" font-size="12">mil</text>
    <text x="440" y="202" text-anchor="middle" fill="var(--sj-vermil)" font-size="12">节度使</text>
    <text x="580" y="202" text-anchor="middle" fill="var(--sj-ochre)" font-size="12">显性</text>
    <text x="720" y="202" text-anchor="middle" fill="var(--sj-vermil)" font-size="12">短（14年）</text></g>
  <g class="sj-row" data-id="kangqian" tabindex="0" role="button"><rect x="44" y="234" width="732" height="56" rx="6" fill="var(--sj-ink-800)" opacity="0.16" pointer-events="all"/>
    <text x="60" y="258" fill="var(--sj-paper-100)" font-size="14">康乾拐点</text><text x="60" y="276" fill="var(--sj-paper-300)" font-size="9">清 · SJ-49</text>
    <text x="280" y="266" text-anchor="middle" fill="var(--sj-ochre)" font-size="12">base</text>
    <text x="440" y="266" text-anchor="middle" fill="var(--sj-paper-300)" font-size="12">人口/僵化</text>
    <text x="580" y="266" text-anchor="middle" fill="var(--sj-celadon)" font-size="12">隐性</text>
    <text x="720" y="266" text-anchor="middle" fill="var(--sj-ochre)" font-size="12">长（嘉道）</text></g>
  <g class="sj-row" data-id="zhenguan" tabindex="0" role="button"><rect x="44" y="298" width="732" height="56" rx="6" fill="var(--sj-ink-800)" opacity="0.3" pointer-events="all"/>
    <text x="60" y="322" fill="var(--sj-paper-100)" font-size="14">贞观之治</text><text x="60" y="340" fill="var(--sj-paper-300)" font-size="9">唐 · SJ-38</text>
    <text x="280" y="330" text-anchor="middle" fill="var(--sj-celadon)" font-size="12">五力协同</text>
    <text x="440" y="330" text-anchor="middle" fill="var(--sj-ochre)" font-size="12">府兵隐患</text>
    <text x="580" y="330" text-anchor="middle" fill="var(--sj-celadon)" font-size="12">隐性</text>
    <text x="720" y="330" text-anchor="middle" fill="var(--sj-ochre)" font-size="12">中（→天宝）</text></g>
  <text x="764" y="509" text-anchor="end" fill="var(--sj-line)" font-size="9">viewBox 820×560</text>
</svg>`;
s18 = s18.replace(/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 820 560"[\s\S]*?<\/svg>/, s18svg);
s18 = s18.replace(
  /读法：五案有四案触动精英循环力[\s\S]*?皇权依赖三格者[\s\S]*?人亡即政废。/,
  '读法：三案皆在「盛世」相位埋拐点——天宝显性（军事单力强化）、康乾隐性（基座慢变量）、贞观协同下埋隐患。崩解距离与隐性程度负相关。'
);
s18 = s18.replace(/03 · 对比矩阵[\s\S]*?<h2 id="h-table">汲取工具[\s\S]*?<\/h2>/, '03 · 对比矩阵</span><h2 id="h-table">主导力 · 强化单力 · 隐性 · 崩解距离</h2>');
s18 = s18.replace(
  /<table class="sj-18-table">[\s\S]*?<\/table>/,
  `<table class="sj-18-table"><thead><tr><th>案例</th><th>主导力</th><th>强化/积累的单力</th><th>隐性程度</th><th>崩解距离</th><th>结局</th></tr></thead><tbody>
<tr><td>天宝之乱 SJ-06</td><td>mil</td><td>节度使军事外包</td><td>显性（盛世顶点急崩）</td><td>短</td><td class="fail">安史之乱</td></tr>
<tr><td>康乾拐点 SJ-49</td><td>base</td><td>人口逼近承载+文字狱僵化</td><td>隐性（鼎盛中积累）</td><td>长</td><td class="part">嘉道中衰</td></tr>
<tr><td>贞观之治 SJ-38</td><td>五力协同</td><td>府兵/节度使远因</td><td>隐性（上升期埋隐患）</td><td>中</td><td class="part">→ SJ-06</td></tr>
</tbody></table>`
);
s18 = s18.replace(/04 · 收束规律[\s\S]*?<h2 id="h-law">六案收束为四条变法规律<\/h2>/, '04 · 收束规律</span><h2 id="h-law">三案收束为四条拐点规律</h2>');
s18 = s18.replace(
  /<div class="sj-18-law">[\s\S]*?<\/div>\s*<p class="sj-18-note">四条规律回指母本第四部；本矩阵是其在变法类型上的实证收束[\s\S]*?<\/p>/,
  `<div class="sj-18-law">
    <article><div class="lh">规律 H1 · 盛世即拐点<span>母本§一</span></div><p>鼎盛顶点往往已积累崩解慢变量；「peak vs turning point」须区分。</p></article>
    <article><div class="lh">规律 H2 · 强化单力反降稳定<span>↔ SJ-06</span></div><p>天宝强化军事外包毁内重外轻平衡——与 SJ-33 淝水「扩张极限」同构。</p></article>
    <article><div class="lh">规律 H3 · 隐性拐点慢酿<span>康乾型</span></div><p>人口/僵化积累不即时爆发，但决定崩解距离——承 SJ-49→SJ-50 因果链。</p></article>
    <article><div class="lh">规律 H4 · 协同亦埋隐患<span>贞观型</span></div><p>五力协同上升期仍可在制度模块（府兵）埋远因——上升矩阵与拐点矩阵交界。</p></article>
  </div>
  <p class="sj-18-note">四条规律回指母本第四部规律一；本矩阵是 guaidian 类型的实证收束。成员深描见 SJ-06/38/49 单卷。</p>`
);
s18 = s18.replace(
  /<div class="sj-18-xref">[\s\S]*?<\/div>\s*<p class="sj-18-note">综合层进度[\s\S]*?<\/p>/,
  `<div class="sj-18-xref">
    <a href="/modules/shijian/sj-06"><div class="n">SJ-06 · 唐</div><h3>天宝之乱</h3><p>显性拐点·军事单力强化。</p></a>
    <a href="/modules/shijian/sj-49"><div class="n">SJ-49 · 清</div><h3>康乾拐点</h3><p>隐性拐点·基座慢变量。</p></a>
    <a href="/modules/shijian/sj-38"><div class="n">SJ-38 · 唐</div><h3>贞观之治</h3><p>上升期埋隐患→天宝。</p></a>
    <a href="/modules/shijian/sj-17"><div class="n">SJ-17 · 姊妹</div><h3>上升矩阵</h3><p>贞观亦为上升成员；双矩阵共读。</p></a>
    <a href="/modules/shijian/sj-07"><div class="n">SJ-07 · 姊妹</div><h3>崩解矩阵</h3><p>拐点下游为崩解。</p></a>
    <a href="/modules/shijian/sj-19"><div class="n">SJ-19 · 姊妹</div><h3>分裂矩阵</h3><p>综合层合璧。</p></a>
  </div>
  <p class="sj-18-note">综合层进度：崩解（SJ-07）· 变法（SJ-16）· 上升（SJ-17）· 拐点（SJ-18）· 分裂（SJ-19）已收。见《案例库-整体架构》§4。</p>`
);
s18 = s18.replace(
  /const BF_DATA = \{[\s\S]*?\};/,
  `const GD_DATA = {
    tianbao: { name:'天宝之乱 · 唐', tool:'节度使军事外包、募兵、内轻外重（755 安史）',
      law:'显性拐点·强化 mil 单力。玄宗晚年怠政+杨国忠堵塞中枢。印证 H1+H2。崩解距离短。' },
    kangqian: { name:'康乾拐点 · 清', tool:'摊丁入亩、十全武功、人口爆炸〔估算〕、文字狱',
      law:'隐性拐点·base 逼近承载+僵化积累。盛世绩效掩盖慢变量。印证 H1+H3。崩解距离长→嘉道。' },
    zhenguan: { name:'贞观之治 · 唐', tool:'五力协同、天可汗、均田科举（627–649）',
      law:'上升期埋隐患·府兵制坏→节度使。与 SJ-17 上升矩阵交界。印证 H4。崩解距离中。' }
  };`
);
s18 = s18.replace(/BF_DATA/g, 'GD_DATA').replace(/变法谱系 · 跨案/g, '拐点谱系 · 跨案');
s18 = s18.replace(/aside-tool/g, 'aside-tool').replace(/汲取工具：/g, '机制链：');
s18 = s18.replace(/sj-17">上升矩阵/g, 'sj-19">分裂矩阵');
s18 = s18.replace(/AS_OF 2026-07-15/g, 'AS_OF 2026-07-15 · Round 4');
fs.writeFileSync(path.join(OUT, 'SJ-18.html'), s18);

// --- SJ-19 分裂—重整 ---
let s19 = fs.readFileSync(path.join(OUT, 'SJ-19.html'), 'utf8');
s19 = s19.replace(/sj-17/g, 'sj-19').replace(/SJ-17/g, 'SJ-19');
s19 = s19.replace(/上升奠基矩阵/g, '分裂—重整矩阵');
s19 = s19.replace(/四上升奠基跨案 · 盛世埋隐患同源/g, '四分裂期跨案对比 · 军事定正统与过度矫正');
s19 = s19.replace(/案例库综合层 · 上升奠基/g, '案例库综合层 · 分裂重整');
s19 = s19.replace(/四案上升奠基，同一隐患逻辑/g, '四案分裂重整，同一逻辑');
s19 = s19.replace(
  /<p class="sj-19-prose">上升奠基是[\s\S]*?<\/p>\s*<p class="sj-19-prose">本矩阵与 SJ-07[\s\S]*?<\/p>/,
  `<p class="sj-19-prose">分裂期是<strong>军事力畸大、合法性归零</strong>的相位（母本规律二）：「兵强马壮者为天子」后，重整者往往以反向设计再统一，却易过度矫正埋下下一病灶（SJ-08→SJ-41 积弱）。四案并置：五代制度轮替、官渡单战锁定、淝水误判崩盘、孝文帝合法性重建。</p>
  <p class="sj-19-prose">本矩阵与 SJ-08 分裂期链直接衔接，成员含 SJ-31/33/34 Round 3 分裂期四案中的三卷+五代综合样本。</p>`
);
const s19svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 560" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">分裂—重整矩阵</title>
  <desc id="sj-desc">四行为五代、官渡、淝水、孝文帝；列示畸大之力、合法性归零度、再统一路径、过度矫正。</desc>
  <defs><radialGradient id="sj-glow" cx="50%" cy="34%" r="72%"><stop offset="0%" stop-color="var(--sj-ink-800)"/><stop offset="100%" stop-color="var(--sj-ink-900)"/></radialGradient>
  <pattern id="sj-xuan" width="8" height="14" patternUnits="userSpaceOnUse"><line x1="0" y1="1" x2="8" y2="1" stroke="var(--sj-paper-100)" stroke-width="0.4" opacity="0.35"/></pattern></defs>
  <rect width="820" height="560" fill="url(#sj-glow)"/>
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600">分裂—重整矩阵</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono,monospace">SJ-19 · 四分裂期跨案 · 综合层</text>
  <text x="60" y="150" fill="var(--sj-paper-300)" font-size="11">案例</text>
  <text x="260" y="150" text-anchor="middle" fill="var(--sj-paper-300)" font-size="11">畸大之力</text>
  <text x="420" y="150" text-anchor="middle" fill="var(--sj-paper-300)" font-size="11">合法性归零</text>
  <text x="580" y="150" text-anchor="middle" fill="var(--sj-paper-300)" font-size="11">再统一路径</text>
  <text x="720" y="150" text-anchor="middle" fill="var(--sj-paper-300)" font-size="11">过度矫正</text>
  <line x1="44" y1="164" x2="776" y2="164" stroke="var(--sj-line)"/>
  <g class="sj-row" data-id="wudai" tabindex="0" role="button"><rect x="44" y="170" width="732" height="48" rx="6" fill="var(--sj-ink-800)" opacity="0.3"/>
    <text x="60" y="198" fill="var(--sj-paper-100)" font-size="13">五代十国 SJ-08</text>
    <text x="260" y="198" text-anchor="middle" fill="var(--sj-vermil)">mil</text>
    <text x="420" y="198" text-anchor="middle" fill="var(--sj-vermil)">高</text>
    <text x="580" y="198" text-anchor="middle" fill="var(--sj-celadon)">宋重文抑武</text>
    <text x="720" y="198" text-anchor="middle" fill="var(--sj-ochre)">积弱</text></g>
  <g class="sj-row" data-id="guandu" tabindex="0" role="button"><rect x="44" y="226" width="732" height="48" rx="6" fill="var(--sj-ink-800)" opacity="0.16"/>
    <text x="60" y="254" fill="var(--sj-paper-100)" font-size="13">官渡之战 SJ-31</text>
    <text x="260" y="254" text-anchor="middle" fill="var(--sj-vermil)">mil</text>
    <text x="420" y="254" text-anchor="middle" fill="var(--sj-ochre)">中</text>
    <text x="580" y="254" text-anchor="middle" fill="var(--sj-celadon)">曹魏锁定北方</text>
    <text x="720" y="254" text-anchor="middle" fill="var(--sj-paper-300)">—</text></g>
  <g class="sj-row" data-id="feishui" tabindex="0" role="button"><rect x="44" y="282" width="732" height="48" rx="6" fill="var(--sj-ink-800)" opacity="0.3"/>
    <text x="60" y="310" fill="var(--sj-paper-100)" font-size="13">淝水之战 SJ-33</text>
    <text x="260" y="310" text-anchor="middle" fill="var(--sj-vermil)">mil</text>
    <text x="420" y="310" text-anchor="middle" fill="var(--sj-vermil)">高（前秦）</text>
    <text x="580" y="310" text-anchor="middle" fill="var(--sj-paper-300)">南北对峙</text>
    <text x="720" y="310" text-anchor="middle" fill="var(--sj-paper-300)">—</text></g>
  <g class="sj-row" data-id="xiaowen" tabindex="0" role="button"><rect x="44" y="338" width="732" height="48" rx="6" fill="var(--sj-ink-800)" opacity="0.16"/>
    <text x="60" y="366" fill="var(--sj-paper-100)" font-size="13">孝文帝改革 SJ-34</text>
    <text x="260" y="366" text-anchor="middle" fill="var(--sj-paper-100)">legit</text>
    <text x="420" y="366" text-anchor="middle" fill="var(--sj-celadon)">重建</text>
    <text x="580" y="366" text-anchor="middle" fill="var(--sj-celadon)">汉化融合</text>
    <text x="720" y="366" text-anchor="middle" fill="var(--sj-vermil)">六镇</text></g>
</svg>`;
s19 = s19.replace(/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 820 560"[\s\S]*?<\/svg>/, s19svg);
s19 = s19.replace(
  /const SS_DATA = \{[\s\S]*?\};/,
  `const FZ_DATA = {
    wudai: { name:'五代十国', mod:'军事力畸大、合法性归零、制度性轮替',
      risk:'重整：宋杯酒释兵权/重文抑武。过度矫正→积弱→靖康（SJ-41）。印证 F1+F4。' },
    guandu: { name:'官渡之战 · 200', mod:'区域军事决胜、组织度>资源盘',
      risk:'单战锁定北方格局，非制度重整。印证 F2（军事决胜型）。' },
    feishui: { name:'淝水之战 · 383', mod:'军事扩张极限、多民族拼凑士气链脆弱',
      risk:'一战崩盘、南北对峙锁定。印证 F2+F3（误判型）。' },
    xiaowen: { name:'孝文帝改革', mod:'汉化、均田、迁都洛阳——合法性叙事重建',
      risk:'融合奠基亦埋六镇之乱。印证 F3（合法性重建型）+ 过度矫正。' }
  };`
);
s19 = s19.replace(/SS_DATA/g, 'FZ_DATA').replace(/上升奠基 · 跨案/g, '分裂重整 · 跨案');
s19 = s19.replace(/制度模块：/g, '机制：');
s19 = s19.replace(/aside-mod/g, 'aside-mod').replace(/aside-risk/g, 'aside-risk');
s19 = s19.replace(/AS_OF 2026-07-15/g, 'AS_OF 2026-07-15 · Round 4');
fs.writeFileSync(path.join(OUT, 'SJ-19.html'), s19);

// Page components
for (const [num, title, sub] of [['18','拐点谱系矩阵','三拐点跨案对比 · 鼎盛隐性危机'],['19','分裂—重整矩阵','四分裂期跨案 · 军事定正统与过度矫正']]) {
  fs.writeFileSync(path.join(PAGES, `Sj${num}Page.jsx`), `import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj${num}Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ${num}"
      badge="SJ-${num} · 史鉴"
      title="${title}"
      subtitle="${sub}"
      htmlSrc="/shijian/SJ-${num}.html"
      frameTitle="SJ-${num} ${title}"
      hintLinks={[{ href: '/shijian/SJ-${num}.html', label: '/shijian/SJ-${num}.html' }]}
    />
  );
}
`, 'utf8');
}

console.log('Patched SJ-18/19 matrices');
