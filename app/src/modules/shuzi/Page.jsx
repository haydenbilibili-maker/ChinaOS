import { PageHeader } from '../../app/ui.jsx';
import ShuziPanel from './ShuziPanel.jsx';
import './shuzi.css';

/**
 * 中国人群分析 · 数字原住民:10 后与屏幕养大的一代(GY-26)
 * 人群画像分层第二十四子集 · 第二批收官 · 与 GY-25 同构 · 被平台改写的引导程序模型
 */
export default function ShuziPage() {
  return (
    <div className="shuzi-page">
      <PageHeader
        badge="GY-26 · 人群画像分层"
        title="数字原住民 · 10 后与屏幕养大的一代"
        subtitle="被平台改写的引导程序 · 社会化首次由算法中介"
      />
      <ShuziPanel />
    </div>
  );
}
