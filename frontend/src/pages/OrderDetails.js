import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
    FiArrowLeft, FiPackage, FiUser, FiPhone, FiMapPin,
    FiClock, FiCheckCircle, FiTruck, FiXCircle, FiPrinter
} from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

   const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://placehold.co/100x100/2a2a3e/FF6B9D?text=✨+Product+✨';
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

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/orders/${id}`);
            if (response.data.success) {
                setOrder(response.data.data);
            } else {
                toast.error('Order not found');
                navigate('/orders');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (newStatus) => {
        setUpdating(true);
        try {
            const response = await API.put(`/orders/${id}/status`, { status: newStatus });
            if (response.data.success) {
                toast.success('Order status updated');
                setOrder({ ...order, orderStatus: newStatus });
            }
        } catch (error) {
            toast.error('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <FiClock size={16} />,
            processing: <FiClock size={16} />,
            confirmed: <FiCheckCircle size={16} />,
            shipped: <FiTruck size={16} />,
            delivered: <FiCheckCircle size={16} />,
            cancelled: <FiXCircle size={16} />
        };
        return icons[status] || null;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
            processing: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
            confirmed: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
            shipped: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
            delivered: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
            cancelled: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
        };
        return colors[status] || { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="app-layout">
                <Sidebar />
                <div className="main-content-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="app-layout">
                <Sidebar />
                <div className="main-content-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '48px' }}>
                        <h2 style={{ marginBottom: '16px', color: '#2d1f12' }}>Order not found</h2>
                        <button onClick={() => navigate('/orders')} className="btn-primary">Back to Orders</button>
                    </div>
                </div>
            </div>
        );
    }

    const statusColors = getStatusColor(order.orderStatus);

    return (
        <div className="app-layout">
            <Sidebar />
            
            <div className="main-content-container">
                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => navigate('/orders')} className="btn-secondary" style={{ padding: '10px', borderRadius: '8px' }}>
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#2d1f12' }}>
                                Order {order.orderNumber}
                            </h1>
                            <p style={{ color: '#8b6b58', margin: '4px 0 0 0' }}>
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => window.print()} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiPrinter /> Print Invoice
                    </button>
                </div>

                <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{
                                padding: '8px 20px',
                                backgroundColor: statusColors.bg,
                                border: `1px solid ${statusColors.border}`,
                                borderRadius: '40px',
                                color: statusColors.text,
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                {getStatusIcon(order.orderStatus)}
                                <span style={{ textTransform: 'capitalize' }}>{order.orderStatus}</span>
                            </div>
                            <div>
                                <span style={{ color: '#8b6b58', fontSize: '14px' }}>Payment:</span>{' '}
                                <span style={{
                                    color: order.paymentStatus === 'completed' ? '#10b981' : '#f59e0b',
                                    fontWeight: '500'
                                }}>
                                    {order.paymentMethod?.toUpperCase()} • {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                        <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(e.target.value)}
                            disabled={updating}
                            className="input"
                            style={{ width: '160px', cursor: 'pointer' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#2d1f12' }}>
                            <FiPackage /> Products in this order
                        </h3>
                        {order.products?.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#fefaf5', borderRadius: '16px', marginBottom: '12px' }}>
                                <div style={{ width: '60px', height: '60px', backgroundColor: '#fef7f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {item.product?.images?.[0] ? (
                                        <img src={getImageUrl(item.product.images[0])} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <FiPackage size={24} color="#b88d6e" />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 4px 0', color: '#2d1f12' }}>{item.product?.name}</h4>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#8b6b58' }}>Quantity: {item.quantity}</p>
                                    <div style={{ fontWeight: '600', color: '#9a3412' }}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', color: '#8b6b58' }}>Unit Price</div>
                                    <div style={{ fontWeight: '500', color: '#9a3412' }}>Rs. {item.price.toLocaleString()}</div>
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0e4d8' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#5c3a28' }}>
                                <span>Subtotal</span><span>Rs. {order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#5c3a28' }}>
                                <span>Tax</span><span>Rs. {order.tax?.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#5c3a28' }}>
                                <span>Shipping</span><span>Rs. {order.shippingFee?.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #f0e4d8', fontWeight: 'bold', fontSize: '18px' }}>
                                <span style={{ color: '#2d1f12' }}>Total</span>
                                <span style={{ color: '#9a3412' }}>Rs. {order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#2d1f12' }}>
                                <FiUser /> Customer Details
                            </h3>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '14px', color: '#8b6b58', marginBottom: '4px' }}>Name</div>
                                <div style={{ fontWeight: '500', color: '#2d1f12' }}>{order.user?.name}</div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '14px', color: '#8b6b58', marginBottom: '4px' }}><FiPhone style={{ marginRight: '4px' }} /> Phone</div>
                                <div style={{ color: '#5c3a28' }}>{order.user?.phone || order.shippingAddress?.phone || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', color: '#8b6b58', marginBottom: '4px' }}><FiMapPin style={{ marginRight: '4px' }} /> Shipping Address</div>
                                <div style={{ color: '#5c3a28', lineHeight: '1.5' }}>
                                    {order.shippingAddress?.street && <div>{order.shippingAddress.street}</div>}
                                    {(order.shippingAddress?.city || order.shippingAddress?.state) && (
                                        <div>{order.shippingAddress.city}{order.shippingAddress.city && order.shippingAddress.state ? ', ' : ''}{order.shippingAddress.state}</div>
                                    )}
                                    {order.shippingAddress?.country && (
                                        <div>{order.shippingAddress.country}{order.shippingAddress.zipCode && ` - ${order.shippingAddress.zipCode}`}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#2d1f12' }}>
                                <FiClock /> Order Timeline
                            </h3>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', marginTop: '6px' }}></div>
                                <div><div style={{ fontWeight: '500', color: '#2d1f12' }}>Order Placed</div><div style={{ fontSize: '14px', color: '#8b6b58' }}>{formatDate(order.createdAt)}</div></div>
                            </div>
                            {order.orderStatus !== 'pending' && (
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', marginTop: '6px' }}></div>
                                    <div><div style={{ fontWeight: '500', color: '#2d1f12' }}>Status Updated to {order.orderStatus}</div><div style={{ fontSize: '14px', color: '#8b6b58' }}>{formatDate(order.updatedAt)}</div></div>
                                </div>
                            )}
                            {order.orderStatus === 'delivered' && (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', marginTop: '6px' }}></div>
                                    <div><div style={{ fontWeight: '500', color: '#2d1f12' }}>Delivered</div><div style={{ fontSize: '14px', color: '#8b6b58' }}>{formatDate(order.updatedAt)}</div></div>
                                </div>
                            )}
                        </div>

                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ margin: '0 0 20px 0', color: '#2d1f12' }}>Payment Information</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#8b6b58' }}>Method</span>
                                <span style={{ fontWeight: '500', textTransform: 'uppercase', color: '#5c3a28' }}>{order.paymentMethod}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#8b6b58' }}>Status</span>
                                <span style={{ color: order.paymentStatus === 'completed' ? '#10b981' : '#f59e0b', fontWeight: '500' }}>{order.paymentStatus}</span>
                            </div>
                            {order.paymentDetails?.transactionId && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#8b6b58' }}>Transaction ID</span>
                                    <span style={{ fontSize: '13px', color: '#5c3a28' }}>{order.paymentDetails.transactionId}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;