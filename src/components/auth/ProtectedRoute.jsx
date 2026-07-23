import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Loader } from '../common/Loader';

export const ProtectedRoute = ({ children, redirectTo = '/login', studioOnly = false }) => {
    const { user, loading: authLoading } = useAuth();
    const { currentUser, loadingData } = useData();
    const location = useLocation();

    if (authLoading || (user && loadingData)) {
        return <Loader onComplete={() => {}} />;
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
