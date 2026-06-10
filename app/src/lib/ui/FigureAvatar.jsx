import React, { useEffect, useRef, useState } from 'react';
import { useFigureAvatar } from './useFigureAvatar.js';
import { figureMonogramChar, figureMonogramColor } from './figureAvatar.js';

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} [props.avatarUrl]
 * @param {number} [props.size=32]
 * @param {boolean} [props.ring]
 * @param {string} [props.className]
 */
export default function FigureAvatar({ name, avatarUrl, size = 32, ring = false, className = '' }) {
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const { url, status } = useFigureAvatar(name, avatarUrl, visible);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [name, url]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '80px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [name]);

  const showImg = url && !imgError && status === 'loaded';
  const loading = visible && status === 'loading';
  const monogram = figureMonogramChar(name);
  const bg = figureMonogramColor(name);
  const fontSize = Math.max(10, Math.round(size * 0.42));
  const ringStyle = ring
    ? { boxShadow: '0 0 0 2px rgba(34,211,238,0.35)' }
    : {};

  return (
    <span
      ref={rootRef}
      className={`inline-flex items-center justify-center rounded-full shrink-0 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        background: showImg ? 'var(--bg-base)' : bg,
        border: '1px solid var(--border-subtle)',
        color: '#e8f4f8',
        fontSize,
        fontWeight: 700,
        position: 'relative',
        ...ringStyle,
      }}
      title={name}
      aria-hidden={!name}
    >
      {loading && <span className="absolute inset-0 rounded-full c2os-avatar-shimmer" />}
      {showImg ? (
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ opacity: loading ? 0.55 : 1 }}>{monogram}</span>
      )}
    </span>
  );
}
