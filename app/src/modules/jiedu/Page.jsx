import GySliceShell from '../shared/gy/GySliceShell.jsx';
import JieduPanel from './JieduPanel.jsx';
import './jiedu.css';

/**
 * 中国人群分析 · 戒毒与社区康复人员(GY-49)
 * 人群画像分层第四十七子集 · 常规判词片 · 与 GY-48 同构(常规 register)
 * 注记:以公共卫生与社会矫治框架处理,把成瘾理解为可康复的健康问题,
 * 不渲染、不猎奇、不污名化;强调「戒断者远多于在册者」这一去污名的事实。
 */
export default function JieduPage() {
  return (
    <GySliceShell
      badge="GY-49 · 人群画像分层"
      title="戒毒与社区康复人员"
      subtitle="被标记需修复的进程 · 残留标记与复发风险"
      appId="jd-app"
      moduleId="jiedu"
      className="jiedu-page"
    >
      <JieduPanel />
    </GySliceShell>
  );
}
