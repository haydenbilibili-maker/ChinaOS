import { useEffect, useRef } from 'react';
import contentHtml from './content.html?raw';
import { initHeshanFiscal } from './fiscalInit.js';

/** 重构河山 · #hs-fiscal-app 样式隔离 */
export default function HeshanFiscalPanel() {
  const rootRef = useRef(null);

  useEffect(() => {
    const cleanup = initHeshanFiscal(rootRef.current);
    return cleanup;
  }, []);

  return (
    <div className="heshanFiscal-module-wrap">
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
