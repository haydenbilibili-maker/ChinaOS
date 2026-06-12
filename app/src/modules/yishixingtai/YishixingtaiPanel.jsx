import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './yishixingtaiContent.html?raw';
import { initYishixingtai } from './yishixingtaiInit.js';
import { resolveYishiTab } from '../../lib/yishixingtai/routing.js';

/** 意识形态架构 GY-02 · #ys-app 样式与 localStorage 隔离 */
export default function YishixingtaiPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(() => ({
    tab: resolveYishiTab(searchParams.get('tab') || undefined),
    tension: searchParams.get('tension') || undefined,
    watch: searchParams.get('watch') || undefined,
    comp: searchParams.get('comp') || undefined,
  }), [searchParams]);

  useEffect(() => {
    const cleanup = initYishixingtai(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="yishixingtai-module-wrap">
      <div
        id="ys-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
