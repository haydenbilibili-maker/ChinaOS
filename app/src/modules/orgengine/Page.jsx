import React from 'react';
import { PageHeader } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import OrgDepartmentSection from '../talent/OrgDepartmentSection.jsx';

export default function Page() {
  return (
    <>
      <PageHeader
        badge="Simulation · 组织画像引擎（模拟）"
        title="中央组织部 · 全库人才画像引擎"
        subtitle="对人才库全部公开履历做画像粒度刻画：六维能力 × 12 经历标签 × 流动足迹，为沙盒情景匹配提供底座"
      />
      <OrgDepartmentSection />
      <ModuleFooter
        moduleId="orgengine"
        disclaimer="模拟推演工具：画像由公开履历关键词自动推断，课程/考核/匹配均为思想实验框架，不代表任何机构真实流程，不构成人事评价 · 自动推断画像非任何机构真实评价，匹配分仅为推演演示"
      />
    </>
  );
}
