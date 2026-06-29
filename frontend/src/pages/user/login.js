import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiHeart, FiSparkles } from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { userLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post('/auth/login', { email, password });
            
            if (response.data.success) {
                const userData = response.data.data;
                
                // ✅ ADD THIS LINE - Save user to AuthContext
                userLogin(userData, userData.token);
                
                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify({
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role
                }));
                
                toast.success(` Welcome back, ${userData.name}! `);
                
                if (userData.role === 'admin') {
                    navigate('/dashboard');
                } else if (userData.role === 'seller') {
                    navigate('/seller/dashboard');
                } else {
                    navigate('/home');
                }
            } else {
                toast.error(response.data.message || ' Login failed ');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || ' Login failed. Please try again. ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#fefaf5', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '24px' 
        }}>
            <div style={{
                maxWidth: '480px',
                width: '100%',
                background: '#FFFFFF',
                borderRadius: '32px',
                padding: '50px 42px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid #f0e4d8',
                animation: 'fadeInUp 0.6s ease'
            }}>
                {/* Logo - Light Mode with Pink */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px',
                        animation: 'glowPulse 2s ease-in-out infinite'
                    }}>
                        <span style={{ fontSize: '36px' }}></span>
                    </div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginTop: '8px'
                    }}>
                        ResinArt
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '14px', marginTop: '10px', fontWeight: '500' }}>
                        Welcome back! Sign in to your account 
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#FF6B9D', fontSize: '14px', fontWeight: '600' }}>
                            <FiMail style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder=" your@email.com "
                            style={{
                                width: '100%',
                                padding: '14px 20px',
                                border: '1px solid #f0e4d8',
                                borderRadius: '50px',
                                fontSize: '14px',
                                background: '#fefaf5',
                                color: '#2D1F12',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#FF6B9D';
                                e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#f0e4d8';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#FF6B9D', fontSize: '14px', fontWeight: '600' }}>
                            <FiLock style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '14px 20px',
                                    border: '1px solid #f0e4d8',
                                    borderRadius: '50px',
                                    fontSize: '14px',
                                    background: '#fefaf5',
                                    color: '#2D1F12',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    paddingRight: '50px'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#FF6B9D';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#f0e4d8';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '18px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#8B6B58'
                                }}
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                        <Link to="/forgot-password" style={{
                            color: '#8B6B58',
                            textDecoration: 'none',
                            fontSize: '12px',
                            transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#FF6B9D'}
                        onMouseLeave={(e) => e.target.style.color = '#8B6B58'}>
                            Forgot Password? 
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: loading ? '#C9A9A9' : 'linear-gradient(135deg, #E75480, #FF6B9D)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '24px',
                            boxShadow: loading ? 'none' : '0 4px 15px rgba(231,84,128,0.4)'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(231,84,128,0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.4)';
                            }
                        }}
                    >
                        <FiLogIn size={18} />
                        {loading ? ' Signing in... ' : ' Sign In '}
                    </button>

                    {/* Sign Up Link */}
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#8B6B58', fontSize: '14px' }}>
                            Don't have an account?{' '}
                            <Link to="/signup" style={{ 
                                color: '#FF6B9D', 
                                textDecoration: 'none', 
                                fontWeight: '700',
                                transition: 'color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#FFB347'}
                            onMouseLeave={(e) => e.target.style.color = '#FF6B9D'}>
                                Create Account 
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Demo Credentials - Light Mode */}
                <div style={{
                    marginTop: '35px',
                    padding: '20px',
                    background: '#fefaf5',
                    borderRadius: '24px',
                    textAlign: 'center',
                    border: '1px solid #f0e4d8'
                }}>
                    <p style={{ fontSize: '12px', color: '#FF6B9D', marginBottom: '10px', fontWeight: '600' }}>
                         Demo Credentials 
                    </p>
                    <p style={{ fontSize: '12px', color: '#8B6B58', lineHeight: '1.6' }}>
                        📧 Email: user123@gmail.com<br />
                        🔑 Password: user123
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 0 5px rgba(231,84,128,0.2); }
                    50% { box-shadow: 0 0 20px rgba(231,84,128,0.4); }
                }
            `}</style>
        </div>
    );
};

export default Login;