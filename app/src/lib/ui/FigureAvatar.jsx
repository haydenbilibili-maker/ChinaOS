import React, { useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';
import { useFigureAvatar } from './useFigureAvatar.js';
import { figureMonogramChar, figureMonogramBackground } from './figureAvatar.js';
import { VERIFY_TIER } from './avatarVerify.js';

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} [props.id]
 * @param {string} [props.nameEn]
 * @param {string} [props.wikiTitle]
 * @param {string} [props.wikiLang]
 * @param {string} [props.avatarUrl]
 * @param {string} [props.verifyTier]
 * @param {string} [props.source] curated | zh-default | …
 * @param {number} [props.size=32]
 * @param {boolean} [props.ring]
 * @param {string} [props.className]
 * @param {boolean} [props.eager] skip intersection observer
 * @param {boolean} [props.showVerifiedBadge] show 已核验 badge when portrait verified
 * @param {'initial'|'silhouette'} [props.emptyStyle='initial'] empty fallback style
 */
export default function FigureAvatar({
  name,
  id,
  nameEn,
  wikiTitle,
  wikiLang,
  avatarUrl,
  verifyTier: verifyTierProp,
  source,
  size = 32,
  ring = false,
  className = '',
  eager = false,
  showVerifiedBadge = false,
  emptyStyle = 'initial',
}) {
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(eager);
  const meta = { id, name, nameEn, wikiTitle, wikiLang, avatarUrl, verifyTier: verifyTierProp, source };
  const { url, verified, status } = useFigureAvatar(meta, avatarUrl, visible || eager);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [name, url]);

  useEffect(() => {
    if (eager) {
      setVisible(true);
      return undefined;
    }
    const el = rootRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '120px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [name, eager]);

  const showImg = url && !imgError && verified;
  const loading = visible && status === 'loading';
  const monogram = figureMonogramChar(nameEn || name);
  const bg = figureMonogramBackground(name);
  const fontSize = Math.max(10, Math.round(size * (monogram.length > 1 ? 0.34 : 0.42)));
  const iconSize = Math.max(12, Math.round(size * 0.48));
  const ringStyle = ring
    ? { boxShadow: '0 0 0 2px rgba(34,211,238,0.35)' }
    : {};

  return (
    <span
      ref={rootRef}
      className={`inline-flex items-center justify-center rounded-full shrink-0 overflow-hidden relative ${className}`}
      style={{
        width: size,
        height: size,
        background: showImg ? 'var(--bg-base)' : bg,
        border: '1px solid var(--border-subtle)',
        color: 'rgba(232,244,248,0.92)',
        fontSize,
        fontWeight: 600,
        position: 'relative',
        letterSpacing: monogram.length > 1 ? '-0.04em' : undefined,
        ...ringStyle,
      }}
      title={name}
      aria-label={name || undefined}
      role={name ? 'img' : undefined}
    >
      {loading && !showImg && (
        <span className="absolute inset-0 rounded-full c2os-avatar-shimmer" style={{ opacity: 0.35 }} />
      )}
      {showImg ? (
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : emptyStyle === 'silhouette' ? (
        <User size={iconSize} strokeWidth={1.75} style={{ opacity: loading ? 0.45 : 0.72 }} />
      ) : (
        <span style={{ opacity: loading ? 0.45 : 0.88, lineHeight: 1 }}>{monogram}</span>
      )}
      {showVerifiedBadge && verified && showImg && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded px-0.5 text-[7px] font-bold leading-tight"
          style={{ background: 'rgba(16,185,129,0.9)', color: '#042f1a', border: '1px solid rgba(16,185,129,0.5)' }}
          title="肖像已核验"
        >
          核
        </span>
      )}
    </span>
  );
}

export { VERIFY_TIER };
