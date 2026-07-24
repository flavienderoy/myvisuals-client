import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const ProtectedRoute = ({ children, redirectTo = '/login', studioOnly = false }) => {
    const { user, loading: authLoading } = useAuth();
    const { currentUser, loadingData } = useData();
    const location = useLocation();

    if (authLoading || (user && loadingData)) {
        return <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center text-gray-500 text-sm tracking-widest uppercase">Chargement...</div>;
    }

    if (!user) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // RBAC — a client can never load the studio management routes.
    // We check currentUser from DataContext first as it reflects the DB profile.
    const role = currentUser?.role || user.user_metadata?.role || 'client';
    if (studioOnly && role === 'client') {
        return <Navigate to="/client/dashboard" replace />;
    }

    return children;
};
