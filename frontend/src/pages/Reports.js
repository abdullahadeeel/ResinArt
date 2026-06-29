import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FiCalendar, FiDownload, FiTrendingUp, FiDollarSign, FiPackage, 
    FiUsers, FiShoppingCart, FiBarChart2, FiActivity,
    FiArrowUp, FiArrowDown, FiClock, FiCheckCircle, FiXCircle,
    FiPrinter, FiRefreshCw
} from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('sales');
    const [dateRange, setDateRange] = useState('monthly');
    const [reportData, setReportData] = useState({
        sales: [],
        products: [],
        users: [],
        summary: {},
        categorySales: [],
        topCustomers: []
    });

    useEffect(() => {
        fetchReportData();
    }, [reportType, dateRange]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                return;
            }

            const reportsRes = await API.get('/admin/reports/overview');
            const data = reportsRes.data.data || {};

            console.log('📊 Reports API Data:', data);

            const stats = data.stats || {};
            const monthlyRevenue = data.monthlyRevenue || [];
            const categorySales = data.categorySales || [];
            const products = data.products || [];
            const users = data.users || [];

            setReportData({
                sales: monthlyRevenue || [],
                products: products || [],
                users: users || [],
                summary: {
                    totalRevenue: stats.revenue || 0,
                    totalOrders: stats.orders || 0,
                    totalProducts: stats.products || 0,
                    totalUsers: stats.users || 0,
                    averageOrderValue: stats.orders > 0 ? stats.revenue / stats.orders : 0
                },
                categorySales: categorySales || [],
                topCustomers: []
            });

        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const exportReport = () => {
        let data = [];
        let filename = '';
        
        if (reportType === 'sales') {
            data = reportData.sales || [];
            filename = 'sales_report.csv';
        } else if (reportType === 'products') {
            data = reportData.products || [];
            filename = 'products_report.csv';
        } else if (reportType === 'users') {
            data = reportData.users || [];
            filename = 'users_report.csv';
        }
        
        if (!data || data.length === 0) {
            toast.error('No data to export');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header];
                return `"${String(val || '').replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        }
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Report exported successfully!');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fffaf5' }}>
                <Sidebar />
                <div style={{ 
                    flex: 1, 
                    marginLeft: '280px',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh' 
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid #f0e4d8',
                        borderTop: '3px solid #9a3412',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fffaf5' }}>
            <Sidebar />
            
            <div style={{ 
                flex: 1, 
                marginLeft: '280px',
                padding: '24px', 
                overflowX: 'auto',
                minHeight: '100vh',
                width: 'calc(100% - 280px)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '400',
                            color: '#2d1f12',
                            fontFamily: 'Georgia, serif',
                            marginBottom: '8px'
                        }}>
                            Reports & Analytics
                        </h1>
                        <p style={{ color: '#8b6b58' }}>
                            Comprehensive business insights and performance metrics
                        </p>
                    </div>
                    <button
                        onClick={fetchReportData}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 20px',
                            backgroundColor: '#fef3e8',
                            border: '1px solid #e5d5cc',
                            borderRadius: '40px',
                            cursor: 'pointer',
                            color: '#9a3412'
                        }}
                    >
                        <FiRefreshCw size={16} /> Refresh Data
                    </button>
                </div>

                {/* KPI Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #f0e4d8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <FiDollarSign size={32} style={{ color: '#10b981' }} />
                            <span style={{ fontSize: '12px', color: '#10b981' }}>
                                <FiArrowUp size={12} /> 0%
                            </span>
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d1f12', margin: 0 }}>
                            Rs. {reportData.summary.totalRevenue?.toLocaleString() || 0}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#8b6b58', marginTop: '4px' }}>Total Revenue</p>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #f0e4d8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <FiShoppingCart size={32} style={{ color: '#3b82f6' }} />
                            <span style={{ fontSize: '12px', color: '#10b981' }}>
                                <FiArrowUp size={12} /> 0%
                            </span>
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d1f12', margin: 0 }}>
                            {reportData.summary.totalOrders || 0}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#8b6b58', marginTop: '4px' }}>Total Orders</p>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #f0e4d8' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <FiUsers size={32} style={{ color: '#f59e0b' }} />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d1f12', margin: 0 }}>
                            {reportData.summary.totalUsers || 0}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#8b6b58', marginTop: '4px' }}>Active Customers</p>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #f0e4d8' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <FiPackage size={32} style={{ color: '#9a3412' }} />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d1f12', margin: 0 }}>
                            Rs. {reportData.summary.averageOrderValue?.toLocaleString() || 0}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#8b6b58', marginTop: '4px' }}>Avg Order Value</p>
                    </div>
                </div>

                {/* Category Sales Summary */}
                {reportData.categorySales && reportData.categorySales.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '32px'
                    }}>
                        {reportData.categorySales.slice(0, 4).map((cat, idx) => (
                            <div key={idx} style={{ backgroundColor: '#fef7f0', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '12px', color: '#8b6b58' }}>{cat._id || 'Other'}</p>
                                <p style={{ fontSize: '20px', fontWeight: '700', color: '#9a3412' }}>Rs. {cat.value?.toLocaleString() || 0}</p>
                                <p style={{ fontSize: '11px', color: '#b88d6e' }}>{cat.count || 0} items sold</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Report Controls */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px',
                    padding: '16px 20px',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    border: '1px solid #f0e4d8'
                }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {[
                            { id: 'sales', name: 'Sales Report', icon: <FiDollarSign size={14} /> },
                            { id: 'products', name: 'Products Report', icon: <FiPackage size={14} /> },
                            { id: 'users', name: 'Users Report', icon: <FiUsers size={14} /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setReportType(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 20px',
                                    borderRadius: '40px',
                                    border: 'none',
                                    backgroundColor: reportType === tab.id ? '#9a3412' : '#f0e4d8',
                                    color: reportType === tab.id ? 'white' : '#5c3a28',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef7f0', padding: '6px 12px', borderRadius: '40px' }}>
                            <FiCalendar size={16} color="#9a3412" />
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '13px',
                                    color: '#5c3a28',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="weekly">Last 7 Days</option>
                                <option value="monthly">Last 30 Days</option>
                                <option value="yearly">Last 12 Months</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>
                        
                        <button
                            onClick={exportReport}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 20px',
                                backgroundColor: '#9a3412',
                                color: 'white',
                                border: 'none',
                                borderRadius: '40px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            <FiDownload size={16} /> Export
                        </button>
                        
                        <button
                            onClick={() => window.print()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 20px',
                                backgroundColor: '#fef3e8',
                                border: '1px solid #e5d5cc',
                                borderRadius: '40px',
                                cursor: 'pointer',
                                color: '#5c3a28'
                            }}
                        >
                            <FiPrinter size={16} /> Print
                        </button>
                    </div>
                </div>

                {/* Report Content */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    border: '1px solid #f0e4d8',
                    overflowX: 'auto',
                    padding: '20px'
                }}>
                    {reportType === 'sales' && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: '#2d1f12' }}>
                                Sales Overview
                            </h3>
                            {!reportData.sales || reportData.sales.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#8b6b58', padding: '40px' }}>No sales data available</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #f0e4d8' }}>
                                            <th style={{ textAlign: 'left', padding: '12px', color: '#5c3a28' }}>Month</th>
                                            <th style={{ textAlign: 'right', padding: '12px', color: '#5c3a28' }}>Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.sales.map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f0e4d8' }}>
                                                <td style={{ padding: '12px', color: '#2d1f12' }}>{item.month}</td>
                                                <td style={{ textAlign: 'right', padding: '12px', color: '#9a3412', fontWeight: '600' }}>
                                                    Rs. {item.revenue?.toLocaleString() || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {reportType === 'products' && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: '#2d1f12' }}>
                                Products List
                            </h3>
                            {!reportData.products || reportData.products.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#8b6b58', padding: '40px' }}>No products data available</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #f0e4d8' }}>
                                            <th style={{ textAlign: 'left', padding: '12px', color: '#5c3a28' }}>Product</th>
                                            <th style={{ textAlign: 'right', padding: '12px', color: '#5c3a28' }}>Price</th>
                                            <th style={{ textAlign: 'right', padding: '12px', color: '#5c3a28' }}>Stock</th>
                                            <th style={{ textAlign: 'center', padding: '12px', color: '#5c3a28' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.products.map((product, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f0e4d8' }}>
                                                <td style={{ padding: '12px', color: '#2d1f12' }}>{product.name}</td>
                                                <td style={{ textAlign: 'right', padding: '12px', color: '#9a3412', fontWeight: '600' }}>
                                                    Rs. {product.price?.toLocaleString() || 0}
                                                </td>
                                                <td style={{ textAlign: 'right', padding: '12px', color: '#2d1f12' }}>
                                                    {product.stock || 0}
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '12px' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '11px',
                                                        backgroundColor: product.isActive !== false ? '#d1fae5' : '#fee2e2',
                                                        color: product.isActive !== false ? '#059669' : '#dc2626'
                                                    }}>
                                                        {product.isActive !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {reportType === 'users' && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: '#2d1f12' }}>
                                Customer List
                            </h3>
                            {!reportData.users || reportData.users.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#8b6b58', padding: '40px' }}>No users data available</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #f0e4d8' }}>
                                            <th style={{ textAlign: 'left', padding: '12px', color: '#5c3a28' }}>Name</th>
                                            <th style={{ textAlign: 'left', padding: '12px', color: '#5c3a28' }}>Email</th>
                                            <th style={{ textAlign: 'center', padding: '12px', color: '#5c3a28' }}>Status</th>
                                            <th style={{ textAlign: 'right', padding: '12px', color: '#5c3a28' }}>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.users.map((user, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f0e4d8' }}>
                                                <td style={{ padding: '12px', color: '#2d1f12' }}>{user.name || 'N/A'}</td>
                                                <td style={{ padding: '12px', color: '#2d1f12' }}>{user.email}</td>
                                                <td style={{ textAlign: 'center', padding: '12px' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '11px',
                                                        backgroundColor: user.isActive !== false ? '#d1fae5' : '#fee2e2',
                                                        color: user.isActive !== false ? '#059669' : '#dc2626'
                                                    }}>
                                                        {user.isActive !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right', padding: '12px', color: '#8b6b58' }}>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @media print {
                    .sidebar, .report-controls {
                        display: none !important;
                    }
                    .main-content {
                        margin-left: 0 !important;
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Reports;