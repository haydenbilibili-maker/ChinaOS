import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/** @deprecated 已并入政令文库 · 保留路由重定向 */
export default function Page() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  params.set('tab', 'legal');
  const qs = params.toString();
  return <Navigate to={`/policydocs${qs ? `?${qs}` : '?tab=legal'}`} replace />;
}
