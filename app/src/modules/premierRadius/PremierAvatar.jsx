import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps } from '../../lib/ui/figureAvatarResolve.js';

/**
 * 总理肖像 · 水墨观象台黄铜框
 * @param {{ term: import('../../domain/governance').PremierTerm, size?: number, eager?: boolean, className?: string }} props
 */
export default function PremierAvatar({ term, size = 44, eager = false, className = '' }) {
  if (!term) return null;
  return (
    <span
      className={`pr-premier-avatar ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <FigureAvatar {...figureAvatarProps(term)} size={size} eager={eager} className="pr-premier-avatar-img" />
    </span>
  );
}
