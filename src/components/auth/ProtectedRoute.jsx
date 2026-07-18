import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../common/Loader';

export const ProtectedRoute = ({ children, redirectTo = '/login', studioOnly = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader onComplete={() => {}} />;
    }

    if (!user) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // RBAC — a client can never load the studio management routes.
    // Only an *explicit* client role is blocked (legacy studio accounts may
    // have no role metadata and must keep their access).
    if (studioOnly && user.user_metadata?.role === 'client') {
        return <Navigate to="/client/dashboard" replace />;
    }

    return children;
};
