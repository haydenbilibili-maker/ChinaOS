/**
 * 治理权力三层模型 · China OS 共用领域层
 * ---------------------------------------------------------------------------
 * 用于三层归因分析器、总理权限半径等模块的唯一耦合点。
 * 评估的是「结构位置」，不是具体在任官员的个人功过。
 */

/** 权力层级：路线 → 决策 → 执行（自上而下约束递增） */
export type PowerLayer = 'direction' | 'decision' | 'execution';

/**
 * 路线层 direction：决定「往哪走」——经济体制基本方向、国家与市场边界、
 * 国企与民企相对地位、增长与安全的排序。当前由党中央/最高领导人决定。
 * 特征：执行层不可更改，且它设定下面两层的全部约束条件。
 */
/**
 * 决策层 decision：决定「用什么方案、多大剂量」——赤字率、房产税推不推、
 * 社保扩多大、财税体制改不改。朱镕基时代大体在国务院，现已大部分上移至
 * 中央财经委等党的机构。特征：结构性改革发生在这一层。
 */
/**
 * 执行层 execution：决定「怎么落地」——涉企执法规范、清理拖欠账款、免签开放、
 * 统一大市场、政务服务。国务院主场。特征：不改变方向，但深刻影响政策质量与民众体感。
 */

export interface Issue {
  id: string;
  title: string;
  layer: PowerLayer;
  rationale: string;
  accountableActor: string;
  reasonableExpectation: string;
  misattribution?: string;
  tags: string[];
  /** 自由文本判定用的显式关键词（可审计规则，非 LLM） */
  keywords?: string[];
  /** 用户自定义议题标记 */
  custom?: boolean;
}

export interface LayerMeta {
  id: PowerLayer;
  label: string;
  shortLabel: string;
  color: string;
  colorBg: string;
  description: string;
}

export const POWER_LAYERS: PowerLayer[] = ['direction', 'decision', 'execution'];

export const LAYER_META: Record<PowerLayer, LayerMeta> = {
  direction: {
    id: 'direction',
    label: '路线层',
    shortLabel: '路线',
    color: '#cf4a3d',
    colorBg: '#2a1513',
    description:
      '决定「往哪走」——体制方向、国家与市场边界、增长与安全排序。执行层不可更改其约束。',
  },
  decision: {
    id: 'decision',
    label: '决策层',
    shortLabel: '决策',
    color: '#cf9a32',
    colorBg: '#29200f',
    description:
      '决定「用什么方案、多大剂量」——赤字率、社保扩面、财税体制。结构性改革发生在此层。',
  },
  execution: {
    id: 'execution',
    label: '执行层',
    shortLabel: '执行',
    color: '#4f9e72',
    colorBg: '#11241a',
    description:
      '决定「怎么落地」——执法规范、账款清理、免签开放、统一大市场。不改变方向，但影响体感。',
  },
};

export const ATTRIBUTION_STORAGE_KEY = 'chinaos.attribution.issues.v1';

export const ATTRIBUTION_DISCLAIMERS = [
  '执行层不是完全无辜的：执行力度、优先级、资源投放本身有裁量空间，不能拿「我只是执行」豁免一切。',
  '层与层之间有「建议回路」：一个有分量的总理能在多大程度上影响上层，本身是其能力的一部分。',
  '本工具只诊断「谁能做」，不诊断「做得对不对」。路线层的决策本身也可被评价，但评价对象应是决策者，不是执行者。摆对被告席，是公正评价的前提。',
] as const;

/** 总理任期 · 代表作 */
export interface Policy {
  title: string;
  layer: PowerLayer;
  note: string;
  year: number;
  /** 关联三层归因分析器议题 id（跨模块联动） */
  issueId?: string;
}

/** 任内或全局转折点 */
export interface Inflection {
  year: number;
  event: string;
  significance: string;
  /** 是否在主图时间轴标注 */
  global?: boolean;
}

/** 任内权限半径分段（如前强后弱、决策层收缩） */
export interface RadiusPhase {
  start: number;
  end: number | null;
  radius: PowerLayer[];
  /** 路线层是否部分触及（虚线/半透明带） */
  directionPartial?: boolean;
}

/** 总理任期 · 权限半径 */
export interface PremierTerm {
  id: string;
  name: string;
  /** Wikimedia / 头像解析 */
  nameEn?: string;
  wikiTitle?: string;
  wikiLang?: string;
  avatarUrl?: string;
  verifyTier?: string;
  source?: string;
  start: number;
  end: number | null;
  radius: PowerLayer[];
  radiusNote: string;
  signaturePolicies: Policy[];
  constraints: string;
  inflectionPoints: Inflection[];
  keyAnnotation?: string;
  radiusPhases?: RadiusPhase[];
}

/** 结构性驱动力（解释权限收缩） */
export interface StructuralDriver {
  id: string;
  title: string;
  summary: string;
  mechanism: string;
}

export const PREMIER_RADIUS_THESIS =
  '这条曲线不是四个人能力的排序，而是一条制度变迁的轨迹。' +
  '朱镕基之所以能改，因为他同时是诊断者和处方权持有者；' +
  '今天的困境在于，诊断能力仍在（看那些整治乱罚款、清理欠款的措辞就知道），' +
  '但处方权已上移，而上移之后，这些结构性改革在最高层的优先级序列里，' +
  '排在安全、科技自主、政治稳定之后。' +
  '——真正的问题不是「中国该怎么改」（药方人人会开），' +
  '而是「在一个诊断权与处方权已经分离的治理结构里，改革如何才可能发生」。';

/** 宏观信号灯读数：green=政策向好（已启动），与三力 ForceLevel 语义相反 */
export type SignalStatus = 'red' | 'amber' | 'green';

/**
 * 三力压力读数：near=窗口逼近（高压=好事，改革更近），calm=沉寂。
 * ⚠ 与 SignalStatus 方向相反——勿将 near 着色为「坏消息」。
 */
export type ForceLevel = 'calm' | 'build' | 'near';

/** 宏观再平衡态势合成 */
export type Regime = 'defense' | 'watch' | 'offense';

/** 改革窗口临近度分段 */
export type Proximity = 'quiet' | 'building' | 'imminent';

export const SIGNAL_STORAGE_KEY = 'chinaos.signals.v1';
export const THREE_FORCES_STORAGE_KEY = 'chinaos.threeforces.v1';

export const ATTRIBUTION_ROUTE = '/modules/attribution';
export const PREMIER_RADIUS_ROUTE = '/modules/premier-radius';
export const SIGNAL_PANEL_ROUTE = '/modules/signal-panel';
export const THREE_FORCES_ROUTE = '/modules/three-forces';
export const CUSHION_MONITOR_ROUTE = '/modules/cushion-monitor';

/** 信号卡与三层归因议题的跨模块联动 */
export interface SignalAttributionLink {
  issueId: string;
  layer: PowerLayer;
}

/** 垫子厚度监测 · 四国对照锚点（躺下那一刻的初始条件） */
export type CushionCountry = 'cn' | 'jp' | 'kr' | 'us';

/** 单层垫子相对厚度（0–100，结构比较刻度，非精确数值） */
export interface CushionScore {
  s: number;
  t: string;
}

/** 四层垫子之一：国家 / 家庭 / 制度 / 时间 */
export interface CushionLayer {
  no: string;
  name: string;
  q: string;
  metric: string;
  vals: Record<CushionCountry, CushionScore>;
  verdict: string;
}

/**
 * 命运矩阵象限：垫子厚度 × 新牌桌是否打开。
 * 核心洞察：命运 = 垫子厚度 × 新牌桌（乘积，非加法）。
 */
export type CushionTableState = 'closed' | 'open';
export type CushionThickness = 'thick' | 'thin';

export const CUSHION_COUNTRY_COLORS: Record<CushionCountry, string> = {
  cn: '#cf4a3d',
  jp: '#7a8fb8',
  kr: '#b07fc0',
  us: '#4f9e72',
};
