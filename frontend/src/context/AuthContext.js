// frontend/src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // ✅ FIX: Page refresh par token verify karo backend se
    useEffect(() => {
        const verifyAndLoadUser = async () => {
            const storedToken = localStorage.getItem('token');
            
            console.log('🔍 [Auth] Page load - Token in localStorage:', storedToken ? 'YES' : 'NO');
            
            if (!storedToken) {
                console.log('🔍 [Auth] No token found');
                setLoading(false);
                return;
            }
            
            try {
                // Set token in axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                
                console.log('🔍 [Auth] Verifying token with backend...');
                
                // ✅ Call backend to verify token and get user
                const response = await axios.get(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    }
                });
                
                console.log('🔍 [Auth] Verify response:', response.data);
                
                if (response.data.success && response.data.user) {
                    const userData = response.data.user;
                    
                    const userObject = {
                        _id: userData._id,
                        id: userData._id,
                        name: userData.name,
                        email: userData.email,
                        role: userData.role || 'user',
                        phone: userData.phone || ''
                    };
                    
                    setUser(userObject);
                    setToken(storedToken);
                    
                    // Update localStorage with fresh user data
                    localStorage.setItem('user', JSON.stringify(userObject));
                    
                    console.log('✅ [Auth] Auto-login successful! User:', userObject.email);
                } else {
                    console.log('❌ [Auth] Token invalid, clearing...');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete axios.defaults.headers.common['Authorization'];
                }
            } catch (error) {
                console.error('❌ [Auth] Token verification failed:', error.response?.status, error.message);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
            }
            
            setLoading(false);
        };
        
        verifyAndLoadUser();
    }, []);

    // ✅ LOGIN FUNCTION - Admin login
    const login = (userData, authToken) => {
        console.log('🔐 [Auth] login() called for admin');
        
        const userObject = {
            _id: userData._id,
            id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role || 'admin',
            isApproved: true
        };
        
        setUser(userObject);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userObject));
        
        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        console.log('✅ [Auth] Admin saved, token stored');
    };

    // ✅ USER LOGIN FUNCTION - User panel login
    const userLogin = (userData, authToken) => {
        console.log('👤 [Auth] userLogin() called');
        console.log('👤 User data:', userData);
        
        const userObject = {
            _id: userData._id || userData.id,
            id: userData._id || userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role || 'user',
            phone: userData.phone || ''
        };
        
        setUser(userObject);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userObject));
        
        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        console.log('✅ [Auth] User saved, token stored');
        console.log('✅ [Auth] Token in localStorage:', localStorage.getItem('token') ? 'YES' : 'NO');
    };

    // ✅ ADMIN LOGIN (direct API call)
    const adminLogin = async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/admin/login`, credentials);
            console.log('Admin login response:', response.data);
            
            if (response.data && response.data.success) {
                const userData = response.data.data;
                login(userData, userData.token);
                return { success: true };
            }
            throw new Error('Login failed');
        } catch (error) {
            console.error('Admin login error:', error);
            throw error;
        }
    };

    const logout = () => {
        console.log('🔓 [Auth] Logging out...');
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'seller',
        isUser: user?.role === 'user',
        login,
        userLogin,
        adminLogin,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;