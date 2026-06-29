// frontend/src/components/SellerRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * SellerRoute Component - Protected Route for Seller Panel
 * Only allows access to seller routes if user is authenticated and has seller role
 * Redirects to login if not authenticated
 * Redirects to unauthorized if authenticated but not seller
 */
const SellerRoute = ({ children }) => {
    const { isAuthenticated, isSeller, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#fefaf5'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #f59e0b',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Not authenticated - redirect to seller login
    if (!isAuthenticated) {
        console.log('🔒 SellerRoute: Not authenticated, redirecting to login');
        return <Navigate to="/seller/login" replace />;
    }

    // Authenticated but not seller - redirect to unauthorized page
    if (!isSeller) {
        console.log('🔒 SellerRoute: User is not seller, redirecting to unauthorized');
        return <Navigate to="/unauthorized" replace />;
    }

    // Authenticated and is seller - render the protected component
    console.log('✅ SellerRoute: Access granted to seller dashboard');
    return <>{children}</>;
};

export default SellerRoute;