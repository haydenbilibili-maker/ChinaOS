import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListPage from './Page.jsx';
import VolumeDetail from './VolumeDetail.jsx';

export default function CivilizationModule() {
  return (
    <Routes>
      <Route index element={<ListPage />} />
      <Route path="v/:volId" element={<VolumeDetail />} />
    </Routes>
  );
}
