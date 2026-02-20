import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ redirectPath = '/' }) {
    const { user } = useAuth();

    if (!user) {
        // You could also open the login modal here via a global context state if you wanted
        // For now, redirecting to home
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}
