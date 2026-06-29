import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FiTruck, FiClock, FiPackage, FiMapPin, FiArrowLeft, 
    FiMail, FiPhone, FiMessageCircle 
} from 'react-icons/fi';

const ShippingInfo = () => {
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
                        Shipping Information
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '16px' }}>
                        Everything you need to know about our shipping policy
                    </p>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    
                    {/* Processing Time */}
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
                            <FiClock size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Processing Time</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> Normal Processing Time: <strong>15-18 days</strong> for regular orders</li>
                            <li> Floral Work Delivery Time: <strong>25-30 days</strong> for flower preservation orders</li>
                            <li> Custom Orders: <strong>20-25 days</strong> (varies by complexity)</li>
                            <li>Orders are processed Monday through Friday (excluding holidays)</li>
                            <li>You will receive a confirmation email once your order ships</li>
                        </ul>
                    </div>

                    {/* Shipping Rates */}
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
                            <FiTruck size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Shipping Rates</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> <strong>Free Shipping</strong> on orders over <strong>Rs. 5,000</strong></li>
                            <li> Standard Shipping (under Rs. 5,000): <strong>Rs. 200</strong> flat rate</li>
                            <li> Express Shipping (available on request): Additional charges apply</li>
                            <li>International Shipping: Contact us for a quote</li>
                        </ul>
                    </div>

                    {/* Delivery Areas */}
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
                            <FiMapPin size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Delivery Areas</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> We ship <strong>nationwide across Pakistan</strong></li>
                            <li> Major cities: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Jhelum</li>
                            <li>International shipping available on select items (contact us for details)</li>
                        </ul>
                    </div>

                    {/* Tracking */}
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
                            <FiPackage size={30} color="#FF6B9D" />
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Order Tracking</h2>
                        </div>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li> Once your order ships, you will receive a <strong>tracking number</strong> via email</li>
                            <li> You can also contact us on WhatsApp for tracking updates</li>
                            <li> Tracking information is typically available within 24-48 hours after shipping</li>
                        </ul>
                    </div>

                    {/* Important Notes */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '30px',
                        marginBottom: '25px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.9s ease'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D', marginBottom: '20px' }}> Important Notes</h2>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                            <li>Delivery times are estimates and may vary due to external factors</li>
                            <li>We are not responsible for delays caused by courier services or customs</li>
                            <li>Please ensure your shipping address is correct before placing your order</li>
                            <li>If a package is returned due to an incorrect address, you will be responsible for re-shipping fees</li>
                        </ul>
                    </div>

                    {/* Contact Section with ACTIVE LINKS - Light Mode */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '40px',
                        padding: '30px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        borderRadius: '24px',
                        animation: 'fadeInUp 0.95s ease'
                    }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '15px' }}>Have Questions About Shipping?</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
                            Contact us for any shipping-related inquiries
                        </p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {/* WhatsApp Button - Active */}
                            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 28px',
                                background: '#25D366',
                                color: 'white',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: '700',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <FiMessageCircle size={18} /> WhatsApp Us
                            </a>
                            
                            {/* Email Button - Active */}
                            <a href="mailto:komal@resinart.com" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 28px',
                                background: 'transparent',
                                border: '2px solid white',
                                color: 'white',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: '700',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = '#E75480';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'white';
                            }}>
                                <FiMail size={18} /> Email Us
                            </a>
                        </div>
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

export default ShippingInfo;