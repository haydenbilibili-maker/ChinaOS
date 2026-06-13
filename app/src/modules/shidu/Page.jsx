import { PageHeader } from '../../app/ui.jsx';
import ShiduPanel from './ShiduPanel.jsx';
import './shidu.css';

/**
 * 中国人群分析 · 失独与计生后遗人群:政策账单的活体(GY-25)
 * 人群画像分层第二十三子集 · 与 GY-24 同构 · 按已废弃契约编译的程序模型
 */
export default function ShiduPage() {
  return (
    <div className="shidu-page">
      <PageHeader
        badge="GY-25 · 人群画像分层"
        title="失独与计生后遗人群 · 政策账单的活体"
        subtitle="按已废弃契约编译的程序 · 人生不可重新编译"
      />
      <ShiduPanel />
    </div>
  );
}
