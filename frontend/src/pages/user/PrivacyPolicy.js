import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiLock, FiEye, FiMail, FiUserCheck, FiArrowLeft } from 'react-icons/fi';

const PrivacyPolicy = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                {/* Back Button */}
                <Link to="/home" style={{ textDecoration: 'none' }}>
                    <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#FF6B9D',
                        marginBottom: '35px',
                        fontSize: '15px',
                        fontWeight: '700',
                        padding: '10px 20px',
                        borderRadius: '40px',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E75480';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateX(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#FF6B9D';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }}>
                        <FiArrowLeft />  Back to Home 
                    </button>
                </Link>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px', animation: 'fadeInUp 0.6s ease' }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}></div>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '15px'
                    }}>
                        Privacy Policy
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '16px' }}>
                        How we protect and use your information
                    </p>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '30px',
                        marginBottom: '25px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.7s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <FiShield size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Information We Collect</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> Name, email address, phone number, and shipping address</li>
                            <li> Payment information (processed securely through our payment partners)</li>
                            <li> Order history and preferences</li>
                            <li> Communication preferences and feedback</li>
                        </ul>
                    </div>

                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '30px',
                        marginBottom: '25px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.75s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <FiLock size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>How We Use Your Information</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> Process and fulfill your orders</li>
                            <li>Communicate with you about your order status</li>
                            <li> Send updates about new products and promotions (with your consent)</li>
                            <li> Improve our services and customer experience</li>
                        </ul>
                    </div>

                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '30px',
                        marginBottom: '25px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.8s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <FiEye size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Data Security</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> We use industry-standard security measures to protect your data</li>
                            <li> Payment information is encrypted using SSL technology</li>
                            <li> We do not store your credit card information on our servers</li>
                            <li> Access to personal information is restricted to authorized personnel only</li>
                        </ul>
                    </div>

                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '30px',
                        marginBottom: '25px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.85s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <FiMail size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Cookies & Tracking</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> We use cookies to enhance your browsing experience</li>
                            <li> Cookies help us remember your preferences and cart items</li>
                            <li> You can disable cookies in your browser settings</li>
                        </ul>
                    </div>

                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '30px',
                        marginBottom: '25px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.9s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <FiUserCheck size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Your Rights</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> You can request access to your personal data</li>
                            <li> You can request correction or deletion of your data</li>
                            <li> You can opt out of marketing communications at any time</li>
                            <li> You can request a copy of your data in a portable format</li>
                        </ul>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        marginTop: '40px',
                        padding: '30px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        borderRadius: '24px',
                        animation: 'fadeInUp 0.95s ease'
                    }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '15px' }}>Questions About Privacy?</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
                            Contact us for any privacy-related concerns
                        </p>
                        <a href="mailto:komal@resinart.com">
                            <button style={{
                                padding: '12px 28px',
                                background: 'white',
                                color: '#E75480',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                fontWeight: '700'
                            }}>Email Us</button>
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default PrivacyPolicy;