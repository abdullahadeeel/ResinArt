// frontend/src/components/AdminRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading, isAdmin } = useAuth();
    
    console.log('🔒 AdminRoute Debug:');
    console.log('  - loading:', loading);
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - user:', user);
    console.log('  - user?.role:', user?.role);
    console.log('  - isAdmin:', isAdmin);
    
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#fefaf5'
            }}>
                <div className="loading-spinner" style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid #f0e4d8',
                    borderTop: '3px solid #9a3412',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        console.log('❌ AdminRoute: Not authenticated, redirecting to login');
        return <Navigate to="/admin/login" replace />;
    }
    
    if (!isAdmin) {
        console.log('❌ AdminRoute: Not admin, user role:', user?.role);
        console.log('❌ AdminRoute: Redirecting to unauthorized page');
        return <Navigate to="/unauthorized" replace />;
    }
    
    console.log('✅ AdminRoute: Access granted for admin');
    return children;
};

export default AdminRoute;