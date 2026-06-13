import { PageHeader } from '../../app/ui.jsx';
import BinzangPanel from './BinzangPanel.jsx';
import './binzang.css';

/**
 * 中国人群分析 · 殡葬与临终关怀从业者(GY-46)
 * 人群画像分层第四十四子集 · 第四批收官 · 与 GY-45 同构 · 进程回收器 / 系统需要却避而不见
 */
export default function BinzangPage() {
  return (
    <div className="binzang-page">
      <PageHeader
        badge="GY-46 · 人群画像分层 · 第四批收官"
        title="殡葬与临终关怀从业者"
        subtitle="进程回收器 · 系统需要却避而不见"
      />
      <BinzangPanel />
    </div>
  );
}
