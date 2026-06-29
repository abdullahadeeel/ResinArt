import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FiArrowRight, FiShoppingCart, FiHeart, FiStar, 
    FiInstagram, FiGlobe, FiMessageCircle, FiMail, FiPhone, FiMapPin
} from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

// Helper function for images
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/uploads/${imagePath}`;
};

const LandingPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await API.get('/products');
            if (response.data.success) {
                setProducts(response.data.data.slice(0, 4));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
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
                image: getImageUrl(product.images?.[0]) || '',
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success(`✨ ${product.name} added to cart! ✨`);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 30% 50%, #fefaf5 0%, #fef7f0 100%)' }}>
            
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                backgroundImage: 'url("/images/baneer.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '650px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '100px 24px',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.65) 100%)'
                }}></div>
                
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(231,84,128,0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'pulse 4s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: '250px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'pulse 5s ease-in-out infinite 1s'
                }}></div>
                
                {[...Array(8)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        fontSize: `${Math.random() * 20 + 10}px`,
                        opacity: 0.25,
                        animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite`,
                        pointerEvents: 'none'
                    }}>
                        ✨
                    </div>
                ))}
                
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', width: '100%' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '8px 24px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '13px',
                        marginBottom: '32px',
                        letterSpacing: '2px',
                        fontWeight: '600',
                        boxShadow: '0 0 20px rgba(231,84,128,0.3)',
                        animation: 'glowPulse 2s ease-in-out infinite'
                    }}>
                        ✨ From Our Hearts to Your Home ✨
                    </span>
                    
                    <h1 style={{
                        fontSize: '68px',
                        fontWeight: '800',
                        marginBottom: '20px',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #E75480, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        letterSpacing: '-0.5px',
                        textShadow: 'none',
                        animation: 'fadeInUp 0.8s ease'
                    }}>
                        Welcome to ResinArt
                    </h1>
                    
                    <p style={{
                        fontSize: '20px',
                        maxWidth: '600px',
                        margin: '0 auto 40px',
                        lineHeight: '1.7',
                        color: '#FFFFFF',
                        fontWeight: '700',
                        textShadow: '2px 2px 6px rgba(0,0,0,0.4)',
                        animation: 'fadeInUp 0.8s ease 0.1s both'
                    }}>
                        Your premier destination for handcrafted resin products. 
                        Discover unique pieces that capture beauty and preserve memories. 
                    </p>
                    
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeInUp 0.8s ease 0.2s both' }}>
                        <Link to="/shop">
                            <button style={{
                                padding: '16px 48px',
                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '60px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 20px rgba(231,84,128,0.4)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(231,84,128,0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(231,84,128,0.4)';
                            }}>
                                ✨ Shop Now <FiArrowRight size={18} />
                            </button>
                        </Link>
                        
                        <Link to="/user/login">
                            <button style={{
                                padding: '16px 40px',
                                background: 'rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                border: '2px solid rgba(255,255,255,0.5)',
                                borderRadius: '60px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(231,84,128,0.4)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = '#FF6B9D';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                            }}>
                                Sign In 
                            </button>
                        </Link>
                        
                        <Link to="/user/signup">
                            <button style={{
                                padding: '16px 40px',
                                background: 'rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                border: '2px solid rgba(255,255,255,0.5)',
                                borderRadius: '60px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(231,84,128,0.4)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = '#FF6B9D';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                            }}>
                                Sign Up 
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Featured Products Section */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '55px', animation: 'fadeInUp 0.6s ease' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '6px 18px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        color: 'white',
                        borderRadius: '40px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '16px'
                    }}>
                        ✨ Our Collection ✨
                    </span>
                    <h2 style={{ 
                        fontSize: '42px', 
                        fontWeight: '700', 
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '12px'
                    }}>
                        Featured Products
                    </h2>
                    <p style={{ color: '#8b6b58', fontSize: '16px' }}>
                        Discover our handcrafted collection made with love 💖
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '3px solid rgba(231,84,128,0.2)',
                            borderTop: '3px solid #E75480',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '35px'
                    }}>
                        {products.map((product, index) => (
                            <div
                                key={product._id}
                                onClick={() => navigate(`/product/${product._id}`)}
                                onMouseEnter={() => setHoveredProduct(product._id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                    boxShadow: hoveredProduct === product._id 
                                        ? '0 25px 45px rgba(0,0,0,0.1), 0 0 0 2px rgba(231,84,128,0.4)' 
                                        : '0 10px 30px rgba(0,0,0,0.08)',
                                    border: '1px solid #f0e4d8',
                                    transform: hoveredProduct === product._id ? 'translateY(-12px) scale(1.02)' : 'translateY(0)',
                                    animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                                }}
                            >
                                <div style={{
                                    position: 'relative',
                                    height: '280px',
                                    background: '#fefaf5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {product.images && product.images[0] ? (
                                        <img
                                            src={getImageUrl(product.images[0])}
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
                                                e.target.src = 'https://placehold.co/400x400/fefaf5/E75480?text=✨+Resin+Art+✨';
                                            }}
                                        />
                                    ) : (
                                        <div style={{ fontSize: '60px', animation: 'float 3s ease-in-out infinite' }}>✨🎨✨</div>
                                    )}
                                    
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: 'rgba(255,255,255,0.9)',
                                        borderRadius: '50%',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        opacity: hoveredProduct === product._id ? 1 : 0,
                                        transform: hoveredProduct === product._id ? 'scale(1)' : 'scale(0.8)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toast.success('✨ Added to wishlist! ✨');
                                    }}>
                                        <FiHeart size={16} color="#E75480" />
                                    </div>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product, e);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            bottom: '20px',
                                            right: '20px',
                                            background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                            border: 'none',
                                            borderRadius: '40px',
                                            padding: '10px 24px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: 'white',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(231,84,128,0.3)',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            opacity: hoveredProduct === product._id ? 1 : 0,
                                            transform: hoveredProduct === product._id ? 'translateY(0)' : 'translateY(20px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(231,84,128,0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.3)';
                                        }}
                                    >
                                        <FiShoppingCart size={14} /> Add to Cart
                                    </button>
                                    
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        left: '15px',
                                        background: 'linear-gradient(135deg, #FFB347, #FF6B9D)',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: 'white'
                                    }}>
                                        ✨ HOT ✨
                                    </div>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <p style={{ 
                                        fontSize: '11px', 
                                        color: '#E75480', 
                                        letterSpacing: '1.5px', 
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        fontWeight: '600'
                                    }}>
                                        ✦ {product.category || 'Resin Art'} ✦
                                    </p>
                                    <h3 style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '600', 
                                        marginBottom: '10px', 
                                        color: '#2d1f12',
                                        lineHeight: '1.4'
                                    }}>
                                        {product.name}
                                    </h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '20px', color: '#9a3412', fontWeight: '700' }}>
                                            Rs. {product.price?.toLocaleString()}
                                        </p>
                                        <div style={{ display: 'flex', gap: '3px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} size={12} fill="#FFB347" color="#FFB347" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div style={{ textAlign: 'center', marginTop: '55px', animation: 'fadeInUp 0.6s ease' }}>
                    <Link to="/shop">
                        <button style={{
                            padding: '14px 42px',
                            background: 'transparent',
                            border: '2px solid #9a3412',
                            borderRadius: '60px',
                            color: '#9a3412',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#9a3412';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 20px rgba(154,52,18,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#9a3412';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}>
                            View All Products ✨ <FiArrowRight />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div style={{ 
                background: '#fefaf5',
                padding: '80px 24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #E75480, #FF6B9D, #E75480, transparent)'
                }}></div>
                
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '6px 18px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        color: 'white',
                        borderRadius: '40px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '16px'
                    }}>
                        ✨ Why Us ✨
                    </span>
                    <h2 style={{
                        fontSize: '42px',
                        fontWeight: '700',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '55px'
                    }}>
                        Why Choose ResinArt?
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '45px'
                    }}>
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '24px',
                            padding: '35px 25px',
                            textAlign: 'center',
                            border: '1px solid #f0e4d8',
                            transition: 'all 0.4s ease',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.borderColor = '#E75480';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
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
                                margin: '0 auto 20px',
                                animation: 'float 3s ease-in-out infinite'
                            }}>
                                <span style={{ fontSize: '35px' }}>🎨</span>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#E75480', marginBottom: '12px' }}>
                                Handcrafted with Love
                            </h3>
                            <p style={{ color: '#8b6b58', fontSize: '14px', lineHeight: '1.6' }}>
                                Each piece is uniquely made by skilled artisans with attention to every detail
                            </p>
                        </div>
                        
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '24px',
                            padding: '35px 25px',
                            textAlign: 'center',
                            border: '1px solid #f0e4d8',
                            transition: 'all 0.4s ease',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.borderColor = '#E75480';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
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
                                margin: '0 auto 20px',
                                animation: 'float 3s ease-in-out infinite 0.5s'
                            }}>
                                <span style={{ fontSize: '35px' }}>🌿</span>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#E75480', marginBottom: '12px' }}>
                                Eco-Friendly
                            </h3>
                            <p style={{ color: '#8b6b58', fontSize: '14px', lineHeight: '1.6' }}>
                                Sustainable materials and environmentally conscious practices
                            </p>
                        </div>
                        
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '24px',
                            padding: '35px 25px',
                            textAlign: 'center',
                            border: '1px solid #f0e4d8',
                            transition: 'all 0.4s ease',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.borderColor = '#E75480';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
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
                                margin: '0 auto 20px',
                                animation: 'float 3s ease-in-out infinite 1s'
                            }}>
                                <span style={{ fontSize: '35px' }}>💝</span>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#E75480', marginBottom: '12px' }}>
                                Preserved Memories
                            </h3>
                            <p style={{ color: '#8b6b58', fontSize: '14px', lineHeight: '1.6' }}>
                                Capture your special moments forever in beautiful resin art
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media Connect Section */}
            <div style={{
                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                padding: '70px 24px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '-30px',
                    fontSize: '150px',
                    opacity: 0.1,
                    animation: 'float 6s ease-in-out infinite'
                }}>✨</div>
                <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    right: '-20px',
                    fontSize: '130px',
                    opacity: 0.1,
                    animation: 'floatReverse 5s ease-in-out infinite'
                }}>💖</div>
                
                <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <h2 style={{ 
                        fontSize: '36px', 
                        fontWeight: '700', 
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: 'white',
                        marginBottom: '15px'
                    }}>
                        Connect With US 
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '30px', fontSize: '16px' }}>
                        Follow for daily inspiration, behind-the-scenes, and new collections!
                    </p>
                    
                    <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {/* Instagram */}
                        <a 
                            href="https://www.instagram.com/YOUR_USERNAME" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                background: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#E4405F';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}>
                                <FiInstagram size={35} style={{ color: '#E4405F', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#E4405F'} />
                            </div>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>Instagram</span>
                        </a>
                        
                        {/* TikTok */}
                        <a 
                            href="https://www.tiktok.com/@YOUR_USERNAME" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                background: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000000';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}>
                                <FiGlobe size={35} style={{ color: '#000000', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#000000'} />
                            </div>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>TikTok</span>
                        </a>
                        
                        {/* WhatsApp */}
                        <a 
                            href="https://wa.me/92XXXXXXXXXX" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                background: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#25D366';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}>
                                <FiMessageCircle size={35} style={{ color: '#25D366', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#25D366'} />
                            </div>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                background: '#fefaf5',
                padding: '55px 24px 35px',
                borderTop: '1px solid #f0e4d8'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ fontSize: '45px', marginBottom: '15px', animation: 'float 3s ease-in-out infinite' }}>💖</div>
                        <h3 style={{ 
                            fontSize: '22px', 
                            fontWeight: '700', 
                            background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '10px'
                        }}>
                            ResinArt by Komal Zahra                        </h3>
                        <p style={{ color: '#8b6b58', fontSize: '14px' }}>
                            Handcrafted resin art preserving memories and bringing beauty to your home. 
                        </p>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '30px',
                        marginBottom: '30px',
                        fontSize: '13px'
                    }}>
                        <Link to="/admin/login" style={{ color: '#9a3412', textDecoration: 'none', transition: 'color 0.3s' }}
                            onMouseEnter={(e) => e.target.style.color = '#E75480'}
                            onMouseLeave={(e) => e.target.style.color = '#9a3412'}>
                            👑 Admin Login
                        </Link>
                        <span style={{ color: '#f0e4d8' }}>•</span>
                        <Link to="/seller/login" style={{ color: '#9a3412', textDecoration: 'none', transition: 'color 0.3s' }}
                            onMouseEnter={(e) => e.target.style.color = '#E75480'}
                            onMouseLeave={(e) => e.target.style.color = '#9a3412'}>
                            🛍️ Seller Login
                        </Link>
                    </div>
                    
                    <div style={{
                        paddingTop: '25px',
                        marginTop: '25px',
                        borderTop: '1px solid #f0e4d8',
                        color: '#c9a9a9',
                        fontSize: '12px'
                    }}>
                        <p>© 2024 ResinArt by Komal Zahra. All rights reserved. From Our Hearts to Your Home. </p>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
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
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                }
                
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 0 5px rgba(231,84,128,0.3); }
                    50% { box-shadow: 0 0 20px rgba(231,84,128,0.6); }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;