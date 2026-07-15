/**
 * 精修第二轮 · 结构切片精绘 overrides（Phase D）
 * 覆盖 ROUND_SLICE_CONFIGS，加厚 edgeLabels / nodeData / railSummary
 */
import { buildSvg, nodeRect, nodeBase } from './sj-premium-slice.mjs';
import { caseToSliceConfig } from './case-to-slice-config.mjs';
import { ROUND5_CASES } from '../data/round5-cases.mjs';
import { ROUND4_CASES } from '../data/round4-cases.mjs';
import { ROUND4_CHUNQIU } from '../data/round4-cases-chunqiu.mjs';

const CASE_BY_NUM = Object.fromEntries(
  [...ROUND5_CASES, ...ROUND4_CASES, ...ROUND4_CHUNQIU].map((c) => [c.num, c]),
);

/** 精绘：在 seed 基础上追加 edgeLabels 与加厚 nodeData */
const POLISH_META = {
  '28': {
    railSummary: '漠北决战 → 封狼居胥 → 盐铁越阈 · 前119 引爆点。',
    edgeLabels: `
    <text x="300" y="195" fill="var(--sj-ochre)">前119 决策</text>
    <text x="410" y="248" text-anchor="middle" fill="var(--sj-vermil)" font-size="12" font-weight="600">漠北决战</text>
    <text x="430" y="340" fill="var(--sj-ochre)">元狩四年财政改革</text>
    <text x="520" y="390" fill="var(--sj-vermil)">汲取转嫁编户</text>
    <text x="200" y="390" fill="var(--sj-celadon)">绩效合法性峰值</text>`,
    nodeBoost: {
      wudi: '以皇权集中推动对匈战争与财政改革；军事胜利与财政越阈同年发生——上升期单力强化警示。',
      yantie: '盐铁官营、白鹿皮币、告缗算缗同步推出——财政汲取越过文景低阈的枢纽节点。',
      fenglang: '霍去病祭天封禅于狼居胥山——军事绩效合法性达汉代峰值，亦掩财政透支。',
    },
  },
  '36': {
    railSummary: '605 开凿 → 民夫征发越阈 → 三征高句丽共振 · 引爆点。',
    edgeLabels: `
    <text x="430" y="200" fill="var(--sj-ochre)">605 大业元年</text>
    <text x="430" y="305" fill="var(--sj-vermil)" font-size="12" font-weight="600">征发越阈</text>
    <text x="200" y="355" fill="var(--sj-celadon)">洛阳枢纽</text>
    <text x="600" y="355" fill="var(--sj-celadon)">江都漕粮</text>
    <text x="600" y="140" fill="var(--sj-vermil)">辽东后勤链</text>`,
    nodeBoost: {
      yifu: '数百万民夫役使〔存疑〕——基座承载被工程强行改写，与旱灾、民变共振。',
      yunhe: '贯通五大水系，漕运与军事投送合一——基座力物理化的长线曲线。',
    },
  },
  '40': {
    railSummary: '私盐流民引燃 → 两税苛征 → 880 黄巢破京 · 崩解合围。',
    edgeLabels: `
    <text x="240" y="255" fill="var(--sj-vermil)">基座引燃</text>
    <text x="560" y="285" fill="var(--sj-celadon)">藩镇掣肘</text>
    <text x="430" y="365" fill="var(--sj-vermil)" font-size="12" font-weight="600">880 破京</text>
    <text x="180" y="340" fill="var(--sj-vermil)">874 王仙芝先声</text>`,
    nodeBoost: {
      huangchao: '875 聚众，880 破京僭号大齐——晚唐崩解总引爆，非流寇偶然。',
      siyan: '专卖苛酷与灾荒使私盐贩聚为流民大军——基座承载崩溃的引燃力。',
    },
  },
  '42': {
    railSummary: '1138 定都临安 → 守江必守淮 → 1141 和议锁定偏安。',
    edgeLabels: `
    <text x="410" y="255" text-anchor="middle" fill="var(--sj-vermil)" font-size="12" font-weight="600">淮上对峙</text>
    <text x="430" y="355" fill="var(--sj-vermil)">1142 杀岳飞</text>
    <text x="200" y="400" fill="var(--sj-ochre)">江南漕赋命脉</text>
    <text x="560" y="340" fill="var(--sj-vermil)">1141 绍兴和议</text>`,
    nodeBoost: {
      linan: '1138 定都临安——政治中心与江南财赋区重合，区域化重整的空间选择。',
      yuefei: '主战派代表，绍兴十一年遇害——军事弹性被自毁，偏安路径依赖由此锁定。',
    },
  },
  '43': {
    railSummary: '1004 澶州僵持 → 1005 岁币盟约 → 百年和平 · 积弱远因。',
    edgeLabels: `
    <text x="430" y="225" fill="var(--sj-vermil)">床弩射杀萧挞凛</text>
    <text x="430" y="340" fill="var(--sj-ochre)" font-size="12" font-weight="600">1005 盟约</text>
    <text x="200" y="275" fill="var(--sj-celadon)">寇准力主亲征</text>
    <text x="560" y="400" fill="var(--sj-celadon)">榷场对冲岁币</text>`,
    nodeBoost: {
      suibi: '银十万两、绢二十万匹——以财政交易换军事和平的枢纽，开启积弱路径。',
      chanzhou: '辽军南下抵此僵持，床弩射杀辽将扭转士气——军事节点促成议和。',
    },
  },
  '44': {
    railSummary: '1219 西征 → 灭花剌子模 → 哲别速不台远征 · 扩张极限。',
    edgeLabels: `
    <text x="410" y="255" text-anchor="middle" fill="var(--sj-vermil)" font-size="12" font-weight="600">1219 西征</text>
    <text x="200" y="300" fill="var(--sj-ochre)">复仇合法性</text>
    <text x="560" y="355" fill="var(--sj-vermil)">1223 迦勒迦河</text>
    <text x="430" y="400" fill="var(--sj-paper-300)">后勤极限</text>`,
    nodeBoost: {
      chengjis: '因商队与使团被杀而西征——「奉天讨罪」叙事提供战争合法性；两年灭花剌子模达军事力峰值。',
      hualazi: '撒马尔罕、玉龙杰赤陷落——征服速度超过统治整合，后勤与统治成本极限显现。',
    },
  },
  '52': {
    railSummary: '1919.5.4 游行 → 拒签和约 → 叙事夺权 · 五四引爆。',
    edgeLabels: `
    <text x="310" y="195" fill="var(--sj-ochre)">巴黎和会失败</text>
    <text x="410" y="275" fill="var(--sj-vermil)">外争国权</text>
    <text x="430" y="395" fill="var(--sj-celadon)" font-size="12" font-weight="600">6.28 拒签</text>
    <text x="600" y="395" fill="var(--sj-ochre)">三罢扩展</text>`,
    nodeBoost: {
      xuesheng: '北京学生三千余人集会——以青年群体夺「爱国」叙事定义权，体系外变量介入。',
      juqian: '中国代表拒绝签字——运动直接绩效兑现，传统天命叙事进一步破产。',
    },
  },
  '53': {
    railSummary: '1926.7.9 誓师 → 北伐击溃军阀 → 1928 东北易帜 · 形式统一。',
    edgeLabels: `
    <text x="300" y="195" fill="var(--sj-ochre)">广州誓师</text>
    <text x="410" y="255" text-anchor="middle" fill="var(--sj-vermil)" font-size="12" font-weight="600">北伐</text>
    <text x="600" y="340" fill="var(--sj-vermil)">1927.4.12 分裂</text>
    <text x="430" y="440" fill="var(--sj-celadon)">1928.12 易帜</text>`,
    nodeBoost: {
      beifajun: '政治工作+精锐部队——组织度胜过军阀松散联盟，军事力定正统的近代样本。',
      yizhi: '张学良宣布服从国民政府——北伐形式完成统一，农民问题未解藏深层分裂。',
    },
  },
  '56': {
    railSummary: '前260 赵括冒进 → 白起断粮 → 坑杀〔争议〕· 赵国衰变。',
    edgeLabels: `
    <text x="220" y="230" fill="var(--sj-ochre)">赵括出击</text>
    <text x="540" y="245" fill="var(--sj-vermil)" font-size="12" font-weight="600">白起围歼</text>
    <text x="430" y="350" fill="var(--sj-ochre)" font-size="12" font-weight="600">断粮四十六日</text>
    <text x="540" y="395" fill="var(--sj-vermil)">坑杀〔争议〕</text>
    <text x="130" y="310" fill="var(--sj-celadon)">廉颇坚壁被换</text>`,
    nodeBoost: {
      liangdao: '白起断赵军粮道——后勤链为结构实因，非单纯勇力；与官渡乌巢同型。',
      kengsha: '《史记》载坑杀四十余万——学界争议，须标估算，禁止择一断言。',
    },
  },
  '57': {
    railSummary: '周室虚化 → 诸子竞争 → 诸侯采纳定正统 · 法家胜出。',
    edgeLabels: `
    <text x="200" y="210" fill="var(--sj-paper-100)">仁义叙事</text>
    <text x="290" y="210" fill="var(--sj-vermil)">刑名胜出</text>
    <text x="430" y="340" fill="var(--sj-celadon)">稷下学宫</text>
    <text x="600" y="340" fill="var(--sj-ochre)" font-size="12" font-weight="600">诸侯采纳</text>
    <text x="410" y="430" fill="var(--sj-paper-300)">士人私学底盘</text>`,
    nodeBoost: {
      fa: '商鞅韩非以法令重塑汲取与动员——秦采纳，制度设计权随叙事竞争落定（→ SJ-11）。',
      zhou: '礼崩乐坏后周室衰微，天命叙事垄断破裂——思想市场替代单一天命。',
    },
  },
};

function buildPolishedConfig(num) {
  const c = CASE_BY_NUM[num];
  const meta = POLISH_META[num];
  if (!c || !meta) return null;

  const base = caseToSliceConfig(c);
  const nodeData = { ...base.nodeData };
  for (const [id, boost] of Object.entries(meta.nodeBoost || {})) {
    if (boost && nodeData[id]) {
      nodeData[id] = {
        ...nodeData[id],
        body: nodeData[id].body.includes(boost.slice(0, 12))
          ? nodeData[id].body
          : `${nodeData[id].body} ${boost}`,
      };
    }
  }

  const origSvg = base.svg;
  return {
    ...base,
    railSummary: meta.railSummary,
    legend: `${base.legend} 精绘轮：机制边含年号/引爆点标注；节点副标含五力色义。`,
    nodeData,
    svg: () => {
      const inner = origSvg();
      const m = inner.match(/<g fill="none" stroke-linecap="round">[\s\S]*?<\/g>/);
      if (!m) return inner;
      const edgeBlock = m[0];
      const labels = meta.edgeLabels || '';
      return inner.replace(
        edgeBlock,
        `${edgeBlock}\n  <g font-family="Songti SC,Noto Serif SC,serif" font-size="11">${labels}\n  </g>`,
      );
    },
  };
}

export const POLISH_SLICE_CONFIGS = Object.fromEntries(
  Object.keys(POLISH_META)
    .map((num) => [num, buildPolishedConfig(num)])
    .filter(([, v]) => v),
);
