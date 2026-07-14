#!/usr/bin/env node
/** Generate SJ-22/23/24 mapping volumes from shared template (母本第五部). */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const CSS = String.raw`:root{
  --sj-ink-900:#14110f;--sj-ink-800:#1d1916;--sj-paper-100:#e8ddc7;--sj-paper-300:#cdbe9f;
  --sj-vermil:#a83b2c;--sj-celadon:#5f7a6f;--sj-ochre:#b8894a;--sj-line:#3a322b;
  --sj-radius:6px;--sj-space:clamp(12px,2vw,24px);
  --sj-serif:"Songti SC","Noto Serif SC","Source Han Serif SC",serif;
  --sj-mono:"Source Han Mono","JetBrains Mono",ui-monospace,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{min-height:100vh;background:radial-gradient(1000px 560px at 72% -8%, #2a221c 0%, transparent 55%),radial-gradient(700px 420px at 8% 90%, #1a1612 0%, transparent 50%),var(--sj-ink-900);color:var(--sj-paper-100);font-family:var(--sj-serif);line-height:1.75}
.P-wrap{max-width:min(1180px,100%);margin:0 auto;padding:var(--sj-space) var(--sj-space) 48px}
@media (min-width:1536px){.P-wrap{max-width:min(1360px,100%)}}
@keyframes sj-fade-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.sj-reveal-stagger > header,.sj-reveal-stagger > .sj-zhupi,.sj-reveal-stagger > [class*="-sec"],.sj-reveal-stagger > footer{animation:sj-fade-in .34s cubic-bezier(.22,.61,.36,1) both}
.sj-reveal-stagger > *:nth-child(1){animation-delay:.03s}.sj-reveal-stagger > *:nth-child(2){animation-delay:.06s}
.sj-reveal-stagger > *:nth-child(3){animation-delay:.09s}.sj-reveal-stagger > *:nth-child(4){animation-delay:.12s}
.sj-reveal-stagger > *:nth-child(5){animation-delay:.15s}.sj-reveal-stagger > *:nth-child(6){animation-delay:.18s}
.sj-reveal-stagger > *:nth-child(7){animation-delay:.21s}.sj-reveal-stagger > *:nth-child(8){animation-delay:.24s}
.P-mast{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;padding-bottom:16px;border-bottom:1px solid var(--sj-line);margin-bottom:20px}
.P-mast .badge{font-family:var(--sj-mono);font-size:11px;letter-spacing:.18em;color:var(--sj-ochre);margin-bottom:6px}
.P-mast h1{font-size:clamp(22px,3vw,28px);font-weight:600;letter-spacing:.16em;line-height:1.3}
.P-mast h1 em{font-style:normal;color:var(--sj-paper-300);font-weight:400;letter-spacing:.08em;font-size:.72em;display:block;margin-top:4px}
.P-meta{font-family:var(--sj-mono);font-size:11px;color:var(--sj-paper-300);text-align:right;line-height:1.7}
.P-meta b{color:var(--sj-ochre);font-weight:500}
.P-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.P-chip{display:inline-block;font-family:var(--sj-mono);font-size:10px;letter-spacing:.08em;color:var(--sj-celadon);border:1px solid var(--sj-line);padding:3px 8px;border-radius:var(--sj-radius);text-decoration:none}
.P-chip:hover,.P-chip:focus-visible{border-color:var(--sj-ochre);color:var(--sj-ochre);outline:none}
.sj-zhupi{color:var(--sj-vermil);font-size:13.5px;margin:0 0 18px;padding-left:12px;border-left:2px solid var(--sj-vermil);max-width:76ch}
.P-sec{margin:36px 0 28px;scroll-margin-top:24px}
.P-sec-h{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--sj-line)}
.P-sec-h .num{font-family:var(--sj-mono);font-size:11px;letter-spacing:.2em;color:var(--sj-ochre)}
.P-sec-h h2{font-size:clamp(17px,2.2vw,20px);font-weight:600;letter-spacing:.12em}
.P-prose{font-size:15.5px;color:var(--sj-paper-100);max-width:76ch}.P-prose+.P-prose{margin-top:12px}
.P-prose strong{color:var(--sj-ochre);font-weight:600}
.P-note{font-size:13px;color:var(--sj-paper-300);margin-top:12px;max-width:76ch}.P-note b{color:var(--sj-paper-100);font-weight:600}
.P-stage{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900));box-shadow:0 1px 0 rgba(232,221,199,.04),0 18px 48px rgba(0,0,0,.45);padding:8px 8px 4px;overflow:auto}
.P-stage svg{display:block;width:100%;height:auto;max-width:820px;margin:0 auto}
.sj-row{cursor:pointer;transition:opacity .2s ease}.sj-row:focus-visible{outline:2px solid var(--sj-ochre);outline-offset:2px}
.P-stage.is-picking .sj-row{opacity:.38}.P-stage.is-picking .sj-row.is-hot{opacity:1}
.P-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,300px);gap:14px;align-items:start;margin-top:14px}
.P-aside{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900));padding:14px 16px;position:sticky;top:12px;min-height:200px}
.P-aside .k{font-family:var(--sj-mono);font-size:10px;letter-spacing:.16em;color:var(--sj-ochre);margin-bottom:6px}
.P-aside h3{font-size:15px;letter-spacing:.06em;margin-bottom:8px}
.P-aside p{font-size:13px;color:var(--sj-paper-300);line-height:1.65;margin-bottom:6px}
.P-aside p b.same{color:var(--sj-celadon)}.P-aside p b.diff{color:var(--sj-ochre)}
.P-aside-empty{font-size:13px;color:var(--sj-paper-300);opacity:.85}
.P-pair{display:grid;gap:12px;margin-top:6px}
.P-pair article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:16px 18px}
.P-pair .ph{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px;font-size:15px;font-weight:600;letter-spacing:.04em}
.P-pair .ph .gu{color:var(--sj-paper-100)}.P-pair .ph .arrow{color:var(--sj-ochre);font-family:var(--sj-mono)}
.P-pair .ph .jin{color:var(--sj-celadon)}.P-pair .ph .force{margin-left:auto;font-family:var(--sj-mono);font-size:10px;letter-spacing:.1em;color:var(--sj-paper-300);border:1px solid var(--sj-line);border-radius:20px;padding:2px 10px}
.P-pair .cols{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.P-pair .col{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-900);padding:12px 14px}
.P-pair .col .ch{font-family:var(--sj-mono);font-size:10px;letter-spacing:.12em;margin-bottom:6px}
.P-pair .col.same .ch{color:var(--sj-celadon)}.P-pair .col.diff .ch{color:var(--sj-ochre)}
.P-pair .col p{font-size:13px;color:var(--sj-paper-100);line-height:1.65}.P-pair .col p .lk{color:var(--sj-celadon)}
.P-refute{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}
.P-refute article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.P-refute .rh{font-size:14px;font-weight:600;color:var(--sj-ochre);margin-bottom:6px}
.P-refute p{font-size:13px;color:var(--sj-paper-300);line-height:1.65}
.P-xref{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
.P-xref a{display:block;border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px;text-decoration:none;color:inherit;transition:border-color .18s}
.P-xref a:hover,.P-xref a:focus-visible{border-color:var(--sj-ochre);outline:none}
.P-xref .n{font-family:var(--sj-mono);font-size:10px;letter-spacing:.14em;color:var(--sj-ochre);margin-bottom:4px}
.P-xref h3{font-size:14px;letter-spacing:.06em;margin-bottom:6px}.P-xref p{font-size:12.5px;color:var(--sj-paper-300);line-height:1.6}
.P-foot{margin-top:40px;padding-top:14px;border-top:1px solid var(--sj-line);font-family:var(--sj-mono);font-size:10px;color:var(--sj-paper-300);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
.P-foot a{color:var(--sj-celadon);text-decoration:none}.P-foot a:hover{color:var(--sj-ochre)}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.sj-reveal-stagger>*{animation:none}.sj-row,.P-chip{transition:none}}
@media (max-width:900px){.P-layout{grid-template-columns:1fr}.P-aside{position:static}.P-refute{grid-template-columns:1fr}.P-xref{grid-template-columns:1fr 1fr}}
@media (max-width:768px){.P-meta{text-align:left}.P-xref{grid-template-columns:1fr}.P-pair .cols{grid-template-columns:1fr}}
html[data-theme="light"]{--sj-ink-900:#f4f1ea;--sj-ink-800:#ebe6dc;--sj-paper-100:#1a1814;--sj-paper-300:#5a5348;--sj-vermil:#9a3428;--sj-celadon:#3f5f54;--sj-ochre:#8a6528;--sj-line:#c8bfb0}
html[data-theme="light"] body{background:radial-gradient(1000px 560px at 72% -8%, #e8e4da 0%, transparent 55%),radial-gradient(700px 420px at 8% 90%, #ebe6dc 0%, transparent 50%),var(--sj-ink-900);color:var(--sj-paper-100)}`;

const THEME_SCRIPT = String.raw`<script>
(function(){
  var MSG='c2os-sj-theme';
  function apply(t){ document.documentElement.setAttribute('data-theme', t==='light' ? 'light' : 'dark'); }
  try{ var q=new URLSearchParams(location.search).get('theme'); if(q==='light'||q==='dark') apply(q); }catch(e){}
  window.addEventListener('message', function(e){
    if(e.origin !== window.location.origin) return;
    var d=e&&e.data; if(!d||d.type!==MSG) return; apply(d.theme); });
})();
</script>`;

function svgRow(id, y, color, guMain, guSub, jinMain, jinSub, label) {
  const cy = y + 43;
  return `
  <g class="sj-row" data-id="${id}" tabindex="0" role="button" aria-label="${label}">
    <rect x="44" y="${y}" width="732" height="86" rx="8" fill="var(--sj-ink-800)" opacity="0.3" pointer-events="all"/>
    <rect x="56" y="${y + 16}" width="248" height="54" rx="6" fill="var(--sj-ink-800)" stroke="var(${color})" stroke-width="1.8"/>
    <text x="180" y="${y + 40}" text-anchor="middle" fill="var(${color})" font-size="14" font-family="Songti SC, Noto Serif SC, serif">${guMain}</text>
    <text x="180" y="${y + 58}" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC, Noto Serif SC, serif">${guSub}</text>
    <line x1="304" y1="${cy}" x2="384" y2="${cy}" stroke="var(--sj-ochre)" stroke-width="1.6" marker-end="url(#a-map)"/>
    <circle cx="410" cy="${cy}" r="18" fill="var(--sj-ink-900)" stroke="var(--sj-ochre)" stroke-width="1.4"/>
    <text x="410" y="${cy + 5}" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-family="Source Han Mono, JetBrains Mono, ui-monospace, monospace">Δ</text>
    <line x1="436" y1="${cy}" x2="516" y2="${cy}" stroke="var(--sj-ochre)" stroke-width="1.6" marker-end="url(#a-map)"/>
    <rect x="516" y="${y + 16}" width="248" height="54" rx="6" fill="var(--sj-ink-800)" stroke="var(${color})" stroke-width="1.8"/>
    <text x="640" y="${y + 40}" text-anchor="middle" fill="var(${color})" font-size="14" font-family="Songti SC, Noto Serif SC, serif">${jinMain}</text>
    <text x="640" y="${y + 58}" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC, Noto Serif SC, serif">${jinSub}</text>
  </g>`;
}

function pairArticle(gu, jin, force, same, diff) {
  return `<article>
      <div class="ph"><span class="gu">${gu}</span><span class="arrow">→</span><span class="jin">${jin}</span><span class="force">${force}</span></div>
      <div class="cols">
        <div class="col same"><div class="ch">相似机制（古今相通）</div><p>${same}</p></div>
        <div class="col diff"><div class="ch">关键差异（不可裸类比）</div><p>${diff}</p></div>
      </div>
    </article>`;
}

function xrefCard(href, n, h3, p) {
  return `<a href="${href}"><div class="n">${n}</div><h3>${h3}</h3><p>${p}</p></a>`;
}

const VOLS = [
  {
    num: '22', prefix: 'sj-22', domain: '文化', force: '合法性叙事力',
    title: '文化映射 · 古今对照',
    subtitle: '象征通胀 · 文教投入 · 思想边界 · 意识形态再生产',
    desc: 'ChinaOS 史鉴系列古今映射卷·文化：天命正统→意识形态叙事、文教象征→文化软实力、文字狱→内容治理三组对照。合法性叙事力，禁裸类比。',
    zhupi: '朱批：文化域映射的核心是<b>合法性叙事力</b>（SJ-03 五力之一）。历代以天命、正统、文教象征投入巩固合法；绩效枯竭时转向象征通胀，文字狱则是管理意识形态与现实落差的极端形态。本卷是分析读法，非价值判断；第 05 节并陈相反意见。真源：《母本》第五部文化行。',
    intro1: '合法性叙事力是五力中负责「解释为何应被统治」的一力。文化域因此聚焦<strong>象征与叙事的再生产</strong>：天命、正统、文教投入与文字狱，构成一套管理绩效—象征平衡的工具箱。',
    intro2: '本卷延续「规律同构，参数迥异」：绩效枯竭时加大象征投入、象征通胀加速话语贬值——古今同构；但现代传播技术 + 组织化宣传使叙事再生产能力远超古代（↔ <span class="lk">GY-02</span>）。',
    svgTitle: '文化', svgSub: '左=历史叙事工具 右=当代形态',
    svgFoot: '规律同构 · 参数迥异 —— 差异来自传播工业化 + 组织化再生产（↔ GY-02）',
    colorNote: '色义：合法性/正统=宣纸白 · 文教=青瓷 · 管控=朱红。差异闸（Δ）：每组映射必须交代关键差异方成立。',
    rows: [
      { id: 'tianming', y: 158, color: '--sj-paper-100', guMain: '天命 · 正统', guSub: '禅让 · 五德终始', jinMain: '绩效+意识形态', jinSub: '发展 · 复兴 · 制度自信', label: '天命正统 映射',
        same: '合法性有「绩效」与「象征」两个来源；绩效枯竭时系统倾向加大象征投入，而象征通胀会加速话语贬值。正统论争（如三国魏蜀）对应当代叙事竞争——机制古今同构。',
        diff: '现代传播技术 + 组织化叙事再生产能力远超古代；合法性来源更多元且可量化监测。象征通胀的<strong>贬值规律不变</strong>，但叙事的生产/分发已工业化（↔ <span class="lk">GY-02</span> 五组件合法性机器）。' },
      { id: 'wenjiao', y: 252, color: '--sj-celadon', guMain: '文教象征投入', guSub: '祭孔 · 科举附庸', jinMain: '文化软实力 · 国潮', jinSub: '短剧出海 · 文化贸易', label: '文教象征 映射',
        same: '国家以文教象征投入换取认同与秩序：祭孔、修史、科举附庸的文教体系，对应当代文化出口、国潮与软实力建设。象征投入是合法性叙事力的「硬支出」。',
        diff: '当代文化生产身处全球文化产业与平台算法分发，受众可选择性远超古代；象征投入的目标从「教化臣民」扩展为「对外叙事竞争」。相似的是象征换认同，不同的是市场与全球约束。' },
      { id: 'wenziyu', y: 346, color: '--sj-vermil', guMain: '文字狱 · 党禁', guSub: '思想边界 · 异端管控', jinMain: '内容治理 · 语义边界', jinSub: '平台规则 · 舆论场', label: '文字狱 映射',
        same: '当意识形态与现实落差扩大，系统倾向收紧思想边界以管理张力：清代文字狱、明代党禁，对应当代对内容边界、舆论场的治理逻辑——管理「说什么」以降低合法性风险。',
        diff: '现代信息环境去中心化、跨境传播，边界治理须借助平台技术而非仅靠刑名；且存在公开规则与执行弹性并置。相似的是「落差→收紧」，不同的是工具与约束条件。' },
    ],
    pairs: [
      ['天命 · 正统叙事', '绩效+意识形态合法性', '合法性叙事力',
        '合法性有绩效与象征两个来源；绩效枯竭时加大象征投入，象征通胀加速话语贬值——古今同构。',
        '现代传播+组织化再生产能力远超古代；合法性来源更多元。贬值规律不变，生产分发已工业化（↔ <span class="lk">GY-02</span>）。'],
      ['文教象征投入', '文化软实力 · 国潮出海', '合法性叙事力',
        '国家以文教象征投入换取认同：祭孔、修史、科举附庸 ↔ 当代文化出口、国潮与软实力。象征投入是合法性的硬支出。',
        '当代身处全球文化产业与平台分发，受众可选择性远超古代；目标从教化臣民扩展为对外叙事竞争。相似的是象征换认同，不同的是市场约束。'],
      ['文字狱 · 思想管控', '内容治理 · 语义边界', '意识形态落差管理',
        '意识形态与现实落差扩大时收紧思想边界：文字狱、党禁 ↔ 当代内容边界与舆论场治理——管理「说什么」以降低合法性风险。',
        '现代信息去中心化、跨境传播，边界治理须借助平台技术；存在公开规则与执行弹性并置。相似的是落差→收紧，不同的是工具箱。'],
    ],
    meta1: '三组对照的「关键差异」共享同一根源：现代<strong>传播工业化</strong>与<strong>组织化叙事再生产</strong>（↔ GY-02），使象征投入可规模化、可精准分发。',
    meta2: '但两样没变：<strong>象征通胀的贬值规律</strong>与<strong>绩效—象征的平衡张力</strong>。文化域的断言收束为：<strong>规律同构，参数迥异</strong>。',
    refute: [
      ['批评一：文化即意识形态的简化', '反对者认为，把文化政策一律读作「合法性工具」忽略了审美自主、市场创意与民间文化生态——本卷以机制层对照，但是否过度政治化解读，可争论。'],
      ['批评二：文字狱类比的敏感性', '「文字狱↔内容治理」触及当代敏感议题，本卷强制双栏以降低裸类比风险，但不宣称价值中立——它是一种分析读法。'],
    ],
    chips: [['./SJ-00.html', '↔ SJ-00 总索引'], ['./SJ-03.html', '↔ SJ-03 五力·合法性'], ['./SJ-20.html', '↔ SJ-20 政治映射'], ['./SJ-21.html', '↔ SJ-21 经济映射'], ['/modules/yishixingtai', '↔ GY-02 合法性机器']],
    xrefs: [
      ['./SJ-03.html', 'SJ-03 · 五力', '合法性叙事力', '合法性叙事力的定义、指标与象征通胀机制。'],
      ['./SJ-20.html', 'SJ-20 · 姊妹', '政治映射', '天命→绩效+意识形态一组的政治域姊妹篇。'],
      ['/modules/yishixingtai', 'GY-02 · 当代', '合法性机器', '合法性叙事力的当代形态：五组件合法性机器。'],
      ['/culture', 'GY · 当代', '文化软实力', '国潮、短剧出海与文化贸易的量化接口。'],
      ['./SJ-23.html', 'SJ-23 · 姊妹', '社会映射', '基座力承载维度：人口结构与社会张力。'],
      ['./SJ-00.html', 'SJ-00', '史鉴总索引', '映射卷入口；文化映射卡片已点亮本卷。'],
    ],
    footLink: ['./SJ-21.html', '经济映射'],
    mapTag: '文化',
    jsDataKey: 'tianming',
  },
  {
    num: '23', prefix: 'sj-23', domain: '社会', force: '生态—人口—技术基座力',
    title: '社会映射 · 古今对照',
    subtitle: '承载上限 · 流民变体 · 人口结构容错 · 慢变量约束',
    desc: 'ChinaOS 史鉴系列古今映射卷·社会：耕地承载→抚养比就业、流民→灵活就业、户籍编审→人口治理三组对照。基座力，禁裸类比。',
    zhupi: '朱批：社会域映射的核心是<b>生态—人口—技术基座力</b>（SJ-03 五力之一）。历代承载上限以耕地与户籍度量，流民是承载越阈的显性信号；当代承载维度变为抚养比、就业与内需。本卷是分析读法；第 05 节并陈相反意见。真源：《母本》第五部社会行。',
    intro1: '基座力是五力中最慢的变量——人口、耕地、生态承载决定系统<strong>容错空间</strong>。社会域因此聚焦承载上限与社会张力：当承载逼近阈值，流民、揭竿与当代的灵活就业、人口流动，是同一结构压力的不同显影。',
    intro2: '本卷延续「规律同构，参数迥异」：承载上限逼近→社会张力、人口结构决定容错——古今同构；但承载维度从「耕地」变为「抚养比/就业/内需」，流民变为人口流动与灵活就业（↔ <span class="lk">GY-05</span>）。',
    svgTitle: '社会', svgSub: '左=历史承载机制 右=当代形态',
    svgFoot: '规律同构 · 参数迥异 —— 承载维度从耕地变为抚养比/就业/内需',
    colorNote: '色义：承载/人口=赭金（基座）· 流民/流动=青瓷 · 户籍/治理=朱红。差异闸（Δ）：每组映射必须交代关键差异方成立。',
    rows: [
      { id: 'chengzai', y: 158, color: '--sj-ochre', guMain: '人口 · 耕地承载', guSub: '马尔萨斯压力 · 税役', jinMain: '抚养比 · 就业 · 内需', jinSub: '老龄化 · 少子化', label: '承载上限 映射',
        same: '承载上限逼近→社会张力；人口结构决定系统容错空间。历史上的「生齿日繁、地不加辟」对应当代抚养比抬升、就业压力与内需不足——慢变量约束古今同构。',
        diff: '承载维度从「耕地/粮食」变为「抚养比/就业/内需」；技术提升使粮食约束大幅缓解，但人口结构（老龄化、少子化）成为新瓶颈。相似的是承载逻辑，不同的是度量维度。' },
      { id: 'liumin', y: 252, color: '--sj-celadon', guMain: '流民 · 揭竿', guSub: '承载越阈 · 失序信号', jinMain: '人口流动 · 灵活就业', jinSub: '零工 · 农民工 · 新移民', label: '流民 映射',
        same: '承载越阈的人口以流动形式释放压力：历史上的流民、揭竿前奏，对应当代大规模人口流动、灵活就业与「悬空的基础设施」——压力未消失，只是形态改变。',
        diff: '现代户籍改革、社保扩面、平台经济使流动不再等同「脱籍失序」；但社会保障与流动性的错位仍在（↔ <span class="lk">GY-05</span> 零工经济）。相似的是承载越阈→流动，不同的是制度缓冲。' },
      { id: 'huji', y: 346, color: '--sj-vermil', guMain: '黄册 · 户籍编审', guSub: '人地绑定 · 基层掌控', jinMain: '人口统计 · 网格治理', jinSub: '数字身份 · 综治中心', label: '户籍 映射',
        same: '国家需掌握人口底数以分配税役、维持秩序：明代黄册、清代保甲，对应当代人口普查、网格化治理与综治中心——人口可见性是社会治理的前提。',
        diff: '现代数目字管理使人口统计精度质变，且与社保、信用、医疗等系统联通；治理目标从「税役绑定」扩展为「服务+管控」双轨。相似的是人口可见性需求，不同的是数据粒度与用途。' },
    ],
    pairs: [
      ['人口 · 耕地承载', '抚养比 · 就业 · 内需', '基座力',
        '承载上限逼近→社会张力；人口结构决定容错空间。「生齿日繁、地不加辟」↔ 抚养比抬升、就业压力与内需不足。',
        '承载维度从耕地/粮食变为抚养比/就业/内需；技术缓解粮食约束，但老龄化、少子化成新瓶颈。相似的是承载逻辑，不同的是度量维度。'],
      ['流民 · 揭竿', '人口流动 · 灵活就业', '基座力',
        '承载越阈的人口以流动释放压力：流民、揭竿前奏 ↔ 大规模人口流动、灵活就业与「悬空的基础设施」。',
        '户籍改革、社保扩面、平台经济使流动不再等同脱籍失序；但保障与流动性的错位仍在（↔ <span class="lk">GY-05</span>）。相似的是越阈→流动，不同的是制度缓冲。'],
      ['黄册 · 户籍编审', '人口统计 · 网格治理', '社会治理基座',
        '国家掌握人口底数以分配税役、维持秩序：黄册、保甲 ↔ 人口普查、网格化治理与综治中心。',
        '数目字管理使人口统计精度质变，与社保、信用等系统联通；目标从税役绑定扩展为服务+管控双轨。相似的是可见性需求，不同的是数据粒度。'],
    ],
    meta1: '三组对照的「关键差异」共享同一根源：当代<strong>数目字管理</strong>使人口与承载可精细计量，且<strong>承载维度本身已迁移</strong>（耕地→抚养比/就业）。',
    meta2: '但两样没变：<strong>慢变量的约束</strong>与<strong>承载越阈→社会张力</strong>的结构。社会域的断言收束为：<strong>规律同构，参数迥异</strong>。',
    refute: [
      ['批评一：马尔萨斯框架的过时', '反对者认为，技术进步已使经典马尔萨斯约束大幅缓解，用耕地承载类比当代社会张力可能高估同构。本卷以「度量维度迁移」部分回应，但断裂是否已使类比失效，可争论。'],
      ['批评二：流民—零工的过度简化', '把流民直接映射为零工/农民工忽略了历史暴力的差异与现代流动的复杂动机。本卷强调机制层（承载越阈→流动），但不否认经验层面的断裂。'],
    ],
    chips: [['./SJ-00.html', '↔ SJ-00 总索引'], ['./SJ-03.html', '↔ SJ-03 五力·基座'], ['/modules/renqun-tupu', '↔ GY-00 人群图谱'], ['/modules/linggong', '↔ GY-05 零工经济'], ['/demographic', '↔ 人口结构']],
    xrefs: [
      ['./SJ-03.html', 'SJ-03 · 五力', '基座力', '生态—人口—技术基座力的定义与慢变量约束。'],
      ['/modules/renqun-tupu', 'GY-00 · 当代', '人群画像总图谱', '基座力在当代的人群切片接口；58 片切片母索引。'],
      ['/modules/linggong', 'GY-05 · 当代', '零工经济', '流民变体：灵活就业与「悬空的基础设施」。'],
      ['/demographic', 'GY · 当代', '人口结构', '老龄化、少子化与抚养比的宏观读数。'],
      ['./SJ-22.html', 'SJ-22 · 姊妹', '文化映射', '合法性叙事力与社会张力的交互。'],
      ['./SJ-00.html', 'SJ-00', '史鉴总索引', '映射卷入口；社会映射卡片已点亮本卷。'],
    ],
    footLink: ['./SJ-22.html', '文化映射'],
    mapTag: '社会',
    jsDataKey: 'chengzai',
  },
  {
    num: '24', prefix: 'sj-24', domain: '外交', force: '边疆—军事力',
    title: '外交映射 · 古今对照',
    subtitle: '边疆周期 · 朝贡秩序 · 军费财政 · 秩序话语竞争',
    desc: 'ChinaOS 史鉴系列古今映射卷·外交：内亚游牧→海洋技术金融、朝贡体系→秩序话语、边饷军费→国防财政三组对照。边疆军事力，禁裸类比。',
    zhupi: '朱批：外交域映射的核心是<b>边疆—军事力</b>（SJ-03 五力之一）。历代北边军费与内亚游牧周期牵动财政；朝贡体系输出秩序话语。内亚威胁已消失，压力轴转向海洋与技术—金融。本卷是分析读法；第 05 节并陈相反意见。真源：《母本》第五部外交行。',
    intro1: '边疆—军事力负责系统与外部环境的能量交换。外交域因此聚焦<strong>边疆压力、秩序输出与军费—财政拉扯</strong>：内亚游牧周期、朝贡体系与边饷，构成古代外交—军事—财政的三角结构。',
    intro2: '本卷延续「规律同构，参数迥异」：边疆压力与军费—财政的拉扯、秩序话语的输出——古今同构；但内亚游牧威胁已消失，压力轴转向海洋与技术—金融，朝贡逻辑变为当代秩序话语竞争。',
    svgTitle: '外交', svgSub: '左=历史边疆秩序 右=当代形态',
    svgFoot: '规律同构 · 参数迥异 —— 压力轴从内陆转向海洋/技术—金融',
    colorNote: '色义：边疆/军费=朱红（军事）· 朝贡/秩序=青瓷 · 海洋/地缘=赭金。差异闸（Δ）：每组映射必须交代关键差异方成立。',
    rows: [
      { id: 'neiya', y: 158, color: '--sj-vermil', guMain: '内亚游牧周期', guSub: '北边军费 · 和亲互市', jinMain: '海洋 · 技术—金融', jinSub: '岛链 · 供应链 · 制裁', label: '边疆周期 映射',
        same: '边疆压力与军费—财政形成拉扯：内亚游牧周期迫使中原持续投入北边防务，对应当代海洋方向、技术封锁与供应链安全的国防—财政压力——外部压力经军事力传导至财政枢纽。',
        diff: '内亚游牧威胁作为周期性外力已消失；当代压力轴转向海洋、半导体、金融制裁与技术标准竞争。相似的是「外部压力→军费—财政」，不同的是地理轴与压力形态。' },
      { id: 'chaogong', y: 252, color: '--sj-celadon', guMain: '朝贡体系', guSub: '天下秩序 · 册封', jinMain: '秩序话语 · 规则竞争', jinSub: '多边机制 · 标准制定', label: '朝贡 映射',
        same: '大国输出秩序话语以塑造周边环境：朝贡体系的册封—回赐逻辑，对应当代参与/塑造国际规则、标准与多边机制——秩序输出是降低边疆摩擦的软实力工具。',
        diff: '当代处于主权国家平等（名义上）与多极并置体系，朝贡的等级—恩赐逻辑不再适用；秩序竞争表现为规则、标准与联盟架构。相似的是秩序输出意图，不同的是国际结构。' },
      { id: 'bianxiang', y: 346, color: '--sj-ochre', guMain: '边饷 · 军费财政', guSub: '三饷加派 · 辽饷', jinMain: '国防支出 · 财政平衡', jinSub: '军工产业链 · 转移支付', label: '边饷 映射',
        same: '军费扩张挤压民生财政、加速系统压力：明末辽饷、三饷加派是财政枢纽越阈引爆崩解的极端例（SJ-07），对应当代国防支出与财政平衡的持续张力——军事力与财政汲取力的耦合古今同构。',
        diff: '现代国防工业形成完整产业链（含民用溢出），且财政汲取工具更精细；但「大炮与黄油」的张力仍在。相似的是军费—财政耦合，不同的是产业形态与汲取精度。' },
    ],
    pairs: [
      ['内亚游牧周期', '海洋 · 技术—金融压力', '边疆—军事力',
        '边疆压力与军费—财政拉扯：内亚周期迫使北边防务投入 ↔ 当代海洋、技术封锁与供应链安全的国防—财政压力。',
        '内亚游牧威胁已消失；压力轴转向海洋、半导体、金融制裁与技术标准。相似的是外部压力→军费—财政，不同的是地理轴。'],
      ['朝贡体系', '秩序话语 · 规则竞争', '边疆—军事力',
        '大国输出秩序话语：朝贡册封—回赐 ↔ 参与/塑造国际规则、标准与多边机制——秩序输出降低边疆摩擦。',
        '当代处于主权平等与多极并置，朝贡等级逻辑不再适用；竞争表现为规则、标准与联盟。相似的是秩序输出，不同的是国际结构。'],
      ['边饷 · 军费财政', '国防支出 · 财政平衡', '财政—军事耦合',
        '军费扩张挤压民生、加速系统压力：辽饷、三饷（SJ-07）↔ 当代国防支出与财政平衡张力——军事力与财政枢纽耦合。',
        '现代国防工业形成产业链（含民用溢出），财政汲取更精细；「大炮与黄油」张力仍在。相似的是耦合，不同的是产业形态。'],
    ],
    meta1: '三组对照的「关键差异」共享同一根源：当代<strong>压力地理轴迁移</strong>（内陆→海洋）与<strong>竞争形态升级</strong>（武力→技术—金融—规则）。',
    meta2: '但两样没变：<strong>边疆/外部压力经军事力传导至财政</strong>与<strong>秩序话语输出的战略价值</strong>。外交域的断言收束为：<strong>规律同构，参数迥异</strong>。',
    refute: [
      ['批评一：朝贡—多边的外延断裂', '反对者认为，朝贡体系与当代多边主义在规范基础上差异过大，类比可能只是修辞。本卷以「秩序输出意图」机制层对照，但是否仍有解释力，可争论。'],
      ['批评二：军事—财政耦合的变量过多', '当代国防工业、核威慑、全球供应链使「边饷」类比过于简化。本卷强制双栏标注差异，但不否认参数变化可能已改变耦合强度。'],
    ],
    chips: [['./SJ-00.html', '↔ SJ-00 总索引'], ['./SJ-03.html', '↔ SJ-03 五力·边疆'], ['./SJ-07.html', '↔ SJ-07 崩解·三饷'], ['/diplomacy', '↔ 外交博弈'], ['/straits', '↔ 台海局势']],
    xrefs: [
      ['./SJ-03.html', 'SJ-03 · 五力', '边疆—军事力', '边疆—军事力的定义、指标与财政耦合。'],
      ['./SJ-07.html', 'SJ-07 · 崩解', '三饷加派', '明末辽饷/三饷：军费—财政枢纽越阈的极端例。'],
      ['/diplomacy', 'GY · 当代', '外交博弈', '秩序话语与区域纵横的当代接口。'],
      ['/straits', 'GY · 当代', '台海局势', '海洋方向压力轴的地缘焦点。'],
      ['./SJ-20.html', 'SJ-20 · 姊妹', '政治映射', '央地—军事张力与外交压力的里表。'],
      ['./SJ-00.html', 'SJ-00', '史鉴总索引', '映射卷入口；外交映射卡片已点亮本卷。'],
    ],
    footLink: ['./SJ-23.html', '社会映射'],
    mapTag: '外交',
    jsDataKey: 'neiya',
  },
];

function renderVol(v) {
  const P = v.prefix;
  const rowsSvg = v.rows.map(r => svgRow(r.id, r.y, r.color, r.guMain, r.guSub, r.jinMain, r.jinSub, r.label)).join('\n');
  const pairsHtml = v.pairs.map(p => pairArticle(p[0], p[1], p[2], p[3], p[4])).join('\n\n    ');
  const chipsHtml = v.chips.map(c => `<a class="P-chip" href="${c[0]}">${c[1]}</a>`).join('\n      ');
  const xrefsHtml = v.xrefs.map(x => xrefCard(x[0], x[1], x[2], x[3])).join('\n    ');
  const refuteHtml = v.refute.map(r => `<article><div class="rh">${r[0]}</div><p>${r[1]}</p></article>`).join('\n    ');
  const jsData = v.rows.map(r => `    ${r.id}: { name:'${r.guMain} → ${r.jinMain}',
      same:'${r.same.replace(/'/g, "\\'")}',
      diff:'${r.diff.replace(/'/g, "\\'").replace(/<[^>]+>/g, m => m)}' }`).join(',\n');

  const css = CSS.replace(/\.P-/g, `.${P}-`).replace(/\.P-/g, `.${P}-`);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>SJ-${v.num} · ${v.domain}映射</title>
<meta name="description" content="${v.desc}"/>
<style>
${css}
</style>
${THEME_SCRIPT}
</head>
<body>
<div class="${P}-wrap sj-reveal-stagger" id="${P}-top">

<header class="${P}-mast">
  <div>
    <div class="badge">SJ-${v.num} · 古今映射卷 · ${v.domain}域</div>
    <h1>${v.title}<em>${v.subtitle}</em></h1>
    <div class="${P}-chips">
      ${chipsHtml}
    </div>
  </div>
  <div class="${P}-meta">
    ${v.force} · 禁裸类比<br/>
    <b>AS_OF 2026-07-14</b> · v0.1
  </div>
</header>

<p class="sj-zhupi">${v.zhupi}</p>

<section class="${P}-sec" id="sec-intro" aria-labelledby="h-intro">
  <div class="${P}-sec-h"><span class="num">01 · 引言</span><h2 id="h-intro">${v.domain}域的古今接口</h2></div>
  <p class="${P}-prose">${v.intro1}</p>
  <p class="${P}-prose">${v.intro2}</p>
  <p class="${P}-note">方法：史鉴引擎步骤④。三组对照各配「相似机制 / 关键差异」双栏；差异栏为硬约束，缺则不成立。</p>
</section>

<section class="${P}-sec" id="sec-map" aria-labelledby="h-map">
  <div class="${P}-sec-h"><span class="num">02 · 签名视觉</span><h2 id="h-map">${v.domain}古今映射盘 · 差异闸</h2></div>
  <p class="${P}-prose">左列历史机制，右列当代形态；每组之间一道「差异闸」（Δ），映射须过闸方成立。点击任一行，展开该组相似机制与关键差异。</p>

  <div class="${P}-stage" id="stage">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 560" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">${v.domain}域古今映射盘</title>
  <desc id="sj-desc">左列三个历史${v.domain}机制，右列三个当代形态，中间以差异闸相连。</desc>
  <defs>
    <radialGradient id="sj-glow" cx="50%" cy="34%" r="72%"><stop offset="0%" stop-color="var(--sj-ink-800)"/><stop offset="100%" stop-color="var(--sj-ink-900)"/></radialGradient>
    <pattern id="sj-xuan" width="8" height="14" patternUnits="userSpaceOnUse"><line x1="0" y1="1" x2="8" y2="1" stroke="var(--sj-paper-100)" stroke-width="0.4" opacity="0.35"/></pattern>
    <marker id="a-map" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-ochre)"/></marker>
  </defs>
  <rect width="820" height="560" fill="url(#sj-glow)"/>
  <rect x="44" y="96" width="732" height="392" fill="url(#sj-xuan)" opacity="0.05"/>
  <g aria-hidden="true" opacity="0.7">
    <rect x="16" y="104" width="12" height="392" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="20" y="108" width="4" height="384" rx="2" fill="var(--sj-line)"/>
    <rect x="792" y="104" width="12" height="392" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="796" y="108" width="4" height="384" rx="2" fill="var(--sj-line)"/>
  </g>
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600" font-family="Songti SC, Noto Serif SC, Source Han Serif SC, serif" letter-spacing="0.1em">古今映射盘 · ${v.svgTitle}</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono, JetBrains Mono, ui-monospace, monospace" letter-spacing="0.08em">SJ-${v.num} · ${v.svgSub}</text>
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC, Noto Serif SC, serif">朱批：映射须过「差异闸」(Δ)——交代关键差异方成立 · 禁裸类比</text>
  <text x="180" y="128" text-anchor="middle" fill="var(--sj-paper-300)" font-size="12" font-family="Songti SC, Noto Serif SC, serif">历史机制（古）</text>
  <text x="410" y="128" text-anchor="middle" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono, JetBrains Mono, ui-monospace, monospace">差异闸 Δ</text>
  <text x="640" y="128" text-anchor="middle" fill="var(--sj-paper-300)" font-size="12" font-family="Songti SC, Noto Serif SC, serif">当代形态（今）</text>
${rowsSvg}
  <text x="410" y="470" text-anchor="middle" fill="var(--sj-paper-300)" font-size="11" font-family="Songti SC, Noto Serif SC, serif">${v.svgFoot}</text>
  <text x="764" y="500" text-anchor="end" fill="var(--sj-line)" font-size="9" font-family="Source Han Mono, JetBrains Mono, ui-monospace, monospace">viewBox 820×560</text>
</svg>
  </div>

  <div class="${P}-layout">
    <div class="${P}-note" style="margin-top:0">${v.colorNote}</div>
    <aside class="${P}-aside" id="aside" aria-live="polite">
      <div id="aside-empty" class="${P}-aside-empty">点选映射盘任一行，展开该组的相似机制与关键差异（母本第五部）。</div>
      <div id="aside-body" hidden>
        <div class="k" id="aside-tag">—</div>
        <h3 id="aside-name">—</h3>
        <p id="aside-same"></p>
        <p id="aside-diff"></p>
      </div>
    </aside>
  </div>
</section>

<section class="${P}-sec" id="sec-pairs" aria-labelledby="h-pairs">
  <div class="${P}-sec-h"><span class="num">03 · 三组对照</span><h2 id="h-pairs">相似机制 / 关键差异 双栏</h2></div>
  <div class="${P}-pair">
    ${pairsHtml}
  </div>
</section>

<section class="${P}-sec" id="sec-meta" aria-labelledby="h-meta">
  <div class="${P}-sec-h"><span class="num">04 · 元差异</span><h2 id="h-meta">${v.domain}域的参数迁移</h2></div>
  <p class="${P}-prose">${v.meta1}</p>
  <p class="${P}-prose">${v.meta2}</p>
</section>

<section class="${P}-sec" id="sec-refute" aria-labelledby="h-refute">
  <div class="${P}-sec-h"><span class="num">05 · 相反读法</span><h2 id="h-refute">对本卷映射的两种批评</h2></div>
  <p class="${P}-note">持平起见，${v.domain}映射同样须接受质疑。以下两种批评各有其力。</p>
  <div class="${P}-refute">
    ${refuteHtml}
  </div>
</section>

<section class="${P}-sec" id="sec-xref" aria-labelledby="h-xref">
  <div class="${P}-sec-h"><span class="num">06 · 交叉引用</span><h2 id="h-xref">映射的史料来源与当代接口</h2></div>
  <div class="${P}-xref">
    ${xrefsHtml}
  </div>
  <p class="${P}-note">映射卷五域收束：<b>SJ-20 政治</b> · <b>SJ-21 经济</b> · <b>SJ-22 文化</b> · <b>SJ-23 社会</b> · <b>SJ-24 外交</b> —— 均基于《母本》第五部，强制双栏。</p>
</section>

<footer class="${P}-foot">
  <span>ChinaOS · 史鉴 SJ-${v.num} · v0.1 · AS_OF 2026-07-14 · 真源《母本》第五部${v.domain}行</span>
  <span><a href="./SJ-00.html">← 返回 SJ-00</a> · <a href="#${P}-top">↑ 顶</a> · <a href="${v.footLink[0]}">${v.footLink[1]}</a></span>
  <span>本地调试 · 未 push</span>
</footer>

</div>
<script>
(function(){
  const stage = document.getElementById('stage');
  const rows = Array.from(stage.querySelectorAll('.sj-row'));
  const asideEmpty = document.getElementById('aside-empty');
  const asideBody = document.getElementById('aside-body');
  const MAP_DATA = {
${jsData}
  };
  function clearVisual(){ stage.classList.remove('is-picking'); rows.forEach(r=>r.classList.remove('is-hot')); }
  function showAside(id){ const d=MAP_DATA[id]; if(!d) return; asideEmpty.hidden=true; asideBody.hidden=false;
    document.getElementById('aside-tag').textContent='古今映射 · ${v.mapTag}';
    document.getElementById('aside-name').textContent=d.name;
    document.getElementById('aside-same').innerHTML='<b class="same">相似机制：</b>'+d.same;
    document.getElementById('aside-diff').innerHTML='<b class="diff">关键差异：</b>'+d.diff; }
  function pick(id){ if(!MAP_DATA[id]) return; clearVisual(); stage.classList.add('is-picking');
    rows.forEach(r=>r.classList.toggle('is-hot', r.dataset.id===id)); showAside(id); }
  rows.forEach(r=>{ const act=()=>pick(r.dataset.id); r.addEventListener('click',act);
    r.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); act(); } }); });
})();
</script>
</body>
</html>`;
}

for (const v of VOLS) {
  const html = renderVol(v);
  const path = join(OUT, `SJ-${v.num}.html`);
  writeFileSync(path, html, 'utf8');
  console.log('Wrote', path);
}
