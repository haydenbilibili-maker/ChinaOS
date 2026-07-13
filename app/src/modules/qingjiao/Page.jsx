import GySliceShell from '../shared/gy/GySliceShell.jsx';
import QingjiaoPanel from './QingjiaoPanel.jsx';
import './qingjiao.css';

/**
 * 中国人群分析 · 高校青椒与过剩博士(GY-33)
 * 人群画像分层第三十一子集 · 与 GY-32 同构 · 非升即走的试用期进程模型
 */
export default function QingjiaoPage() {
  return (
    <GySliceShell
      badge="GY-33 · 人群画像分层"
      title="高校青椒与过剩博士"
      subtitle="非升即走的试用期进程 · 6 年倒计时"
      appId="qj-app"
      moduleId="qingjiao"
      className="qingjiao-page"
    >
      <QingjiaoPanel />
    </GySliceShell>
  );
}
