import { PageHeader } from '../../app/ui.jsx';
import GanranPanel from './GanranPanel.jsx';
import './ganran.css';

/**
 * 中国人群分析 · 受污名疾病与感染者群体(GY-57)
 * 人群画像分层第五十五子集 · 与 GY-56 同构
 * 注记:以公共卫生与反歧视框架处理,把感染者/携带者理解为「被反复误报的良性进程」,
 * 以科学事实校正污名、记录反歧视制度的进展、也指出观念滞后,
 * 尊重感染者的人格与隐私、不渲染、不猎奇;医学风险与社会污名的严重脱节。
 */
export default function GanranPage() {
  return (
    <div className="ganran-page">
      <PageHeader
        badge="GY-57 · 人群画像分层"
        title="受污名疾病与感染者群体"
        subtitle="被反复误报的良性进程 · 医学风险与社会污名的脱节"
      />
      <GanranPanel />
    </div>
  );
}
