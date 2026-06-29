import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiHeart, FiMenu, FiX, FiStar } from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartPulse, setCartPulse] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        loadCartCount();

        window.addEventListener('cartUpdated', () => {
            loadCartCount();
            setCartPulse(true);
            setTimeout(() => setCartPulse(false), 500);
        });
        return () => window.removeEventListener('cartUpdated', loadCartCount);
    }, []);

    const loadCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('✨ Logged out successfully! ✨');
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
            setShowSearchModal(false);
            setSearchTerm('');
        }
    };

    const navLinks = [
        { name: 'Home', path: '/home', popup: '✨ Welcome to Resin Art World ✨' },
        { name: 'Shop', path: '/shop', popup: '🛍️ Browse our Beautiful Collection' },
        { name: 'Customize', path: '/customize', popup: '🎨 AI Customization Studio' },
        { name: 'About', path: '/about', popup: '💖 Learn About Our Journey' }
    ];

    const getActiveTab = () => {
        const path = location.pathname;
        if (path === '/home') return 'Home';
        if (path === '/shop') return 'Shop';
        if (path === '/customize') return 'Customize';
        if (path === '/about') return 'About';
        return 'Home';
    };

    const activeTab = getActiveTab();

    return (
        <>
            {/* Top Announcement Bar - Dark Pink Glam */}
            <div style={{
                background: 'linear-gradient(135deg, #E75480 0%, #FF6B9D 50%, #E75480 100%)',
                color: 'white',
                padding: '8px 16px',
                textAlign: 'center',
                fontSize: '12px',
                letterSpacing: '0.5px',
                fontWeight: '600',
                backdropFilter: 'blur(4px)',
                animation: 'glowPulse 2s ease-in-out infinite',
                whiteSpace: 'nowrap',
                overflowX: 'auto'
            }}>
                <span>✨ Free Shipping on Orders Over 1000Rs | Normal Processing Time 15-18 Days | Floral Work 25-30 Days ✨</span>
            </div>

            {/* Main Navbar - Light Theme */}
            <header style={{
                background: '#fefaf5',
                backdropFilter: 'blur(12px)',
                padding: '12px 20px',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                borderBottom: '2px solid #f0e4d8',
                boxShadow: '0 8px 30px rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    {/* Logo */}
                    <Link to="/home" style={{ textDecoration: 'none', flexShrink: 0 }}>
                        <h1 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            background: 'linear-gradient(135deg, #FF6B9D, #E75480, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            margin: 0,
                            fontFamily: "'Playfair Display', Georgia, serif",
                            animation: 'glowPulse 2s ease-in-out infinite',
                            whiteSpace: 'nowrap'
                        }}>
                            ResinArt <span style={{ fontWeight: '400', color: '#FF6B9D', background: 'none' }}>Products</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav style={{
                        display: 'flex',
                        gap: '24px',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                style={{
                                    position: 'relative',
                                    textDecoration: 'none',
                                    color: activeTab === link.name ? '#E75480' : '#8B6B58',
                                    fontSize: '15px',
                                    fontWeight: activeTab === link.name ? '700' : '500',
                                    transition: 'all 0.3s ease',
                                    padding: '6px 0',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#E75480';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    const popup = e.currentTarget.querySelector('.popup-text');
                                    if (popup) {
                                        popup.style.opacity = '1';
                                        popup.style.transform = 'translateX(-50%) translateY(0)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeTab !== link.name) e.currentTarget.style.color = '#8B6B58';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    const popup = e.currentTarget.querySelector('.popup-text');
                                    if (popup) {
                                        popup.style.opacity = '0';
                                        popup.style.transform = 'translateX(-50%) translateY(-5px)';
                                    }
                                }}
                            >
                                {link.name}
                                {activeTab === link.name && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-4px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '5px',
                                        height: '5px',
                                        backgroundColor: '#FFB347',
                                        borderRadius: '50%',
                                        animation: 'glowPulse 2s ease-in-out infinite'
                                    }} />
                                )}
                                <span className="popup-text" style={{
                                    position: 'absolute',
                                    bottom: '-35px',
                                    left: '50%',
                                    transform: 'translateX(-50%) translateY(-5px)',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    color: 'white',
                                    fontSize: '11px',
                                    padding: '5px 12px',
                                    borderRadius: '40px',
                                    whiteSpace: 'nowrap',
                                    opacity: 0,
                                    transition: 'all 0.25s ease',
                                    pointerEvents: 'none',
                                    zIndex: 100,
                                    boxShadow: '0 4px 15px rgba(231,84,128,0.4)',
                                    fontWeight: '600',
                                    letterSpacing: '0.3px'
                                }}>
                                    {link.popup}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right Icons */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                        {/* Search Button */}
                        <button
                            onClick={() => setShowSearchModal(true)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#8B6B58',
                                padding: '8px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E75480';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#8B6B58';
                                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                            }}
                        >
                            <FiSearch size={18} />
                        </button>

                        {/* Cart Button */}
                        <Link
                            to="/cart"
                            style={{
                                position: 'relative',
                                color: '#8B6B58',
                                padding: '8px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E75480';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#8B6B58';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <FiShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    animation: cartPulse ? 'pulse 0.3s ease' : 'none',
                                    boxShadow: '0 2px 8px rgba(231,84,128,0.6)'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Section */}
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Link
                                    to="/wishlist"
                                    style={{
                                        color: '#8B6B58',
                                        padding: '8px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#E75480';
                                        e.currentTarget.style.color = '#FF6B9D';
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#8B6B58';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <FiHeart size={18} />
                                </Link>
                                
                                <Link
                                    to="/my-profile"
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontWeight: '700',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 8px rgba(231,84,128,0.4)',
                                        animation: 'float 3s ease-in-out infinite'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(231,84,128,0.4)';
                                    }}
                                >
                                    {user.name?.charAt(0).toUpperCase()}
                                </Link>
                                
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#8B6B58',
                                        padding: '8px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#E75480';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#8B6B58';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <FiLogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: 'none',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '13px',
                                    padding: '8px 18px',
                                    borderRadius: '40px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(231,84,128,0.4)',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(231,84,128,0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(231,84,128,0.4)';
                                }}
                            >
                                ✨ Sign In ✨
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{
                                display: 'none',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#8B6B58',
                                padding: '8px',
                                borderRadius: '50%'
                            }}
                            className="mobile-menu-btn"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E75480';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#8B6B58';
                            }}
                        >
                            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#fefaf5',
                        backdropFilter: 'blur(10px)',
                        padding: '20px',
                        borderTop: '2px solid #f0e4d8',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                        zIndex: 999,
                        animation: 'slideInRight 0.3s ease'
                    }}>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    style={{
                                        textDecoration: 'none',
                                        color: activeTab === link.name ? '#E75480' : '#8B6B58',
                                        fontWeight: activeTab === link.name ? '700' : '500',
                                        padding: '10px 0',
                                        fontSize: '15px',
                                        borderBottom: '1px solid #f0e4d8',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => setMobileMenuOpen(false)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#E75480';
                                        e.currentTarget.style.paddingLeft = '10px';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeTab !== link.name) e.currentTarget.style.color = '#8B6B58';
                                        e.currentTarget.style.paddingLeft = '0';
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Search Modal - Light Theme */}
            {showSearchModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                    animation: 'fadeIn 0.3s ease'
                }} onClick={() => setShowSearchModal(false)}>
                    <div style={{
                        background: '#ffffff',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '32px',
                        padding: '35px',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                        border: '1px solid #f0e4d8',
                        animation: 'fadeInUp 0.4s ease'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ 
                                fontSize: '22px', 
                                fontWeight: '700', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                margin: 0 
                            }}>
                                🔍 Search Products
                            </h3>
                            <button 
                                onClick={() => setShowSearchModal(false)} 
                                style={{ 
                                    background: '#E75480', 
                                    border: 'none', 
                                    fontSize: '22px', 
                                    cursor: 'pointer', 
                                    color: 'white',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FF6B9D';
                                    e.currentTarget.style.transform = 'rotate(90deg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E75480';
                                    e.currentTarget.style.transform = 'rotate(0)';
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="✨ Search for resin trays, coasters, keychains, jewelry... ✨"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '14px 20px',
                                    border: '1px solid #f0e4d8',
                                    borderRadius: '60px',
                                    fontSize: '14px',
                                    background: '#ffffff',
                                    color: '#2D1F12',
                                    marginBottom: '20px',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#E75480';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#f0e4d8';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '60px',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        fontSize: '14px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(231,84,128,0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 2px 8px rgba(231,84,128,0.3)';
                                    }}
                                >
                                    ✨ Search ✨
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowSearchModal(false)}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#fefaf5',
                                        border: '1px solid #f0e4d8',
                                        borderRadius: '60px',
                                        cursor: 'pointer',
                                        color: '#E75480',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#E75480';
                                        e.target.style.color = 'white';
                                        e.target.style.borderColor = '#E75480';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#fefaf5';
                                        e.target.style.color = '#E75480';
                                        e.target.style.borderColor = '#f0e4d8';
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Global Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
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
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
                
                @keyframes glowPulse {
                    0% { opacity: 1; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.6; transform: translateX(-50%) scale(1.3); }
                    100% { opacity: 1; transform: translateX(-50%) scale(1); }
                }
                
                @media (max-width: 1024px) {
                    nav:not(.mobile-nav) {
                        gap: 16px !important;
                    }
                }
                
                @media (max-width: 900px) {
                    nav:not(.mobile-nav) {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: flex !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;