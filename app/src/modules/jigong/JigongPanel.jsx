import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './jigongContent.html?raw';
import { initJigong } from './jigongInit.js';
import { resolveJigongTab } from '../../lib/jigong/routing.js';

/** 制造业技术工人 · 被需要却不被向往 GY-22 · #jg-app 样式与 localStorage 隔离 */
export default function JigongPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveJigongTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initJigong(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="jigong-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
