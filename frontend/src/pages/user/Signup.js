import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiLogIn, FiPhone, FiEye, FiEyeOff, FiHeart } from 'react-icons/fi';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            toast.error(' Passwords do not match ');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            toast.error(' Password must be at least 6 characters ');
            setLoading(false);
            return;
        }

        try {
            console.log('📝 Sending signup request to /users/register...');
            
            const response = await API.post('/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });
            
            console.log('📥 Signup response:', response.data);
            
            if (response.data && response.data.success) {
                toast.success(' Account created successfully! Please login. ');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(response.data?.message || ' Signup failed ');
            }
        } catch (error) {
            console.error('❌ Signup error:', error);
            
            if (error.response?.status === 400) {
                toast.error(error.response.data?.message || ' User already exists ');
            } else if (error.response?.status === 404) {
                toast.error(' API endpoint not found. Check if backend is running on port 5000 ');
            } else if (!error.response) {
                toast.error(' Cannot connect to server. Is backend running? ');
            } else {
                toast.error(error.response?.data?.message || ' Signup failed. Please try again. ');
            }
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
                background: '#FFFFFF',
                borderRadius: '32px',
                padding: '45px 40px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid #f0e4d8',
                width: '100%',
                maxWidth: '500px',
                animation: 'fadeInUp 0.6s ease'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px',
                        animation: 'glowPulse 2s ease-in-out infinite'
                    }}>
                        <span style={{ fontSize: '30px' }}></span>
                    </div>
                    <h1 style={{
                        fontSize: '30px',
                        fontWeight: '700',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '8px'
                    }}>
                        Create Account
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '14px', fontWeight: '500' }}>
                        Join our creative community! 
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            fontWeight: '600',
                            color: '#FF6B9D',
                            fontSize: '14px'
                        }}>
                            <FiUser style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Full Name 
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

                    {/* Email */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            fontWeight: '600',
                            color: '#FF6B9D',
                            fontSize: '14px'
                        }}>
                            <FiMail style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Email Address 
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

                    {/* Phone Number */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            fontWeight: '600',
                            color: '#FF6B9D',
                            fontSize: '14px'
                        }}>
                            <FiPhone style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Phone Number 
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+92 300 1234567"
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

                    {/* Password */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            fontWeight: '600',
                            color: '#FF6B9D',
                            fontSize: '14px'
                        }}>
                            <FiLock style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Password 
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                                placeholder="•••••• (min. 6 characters)"
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

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            fontWeight: '600',
                            color: '#FF6B9D',
                            fontSize: '14px'
                        }}>
                            <FiLock style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Confirm Password 
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="••••••"
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
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Sign Up Button */}
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '24px',
                            transition: 'all 0.3s ease',
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
                        <FiLogIn />
                        {loading ? ' Creating account... ' : ' Sign Up '}
                    </button>
                </form>

                {/* Login Link */}
                <div style={{
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    <p style={{ color: '#8B6B58' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{
                            color: '#FF6B9D',
                            textDecoration: 'none',
                            fontWeight: '700',
                            transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#FFB347'}
                        onMouseLeave={(e) => e.target.style.color = '#FF6B9D'}>
                            Login 
                        </Link>
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

export default Signup;