import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowLeft, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
// ✅ ADDED: Import getImageUrl from utils (Code 2 feature)

import { getImageUrl } from '../../utils/imageUtils.js';
// ❌ REMOVED: Local getImageUrl function (ab utils se use karenge)

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [animateItem, setAnimateItem] = useState(null);
    // ✅ ADDED: loading state (Code 2 feature)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
        // ✅ ADDED: setLoading false (Code 2 feature)
        setLoading(false);
    };

    // ✅ CHANGED: updateQuantity uses productId instead of index (Code 2 feature)
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCart = cart.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // ✅ CHANGED: removeItem uses productId instead of index (Code 2 feature)
    const removeItem = (productId) => {
        // ✅ ADDED: Animation effect (Code 1 feature - kept)
        const index = cart.findIndex(item => item.productId === productId);
        setAnimateItem(index);
        setTimeout(() => {
            const updatedCart = cart.filter(item => item.productId !== productId);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            toast.success('✅ Item removed from cart');
            window.dispatchEvent(new Event('cartUpdated'));
            setAnimateItem(null);
        }, 300);
    };

    const getSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const getTax = () => {
        return getSubtotal() * 0.1;
    };

    const getShipping = () => {
        return getSubtotal() > 5000 ? 0 : 200;
    };

    const getTotal = () => {
        return getSubtotal() + getTax() + getShipping();
    };

    // ✅ ADDED: handleCheckout function (Code 2 feature)
    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        navigate('/checkout');
    };

    // ✅ ADDED: Loading state check (Code 2 feature)
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: '#fefaf5'
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #f3f3f6',
                    borderTop: '4px solid #FF6B9D',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: '#fefaf5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '20px',
                width: '100%',
                overflowX: 'hidden'
            }}>
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    animation: 'fadeInUp 0.6s ease',
                    width: '100%',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        animation: 'glowPulse 2s ease-in-out infinite'
                    }}>
                        <FiShoppingCart size={40} style={{ color: 'white' }} />
                    </div>
                    <h2 style={{ 
                        fontSize: '24px', 
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '12px' 
                    }}>
                        Your cart is empty ✨
                    </h2>
                    <p style={{ color: '#8B6B58', marginBottom: '28px', fontSize: '14px', fontWeight: '500' }}>
                        Looks like you haven't added any items yet. Let's go shopping! 🛍️
                    </p>
                    <Link to="/shop">
                        <button style={{
                            padding: '12px 30px',
                            background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '700',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(231,84,128,0.5)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(231,84,128,0.7)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                        }}>
                            Continue Shopping ✨
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#fefaf5',
            width: '100%',
            overflowX: 'hidden'
        }}>
            {/* ✅ ADDED: Header from Code 2 */}
            <header style={{
                backgroundColor: '#1f2937',
                color: 'white',
                padding: '16px 24px',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ color: '#f59e0b', fontSize: '24px', margin: 0 }}>ResinArt</h1>
                    </Link>
                    <button
                        onClick={() => navigate('/shop')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <FiArrowLeft /> Continue Shopping
                    </button>
                </div>
            </header>

            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                padding: '20px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                
                {/* Page Title */}
                <h1 style={{ 
                    fontSize: '28px', 
                    marginBottom: '25px', 
                    fontFamily: "'Playfair Display', Georgia, serif",
                    background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: '800'
                }}>
                    🛍️ Shopping Cart ({cart.length} items)
                </h1>

                {/* ✅ CHANGED: Grid layout from Code 2 */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 1fr', 
                    gap: '24px'
                }}>
                    {/* Cart Items Section */}
                    <div style={{ 
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '24px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        {cart.map((item, index) => {
                            const imageUrl = getImageUrl(item.image);
                            
                            return (
                                <div
                                    key={item.productId || index}
                                    style={{
                                        display: 'flex',
                                        gap: '20px',
                                        padding: '20px 0',
                                        borderBottom: '1px solid #e5e7eb',
                                        transition: 'all 0.3s ease',
                                        animation: animateItem === index ? 'fadeOutRight 0.3s ease forwards' : 'fadeInUp 0.5s ease'
                                    }}
                                >
                                    {/* Image */}
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {item.image ? (
                                            <img 
                                                src={imageUrl} 
                                                alt={item.name} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentNode.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#9ca3af;font-size:12px">No Image</div>';
                                                }}
                                            />
                                        ) : (
                                            <div style={{ color: '#9ca3af', fontSize: '12px' }}>No Image</div>
                                        )}
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ 
                                            fontSize: '16px', 
                                            fontWeight: '700', 
                                            marginBottom: '6px', 
                                            color: '#2D1F12'
                                        }}>
                                            {item.name}
                                        </h3>
                                        {/* ✅ ADDED: Custom Design badge (Code 1 feature - kept) */}
                                        {item.isCustom && (
                                            <span style={{
                                                fontSize: '10px',
                                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                                color: 'white',
                                                padding: '3px 10px',
                                                borderRadius: '30px',
                                                display: 'inline-block',
                                                marginBottom: '8px',
                                                fontWeight: '700'
                                            }}>
                                                ✨ Custom Design
                                            </span>
                                        )}
                                        <p style={{ 
                                            color: '#f59e0b', 
                                            fontWeight: '500', 
                                            marginBottom: '12px',
                                            fontSize: '18px'
                                        }}>
                                            Rs. {item.price?.toLocaleString()}
                                        </p>
                                        
                                        {/* Quantity Controls */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        border: '1px solid #f0e4d8',
                                                        backgroundColor: '#FFFFFF',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.3s ease',
                                                        color: '#FF6B9D'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#E75480';
                                                        e.currentTarget.style.borderColor = '#FF6B9D';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                                        e.currentTarget.style.color = '#FF6B9D';
                                                    }}
                                                >
                                                    <FiMinus size={12} />
                                                </button>
                                                <span style={{ 
                                                    width: '35px', 
                                                    textAlign: 'center', 
                                                    fontWeight: '700', 
                                                    fontSize: '16px',
                                                    color: '#2D1F12'
                                                }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        border: '1px solid #f0e4d8',
                                                        backgroundColor: '#FFFFFF',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.3s ease',
                                                        color: '#FF6B9D'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#E75480';
                                                        e.currentTarget.style.borderColor = '#FF6B9D';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                                        e.currentTarget.style.color = '#FF6B9D';
                                                    }}
                                                >
                                                    <FiPlus size={12} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                style={{
                                                    color: '#ef4444',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '8px',
                                                    borderRadius: '50%',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = '#FF6B9D';
                                                    e.currentTarget.style.backgroundColor = '#E75480';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = '#ef4444';
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                <FiTrash2 size={16} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Item Total */}
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ 
                                            fontSize: '18px', 
                                            fontWeight: 'bold', 
                                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                            WebkitBackgroundClip: 'text',
                                            backgroundClip: 'text',
                                            color: 'transparent'
                                        }}>
                                            Rs. {(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary Section */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '24px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '100px'
                    }}>
                        <h2 style={{ 
                            fontSize: '20px', 
                            marginBottom: '20px', 
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: '800'
                        }}>
                            Order Summary
                        </h2>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginBottom: '12px', 
                                color: '#8B6B58',
                                fontSize: '14px'
                            }}>
                                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                <span style={{ fontWeight: '700', color: '#2D1F12' }}>Rs. {getSubtotal().toLocaleString()}</span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginBottom: '12px', 
                                color: '#8B6B58',
                                fontSize: '14px'
                            }}>
                                <span>Tax (10%)</span>
                                <span>Rs. {getTax().toLocaleString()}</span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginBottom: '12px', 
                                color: '#8B6B58',
                                fontSize: '14px'
                            }}>
                                <span>Shipping</span>
                                <span style={{ fontWeight: getShipping() === 0 ? 'bold' : 'normal', color: getShipping() === 0 ? '#10b981' : '#8B6B58' }}>
                                    {getShipping() === 0 ? '✨ Free' : `Rs. ${getShipping().toLocaleString()}`}
                                </span>
                            </div>
                        </div>

                        <div style={{
                            borderTop: '1px solid #f0e4d8',
                            paddingTop: '15px',
                            marginTop: '5px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#2D1F12' }}>Total</span>
                                <span style={{ 
                                    fontSize: '24px', 
                                    fontWeight: '800', 
                                    background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    color: 'transparent'
                                }}>
                                    Rs. {getTotal().toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {getSubtotal() < 5000 && getSubtotal() > 0 && (
                            <div style={{
                                marginTop: '15px',
                                padding: '10px',
                                background: 'rgba(231,84,128,0.05)',
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: '1px solid rgba(231,84,128,0.2)'
                            }}>
                                <p style={{ fontSize: '11px', color: '#FF6B9D', fontWeight: '700' }}>
                                    ✨ Add Rs. {(5000 - getSubtotal()).toLocaleString()} more for FREE Shipping!
                                </p>
                            </div>
                        )}

                        {/* ✅ CHANGED: Uses handleCheckout from Code 2 */}
                        <button
                            onClick={handleCheckout}
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                padding: '14px',
                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(231,84,128,0.5)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(231,84,128,0.7)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                            }}
                        >
                            Proceed to Checkout 🚀
                        </button>
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
                
                @keyframes fadeOutRight {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                }
                
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 0 5px rgba(231,84,128,0.3); }
                    50% { box-shadow: 0 0 20px rgba(231,84,128,0.6); }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .cart-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Cart;