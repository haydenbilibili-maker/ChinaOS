import GySliceShell from '../shared/gy/GySliceShell.jsx';
import ZhiyebingPanel from './ZhiyebingPanel.jsx';
import './zhiyebing.css';

/**
 * 中国人群分析 · 尘肺与职业病/工伤群体(GY-50)
 * 人群画像分层第四十八子集 · 常规判词片 · 与 GY-49 同构(常规 register)
 * 注记:以劳动权益与职业健康框架处理,把职业病理解为可预防、应被保障的劳动损害,
 * 尊重患者、不渲染,聚焦制度(认定、保障、防治)。
 */
export default function ZhiyebingPage() {
  return (
    <GySliceShell
      badge="GY-50 · 人群画像分层"
      title="尘肺与职业病/工伤群体"
      subtitle="延迟显现的硬件损耗 · 磨损不计入运行时"
      appId="zb-app"
      moduleId="zhiyebing"
      className="zhiyebing-page"
    >
      <ZhiyebingPanel />
    </GySliceShell>
  );
}
