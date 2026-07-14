import { Navigate } from 'react-router-dom';

/** @deprecated 世行经济简报已并入经济大盘 Tab，保留此文件供旧链接与 check:ui 兼容；数据层见 ceuReportData.js */
export default function Page() {
  return <Navigate to="/econ-dashboard?tab=worldbank" replace />;
}
