import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle, FiHeart, FiStar, FiShoppingBag, FiShield, FiTruck, FiZap } from 'react-icons/fi';

const ResinBasics = () => {
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
                        <FiArrowLeft /> Back to Blog 
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
                         Beginner's Guide • Tutorial 
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
                        Resin Art Basics: Getting Started 
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
                        <span> march 10, 2026</span>
                        
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
                        Your Journey into Resin Art Starts Here 
                    </h2>
                    <p style={{ color: '#8B6B58', maxWidth: '550px', margin: '0 auto', fontSize: '16px', fontWeight: '500' }}>
                        Everything you need to know before your first pour 
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
                             Resin art is magical — it transforms liquid into solid, captures memories, and creates stunning 
                            pieces. But getting started can feel overwhelming. This guide will walk you through everything 
                            you need to know for your first project. 
                        </p>
                    </div>

                    {/* What is Epoxy Resin */}
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
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ fontSize: '42px' }}></span> What is Epoxy Resin?
                        </h2>
                        <p style={{ lineHeight: '1.7', color: '#8B6B58', marginBottom: '25px', fontSize: '16px' }}>
                            Epoxy resin is a two-part liquid (resin + hardener) that, when mixed, cures into a hard, 
                            clear, durable plastic. It's used for coating, casting, and creating art. It can be pigmented, 
                            filled with objects, and shaped into almost anything. 💎
                        </p>
                    </div>

                    {/* Essential Supplies - Light Mode */}
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
                            <span style={{ fontSize: '42px' }}></span> Essential Supplies for Beginners
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            marginBottom: '35px'
                        }}>
                            {[
                                { icon: '', name: 'Resin & Hardener', desc: 'Choose a beginner-friendly brand' },
                                { icon: '', name: 'Silicone Molds', desc: 'Coasters, trays, jewelry molds' },
                                { icon: '', name: 'Mixing Cups', desc: 'Graduated, disposable cups' },
                                { icon: '', name: 'Mixing Sticks', desc: 'Wooden or silicone sticks' },
                                { icon: '', name: 'Gloves', desc: 'Nitrile gloves for protection' },
                                { icon: '', name: 'Mask', desc: 'Work in ventilated area' }
                            ].map((item, idx) => (
                                <div key={idx} style={{
                                    background: '#FFFFFF',
                                    borderRadius: '20px',
                                    padding: '18px',
                                    border: '1px solid #f0e4d8',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                }}>
                                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                                    <strong style={{ color: '#FF6B9D', fontSize: '14px', fontWeight: '700' }}>{item.name}</strong>
                                    <p style={{ fontSize: '11px', color: '#8B6B58', marginTop: '5px' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Safety First - Light Mode */}
                    <div style={{ animation: 'fadeInUp 0.6s ease 0.15s both' }}>
                        <h2 style={{ 
                            fontSize: '32px', 
                            fontWeight: '800', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginTop: '45px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ fontSize: '42px' }}></span> Safety First!
                        </h2>
                        <div style={{
                            background: '#FFFFFF',
                            borderRadius: '24px',
                            padding: '25px',
                            marginBottom: '25px',
                            borderLeft: '5px solid #FFB347',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                            <ul style={{ color: '#8B6B58', lineHeight: '1.9', marginLeft: '20px', fontSize: '14px', fontWeight: '500' }}>
                                <li> Always work in a well-ventilated area</li>
                                <li> Wear nitrile gloves (latex can react with resin)</li>
                                <li> Use a respirator mask for extended sessions</li>
                                <li> Keep resin away from skin and eyes</li>
                                <li> Never pour resin down the drain — let it cure and dispose properly</li>
                                <li> Keep out of reach of children and pets</li>
                            </ul>
                        </div>
                    </div>

                    {/* Step-by-Step First Project - Light Mode */}
                    <div style={{ animation: 'fadeInUp 0.6s ease 0.2s both' }}>
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
                            <span style={{ fontSize: '42px' }}></span> Step-by-Step First Project
                        </h2>
                        <div style={{
                            background: '#fefaf5',
                            borderRadius: '24px',
                            padding: '25px',
                            marginBottom: '25px',
                            border: '1px solid #f0e4d8'
                        }}>
                            <ol style={{ color: '#8B6B58', lineHeight: '1.9', marginLeft: '25px', fontSize: '15px', marginBottom: '0' }}>
                                <li><strong>Prepare your workspace</strong> — cover with plastic, have all supplies ready</li>
                                <li><strong>Read instructions</strong> — every resin brand has different ratios and cure times</li>
                                <li><strong>Measure accurately</strong> — use graduated cups, measure by volume or weight</li>
                                <li><strong>Mix thoroughly</strong> — stir for 3-5 minutes, scrape sides and bottom</li>
                                <li><strong>Pour slowly</strong> — pour in a thin stream to minimize bubbles</li>
                                <li><strong>Remove bubbles</strong> — use a heat gun or torch (keep moving, don't stay in one spot)</li>
                                <li><strong>Cover and wait</strong> — cover with a dust cover, let cure for 24-48 hours</li>
                                <li><strong>Demold</strong> — gently flex the mold to release your piece</li>
                            </ol>
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
                        animation: 'fadeInUp 0.6s ease 0.25s both'
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
                             Komal's Beginner Tips 
                        </h3>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.9', marginLeft: '20px', fontSize: '14px', fontWeight: '500' }}>
                            <li>Start with small projects (coasters are perfect!) </li>
                            <li>Use a heat gun for bubbles — but keep it moving! </li>
                            <li>Practice with clear resin before adding colors </li>
                            <li>Don't rush — patience is key in resin art </li>
                            <li>Keep a notebook to track your recipes and results </li>
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
                        animation: 'fadeInUp 0.6s ease 0.3s both'
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
                            Ready to Create Your First Piece? 
                        </h3>
                        <p style={{ color: '#8B6B58', marginBottom: '30px', fontSize: '16px', maxWidth: '450px', margin: '0 auto 30px', fontWeight: '500' }}>
                            Need supplies or want to order a custom piece? Let Komal help you! 
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
                                    🛍️ Shop Supplies
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

export default ResinBasics;