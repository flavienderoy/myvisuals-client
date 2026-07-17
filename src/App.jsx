import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './layouts/MainLayout';
import { ClientLayout } from './layouts/ClientLayout';
import { ShowroomLayout } from './layouts/ShowroomLayout';
import Studio from './pages/Studio';
import Showroom from './pages/Showroom';
import AssetViewer from './pages/AssetViewer';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Profile from './pages/profile/Profile';
import { Loader } from './components/common/Loader';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';

// Client Portal Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientDownloads from './pages/client/ClientDownloads';
import ClientMessages from './pages/client/ClientMessages';
import ClientProjectDetail from './pages/client/ClientProjectDetail';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Wrapper for MainLayout to pass current path logic if needed
const AppLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Client Portal Routes (auth is unified — see /login and /signup) */}
            <Route path="/client" element={
              <ProtectedRoute redirectTo="/login">
                <ClientLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/client/dashboard" replace />} />
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="projects" element={<ClientProjects />} />
              <Route path="downloads" element={<ClientDownloads />} />
              <Route path="messages" element={<ClientMessages />} />
              <Route path="projects/:id" element={<ClientProjectDetail />} />
            </Route>

            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/studio" element={
              <AppLayout>
                <Studio />
              </AppLayout>
            } />

            <Route path="/showroom/:id" element={
              <ShowroomLayout>
                <Showroom />
              </ShowroomLayout>
            } />

            {/* Full-screen asset viewer (studio & client) */}
            <Route path="/assets/:id" element={
              <ProtectedRoute redirectTo="/login">
                <AssetViewer />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <AppLayout>
                <Profile />
              </AppLayout>
            } />
          </Routes>
        </DataProvider>
      </AuthProvider>

      {/* Global Toast Notifications */}
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
