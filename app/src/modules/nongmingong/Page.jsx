import GySliceShell from '../shared/gy/GySliceShell.jsx';
import NongmingongPanel from './NongmingongPanel.jsx';
import './nongmingong.css';

/**
 * 中国人群分析 · 农民工(新生代)(GY-06)
 * 人群画像分层第四子集 · 与 GY-03 青年 / GY-04 性少数 / GY-05 零工同构
 */
export default function NongmingongPage() {
  return (
    <GySliceShell
      badge="GY-06 · 人群画像分层"
      title="农民工"
      subtitle="未完成的迁徙 · 系统的换页内存"
      appId="nm-app"
      moduleId="nongmingong"
      className="nongmingong-page"
    >
      <NongmingongPanel />
    </GySliceShell>
  );
}
