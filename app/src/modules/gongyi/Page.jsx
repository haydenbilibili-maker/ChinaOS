import { PageHeader } from '../../app/ui.jsx';
import GongyiPanel from './GongyiPanel.jsx';
import './gongyi.css';

/**
 * 中国人群分析 · 工程移民与生态移民(GY-56)
 * 人群画像分层第五十四子集 · 与 GY-55 同构
 * 注记:以移民安置制度框架处理,把工程/生态/扶贫移民理解为「被整体迁移到新主机的进程集群」,
 * 记录「开发性移民」的成就,也分析社会融合的难题,尊重、不渲染;
 * 物理迁移易、社会融合难、长期承诺需跨代兑现。
 */
export default function GongyiPage() {
  return (
    <div className="gongyi-page">
      <PageHeader
        badge="GY-56 · 人群画像分层"
        title="工程移民与生态移民"
        subtitle="被整体迁移的进程集群 · 物理重定位易，社会融合难"
      />
      <GongyiPanel />
    </div>
  );
}
