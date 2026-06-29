// frontend/src/pages/Orders.js
// Admin can ONLY VIEW orders - CANNOT update status

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/Sidebar';
 
import { 
    FiEye, FiSearch, FiFilter, FiRefreshCw,
    FiClock, FiCheckCircle, FiTruck, FiXCircle,
    FiDownload, FiMessageSquare, FiUser, FiShoppingBag, FiDollarSign,
    FiInfo, FiPackage
} from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sellerFilter, setSellerFilter] = useState('all');
    const [sellers, setSellers] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [adminNote, setAdminNote] = useState('');
    const [addingNote, setAddingNote] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchSellers();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, sellerFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let url = '/admin/orders';
            const params = new URLSearchParams();
            
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }
            if (sellerFilter !== 'all') {
                params.append('sellerId', sellerFilter);
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await API.get(url);
            if (response.data.success) {
                setOrders(response.data.data || []);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchSellers = async () => {
        try {
            const response = await API.get('/admin/sellers');
            if (response.data.success) {
                setSellers(response.data.data || []);
            }
        } catch (error) {
            console.error('Fetch sellers error:', error);
        }
    };

    const addAdminNote = async () => {
        if (!adminNote.trim()) {
            toast.error('Please enter a note');
            return;
        }
        
        setAddingNote(true);
        try {
            const response = await API.post(`/admin/orders/${selectedOrder._id}/note`, { 
                note: adminNote.trim() 
            });
            
            if (response.data.success) {
                toast.success('Note added successfully');
                setShowNoteModal(false);
                setAdminNote('');
                fetchOrders();
            }
        } catch (error) {
            console.error('Add note error:', error);
            toast.error(error.response?.data?.message || 'Failed to add note');
        } finally {
            setAddingNote(false);
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const exportOrdersToCSV = () => {
        const filtered = getFilteredOrders();
        const headers = ['Order #', 'Customer', 'Email', 'Phone', 'Seller', 'Date', 'Total', 'Status', 'Payment', 'Tracking ID'];
        const rows = filtered.map(order => [
            order.orderNumber,
            order.user?.name || order.shippingAddress?.fullName || 'N/A',
            order.user?.email || order.shippingAddress?.email || 'N/A',
            order.user?.phone || order.shippingAddress?.phone || 'N/A',
            order.sellerId?.shopName || order.sellerId?.name || 'N/A',
            new Date(order.createdAt).toLocaleDateString(),
            order.totalAmount,
            order.orderStatus,
            `${order.paymentMethod?.toUpperCase()} - ${order.paymentStatus}`,
            order.tcsTrackingId || 'Not added'
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
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
            default: return <FiClock size={14} />;
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
        let filtered = orders;
        
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    };

    const filteredOrders = getFilteredOrders();

    const summaryStats = {
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        pendingOrders: filteredOrders.filter(o => o.orderStatus === 'pending').length,
        completedOrders: filteredOrders.filter(o => o.orderStatus === 'delivered').length,
        shippedOrders: filteredOrders.filter(o => o.orderStatus === 'shipped' || o.orderStatus === 'out_for_delivery').length
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <AdminSidebar />
                <div style={{ marginLeft: '280px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fefaf5' }}>
            <AdminSidebar />
            
            <div style={{ marginLeft: '280px', flex: 1, padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12', margin: 0 }}>📋 Orders</h1>
                        <p style={{ color: '#8b6b58', marginTop: '4px' }}>View all customer orders across platform</p>
                        <p style={{ 
                            backgroundColor: '#f0e4d8', 
                            display: 'inline-block',
                            padding: '4px 12px', 
                            borderRadius: '20px', 
                            fontSize: '11px', 
                            color: '#5c3a28',
                            marginTop: '8px'
                        }}>
                            <FiEye style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> 
                            Read-only mode - Admin can only view orders
                        </p>
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
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{summaryStats.totalOrders}</h2>
                            </div>
                            <FiPackage size={32} style={{ color: '#b88d6e' }} />
                        </div>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Total Revenue</p>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#9a3412' }}>
                                    Rs. {summaryStats.totalRevenue.toLocaleString()}
                                </h2>
                            </div>
                            <FiDollarSign size={32} style={{ color: '#10b981' }} />
                        </div>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Pending Orders</p>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>
                                    {summaryStats.pendingOrders}
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
                                    {summaryStats.completedOrders}
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
                                placeholder="Search by order number, customer name or email..."
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
                            <option value="processing">🔄 Processing</option>
                            <option value="shipped">📦 Shipped</option>
                            <option value="out_for_delivery">🚚 Out for Delivery</option>
                            <option value="delivered">🎉 Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                            <option value="refunded">💰 Refunded</option>
                        </select>
                        
                        <select
                            value={sellerFilter}
                            onChange={(e) => setSellerFilter(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '40px', border: '1px solid #f0e4d8', backgroundColor: 'white', cursor: 'pointer' }}
                        >
                            <option value="all">All Sellers</option>
                            {sellers.map(seller => (
                                <option key={seller._id} value={seller._id}>{seller.shopName || seller.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f0e4d8', backgroundColor: '#fefaf5' }}>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Order #</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Customer</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Seller</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Date</th>
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
                                        No orders found
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
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ fontWeight: '500', color: '#2d1f12' }}>{order.user?.name || order.shippingAddress?.fullName || 'N/A'}</div>
                                                <div style={{ fontSize: '12px', color: '#8b6b58' }}>{order.user?.email || order.shippingAddress?.email}</div>
                                            </td>
                                            <td style={{ padding: '16px', color: '#8b6b58' }}>
                                                {order.sellerId?.shopName || order.sellerId?.name || 'N/A'}
                                            </td>
                                            <td style={{ padding: '16px', color: '#8b6b58', fontSize: '13px' }}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#9a3412' }}>
                                                Rs. {order.totalAmount?.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    backgroundColor: statusColors.bg,
                                                    color: statusColors.text,
                                                    border: `1px solid ${statusColors.border}`
                                                }}>
                                                    {getStatusIcon(order.orderStatus)} {statusColors.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                {order.tcsTrackingId ? (
                                                    <a 
                                                        href={`https://www.tcsexpress.com/tracking?tracking_number=${order.tcsTrackingId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ fontSize: '12px', color: '#9a3412', textDecoration: 'none' }}
                                                    >
                                                        {order.tcsTrackingId} 🔗
                                                    </a>
                                                ) : (
                                                    <span style={{ fontSize: '12px', color: '#c9a9a9' }}>Not added</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => viewOrderDetails(order)}
                                                        style={{
                                                            padding: '8px 12px',
                                                            backgroundColor: '#f0e4d8',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px',
                                                            color: '#5c3a28',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <FiInfo size={14} /> View
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowNoteModal(true);
                                                        }}
                                                        style={{
                                                            padding: '8px 12px',
                                                            backgroundColor: '#f0e4d8',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px',
                                                            color: '#5c3a28',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <FiMessageSquare size={14} /> Note
                                                    </button>
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
                                    Rs. {summaryStats.totalRevenue.toLocaleString()}
                                </td>
                                <td colSpan="3"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
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
                }} onClick={() => setShowDetailsModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#2d1f12' }}>Order Details</h2>
                            <button onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>
                        
                        <div style={{ marginBottom: '16px', backgroundColor: '#fefaf5', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong>Order Number:</strong> {selectedOrder.orderNumber}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong>Status:</strong> <span style={{ color: getStatusColor(selectedOrder.orderStatus).text }}>{selectedOrder.orderStatus}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong>Payment:</strong> {selectedOrder.paymentMethod?.toUpperCase()} - {selectedOrder.paymentStatus}
                            </div>
                            {selectedOrder.tcsTrackingId && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <strong>TCS Tracking:</strong> 
                                    <a href={`https://www.tcsexpress.com/tracking?tracking_number=${selectedOrder.tcsTrackingId}`} target="_blank" rel="noopener noreferrer" style={{ color: '#9a3412' }}>
                                        {selectedOrder.tcsTrackingId} 🔗
                                    </a>
                                </div>
                            )}
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ marginBottom: '12px', color: '#2d1f12' }}>Customer Details</h3>
                            <div style={{ backgroundColor: '#fefaf5', padding: '16px', borderRadius: '12px' }}>
                                <div><strong>Name:</strong> {selectedOrder.user?.name || selectedOrder.shippingAddress?.fullName}</div>
                                <div><strong>Email:</strong> {selectedOrder.user?.email || selectedOrder.shippingAddress?.email}</div>
                                <div><strong>Phone:</strong> {selectedOrder.user?.phone || selectedOrder.shippingAddress?.phone}</div>
                                <div><strong>Address:</strong> {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}</div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 style={{ marginBottom: '12px', color: '#2d1f12' }}>Products</h3>
                            <div style={{ backgroundColor: '#fefaf5', padding: '16px', borderRadius: '12px' }}>
                                {selectedOrder.products?.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0e4d8' }}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span style={{ color: '#9a3412' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #f0e4d8', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#9a3412' }}>Rs. {selectedOrder.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        {selectedOrder.adminNotes?.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                                <h3 style={{ marginBottom: '12px', color: '#2d1f12' }}>Admin Notes</h3>
                                <div style={{ backgroundColor: '#fefaf5', padding: '16px', borderRadius: '12px' }}>
                                    {selectedOrder.adminNotes.map((note, idx) => (
                                        <div key={idx} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #f0e4d8' }}>
                                            <p style={{ margin: 0 }}>{note.note}</p>
                                            <p style={{ fontSize: '11px', color: '#8b6b58', marginTop: '4px' }}>{new Date(note.addedAt).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#9a3412',
                                color: 'white',
                                border: 'none',
                                borderRadius: '40px',
                                cursor: 'pointer',
                                marginTop: '16px'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {showNoteModal && selectedOrder && (
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
                }} onClick={() => setShowNoteModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '450px',
                        width: '90%'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#2d1f12' }}>📝 Add Admin Note</h3>
                            <button onClick={() => setShowNoteModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                        </div>
                        
                        <p style={{ color: '#8b6b58', marginBottom: '16px' }}>Order: {selectedOrder.orderNumber}</p>
                        
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Enter your note here... (Visible to seller and admins only)"
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid #f0e4d8',
                                fontSize: '14px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button
                                onClick={() => setShowNoteModal(false)}
                                style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #f0e4d8', borderRadius: '40px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addAdminNote}
                                disabled={addingNote}
                                style={{
                                    padding: '10px 24px',
                                    backgroundColor: '#9a3412',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '40px',
                                    cursor: addingNote ? 'not-allowed' : 'pointer',
                                    opacity: addingNote ? 0.7 : 1
                                }}
                            >
                                {addingNote ? 'Adding...' : 'Add Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    .sidebar-container, button {
                        display: none;
                    }
                    .main-content-container {
                        margin-left: 0 !important;
                    }
                }
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

export default AdminOrders;