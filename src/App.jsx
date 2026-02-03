import React, { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import Studio from './pages/Studio';
import Showroom from './pages/Showroom';
import { Loader } from './components/common/Loader';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setView] = useState('studio'); // 'studio' | 'showroom'

  return (
    <>
      {loading ? (
        <Loader onComplete={() => setLoading(false)} />
      ) : (
        <MainLayout currentView={currentView} setView={setView}>
          {currentView === 'studio' ? <Studio onViewChange={setView} /> : <Showroom />}
        </MainLayout>
      )}
    </>
  );
}

export default App;
