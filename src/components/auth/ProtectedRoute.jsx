import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../common/Loader';

export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader onComplete={() => {}} />;
    }

    if (!user) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return children;
};
