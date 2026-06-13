import { PageHeader } from '../../app/ui.jsx';
import ZhengdiPanel from './ZhengdiPanel.jsx';
import './zhengdi.css';

/**
 * 中国人群分析 · 征地拆迁与失地农民(GY-51)
 * 人群画像分层第四十九子集 · 与 GY-50 同构
 * 注记:以土地制度框架处理,呈现征地补偿安置的制度框架(事实层)与其争议
 * (补偿标准、增值分配、个别强拆等,归因并置、不裁决具体个案),聚焦结构。
 */
export default function ZhengdiPage() {
  return (
    <div className="zhengdi-page">
      <PageHeader
        badge="GY-51 · 人群画像分层"
        title="征地拆迁与失地农民"
        subtitle="存储被征用的进程 · 一次性置换"
      />
      <ZhengdiPanel />
    </div>
  );
}
