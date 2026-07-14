import { PageHeader, Card } from '../../app/ui.jsx';
import AntiCorruptionObservatory from './AntiCorruptionObservatory.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 反腐结构观测 · 荒废斋子模块 */
export default function AnticorruptionPage() {
  return (
    <div className="anticorruption-page">
      <PageHeader
        badge="荒废斋 · 结构观测"
        title="反腐结构观测"
        subtitle="不数人头，只数租金面 · 官方通报措辞解码"
        noAccent
      />
      <Card asSection={false} className="!p-0 !mb-0 !bg-transparent !border-0 !shadow-none">
        <AntiCorruptionObservatory />
      </Card>
      <ModuleFooter
        moduleId="anticorruption"
        disclaimer="结构性分析工具 · 非投资建议 · 不构成对任何个人的判断"
        sourceNote="材料限于新华社通报、国务院文件及可具名引用的学术观点"
      />
    </div>
  );
}
