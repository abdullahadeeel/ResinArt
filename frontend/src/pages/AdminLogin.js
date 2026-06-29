import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('🔐 Admin login attempt:', formData.email);
            
            const response = await API.post('/admin/login', formData);
            console.log('📥 Admin login response:', response.data);
            
            if (response.data && response.data.success) {
                const userData = response.data.data;
                console.log('✅ Admin login successful, role:', userData.role);
                
                // Store in AuthContext
                login(userData, userData.token);
                
                toast.success('Login successful!');
                
                // Redirect to admin dashboard
                navigate('/dashboard', { replace: true });
            } else {
                toast.error(response.data?.message || 'Login failed');
            }
        } catch (error) {
            console.error('❌ Admin login error:', error);
            toast.error(error.response?.data?.message || 'Login failed');
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
            backgroundColor: '#f3f4f6'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textAlign: 'center',
                    color: '#f59e0b'
                }}>
                    Admin Login
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#6b7280',
                    marginBottom: '32px'
                }}>
                    Sign in to your admin account
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
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
                            placeholder="admin@resinart.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
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
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading ? '#9ca3af' : '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
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
                    <Link to="/admin/signup" style={{
                        color: '#f59e0b',
                        textDecoration: 'none'
                    }}>
                        Don't have an admin account? Create one
                    </Link>
                </div>

                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#6b7280',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0 }}>Demo credentials:</p>
                    <p style={{ margin: '4px 0 0 0' }}>Email: admin@resinart.com</p>
                    <p style={{ margin: 0 }}>Password: admin123</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;