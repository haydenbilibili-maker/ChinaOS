import type { Proximity, Regime } from './governance.ts';

export interface GovernanceVerdictResult {
  key: string;
  headline: string;
  body: string;
  reformTiming: string;
}

/** 压力合成分 → 临近度分段（与三力监测仪 WMETA 阈值一致） */
export function proximityBand(score: number): Proximity {
  if (score < 34) return 'quiet';
  if (score < 62) return 'building';
  return 'imminent';
}

const VERDICTS: Record<string, Omit<GovernanceVerdictResult, 'key'>> = {
  'defense+imminent': {
    headline: '表面未改 · 代价逼近',
    body:
      '信号灯仍处防御，但三力已逼近临界——政策读数显示治本未启动，「不改」的成本正在追上「改」。这是僵局最危的阶段：窗口可能突然打开，但个人不宜抢跑。',
    reformTiming:
      '改革时序：被动窗口临近。历史模板表明，真正转向往往在三力高压与内部危机咬合时出现；须备好方案清单，等待 C1 闸门或 A1 换锚确认，勿因压力读数 alone 加仓。',
  },
  'defense+quiet': {
    headline: '双低读数 · 窗口尚远',
    body:
      '信号灯与三力均处低读数：政策治本未启动，外部与内部压力亦未逼近临界。体制仍有充分余裕维持现状。',
    reformTiming:
      '改革时序：远未打开。个人以防御与「窄而深」求生为主，积累现金流与政策顺风能力；勿将零星补贴误判为体制转向。',
  },
  'offense+any': {
    headline: '治本确认 · 可切进攻',
    body:
      '治本闸门已开（A1 换锚或 C1 平减指数转正），态势许可由防御切进攻。无论三力压力读数如何，政策面已承认再平衡方向。',
    reformTiming:
      '改革时序：主动窗口已开。顺周期放量与结构性复苏可能重叠——但历史证明窗口极其短暂；方案写完再动，不抢跑于单一指标。',
  },
  'watch+building': {
    headline: '临界僵持 · 警惕慢性化',
    body:
      '信号灯处于观察区、三力积蓄——部分治本信号松动，不改的成本正在追平。最需警惕「慢性化」：危机被国有银行体系与行政工具拉长，改革功能被消解。',
    reformTiming:
      '改革时序：僵持积累期。保持防御主仓，紧盯 C1 平减闸门与 F2a 通缩读数；信号灯长期无绿灯 + 三力持续升压 = 僵局代价复利。',
  },
};

const FALLBACK: Omit<GovernanceVerdictResult, 'key'> = {
  headline: '双仪表交叉读数',
  body: '信号灯与三力读数处于非典型组合。并用两仪表：一个回答「改没改」，一个回答「何时被迫改」。',
  reformTiming:
    '改革时序：参照矩阵四象限（防御×逼近、防御×沉寂、进攻×任意、观察×积蓄）校准仓位；详见治理结构模块。',
};

/**
 * Regime × Proximity 合成矩阵（固定文案，非 LLM）
 */
export function computeGovernanceVerdict(
  regime: Regime,
  proximityScore: number,
): GovernanceVerdictResult {
  const band = proximityBand(proximityScore);

  let key: string | null = null;
  if (regime === 'offense') key = 'offense+any';
  else if (regime === 'defense' && band === 'imminent') key = 'defense+imminent';
  else if (regime === 'defense' && band === 'quiet') key = 'defense+quiet';
  else if (regime === 'watch' && band === 'building') key = 'watch+building';

  const picked = key ? VERDICTS[key] : FALLBACK;
  return { key: key ?? 'fallback', ...picked };
}
