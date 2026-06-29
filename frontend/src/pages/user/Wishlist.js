import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight, FiStar, FiZap } from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';

// Helper function for images
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://placehold.co/100x100/fefaf5/FF6B9D?text=+Product+';
    }

    const path = String(imagePath).trim();

    if (path.startsWith('data:image')) {
        return path;
    }

    if (path.startsWith('http')) {
        return path;
    }

    if (path.startsWith('/uploads/')) {
        return `http://localhost:5000${path}`;
    }

    return `http://localhost:5000/uploads/${path}`;
};

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(' Please login first ');
                return;
            }
            
            const response = await API.get('/users/wishlist');
            if (response.data.success) {
                setWishlist(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            toast.error(' Failed to load wishlist ');
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        setRemovingId(productId);
        try {
            const response = await API.delete(`/users/wishlist/${productId}`);
            if (response.data.success) {
                setWishlist(wishlist.filter(item => item._id !== productId));
                toast.success(' Removed from wishlist ');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('✨ Failed to remove ✨');
        } finally {
            setRemovingId(null);
        }
    };

    const addToCart = (product, e) => {
        e.stopPropagation();
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.productId === product._id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: getImageUrl(product.images?.[0]),
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success(`✨ ${product.name} added to cart! ✨`);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fefaf5' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '3px solid rgba(231,84,128,0.2)',
                    borderTop: '3px solid #FF6B9D',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                {/* Header - Light Mode */}
                <div style={{ marginBottom: '35px', animation: 'fadeInUp 0.6s ease' }}>
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '800',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}>
                         My Wishlist
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '15px', fontWeight: '500' }}>
                        {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved with love 
                    </p>
                </div>

                {wishlist.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px',
                        background: '#FFFFFF',
                        borderRadius: '32px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.6s ease'
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
                            <FiHeart size={40} style={{ color: 'white' }} />
                        </div>
                        <h3 style={{ 
                            fontSize: '26px', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '12px' 
                        }}>
                            Your wishlist is empty 
                        </h3>
                        <p style={{ color: '#8B6B58', marginBottom: '28px', fontSize: '15px', fontWeight: '500' }}>
                            Save your favorite items here! Start exploring our collection 
                        </p>
                        <Link to="/shop">
                            <button style={{
                                padding: '14px 40px',
                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '60px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(231,84,128,0.4)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(231,84,128,0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.4)';
                            }}>
                                 Continue Shopping 
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '30px'
                    }}>
                        {wishlist.map((product, index) => (
                            <div
                                key={product._id}
                                style={{
                                    background: '#FFFFFF',
                                    borderRadius: '28px',
                                    overflow: 'hidden',
                                    border: '1px solid #f0e4d8',
                                    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    animation: `fadeInUp 0.5s ease ${index * 0.05}s both`,
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 35px rgba(0,0,0,0.15)';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                }}
                            >
                                {/* Image Section */}
                                <Link to={`/product/${product._id}`}>
                                    <div style={{
                                        height: '250px',
                                        background: '#fefaf5',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {/* Heart Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                            borderRadius: '50%',
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(231,84,128,0.3)',
                                            zIndex: 2
                                        }}>
                                            <FiHeart size={16} fill="white" color="white" />
                                        </div>
                                        
                                        <img
                                            src={getImageUrl(product.images?.[0])}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/300x300/fefaf5/FF6B9D?text=✨+Art+✨';
                                            }}
                                        />
                                    </div>
                                </Link>
                                
                                {/* Product Info */}
                                <div style={{ padding: '20px' }}>
                                    <p style={{
                                        fontSize: '11px',
                                        color: '#FF6B9D',
                                        letterSpacing: '1.5px',
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        fontWeight: '700'
                                    }}>
                                        ✦ {product.category || 'Resin Art'} ✦
                                    </p>
                                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            marginBottom: '10px',
                                            color: '#2D1F12',
                                            lineHeight: '1.4',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#FF6B9D';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '#2D1F12';
                                        }}>
                                            {product.name}
                                        </h3>
                                    </Link>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                        <p style={{
                                            fontSize: '20px',
                                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                            WebkitBackgroundClip: 'text',
                                            backgroundClip: 'text',
                                            color: 'transparent',
                                            fontWeight: '800'
                                        }}>
                                            Rs. {product.price?.toLocaleString()}
                                        </p>
                                        <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} size={12} fill="#FFB347" color="#FFB347" />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons - Light Mode */}
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={(e) => addToCart(product, e)}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(231,84,128,0.3)';
                                            }}
                                        >
                                            <FiShoppingCart size={14} /> Add to Cart
                                        </button>
                                        
                                        <button
                                            onClick={() => removeFromWishlist(product._id)}
                                            disabled={removingId === product._id}
                                            style={{
                                                padding: '12px 18px',
                                                background: removingId === product._id ? '#C9A9A9' : '#FFFFFF',
                                                color: '#FF6B9D',
                                                border: '1px solid #f0e4d8',
                                                borderRadius: '50px',
                                                cursor: removingId === product._id ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (removingId !== product._id) {
                                                    e.currentTarget.style.background = '#E75480';
                                                    e.currentTarget.style.color = 'white';
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                    e.currentTarget.style.borderColor = '#E75480';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (removingId !== product._id) {
                                                    e.currentTarget.style.background = '#FFFFFF';
                                                    e.currentTarget.style.color = '#FF6B9D';
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                                }
                                            }}
                                        >
                                            {removingId === product._id ? (
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid #FF6B9D',
                                                    borderTop: '2px solid transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.8s linear infinite'
                                                }} />
                                            ) : (
                                                <FiTrash2 size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
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
                
                @keyframes glowPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; text-shadow: 0 0 10px rgba(255,107,157,0.3); }
                }
            `}</style>
        </div>
    );
};

export default Wishlist;