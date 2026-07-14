import { PageHeader, Card } from '../../app/ui.jsx';
import AbleOfficialParadox from './AbleOfficialParadox.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 能吏悖论 · 荒废斋子模块 */
export default function AbleOfficialParadoxPage() {
  return (
    <div className="able-official-paradox-page">
      <PageHeader
        badge="荒废斋 · 结构观测"
        title="能吏悖论"
        subtitle="能办事 = 能寻租 · 同一种能力 · 模块 07 微观机制"
        noAccent
      />
      <Card asSection={false} className="!p-0 !mb-0 !bg-transparent !border-0 !shadow-none">
        <AbleOfficialParadox />
      </Card>
      <ModuleFooter
        moduleId="ableOfficialParadox"
        disclaimer="制度机制推演 · 不构成对任何个人的判断或法律抗辩"
        sourceNote="材料限于制度机制推演与公开政策文本"
      />
    </div>
  );
}
