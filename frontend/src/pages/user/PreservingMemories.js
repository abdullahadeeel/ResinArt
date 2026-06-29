import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiHeart, FiStar, FiMessageCircle, FiPackage, FiTruck, FiShield } from 'react-icons/fi';

const PreservingMemories = () => {
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
                        fontWeight: '700',
                        boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                    }}>
                         Keepsakes • Preservation Service 
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
                        Preserving Memories: Beyond Flowers 
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
                        <span>  march 15, 2026</span>
                        
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
                        Capture Life's Precious Moments 
                    </h2>
                    <p style={{ color: '#8B6B58', maxWidth: '550px', margin: '0 auto', fontSize: '16px', fontWeight: '500' }}>
                        From baby items to wedding keepsakes — preserve what matters most with Komal 
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
                             Flowers are beautiful, but they're just the beginning. Resin can preserve almost anything — 
                            creating meaningful keepsakes that last a lifetime. Here's what Komal can preserve for you. 
                        </p>
                    </div>

                    {/* ==================== WHAT CAN BE PRESERVED - LIGHT MODE ==================== */}
                    <div style={{ 
                        marginTop: '50px', 
                        marginBottom: '50px',
                        animation: 'fadeInUp 0.6s ease 0.05s both'
                    }}>
                        <h2 style={{ 
                            fontSize: '34px', 
                            fontWeight: '800', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '30px',
                            textAlign: 'center'
                        }}>
                             What Komal Can Preserve For You 
                        </h2>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '25px'
                        }}>
                            {[
                                { icon: '', title: 'Baby Items', desc: 'First shoes, hospital bracelets, ultrasound photos' },
                                { icon: '', title: 'Wedding Memories', desc: 'Invitations, cake toppers, bouquet flowers' },
                                { icon: '', title: 'Photos', desc: 'Laminated photos, printed memories' },
                                { icon: '', title: 'Letters & Notes', desc: 'Love letters, handwritten notes' },
                                { icon: '', title: 'Natural Objects', desc: 'Shells, feathers, dried leaves, insects' },
                                { icon: '', title: 'Keepsakes', desc: 'Pet tags, medals, special trinkets' }
                            ].map((item, idx) => (
                                <div key={idx} style={{
                                    background: '#FFFFFF',
                                    borderRadius: '24px',
                                    padding: '25px 15px',
                                    textAlign: 'center',
                                    border: '1px solid #f0e4d8',
                                    transition: 'all 0.4s ease',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                }}>
                                    <div style={{ fontSize: '45px', marginBottom: '12px' }}>{item.icon}</div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FF6B9D', marginBottom: '8px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '12px', color: '#8B6B58', lineHeight: '1.5' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ==================== HOW KOMAL PRESERVES DIFFERENT ITEMS - LIGHT MODE ==================== */}
                    <div style={{ 
                        marginTop: '50px', 
                        marginBottom: '50px',
                        animation: 'fadeInUp 0.6s ease 0.1s both'
                    }}>
                        <h2 style={{ 
                            fontSize: '32px', 
                            fontWeight: '800', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '25px',
                            textAlign: 'center'
                        }}>
                             How Komal Preserves Different Items
                        </h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {[
                                { icon: '', title: 'Baby Items', color: '#E75480', desc: 'First shoes, hospital bracelets, and ultrasound photos are carefully cleaned, dried, and embedded in multiple resin layers for a crystal clear finish.' },
                                { icon: '', title: 'Photos', color: '#FF6B9D', desc: 'Photos are first laminated or sealed, then embedded in UV-resistant resin to prevent fading and preserve memories forever.' },
                                { icon: '', title: 'Paper Items', color: '#FFB347', desc: 'Letters, invitations, and certificates are sealed with a protective layer, then carefully placed in resin to create beautiful keepsakes.' }
                            ].map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    gap: '20px',
                                    background: '#fefaf5',
                                    borderRadius: '24px',
                                    padding: '25px',
                                    border: '1px solid #f0e4d8',
                                    transition: 'all 0.3s ease',
                                    flexWrap: 'wrap'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                    <div style={{
                                        width: '70px',
                                        height: '70px',
                                        background: `linear-gradient(135deg, ${item.color}, #FFFFFF)`,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '35px'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B9D', marginBottom: '10px' }}>{item.title}</h3>
                                        <p style={{ fontSize: '14px', color: '#8B6B58', lineHeight: '1.6' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ==================== HOW TO SEND ITEMS TO KOMAL - LIGHT MODE ==================== */}
                    <div style={{ 
                        marginTop: '50px', 
                        marginBottom: '50px',
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        padding: '35px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.6s ease 0.15s both'
                    }}>
                        <h2 style={{ 
                            fontSize: '32px', 
                            fontWeight: '800', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '25px',
                            textAlign: 'center'
                        }}>
                            How to Send Your Keepsakes to Komal?
                        </h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            {[
                                { num: '1️⃣', title: 'Contact Komal', desc: 'WhatsApp or call to discuss your keepsake and order details' },
                                { num: '2️⃣', title: 'Pack Item Safely', desc: 'Wrap item carefully in bubble wrap and place in a sturdy box' },
                                { num: '3️⃣', title: 'Ship to Jhelum', desc: 'Send via courier to Komal\'s studio in Jhelum, Pakistan' },
                                { num: '4️⃣', title: 'Receive Preserved Art', desc: 'Komal preserves your keepsake and ships back beautiful resin art' }
                            ].map((step, idx) => (
                                <div key={idx} style={{
                                    textAlign: 'center',
                                    padding: '20px 15px',
                                    background: '#fefaf5',
                                    borderRadius: '20px',
                                    border: '1px solid #f0e4d8',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                    <div style={{ fontSize: '35px', marginBottom: '12px' }}>{step.num}</div>
                                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#FF6B9D', marginBottom: '8px' }}>{step.title}</h4>
                                    <p style={{ fontSize: '11px', color: '#8B6B58', lineHeight: '1.5' }}>{step.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Address Card - Light Mode */}
                        <div style={{
                            marginTop: '30px',
                            padding: '20px',
                            background: '#fefaf5',
                            borderRadius: '20px',
                            textAlign: 'center',
                            border: '1px solid #f0e4d8'
                        }}>
                            <FiPackage size={24} style={{ color: '#FF6B9D', marginBottom: '10px' }} />
                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FF6B9D', marginBottom: '10px' }}>Shipping Address</h4>
                            <p style={{ color: '#8B6B58', marginBottom: '5px', fontSize: '13px' }}>Komal Zahra, Resin Art Studio</p>
                            <p style={{ color: '#8B6B58', marginBottom: '5px', fontSize: '13px' }}>House #123, Street #4, Near Grand Mosque</p>
                            <p style={{ color: '#8B6B58', marginBottom: '5px', fontSize: '13px' }}>Jhelum Cantt, Jhelum, Pakistan - 49600</p>
                            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 20px',
                                    background: '#25D366',
                                    color: 'white',
                                    borderRadius: '40px',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    fontWeight: '700'
                                }}>
                                    <FiMessageCircle size={14} /> WhatsApp
                                </a>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 20px',
                                    background: 'rgba(231,84,128,0.1)',
                                    borderRadius: '40px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: '#FF6B9D'
                                }}>
                                    <FiPackage size={14} /> Contact for Tracking
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================== WHY CHOOSE KOMAL'S SERVICE - LIGHT MODE ==================== */}
                    <div style={{ 
                        marginTop: '40px', 
                        marginBottom: '40px',
                        animation: 'fadeInUp 0.6s ease 0.2s both'
                    }}>
                        <h2 style={{ 
                            fontSize: '32px', 
                            fontWeight: '800', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '25px',
                            textAlign: 'center'
                        }}>
                             Why Choose Komal's Preservation Service?
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: '24px',
                                padding: '25px',
                                border: '1px solid #f0e4d8',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FiCheckCircle color="#FF6B9D" size={20} /> <span style={{ color: '#8B6B58' }}>Professional preservation with premium resin</span>
                                    </li>
                                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FiCheckCircle color="#FF6B9D" size={20} /> <span style={{ color: '#8B6B58' }}>Crystal clear, bubble-free finish</span>
                                    </li>
                                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FiCheckCircle color="#FF6B9D" size={20} /> <span style={{ color: '#8B6B58' }}>Custom shapes: coasters, trays, jewelry, and more</span>
                                    </li>
                                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FiCheckCircle color="#FF6B9D" size={20} /> <span style={{ color: '#8B6B58' }}>Safe packaging and insured shipping</span>
                                    </li>
                                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FiCheckCircle color="#FF6B9D" size={20} /> <span style={{ color: '#8B6B58' }}>100% satisfaction guarantee</span>
                                    </li>
                                </ul>
                            </div>
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: '24px',
                                padding: '25px',
                                textAlign: 'center',
                                border: '1px solid #f0e4d8',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ fontSize: '45px', marginBottom: '15px', animation: 'glowPulse 2s ease-in-out infinite' }}></div>
                                <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B9D', marginBottom: '10px' }}>Trusted by 500+ Customers</h4>
                                <p style={{ fontSize: '12px', color: '#8B6B58' }}>Across Pakistan</p>
                                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '3px' }}>
                                    {[...Array(5)].map((_, i) => <FiStar key={i} fill="#FFB347" color="#FFB347" size={18} />)}
                                </div>
                            </div>
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
                             Tips from Komal for Sending Keepsakes 
                        </h3>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.9', marginLeft: '20px', fontSize: '14px', fontWeight: '500' }}>
                            <li>Always test with a similar item before preserving the original </li>
                            <li>Ensure items are completely dry before sending </li>
                            <li>Use a sturdy cardboard box with bubble wrap or tissue paper padding </li>
                            <li>Label the package as "FRAGILE — HANDLE WITH CARE" </li>
                            <li>Share tracking number with Komal once shipped </li>
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
                            Have a Special Memory to Preserve? 
                        </h3>
                        <p style={{ color: '#8B6B58', marginBottom: '30px', fontSize: '16px', maxWidth: '450px', margin: '0 auto 30px', fontWeight: '500' }}>
                            Let Komal help you create a lasting keepsake that will be treasured forever 
                        </p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/customize">
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
                                     Start Your Preservation Project 
                                </button>
                            </Link>
                            <a
                                href="https://wa.me/923103175357"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    padding: '15px 42px',
                                    background: 'transparent',
                                    color: '#25D366',
                                    border: '2px solid #25D366',
                                    borderRadius: '60px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '700',
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
                                <FiMessageCircle style={{ marginRight: '8px' }} /> WhatsApp Komal
                            </a>
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

export default PreservingMemories;