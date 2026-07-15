#!/usr/bin/env node
/** Phase D · 综合矩阵轻量精调（SJ-07/16/17/18/19） */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

const MATRIX_LAW_EXTRA = {
  '07': `<p class="sj-07-note" style="margin-top:12px">跨五朝对比的收束要点：<strong>崩解主链同构、引燃点各异</strong>——秦偏汲取越阈与合法性未沉淀，唐偏藩镇军事外包，明偏小冰期与三饷双引燃，清偏人口慢变量与体系外现代性。矩阵每一行须回指单案深描（SJ-10/12/15 等），忌在矩阵内重复台账。</p>`,
  '16': `<p class="sj-16-note" style="margin-top:12px">六案并置的额外收束：<strong>触动精英型</strong>（商鞅/王安石/张居正/戊戌）与<strong>不触动体制型</strong>（洋务）构成两条失败路径；<strong>理想脱离型</strong>（王莽）与<strong>战国通道型</strong>（商鞅）提示相位与精英结构决定改革工具箱。规律五「僵化期修复」须联读 SJ-04 相位盘。</p>`,
  '17': `<p class="sj-17-note" style="margin-top:12px">四案上升奠基的收束强调：<strong>慢变量修复优先于单力炫功</strong>——文景/贞观重基座与低阈汲取，隋文帝/孝文帝重制度模块安装；但每一行均埋隐患（诸侯坐大、府兵/节度使、炀帝透支、六镇反弹），印证规律一「慢变量定天花板」。</p>`,
  '18': `<p class="sj-18-note" style="margin-top:12px">拐点谱系收束：<strong>鼎盛叙事可掩盖隐性拐点</strong>——天宝（军事外包）、康乾（人口/僵化）、淝水前秦（多民族拼凑）同属「账面优势≠结构稳定」；读法须联 SJ-04 相位盘与 SJ-06/SJ-49 单案。</p>`,
  '19': `<p class="sj-19-note" style="margin-top:12px">分裂—重整收束：<strong>军事力区域畸大→合法性归零→反向制度设计</strong>——五代「兵强马壮者为天子」与宋「杯酒释兵权」构成过度矫正链；近代北伐（SJ-53）提供体系外变量对照，矩阵行须标注「分裂期军事定正统」机制。</p>`,
};

const ROW_SHI_PATCH = [
  {
    nums: ['16'],
    match: /王安石变法/,
    append: '党争制度化使改革遗产难以存续，精英循环力成为比财政工具更长的否决链。',
  },
  {
    nums: ['16'],
    match: /洋务运动/,
    append: '器物现代化未触动科举—士绅结构，制度基座空心化在甲午一役总曝光。',
  },
  {
    nums: ['17'],
    match: /文景之治/,
    append: '诸侯隐患未同步削藩，证明基座修复须与精英再平衡联读，否则七国之乱将检验路径依赖。',
  },
  {
    nums: ['17'],
    match: /贞观之治/,
    append: '纳谏机制是精英循环健康的信号，但府兵制维系困难已埋节度使远因。',
  },
  {
    nums: ['07'],
    match: /明末/,
    append: '小冰期与三饷双引燃，标示基座慢变量可与财政快变量共振——非「皇帝昏庸」单因可释。',
  },
  {
    nums: ['18'],
    match: /康乾/,
    append: '人口逼近承载与文字狱僵化在盛世叙事下累积，嘉道中衰是慢变量兑现而非突变。',
  },
  {
    nums: ['19'],
    match: /五代/,
    append: '军事力畸大使合法性叙事归零，为宋初「重文抑武」过度矫正埋下宋辽军事力不足远因。',
  },
];

function bumpVersion(html) {
  return html
    .replace(/\bv0\.1\b/g, 'v0.2')
    .replace(/AS_OF 2026-07-15(?! · 精调轮)/g, 'AS_OF 2026-07-15 · 精调轮');
}

for (const num of ['07', '16', '17', '18', '19']) {
  const path = join(OUT, `SJ-${num}.html`);
  let html = readFileSync(path, 'utf8');
  const extra = MATRIX_LAW_EXTRA[num];
  if (extra && !html.includes(extra.slice(20, 50))) {
    const anchor = html.match(/<p class="sj-\d+-note">[^<]*收束[^<]*<\/p>/);
    if (anchor) {
      html = html.replace(anchor[0], anchor[0] + extra);
    } else {
      html = html.replace('</article>', `${extra}\n</article>`);
    }
  }
  for (const patch of ROW_SHI_PATCH.filter((p) => p.nums.includes(num))) {
    const re = new RegExp(
      `(<tr[^>]*>[\\s\\S]*?${patch.match.source}[\\s\\S]*?<td[^>]*class="[^"]*shi[^"]*"[^>]*>)([^<]*)(</td>)`,
    );
    html = html.replace(re, (_, pre, cell, post) => {
      if (cell.includes(patch.append.slice(0, 12))) return pre + cell + post;
      return pre + `${cell.trim()} ${patch.append}` + post;
    });
  }
  html = bumpVersion(html);
  writeFileSync(path, html, 'utf8');
  console.log(`Refined SJ-${num}.html (matrix)`);
}

console.log('Done: 5 matrix volumes · Phase D');
