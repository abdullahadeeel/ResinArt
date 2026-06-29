import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiEye, FiClock, FiCheckCircle, FiTruck, FiMapPin, FiHeart, FiStar, FiZap } from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://placehold.co/100x100/fefaf5/FF6B9D?text=✨';
    }

    const path = String(imagePath).trim();

    // ✅ Puter generated image — blob ya data URL
    if (path.startsWith('data:image')) {
        return path;
    }

    // ✅ Puter image URL — directly return karo
    if (path.startsWith('blob:')) {
        return path;
    }

    // ✅ Koi bhi http URL — directly return karo
    if (path.startsWith('http')) {
        return path;
    }

    // ✅ Local uploads
    if (path.startsWith('/uploads/')) {
        return `http://localhost:5000${path}`;
    }

    return `http://localhost:5000/uploads/${path}`;
};

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(' Please login first ');
                return;
            }
            
            const response = await API.get('/users/orders');
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error(response.data.message || ' Failed to load orders ');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(' Failed to load orders ');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fefaf5', text: '#FFB347', icon: <FiClock size={14} />, label: 'Pending' };
            case 'processing': return { bg: '#fefaf5', text: '#FF6B9D', icon: <FiPackage size={14} />, label: 'Processing' };
            case 'shipped': return { bg: '#fefaf5', text: '#10b981', icon: <FiTruck size={14} />, label: 'Shipped' };
            case 'delivered': return { bg: '#fefaf5', text: '#10b981', icon: <FiCheckCircle size={14} />, label: 'Delivered' };
            default: return { bg: '#fefaf5', text: '#E75480', icon: <FiClock size={14} />, label: 'Pending' };
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Pending',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    };

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
                        <FiPackage /> My Orders 
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '15px', fontWeight: '500' }}>
                        Track and manage your orders 
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
                ) : orders.length === 0 ? (
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
                            <FiPackage size={40} style={{ color: 'white' }} />
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
                            No Orders Yet 
                        </h3>
                        <p style={{ color: '#8B6B58', marginBottom: '28px', fontSize: '15px', fontWeight: '500' }}>
                            You haven't placed any orders yet. Start shopping! 
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
                                 Start Shopping 
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        {orders.map((order, idx) => {
                            const statusStyle = getStatusColor(order.orderStatus || order.status);
                            return (
                                <div
                                    key={order._id}
                                    style={{
                                        background: '#FFFFFF',
                                        borderRadius: '28px',
                                        border: '1px solid #f0e4d8',
                                        overflow: 'hidden',
                                        transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                        animation: `fadeInUp 0.5s ease ${idx * 0.05}s both`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                                        e.currentTarget.style.borderColor = '#FF6B9D';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                    }}
                                >
                                    {/* Order Header - Light Mode */}
                                    <div style={{
                                        padding: '20px 28px',
                                        background: '#fefaf5',
                                        borderBottom: '1px solid #f0e4d8',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '12px'
                                    }}>
                                        <div>
                                            <p style={{ fontSize: '13px', color: '#FF6B9D', marginBottom: '6px', fontWeight: '700', letterSpacing: '1px' }}>
                                                 ORDER #{order.orderNumber}
                                            </p>
                                            <p style={{ fontSize: '13px', color: '#8B6B58' }}>
                                                📅 {new Date(order.createdAt).toLocaleDateString('en-PK')}
                                            </p>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '6px 16px',
                                            background: `#FFFFFF`,
                                            borderRadius: '40px',
                                            color: statusStyle.text,
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            border: `1px solid ${statusStyle.text}30`
                                        }}>
                                            {statusStyle.icon}
                                            <span>{getStatusText(order.orderStatus || order.status)}</span>
                                        </div>
                                    </div>

                                    {/* Order Items - Light Mode */}
                                    <div style={{ padding: '20px 28px' }}>
                                        {order.products && order.products.map((item, itemIdx) => (
                                            <div
                                                key={itemIdx}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '18px',
                                                    padding: '14px 0',
                                                    borderBottom: itemIdx !== order.products.length - 1 ? '1px solid #f0e4d8' : 'none',
                                                    flexWrap: 'wrap'
                                                }}
                                            >
                                                {/* Product Image */}
                                                <img
                                                    src={getImageUrl(item.image || (item.product?.images?.[0]))}
                                                    alt={item.name}
                                                    style={{
                                                        width: '75px',
                                                        height: '75px',
                                                        objectFit: 'cover',
                                                        borderRadius: '16px',
                                                        background: '#fefaf5',
                                                        border: '1px solid #f0e4d8'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/75x75/fefaf5/FF6B9D?text=✨+Art+✨';
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{
                                                        fontSize: '16px',
                                                        fontWeight: '700',
                                                        color: '#2D1F12',
                                                        marginBottom: '6px'
                                                    }}>
                                                        {item.name}
                                                    </h4>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: '#FF6B9D',
                                                        fontWeight: '700'
                                                    }}>
                                                        Rs. {item.price?.toLocaleString()} each
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{
                                                        fontSize: '13px',
                                                        color: '#8B6B58'
                                                    }}>
                                                         Qty: {item.quantity}
                                                    </p>
                                                    <p style={{
                                                        fontSize: '18px',
                                                        fontWeight: '800',
                                                        color: '#FF6B9D'
                                                    }}>
                                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer - Light Mode */}
                                    <div style={{
                                        padding: '16px 28px',
                                        background: '#fefaf5',
                                        borderTop: '1px solid #f0e4d8',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '16px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FiMapPin size={14} style={{ color: '#FF6B9D' }} />
                                            <p style={{ fontSize: '12px', color: '#8B6B58' }}>
                                                {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.address || ''}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <p style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(135deg, #FF6B9D, #FFB347)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                                                Total: Rs. {(order.totalAmount || order.total).toLocaleString()}
                                            </p>
                                            <Link to={`/order-details/${order._id}`}>
                                                <button style={{
                                                    padding: '10px 24px',
                                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                                    border: 'none',
                                                    borderRadius: '40px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
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
                                                }}>
                                                    <FiEye size={14} /> View Details 
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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

export default UserOrders;