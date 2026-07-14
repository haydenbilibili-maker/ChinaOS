import { registerThreeForcesInput } from '../../domain/threeForcesInputs.ts';
import {
  bureaucraticParalysisIndex,
  THREE_FORCES_LINKAGE_RATIONALE,
} from '../../domain/anticorruption.ts';

/** 向三力「内部危机」维注册官场躺平读数 */
registerThreeForcesInput({
  dimension: 'internal_crisis',
  source: 'anticorruption',
  label: '官场躺平指数',
  reading: bureaucraticParalysisIndex,
  rationale: THREE_FORCES_LINKAGE_RATIONALE,
});
