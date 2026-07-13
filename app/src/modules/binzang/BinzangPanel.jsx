import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './binzangContent.html?raw';
import { initBinzang } from './binzangInit.js';
import { resolveBinzangTab } from '../../lib/binzang/routing.js';

/** 殡葬与临终关怀从业者 GY-46 · #bz-app 样式与 localStorage 隔离 */
export default function BinzangPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveBinzangTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initBinzang(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="binzang-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
