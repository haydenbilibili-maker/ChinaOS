import { Navigate } from 'react-router-dom';

/** @deprecated 知识精英库已并入人才精英库，保留此文件供旧链接兼容 */
export default function Page() {
  return <Navigate to="/talent?tab=knowledge" replace />;
}
