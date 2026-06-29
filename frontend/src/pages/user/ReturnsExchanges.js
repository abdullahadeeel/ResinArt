import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, 
    FiArrowLeft, FiShield, FiMessageCircle
} from 'react-icons/fi';

const ReturnsExchanges = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                {/* Back Button */}
                <Link to="/home" style={{ textDecoration: 'none' }}>
                    <button
                        style={{
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
                        }}
                    >
                        <FiArrowLeft /> Back to Home
                    </button>
                </Link>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px', animation: 'fadeInUp 0.6s ease' }}>
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
                        Returns & Exchanges
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '16px' }}>
                        Our commitment to your satisfaction
                    </p>
                </div>

                {/* Return Policy */}
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
                        <FiRefreshCw size={30} color="#FF6B9D" />
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Return Policy</h2>
                    </div>
                    <div style={{ color: '#8B6B58', lineHeight: '1.8', fontSize: '15px' }}>
                        <p>We want you to love your resin art pieces! If you're not completely satisfied, here's our return policy:</p>
                        <ul style={{ marginTop: '15px', marginLeft: '20px' }}>
                            <li> You have <strong>7 days</strong> from delivery to request a return</li>
                            <li> Items must be unused and in original packaging</li>
                            <li> Custom/personalized items cannot be returned (unless damaged)</li>
                            <li> Customer is responsible for return shipping costs</li>
                            <li> Returns are processed within 5-7 business days</li>
                        </ul>
                    </div>
                </div>

                {/* Non-Returnable Items */}
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
                        <FiXCircle size={30} color="#FF6B9D" />
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Non-Returnable Items</h2>
                    </div>
                    <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                        <li> Custom/personalized orders</li>
                        <li> Floral preservation pieces (unique to each order)</li>
                        <li> Final sale/clearance items</li>
                        <li> Items damaged due to improper handling after delivery</li>
                    </ul>
                </div>

                {/* Exchange Process */}
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
                        <FiRefreshCw size={30} color="#FF6B9D" />
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Exchange Process</h2>
                    </div>
                    <ol style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '15px' }}>
                        <li>Contact us within 7 days of delivery</li>
                        <li>Provide order number and reason for exchange</li>
                        <li>Ship the item back in original packaging</li>
                        <li>We'll process your exchange within 5-7 business days</li>
                        <li>Store credit or replacement will be issued</li>
                    </ol>
                </div>

                {/* Damaged Items */}
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
                        <FiShield size={30} color="#FF6B9D" />
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Damaged or Defective Items</h2>
                    </div>
                    <div style={{ color: '#8B6B58', lineHeight: '1.8', fontSize: '15px' }}>
                        <p>We take great care in packaging, but if your item arrives damaged:</p>
                        <ul style={{ marginTop: '15px', marginLeft: '20px' }}>
                            <li> Take photos of the damage immediately</li>
                            <li> Contact us within 48 hours of delivery</li>
                            <li> We'll arrange a replacement or full refund</li>
                            <li> Return shipping costs will be covered by us</li>
                        </ul>
                    </div>
                </div>

                {/* Refund Timeline */}
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
                        <FiClock size={30} color="#FF6B9D" />
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B9D' }}>Refund Timeline</h2>
                    </div>
                    <div style={{ color: '#8B6B58', lineHeight: '1.8', fontSize: '15px' }}>
                        <p>Once we receive your return:</p>
                        <ul style={{ marginTop: '15px', marginLeft: '20px' }}>
                            <li> Inspection takes 3-5 business days</li>
                            <li> Refunds processed within 5-7 business days</li>
                            <li> Refunds go to original payment method</li>
                            <li> You'll receive email confirmation</li>
                        </ul>
                    </div>
                </div>

                {/* ✅ Contact Section - SIRF WHATSAPP */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '40px',
                    padding: '40px 30px',
                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                    borderRadius: '24px',
                    animation: 'fadeInUp 0.95s ease'
                }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '15px' }}>
                        Need Help with a Return?
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '25px' }}>
                        Our team is here to assist you
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {/* ✅ ONLY WHATSAPP */}
                        <a
                            href="https://wa.me/923103175357"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '14px 35px',
                                background: '#25D366',
                                color: 'white',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: '700',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
                            }}
                        >
                            <FiMessageCircle size={22} /> WhatsApp Us
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

export default ReturnsExchanges;