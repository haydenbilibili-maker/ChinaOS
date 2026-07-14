import { describe, expect, it } from 'vitest';
import {
  FORBIDDEN_MODULE_FIELDS,
  bureaucraticParalysisIndex,
  getModuleSchema,
  RENT_SOURCES,
} from '../../../domain/anticorruption.ts';
import { getThreeForcesInputs } from '../../../domain/threeForcesInputs.ts';
import '../store.ts';

describe('anticorruption module schema', () => {
  it('拒绝人事数据：模块不得包含任何官员姓名字段', () => {
    const schema = getModuleSchema();
    FORBIDDEN_MODULE_FIELDS.forEach((field) => {
      expect(schema).not.toHaveProperty(field);
    });
  });

  it('exposes rent sources from official terminology only', () => {
    expect(RENT_SOURCES).toHaveLength(3);
    expect(RENT_SOURCES.map((r) => r.officialTerm)).toEqual([
      '干部选拔任用',
      '工程承揽',
      '企业经营',
    ]);
    const project = RENT_SOURCES.find((r) => r.source === 'project_contracting');
    expect(project?.trend).toBe('快速扩大');
    expect(project?.surfaceSize).toBeGreaterThanOrEqual(90);
  });

  it('registers internal_crisis input for three forces linkage', () => {
    const inputs = getThreeForcesInputs('internal_crisis');
    const anticorruption = inputs.find((i) => i.source === 'anticorruption');
    expect(anticorruption).toBeDefined();
    expect(anticorruption?.label).toBe('官场躺平指数');
    expect(anticorruption?.reading()).toBe(bureaucraticParalysisIndex());
  });
});
