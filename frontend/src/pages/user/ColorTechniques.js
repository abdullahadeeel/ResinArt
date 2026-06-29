import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiDroplet, FiZap, FiCircle, FiHeart, FiStar } from 'react-icons/fi';

const ColorTechniques = () => {
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
                        fontWeight: '700',
                        boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                    }}>
                        ✨Advanced Techniques • Color Theory 
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
                        Advanced Color Techniques in Resin 
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
                        <span> march 20, 2026</span>
                       
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
                        Master the Art of Color 
                    </h2>
                    <p style={{ color: '#8B6B58', maxWidth: '550px', margin: '0 auto', fontSize: '16px', fontWeight: '500' }}>
                        From cells to lacing, geode effects to petri dishes — transform your resin art 
                    </p>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    
                    {/* Introduction */}
                    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
                        <p style={{ 
                            fontSize: '18px', 
                            lineHeight: '1.8', 
                            color: '#2D1F12', 
                            marginBottom: '30px',
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }}>
                             Color is what brings resin art to life. Moving beyond solid colors opens up a world of 
                            stunning effects. Here are the most popular advanced techniques to try. 
                        </p>
                    </div>

                    {/* Technique 1: Dirty Pour */}
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
                            <span style={{ fontSize: '42px' }}>1️⃣</span> The Dirty Pour
                        </h2>
                        <p style={{ lineHeight: '1.7', color: '#8B6B58', marginBottom: '25px', fontSize: '16px' }}>
                            Layer different colored resins in one cup, then pour. This creates beautiful swirled, 
                            marble-like effects. For best results, use colors that complement each other and 
                            pour slowly in a circular motion. 
                        </p>
                    </div>

                    {/* Technique 2: Geode Effect */}
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
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ fontSize: '42px' }}>2️⃣</span> Geode Effect 💎
                        </h2>
                        <p style={{ lineHeight: '1.7', color: '#8B6B58', marginBottom: '25px', fontSize: '16px' }}>
                            Create stunning geode-inspired pieces by pouring a base color, then adding metallic 
                            pigments, crushed glass, and crystals. Use a heat gun to create organic, flowing patterns. 
                            Finish with a layer of clear resin for depth. 
                        </p>
                    </div>

                    {/* Technique 3: Cells & Lacing */}
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
                            <span style={{ fontSize: '42px' }}>3️⃣</span> Cells & Lacing 🌀
                        </h2>
                        <p style={{ lineHeight: '1.7', color: '#8B6B58', marginBottom: '18px', fontSize: '16px' }}>
                            Cells and lacing happen when different density resins interact. To create cells:
                        </p>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.9', marginLeft: '25px', marginBottom: '25px', fontSize: '15px' }}>
                            <li>Use white or light colors as a base</li>
                            <li>Add a few drops of silicone oil to your accent colors</li>
                            <li>Pour accent colors into the base</li>
                            <li>Use a torch to pop bubbles and encourage cells</li>
                        </ul>
                    </div>

                    {/* Technique 4: Petri Dish Effect */}
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
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ fontSize: '42px' }}>4️⃣</span> Petri Dish Effect 🔬
                        </h2>
                        <p style={{ lineHeight: '1.7', color: '#8B6B58', marginBottom: '25px', fontSize: '16px' }}>
                            Named after petri dish cultures, this effect creates organic, circular patterns. 
                            Pour a clear or light base, then drop alcohol ink in the center. The ink spreads outward, 
                            creating beautiful, flower-like patterns. 
                        </p>
                    </div>

                    {/* Pro Tip Box - Light Mode */}
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
                            Komal's Color Tips 
                        </h3>
                        <ul style={{ color: '#8B6B58', lineHeight: '1.9', marginLeft: '20px', fontSize: '15px', fontWeight: '500' }}>
                            <li>Use white as a base to make colors pop </li>
                            <li>Add a drop of white to create pastels </li>
                            <li>Experiment with complementary colors (blue/orange, purple/yellow) </li>
                            <li>Work quickly — resin starts thickening after 30-45 minutes ⏱</li>
                            <li>Document your recipes for future projects </li>
                        </ul>
                    </div>

                    {/* Color Mediums Guide - Light Mode */}
                    <div style={{ animation: 'fadeInUp 0.6s ease 0.3s both' }}>
                        <h2 style={{ 
                            fontSize: '32px', 
                            fontWeight: '800', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginTop: '45px',
                            marginBottom: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ fontSize: '42px' }}></span> Color Mediums Guide
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            marginBottom: '40px'
                        }}>
                            {[
                                { icon: '🎨', title: 'Alcohol Inks', desc: 'Vibrant, translucent, great for petri dish', color: '#FF6B9D' },
                                { icon: '✨', title: 'Mica Powders', desc: 'Shimmery, opaque, beautiful metallics', color: '#E75480' },
                                { icon: '💧', title: 'Liquid Pigments', desc: 'Opaque, concentrated, good for solid colors', color: '#FFB347' },
                                { icon: '🌟', title: 'Glitter', desc: 'Add sparkle and dimension', color: '#FF6B9D' }
                            ].map((item, idx) => (
                                <div key={idx} style={{
                                    background: '#FFFFFF',
                                    borderRadius: '20px',
                                    padding: '22px',
                                    border: '1px solid #f0e4d8',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = item.color;
                                    e.currentTarget.style.boxShadow = `0 8px 20px rgba(0,0,0,0.1)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                }}>
                                    <div style={{ fontSize: '38px', marginBottom: '12px' }}>{item.icon}</div>
                                    <strong style={{ color: item.color, fontSize: '15px' }}>{item.title}</strong>
                                    <p style={{ fontSize: '12px', color: '#8B6B58', marginTop: '8px' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
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
                        animation: 'fadeInUp 0.6s ease 0.35s both'
                    }}>
                        <div style={{ fontSize: '55px', marginBottom: '15px', animation: 'glowPulse 3s ease-in-out infinite' }}></div>
                        <h3 style={{ 
                            fontSize: '28px', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '15px',
                            fontWeight: '800'
                        }}>
                            Ready to Experiment with Color? 
                        </h3>
                        <p style={{ color: '#8B6B58', marginBottom: '28px', fontSize: '15px', fontWeight: '500' }}>
                            Shop pigments, alcohol inks, and mica powders for your next creation 
                        </p>
                        <Link to="/shop">
                            <button style={{
                                padding: '14px 40px',
                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '60px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '800',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(231,84,128,0.5)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(231,84,128,0.7)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                            }}>
                                Shop Color Supplies 
                            </button>
                        </Link>
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

export default ColorTechniques;