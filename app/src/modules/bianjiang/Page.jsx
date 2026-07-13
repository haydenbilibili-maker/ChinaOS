import GySliceShell from '../shared/gy/GySliceShell.jsx';
import BianjiangPanel from './BianjiangPanel.jsx';
import './bianjiang.css';

/**
 * 中国人群分析 · 边疆少数民族(GY-48)
 * 人群画像分层第四十六子集 · 封顶片 · 与 GY-47 同构 · 多框架并置不裁决
 * 注记:全图谱最敏感一片,采取「多框架并置 + 归因 + 不裁决」立场;
 * 官方立场与外部批评均以归因形式呈现,非本片事实断言;涉新疆/西藏具体争议指控
 * 只标注存在重大争议、指向多元独立信源,不展开、不复述、不裁决、不为任一方背书。
 */
export default function BianjiangPage() {
  return (
    <GySliceShell
      badge="GY-48 · 人群画像分层 · 封顶片"
      title="边疆少数民族"
      subtitle="多框架并置 · 一个被不同视角各执一词的人群"
      appId="bj-app"
      moduleId="bianjiang"
      className="bianjiang-page"
    >
      <BianjiangPanel />
    </GySliceShell>
  );
}
