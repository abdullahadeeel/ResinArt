import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiUser, FiClock, FiMessageCircle, FiPhone, FiMail, FiMapPin, FiPackage, FiTruck, FiCheckCircle, FiHeart } from 'react-icons/fi';

const Blog = () => {
    const blogPosts = [
        {
            id: 'flower-preservation',
            title: 'Flower Preservation Service by Komal',
            excerpt: 'How Komal preserves your precious flowers in resin art — from drying to finishing.',
            image: '🌸',
            tag: 'Service',
            readTime: '5 min read',
            date: 'March 15, 2024',
            author: 'Komal Zahra'
        },
        {
            id: 'resin-jewelry',
            title: 'Custom Resin Jewelry: Wear Your Memories',
            excerpt: 'Transform your special flowers into beautiful pendants, earrings, and rings.',
            image: '💍',
            tag: 'Jewelry',
            readTime: '4 min read',
            date: 'March 10, 2024',
            author: 'Komal Zahra'
        },
        {
            id: 'resin-home-decor',
            title: 'Home Decor with Preserved Flowers',
            excerpt: 'Beautiful trays, coasters, and wall art made with your special blooms.',
            image: '🏠',
            tag: 'Home Decor',
            readTime: '6 min read',
            date: 'March 5, 2024',
            author: 'Komal Zahra'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                {/* Blog Header - Light Pink */}
                <div style={{ textAlign: 'center', marginBottom: '55px', animation: 'fadeInUp 0.6s ease' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '8px 24px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '13px',
                        marginBottom: '20px',
                        fontWeight: '700',
                        boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                    }}>
                         Welcome to Resin Art Blog 
                    </span>
                    <h1 style={{
                        fontSize: '55px',
                        fontWeight: '800',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '18px'
                    }}>
                        Stories & Services 
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '17px', maxWidth: '600px', margin: '0 auto', fontWeight: '500' }}>
                        Learn how Komal preserves your precious memories in resin art 
                    </p>
                </div>

                {/* Main Blog Post - Featured */}
                <div style={{
                    marginBottom: '60px',
                    animation: 'fadeInUp 0.7s ease'
                }}>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '32px',
                        overflow: 'hidden',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#E75480';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#f0e4d8';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.05)';
                    }}>
                        <div style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                                    <div style={{
                                        fontSize: '70px',
                                        animation: 'glowPulse 3s ease-in-out infinite'
                                    }}>🌸</div>
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: '12px',
                                        padding: '5px 12px',
                                        background: 'rgba(231,84,128,0.1)',
                                        borderRadius: '30px',
                                        fontSize: '12px',
                                        color: '#E75480',
                                        fontWeight: '700'
                                    }}>
                                        Featured Service
                                    </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{
                                        fontSize: '34px',
                                        fontWeight: '800',
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        marginBottom: '12px'
                                    }}>
                                        Flower Preservation Service by Komal
                                    </h2>
                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                        <span style={{ color: '#E75480', fontSize: '13px', fontWeight: '600' }}> By Komal Zahra</span>
                                        <span style={{ color: '#8B6B58', fontSize: '13px' }}> March 15, 2024</span>
                                        <span style={{ color: '#8B6B58', fontSize: '13px' }}> 5 min read</span>
                                    </div>
                                    <p style={{ color: '#8B6B58', lineHeight: '1.7', marginBottom: '20px' }}>
                                        Want to preserve your wedding bouquet, anniversary flowers, or special blooms forever? 
                                        Komal offers professional flower preservation services using high-quality resin. 
                                        Here's how the process works...
                                    </p>
                                    <Link to="/blog/flower-preservation">
                                        <button style={{
                                            padding: '12px 28px',
                                            background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '700',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 2px 8px rgba(231,84,128,0.3)';
                                        }}>
                                             Read Full Process  <FiArrowRight style={{ marginLeft: '8px' }} />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How to Send Flowers Section - Light Theme */}
                <div style={{
                    marginBottom: '60px',
                    background: '#FFFFFF',
                    borderRadius: '32px',
                    padding: '40px',
                    border: '1px solid #f0e4d8',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    animation: 'fadeInUp 0.7s ease 0.1s both'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                        <div style={{ fontSize: '50px', marginBottom: '15px', animation: 'glowPulse 3s ease-in-out infinite' }}>📦</div>
                        <h2 style={{
                            fontSize: '34px',
                            fontWeight: '800',
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            How to Send Your Flowers to Komal?
                        </h2>
                        <p style={{ color: '#8B6B58', marginTop: '12px', fontWeight: '500' }}>
                            Step-by-step guide to get your precious blooms preserved professionally
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
                        {[
                            { num: '1️⃣', title: 'Contact Komal', desc: 'WhatsApp or call to discuss your flowers and order details' },
                            { num: '2️⃣', title: 'Pack Flowers Safely', desc: 'Gently wrap flowers in tissue paper, place in a cardboard box with cushioning' },
                            { num: '3️⃣', title: 'Ship to Jhelum', desc: 'Send flowers via courier to Komal\'s studio in Jhelum, Pakistan' },
                            { num: '4️⃣', title: 'Receive Preserved Art', desc: 'Komal preserves your flowers and ships back beautiful resin art' }
                        ].map((step, idx) => (
                            <div key={idx} style={{
                                textAlign: 'center',
                                padding: '25px 15px',
                                background: '#fefaf5',
                                borderRadius: '24px',
                                transition: 'all 0.3s ease',
                                border: '1px solid #f0e4d8'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = '#E75480';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = '#f0e4d8';
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 15px',
                                    fontSize: '28px'
                                }}>{step.num}</div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#E75480', marginBottom: '8px' }}>{step.title}</h3>
                                <p style={{ fontSize: '12px', color: '#8B6B58', lineHeight: '1.5' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Shipping Address Card */}
                    <div style={{
                        marginTop: '35px',
                        padding: '25px',
                        background: '#FFF9F5',
                        borderRadius: '24px',
                        textAlign: 'center',
                        border: '1px solid #f0e4d8'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '15px' }}>
                            <FiMapPin size={24} style={{ color: '#E75480' }} />
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#E75480' }}>Shipping Address</h3>
                        </div>
                        <p style={{ color: '#8B6B58', marginBottom: '5px' }}>Komal Zahra, Resin Art Studio</p>
                        <p style={{ color: '#8B6B58', marginBottom: '5px' }}>House #123, Street #4, Near Grand Mosque</p>
                        <p style={{ color: '#8B6B58', marginBottom: '5px' }}>Jhelum Cantt, Jhelum, Pakistan - 49600</p>
                        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: '#25D366',
                                color: 'white',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontSize: '13px',
                                fontWeight: '700'
                            }}>
                                <FiMessageCircle /> WhatsApp: +92 300 1234567
                            </a>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: 'rgba(231,84,128,0.1)',
                                borderRadius: '50px',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: '#E75480'
                            }}>
                                <FiPackage /> Contact for Tracking
                            </div>
                        </div>
                    </div>
                </div>

                {/* Komal's Preservation Process - Light Theme */}
                <div style={{
                    marginBottom: '60px',
                    background: '#FFFFFF',
                    borderRadius: '32px',
                    padding: '40px',
                    border: '1px solid #f0e4d8',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    animation: 'fadeInUp 0.7s ease 0.2s both'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                        <div style={{ fontSize: '50px', marginBottom: '15px', animation: 'glowPulse 3s ease-in-out infinite' }}></div>
                        <h2 style={{
                            fontSize: '34px',
                            fontWeight: '800',
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            How Komal Preserves Your Flowers?
                        </h2>
                        <p style={{ color: '#8B6B58', marginTop: '12px', fontWeight: '500' }}>
                            Professional preservation process — you don't need to do anything except send your flowers!
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                        {[
                            { icon: '🌸', title: 'Step 1: Flower Preparation', desc: 'Komal carefully unpacks your flowers, assesses their condition, and prepares them for preservation using professional silica gel drying method.' },
                            { icon: '🎨', title: 'Step 2: Resin Art Creation', desc: 'Using high-quality epoxy resin, Komal carefully places your dried flowers in molds, pours resin in layers to prevent floating, and removes bubbles.' },
                            { icon: '✨', title: 'Step 3: Finishing & Shipping', desc: 'After 24-48 hours of curing, Komal demolds, sands edges, and polishes your piece. Then carefully packs and ships back to you.' }
                        ].map((step, idx) => (
                            <div key={idx} style={{
                                padding: '25px',
                                background: '#fefaf5',
                                borderRadius: '24px',
                                border: '1px solid #f0e4d8',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.borderColor = '#E75480';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#f0e4d8';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{ fontSize: '45px', textAlign: 'center', marginBottom: '15px' }}>{step.icon}</div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#E75480', textAlign: 'center', marginBottom: '12px' }}>{step.title}</h3>
                                <p style={{ fontSize: '13px', color: '#8B6B58', lineHeight: '1.6' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Other Blog Posts */}
                <div style={{ marginTop: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                        <h2 style={{
                            fontSize: '32px',
                            fontWeight: '800',
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            More Stories ✨
                        </h2>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '30px'
                    }}>
                        {blogPosts.slice(1).map((post, idx) => (
                            <div key={idx} style={{
                                background: '#FFFFFF',
                                borderRadius: '28px',
                                overflow: 'hidden',
                                border: '1px solid #f0e4d8',
                                transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                animation: `fadeInUp 0.5s ease ${0.1 * idx}s both`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 35px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = '#E75480';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#f0e4d8';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                            }}>
                                <div style={{
                                    padding: '30px',
                                    textAlign: 'center',
                                    background: '#FFF9F5'
                                }}>
                                    <div style={{ fontSize: '55px' }}>{post.image}</div>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                            color: 'white',
                                            borderRadius: '30px',
                                            fontSize: '10px',
                                            fontWeight: '700'
                                        }}>{post.tag}</span>
                                        <span style={{ fontSize: '11px', color: '#8B6B58' }}>⏱️ {post.readTime}</span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#2D1F12',
                                        marginBottom: '12px',
                                        lineHeight: '1.4'
                                    }}>
                                        {post.title}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: '#8B6B58', lineHeight: '1.6', marginBottom: '16px' }}>
                                        {post.excerpt}
                                    </p>
                                    <Link to={`/blog/${post.id}`} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#E75480',
                                        textDecoration: 'none',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.gap = '12px';
                                        e.currentTarget.style.color = '#FF6B9D';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.gap = '8px';
                                        e.currentTarget.style.color = '#E75480';
                                    }}>
                                        Read More <FiArrowRight />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section - Light Pink */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '60px',
                    padding: '45px',
                    background: '#FFFFFF',
                    borderRadius: '32px',
                    border: '1px solid #f0e4d8',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    animation: 'fadeInUp 0.6s ease 0.3s both'
                }}>
                    <div style={{ fontSize: '45px', marginBottom: '15px', animation: 'glowPulse 3s ease-in-out infinite' }}>💖🌹✨</div>
                    <h3 style={{
                        fontSize: '28px',
                        fontWeight: '800',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '12px'
                    }}>
                        Ready to Preserve Your Special Flowers?
                    </h3>
                    <p style={{ color: '#8B6B58', marginBottom: '25px', maxWidth: '500px', margin: '0 auto 25px', fontWeight: '500' }}>
                        Contact Komal today to start your preservation journey
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <Link to="/customize">
                            <button style={{
                                padding: '14px 35px',
                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(231,84,128,0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(231,84,128,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.3)';
                            }}>
                                 Order Custom Preservation 
                            </button>
                        </Link>
                        <a
                            href="https://wa.me/923001234567"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                padding: '14px 35px',
                                background: '#25D366',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
                            }}>
                            <FiMessageCircle style={{ marginRight: '8px' }} /> WhatsApp Komal
                        </a>
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
                    50% { opacity: 0.8; text-shadow: 0 0 10px rgba(255,107,157,0.3); }
                }
            `}</style>
        </div>
    );
};

export default Blog;