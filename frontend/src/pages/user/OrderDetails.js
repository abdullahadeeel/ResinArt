import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiMapPin, FiCreditCard, FiHeart, FiStar } from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(' Please login first ');
                navigate('/login');
                return;
            }
            
            const response = await API.get(`/users/orders/${id}`);
            
            // ✅ Backend returns { success: true, order: {...} }
            if (response.data.success) {
                setOrder(response.data.order);
            } else {
                toast.error(response.data.message || ' Order not found ');
                navigate('/my-orders');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            if (error.response?.status === 403) {
                toast.error('You are not authorized to view this order ');
            } else if (error.response?.status === 404) {
                toast.error(' Order not found ');
            } else {
                toast.error('Failed to load order details ');
            }
            navigate('/my-orders');
        } finally {
            setLoading(false);
        }
    };

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
    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: '#fefaf5', color: '#FFB347', icon: <FiClock size={16} />, label: 'Pending' },
            processing: { bg: '#fefaf5', color: '#FF6B9D', icon: <FiPackage size={16} />, label: 'Processing' },
            shipped: { bg: '#fefaf5', color: '#10b981', icon: <FiTruck size={16} />, label: 'Shipped' },
            delivered: { bg: '#fefaf5', color: '#10b981', icon: <FiCheckCircle size={16} />, label: 'Delivered' },
            cancelled: { bg: '#fefaf5', color: '#E75480', icon: <FiXCircle size={16} />, label: 'Cancelled' }
        };
        const style = styles[status] || styles.pending;
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '40px',
                background: '#FFFFFF',
                color: style.color,
                fontSize: '14px',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: `1px solid ${style.color}30`
            }}>
                {style.icon}
                {style.label}
            </span>
        );
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

    if (!order) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                <button
                    onClick={() => navigate('/my-orders')}
                    style={{
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
                    }}
                >
                    <FiArrowLeft />  Back to Orders 
                </button>

                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '28px',
                    padding: '28px',
                    border: '1px solid #f0e4d8',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    marginBottom: '30px',
                    animation: 'fadeInUp 0.6s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ 
                                fontSize: '28px', 
                                fontWeight: '800', 
                                fontFamily: "'Playfair Display', Georgia, serif",
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                marginBottom: '8px' 
                            }}>
                                 Order #{order.orderNumber || order._id?.slice(-6)}
                            </h1>
                            <p style={{ color: '#8B6B58', fontSize: '14px', fontWeight: '500' }}>
                                 Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        {getStatusBadge(order.orderStatus)}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        padding: '28px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        animation: 'fadeInUp 0.7s ease'
                    }}>
                        <h2 style={{ 
                            fontSize: '22px', 
                            fontWeight: '800', 
                            marginBottom: '24px', 
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <FiPackage /> Order Items
                        </h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {(order.products || []).map((item, idx) => {
                                // ✅ Handle both 'productId' and 'product' field names
                                const productId = item.productId || item.product;
                                const productName = item.name || (item.productId?.name) || 'Resin Art Product';
                                const productImage = item.image || (item.productId?.images?.[0]) || '';
                                const quantity = item.quantity || 1;
                                const price = item.price || 0;
                                
                                return (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        gap: '20px',
                                        padding: '16px',
                                        paddingBottom: '16px',
                                        background: '#fefaf5',
                                        borderRadius: '20px',
                                        border: '1px solid #f0e4d8',
                                        transition: 'all 0.3s ease',
                                        marginBottom: idx !== order.products.length - 1 ? '16px' : '0'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                        e.currentTarget.style.borderColor = '#FF6B9D';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                        <img
                                            src={getImageUrl(productImage)}
                                            alt={productName}
                                            style={{
                                                width: '85px',
                                                height: '85px',
                                                objectFit: 'cover',
                                                borderRadius: '16px',
                                                background: '#FFFFFF',
                                                border: '1px solid #f0e4d8'
                                            }}
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/85x85/fefaf5/FF6B9D?text=✨+Art+✨';
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#2D1F12' }}>
                                                {productName}
                                            </h3>
                                            <p style={{ fontSize: '13px', color: '#8B6B58', marginBottom: '6px' }}>
                                                 Quantity: {quantity}
                                            </p>
                                            <p style={{ fontSize: '15px', color: '#FF6B9D', fontWeight: '700' }}>
                                                Rs. {price?.toLocaleString()} each
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '18px', fontWeight: '800', color: '#FF6B9D' }}>
                                                Rs. {(price * quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{
                            marginTop: '24px',
                            paddingTop: '20px',
                            borderTop: '1px dashed #f0e4d8',
                            textAlign: 'right'
                        }}>
                            <p style={{ fontSize: '14px', color: '#8B6B58', marginBottom: '8px' }}>
                                Subtotal: <span style={{ fontWeight: '700', color: '#2D1F12' }}>Rs. {order.subtotal?.toLocaleString()}</span>
                            </p>
                            <p style={{ fontSize: '14px', color: '#8B6B58', marginBottom: '8px' }}>
                                Shipping: <span style={{ fontWeight: '700', color: order.shippingFee === 0 ? '#10b981' : '#8B6B58' }}>
                                    {order.shippingFee === 0 ? ' Free ' : `Rs. ${order.shippingFee?.toLocaleString()}`}
                                </span>
                            </p>
                            {order.shippingFee === 0 && order.subtotal > 0 && (
                                <p style={{ fontSize: '12px', color: '#10b981', marginBottom: '8px', fontWeight: '700' }}>
                                     Free Shipping Applied! 
                                </p>
                            )}
                            <div style={{
                                marginTop: '12px',
                                paddingTop: '12px',
                                borderTop: '1px solid #f0e4d8'
                            }}>
                                <p style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, #FF6B9D, #FFB347)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                                    Total: Rs. {order.totalAmount?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        
                        <div style={{
                            background: '#FFFFFF',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '28px',
                            padding: '28px',
                            border: '1px solid #f0e4d8',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            animation: 'fadeInUp 0.8s ease'
                        }}>
                            <h2 style={{ 
                                fontSize: '20px', 
                                fontWeight: '800', 
                                marginBottom: '20px', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FiMapPin /> Shipping Address 
                            </h2>
                            <div style={{ color: '#8B6B58', lineHeight: '1.7', fontSize: '14px' }}>
                                <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '8px', color: '#FF6B9D' }}>
                                    {order.shippingAddress?.fullName || 'Customer'}
                                </p>
                                <p>{order.shippingAddress?.street || 'N/A'}</p>
                                <p>{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'}</p>
                                <p>{order.shippingAddress?.zipCode || 'N/A'}</p>
                                <p>{order.shippingAddress?.country || 'Pakistan'} </p>
                                <p style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span></span> {order.shippingAddress?.phone || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            background: '#FFFFFF',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '28px',
                            padding: '28px',
                            border: '1px solid #f0e4d8',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            animation: 'fadeInUp 0.9s ease'
                        }}>
                            <h2 style={{ 
                                fontSize: '20px', 
                                fontWeight: '800', 
                                marginBottom: '20px', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FiCreditCard /> Payment Information 
                            </h2>
                            <div>
                                <p style={{ marginBottom: '12px', color: '#8B6B58', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span>💵 Method:</span> 
                                    <strong style={{ color: '#FF6B9D' }}>
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                    </strong>
                                </p>
                                <p style={{ color: '#8B6B58', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span>✨ Status:</span> 
                                    <span style={{
                                        padding: '4px 14px',
                                        borderRadius: '30px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        background: order.paymentStatus === 'completed' ? '#D4F1E9' : '#FF6B9D',
                                        color: order.paymentStatus === 'completed' ? '#2d6a4f' : 'white'
                                    }}>
                                        {order.paymentStatus === 'completed' ? ' Completed' : ' Pending'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {order.orderStatus === 'shipped' && (
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: '24px',
                                padding: '20px',
                                textAlign: 'center',
                                border: '1px solid #f0e4d8'
                            }}>
                                <FiTruck size={32} style={{ color: '#FF6B9D', marginBottom: '10px', animation: 'glowPulse 2s ease-in-out infinite' }} />
                                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#FF6B9D', marginBottom: '5px' }}>Your Order is on the Way! </h4>
                                <p style={{ fontSize: '12px', color: '#8B6B58' }}>Track your shipment with the tracking link sent to your email</p>
                            </div>
                        )}

                        <div style={{
                            background: '#FFFFFF',
                            borderRadius: '24px',
                            padding: '20px',
                            textAlign: 'center',
                            border: '1px solid #f0e4d8'
                        }}>
                            <FiHeart size={28} style={{ color: '#FF6B9D', marginBottom: '10px', animation: 'glowPulse 2s ease-in-out infinite' }} />
                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FF6B9D', marginBottom: '5px' }}>Thank You for Shopping! </h4>
                            <p style={{ fontSize: '12px', color: '#8B6B58' }}>We hope you love your Resin Art pieces!</p>
                        </div>
                    </div>
                </div>
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
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};

export default OrderDetails;