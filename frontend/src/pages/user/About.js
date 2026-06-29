import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FiHeart, FiAward, FiUsers, FiPackage, FiClock, 
    FiInstagram, FiGlobe, FiMessageCircle, FiArrowRight, FiMail, FiMapPin, FiShoppingBag
} from 'react-icons/fi';

const About = () => {
    // ✅ UPDATED: Social Media + Daraz Link
    const socialLinks = {
        instagram: 'https://www.instagram.com/komalresinartist',
        tiktok: 'https://www.tiktok.com/@komalresinartist',
        whatsapp: 'https://wa.me/923103175357',
        daraz: 'https://s.daraz.pk/s.ct418'  // ✅ ADDED
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            
            {/* Hero Section - WITH BANNER IMAGE */}
            <div style={{
                position: 'relative',
                backgroundImage: 'url("/images/baneer.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '550px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                overflow: 'hidden'
            }}>
                {/* Dark Overlay for text visibility */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.65) 100%)'
                }}></div>
                
                {/* Floating Sparkles */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '10%',
                    fontSize: '70px',
                    opacity: 0.25,
                    animation: 'float 6s ease-in-out infinite'
                }}>✨</div>
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '8%',
                    fontSize: '60px',
                    opacity: 0.25,
                    animation: 'floatReverse 5s ease-in-out infinite'
                }}>💖</div>
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    right: '15%',
                    fontSize: '50px',
                    opacity: 0.15,
                    animation: 'float 4s ease-in-out infinite'
                }}>🎨</div>
                
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', padding: '60px 24px' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '8px 24px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        borderRadius: '50px',
                        fontSize: '14px',
                        marginBottom: '25px',
                        fontWeight: '700',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(231,84,128,0.4)',
                        animation: 'glowPulse 2s ease-in-out infinite'
                    }}>
                         Meet the Artist 
                    </span>
                    <h1 style={{
                        fontSize: '72px',
                        fontWeight: '800',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        marginBottom: '20px',
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        textShadow: 'none'
                    }}>
                        Komal Zahra
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.7',
                        color: '#FFFFFF',
                        fontWeight: '700',
                        textShadow: '2px 2px 6px rgba(0,0,0,0.4)'
                    }}>
                        Pakistan's Premier Resin Artist Preserving Memories in Resin
                    </p>
                    
                    {/* ✅ UPDATED: 4 Icons - Instagram, TikTok, WhatsApp, Daraz */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '18px',
                        marginTop: '40px'
                    }}>
                        {[
                            { icon: <FiInstagram size={22} />, link: socialLinks.instagram, color: '#E4405F', name: 'Instagram' },
                            { icon: <FiGlobe size={22} />, link: socialLinks.tiktok, color: '#000000', name: 'TikTok' },
                            { icon: <FiMessageCircle size={22} />, link: socialLinks.whatsapp, color: '#25D366', name: 'WhatsApp' },
                            { icon: <FiShoppingBag size={22} />, link: socialLinks.daraz, color: '#F85606', name: 'Daraz' }  // ✅ ADDED
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: 'rgba(0,0,0,0.3)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    fontSize: '22px',
                                    animation: `fadeInUp 0.5s ease ${idx * 0.1}s both`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = social.color;
                                    e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)';
                                    e.currentTarget.style.boxShadow = `0 4px 15px ${social.color}80`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                                    e.currentTarget.style.transform = 'scale(1) rotate(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Founder Story Section - Light Theme WITH KOMAL IMAGE */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    alignItems: 'center'
                }}>
                    <div style={{ animation: 'fadeInLeft 0.7s ease' }}>
                        <span style={{ 
                            color: '#E75480', 
                            fontSize: '13px', 
                            letterSpacing: '3px', 
                            textTransform: 'uppercase',
                            fontWeight: '700'
                        }}> The Artist </span>
                        <h2 style={{
                            fontSize: '46px',
                            fontWeight: '700',
                            fontFamily: "'Playfair Display', Georgia, serif",
                            marginTop: '15px',
                            marginBottom: '28px',
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            Komal Zahra — The Heart Behind ResinArt
                        </h2>
                        <p style={{ color: '#8B6B58', fontSize: '16px', lineHeight: '1.8', marginBottom: '22px' }}>
                            What started as a passion for preserving memories has blossomed into a 
                            full-fledged art form. Komal Zahra, a Pakistan-based resin artist, discovered 
                            the magic of resin art while looking for a way to preserve her wedding flowers.
                        </p>
                        <p style={{ color: '#8B6B58', fontSize: '16px', lineHeight: '1.8', marginBottom: '22px' }}>
                            Today, ResinArt by Komal Zahra has become a trusted name for those who want 
                            to capture life's precious moments — from wedding bouquets to baby's first 
                            shoes, from special gifts to everyday elegance.
                        </p>
                        <p style={{ color: '#8B6B58', fontSize: '16px', lineHeight: '1.8', fontStyle: 'italic' }}>
                            "Every piece I create carries a story. It's not just art; it's a memory 
                            frozen in time, a treasure that will last forever." 💖
                        </p>
                        <div style={{ marginTop: '28px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '3px',
                                background: 'linear-gradient(90deg, #E75480, #FF6B9D)',
                                borderRadius: '3px'
                            }}></div>
                            <span style={{ color: '#E75480', fontWeight: '700' }}>— Komal Zahra, Founder</span>
                        </div>
                    </div>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '32px',
                        padding: '20px',
                        textAlign: 'center',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                        animation: 'fadeInRight 0.7s ease'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '420px',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundImage: 'url("/images/komal zahra.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '20px',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(8px)',
                                padding: '10px 20px',
                                borderRadius: '40px',
                                color: '#E75480',
                                fontSize: '14px',
                                fontWeight: '700',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}>
                                 Customised Resin Art 
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ UPDATED: Social Media Connect Section - 4 Links */}
            <div style={{ background: '#FFF9F5', padding: '80px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <span style={{ 
                        color: '#E75480', 
                        fontSize: '13px', 
                        letterSpacing: '3px', 
                        textTransform: 'uppercase',
                        fontWeight: '700',
                        display: 'inline-block',
                        padding: '4px 16px',
                        background: 'rgba(231,84,128,0.1)',
                        borderRadius: '40px'
                    }}>
                         Connect With Komal 
                    </span>
                    <h2 style={{
                        fontSize: '44px',
                        fontWeight: '700',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        marginTop: '18px',
                        marginBottom: '18px',
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        Follow the Journey 
                    </h2>
                    <p style={{ color: '#8B6B58', maxWidth: '600px', margin: '0 auto 45px', fontSize: '16px', fontWeight: '500' }}>
                        Get behind-the-scenes access, new collection previews, and resin art tips 
                    </p>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { icon: <FiInstagram size={20} />, name: 'Instagram', link: socialLinks.instagram, color: '#E4405F' },
                            { icon: <FiGlobe size={20} />, name: 'TikTok', link: socialLinks.tiktok, color: '#000000' },
                            { icon: <FiMessageCircle size={20} />, name: 'WhatsApp', link: socialLinks.whatsapp, color: '#25D366' },
                            { icon: <FiShoppingBag size={20} />, name: 'Daraz', link: socialLinks.daraz, color: '#F85606' }  // ✅ ADDED
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px 32px',
                                    background: '#FFFFFF',
                                    borderRadius: '60px',
                                    textDecoration: 'none',
                                    color: '#E75480',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                    border: '1px solid #f0e4d8',
                                    fontWeight: '700',
                                    animation: `fadeInUp 0.5s ease ${idx * 0.08}s both`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = social.color;
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = `0 8px 25px ${social.color}80`;
                                    e.currentTarget.style.borderColor = social.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#FFFFFF';
                                    e.currentTarget.style.color = '#E75480';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                }}
                            >
                                {social.icon}
                                <span>{social.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission & Vision Section - Light Theme */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '55px' }}>
                    <span style={{ color: '#E75480', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '700' }}>🎯 Our Purpose 🎯</span>
                    <h2 style={{
                        fontSize: '42px',
                        fontWeight: '700',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        marginTop: '15px',
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        Mission & Vision 
                    </h2>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px' }}>
                    {/* Mission Box */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        padding: '40px',
                        textAlign: 'center',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                        animation: 'fadeInUp 0.6s ease both'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.borderColor = '#E75480';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#f0e4d8';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            margin: '0 auto 20px',
                            backgroundImage: 'url("/images/mission-icon.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            animation: 'glowPulse 3s ease-in-out infinite'
                        }}></div>
                        <h3 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '18px', color: '#E75480' }}>Our Mission</h3>
                        <p style={{ color: '#8B6B58', lineHeight: '1.7', fontSize: '15px' }}>
                            To create timeless, handcrafted resin art that preserves life's most precious memories while bringing beauty and elegance to everyday living.
                        </p>
                    </div>
                    
                    {/* Vision Box */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        padding: '40px',
                        textAlign: 'center',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                        animation: 'fadeInUp 0.6s ease 0.1s both'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.borderColor = '#E75480';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#f0e4d8';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            margin: '0 auto 20px',
                            backgroundImage: 'url("/images/vision-icon.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            animation: 'glowPulse 3s ease-in-out infinite'
                        }}></div>
                        <h3 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '18px', color: '#E75480' }}>Our Vision</h3>
                        <p style={{ color: '#8B6B58', lineHeight: '1.7', fontSize: '15px' }}>
                            To become Pakistan's most beloved resin art brand, known for exceptional craftsmanship, meaningful preservation, and artistic innovation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Values Section - Light Theme */}
            <div style={{ background: '#FFF9F5', padding: '80px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '55px' }}>
                        <span style={{ color: '#E75480', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '700' }}>💎 What We Stand For 💎</span>
                        <h2 style={{
                            fontSize: '42px',
                            fontWeight: '700',
                            fontFamily: "'Playfair Display', Georgia, serif",
                            marginTop: '15px',
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            Our Core Values 
                        </h2>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
                        {[
                            { icon: '💝', title: 'Authenticity', text: 'Every piece is unique and handcrafted', delay: 0 },
                            { icon: '🌿', title: 'Sustainability', text: 'Eco-friendly materials and practices', delay: 0.1 },
                            { icon: '🎨', title: 'Creativity', text: 'Innovative designs and techniques', delay: 0.2 },
                            { icon: '🤝', title: 'Connection', text: 'Building relationships through art', delay: 0.3 }
                        ].map((value, idx) => (
                            <div key={idx} style={{
                                textAlign: 'center',
                                padding: '30px 20px',
                                background: '#FFFFFF',
                                borderRadius: '24px',
                                border: '1px solid #f0e4d8',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                animation: `fadeInUp 0.5s ease ${value.delay}s both`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.borderColor = '#E75480';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#f0e4d8';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                            }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '34px',
                                    margin: '0 auto 18px',
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                    {value.icon}
                                </div>
                                <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '10px', color: '#E75480' }}>{value.title}</h3>
                                <p style={{ fontSize: '13px', color: '#8B6B58', lineHeight: '1.5' }}>{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Section - Light Theme WITH REAL IMAGES */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '55px' }}>
                    <span style={{ color: '#E75480', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '700' }}>📖 Latest from Komal</span>
                    <h2 style={{
                        fontSize: '42px',
                        fontWeight: '700',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        marginTop: '15px',
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        Resin Art Journal 
                    </h2>
                    <p style={{ color: '#8B6B58', maxWidth: '600px', margin: '18px auto 0', fontSize: '15px' }}>
                        Tips, tutorials, and behind-the-scenes stories 
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '35px' }}>
                    {/* Box 1 - Flower Preservation */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        border: '1px solid #f0e4d8',
                        transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.6s ease both'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = '#E75480';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = '#f0e4d8';
                    }}>
                        <div style={{
                            height: '220px',
                            backgroundImage: 'url("/images/flowes about.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        </div>
                        <div style={{ padding: '28px' }}>
                            <p style={{ fontSize: '11px', color: '#E75480', marginBottom: '10px', fontWeight: '700', letterSpacing: '2px' }}>✨ SERVICE ✨</p>
                            <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '14px', color: '#2D1F12', lineHeight: '1.4' }}>
                                Flower Preservation Service
                            </h3>
                            <Link to="/blog/flower-preservation" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#E75480',
                                textDecoration: 'none',
                                fontSize: '14px',
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

                    {/* Box 2 - Custom Resin Jewelry */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        border: '1px solid #f0e4d8',
                        transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.6s ease 0.1s both'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = '#E75480';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = '#f0e4d8';
                    }}>
                        <div style={{
                            height: '220px',
                            backgroundImage: 'url("/images/jwelry image.webp")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        </div>
                        <div style={{ padding: '28px' }}>
                            <p style={{ fontSize: '11px', color: '#E75480', marginBottom: '10px', fontWeight: '700', letterSpacing: '2px' }}>✨ JEWELRY ✨</p>
                            <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '14px', color: '#2D1F12', lineHeight: '1.4' }}>
                                Custom Resin Jewelry
                            </h3>
                            <Link to="/blog/resin-jewelry" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#E75480',
                                textDecoration: 'none',
                                fontSize: '14px',
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

                    {/* Box 3 - Resin Art Home Decor */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        border: '1px solid #f0e4d8',
                        transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.6s ease 0.2s both'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = '#E75480';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = '#f0e4d8';
                    }}>
                        <div style={{
                            height: '220px',
                            backgroundImage: 'url("/images/home decore image.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        </div>
                        <div style={{ padding: '28px' }}>
                            <p style={{ fontSize: '11px', color: '#E75480', marginBottom: '10px', fontWeight: '700', letterSpacing: '2px' }}>✨ HOME DECOR ✨</p>
                            <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '14px', color: '#2D1F12', lineHeight: '1.4' }}>
                                Resin Art Home Decor
                            </h3>
                            <Link to="/blog/resin-home-decor" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#E75480',
                                textDecoration: 'none',
                                fontSize: '14px',
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
                </div>

                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Link to="/blog">
                        <button style={{
                            padding: '14px 40px',
                            background: 'transparent',
                            border: '2px solid #9a3412',
                            borderRadius: '60px',
                            color: '#9a3412',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '700',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#9a3412';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 15px rgba(154,52,18,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#9a3412';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}>
                             View All Articles <FiArrowRight style={{ marginLeft: '8px' }} /> 
                        </button>
                    </Link>
                </div>
            </div>

            {/* Contact Section - Light Theme */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '32px',
                    padding: '55px 40px',
                    textAlign: 'center',
                    border: '1px solid #f0e4d8',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = '#E75480';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#f0e4d8';
                }}>
                    <div style={{ fontSize: '55px', marginBottom: '20px', animation: 'glowPulse 3s ease-in-out infinite' }}>🌸</div>
                    <h2 style={{
                        fontSize: '38px',
                        fontWeight: '700',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        marginBottom: '18px',
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        Have a Story to Preserve? 
                    </h2>
                    <p style={{ color: '#8B6B58', maxWidth: '550px', margin: '0 auto 35px', fontSize: '16px', lineHeight: '1.7', fontWeight: '500' }}>
                        Whether it's wedding flowers, a special photo, or a meaningful keepsake — 
                        let us help you capture it forever. 
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/customize">
                            <button style={{
                                padding: '16px 38px',
                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '60px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(231,84,128,0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(231,84,128,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.3)';
                            }}>
                                 Start Your Custom Order  <FiArrowRight />
                            </button>
                        </Link>
                        <a
                            href={socialLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                padding: '16px 38px',
                                background: 'transparent',
                                color: '#25D366',
                                border: '2px solid #25D366',
                                borderRadius: '60px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#25D366';
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#25D366';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}>
                            <FiMessageCircle /> WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer - Light Theme */}
            <footer style={{
                background: '#fefaf5',
                padding: '55px 24px 35px',
                borderTop: '1px solid #f0e4d8'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '45px' }}>
                    
                    {/* Brand Column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '28px', animation: 'glowPulse 2s ease-in-out infinite' }}></span>
                            <h3 style={{ 
                                fontSize: '20px', 
                                fontWeight: '700', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>ResinArt by Komal Zahra</h3>
                        </div>
                        <p style={{ color: '#8B6B58', fontSize: '14px', lineHeight: '1.7' }}>
                            Handcrafted resin art preserving memories and bringing beauty to your home. 
                        </p>
                        {/* ✅ UPDATED: 4 Social Icons in Footer */}
                        <div style={{ display: 'flex', gap: '18px', marginTop: '25px' }}>
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"><FiInstagram size={22} style={{ color: '#8B6B58', cursor: 'pointer', transition: 'all 0.3s ease' }} 
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#E4405F'; e.currentTarget.style.transform = 'scale(1.15)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#8B6B58'; e.currentTarget.style.transform = 'scale(1)'; }} /></a>
                            <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer"><FiGlobe size={22} style={{ color: '#8B6B58', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000'; e.currentTarget.style.transform = 'scale(1.15)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#8B6B58'; e.currentTarget.style.transform = 'scale(1)'; }} /></a>
                            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer"><FiMessageCircle size={22} style={{ color: '#8B6B58', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#25D366'; e.currentTarget.style.transform = 'scale(1.15)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#8B6B58'; e.currentTarget.style.transform = 'scale(1)'; }} /></a>
                            <a href={socialLinks.daraz} target="_blank" rel="noopener noreferrer"><FiShoppingBag size={22} style={{ color: '#8B6B58', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#F85606'; e.currentTarget.style.transform = 'scale(1.15)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#8B6B58'; e.currentTarget.style.transform = 'scale(1)'; }} /></a>  {/* ✅ ADDED */}
                        </div>
                    </div>
                    
                    {/* Quick Links Column */}
                    <div>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '22px', color: '#E75480' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/shop" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#E75480'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Shop All
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/customize" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#E75480'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Custom Orders
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/about" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#E75480'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ About Us
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/blog" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#E75480'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Policies Column */}
                    <div>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '22px', color: '#E75480' }}>Policies</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/shipping" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#E75480'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Shipping Info
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/returns" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#E75480'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Returns & Exchanges
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/privacy" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#E75480'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Privacy Policy
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/terms" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#E75480'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Contact Column */}
                    <div>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '22px', color: '#E75480' }}>Contact Us</h4>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <FiMail style={{ color: '#E75480' }} />
                            <a href="mailto:komal@resinart.com" 
                               style={{ color: '#8B6B58', fontSize: '14px', textDecoration: 'none', transition: 'all 0.3s ease' }}
                               onMouseEnter={(e) => e.target.style.color = '#E75480'}
                               onMouseLeave={(e) => e.target.style.color = '#8B6B58'}>
                                komal@resinart.com
                            </a>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <FiMessageCircle style={{ color: '#25D366' }} />
                            <a href={socialLinks.whatsapp} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               style={{ color: '#8B6B58', fontSize: '14px', textDecoration: 'none', transition: 'all 0.3s ease' }}
                               onMouseEnter={(e) => e.target.style.color = '#25D366'}
                               onMouseLeave={(e) => e.target.style.color = '#8B6B58'}>
                                03103175357 (WhatsApp)
                            </a>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FiMapPin style={{ color: '#E75480' }} />
                            <span style={{ color: '#8B6B58', fontSize: '14px' }}>Jhelum, Pakistan 🇵🇰</span>
                        </div>
                    </div>
                </div>
                
                <div style={{
                    textAlign: 'center',
                    paddingTop: '40px',
                    marginTop: '40px',
                    borderTop: '1px solid #f0e4d8',
                    color: '#C9A9A9',
                    fontSize: '12px'
                }}>
                    <p> ©2024 ResinArt by Komal Zahra. All rights reserved. Made with Love From Our Hearts to Your Home.</p>
                </div>
            </footer>
            
            {/* Global Animations */}
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
                
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
                
                @keyframes floatReverse {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(12px); }
                }
                
                @keyframes glowPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; text-shadow: 0 0 10px rgba(255,107,157,0.5); }
                }
            `}</style>
        </div>
    );
};

export default About;