import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FiShoppingCart, FiHeart, FiArrowRight, FiMail, FiPhone, FiMapPin,
    FiInstagram, FiGlobe, FiMessageCircle, FiStar, FiStar as FiStarOutline
} from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://placehold.co/100x100/fefaf5/FF6B9D?text=✨+Product+✨';
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

const Home = () => {
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchReviews();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await API.get('/products');
            if (response.data.success) {
                setProducts(response.data.data);
                setFeaturedProducts(response.data.data.slice(0, 8));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch real reviews from database
    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const response = await API.get('/reviews');
            if (response.data.success) {
                setReviews(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setReviewsLoading(false);
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
        toast.success(` ${product.name} added to cart! `);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FiStar
                key={i}
                size={16}
                fill={i < rating ? "#FFB347" : "none"}
                color="#FFB347"
                style={{ marginRight: '2px' }}
            />
        ));
    };

    // Fallback products for display
    const fallbackProducts = [
        { _id: 1, name: '🌸 Gajra Coaster', price: 2600, category: 'Coasters', images: [], inStock: true },
        { _id: 2, name: '✨ Customised Resin Plaque', price: 1700, category: 'Plaques', images: [], inStock: true },
        { _id: 3, name: '🏺 Resin Jar', price: 2800, category: 'Home Decor', images: [], inStock: true },
        { _id: 4, name: '💎 Cuff Links | Resin', price: 1800, category: 'Jewelry', images: [], inStock: true },
        { _id: 5, name: '🌹 Rose Trinket', price: 2400, category: 'Trinkets', images: [], inStock: true },
        { _id: 6, name: '💖 Rose Jhumka', price: 3000, category: 'Jewelry', images: [], inStock: false },
        { _id: 7, name: '🎀 Rose Plaque', price: 3400, category: 'Plaques', images: [], inStock: false },
        { _id: 8, name: '🦋 Rose Petals Trinket Tray', price: 3000, category: 'Trays', images: [], inStock: false },
    ];

    const displayProducts = featuredProducts.length > 0 ? featuredProducts : fallbackProducts;

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            
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
                    background: 'radial-gradient(circle, rgba(231,84,128,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'pulse 4s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '5%',
                    width: '250px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(255,107,157,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'pulse 5s ease-in-out infinite'
                }}></div>
                
                {[...Array(8)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        fontSize: `${Math.random() * 20 + 10}px`,
                        opacity: 0.3,
                        animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite`,
                        pointerEvents: 'none'
                    }}>
                        ✨
                    </div>
                ))}
                
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', width: '100%' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '8px 24px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '13px',
                        marginBottom: '32px',
                        letterSpacing: '1px',
                        fontWeight: '700',
                        boxShadow: '0 4px 15px rgba(231,84,128,0.3)',
                        animation: 'glowPulse 2s ease-in-out infinite'
                    }}>
                         From Our Hearts to Your Home 
                    </span>
                    
                    <h1 style={{
                        fontSize: '72px',
                        fontWeight: '800',
                        marginBottom: '20px',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347, #FF6B9D)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        textShadow: 'none',
                        letterSpacing: '-0.5px'
                    }}>
                        Artistry Defined!
                    </h1>
                    
                    <p style={{
                        fontSize: '18px',
                        maxWidth: '600px',
                        margin: '0 auto 36px',
                        lineHeight: '1.8',
                        color: '#FFFFFF',
                        fontWeight: '700',
                        textShadow: '2px 2px 6px rgba(0,0,0,0.5)'
                    }}>
                        Handcrafted resin art that captures beauty, preserves memories, 
                        and brings elegance to your everyday life. 
                    </p>
                    
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
                            boxShadow: '0 8px 25px rgba(231,84,128,0.4)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(231,84,128,0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(231,84,128,0.4)';
                        }}>
                            Shop Now <FiArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Featured Products Section */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '55px' }}>
                    <h2 style={{ 
                        fontSize: '42px', 
                        fontWeight: '800', 
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '12px'
                    }}>
                         Featured Products 
                    </h2>
                    <p style={{ color: '#8B6B58', fontSize: '16px', fontWeight: '500' }}>
                        Discover our handcrafted collection made with love 
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '3px solid rgba(231,84,128,0.2)',
                            borderTop: '3px solid #FF6B9D',
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
                        {displayProducts.map((product, index) => {
                            const isSoldOut = product.stock === 0 || product.inStock === false;
                            const productId = product._id || product.id;
                            const productName = product.name || '';
                            const productPrice = product.price || 0;
                            const productCategory = product.category || 'Resin Art';
                            const productImage = product.images?.[0];
                            
                            return (
                                <div
                                    key={productId}
                                    onClick={() => navigate(`/product/${productId}`)}
                                    style={{
                                        background: '#FFFFFF',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                        border: '1px solid #f0e4d8',
                                        animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-12px)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                                        e.currentTarget.style.borderColor = '#FF6B9D';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                                        e.currentTarget.style.borderColor = '#f0e4d8';
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
                                        {productImage ? (
                                            <img
                                                src={getImageUrl(productImage)}
                                                alt={productName}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.6s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                onError={(e) => {
                                                    e.target.src = 'https://placehold.co/400x400/fefaf5/FF6B9D?text=✨+Resin+Art+✨';
                                                }}
                                            />
                                        ) : (
                                            <div style={{ fontSize: '60px', animation: 'float 3s ease-in-out infinite' }}></div>
                                        )}
                                        
                                        {isSoldOut && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '15px',
                                                right: '15px',
                                                background: '#C9A9A9',
                                                color: 'white',
                                                padding: '5px 12px',
                                                borderRadius: '30px',
                                                fontSize: '11px',
                                                fontWeight: '700'
                                            }}>
                                                Sold Out 
                                            </div>
                                        )}
                                        
                                        {!isSoldOut && (
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
                                                    fontWeight: '700',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 15px rgba(231,84,128,0.3)',
                                                    transition: 'all 0.3s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(231,84,128,0.5)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.3)';
                                                }}
                                            >
                                                <FiShoppingCart size={14} /> Add to Cart
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ padding: '20px' }}>
                                        <p style={{ 
                                            fontSize: '11px', 
                                            color: '#FF6B9D', 
                                            letterSpacing: '1.5px', 
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            fontWeight: '700'
                                        }}>
                                            ✦ {productCategory} ✦
                                        </p>
                                        <h3 style={{ 
                                            fontSize: '16px', 
                                            fontWeight: '700', 
                                            marginBottom: '10px', 
                                            color: '#2D1F12',
                                            lineHeight: '1.4'
                                        }}>
                                            {productName}
                                        </h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontSize: '20px', color: '#FF6B9D', fontWeight: '800' }}>
                                                Rs. {productPrice.toLocaleString()}
                                            </p>
                                            {isSoldOut ? (
                                                <span style={{ fontSize: '11px', color: '#8B6B58' }}>Out of Stock </span>
                                            ) : (
                                                <div style={{ display: 'flex', gap: '3px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar key={i} size={12} fill="#FFB347" color="#FFB347" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Customer Reviews Section - NOW FETCHING FROM DATABASE */}
            <div style={{
                background: '#FFFFFF',
                padding: '80px 24px',
                position: 'relative',
                overflow: 'hidden',
                borderTop: '1px solid #f0e4d8',
                borderBottom: '1px solid #f0e4d8'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '-30px',
                    fontSize: '150px',
                    opacity: 0.03,
                    animation: 'float 6s ease-in-out infinite'
                }}>💕</div>
                <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    right: '-20px',
                    fontSize: '130px',
                    opacity: 0.03,
                    animation: 'floatReverse 5s ease-in-out infinite'
                }}>✨</div>
                
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
                             Happy Customers 
                        </span>
                        <h2 style={{ 
                            fontSize: '42px', 
                            fontWeight: '800', 
                            fontFamily: "'Playfair Display', Georgia, serif",
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '12px'
                        }}>
                            What Our Customers Say 
                        </h2>
                        <p style={{ color: '#8B6B58', fontSize: '16px' }}>
                            Real stories from real customers who love their resin art
                        </p>
                    </div>
                    
                    {reviewsLoading ? (
                        <div style={{ textAlign: 'center', padding: '60px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                border: '3px solid rgba(231,84,128,0.2)',
                                borderTop: '3px solid #FF6B9D',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto'
                            }}></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: '30px'
                        }}>
                            {reviews.map((review, index) => (
                                <div
                                    key={review._id}
                                    style={{
                                        background: '#FFFFFF',
                                        borderRadius: '24px',
                                        padding: '28px',
                                        border: '1px solid #f0e4d8',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        transition: 'all 0.4s ease',
                                        animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.borderColor = '#FF6B9D';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    {/* Star Rating */}
                                    <div style={{ display: 'flex', gap: '3px', marginBottom: '15px' }}>
                                        {renderStars(review.rating)}
                                    </div>
                                    
                                    {/* Review Text */}
                                    <p style={{ 
                                        color: '#8B6B58', 
                                        fontSize: '15px', 
                                        lineHeight: '1.7', 
                                        marginBottom: '20px',
                                        fontStyle: 'italic'
                                    }}>
                                        "{review.comment}"
                                    </p>
                                    
                                    {/* Customer Name & Location */}
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        borderTop: '1px solid #f0e4d8',
                                        paddingTop: '15px'
                                    }}>
                                        <div>
                                            <h4 style={{ 
                                                color: '#FF6B9D', 
                                                fontSize: '16px', 
                                                fontWeight: '700', 
                                                margin: 0 
                                            }}>
                                                {review.userName}
                                            </h4>
                                            <p style={{ 
                                                color: '#8B6B58', 
                                                fontSize: '12px', 
                                                margin: '5px 0 0 0' 
                                            }}>
                                                {review.userLocation || 'Pakistan'}
                                            </p>
                                        </div>
                                        <span style={{ 
                                            fontSize: '11px', 
                                            color: '#8B6B58',
                                            background: '#fefaf5',
                                            padding: '4px 10px',
                                            borderRadius: '20px'
                                        }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#8B6B58' }}>
                            No reviews yet. Be the first to leave a review! 
                        </div>
                    )}
                    
                    {/* Trust Badge */}
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', color: '#8B6B58' }}>
                                ⭐⭐⭐⭐⭐ 5 Star Rating
                            </span>
                            <span style={{ color: '#f0e4d8' }}>•</span>
                            <span style={{ fontSize: '13px', color: '#8B6B58' }}>
                                💬 {reviews.length} Happy Customers
                            </span>
                            <span style={{ color: '#f0e4d8' }}>•</span>
                            <span style={{ fontSize: '13px', color: '#8B6B58' }}>
                                 Pakistan's Premier Resin Artist
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Light Mode */}
            <footer style={{
                background: '#fefaf5',
                padding: '55px 24px 35px',
                borderTop: '1px solid #f0e4d8'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '45px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '28px', animation: 'glowPulse 2s ease-in-out infinite' }}></span>
                            <h3 style={{ 
                                fontSize: '20px', 
                                fontWeight: '800', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>ResinArt</h3>
                        </div>
                        <p style={{ color: '#8B6B58', fontSize: '14px', lineHeight: '1.7' }}>
                            Handcrafted resin art preserving memories and bringing beauty to your home. 
                        </p>
                        <div style={{ display: 'flex', gap: '18px', marginTop: '25px' }}>
                            <a href="https://www.instagram.com/komalresinartist" target="_blank" rel="noopener noreferrer">
                                <FiInstagram size={22} style={{ color: '#8B6B58', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#E4405F'; e.currentTarget.style.transform = 'scale(1.2) rotate(5deg)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#8B6B58'; e.currentTarget.style.transform = 'scale(1) rotate(0)'; }} />
                            </a>
                            <a href="https://www.tiktok.com/komalresinartist" target="_blank" rel="noopener noreferrer">
                                <FiGlobe size={22} style={{ color: '#8B6B58', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#000000'; e.currentTarget.style.transform = 'scale(1.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#8B6B58'; e.currentTarget.style.transform = 'scale(1)'; }} />
                            </a>
                            <a href="https://wa.me/923103175357" target="_blank" rel="noopener noreferrer">
                                <FiMessageCircle size={22} style={{ color: '#8B6B58', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#25D366'; e.currentTarget.style.transform = 'scale(1.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#8B6B58'; e.currentTarget.style.transform = 'scale(1)'; }} />
                            </a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '22px', color: '#FF6B9D' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/shop" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#FF6B9D'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Shop All
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/customize" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#FF6B9D'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Custom Orders
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/about" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#FF6B9D'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ About Us
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/blog" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#FF6B9D'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '22px', color: '#FF6B9D' }}>Policies</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/shipping" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#FF6B9D'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Shipping Info
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/returns" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#FF6B9D'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Returns & Exchanges
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/privacy" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#FF6B9D'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Privacy Policy
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/terms" style={{ color: '#8B6B58', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.target.style.color = '#FF6B9D'; e.target.style.paddingLeft = '5px'; }}
                                    onMouseLeave={(e) => { e.target.style.color = '#8B6B58'; e.target.style.paddingLeft = '0'; }}>
                                    ✦ Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '22px', color: '#FF6B9D' }}>Contact Us</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <FiMail style={{ color: '#FF6B9D' }} />
                            <span style={{ color: '#8B6B58', fontSize: '14px' }}>info@resinart.com</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <FiPhone style={{ color: '#FF6B9D' }} />
                            <span style={{ color: '#8B6B58', fontSize: '14px' }}>+92 300 1234567</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FiMapPin style={{ color: '#FF6B9D' }} />
                            <span style={{ color: '#8B6B58', fontSize: '14px' }}>Jhelum, Pakistan 🇵🇰</span>
                        </div>
                    </div>
                </div>
                <div style={{
                    textAlign: 'center',
                    paddingTop: '40px',
                    marginTop: '40px',
                    borderTop: '1px solid #f0e4d8',
                    color: '#8B6B58',
                    fontSize: '12px'
                }}>
                    <p>© 2024 ResinArt by Komal Zahra. All rights reserved. Made with  From Our Hearts to Your Home.</p>
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
                        transform: translateY(30px);
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
                
                @keyframes glowPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.2); opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

export default Home;