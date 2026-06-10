import { useEffect, useState } from 'react';
import { fetchFigureAvatarUrl, subscribeFigureAvatar } from './figureAvatar.js';

/**
 * @param {string} name
 * @param {string} [avatarUrl] optional seed override from fields.avatarUrl
 * @param {boolean} [enabled=true] defer fetch until visible when false
 */
export function useFigureAvatar(name, avatarUrl, enabled = true) {
  const [url, setUrl] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!name || !enabled) {
      setUrl(null);
      setStatus('idle');
      return undefined;
    }

    let cancelled = false;
    setStatus('loading');

    const unsub = subscribeFigureAvatar(name, avatarUrl, (resolved) => {
      if (cancelled) return;
      setUrl(resolved);
      setStatus(resolved ? 'loaded' : 'fallback');
    });

    fetchFigureAvatarUrl(name, avatarUrl).then((resolved) => {
      if (cancelled) return;
      setUrl(resolved);
      setStatus(resolved ? 'loaded' : 'fallback');
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, [name, avatarUrl, enabled]);

  return { url, status };
}
