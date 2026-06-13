import { PageHeader } from '../../app/ui.jsx';
import XinfangPanel from './XinfangPanel.jsx';
import './xinfang.css';

/**
 * 中国人群分析 · 信访群体(GY-58)
 * 人群画像分层第五十六子集 · 与 GY-57 同构、与 GY-48 同方法论
 * 注记:本片采用多视角并陈、归因不断言、不裁决的方法。
 * 信访是中国特有的、由《信访条例》/《信访工作条例》规范的制度化「下情上达」诉求表达与监督渠道;
 * 中性描述制度定位,如实并列官方定位/权利救济/社会治理/实践张力四类解读框架,
 * 中性描述法治化改革(诉访分离/网上信访),对争议议题仅标注「存在不同观点」而不下裁断;
 * 不裁决任何具体信访事项的是非,也不对信访群体作整体或道德评价。
 */
export default function XinfangPage() {
  return (
    <div className="xinfang-page">
      <PageHeader
        badge="GY-58 · 人群画像分层"
        title="信访群体"
        subtitle="系统的例外上报通道 · 当常规处理器没有解决问题"
      />
      <XinfangPanel />
    </div>
  );
}
