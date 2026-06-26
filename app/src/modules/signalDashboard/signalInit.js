/** 宏观再平衡信号灯 · 态势合成与本地持久化（命名空间 chinaos.signals.v1） */

import { bindSignalTabs, initObservationBoard } from './observationInit.js';

const STORAGE_KEY = 'chinaos.signals.v1';

const SECTIONS = [
  {
    tier: 'A', title: '元改革信号', desc: '最高权重 · 决定态势切换',
    signals: [
      { id: 'A1', name: '考核指挥棒换锚', w: 3,
        read: '仍以增长为主刻度；中央 500 亿激励资金奖励地方"做大经济蛋糕"，居民收入/消费率未入约束性指标。',
        trig: '"居民消费率"进入中央经济工作会议/政府工作报告的约束性目标 → 转绿（质变信号）。',
        status: 'red' },
      { id: 'A2', name: '中央加杠杆', w: 3,
        read: '赤字率 4%，赤字增量 2300 亿全部由中央承担，中央占赤字 86.4%；3000 亿特别国债补充大行资本。',
        trig: '已实质推进=绿；若 2027 赤字率再上抬且仍中央承担，确认决心强化。',
        status: 'green' },
      { id: 'A3', name: '特别国债"投人 vs 投物"比例', w: 2,
        read: '2500 亿以旧换新 + ~1000 亿育儿补贴（投人）；但 1.3 万亿超长期国债仍偏"两重/两新"基建（投物）。',
        trig: '投人占比明显抬升、超过投物增量 → 转绿。',
        status: 'amber' },
    ],
  },
  {
    tier: 'B', title: '居民端落地信号', desc: '中权重 · 决定消费能否起来',
    signals: [
      { id: 'B1', name: '育儿补贴标准', w: 1,
        read: '全国统一 3600 元/孩/年（约 300 元/月）已破冰，财政安排约 1000 亿、惠及 3000 万婴幼儿；剂量偏低。',
        trig: '标准上调（如翻倍）→ 转绿。',
        status: 'amber' },
      { id: 'B2', name: '免费教育年限', w: 1,
        read: '免费学前一年已落地，惠及约 1400 万人。',
        trig: '延长至学前三年 / 向义务教育上下游扩展 → 转绿。',
        status: 'amber' },
      { id: 'B3', name: '居民基础养老金涨幅', w: 1,
        read: '城乡居民基础养老金月最低标准再 +20 元，挤牙膏式提升。',
        trig: '涨幅显著提速（非每年 +20 元节奏）→ 转绿。',
        status: 'red' },
      { id: 'B4', name: '现金普发突破', w: 1,
        read: '仍走以旧换新 / 贷款贴息 / 有奖发票，未直接向居民普发现金。',
        trig: '出现面向特定群体的直接现金补贴 → 跨过意识形态坎，转绿（强信号）。',
        status: 'red' },
      { id: 'B5', name: '户籍与公共服务脱钩', w: 1,
        read: '仅社保扩面（灵活就业/新业态参保），户籍市民化最慢，三亿农民工需求未解锁。',
        trig: '积分落户放宽 / 随迁子女就学 / 社保全国统筹结算实质推进 → 转绿。',
        status: 'red' },
    ],
  },
  {
    tier: 'C', title: '宏观确诊信号', desc: '验证药是否起效',
    signals: [
      { id: 'C1', name: 'GDP 平减指数转正（闸门）', w: 3,
        read: '仍处通缩区间；报告称"有望 2026 二季度走出连续三年通缩"——当承诺核对。',
        trig: '连续两个季度由负转正并站稳 → 转绿（态势总确认闸门）。',
        status: 'red' },
      { id: 'C2', name: '社零增速 vs 固投增速剪刀差', w: 1,
        read: '机构多预期 2026 消费增速约 4.5%，温和复苏；需消费持续跑赢投资。',
        trig: '社零增速持续高于固定资产投资增速 → 转绿。',
        status: 'amber' },
      { id: 'C3', name: '居民消费占 GDP 比重', w: 1,
        read: '约 39%，为主要经济体最低档（病根指标）。',
        trig: '该比重持续上行 → 转绿（结构性胜利）。',
        status: 'red' },
      { id: 'C4', name: '居民中长期贷款（按揭）恢复', w: 1,
        read: '信心体温计；资产负债表衰退是否缓解看此项。',
        trig: '新增居民中长贷由缩转增并持续 → 转绿。',
        status: 'red' },
    ],
  },
];

const LANES = [
  { key: '创业', ico: 'CREATE',
    defense: '押政策顺风方向：服务消费 / 银发 / 托育 / 文旅赛事 / 入境消费("购在中国") / 出海。避开重资产、长回收、靠投资驱动的红海。超个体靠"窄而深的特定人群"穿越通缩，不依赖宏观总量。',
    offense: '需求总量回暖，可加杠杆扩张产能与门店、加大投放；从"窄深求生"切到"顺周期放量"，抢服务消费复苏的β。' },
  { key: '投资', ico: 'INVEST',
    defense: '防御为主：现金/高等级债实际购买力上升；偏好确定性分红的"类债"资产 + 政策顺风服务消费。房产托底非反弹，投资性加仓逻辑不成立。',
    offense: '切进攻：超配顺周期权益与困境反转资产；扳机=平减指数转正且社零持续超固投后再动，不抢跑。' },
  { key: '融资', ico: 'FINANCE',
    defense: '主动薅政策：1000 亿促内需专项资金下的经营贷贴息、设备更新贴息、民间投资担保；低成本资金投向能产生现金流的扩张，而非贬值资产。',
    offense: '融资窗口仍开且需求改善，放大生产性借贷、加速扩张；优先锁定长久期低成本资金。' },
  { key: '借贷', ico: 'CREDIT',
    defense: '通缩抬高实际债务：压消费性/资产性杠杆，保现金流安全垫；仅"生产性 + 有贴息 + 能自偿"的债可进。',
    offense: '通缩解除后实际债务负担下降，可适度提升杠杆；仍以能自偿的生产性负债为先。' },
];

const VAL = { red: 0, amber: 0.5, green: 1 };

const REGIME_META = {
  defense: { word: '防御', cls: 's-red', pos: 12,
    sub: '国家在做"中央加杠杆 + 补贴购买行为"的治标动作，治本（换考核 / 给家庭 / 松户籍）尚未启动。个人以防御为主，进攻扳机未到。' },
  watch: { word: '观察', cls: 's-amber', pos: 50,
    sub: '部分治本信号开始松动，处于临界区。保持防御主仓，准备好进攻清单，等待闸门确认。' },
  offense: { word: '进攻', cls: 's-green', pos: 88,
    sub: '治本信号确认启动（换锚或平减指数转正）。可从防御切换为进攻，抢结构性复苏的先手。' },
};

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveOverrides(o) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(o)); } catch { /* noop */ }
}

/** @param {HTMLElement | null} root */
export function initSignalDashboard(root) {
  if (!root) return () => {};

  let overrides = loadOverrides();
  const cleanups = [];

  const $ = (id) => root.querySelector(`#${String(id).replace(/^#/, '')}`);

  function statusOf(sig) { return overrides[sig.id] || sig.status; }

  function allSignals() { return SECTIONS.flatMap((s) => s.signals); }

  function computeRegime() {
    const sigs = allSignals();
    let num = 0; let den = 0;
    sigs.forEach((s) => { num += VAL[statusOf(s)] * s.w; den += s.w; });
    const score = Math.round((num / den) * 100);

    const c1 = statusOf(SECTIONS[2].signals[0]);
    const a1 = statusOf(SECTIONS[0].signals[0]);
    const gateOpen = (VAL[c1] >= 0.5);

    let regime;
    if (score >= 60 && gateOpen) regime = 'offense';
    else if (score >= 38) regime = 'watch';
    else regime = 'defense';

    if (a1 === 'green' && gateOpen) regime = 'offense';

    return { score, regime, gateOpen };
  }

  function renderSignals() {
    const signalsRoot = $('#sd-signals');
    if (!signalsRoot) return;
    signalsRoot.innerHTML = '';

    SECTIONS.forEach((sec) => {
      const section = document.createElement('section');
      section.className = 'sd-section';
      section.innerHTML = `
        <div class="sd-section-head">
          <span class="sd-section-tier">${sec.tier}</span>
          <h2>${sec.title}</h2>
          <span class="sd-desc">${sec.desc}</span>
        </div>
        <div class="sd-grid"></div>`;
      const grid = section.querySelector('.sd-grid');

      sec.signals.forEach((sig) => {
        const st = statusOf(sig);
        const card = document.createElement('div');
        card.className = `sd-card s-${st}`;
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${sig.name}，当前${st === 'red' ? '红' : st === 'amber' ? '琥珀' : '绿'}，点击切换`);
        const badge = st === 'red' ? '<span class="sd-badge b-red">未启动</span>'
          : st === 'amber' ? '<span class="sd-badge b-amber">观察中</span>'
            : '<span class="sd-badge b-green">已启动</span>';
        card.innerHTML = `
          <div class="sd-card-top">
            <span class="sd-dot"></span>
            <span class="sd-card-name">${sig.name}</span>
            <span class="sd-card-id">${sig.id} · w${sig.w}</span>
          </div>
          <div class="sd-card-read">${sig.read}</div>
          <div class="sd-card-trig">${badge} <b>翻绿触发</b> · ${sig.trig.replace('→ 转绿', '').replace('转绿', '')}</div>`;

        const cycle = () => {
          const order = ['red', 'amber', 'green'];
          const cur = statusOf(sig);
          overrides[sig.id] = order[(order.indexOf(cur) + 1) % 3];
          saveOverrides(overrides);
          renderAll();
        };
        card.addEventListener('click', cycle);
        const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycle(); } };
        card.addEventListener('keydown', onKey);
        cleanups.push(() => {
          card.removeEventListener('click', cycle);
          card.removeEventListener('keydown', onKey);
        });
        grid.appendChild(card);
      });
      signalsRoot.appendChild(section);
    });
  }

  function renderVerdict() {
    const { score, regime } = computeRegime();
    const m = REGIME_META[regime];
    const vWord = $('#sd-vWord');
    const vScore = $('#sd-vScore');
    const vSub = $('#sd-vSub');
    const lamp = $('#sd-vLamp');
    const knob = $('#sd-vKnob');
    if (vWord) vWord.textContent = m.word;
    if (vScore) vScore.textContent = String(score);
    if (vSub) vSub.textContent = m.sub;
    if (lamp) lamp.className = `sd-verdict-lamp ${m.cls}`;
    if (knob) knob.style.left = `${m.pos}%`;

    ['def', 'watch', 'off'].forEach((k, i) => {
      const el = $(`sd-lab-${k}`);
      const active = (regime === 'defense' && i === 0) || (regime === 'watch' && i === 1) || (regime === 'offense' && i === 2);
      el?.classList.toggle('on', active);
    });

    const c1 = statusOf(SECTIONS[2].signals[0]);
    const trigger = $('#sd-vTrigger');
    if (trigger) {
      trigger.innerHTML =
        `<b>切换扳机</b> · A1 考核换锚转绿　或　C1 平减指数连续两季转正（当前闸门：${c1 === 'red' ? '关闭' : '开启'}）` +
        ' ⟶ 态势切"进攻"。';
    }
  }

  function renderLanes() {
    const { regime } = computeRegime();
    const off = (regime === 'offense');
    const lanesRoot = $('#sd-lanes');
    if (!lanesRoot) return;
    lanesRoot.innerHTML = '';

    LANES.forEach((l) => {
      const tagColor = off ? 'var(--sd-green)' : 'var(--sd-amber)';
      const tagWord = off ? '进攻版' : '防御版';
      const body = off ? l.offense : l.defense;
      const alt = off ? l.defense : l.offense;
      const altWord = off ? '若回落转防御' : '态势转进攻时';
      const div = document.createElement('div');
      div.className = 'sd-lane';
      div.innerHTML = `
        <h3>${l.key} <span class="ico">${l.ico}</span></h3>
        <div class="now"><span class="tag" style="background:${tagColor}">${tagWord}</span><br>${body}</div>
        <div class="flip"><b>${altWord}</b> · ${alt}</div>`;
      lanesRoot.appendChild(div);
    });
  }

  function renderAll() {
    renderSignals();
    renderVerdict();
    renderLanes();
  }

  const resetBtn = $('#sd-resetBtn');
  const onReset = () => {
    overrides = {};
    saveOverrides(overrides);
    renderAll();
  };
  resetBtn?.addEventListener('click', onReset);
  cleanups.push(() => resetBtn?.removeEventListener('click', onReset));

  renderAll();

  const tabCleanup = bindSignalTabs(root);
  cleanups.push(tabCleanup);

  const obsCleanup = initObservationBoard(root);
  cleanups.push(obsCleanup);

  return () => cleanups.forEach((fn) => fn());
}
