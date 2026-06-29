import React, { useState, useEffect } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import { 
    FiDollarSign, FiTrendingUp, FiClock, FiCheckCircle,
    FiPackage, FiDownload, FiBarChart2, FiRefreshCw, FiInfo
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
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SellerEarnings = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [earnings, setEarnings] = useState({
        totalEarnings: 0,      // Gross amount
        totalDeductions: 0,    // TCS deductions
        netEarnings: 0,        // Net amount after deductions
        pendingEarnings: 0,
        completedEarnings: 0,
        ordersCount: 0,
        earningsByMonth: [],
        earningsByProduct: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('📤 Fetching earnings...');
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please login again.');
                setTimeout(() => navigate('/seller/login'), 2000);
                return;
            }

            const response = await API.get('/seller/earnings');
            console.log('📥 Earnings response:', response.data);
            
            if (response.data && response.data.success) {
                const data = response.data.data || {};
                setEarnings({
                    totalEarnings: data.totalEarnings || 0,
                    totalDeductions: data.totalDeductions || 0,
                    netEarnings: data.netEarnings || 0,
                    pendingEarnings: data.pendingEarnings || 0,
                    completedEarnings: data.completedEarnings || 0,
                    ordersCount: data.ordersCount || 0,
                    earningsByMonth: Array.isArray(data.earningsByMonth) ? data.earningsByMonth : [],
                    earningsByProduct: Array.isArray(data.earningsByProduct) ? data.earningsByProduct : []
                });
                toast.success('Earnings data loaded!');
            } else {
                setError(response.data?.message || 'Failed to load earnings data');
                toast.error(response.data?.message || 'Failed to load earnings data');
            }
        } catch (error) {
            console.error('❌ Earnings error:', error);
            
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => navigate('/seller/login'), 2000);
            } else if (error.response?.status === 403) {
                setError('Your account is pending admin approval.');
            } else if (error.code === 'ERR_NETWORK') {
                setError('Cannot connect to server. Please check if backend is running.');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch earnings data');
            }
            
            toast.error(error.response?.data?.message || 'Failed to fetch earnings data');
        } finally {
            setLoading(false);
        }
    };

    const monthlyChartData = {
        labels: earnings.earningsByMonth && earnings.earningsByMonth.length > 0 
            ? earnings.earningsByMonth.map(item => item?.month || '') 
            : [],
        datasets: [
            {
                label: 'Monthly Earnings (PKR)',
                data: earnings.earningsByMonth && earnings.earningsByMonth.length > 0 
                    ? earnings.earningsByMonth.map(item => item?.earnings || 0) 
                    : [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const productChartData = {
        labels: earnings.earningsByProduct && earnings.earningsByProduct.length > 0 
            ? earnings.earningsByProduct.map(item => item?.productName || 'Unknown') 
            : [],
        datasets: [
            {
                label: 'Earnings by Product',
                data: earnings.earningsByProduct && earnings.earningsByProduct.length > 0 
                    ? earnings.earningsByProduct.map(item => item?.earnings || 0) 
                    : [],
                backgroundColor: [
                    '#f59e0b',
                    '#3b82f6',
                    '#10b981',
                    '#8b5cf6',
                    '#ef4444'
                ],
                borderRadius: 8
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
                        return `Earnings: Rs. ${context.raw.toLocaleString()}`;
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

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Earnings: Rs. ${context.raw.toLocaleString()}`;
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
                    color: '#8b6b58',
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: {
                    display: false
                }
            }
        }
    };

    const formatCurrency = (amount) => {
        return `Rs. ${amount?.toLocaleString() || 0}`;
    };

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
                        <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Error Loading Earnings</h2>
                        <p style={{ color: '#8b6b58', marginBottom: '24px' }}>{error}</p>
                        <button
                            onClick={fetchEarnings}
                            className="btn-primary"
                        >
                            Try Again
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
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>💰 Earnings</h1>
                        <p style={{ color: '#8b6b58' }}>Track your revenue and TCS deductions</p>
                    </div>
                    
                    <button
                        onClick={fetchEarnings}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#10b981' }}
                    >
                        <FiRefreshCw /> Refresh
                    </button>
                </div>

                {/* Stats Cards - Updated with Net Earnings */}
                <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>Gross Sales</p>
                                <h2 style={{ fontSize: '28px', margin: 0, color: '#9a3412' }}>
                                    {formatCurrency(earnings.totalEarnings)}
                                </h2>
                                <p style={{ fontSize: '11px', color: '#8b6b58' }}>Before TCS deductions</p>
                            </div>
                            <div style={{
                                backgroundColor: '#9a3412',
                                padding: '12px',
                                borderRadius: '16px',
                                color: 'white'
                            }}>
                                <FiDollarSign size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>TCS Deductions</p>
                                <h2 style={{ fontSize: '28px', margin: 0, color: '#f59e0b' }}>
                                    {formatCurrency(earnings.totalDeductions)}
                                </h2>
                                <p style={{ fontSize: '11px', color: '#8b6b58' }}>Shipping + COD charges</p>
                            </div>
                            <div style={{
                                backgroundColor: '#f59e0b',
                                padding: '12px',
                                borderRadius: '16px',
                                color: 'white'
                            }}>
                                <FiInfo size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>Net Earnings</p>
                                <h2 style={{ fontSize: '28px', margin: 0, color: '#10b981' }}>
                                    {formatCurrency(earnings.netEarnings)}
                                </h2>
                                <p style={{ fontSize: '11px', color: '#10b981' }}>After TCS deductions</p>
                            </div>
                            <div style={{
                                backgroundColor: '#10b981',
                                padding: '12px',
                                borderRadius: '16px',
                                color: 'white'
                            }}>
                                <FiCheckCircle size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>Total Orders</p>
                                <h2 style={{ fontSize: '28px', margin: 0 }}>{earnings.ordersCount}</h2>
                                <p style={{ fontSize: '11px', color: '#8b6b58' }}>Delivered orders</p>
                            </div>
                            <div style={{
                                backgroundColor: '#3b82f6',
                                padding: '12px',
                                borderRadius: '16px',
                                color: 'white'
                            }}>
                                <FiPackage size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '24px',
                    marginBottom: '24px'
                }}>
                    {/* Monthly Earnings Chart */}
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#2d1f12' }}>
                            <FiTrendingUp /> Monthly Earnings Trend
                        </h3>
                        <div style={{ height: '300px' }}>
                            {earnings.earningsByMonth && earnings.earningsByMonth.length > 0 ? (
                                <Line data={monthlyChartData} options={chartOptions} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#b88d6e' }}>
                                    No earnings data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Earnings Chart */}
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#2d1f12' }}>
                            <FiBarChart2 /> Top Products
                        </h3>
                        <div style={{ height: '300px' }}>
                            {earnings.earningsByProduct && earnings.earningsByProduct.length > 0 ? (
                                <Bar data={productChartData} options={barChartOptions} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#b88d6e' }}>
                                    No product earnings data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Earnings Table */}
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#2d1f12' }}>Product-wise Earnings</h3>
                    
                    {!earnings.earningsByProduct || earnings.earningsByProduct.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#8b6b58', padding: '32px' }}>
                            No earnings data available yet
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table style={{ minWidth: '500px' }}>
                                <thead>
                                    <tr style={{
                                        backgroundColor: '#fef7f0',
                                        borderBottom: '2px solid #f0e4d8'
                                    }}>
                                        <th style={{ padding: '12px', textAlign: 'left', color: '#5c3a28' }}>Product</th>
                                        <th style={{ padding: '12px', textAlign: 'right', color: '#5c3a28' }}>Gross Earnings</th>
                                        <th style={{ padding: '12px', textAlign: 'right', color: '#5c3a28' }}>% of Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {earnings.earningsByProduct.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #f0e4d8' }}>
                                            <td style={{ padding: '12px', color: '#2d1f12' }}>{item?.productName || 'Unknown'}</td>
                                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500', color: '#9a3412' }}>
                                                {formatCurrency(item?.earnings || 0)}
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right', color: '#8b6b58' }}>
                                                {earnings.totalEarnings > 0 ? 
                                                    (((item?.earnings || 0) / earnings.totalEarnings) * 100).toFixed(1) : 0}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* TCS Information Note */}
                <div className="card" style={{ padding: '20px', marginTop: '20px', backgroundColor: '#fefaf5', border: '1px solid #f0e4d8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FiInfo size={20} style={{ color: '#9a3412' }} />
                        <div>
                            <p style={{ fontSize: '13px', color: '#2d1f12', margin: 0 }}>
                                <strong>Note:</strong> Net Earnings = Product Price - TCS Shipping Charges - TCS COD Charges
                            </p>
                            <p style={{ fontSize: '12px', color: '#8b6b58', margin: '5px 0 0 0' }}>
                                TCS will deduct shipping and COD charges before transferring the amount to your bank account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerEarnings;