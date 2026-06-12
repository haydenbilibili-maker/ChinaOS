import { useEffect, useState } from 'react';
import { fetchFigureAvatar, subscribeFigureAvatar } from './figureAvatar.js';
import { VERIFY_TIER } from './avatarVerify.js';

/**
 * @param {string|{ id?: string, name: string, nameEn?: string, wikiTitle?: string, wikiLang?: string, avatarUrl?: string, verifyTier?: string, source?: string }} nameOrMeta
 * @param {string} [avatarUrl] legacy: optional seed override
 * @param {boolean} [enabled=true] defer fetch until visible when false
 */
export function useFigureAvatar(nameOrMeta, avatarUrl, enabled = true) {
  const [url, setUrl] = useState(null);
  const [verifyTier, setVerifyTier] = useState(VERIFY_TIER.EMPTY);
  const [status, setStatus] = useState('idle');

  const meta = typeof nameOrMeta === 'string'
    ? { name: nameOrMeta, avatarUrl }
    : nameOrMeta;
  const name = meta?.name || '';
  const resolvedUrl = meta?.avatarUrl || avatarUrl;

  useEffect(() => {
    if (!name || !enabled) {
      setUrl(null);
      setVerifyTier(VERIFY_TIER.EMPTY);
      setStatus('idle');
      return undefined;
    }

    let cancelled = false;
    setStatus('loading');

    const payload = { ...meta, avatarUrl: resolvedUrl };

    const apply = (result) => {
      if (cancelled) return;
      const tier = result?.tier || VERIFY_TIER.EMPTY;
      const resolved = tier === VERIFY_TIER.VERIFIED ? (result?.url || null) : null;
      setUrl(resolved);
      setVerifyTier(tier);
      setStatus(tier === VERIFY_TIER.VERIFIED && resolved ? 'verified' : 'empty');
    };

    const unsub = subscribeFigureAvatar(payload, undefined, apply);

    fetchFigureAvatar(payload).then(apply);

    return () => {
      cancelled = true;
      unsub();
    };
  }, [name, resolvedUrl, enabled, meta?.id, meta?.nameEn, meta?.wikiTitle, meta?.wikiLang, meta?.verifyTier, meta?.source]);

  return {
    url,
    verifyTier,
    verified: verifyTier === VERIFY_TIER.VERIFIED && !!url,
    status,
  };
}
