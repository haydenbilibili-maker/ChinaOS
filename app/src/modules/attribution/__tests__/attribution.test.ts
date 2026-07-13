import { describe, expect, it } from 'vitest';
import { SEED_ISSUES } from '../data/issues.seed.ts';
import { judgeIssue, misattributionWarning } from '../judgment.ts';
import { computeLayerStats, countByLayer } from '../stats.ts';

describe('judgeIssue', () => {
  it('returns exact match when issueId provided', () => {
    const result = judgeIssue('', SEED_ISSUES, 'exec-arrears');
    expect(result.method).toBe('exact');
    expect(result.confidence).toBe(1);
    expect(result.issue.id).toBe('exec-arrears');
    expect(result.issue.layer).toBe('execution');
  });

  it('matches free text by keywords', () => {
    const result = judgeIssue('清理拖欠企业账款', SEED_ISSUES);
    expect(result.issue.id).toBe('exec-arrears');
    expect(result.method).toBe('keyword');
    expect(result.confidence).toBeGreaterThan(0.2);
  });

  it('matches direction layer for property tax query', () => {
    const result = judgeIssue('房产税是否开征', SEED_ISSUES);
    expect(result.issue.layer).toBe('direction');
    expect(result.issue.id).toBe('dir-property-tax');
  });

  it('matches decision layer for deficit query', () => {
    const result = judgeIssue('赤字率定多少', SEED_ISSUES);
    expect(result.issue.layer).toBe('decision');
  });

  it('falls back with layer hints for unknown text', () => {
    const result = judgeIssue('涉企执法乱收费', SEED_ISSUES);
    expect(['execution', 'keyword']).toContain(result.method === 'keyword' ? 'keyword' : result.issue.layer);
    expect(result.issue.layer).toBe('execution');
  });

  it('includes misattribution warning template', () => {
    const issue = SEED_ISSUES.find((i) => i.id === 'exec-enforcement');
    const warning = misattributionWarning(issue);
    expect(warning).toContain('常见误诊');
  });
});

describe('computeLayerStats', () => {
  it('counts 18 seed issues across three layers', () => {
    const counts = countByLayer(SEED_ISSUES);
    expect(counts.total).toBe(18);
    expect(counts.direction).toBe(6);
    expect(counts.decision).toBe(6);
    expect(counts.execution).toBe(6);
  });

  it('computes split index as structure minus execution ratio', () => {
    const stats = computeLayerStats(SEED_ISSUES);
    expect(stats.structureRatio).toBeCloseTo(2 / 3, 2);
    expect(stats.executionRatio).toBeCloseTo(1 / 3, 2);
    expect(stats.splitIndex).toBeCloseTo(1 / 3, 2);
    expect(stats.diagnosticConclusion).toContain('棘手');
  });

  it('handles empty issue list', () => {
    const stats = computeLayerStats([]);
    expect(stats.total).toBe(0);
    expect(stats.diagnosticConclusion).toContain('为空');
  });
});
