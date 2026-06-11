// ============================================================================
// 中央巡视沙盘 · 数据与引擎层（inspectData.js）
// ----------------------------------------------------------------------------
// 定位：进驻虚构汉东省的巡视全流程推演引擎 —— 不含任何 React/视图代码。
// 流程：三源线索汇集 → 研判入篮 → 谈话调度（关联度×姿态）→ 证据链闭合
//       （同案线索 ≥2 + 相关谈话 ≥1）→ 问题定档（重大/较大/一般）→
//       整改轮次跟踪（启动闸/销号闸）→ 工作底稿（Markdown）。
// 模型：全部确定性纯函数 —— 线索可信度由字符串哈希定值，运行时不取随机数、
//       不取当前时间；同样的输入永远给出同样的底稿。
// 声明：虚构省份巡视沙盘，致敬经典政治叙事；与任何真实巡视工作、
//       真实人物无关；不构成对任何机构流程的描述。
// ============================================================================

import { HD_SCENARIOS } from '../handong/handongData.js';

export const INSPECT_AS_OF = '2026-06-11';

// ----------------------------------------------------------------------------
// 三源线索：信访举报 / 审计异常 / 舆情热点 —— 信噪比与时滞各不相同。
// ----------------------------------------------------------------------------
export const CLUE_SOURCES = [
  {
    id: 'petition', label: '信访举报', color: '#c41e3a',
    desc: '联名信、实名举报与上访记录——最滚烫也最原始的线索来源，真伪混杂，指向性强。',
  },
  {
    id: 'audit', label: '审计异常', color: '#22d3ee',
    desc: '挂账、表外与单价异常——纸面上最冷静的线索，每一个数字都有出处，但天然滞后。',
  },
  {
    id: 'opinion', label: '舆情热点', color: '#e8a317',
    desc: '短视频、网帖与市场传闻——传播最快的线索，热度不等于实据，但烟的背后总有火。',
  },
  {
    id: 'handover', label: '沙盘移送', color: '#8b5cf6',
    desc: '汉东治理沙盘的失分回合自动移送——推演里烂掉的账，迟早摆上巡视的桌面。',
  },
];

// ----------------------------------------------------------------------------
// 线索文本库：六剧情各派生 2 条，按三源轮转改写成线索登记体。
// 序与 HD_SCENARIOS 一致：windfactory/brightpeak/jzdebt/lvmine/linpollute/typhoon。
// ----------------------------------------------------------------------------
const CLUE_TEXT = {
  windfactory: [
    '联名信反映：老服装厂股权质押拍卖前夜突击签批，职工持股会被排除在处置程序之外',
    '审计抽查发现：服装厂改制过桥贷利率畸高，多笔资金经空壳公司回流个人账户',
  ],
  brightpeak: [
    '网帖发酵：光明峰工程中标价远低于成本线，评标专家名单疑在开标前外泄',
    '实名举报：三家围标公司共用同一办公地址，背后实控人与审批环节干部过从甚密',
  ],
  jzdebt: [
    '审计预警：京州城投多笔非标融资未入账，表外担保规模远超向上报备口径',
    '市场传闻刷屏：城投理财兑付窗口排队，区域债券一级发行连续流标',
  ],
  lvmine: [
    '矿工家属上访材料：透水事故警报延迟上报两小时，井下排班记录疑被事后改动',
    '审计核查：涉事煤矿安全技改专项资金多笔列支与实际工程量明显不符',
  ],
  linpollute: [
    '短视频热传：开发区排污口夜间偷排，下游村庄井水第三方检测报告全网扩散',
    '村民联名信：园区环评批复与实际产能严重不符，在线监测数据疑遭人为修饰',
  ],
  typhoon: [
    '审计发现：海堤加固工程多处偷工减料，防汛物资采购单价显著高于市场价',
    '舆情聚焦：台风预警发布迟滞，安置点物资分配不均引发集中投诉',
  ],
};

// ----------------------------------------------------------------------------
// 问题定性文本库：证据链闭合后，剧情 → 问题清单条目与整改路径。
// ----------------------------------------------------------------------------
const ISSUE_TEXT = {
  windfactory: {
    label: '国企改制中职工权益保护失守，股权处置程序违规',
    advice: '冻结拍卖程序、确权职工股权，倒查过桥贷资金链与关联账户',
  },
  brightpeak: {
    label: '重点工程招投标围标串标，评标环节存在权力寻租',
    advice: '重构招投标平台全程留痕，涉案标段依法重招并切割合规标段',
  },
  jzdebt: {
    label: '政府性债务底数不清，表外融资规避监管',
    advice: '全口径债务清查，平台整合压减，举债终身追责写入纪要',
  },
  lvmine: {
    label: '安全生产责任悬空，事故信息迟报瞒报',
    advice: '安全技改资金穿透式审计，迟报责任从矿主到监管逐级认定',
  },
  linpollute: {
    label: '生态环保监管失灵，监测数据涉嫌造假',
    advice: '管网溯源改造与企业分级处置并行，水源地复测达标方可销号',
  },
  typhoon: {
    label: '防灾工程质量失控，救灾物资管理混乱',
    advice: '海堤工程质量倒查到人，物资采购全流程公开比价并晒账',
  },
};

const SEVERITY_ADVICE = {
  重大: '挂牌督办，移交纪检监察机关立案审查',
  较大: '限期专项整改，约谈相关责任人',
  一般: '纳入整改台账，下轮回头看核验',
};

// 整改双闸：[启动轮次, 销号轮次] —— 越重的问题，启动越迟、销号越慢。
const RECTIFY_GATES = { 重大: [2, 4], 较大: [1, 3], 一般: [1, 2] };

// ----------------------------------------------------------------------------
// 工具函数（确定性）
// ----------------------------------------------------------------------------
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** 字符串哈希（确定性，与运行环境无关；种子标定使三档严重度均可出现） */
function hashStr(s) {
  let h = 1;
  for (let i = 0; i < s.length; i++) h = (h * 131 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** 取冲击系数最高的前两个域索引（确定性，平手取靠前者） */
function topTwoDomains(impact) {
  let a = 0, b = -1;
  impact.forEach((v, i) => { if (v > impact[a]) a = i; });
  impact.forEach((v, i) => {
    if (i === a) return;
    if (b < 0 || v > impact[b]) b = i;
  });
  return [a, b < 0 ? a : b];
}

// ----------------------------------------------------------------------------
// 线索生成：六剧情 × 2 = 12 条，三源轮转，cred 由字符串哈希定值 35-90。
// 两次调用结果完全一致 —— 线索台账不会自己长出新东西。
// ----------------------------------------------------------------------------
export function buildClues() {
  const out = [];
  HD_SCENARIOS.forEach((sc, si) => {
    const tops = topTwoDomains(sc.impact);
    for (let k = 0; k < 2; k++) {
      const i = si * 2 + k;
      const id = `${sc.id}-${k === 0 ? 'a' : 'b'}`;
      const label = (CLUE_TEXT[sc.id] || [])[k] || `${sc.label} · 待核线索 ${k + 1}`;
      out.push({
        id,
        source: CLUE_SOURCES[i % 3].id,
        sceneId: sc.id,
        label,
        cred: 35 + (hashStr(`${id}|${label}`) % 56), // 35-90
        domain: tops[k], // 0-5：该线索的指向域
      });
    }
  });
  return out;
}

// ----------------------------------------------------------------------------
// 沙盘移送线索：汉东治理沙盘账本（cos-hd-ledger）的失分回合 → 巡视线索。
// 账本 failures 新进先出，取最近 ≤4 条确定性映射；指向域取该剧情冲击系数
// 最大的域（平手取靠前者），查不到 sceneId 时落到民生维（domain 2）。
// 空输入返回 []，不取随机数、不取当前时间。
// ----------------------------------------------------------------------------
export function buildHandoverClues(failures) {
  if (!Array.isArray(failures) || failures.length === 0) return [];
  return failures.slice(0, 4).map((f, i) => {
    const scene = HD_SCENARIOS.find((s) => s.id === f.sceneId);
    let domain = 2;
    if (scene && Array.isArray(scene.impact) && scene.impact.length) {
      domain = 0;
      scene.impact.forEach((v, di) => { if (v > scene.impact[domain]) domain = di; });
    }
    return {
      id: `ho-${i}`,
      source: 'handover',
      sceneId: f.sceneId,
      label: `沙盘移送：${f.label}（第${f.term}届第${f.year}年 · 净冲击 ${f.score}）`,
      cred: clamp(Math.round(Number(f.score) || 0), 45, 90),
      domain,
    };
  });
}

// ----------------------------------------------------------------------------
// 谈话调度：按所选线索的指向域 × 官员六维加权，排出谈话优先级 Top8。
// relevance：离问题越近的人排得越前；stance：姿态是利害关系的函数 ——
//            关联度越高、群众工作维（dims[2]）越弱，越倾向回避。
// 未选任何线索时按全量线索摸排（进驻初期的全面谈话）。
// ----------------------------------------------------------------------------
export function talkPlan(officials, clues, selectedClueIds) {
  const sel = new Set(selectedClueIds || []);
  const eff = sel.size ? clues.filter((c) => sel.has(c.id)) : clues;
  const wsum = eff.reduce((s, c) => s + c.cred, 0) || 1;
  return officials
    .map((o) => {
      const raw = eff.reduce((s, c) => s + (o.dims[c.domain] || 0) * c.cred, 0) / wsum;
      const relevance = clamp(Math.round(raw), 0, 100);
      const sScore = relevance * 0.6 + (100 - (o.dims[2] || 0)) * 0.4;
      const stance = sScore >= 66 ? '回避' : sScore >= 44 ? '谨慎' : '配合';
      // 该官员能为哪些案链作证：在该线索指向域上能力 ≥55 即视为「相关」
      const coverScenes = [...new Set(
        eff.filter((c) => (o.dims[c.domain] || 0) >= 55).map((c) => c.sceneId)
      )];
      return {
        officialId: o.id, name: o.name, archetype: o.archetype, color: o.color,
        relevance, stance, coverScenes,
      };
    })
    .sort((a, b) => b.relevance - a.relevance || a.officialId.localeCompare(b.officialId))
    .slice(0, 8);
}

// ----------------------------------------------------------------------------
// 证据链：孤证不立 —— 同剧情选中线索 ≥2 且谈过 ≥1 名相关官员，该链闭合。
// progress：各在研案链进度均值（单条 30 / 成对 60 / 闭合 100）。
// ----------------------------------------------------------------------------
export function evidenceChain(selectedClueIds, clues, talkedIds, plan) {
  const sel = new Set(selectedClueIds || []);
  const talked = new Set(talkedIds || []);
  const byScene = new Map();
  clues.forEach((c) => {
    if (!sel.has(c.id)) return;
    if (!byScene.has(c.sceneId)) byScene.set(c.sceneId, []);
    byScene.get(c.sceneId).push(c);
  });

  const missing = [];
  const formed = [];
  const formedSceneIds = [];
  let pctSum = 0;

  byScene.forEach((list, sceneId) => {
    const scene = HD_SCENARIOS.find((s) => s.id === sceneId);
    const name = scene ? scene.label : sceneId;
    const witnesses = (plan || []).filter(
      (p) => talked.has(p.officialId) && (p.coverScenes || []).includes(sceneId)
    );
    const hasPair = list.length >= 2;
    if (hasPair && witnesses.length >= 1) {
      formedSceneIds.push(sceneId);
      formed.push(`《${name}》：${list.length} 条线索与 ${witnesses.length} 份谈话笔录互相咬合，证据链闭合`);
      pctSum += 100;
    } else if (!hasPair) {
      missing.push(`《${name}》：在篮线索仅 ${list.length} 条，孤证不立——还差同案线索交叉印证`);
      pctSum += 30 + (witnesses.length ? 10 : 0);
    } else {
      missing.push(`《${name}》：书面线索已成对，还差 1 名相关官员的谈话笔录把链条钉死`);
      pctSum += 60;
    }
  });

  const progress = byScene.size ? clamp(Math.round(pctSum / byScene.size), 0, 100) : 0;
  return { progress, missing, formed, formedSceneIds };
}

// ----------------------------------------------------------------------------
// 问题清单：只对已闭合的证据链出问题 —— 定档看该案选中线索的可信度均值。
// ≥75 重大 / ≥55 较大 / 其余一般；advice = 定档处置 + 案情路径，恒非空。
// ----------------------------------------------------------------------------
export function issueList(selectedClueIds, clues, formedSceneIds) {
  const sel = new Set(selectedClueIds || []);
  return (formedSceneIds || []).map((sceneId) => {
    const list = clues.filter((c) => c.sceneId === sceneId && sel.has(c.id));
    const mean = list.length ? list.reduce((s, c) => s + c.cred, 0) / list.length : 0;
    const severity = mean >= 75 ? '重大' : mean >= 55 ? '较大' : '一般';
    const t = ISSUE_TEXT[sceneId] || { label: sceneId, advice: '移交被巡视党组织限期整改' };
    return {
      sceneId,
      label: t.label,
      severity,
      cred: Math.round(mean),
      advice: `${SEVERITY_ADVICE[severity]}；${t.advice}`,
    };
  });
}

// ----------------------------------------------------------------------------
// 整改跟踪：rounds 0-4 轮。重大 2 轮起步 4 轮销号、较大 1/3、一般 1/2 ——
// 问题越重，启动越迟、销号越慢；pct 为两闸之间的线性进度。
// ----------------------------------------------------------------------------
export function rectifyTrack(issues, rounds) {
  const r = clamp(Math.round(rounds || 0), 0, 4);
  return (issues || []).map((it) => {
    const [start, done] = RECTIFY_GATES[it.severity] || [1, 2];
    let status, pct;
    if (r < start) { status = '未启动'; pct = 0; }
    else if (r >= done) { status = '已销号'; pct = 100; }
    else {
      status = '整改中';
      pct = clamp(Math.round(((r - start + 1) / (done - start + 1)) * 100), 1, 99);
    }
    return { label: it.label, severity: it.severity, status, pct };
  });
}

// ----------------------------------------------------------------------------
// 巡视工作底稿（Markdown）。
// ctx = { clues, selectedClueIds, plan, talkedIds, chain, issues, track, rounds }
// ----------------------------------------------------------------------------
export function buildInspectReport(ctx) {
  const { clues, selectedClueIds, plan, talkedIds, chain, issues, track, rounds } = ctx;
  const sel = new Set(selectedClueIds || []);
  const talked = new Set(talkedIds || []);
  const picked = clues.filter((c) => sel.has(c.id));
  const srcLabel = (id) => (CLUE_SOURCES.find((s) => s.id === id) || {}).label || id;
  const lines = [];

  lines.push('# 巡视汉东省（虚构）工作底稿');
  lines.push('');
  lines.push(`> 进驻基准 ${INSPECT_AS_OF} · 沙盘推演产物，非任何真实工作记录`);
  lines.push('');

  lines.push('## 一、进驻概况');
  lines.push(`- 线索台账：${clues.length} 条（信访举报 / 审计异常 / 舆情热点 三源汇集）`);
  lines.push(`- 纳入研判：${picked.length} 条 ｜ 谈话完成：${talked.size}/${(plan || []).length} 人（按优先级 Top8 调度）`);
  lines.push(`- 证据链整体进度：${chain.progress}/100 ｜ 闭合链条 ${chain.formed.length} 条 ｜ 在研缺口 ${chain.missing.length} 处`);
  lines.push('');

  lines.push('## 二、线索研判');
  if (picked.length === 0) {
    lines.push('- 暂无线索纳入研判篮——台账在册，研判未启动。');
  } else {
    CLUE_SOURCES.forEach((s) => {
      picked.filter((c) => c.source === s.id).forEach((c) => {
        lines.push(`- [${s.label}] ${c.label}（可信度 ${c.cred}）`);
      });
    });
  }
  lines.push('');

  lines.push('## 三、谈话统计');
  (plan || []).forEach((p) => {
    lines.push(`- ${p.name}（${p.archetype}）：关联度 ${p.relevance} · 预判姿态「${p.stance}」 · ${talked.has(p.officialId) ? '已谈话 ✓' : '未谈话'}`);
  });
  lines.push('');

  lines.push('## 四、问题清单');
  if ((issues || []).length === 0) {
    lines.push('- 证据链尚未闭合，暂不形成问题清单——孤证不立是底稿的纪律。');
  } else {
    issues.forEach((it) => {
      lines.push(`- 【${it.severity}】${it.label}（线索可信度均值 ${it.cred}）`);
      lines.push(`  - 处置路径：${it.advice}`);
    });
  }
  lines.push('');

  lines.push('## 五、整改跟踪');
  lines.push(`- 当前整改轮次：第 ${clamp(Math.round(rounds || 0), 0, 4)}/4 轮`);
  if ((track || []).length === 0) {
    lines.push('- 暂无在账整改事项——问题清单为空时，整改跟踪不开账。');
  } else {
    track.forEach((t) => {
      lines.push(`- ${t.label}：${t.status}（进度 ${t.pct}%）`);
    });
  }
  lines.push('');

  lines.push('---');
  lines.push('*虚构省份巡视沙盘，致敬经典政治叙事；与任何真实巡视工作、真实人物无关；不构成对任何机构流程的描述。*');

  return lines.join('\n');
}
