import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiMinus, FiPlus, FiStar, FiTruck, FiShield, FiZap } from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';
import Reviews from '../../components/ProductReviews';

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

// Helper function to render stars - Light Mode with Pink Accents
const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {[...Array(fullStars)].map((_, i) => (
                <FiStar key={`full-${i}`} fill="#FFB347" color="#FFB347" size={18} strokeWidth={1.5} />
            ))}
            {hasHalfStar && (
                <FiStar key="half" fill="#FFB347" color="#FFB347" size={18} style={{ opacity: 0.5 }} strokeWidth={1.5} />
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <FiStar key={`empty-${i}`} fill="none" color="#8B6B58" size={18} strokeWidth={1.5} />
            ))}
        </div>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });

    useEffect(() => {
        fetchProduct();
        fetchReviewStats();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/products/${id}`);
            if (response.data.success) {
                setProduct(response.data.data);
            } else {
                toast.error(' Product not found ');
                navigate('/shop');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error(' Failed to load product ');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviewStats = async () => {
        try {
            const response = await API.get(`/reviews/product/${id}?limit=1`);
            if (response.data.success) {
                setReviewStats({
                    averageRating: response.data.stats.averageRating || 0,
                    totalReviews: response.data.stats.totalReviews || 0
                });
            }
        } catch (error) {
            console.error('Error fetching review stats:', error);
        }
    };

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.productId === product._id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: getImageUrl(product.images?.[0]) || '',
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success(` ${quantity} x ${product.name} added to cart! `);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const addToWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(' Please login to add to wishlist ');
                navigate('/login');
                return;
            }
            
            await API.post(`/users/wishlist/${product._id}`);
            toast.success(' Added to wishlist! ');
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error(' Failed to add to wishlist');
        }
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

    if (!product) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            
            {/* Header - Light Mode */}
            <header style={{
                background: '#FFFFFF',
                backdropFilter: 'blur(12px)',
                padding: '18px 32px',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                borderBottom: '1px solid #f0e4d8'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '28px', animation: 'glowPulse 2s ease-in-out infinite' }}>✨</span>
                            <h1 style={{ 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                fontSize: '26px', 
                                margin: 0, 
                                fontWeight: '800',
                                fontFamily: "'Playfair Display', Georgia, serif"
                            }}>ResinArt</h1>
                        </div>
                    </Link>
                    <button
                        onClick={() => navigate('/shop')}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: '#FF6B9D',
                            fontSize: '15px',
                            fontWeight: '700',
                            padding: '10px 20px',
                            borderRadius: '40px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#E75480';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateX(-3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#FF6B9D';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}
                    >
                        <FiArrowLeft />  Back to Shop 
                    </button>
                </div>
            </header>

            {/* Product Details */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 24px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '55px',
                    background: '#FFFFFF',
                    borderRadius: '32px',
                    padding: '40px',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                    border: '1px solid #f0e4d8',
                    animation: 'fadeInUp 0.6s ease'
                }}>
                    
                    {/* Product Images Section */}
                    <div>
                        <div style={{
                            height: '450px',
                            background: '#fefaf5',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            marginBottom: '20px',
                            position: 'relative'
                        }}>
                            {product.images && product.images[selectedImage] ? (
                                <img
                                    src={getImageUrl(product.images[selectedImage])}
                                    alt={product.name}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/600x600/fefaf5/FF6B9D?text=✨+Resin+Art+✨';
                                    }}
                                />
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    fontSize: '70px',
                                    color: '#FF6B9D',
                                    animation: 'glowPulse 3s ease-in-out infinite'
                                }}>
                                    
                                </div>
                            )}
                        </div>
                        
                        {/* Thumbnail Images */}
                        {product.images && product.images.length > 1 && (
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        style={{
                                            width: '85px',
                                            height: '85px',
                                            background: '#fefaf5',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: selectedImage === idx ? '3px solid #FF6B9D' : '1px solid #f0e4d8',
                                            transition: 'all 0.3s ease',
                                            boxShadow: selectedImage === idx ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedImage !== idx) {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                e.currentTarget.style.borderColor = '#FF6B9D';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedImage !== idx) {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.borderColor = '#f0e4d8';
                                            }
                                        }}
                                    >
                                        <img 
                                            src={getImageUrl(img)} 
                                            alt="" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section - Light Mode */}
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{
                                display: 'inline-block',
                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                padding: '8px 18px',
                                borderRadius: '40px',
                                fontSize: '12px',
                                fontWeight: '800',
                                color: 'white',
                                letterSpacing: '0.5px'
                            }}>
                                Handcrafted with Love 
                            </span>
                        </div>
                        
                        <h1 style={{ 
                            fontSize: '36px', 
                            marginBottom: '16px', 
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: '800',
                            fontFamily: "'Playfair Display', Georgia, serif",
                            lineHeight: '1.2'
                        }}>{product.name}</h1>
                        
                        {/* Rating Display */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
                            {renderStars(reviewStats.averageRating || product.averageRating || 0)}
                            <span style={{ fontSize: '14px', color: '#8B6B58', fontWeight: '500' }}>
                                {reviewStats.totalReviews || product.totalReviews || 0}  reviews
                            </span>
                        </div>
                        
                        {/* Price */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'baseline', 
                            gap: '12px', 
                            marginBottom: '28px',
                            padding: '12px 0',
                            borderTop: '1px solid #f0e4d8',
                            borderBottom: '1px solid #f0e4d8'
                        }}>
                            <span style={{ 
                                fontSize: '38px', 
                                fontWeight: '800', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>
                                Rs. {product.price?.toLocaleString()}
                            </span>
                            {product.oldPrice && (
                                <span style={{ 
                                    fontSize: '20px', 
                                    color: '#8B6B58', 
                                    textDecoration: 'line-through',
                                    fontWeight: '500'
                                }}>
                                    Rs. {product.oldPrice?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '28px' }}>
                            <h3 style={{ 
                                fontSize: '18px', 
                                marginBottom: '12px', 
                                color: '#FF6B9D', 
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span></span> Description
                            </h3>
                            <p style={{ color: '#8B6B58', lineHeight: '1.7', fontSize: '15px' }}>{product.description}</p>
                        </div>

                        {/* Category */}
                        <div style={{ marginBottom: '28px' }}>
                            <h3 style={{ 
                                fontSize: '16px', 
                                marginBottom: '10px', 
                                color: '#FF6B9D', 
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span></span> Category
                            </h3>
                            <span style={{
                                background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                padding: '8px 20px',
                                borderRadius: '40px',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: 'white',
                                display: 'inline-block'
                            }}>
                                 {product.category} 
                            </span>
                        </div>

                        {/* Stock Status */}
                        <div style={{ marginBottom: '28px' }}>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: product.stock > 0 ? '#10b981' : '#E75480',
                                fontSize: '14px',
                                fontWeight: '700',
                                background: product.stock > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(231,84,128,0.1)',
                                padding: '6px 16px',
                                borderRadius: '40px',
                                border: `1px solid ${product.stock > 0 ? '#10b981' : '#E75480'}40`
                            }}>
                                {product.stock > 0 ? ' In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Quantity Selector */}
                        <div style={{ marginBottom: '35px' }}>
                            <h3 style={{ 
                                fontSize: '16px', 
                                marginBottom: '12px', 
                                color: '#FF6B9D', 
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span></span> Quantity
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{
                                        width: '48px',
                                        height: '48px',
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
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                        e.currentTarget.style.color = '#FF6B9D';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <FiMinus size={20} />
                                </button>
                                <span style={{ 
                                    fontSize: '22px', 
                                    fontWeight: '700', 
                                    width: '50px', 
                                    textAlign: 'center', 
                                    color: '#2D1F12'
                                }}>
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                                    style={{
                                        width: '48px',
                                        height: '48px',
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
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                        e.currentTarget.style.color = '#FF6B9D';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <FiPlus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '25px',
                            marginBottom: '28px',
                            padding: '12px',
                            background: 'rgba(231,84,128,0.05)',
                            borderRadius: '50px',
                            border: '1px solid rgba(231,84,128,0.2)',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ fontSize: '12px', color: '#8B6B58', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                <FiTruck size={14} color="#FF6B9D" /> Free Shipping
                            </span>
                            <span style={{ fontSize: '12px', color: '#8B6B58', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                <FiShield size={14} color="#FF6B9D" /> Secure Checkout
                            </span>
                            <span style={{ fontSize: '12px', color: '#8B6B58', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                <FiHeart size={14} color="#FF6B9D" /> Handcrafted
                            </span>
                        </div>

                        {/* Action Buttons - Light Mode */}
                        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                            <button
                                onClick={addToCart}
                                disabled={product.stock === 0}
                                style={{
                                    flex: 2,
                                    minWidth: '200px',
                                    padding: '16px 32px',
                                    background: product.stock > 0 ? 'linear-gradient(135deg, #E75480, #FF6B9D)' : '#C9A9A9',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '60px',
                                    fontSize: '16px',
                                    fontWeight: '800',
                                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: product.stock > 0 ? '0 4px 15px rgba(231,84,128,0.4)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(231,84,128,0.6)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.4)';
                                    }
                                }}
                            >
                                <FiShoppingCart size={18} /> 
                                {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                            </button>
                            
                            <button
                                onClick={addToWishlist}
                                style={{
                                    flex: 1,
                                    minWidth: '140px',
                                    padding: '16px 28px',
                                    background: 'transparent',
                                    color: '#FF6B9D',
                                    border: '2px solid #FF6B9D',
                                    borderRadius: '60px',
                                    fontSize: '16px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#E75480';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.3)';
                                    e.currentTarget.style.borderColor = '#E75480';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#FF6B9D';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                }}
                            >
                                <FiHeart size={18} /> Wishlist
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div style={{
                            marginTop: '25px',
                            padding: '15px',
                            background: 'rgba(231,84,128,0.05)',
                            borderRadius: '16px',
                            textAlign: 'center',
                            border: '1px solid rgba(231,84,128,0.2)'
                        }}>
                            <FiTruck size={18} style={{ color: '#FF6B9D', marginRight: '8px', verticalAlign: 'middle' }} />
                            <span style={{ fontSize: '12px', color: '#8B6B58', fontWeight: '500' }}>
                                Free shipping on orders over Rs. 5000 | Delivery in 15-18 days
                            </span>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <Reviews productId={id} />
            </div>

            {/* Global Animations */}
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
                
                @keyframes glowPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; text-shadow: 0 0 10px rgba(255,107,157,0.3); }
                }
            `}</style>
        </div>
    );
};

export default ProductDetail;