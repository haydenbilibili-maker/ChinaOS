import React from 'react';
import { PageHeader, Card } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import PartySchoolSection from '../talent/PartySchoolSection.jsx';
import { AS_OF } from './data.js';

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="Sim · 中央党校"
        title="中央党校"
        subtitle="课程推演 · 治理教学 · 组织筛选 · 人才考核"
      />
      <Card asSection={false} className="!p-0 !mb-0 !bg-transparent !border-0 !shadow-none">
        <PartySchoolSection />
      </Card>
      <ModuleFooter
        moduleId="partySchool"
        disclaimer="推演沙盘 · 教学用途 · 班次选拔与考核均为模拟流程，非真实组织系统"
        sourceNote={`数据截至 ${AS_OF}`}
      />
    </div>
  );
}
