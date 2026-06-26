import { useEffect, useRef } from 'react';
import contentHtml from './content.html?raw';
import { initHeshanCalibration } from './calibrationInit.js';

/** 重构河山 · #hs-calibration-app 样式隔离 */
export default function HeshanCalibrationPanel() {
  const rootRef = useRef(null);

  useEffect(() => {
    const cleanup = initHeshanCalibration(rootRef.current);
    return cleanup;
  }, []);

  return (
    <div className="heshanCalibration-module-wrap">
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
