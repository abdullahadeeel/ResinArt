import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiTruck, FiShield, FiHeart, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';
// ✅ ADDED: persistImage import from Code 2
import { persistImage } from '../../utils/imageUtils.js';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Pakistan'
        }
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (storedCart.length === 0) {
            navigate('/cart');
            return;
        }
        
        setCart(storedCart);
        
        if (storedUser) {
            setUser(storedUser);
            setFormData({
                fullName: storedUser.name || '',
                email: storedUser.email || '',
                phone: storedUser.phone || '',
                address: {
                    street: storedUser.address?.street || '',
                    city: storedUser.address?.city || '',
                    state: storedUser.address?.state || '',
                    zipCode: storedUser.address?.zipCode || '',
                    country: storedUser.address?.country || 'Pakistan'
                }
            });
        }
        
        setLoading(false);
    }, [navigate]);

    const getSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const getTax = () => {
        return 0;
    };

    const getShipping = () => {
        return getSubtotal() > 5000 ? 0 : 200;
    };

    const getTotal = () => {
        return getSubtotal() + getTax() + getShipping();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [field]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('❌ Please login to checkout');
                navigate('/login');
                return;
            }

            // ✅ CHANGED: Using persistImage from Code 2 instead of direct image
            const formattedProducts = await Promise.all(cart.map(async (item) => ({
                productId: item.productId,
                name: item.name,
                image: item.image ? await persistImage(item.image) : '',
                quantity: item.quantity,
                price: item.price,
                isCustom: item.isCustom || false,
                style: item.style || '',
                productType: item.productType || '',
                shape: item.shape || '',
                size: item.size || '',
                finish: item.finish || '',
                theme: item.theme || '',
                colorTheme: item.colorTheme || ''
            })));

            const subtotal = getSubtotal();
            const tax = getTax();
            const shippingFee = getShipping();
            const totalAmount = getTotal();

            const shippingAddress = {
                fullName: formData.fullName,
                address: formData.address.street,
                street: formData.address.street,
                city: formData.address.city,
                state: formData.address.state,
                postalCode: formData.address.zipCode,
                zipCode: formData.address.zipCode,
                country: formData.address.country,
                phone: formData.phone,
                email: formData.email
            };

            const orderData = {
                products: formattedProducts,
                subtotal: subtotal,
                tax: tax,
                shippingFee: shippingFee,
                totalAmount: totalAmount,
                paymentMethod: 'cod',
                shippingAddress: shippingAddress
            };

            console.log('📦 Sending order to backend:', orderData);

            const response = await API.post('/users/orders', orderData);
            
            console.log('✅ Order response:', response.data);
            
            if (response.data.success) {
                localStorage.removeItem('cart');
                toast.success('🎉 Order placed successfully!');
                navigate('/my-orders');
            } else {
                toast.error(response.data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('❌ Checkout error:', error);
            if (error.response) {
                console.error('Server response:', error.response.data);
                toast.error(error.response.data.message || 'Failed to place order');
            } else if (error.request) {
                toast.error('No response from server. Please try again.');
            } else {
                toast.error('Error: ' + error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fefaf5' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '3px solid rgba(231,84,128,0.2)',
                    borderTop: '3px solid #E75480',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            
            {/* Header - Light Mode (Code 1 style) */}
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
                        onClick={() => navigate('/cart')}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
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
                        <FiArrowLeft /> Back to Cart ✨
                    </button>
                </div>
            </header>

            {/* Checkout Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                {/* Page Title */}
                <h1 style={{ 
                    fontSize: '38px', 
                    marginBottom: '32px', 
                    fontFamily: "'Playfair Display', Georgia, serif",
                    background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    ✨ Checkout 
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '35px' }}>
                    
                    {/* Checkout Form - Code 1 Style */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        padding: '40px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid #f0e4d8',
                        animation: 'fadeInUp 0.6s ease'
                    }}>
                        <form onSubmit={handleSubmit}>
                            
                            {/* Shipping Information */}
                            <h2 style={{ 
                                fontSize: '24px', 
                                marginBottom: '28px', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <FiTruck size={24} /> Shipping Information
                            </h2>
                            
                            {/* Full Name */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '700', 
                                    color: '#FF6B9D',
                                    fontSize: '14px'
                                }}>
                                    Full Name ✨
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    style={{
                                        width: '100%',
                                        padding: '14px 20px',
                                        border: '1px solid #f0e4d8',
                                        borderRadius: '50px',
                                        fontSize: '14px',
                                        background: '#fefaf5',
                                        color: '#2D1F12',
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

                            {/* Email */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '700', 
                                    color: '#FF6B9D',
                                    fontSize: '14px'
                                }}>
                                    Email Address 📧
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    style={{
                                        width: '100%',
                                        padding: '14px 20px',
                                        border: '1px solid #f0e4d8',
                                        borderRadius: '50px',
                                        fontSize: '14px',
                                        background: '#fefaf5',
                                        color: '#2D1F12',
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

                            {/* Phone */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '700', 
                                    color: '#FF6B9D',
                                    fontSize: '14px'
                                }}>
                                    Phone Number 📱
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+92 300 1234567"
                                    style={{
                                        width: '100%',
                                        padding: '14px 20px',
                                        border: '1px solid #f0e4d8',
                                        borderRadius: '50px',
                                        fontSize: '14px',
                                        background: '#fefaf5',
                                        color: '#2D1F12',
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

                            {/* Address Section */}
                            <h2 style={{ 
                                fontSize: '24px', 
                                margin: '30px 0 28px 0', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <FiMapPin size={24} /> Delivery Address
                            </h2>

                            {/* Street Address */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '700', 
                                    color: '#FF6B9D',
                                    fontSize: '14px'
                                }}>
                                    Street Address 🏠
                                </label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    required
                                    placeholder="House #, Street, Area"
                                    style={{
                                        width: '100%',
                                        padding: '14px 20px',
                                        border: '1px solid #f0e4d8',
                                        borderRadius: '50px',
                                        fontSize: '14px',
                                        background: '#fefaf5',
                                        color: '#2D1F12',
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

                            {/* City and State */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '10px', 
                                        fontWeight: '700', 
                                        color: '#FF6B9D',
                                        fontSize: '14px'
                                    }}>
                                        City 🏙️
                                    </label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="City name"
                                        style={{
                                            width: '100%',
                                            padding: '14px 20px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
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
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '10px', 
                                        fontWeight: '700', 
                                        color: '#FF6B9D',
                                        fontSize: '14px'
                                    }}>
                                        State/Province 📍
                                    </label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        required
                                        placeholder="State name"
                                        style={{
                                            width: '100%',
                                            padding: '14px 20px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
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
                            </div>

                            {/* ZIP and Country */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '10px', 
                                        fontWeight: '700', 
                                        color: '#FF6B9D',
                                        fontSize: '14px'
                                    }}>
                                        ZIP / Postal Code 📮
                                    </label>
                                    <input
                                        type="text"
                                        name="address.zipCode"
                                        value={formData.address.zipCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="12345"
                                        style={{
                                            width: '100%',
                                            padding: '14px 20px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
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
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '10px', 
                                        fontWeight: '700', 
                                        color: '#FF6B9D',
                                        fontSize: '14px'
                                    }}>
                                        Country 🌍
                                    </label>
                                    <input
                                        type="text"
                                        name="address.country"
                                        value={formData.address.country}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '14px 20px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
                                            outline: 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <h2 style={{ 
                                fontSize: '24px', 
                                margin: '30px 0 28px 0', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                💳 Payment Method
                            </h2>
                            
                            <div style={{
                                border: '1px solid #f0e4d8',
                                borderRadius: '24px',
                                padding: '22px',
                                marginBottom: '32px',
                                background: '#fefaf5',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#FF6B9D';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#f0e4d8';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="cod" 
                                        defaultChecked 
                                        style={{ 
                                            accentColor: '#FF6B9D',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer'
                                        }} 
                                    />
                                    <div>
                                        <strong style={{ color: '#FF6B9D', fontSize: '16px' }}> Cash on Delivery (COD)</strong>
                                        <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#8B6B58' }}>
                                            Pay when you receive your order. No advance payment needed! ✨
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Trust Badges */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '25px',
                                marginBottom: '30px',
                                padding: '12px',
                                background: 'rgba(231,84,128,0.05)',
                                borderRadius: '50px',
                                border: '1px solid rgba(231,84,128,0.2)',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{ fontSize: '12px', color: '#8B6B58', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                    <FiShield size={14} color="#FF6B9D" /> Secure
                                </span>
                                <span style={{ fontSize: '12px', color: '#8B6B58', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                    <FiTruck size={14} color="#FF6B9D" /> Fast Shipping
                                </span>
                                <span style={{ fontSize: '12px', color: '#8B6B58', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                    <FiHeart size={14} color="#FF6B9D" /> Handcrafted
                                </span>
                            </div>

                            {/* Place Order Button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: submitting ? '#C9A9A9' : 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '60px',
                                    fontSize: '17px',
                                    fontWeight: '800',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: submitting ? 'none' : '0 4px 15px rgba(231,84,128,0.5)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!submitting) {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(231,84,128,0.7)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!submitting) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                                    }
                                }}
                            >
                                <FiCheckCircle size={20} />
                                {submitting ? 'Placing Order... ✨' : '✨ Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary - Code 1 Style */}
                    <div style={{
                        background: '#FFFFFF',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '28px',
                        padding: '28px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '100px',
                        animation: 'fadeInRight 0.6s ease'
                    }}>
                        <h2 style={{ 
                            fontSize: '24px', 
                            marginBottom: '24px', 
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            📋 Order Summary
                        </h2>
                        
                        {/* Cart Items */}
                        <div style={{ 
                            marginBottom: '20px', 
                            maxHeight: '320px', 
                            overflowY: 'auto',
                            paddingRight: '10px'
                        }}>
                            {cart.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '14px',
                                    fontSize: '14px',
                                    color: '#8B6B58',
                                    paddingBottom: '10px',
                                    borderBottom: '1px dashed #f0e4d8'
                                }}>
                                    <span>✨ {item.name} <span style={{ color: '#FF6B9D' }}>x{item.quantity}</span></span>
                                    <span style={{ fontWeight: '700', color: '#FF6B9D' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div style={{ borderTop: '1px solid #f0e4d8', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#8B6B58' }}>
                                <span>Subtotal</span>
                                <span>Rs. {getSubtotal().toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#8B6B58' }}>
                                <span>Tax (0%)</span>
                                <span>Rs. {getTax().toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#8B6B58' }}>
                                <span>Shipping</span>
                                <span style={{ fontWeight: getShipping() === 0 ? 'bold' : 'normal', color: getShipping() === 0 ? '#10b981' : '#8B6B58' }}>
                                    {getShipping() === 0 ? '✨ Free' : `Rs. ${getShipping().toLocaleString()}`}
                                </span>
                            </div>
                            
                            {/* Free Shipping Progress */}
                            {getSubtotal() < 5000 && getSubtotal() > 0 && (
                                <div style={{
                                    margin: '15px 0',
                                    padding: '10px',
                                    background: 'rgba(231,84,128,0.05)',
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                    border: '1px solid rgba(231,84,128,0.2)'
                                }}>
                                    <p style={{ fontSize: '11px', color: '#FF6B9D', fontWeight: '700' }}>
                                        ✨ Add Rs. {(5000 - getSubtotal()).toLocaleString()} more for FREE Shipping!
                                    </p>
                                </div>
                            )}
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                                paddingTop: '20px',
                                borderTop: '1px dashed #f0e4d8'
                            }}>
                                <span style={{ fontSize: '18px', fontWeight: '800', color: '#2D1F12' }}>Total</span>
                                <span style={{ 
                                    fontSize: '26px', 
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
                    </div>
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
                
                @keyframes glowPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; text-shadow: 0 0 10px rgba(255,107,157,0.3); }
                }
            `}</style>
        </div>
    );
};

export default Checkout;