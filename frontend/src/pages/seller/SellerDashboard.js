import React, { useState, useEffect } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import { 
    FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp,
    FiClock, FiCheckCircle, FiTruck, FiEye, FiRefreshCw,
    FiAlertCircle
} from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SellerDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const displayName = user?.shopName || user?.name || 'Seller';

    useEffect(() => {
        console.log('📊 Dashboard Loaded');
        console.log('Token:', !!localStorage.getItem('token'));
        console.log('User:', user);
        
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Please login to continue');
                setTimeout(() => {
                    window.location.href = '/seller/login';
                }, 2000);
                return;
            }

            console.log('📤 Fetching seller dashboard...');
            
            const response = await API.get('/seller/dashboard');
            console.log('📥 Dashboard response:', response.data);
            
            if (response.data && response.data.success) {
                setStats(response.data.data.stats || {
                    products: 0,
                    orders: 0,
                    revenue: 0
                });
                setRecentOrders(response.data.data.recentOrders || []);
                setRecentProducts(response.data.data.recentProducts || []);
                setMonthlyRevenue(response.data.data.monthlyRevenue || []);
                toast.success('Dashboard loaded!');
            } else {
                setError(response.data?.message || 'Failed to load dashboard');
            }
        } catch (error) {
            console.error('❌ Dashboard error:', error);
            
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/seller/login';
                }, 2000);
            } else {
                setError(error.response?.data?.message || 'Failed to fetch dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

    const revenueChartData = {
        labels: monthlyRevenue.map(item => item.month),
        datasets: [
            {
                label: 'Revenue (PKR)',
                data: monthlyRevenue.map(item => item.revenue),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Revenue: Rs. ${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return 'Rs. ' + value.toLocaleString();
                    },
                    color: '#8b6b58'
                },
                grid: {
                    color: '#f0e4d8'
                }
            },
            x: {
                ticks: {
                    color: '#8b6b58'
                },
                grid: {
                    display: false
                }
            }
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'pending': return <FiClock size={14} />;
            case 'delivered': return <FiCheckCircle size={14} />;
            case 'shipped': return <FiTruck size={14} />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
            'processing': { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
            'confirmed': { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
            'shipped': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
            'delivered': { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
            'cancelled': { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
        };
        return colors[status] || { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' };
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

    const StatCard = ({ title, value, icon, color, prefix = '' }) => (
        <div className="card" style={{ padding: '24px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>{title}</p>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#2d1f12' }}>
                        {prefix}{value?.toLocaleString?.() || 0}
                    </h2>
                </div>
                <div style={{
                    backgroundColor: color,
                    padding: '12px',
                    borderRadius: '16px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="app-layout">
                <SellerSidebar />
                <div className="main-content-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-layout">
                <SellerSidebar />
                <div className="main-content-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '48px' }}>
                        <FiAlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
                        <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Error Loading Dashboard</h2>
                        <p style={{ color: '#8b6b58', marginBottom: '24px' }}>{error}</p>
                        <button
                            onClick={fetchDashboardData}
                            className="btn-primary"
                        >
                            <FiRefreshCw /> Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <SellerSidebar />
            
            <div className="main-content-container">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>Seller Dashboard</h1>
                        <p style={{ color: '#8b6b58' }}>Welcome back, {displayName}!</p>
                    </div>
                    
                    <button
                        onClick={fetchDashboardData}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FiRefreshCw /> Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="dashboard-stats" style={{ marginBottom: '32px' }}>
                    <StatCard
                        title="Total Products"
                        value={stats.products}
                        icon={<FiPackage size={24} />}
                        color="#3b82f6"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.orders}
                        icon={<FiShoppingBag size={24} />}
                        color="#f59e0b"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={stats.revenue}
                        icon={<FiDollarSign size={24} />}
                        color="#10b981"
                        prefix="Rs. "
                    />
                </div>

                {/* Revenue Chart */}
                {monthlyRevenue.length > 0 && (
                    <div className="card" style={{ marginBottom: '32px', padding: '24px' }}>
                        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#2d1f12' }}>
                            <FiTrendingUp /> Revenue Trend (Last 6 Months)
                        </h3>
                        <div style={{ height: '300px' }}>
                            <Line data={revenueChartData} options={chartOptions} />
                        </div>
                    </div>
                )}

                {/* Recent Orders */}
                <div className="card" style={{ marginBottom: '32px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: '#2d1f12' }}>Recent Orders</h3>
                        <button 
                            onClick={() => navigate('/seller/orders')} 
                            className="btn-secondary"
                            style={{ padding: '6px 16px', fontSize: '13px' }}
                        >
                            <FiEye /> View All
                        </button>
                    </div>

                    {recentOrders.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#8b6b58' }}>No orders yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recentOrders.map(order => {
                                const statusColors = getStatusColor(order.orderStatus);
                                return (
                                    <div 
                                        key={order._id} 
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '14px 16px',
                                            backgroundColor: '#fefaf5',
                                            borderRadius: '16px',
                                            cursor: 'pointer',
                                            border: `1px solid ${statusColors.border}`
                                        }}
                                        onClick={() => navigate(`/seller/order-details/${order._id}`)}
                                    >
                                        <div>
                                            <div style={{ fontWeight: '500', color: '#2d1f12' }}>
                                                {order.orderNumber}
                                                {order.products?.some(p => p.isCustom) && (
                                                    <span style={{
                                                        marginLeft: '8px',
                                                        padding: '2px 8px',
                                                        borderRadius: '10px',
                                                        fontSize: '10px',
                                                        fontWeight: '600',
                                                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                                        color: 'white',
                                                        verticalAlign: 'middle'
                                                    }}>
                                                        🎨 Custom
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#8b6b58' }}>{order.user?.name}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                backgroundColor: statusColors.bg,
                                                color: statusColors.text,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                {getStatusIcon(order.orderStatus)} {order.orderStatus}
                                            </span>
                                            <span style={{ fontWeight: '500', color: '#9a3412' }}>
                                                Rs. {order.totalAmount?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recent Products */}
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: '#2d1f12' }}>Recent Products</h3>
                        <button 
                            onClick={() => navigate('/seller/products')} 
                            className="btn-secondary"
                            style={{ padding: '6px 16px', fontSize: '13px' }}
                        >
                            <FiEye /> View All
                        </button>
                    </div>

                    {recentProducts.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#8b6b58' }}>
                            No products yet. 
                            <button 
                                onClick={() => navigate('/seller/add-product')} 
                                style={{ color: '#9a3412', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' }}
                            >
                                Add your first product
                            </button>
                        </p>
                    ) : (
                        <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                            {recentProducts.map(product => (
                                <div 
                                    key={product._id} 
                                    className="card"
                                    style={{ padding: '16px', cursor: 'pointer' }}
                                    onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                                >
                                    <div style={{
                                        width: '100%',
                                        height: '160px',
                                        backgroundColor: '#fef7f0',
                                        borderRadius: '12px',
                                        marginBottom: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {product.images && product.images[0] ? (
                                            <img 
                                                src={getImageUrl(product.images[0])} 
                                                alt={product.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <FiPackage size={40} style={{ color: '#b88d6e' }} />
                                        )}
                                    </div>
                                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '600', color: '#2d1f12' }}>
                                        {product.name}
                                    </h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#8b6b58' }}>{product.category}</span>
                                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#9a3412' }}>
                                            Rs. {product.price?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        <span style={{
                                            fontSize: '11px',
                                            color: product.stock > 0 ? '#10b981' : '#ef4444',
                                            backgroundColor: product.stock > 0 ? '#d1fae5' : '#fee2e2',
                                            padding: '2px 8px',
                                            borderRadius: '20px',
                                            display: 'inline-block'
                                        }}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;