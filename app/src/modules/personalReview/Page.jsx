import { PageHeader } from '../../app/ui.jsx';
import PersonalReview from './PersonalReview.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 超个体决策复盘 · 私享模块 */
export default function PersonalReviewPage() {
  return (
    <div className="personal-review-page">
      <PageHeader
        badge="私享 · 决策复盘"
        title="超个体决策复盘系统"
        subtitle="四层垫子 / 账本测试 / 信号灯联动 · 本地私享"
      />
      <PersonalReview />
      <ModuleFooter moduleId="personalReview" />

    </div>
  );
}
