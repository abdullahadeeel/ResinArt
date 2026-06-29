import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiAlertCircle, FiCreditCard, FiPackage, FiArrowLeft } from 'react-icons/fi';

const TermsOfService = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                {/* Back Button - Pink */}
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
                        Terms of Service
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '16px' }}>
                        Please read these terms carefully before using our services
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
                            <FiFileText size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Agreement to Terms</h2>
                        </div>
                        <p style={{ color: '#8B6B58', lineHeight: '1.7', fontSize: '15px' }}>
                            By accessing or using ResinArt's website, you agree to be bound by these Terms of Service. 
                            If you disagree with any part of the terms, you may not access the website or use our services.
                        </p>
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
                            <FiCreditCard size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Orders & Payments</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li>💳 All prices are in Pakistani Rupees (PKR)</li>
                            <li>💳 We reserve the right to change prices without notice</li>
                            <li>💳 Payment must be completed before order processing</li>
                            <li>💳 We accept Cash on Delivery (COD) as the primary payment method</li>
                            <li>💳 Orders are subject to product availability</li>
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
                            <FiPackage size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Custom Orders & Flower Preservation</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> Custom orders require full payment in advance</li>
                            <li> Flower preservation is a service; results may vary based on flower condition</li>
                            <li> No refunds on custom or preservation orders once work has begun</li>
                            <li> Estimated delivery times for custom orders are approximate</li>
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
                            <FiAlertCircle size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Limitation of Liability</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li>⚠️ ResinArt is not responsible for any indirect, incidental, or consequential damages</li>
                            <li>⚠️ Our maximum liability is limited to the amount paid for the product</li>
                            <li>⚠️ We are not responsible for delays caused by shipping carriers or customs</li>
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
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D', marginBottom: '20px' }}>Changes to Terms</h2>
                        <p style={{ color: '#8B6B58', lineHeight: '1.7', fontSize: '15px' }}>
                            We reserve the right to modify these terms at any time. Changes will be effective immediately 
                            upon posting to the website. Your continued use of the website constitutes acceptance of the modified terms.
                        </p>
                    </div>

                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '30px',
                        marginBottom: '25px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.95s ease'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D', marginBottom: '20px' }}>Governing Law</h2>
                        <p style={{ color: '#8B6B58', lineHeight: '1.7', fontSize: '15px' }}>
                            These terms shall be governed by and construed in accordance with the laws of Pakistan. 
                            Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Jhelum, Pakistan.
                        </p>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        marginTop: '40px',
                        padding: '30px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        borderRadius: '24px',
                        animation: 'fadeInUp 1s ease'
                    }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '15px' }}>Questions About Our Terms?</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
                            Contact us for clarification
                        </p>
                        <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                            <button style={{
                                padding: '12px 28px',
                                background: '#25D366',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                fontWeight: '700'
                            }}>📱 WhatsApp Us</button>
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

export default TermsOfService;