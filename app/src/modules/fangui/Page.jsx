import { PageHeader } from '../../app/ui.jsx';
import FanguiPanel from './FanguiPanel.jsx';
import './fangui.css';

/**
 * 中国人群分析 · 被拐卖与反拐救助对象(GY-52)
 * 人群画像分层第五十子集 · 与 GY-51 同构
 * 注记:以妇女儿童权益保护与反拐制度框架处理,把被拐卖者作为受害者对待,
 * 聚焦救助、团圆、预防与法律完善;不渲染、不消费具体个案,法律量刑讨论归因呈现、不裁决。
 */
export default function FanguiPage() {
  return (
    <div className="fangui-page">
      <PageHeader
        badge="GY-52 · 人群画像分层"
        title="被拐卖与反拐救助对象"
        subtitle="被非法迁移、地址被改写的进程 · 寻址丢失"
      />
      <FanguiPanel />
    </div>
  );
}
