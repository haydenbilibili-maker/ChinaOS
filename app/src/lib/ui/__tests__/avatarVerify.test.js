import { describe, expect, it } from 'vitest';
import {
  canAttemptVerifiedFetch,
  wikiTitleMatchesPerson,
  VERIFY_TIER,
} from '../avatarVerify.js';

describe('avatarVerify', () => {
  it('requires full Chinese name in wiki title', () => {
    expect(wikiTitleMatchesPerson('李强 (1959年)', '李强')).toBe(true);
    expect(wikiTitleMatchesPerson('习近平', '习近平')).toBe(true);
    expect(wikiTitleMatchesPerson('李某某', '李强')).toBe(false);
    expect(wikiTitleMatchesPerson('清华大学', '李强')).toBe(false);
  });

  it('gates network fetch to curated / verified_portrait only', () => {
    expect(canAttemptVerifiedFetch({
      source: 'curated',
      wikiTitle: '习近平',
    })).toBe(true);
    expect(canAttemptVerifiedFetch({
      verifyTier: VERIFY_TIER.VERIFIED,
      wikiTitle: '李强 (1959年)',
    })).toBe(true);
    expect(canAttemptVerifiedFetch({
      source: 'zh-default',
      wikiTitle: '某人',
    })).toBe(false);
    expect(canAttemptVerifiedFetch({
      verifyTier: 'official',
      source: '二十届一中全会',
      wikiTitle: '习近平',
    })).toBe(false);
  });
});
