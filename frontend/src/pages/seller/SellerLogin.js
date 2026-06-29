import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const SellerLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('🔐 Login attempt:', formData.email);

        try {
            const response = await API.post('/seller/login', formData);
            
            if (response.data && response.data.success) {
                const userData = response.data.data;
                const token = userData.token;
                
                // Save to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                console.log('✅ Login successful');
                console.log('Token saved:', token.substring(0, 30) + '...');
                
                toast.success('Login successful!');
                
                // Redirect to dashboard
                window.location.href = '/seller/dashboard';
            } else {
                toast.error(response.data?.message || 'Login failed');
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            
            if (error.response?.status === 403) {
                toast.error('Your account is pending admin approval');
            } else if (error.response?.status === 401) {
                toast.error('Invalid email or password');
            } else {
                toast.error(error.response?.data?.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fef7f0'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '28px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '420px',
                border: '1px solid #f0e4d8'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '48px' }}>✨</span>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '500',
                        color: '#9a3412',
                        margin: '8px 0 4px',
                        fontFamily: 'Georgia, serif'
                    }}>
                        Seller Login
                    </h1>
                    <p style={{ fontSize: '14px', color: '#8b6b58' }}>
                        Sign in to your seller account
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#5c3a28'
                        }}>
                            <FiMail style={{ marginRight: '8px', display: 'inline' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="seller@example.com"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: '1px solid #e5d5cc',
                                borderRadius: '40px',
                                fontSize: '15px',
                                backgroundColor: '#fefaf5'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#5c3a28'
                        }}>
                            <FiLock style={{ marginRight: '8px', display: 'inline' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: '1px solid #e5d5cc',
                                borderRadius: '40px',
                                fontSize: '15px',
                                backgroundColor: '#fefaf5'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading ? '#e5d5cc' : '#9a3412',
                            color: 'white',
                            border: 'none',
                            borderRadius: '40px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <FiLogIn />
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    <Link to="/seller/signup" style={{
                        color: '#9a3412',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Don't have a seller account? Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;