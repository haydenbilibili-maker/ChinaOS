import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './renqunTupuContent.html?raw';
import { initRenqunTupu } from './renqunTupuInit.js';
import { resolveRenqunTupuTab } from '../../lib/renqun-tupu/routing.js';

/** 人群画像总图谱 GY-00 · #at-app 样式与 localStorage 隔离 */
export default function RenqunTupuPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveRenqunTupuTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initRenqunTupu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="renqun-tupu-module-wrap">
      <div
        id="at-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
