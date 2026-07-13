import type { Issue, PowerLayer } from '../../domain/governance.ts';
import { LAYER_META } from '../../domain/governance.ts';

export interface JudgmentResult {
  issue: Issue;
  /** 0–1 规则匹配置信度 */
  confidence: number;
  /** 匹配方式 */
  method: 'exact' | 'keyword' | 'fallback';
  /** 命中关键词（可审计） */
  matchedKeywords: string[];
}

const LAYER_KEYWORD_HINTS: Record<PowerLayer, string[]> = {
  direction: [
    '体制', '方向', '路线', '战略', '意识形态', '福利主义', '房住不炒', '国企',
    '安全', '增长排序', '金融抑制', '房产税', '土地财政', '模式',
  ],
  decision: [
    '赤字', '财政', '社保', '补贴', '化债', '地方债', '央地', '剂量', '规模',
    '普发', '转移支付', '育儿', '专项债', '预算',
  ],
  execution: [
    '执法', '清欠', '账款', '免签', '签证', '一网通办', '数字化', '营商环境',
    '乱收费', '公平竞争', '统一大市场', '落地', '督查', '审批',
  ],
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '').trim();
}

function tokenize(text: string): string[] {
  const n = normalize(text);
  const parts = n.match(/[\u4e00-\u9fff]{2,}|[a-z0-9]{2,}/gi) || [];
  return [...new Set(parts)];
}

function scoreIssue(query: string, issue: Issue): { score: number; keywords: string[] } {
  const q = normalize(query);
  const qTokens = tokenize(query);
  let score = 0;
  const matched: string[] = [];

  if (q === normalize(issue.title)) {
    return { score: 1000, keywords: [issue.title] };
  }

  if (q.includes(normalize(issue.title)) || normalize(issue.title).includes(q)) {
    score += 200;
    matched.push(issue.title);
  }

  const allKeywords = [
    ...(issue.keywords || []),
    ...issue.tags,
    issue.title,
  ];

  for (const kw of allKeywords) {
    const nk = normalize(kw);
    if (!nk) continue;
    if (q.includes(nk)) {
      score += 40 + Math.min(nk.length, 12);
      matched.push(kw);
    }
    for (const t of qTokens) {
      if (t.length >= 2 && (nk.includes(t) || t.includes(nk))) {
        score += 8;
        matched.push(kw);
      }
    }
  }

  return { score, keywords: [...new Set(matched)] };
}

function fallbackByLayerHints(query: string): PowerLayer {
  const q = normalize(query);
  let best: PowerLayer = 'decision';
  let bestScore = 0;

  for (const layer of ['direction', 'decision', 'execution'] as PowerLayer[]) {
    let s = 0;
    for (const hint of LAYER_KEYWORD_HINTS[layer]) {
      if (q.includes(normalize(hint))) s += 10;
    }
    if (s > bestScore) {
      bestScore = s;
      best = layer;
    }
  }
  return best;
}

function buildFallbackIssue(query: string, layer: PowerLayer): Issue {
  const meta = LAYER_META[layer];
  return {
    id: `fallback-${Date.now()}`,
    title: query.trim() || '未命名议题',
    layer,
    rationale: `自由文本未精确命中种子库；根据关键词规则推断落点「${meta.label}」。建议从预置库选择或录入完整自定义议题以提高精度。`,
    accountableActor: layer === 'direction'
      ? '党中央及相关顶层设计机构'
      : layer === 'decision'
        ? '中央财经委及相关决策协调机制'
        : '国务院各部委及地方执行主体',
    reasonableExpectation: layer === 'execution'
      ? '可期待执行层优化流程与落地质量；结构性问题需上溯决策/路线层。'
      : layer === 'decision'
        ? '可期待执行层高效落实已定方案；剂量与工具组合需决策层定调。'
        : '可期待执行层在既定方向内协同；方向本身需路线层调整。',
    misattribution: `常见误诊：将「${query.trim()}」相关结果过度归咎于执行层，而未区分「没做成」与「没权做」。`,
    tags: ['自由文本', '规则推断'],
    keywords: tokenize(query),
    custom: true,
  };
}

/** 规则判定：种子 + 自定义议题库，显式关键词打分，可审计 */
export function judgeIssue(query: string, issues: Issue[], issueId?: string): JudgmentResult {
  if (issueId) {
    const found = issues.find((i) => i.id === issueId);
    if (found) {
      return {
        issue: found,
        confidence: 1,
        method: 'exact',
        matchedKeywords: [found.title],
      };
    }
  }

  const trimmed = query.trim();
  if (!trimmed) {
    const fallback = buildFallbackIssue('（空输入）', 'decision');
    return { issue: fallback, confidence: 0, method: 'fallback', matchedKeywords: [] };
  }

  let best: Issue | null = null;
  let bestScore = 0;
  let bestKeywords: string[] = [];

  for (const issue of issues) {
    const { score, keywords } = scoreIssue(trimmed, issue);
    if (score > bestScore) {
      bestScore = score;
      best = issue;
      bestKeywords = keywords;
    }
  }

  if (best && bestScore >= 40) {
    const confidence = Math.min(1, bestScore / 200);
    return {
      issue: best,
      confidence,
      method: 'keyword',
      matchedKeywords: bestKeywords,
    };
  }

  const layer = fallbackByLayerHints(trimmed);
  const fallback = buildFallbackIssue(trimmed, layer);
  return {
    issue: fallback,
    confidence: Math.min(0.35, bestScore / 200),
    method: 'fallback',
    matchedKeywords: bestKeywords,
  };
}

export function misattributionWarning(issue: Issue): string | null {
  if (!issue.misattribution) return null;
  if (issue.misattribution.startsWith('常见误诊')) return issue.misattribution;
  return `常见误诊：${issue.misattribution}`;
}
