import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';  // ✅ FIXED: one level up
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiLogIn, FiPhone } from 'react-icons/fi';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            console.log('📝 Sending signup request...');
            
            const response = await API.post('/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });
            
            console.log('📥 Signup response:', response.data);
            
            if (response.data && response.data.success) {
                toast.success('Account created successfully! Please login.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(response.data?.message || 'Signup failed');
            }
        } catch (error) {
            console.error('❌ Signup error:', error);
            
            if (error.response?.status === 400) {
                toast.error(error.response.data?.message || 'User already exists');
            } else if (!error.response) {
                toast.error('Cannot connect to server. Is backend running on port 5000?');
            } else {
                toast.error(error.response?.data?.message || 'Signup failed');
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
            backgroundColor: '#f3f4f6',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '450px'
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textAlign: 'center',
                    color: '#f59e0b'
                }}>
                    Create Account
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#6b7280',
                    marginBottom: '32px'
                }}>
                    Sign up to start shopping
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            <FiUser style={{ marginRight: '8px', display: 'inline' }} />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            <FiMail style={{ marginRight: '8px', display: 'inline' }} />
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            <FiPhone style={{ marginRight: '8px', display: 'inline' }} />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+92 300 1234567"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            <FiLock style={{ marginRight: '8px', display: 'inline' }} />
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            placeholder="•••••• (min. 6 characters)"
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
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="••••••"
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
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{
                        color: '#f59e0b',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;