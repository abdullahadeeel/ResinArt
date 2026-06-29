import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiFilter, FiGrid, FiStar, FiZap } from 'react-icons/fi';
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

// Category Collection Data - Light Mode with Pink Accents
const categories = [
    { id: 'all', name: 'All', icon: '', count: null },
    { id: 'Trays', name: 'Trays', icon: '', count: null },
    { id: 'Coasters', name: 'Coasters', icon: '', count: null },
    { id: 'Jewelry', name: 'Jewelry', icon: '', count: null },
    { id: 'Nameplates', name: 'Nameplates', icon: '', count: null },
    { id: 'Home Decor', name: 'Home Decor', icon: '', count: null },
    { id: 'Gifts', name: 'Gifts', icon: '', count: null }
];

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [showFilters, setShowFilters] = useState(false);
    const [categoryCounts, setCategoryCounts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await API.get('/products');
            if (response.data.success) {
                setProducts(response.data.data);
                
                // Calculate category counts
                const counts = {};
                categories.forEach(cat => {
                    if (cat.id === 'all') {
                        counts.all = response.data.data.length;
                    } else {
                        counts[cat.id] = response.data.data.filter(p => p.category === cat.id).length;
                    }
                });
                setCategoryCounts(counts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error(' Oops! Failed to load products ');
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
        toast.success(` ${product.name} added to your cart! `);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const filterCategories = ['all', 'Trays', 'Coasters', 'Jewelry', 'Nameplates', 'Home Decor', 'Gifts', 'Other'];

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 product.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === 'all' || product.category === category;
            const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
            return matchesSearch && matchesCategory && matchesPrice;
        })
        .sort((a, b) => {
            if (sortBy === 'price_asc') return a.price - b.price;
            if (sortBy === 'price_desc') return b.price - a.price;
            if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
            if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            
            {/* Hero Banner - Light Mode */}
            <div style={{
                background: '#ecc2d7',
                padding: '60px 24px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '1px solid #f0e4d8'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    fontSize: '120px',
                    opacity: 0.05,
                    animation: 'float 6s ease-in-out infinite'
                }}>🛍️</div>
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-20px',
                    fontSize: '100px',
                    opacity: 0.05,
                    animation: 'floatReverse 5s ease-in-out infinite'
                }}>💖</div>
                
                <h1 style={{ 
                    fontSize: '52px', 
                    fontWeight: '800', 
                    marginBottom: '12px', 
                    fontFamily: "'Playfair Display', Georgia, serif",
                    background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                }}> Shop All Products </h1>
                <p style={{ fontSize: '18px', color: '#8B6B58', fontWeight: '500' }}>
                    Discover our handcrafted collection made with love 
                </p>
            </div>

            {/* Collections Section (Category Cards) - Light Mode */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '50px 24px 30px 24px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '800',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '10px'
                    }}>
                         Shop by Collection 
                    </h2>
                    <p style={{ color: '#8B6B58', fontSize: '15px', fontWeight: '500' }}>
                        Explore our curated collections of handcrafted resin art
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '24px'
                }}>
                    {categories.map((cat, index) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            style={{
                                background: category === cat.id 
                                    ? 'linear-gradient(135deg, #E75480, #FF6B9D)' 
                                    : '#FFFFFF',
                                border: category === cat.id ? 'none' : '1px solid #f0e4d8',
                                borderRadius: '24px',
                                padding: '24px 12px',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                textAlign: 'center',
                                boxShadow: category === cat.id 
                                    ? '0 10px 25px rgba(231,84,128,0.3)' 
                                    : '0 4px 15px rgba(0,0,0,0.05)',
                                animation: `fadeInUp 0.5s ease ${index * 0.05}s both`
                            }}
                            onMouseEnter={(e) => {
                                if (category !== cat.id) {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                } else {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (category !== cat.id) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.borderColor = '#f0e4d8';
                                } else {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <div style={{ 
                                fontSize: '38px', 
                                marginBottom: '12px',
                                animation: category === cat.id ? 'glowPulse 2s ease-in-out infinite' : 'none'
                            }}>{cat.icon}</div>
                            <h3 style={{
                                fontSize: '17px',
                                fontWeight: '700',
                                color: category === cat.id ? 'white' : '#2D1F12',
                                marginBottom: '6px'
                            }}>
                                {cat.name}
                            </h3>
                            <p style={{
                                fontSize: '12px',
                                color: category === cat.id ? 'rgba(255,255,255,0.85)' : '#8B6B58'
                            }}>
                                {categoryCounts[cat.id] || 0} products
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Filter Bar - Light Mode */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '20px 24px 0 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', flex: 1, maxWidth: '450px' }}>
                    <FiSearch style={{
                        position: 'absolute',
                        left: '18px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#FF6B9D'
                    }} />
                    <input
                        type="text"
                        placeholder="🔍 Search for resin art, trays, coasters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 18px 14px 48px',
                            borderRadius: '50px',
                            border: '1px solid #f0e4d8',
                            backgroundColor: '#FFFFFF',
                            color: '#2D1F12',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#FF6B9D';
                            e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#f0e4d8';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Filter and Sort Buttons */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 24px',
                            background: showFilters 
                                ? 'linear-gradient(135deg, #E75480, #FF6B9D)' 
                                : '#FFFFFF',
                            color: showFilters ? 'white' : '#FF6B9D',
                            border: showFilters ? 'none' : '1px solid #f0e4d8',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '700',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (!showFilters) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = '#FF6B9D';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!showFilters) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#f0e4d8';
                            }
                        }}
                    >
                        <FiFilter size={16} />
                        {showFilters ? ' Hide Filters ' : 'Filters'}
                    </button>
                    
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '12px 20px',
                            border: '1px solid #f0e4d8',
                            borderRadius: '50px',
                            backgroundColor: '#FFFFFF',
                            fontSize: '14px',
                            color: '#FF6B9D',
                            fontWeight: '600',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#FF6B9D';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#f0e4d8';
                        }}
                    >
                        <option value="newest"> Newest First</option>
                        <option value="price_asc"> Price: Low to High</option>
                        <option value="price_desc"> Price: High to Low</option>
                        <option value="name_asc"> Name: A to Z</option>
                        <option value="name_desc"> Name: Z to A</option>
                    </select>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                
                {/* Filters Sidebar - Light Mode */}
                {showFilters && (
                    <div style={{
                        width: '300px',
                        background: '#FFFFFF',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '28px',
                        padding: '28px',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '100px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        animation: 'fadeInRight 0.4s ease'
                    }}>
                        <h3 style={{ 
                            fontSize: '22px', 
                            marginBottom: '24px', 
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: '800'
                        }}> Filters </h3>
                        
                        {/* Categories Section */}
                        <div style={{ marginBottom: '28px' }}>
                            <h4 style={{ marginBottom: '16px', fontSize: '15px', color: '#FF6B9D', fontWeight: '700' }}>Categories</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {filterCategories.map(cat => (
                                    <label 
                                        key={cat} 
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '12px',
                                            cursor: 'pointer',
                                            padding: '6px 0',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.paddingLeft = '8px';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.paddingLeft = '0';
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={category === cat}
                                            onChange={() => setCategory(cat)}
                                            style={{ 
                                                accentColor: '#FF6B9D',
                                                width: '18px',
                                                height: '18px',
                                                margin: 0,
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <span style={{ fontSize: '14px', color: '#8B6B58', fontWeight: '500' }}>
                                            {cat === 'all' ? ' All Products ' : cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Section */}
                        <div style={{ marginBottom: '28px' }}>
                            <h4 style={{ marginBottom: '16px', fontSize: '15px', color: '#FF6B9D', fontWeight: '700' }}>Price Range</h4>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px 14px', 
                                        border: '1px solid #f0e4d8', 
                                        borderRadius: '50px', 
                                        backgroundColor: '#fefaf5',
                                        color: '#2D1F12',
                                        fontSize: '13px',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#FF6B9D';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#f0e4d8';
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px 14px', 
                                        border: '1px solid #f0e4d8', 
                                        borderRadius: '50px', 
                                        backgroundColor: '#fefaf5',
                                        color: '#2D1F12',
                                        fontSize: '13px',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#FF6B9D';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#f0e4d8';
                                    }}
                                />
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                style={{ 
                                    width: '100%', 
                                    accentColor: '#FF6B9D',
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <span style={{ fontSize: '11px', color: '#8B6B58' }}>Rs. 0</span>
                                <span style={{ fontSize: '11px', color: '#8B6B58' }}>Rs. 10,000+</span>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        <button
                            onClick={() => {
                                setCategory('all');
                                setPriceRange({ min: 0, max: 10000 });
                                setSortBy('newest');
                                setSearchTerm('');
                            }}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#FFFFFF',
                                border: '1px solid #f0e4d8',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                color: '#FF6B9D',
                                fontSize: '14px',
                                fontWeight: '700',
                                transition: 'all 0.3s ease',
                                marginTop: '12px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = '#FF6B9D';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#f0e4d8';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                             Clear All Filters 
                        </button>
                    </div>
                )}

                {/* Products Grid */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '10px' }}>
                        <p style={{ color: '#FF6B9D', fontSize: '15px', fontWeight: '600' }}>
                             {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found 
                        </p>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                border: '3px solid rgba(231,84,128,0.2)',
                                borderTop: '3px solid #FF6B9D',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '80px', 
                            background: '#FFFFFF', 
                            borderRadius: '32px', 
                            border: '1px solid #f0e4d8',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ fontSize: '60px', marginBottom: '20px', animation: 'glowPulse 2s ease-in-out infinite' }}></div>
                            <p style={{ color: '#8B6B58', fontSize: '18px', marginBottom: '20px', fontWeight: '500' }}>No products found</p>
                            <button
                                onClick={() => {
                                    setCategory('all');
                                    setPriceRange({ min: 0, max: 10000 });
                                    setSortBy('newest');
                                    setSearchTerm('');
                                }}
                                style={{
                                    padding: '12px 32px',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(231,84,128,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                 Clear Filters 
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '32px'
                        }}>
                            {filteredProducts.map((product, index) => {
                                const isSoldOut = product.stock === 0 || product.inStock === false;
                                const sellerName = product.sellerName || product.seller?.name || 'ResinArt';
                                
                                return (
                                    <div
                                        key={product._id}
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        style={{
                                            background: '#FFFFFF',
                                            borderRadius: '24px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                            border: '1px solid #f0e4d8',
                                            animation: `fadeInUp 0.6s ease ${index * 0.05}s both`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-10px)';
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
                                            {product.images && product.images[0] ? (
                                                <img
                                                    src={getImageUrl(product.images[0])}
                                                    alt={product.name}
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
                                                    padding: '5px 14px',
                                                    borderRadius: '30px',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
                                                        boxShadow: '0 4px 15px rgba(231,84,128,0.4)',
                                                        transition: 'all 0.3s ease',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(231,84,128,0.6)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.4)';
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
                                                ✦ {product.category || 'Resin Art'} ✦
                                            </p>
                                            <h3 style={{ 
                                                fontSize: '16px', 
                                                fontWeight: '700', 
                                                marginBottom: '8px', 
                                                color: '#2D1F12',
                                                lineHeight: '1.4'
                                            }}>
                                                {product.name}
                                            </h3>
                                            <p style={{
                                                fontSize: '11px',
                                                color: '#8B6B58',
                                                marginBottom: '10px'
                                            }}>
                                                👩 Vendor: {sellerName}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <p style={{ fontSize: '20px', color: '#FF6B9D', fontWeight: '800' }}>
                                                    Rs. {product.price?.toLocaleString()}
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
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
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
                    50% { opacity: 0.7; text-shadow: 0 0 10px rgba(255,107,157,0.3); }
                }
            `}</style>
        </div>
    );
};

export default Shop;