import { describe, expect, it } from 'vitest';
import {
  ABLE_OFFICIAL_PARADOX_ROUTE,
  MECHANISMS,
  getModuleSchema,
} from '../../../domain/ableOfficialParadox.ts';

describe('ableOfficialParadox module', () => {
  it('registers at expected route', () => {
    expect(ABLE_OFFICIAL_PARADOX_ROUTE).toBe('/modules/able-official-paradox');
  });

  it('exposes three structural mechanisms from source HTML', () => {
    expect(MECHANISMS).toHaveLength(3);
    expect(MECHANISMS[0].title).toContain('违规');
    expect(MECHANISMS[2].title).toContain('政绩和租金');
  });

  it('schema has no personal indictment fields', () => {
    const schema = getModuleSchema();
    expect(schema).not.toHaveProperty('officials');
    expect(schema).not.toHaveProperty('purgeCount');
  });
});
