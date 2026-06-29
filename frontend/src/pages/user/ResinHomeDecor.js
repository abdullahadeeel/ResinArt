import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiHeart, FiStar, FiShoppingBag, FiHome, FiZap } from 'react-icons/fi';

const ResinHomeDecor = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                {/* Back Button - Pink */}
                <Link to="/blog" style={{ textDecoration: 'none' }}>
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
                        <FiArrowLeft />  Back to Blog 
                    </button>
                </Link>

                {/* Blog Header - Light Mode */}
                <div style={{ textAlign: 'center', marginBottom: '55px', animation: 'fadeInUp 0.6s ease' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '8px 24px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '12px',
                        marginBottom: '20px',
                        fontWeight: '800',
                        boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                    }}>
                         Home Decor • Inspiration 
                    </span>
                    <h1 style={{
                        fontSize: '55px',
                        fontWeight: '800',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '20px',
                        lineHeight: '1.2'
                    }}>
                        Resin Art for Home Interiors 
                    </h1>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '28px',
                        color: '#8B6B58',
                        fontSize: '14px',
                        fontWeight: '500',
                        flexWrap: 'wrap'
                    }}>
                        <span> By Komal Zahra</span>
                        <span> March 5, 2024</span>
                        
                    </div>
                </div>

                {/* Featured Image Area - Light Mode */}
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '32px',
                    padding: '60px 40px',
                    textAlign: 'center',
                    marginBottom: '55px',
                    border: '1px solid #f0e4d8',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                    animation: 'fadeInUp 0.7s ease'
                }}>
                    <div style={{ 
                        fontSize: '90px', 
                        marginBottom: '25px',
                        animation: 'glowPulse 3s ease-in-out infinite'
                    }}></div>
                    <h2 style={{ 
                        fontSize: '30px', 
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '15px',
                        fontWeight: '800'
                    }}>
                        Transform Your Space with Resin Art 
                    </h2>
                    <p style={{ color: '#8B6B58', maxWidth: '550px', margin: '0 auto', fontSize: '16px', fontWeight: '500' }}>
                        Beautiful, functional decor pieces that add elegance to any room 
                    </p>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    
                    {/* Introduction */}
                    <div style={{ animation: 'fadeInUp 0.6s ease', marginBottom: '30px' }}>
                        <p style={{ 
                            fontSize: '18px', 
                            lineHeight: '1.8', 
                            color: '#2D1F12', 
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }}>
                             Resin art isn't just for jewelry and small keepsakes. It can transform your home with stunning, 
                            functional pieces that become conversation starters. From elegant coasters to statement trays, 
                            here's how to incorporate resin art into your home decor. 
                        </p>
                    </div>

                    {/* Popular Resin Home Decor Items - Light Mode */}
                    <div style={{ animation: 'fadeInUp 0.6s ease 0.05s both' }}>
                        <h2 style={{ 
                            fontSize: '32px', 
                            fontWeight: '800', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginTop: '45px',
                            marginBottom: '25px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ fontSize: '42px' }}></span> Popular Resin Home Decor Items
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            marginBottom: '35px'
                        }}>
                            {[
                                { icon: '', name: 'Coasters', desc: 'Protect surfaces with style' },
                                { icon: '', name: 'Trays', desc: 'Serve in style' },
                                { icon: '', name: 'Wall Art', desc: 'Statement pieces for walls' },
                                { icon: '', name: 'Candle Holders', desc: 'Ambient lighting with art' }
                            ].map((item, idx) => (
                                <div key={idx} style={{
                                    background: '#FFFFFF',
                                    borderRadius: '20px',
                                    padding: '25px',
                                    textAlign: 'center',
                                    border: '1px solid #f0e4d8',
                                    transition: 'all 0.4s ease',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                }}>
                                    <div style={{ fontSize: '45px', marginBottom: '10px' }}>{item.icon}</div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FF6B9D', marginBottom: '5px' }}>{item.name}</h3>
                                    <p style={{ fontSize: '12px', color: '#8B6B58' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Design Ideas by Room - Light Mode */}
                    <div style={{ animation: 'fadeInUp 0.6s ease 0.1s both' }}>
                        <h2 style={{ 
                            fontSize: '32px', 
                            fontWeight: '800', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginTop: '45px',
                            marginBottom: '25px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ fontSize: '42px' }}></span> Design Ideas by Room
                        </h2>
                        
                        <div style={{
                            background: '#fefaf5',
                            borderRadius: '24px',
                            padding: '20px',
                            marginBottom: '20px',
                            border: '1px solid #f0e4d8'
                        }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FF6B9D', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span></span> Living Room
                            </h3>
                            <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '14px' }}>
                                <li>Geode-style coffee table with resin river design</li>
                                <li>Set of 6 coasters with pressed flowers</li>
                                <li>Large serving tray for entertaining</li>
                                <li>Abstract wall art with metallic pigments</li>
                            </ul>
                        </div>

                        <div style={{
                            background: '#fefaf5',
                            borderRadius: '24px',
                            padding: '20px',
                            marginBottom: '20px',
                            border: '1px solid #f0e4d8'
                        }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FF6B9D', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span></span> Dining Room
                            </h3>
                            <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '14px' }}>
                                <li>Resin chargers for special occasions</li>
                                <li>Centerpiece bowl with dried florals</li>
                                <li>Place card holders for weddings</li>
                                <li>Wine bottle stoppers with resin tops</li>
                            </ul>
                        </div>

                        <div style={{
                            background: '#fefaf5',
                            borderRadius: '24px',
                            padding: '20px',
                            marginBottom: '20px',
                            border: '1px solid #f0e4d8'
                        }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FF6B9D', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span></span> Bedroom
                            </h3>
                            <ul style={{ color: '#8B6B58', lineHeight: '1.8', marginLeft: '20px', fontSize: '14px' }}>
                                <li>Jewelry holder tray for dresser</li>
                                <li>Ring dish with dried flowers</li>
                                <li>Photo frame with preserved memories</li>
                                <li>Nightstand coasters</li>
                            </ul>
                        </div>
                    </div>

                    {/* Pro Tips Box - Light Mode */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '28px',
                        margin: '40px 0',
                        borderLeft: '5px solid #FF6B9D',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        animation: 'fadeInUp 0.6s ease 0.15s both'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(5px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                    }}>
                        <h3 style={{ 
                            fontSize: '20px', 
                            color: '#FF6B9D', 
                            marginBottom: '15px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                             Komal's Decor Tips 
                        </h3>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.9', marginLeft: '20px', fontSize: '14px', fontWeight: '500' }}>
                            <li>Match resin colors to your room's color palette </li>
                            <li>Create matching sets for a cohesive look </li>
                            <li>Use UV-resistant resin for pieces near windows </li>
                            <li>Add felt pads to bottom of coasters and trays </li>
                            <li>Hand-wash only — avoid dishwashers </li>
                        </ul>
                    </div>

                    {/* CTA Section - Light Mode */}
                    <div style={{
                        textAlign: 'center',
                        margin: '55px 0',
                        padding: '50px',
                        background: '#FFFFFF',
                        borderRadius: '32px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.6s ease 0.2s both'
                    }}>
                        <div style={{ fontSize: '55px', marginBottom: '20px', animation: 'glowPulse 3s ease-in-out infinite' }}></div>
                        <h3 style={{ 
                            fontSize: '30px', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '18px',
                            fontWeight: '800'
                        }}>
                            Ready to Decorate Your Home? 
                        </h3>
                        <p style={{ color: '#8B6B58', marginBottom: '30px', fontSize: '16px', maxWidth: '450px', margin: '0 auto 30px', fontWeight: '500' }}>
                            Shop our collection of handcrafted resin home decor or order a custom piece! 
                        </p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/shop">
                                <button style={{
                                    padding: '15px 42px',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '60px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '800',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(231,84,128,0.4)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(231,84,128,0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.4)';
                                }}>
                                     Shop Home Decor
                                </button>
                            </Link>
                            <Link to="/customize">
                                <button style={{
                                    padding: '15px 42px',
                                    background: 'transparent',
                                    color: '#FF6B9D',
                                    border: '2px solid #FF6B9D',
                                    borderRadius: '60px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#E75480';
                                    e.target.style.color = 'white';
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.3)';
                                    e.target.style.borderColor = '#E75480';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#FF6B9D';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.borderColor = '#FF6B9D';
                                }}>
                                     Custom Order
                                </button>
                            </Link>
                        </div>
                    </div>
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
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; text-shadow: 0 0 10px rgba(255,107,157,0.3); }
                }
            `}</style>
        </div>
    );
};

export default ResinHomeDecor;