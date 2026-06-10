import { Navigate } from 'react-router-dom';

/** @deprecated 文化精英库已并入人才库子模块，保留此文件供旧链接兼容 */
export default function Page() {
  return <Navigate to="/talent?tab=culture" replace />;
}
