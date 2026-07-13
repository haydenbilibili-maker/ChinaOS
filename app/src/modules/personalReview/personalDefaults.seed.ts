import type { PersonalReviewState } from '../../domain/personal.ts';
import {
  blankCushionTemplates,
  blankDecisionTemplates,
} from '../../domain/personal.ts';

/**
 * 超个体决策复盘 · 演示默认数据
 * 来源：hayden-decision-review.html（Hayden 示例决策 / 垫子 / 安全垫）
 * 仅作首次访问模板；用户编辑后写入 localStorage 并覆盖。
 */
export function seedPersonalState(): PersonalReviewState {
  const decisions = blankDecisionTemplates().map((d) => {
    if (d.id === 'pension') {
      return {
        ...d,
        fields: d.fields.map((f) =>
          f.key === 'cost' ? { ...f, value: 15 } : f.key === 'flow' ? { ...f, value: 2600 } : f,
        ),
      };
    }
    if (d.id === 'store') {
      return {
        ...d,
        fields: d.fields.map((f) =>
          f.key === 'cost' ? { ...f, value: 15 } : f.key === 'flow' ? { ...f, value: 20000 } : f,
        ),
      };
    }
    if (d.id === 'house') {
      return {
        ...d,
        hasCashflow: true,
        fields: d.fields.map((f) =>
          f.key === 'cost' ? { ...f, value: 35 } : f.key === 'now' ? { ...f, value: 50 } : f,
        ),
      };
    }
    return d;
  });

  const cushions = blankCushionTemplates().map((c) => {
    const scores: Record<string, number> = {
      国家垫: 55,
      家庭垫: 12,
      制度垫: 68,
      时间垫: 72,
    };
    return { ...c, score: scores[c.name] ?? c.score };
  });

  return {
    decisions,
    cushions,
    runway: {
      cash: 20,
      expense: 15000,
      divid: 20000,
      stress: 30,
    },
    pendingItems: ['个人品牌 / 内容资产（尚未变现）'],
  };
}
