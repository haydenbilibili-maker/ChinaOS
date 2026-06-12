import { Navigate } from 'react-router-dom';

/** @deprecated 反腐透视已并入人才精英库，保留此文件供旧链接兼容 */
export default function Page() {
  return <Navigate to="/talent?tab=anticorruption" replace />;
}
