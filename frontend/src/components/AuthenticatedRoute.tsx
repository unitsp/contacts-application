import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthenticatedRouteProps {
    element: React.ReactElement;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ element }) => {
    const isLoggedIn = !!localStorage.getItem('auth_token');

    return isLoggedIn ? element : <Navigate to="/login" />;
};

export default AuthenticatedRoute;
