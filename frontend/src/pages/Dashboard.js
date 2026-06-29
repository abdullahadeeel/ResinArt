import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { 
    FiUsers, FiPackage, FiShoppingBag, FiDollarSign,
    FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle,
    FiXCircle, FiTruck
} from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [ordersByStatus, setOrdersByStatus] = useState([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await API.get('/admin/dashboard');
            if (response.data.success) {
                const data = response.data.data;
                setStats(data.stats);
                setRecentOrders(data.recentOrders || []);
                setRecentUsers(data.recentUsers || []);
                setOrdersByStatus(data.ordersByStatus || []);
                setMonthlyRevenue(data.monthlyRevenue || []);
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Line Chart Data - Monthly Revenue
    const lineChartData = {
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

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
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
                    }
                }
            }
        }
    };

    // Bar Chart Data - Orders by Status
    const barChartData = {
        labels: ordersByStatus.map(item => item._id?.charAt(0).toUpperCase() + item._id?.slice(1) || item._id),
        datasets: [
            {
                label: 'Number of Orders',
                data: ordersByStatus.map(item => item.count),
                backgroundColor: [
                    '#f59e0b',
                    '#3b82f6',
                    '#10b981',
                    '#8b5cf6',
                    '#22c55e',
                    '#ef4444'
                ],
                borderRadius: 8
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    // Pie Chart Data - Payment Methods
    const pieChartData = {
        labels: ['COD'],
        datasets: [
            {
                data: [100],
                backgroundColor: ['#f59e0b'],
                borderWidth: 0
            }
        ]
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
            }
        }
    };

    const StatCard = ({ title, value, icon, color, trend, trendValue, prefix = '' }) => (
        <div className="card" style={{ padding: '24px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>{title}</p>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#2d1f12' }}>
                        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
                    </h2>
                    {trend && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                            {trend === 'up' ? (
                                <FiTrendingUp style={{ color: '#10b981' }} />
                            ) : (
                                <FiTrendingDown style={{ color: '#ef4444' }} />
                            )}
                            <span style={{ color: trend === 'up' ? '#10b981' : '#ef4444', fontSize: '12px' }}>
                                {trendValue} from last month
                            </span>
                        </div>
                    )}
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

    const getStatusBadge = (status) => {
        const colors = {
            pending: { bg: '#fff7ed', color: '#9a3412', icon: <FiClock size={12} /> },
            delivered: { bg: '#d1fae5', color: '#065f46', icon: <FiCheckCircle size={12} /> },
            shipped: { bg: '#fef3c7', color: '#92400e', icon: <FiTruck size={12} /> },
            cancelled: { bg: '#fee2e2', color: '#991b1b', icon: <FiXCircle size={12} /> }
        };
        return colors[status] || { bg: '#f3f4f6', color: '#4b5563', icon: null };
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

    return (
        <div className="app-layout">
            <Sidebar />
            
            <div className="main-content-container">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>Dashboard</h1>
                        <p style={{ color: '#8b6b58' }}>Welcome back! Here's what's happening with your store.</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
                    <StatCard
                        title="Total Users"
                        value={stats.users}
                        icon={<FiUsers size={24} />}
                        color="#3b82f6"
                        trend="up"
                        trendValue="12%"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats.products}
                        icon={<FiPackage size={24} />}
                        color="#10b981"
                        trend="up"
                        trendValue="8%"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.orders}
                        icon={<FiShoppingBag size={24} />}
                        color="#f59e0b"
                        trend="up"
                        trendValue="15%"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={stats.revenue}
                        icon={<FiDollarSign size={24} />}
                        color="#8b5cf6"
                        trend="up"
                        trendValue="10%"
                        prefix="Rs. "
                    />
                </div>

                {/* Charts Row 1 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '24px',
                    marginBottom: '30px'
                }}>
                    {/* Line Chart - Monthly Revenue */}
                    <div className="card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#2d1f12' }}>
                            Monthly Revenue Trend
                            <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#8b6b58', marginLeft: '8px' }}>(Last 6 Months)</span>
                        </h3>
                        <div style={{ height: '300px' }}>
                            {monthlyRevenue.length > 0 ? (
                                <Line data={lineChartData} options={lineChartOptions} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#b88d6e' }}>
                                    No revenue data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pie Chart - Payment Methods */}
                    <div className="card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#2d1f12' }}>
                            Payment Methods
                        </h3>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '24px',
                    marginBottom: '30px'
                }}>
                    {/* Bar Chart - Orders by Status */}
                    <div className="card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#2d1f12' }}>
                            Orders by Status
                        </h3>
                        <div style={{ height: '300px' }}>
                            {ordersByStatus.length > 0 ? (
                                <Bar data={barChartData} options={barChartOptions} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#b88d6e' }}>
                                    No order status data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Orders Summary */}
                    <div className="card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#2d1f12' }}>
                            Recent Orders
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                            {recentOrders.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#b88d6e', padding: '40px' }}>No recent orders</p>
                            ) : (
                                recentOrders.slice(0, 5).map(order => {
                                    const status = getStatusBadge(order.orderStatus);
                                    return (
                                        <div key={order._id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px',
                                            backgroundColor: '#fefaf5',
                                            borderRadius: '16px',
                                            cursor: 'pointer'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#2d1f12' }}>{order.orderNumber}</div>
                                                <div style={{ fontSize: '12px', color: '#8b6b58' }}>
                                                    {order.user?.name}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    backgroundColor: status.bg,
                                                    color: status.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    {status.icon} {order.orderStatus}
                                                </span>
                                                <span style={{ fontWeight: '500', color: '#9a3412' }}>
                                                    Rs. {order.totalAmount?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {/* Recent Users */}
                    <div className="card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#2d1f12' }}>
                            Recent Users
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                            {recentUsers.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#b88d6e', padding: '40px' }}>No recent users</p>
                            ) : (
                                recentUsers.map(user => (
                                    <div key={user._id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        backgroundColor: '#fefaf5',
                                        borderRadius: '16px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: '#f59e0b',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '16px'
                                            }}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#2d1f12' }}>{user.name}</div>
                                                <div style={{ fontSize: '12px', color: '#8b6b58' }}>{user.email}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#b88d6e' }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#2d1f12' }}>
                            Quick Actions
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            <button 
                                onClick={() => window.location.href = '/add-product'}
                                style={{
                                    padding: '20px',
                                    border: '2px dashed #e5d5cc',
                                    borderRadius: '20px',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#5c3a28',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#fefaf5'; e.target.style.borderColor = '#9a3412'; }}
                                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#e5d5cc'; }}
                            >
                                <FiPackage size={28} color="#9a3412" />
                                <span style={{ fontSize: '13px', fontWeight: '500' }}>Add Product</span>
                            </button>
                            <button 
                                onClick={() => window.location.href = '/orders'}
                                style={{
                                    padding: '20px',
                                    border: '2px dashed #e5d5cc',
                                    borderRadius: '20px',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#5c3a28'
                                }}
                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#fefaf5'; e.target.style.borderColor = '#9a3412'; }}
                                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#e5d5cc'; }}
                            >
                                <FiShoppingBag size={28} color="#3b82f6" />
                                <span style={{ fontSize: '13px', fontWeight: '500' }}>View Orders</span>
                            </button>
                            <button 
                                onClick={() => window.location.href = '/users'}
                                style={{
                                    padding: '20px',
                                    border: '2px dashed #e5d5cc',
                                    borderRadius: '20px',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#5c3a28'
                                }}
                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#fefaf5'; e.target.style.borderColor = '#9a3412'; }}
                                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#e5d5cc'; }}
                            >
                                <FiUsers size={28} color="#10b981" />
                                <span style={{ fontSize: '13px', fontWeight: '500' }}>Manage Users</span>
                            </button>
                            <button 
                                onClick={() => window.location.href = '/reports'}
                                style={{
                                    padding: '20px',
                                    border: '2px dashed #e5d5cc',
                                    borderRadius: '20px',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#5c3a28'
                                }}
                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#fefaf5'; e.target.style.borderColor = '#9a3412'; }}
                                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#e5d5cc'; }}
                            >
                                <FiDollarSign size={28} color="#8b5cf6" />
                                <span style={{ fontSize: '13px', fontWeight: '500' }}>Sales Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;