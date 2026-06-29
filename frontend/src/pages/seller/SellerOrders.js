import React, { useState, useEffect } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import { 
    FiEye, FiSearch, FiFilter, FiRefreshCw,
    FiClock, FiCheckCircle, FiTruck, FiXCircle,
    FiDollarSign, FiPlus, FiSend, FiDownload, FiPrinter,
    FiPackage, FiTrendingUp, FiAlertCircle
} from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [trackingId, setTrackingId] = useState('');
    const [shippingCharge, setShippingCharge] = useState('');
    const [codCharge, setCodCharge] = useState('');
    const [totalDeduction, setTotalDeduction] = useState(0);
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [refundNote, setRefundNote] = useState('');
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await API.get('/seller/orders');
            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                toast.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await API.put(`/seller/orders/${orderId}/status`, { status: newStatus });
            if (response.data.success) {
                toast.success(`Order status updated to ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update order status');
        }
    };

    const calculateTotalDeduction = () => {
        const shipping = parseFloat(shippingCharge) || 0;
        const cod = parseFloat(codCharge) || 0;
        setTotalDeduction(shipping + cod);
    };

    const addTrackingId = async () => {
        if (!trackingId.trim()) {
            toast.error('Please enter TCS tracking ID');
            return;
        }
        
        setUpdating(true);
        try {
            const response = await API.put(`/seller/orders/${selectedOrder._id}/tracking`, { 
                trackingId: trackingId.trim(),
                shippingCharge: parseFloat(shippingCharge) || 0,
                codCharge: parseFloat(codCharge) || 0
            });
            
            if (response.data.success) {
                toast.success(response.data.message);
                setShowTrackingModal(false);
                setTrackingId('');
                setShippingCharge('');
                setCodCharge('');
                setTotalDeduction(0);
                fetchOrders();
            }
        } catch (error) {
            console.error('Tracking error:', error);
            toast.error(error.response?.data?.message || 'Failed to add tracking ID');
        } finally {
            setUpdating(false);
        }
    };

    const processRefund = async () => {
        if (!refundAmount || parseFloat(refundAmount) <= 0) {
            toast.error('Please enter valid refund amount');
            return;
        }
        
        setUpdating(true);
        try {
            const response = await API.put(`/seller/orders/${selectedOrder._id}/refund`, {
                refundAmount: parseFloat(refundAmount),
                refundReason: refundReason,
                refundNote: refundNote
            });
            
            if (response.data.success) {
                toast.success('Refund processed successfully!');
                setShowRefundModal(false);
                setRefundAmount('');
                setRefundReason('');
                setRefundNote('');
                fetchOrders();
            }
        } catch (error) {
            console.error('Refund error:', error);
            toast.error(error.response?.data?.message || 'Failed to process refund');
        } finally {
            setUpdating(false);
        }
    };

    const exportOrdersToCSV = () => {
        const filtered = getFilteredOrders();
        const headers = ['Order #', 'Customer', 'Date', 'Total', 'TCS Deduction', 'Net Amount', 'Status', 'Tracking ID'];
        const rows = filtered.map(order => [
            order.orderNumber,
            order.user?.name || 'N/A',
            new Date(order.createdAt).toLocaleDateString(),
            order.totalAmount,
            order.tcsTotalDeduction || 0,
            (order.totalAmount - (order.tcsTotalDeduction || 0)),
            order.orderStatus,
            order.tcsTrackingId || 'Not added'
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my_orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Orders exported successfully');
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'pending': return <FiClock size={14} />;
            case 'processing': return <FiClock size={14} />;
            case 'confirmed': return <FiCheckCircle size={14} />;
            case 'shipped': return <FiTruck size={14} />;
            case 'out_for_delivery': return <FiTruck size={14} />;
            case 'delivered': return <FiCheckCircle size={14} />;
            case 'cancelled': return <FiXCircle size={14} />;
            case 'refunded': return <FiDollarSign size={14} />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa', label: 'Pending' },
            'processing': { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', label: 'Processing' },
            'confirmed': { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', label: 'Confirmed' },
            'shipped': { bg: '#fef3c7', text: '#92400e', border: '#fde68a', label: 'Shipped' },
            'out_for_delivery': { bg: '#fef3c7', text: '#92400e', border: '#fde68a', label: 'Out for Delivery' },
            'delivered': { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0', label: 'Delivered' },
            'cancelled': { bg: '#fee2e2', text: '#991b1b', border: '#fecaca', label: 'Cancelled' },
            'refunded': { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe', label: 'Refunded' }
        };
        return colors[status] || { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb', label: status };
    };

    const getFilteredOrders = () => {
        return orders.filter(order => {
            const matchesSearch = searchTerm === '' || 
                order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    };

    const filteredOrders = getFilteredOrders();

    // Calculate Stats
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = filteredOrders.filter(o => o.orderStatus === 'pending').length;
    const completedOrders = filteredOrders.filter(o => o.orderStatus === 'delivered').length;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fefaf5' }}>
            <SellerSidebar />
            
            <div style={{ marginLeft: '280px', flex: 1, padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12', margin: 0 }}>📦 My Orders</h1>
                        <p style={{ color: '#8b6b58', marginTop: '4px' }}>Manage orders, add tracking, process refunds</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={exportOrdersToCSV}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'white', border: '1px solid #f0e4d8', borderRadius: '40px', cursor: 'pointer' }}
                        >
                            <FiDownload /> Export CSV
                        </button>
                        <button
                            onClick={fetchOrders}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer' }}
                        >
                            <FiRefreshCw /> Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Total Orders</p>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{totalOrders}</h2>
                            </div>
                            <FiPackage size={32} style={{ color: '#b88d6e' }} />
                        </div>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Total Revenue</p>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#9a3412' }}>
                                    Rs. {totalRevenue.toLocaleString()}
                                </h2>
                            </div>
                            <FiTrendingUp size={32} style={{ color: '#10b981' }} />
                        </div>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Pending Orders</p>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>
                                    {pendingOrders}
                                </h2>
                            </div>
                            <FiClock size={32} style={{ color: '#f59e0b' }} />
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Completed</p>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#10b981' }}>
                                    {completedOrders}
                                </h2>
                            </div>
                            <FiCheckCircle size={32} style={{ color: '#10b981' }} />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f0e4d8', borderRadius: '40px', padding: '8px 16px' }}>
                            <FiSearch size={20} style={{ color: '#b88d6e' }} />
                            <input
                                type="text"
                                placeholder="Search by order number or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '8px 0',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '14px',
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </div>
                        
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '40px', border: '1px solid #f0e4d8', backgroundColor: 'white', cursor: 'pointer' }}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">⏳ Pending</option>
                            <option value="confirmed">✅ Confirmed</option>
                            <option value="processing">🎨 Processing</option>
                            <option value="shipped">📦 Shipped</option>
                            <option value="out_for_delivery">🚚 Out for Delivery</option>
                            <option value="delivered">🎉 Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                            <option value="refunded">💰 Refunded</option>
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f0e4d8', backgroundColor: '#fefaf5' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Order #</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Customer</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Date</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: '#5c3a28' }}>Products</th>
                                    <th style={{ padding: '16px', textAlign: 'right', color: '#5c3a28' }}>Total</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: '#5c3a28' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: '#5c3a28' }}>Tracking</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: '#5c3a28' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ padding: '48px', textAlign: 'center', color: '#8b6b58' }}>
                                            ✨ No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => {
                                        const statusColors = getStatusColor(order.orderStatus);
                                        return (
                                            <tr key={order._id} style={{ borderBottom: '1px solid #f0e4d8' }}>
                                                <td style={{ padding: '16px', fontWeight: '500', color: '#2d1f12' }}>
                                                    {order.orderNumber}
                                                </td>
                                                <td style={{ padding: '16px', color: '#8b6b58' }}>
                                                    {order.user?.name || 'N/A'}
                                                </td>
                                                <td style={{ padding: '16px', color: '#8b6b58', fontSize: '13px' }}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                                    <span style={{
                                                        backgroundColor: '#fef7f0',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        color: '#5c3a28'
                                                    }}>
                                                        {order.products?.length || 0} items
                                                    </span>
                                                    {order.products?.some(p => p.isCustom) && (
                                                        <span style={{
                                                            marginLeft: '6px',
                                                            padding: '2px 10px',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                                            color: 'white'
                                                        }}>
                                                            Custom
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#9a3412' }}>
                                                    Rs. {order.totalAmount?.toLocaleString()}
                                                    {order.tcsTotalDeduction > 0 && (
                                                        <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                                                            Net: Rs. {(order.totalAmount - order.tcsTotalDeduction).toLocaleString()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                        style={{
                                                            padding: '8px 14px',
                                                            border: `1px solid ${statusColors.border}`,
                                                            borderRadius: '40px',
                                                            backgroundColor: statusColors.bg,
                                                            color: statusColors.text,
                                                            fontWeight: '500',
                                                            fontSize: '13px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="out_for_delivery">Out for Delivery</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                        <option value="refunded">Refunded</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                                    {order.tcsTrackingId ? (
                                                        <div>
                                                            <a 
                                                                href={`https://www.tcsexpress.com/tracking?tracking_number=${order.tcsTrackingId}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ fontSize: '12px', color: '#9a3412', textDecoration: 'none' }}
                                                            >
                                                                {order.tcsTrackingId} 🔗
                                                            </a>
                                                            {order.tcsTotalDeduction > 0 && (
                                                                <div style={{ fontSize: '10px', color: '#f59e0b' }}>
                                                                    Deduction: Rs.{order.tcsTotalDeduction}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setTrackingId('');
                                                                setShippingCharge('');
                                                                setCodCharge('');
                                                                setTotalDeduction(0);
                                                                setShowTrackingModal(true);
                                                            }}
                                                            disabled={order.orderStatus !== 'confirmed' && order.orderStatus !== 'processing'}
                                                            style={{
                                                                padding: '6px 12px',
                                                                background: (order.orderStatus === 'confirmed' || order.orderStatus === 'processing') ? '#9a3412' : '#ccc',
                                                                border: 'none',
                                                                borderRadius: '40px',
                                                                color: 'white',
                                                                cursor: (order.orderStatus === 'confirmed' || order.orderStatus === 'processing') ? 'pointer' : 'not-allowed',
                                                                fontSize: '12px',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '5px'
                                                            }}
                                                        >
                                                            <FiPlus size={12} /> Add Tracking
                                                        </button>
                                                    )}
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button
                                                            onClick={() => navigate(`/seller/order-details/${order._id}`)}
                                                            style={{
                                                                padding: '8px 12px',
                                                                backgroundColor: '#f0e4d8',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                            title="View Details"
                                                        >
                                                            <FiEye size={14} /> View
                                                        </button>
                                                        
                                                        {order.orderStatus === 'delivered' && !order.refundDetails?.isRefunded && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setRefundAmount(order.totalAmount.toString());
                                                                    setShowRefundModal(true);
                                                                }}
                                                                style={{
                                                                    padding: '8px 12px',
                                                                    backgroundColor: '#f0e4d8',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                                title="Process Refund"
                                                            >
                                                                <FiDollarSign size={14} /> Refund
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                            <tfoot style={{ backgroundColor: '#fefaf5', borderTop: '1px solid #f0e4d8' }}>
                                <tr>
                                    <td colSpan="4" style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>Total Value:</td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#9a3412' }}>
                                        Rs. {totalRevenue.toLocaleString()}
                                    </td>
                                    <td colSpan="3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>

            {/* Tracking Modal with TCS Charges */}
            {showTrackingModal && selectedOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowTrackingModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '450px',
                        width: '90%'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '8px', color: '#2d1f12' }}>📦 Add TCS Tracking ID</h3>
                        <p style={{ color: '#8b6b58', marginBottom: '20px', fontSize: '14px' }}>
                            Order: {selectedOrder.orderNumber}
                        </p>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#2d1f12', fontSize: '13px' }}>TCS Tracking Number *</label>
                            <input
                                type="text"
                                placeholder="Enter TCS Tracking Number"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '40px',
                                    border: '1px solid #f0e4d8',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#2d1f12', fontSize: '13px' }}>TCS Shipping Charge (Rs.)</label>
                            <input
                                type="number"
                                placeholder="e.g., 250"
                                value={shippingCharge}
                                onChange={(e) => {
                                    setShippingCharge(e.target.value);
                                    setTimeout(calculateTotalDeduction, 10);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '40px',
                                    border: '1px solid #f0e4d8',
                                    fontSize: '14px'
                                }}
                            />
                            <p style={{ fontSize: '11px', color: '#8b6b58', marginTop: '4px' }}>
                                TCS shipping charge (actual amount paid to TCS)
                            </p>
                        </div>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#2d1f12', fontSize: '13px' }}>TCS COD Charge (Rs.)</label>
                            <input
                                type="number"
                                placeholder="e.g., 100"
                                value={codCharge}
                                onChange={(e) => {
                                    setCodCharge(e.target.value);
                                    setTimeout(calculateTotalDeduction, 10);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '40px',
                                    border: '1px solid #f0e4d8',
                                    fontSize: '14px'
                                }}
                            />
                            <p style={{ fontSize: '11px', color: '#8b6b58', marginTop: '4px' }}>
                                TCS COD charges (2-3% of order value)
                            </p>
                        </div>
                        
                        {totalDeduction > 0 && (
                            <div style={{
                                backgroundColor: '#fefaf5',
                                padding: '12px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                border: '1px solid #f0e4d8'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#2d1f12' }}>Total TCS Deduction:</span>
                                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Rs. {totalDeduction.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '5px' }}>
                                    <span style={{ color: '#2d1f12' }}>Net Earnings after deduction:</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                                        Rs. {(selectedOrder.totalAmount - totalDeduction).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowTrackingModal(false)}
                                style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #f0e4d8', borderRadius: '40px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addTrackingId}
                                disabled={updating || !trackingId.trim()}
                                style={{
                                    padding: '10px 24px',
                                    backgroundColor: '#9a3412',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '40px',
                                    cursor: (updating || !trackingId.trim()) ? 'not-allowed' : 'pointer',
                                    opacity: (updating || !trackingId.trim()) ? 0.6 : 1
                                }}
                            >
                                {updating ? 'Adding...' : 'Add Tracking ID'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Modal */}
            {showRefundModal && selectedOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowRefundModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '500px',
                        width: '90%'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '8px', color: '#2d1f12' }}>💰 Process Refund</h3>
                        <p style={{ color: '#8b6b58', marginBottom: '20px', fontSize: '14px' }}>
                            Order: {selectedOrder.orderNumber}
                        </p>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#2d1f12' }}>Refund Amount (Rs.)</label>
                            <input
                                type="number"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                placeholder="Enter amount to refund"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '40px',
                                    border: '1px solid #f0e4d8',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#2d1f12' }}>Refund Reason</label>
                            <select
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '40px',
                                    border: '1px solid #f0e4d8',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="">Select reason</option>
                                <option value="Damaged product">Damaged product</option>
                                <option value="Wrong item sent">Wrong item sent</option>
                                <option value="Quality issue">Quality issue</option>
                                <option value="Customer request">Customer request</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#2d1f12' }}>Note (Optional)</label>
                            <textarea
                                value={refundNote}
                                onChange={(e) => setRefundNote(e.target.value)}
                                placeholder="Add any additional notes..."
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    border: '1px solid #f0e4d8',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowRefundModal(false)}
                                style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #f0e4d8', borderRadius: '40px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processRefund}
                                disabled={updating}
                                style={{
                                    padding: '10px 24px',
                                    backgroundColor: '#f59e0b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '40px',
                                    cursor: updating ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {updating ? 'Processing...' : 'Process Refund'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .loading-spinner {
                    width: 48px;
                    height: 48px;
                    border: 3px solid #f0e4d8;
                    border-top: 3px solid #9a3412;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SellerOrders;