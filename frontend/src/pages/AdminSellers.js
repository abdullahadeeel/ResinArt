import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { 
    FiUsers, FiSearch, FiCheckCircle, FiXCircle, 
    FiEdit2, FiTrash2, FiEye, FiRefreshCw, FiUserCheck,
    FiUserX, FiPackage, FiDollarSign, FiStar, FiX
} from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const AdminSellers = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        setLoading(true);
        try {
            console.log('📤 Fetching sellers...');
            const response = await API.get('/admin/sellers');
            console.log('📥 Sellers response:', response.data);
            
            if (response.data.success) {
                setSellers(response.data.data || []);
                toast.success(`Loaded ${response.data.data.length} sellers`);
            } else {
                toast.error(response.data.message || 'Failed to fetch sellers');
            }
        } catch (error) {
            console.error('❌ Error fetching sellers:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch sellers');
            setSellers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (sellerId, currentStatus) => {
        try {
            const response = await API.put(`/admin/sellers/${sellerId}/approve`, {
                isApproved: !currentStatus
            });
            
            if (response.data.success) {
                toast.success(`Seller ${!currentStatus ? 'approved' : 'rejected'} successfully`);
                fetchSellers();
            }
        } catch (error) {
            console.error('❌ Error updating seller:', error);
            toast.error(error.response?.data?.message || 'Failed to update seller');
        }
    };

    const handleDelete = async (sellerId, sellerName) => {
        if (!window.confirm(`Are you sure you want to delete seller "${sellerName}"? This will also delete all their products.`)) {
            return;
        }
        
        try {
            const response = await API.delete(`/admin/sellers/${sellerId}`);
            
            if (response.data.success) {
                toast.success('Seller deleted successfully');
                fetchSellers();
            }
        } catch (error) {
            console.error('❌ Error deleting seller:', error);
            toast.error(error.response?.data?.message || 'Failed to delete seller');
        }
    };

    const viewDetails = async (seller) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                return;
            }
            
            console.log('📤 Fetching details for seller:', seller._id);
            
            const response = await API.get(`/admin/sellers/${seller._id}`);
            
            console.log('📥 Seller details response:', response.data);
            
            if (response.data.success) {
                setSelectedSeller(response.data.data);
                setShowDetails(true);
            } else {
                toast.error('Failed to load seller details');
            }
        } catch (error) {
            console.error('❌ Error fetching seller details:', error);
            toast.error(error.response?.data?.message || 'Failed to load seller details');
        }
    };

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

    const filteredSellers = sellers.filter(seller => {
        const matchesSearch = 
            seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterStatus === 'pending') return matchesSearch && !seller.isApproved;
        if (filterStatus === 'approved') return matchesSearch && seller.isApproved;
        return matchesSearch;
    });

    const pendingCount = sellers.filter(s => !s.isApproved).length;
    const approvedCount = sellers.filter(s => s.isApproved).length;
    // ✅ FIXED: Total Products calculation
    const totalProducts = sellers.reduce((acc, s) => acc + (s.productsCount || s.products?.length || 0), 0);

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
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>Sellers Management</h1>
                        <p style={{ color: '#8b6b58' }}>
                            Manage all sellers | Pending approvals: {pendingCount}
                        </p>
                    </div>
                    
                    <button
                        onClick={fetchSellers}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FiRefreshCw /> Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="dashboard-stats" style={{ marginBottom: '24px' }}>
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>Total Sellers</p>
                                <h2 style={{ fontSize: '32px', margin: 0, color: '#2d1f12' }}>{sellers.length}</h2>
                            </div>
                            <div style={{
                                backgroundColor: '#3b82f6',
                                padding: '12px',
                                borderRadius: '16px',
                                color: 'white'
                            }}>
                                <FiUsers size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>Pending Approval</p>
                                <h2 style={{ fontSize: '32px', margin: 0, color: '#f59e0b' }}>{pendingCount}</h2>
                            </div>
                            <div style={{
                                backgroundColor: '#f59e0b',
                                padding: '12px',
                                borderRadius: '16px',
                                color: 'white'
                            }}>
                                <FiUserX size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>Approved</p>
                                <h2 style={{ fontSize: '32px', margin: 0, color: '#10b981' }}>{approvedCount}</h2>
                            </div>
                            <div style={{
                                backgroundColor: '#10b981',
                                padding: '12px',
                                borderRadius: '16px',
                                color: 'white'
                            }}>
                                <FiUserCheck size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', marginBottom: '8px' }}>Total Products</p>
                                <h2 style={{ fontSize: '32px', margin: 0, color: '#2d1f12' }}>{totalProducts}</h2>
                            </div>
                            <div style={{
                                backgroundColor: '#8b5cf6',
                                padding: '12px',
                                borderRadius: '16px',
                                color: 'white'
                            }}>
                                <FiPackage size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-container">
                    <div style={{ flex: 2, minWidth: '250px', position: 'relative' }}>
                        <FiSearch style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#b88d6e'
                        }} />
                        <input
                            type="text"
                            placeholder="Search by name, email or shop name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Sellers</option>
                            <option value="pending">Pending Approval</option>
                            <option value="approved">Approved</option>
                        </select>
                    </div>
                </div>

                {/* Sellers Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table style={{ minWidth: '800px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#fef7f0', borderBottom: '2px solid #f0e4d8' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Seller</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Shop</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Contact</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Products</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Joined</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSellers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: '#8b6b58' }}>
                                            No sellers found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSellers.map(seller => (
                                        <tr key={seller._id} style={{ borderBottom: '1px solid #f0e4d8' }}>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    {seller.profileImage ? (
                                                        <img
                                                            src={getImageUrl(seller.profileImage)}
                                                            alt={seller.name}
                                                            style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#f59e0b',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {seller.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div style={{ fontWeight: '500', color: '#2d1f12' }}>{seller.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#8b6b58' }}>
                                                            {seller.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ fontWeight: '500', color: '#2d1f12' }}>{seller.shopName}</div>
                                                {seller.shopDescription && (
                                                    <div style={{ fontSize: '12px', color: '#8b6b58' }}>
                                                        {seller.shopDescription.substring(0, 40)}...
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px', color: '#5c3a28' }}>
                                                {seller.phone || 'N/A'}
                                            </td>
                                            {/* ✅ FIXED: Products column */}
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <span style={{
                                                    backgroundColor: '#fef7f0',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    color: '#5c3a28'
                                                }}>
                                                    {seller.productsCount || seller.products?.length || 0}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                {!seller.isApproved ? (
                                                    <span style={{
                                                        backgroundColor: '#fff7ed',
                                                        color: '#9a3412',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <FiXCircle size={12} /> Pending
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        backgroundColor: '#d1fae5',
                                                        color: '#065f46',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <FiCheckCircle size={12} /> Approved
                                                    </span>
                                                )}
                                                {seller.isActive === false && (
                                                    <span style={{
                                                        marginLeft: '8px',
                                                        backgroundColor: '#fee2e2',
                                                        color: '#991b1b',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px'
                                                    }}>
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#8b6b58' }}>
                                                {new Date(seller.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => viewDetails(seller)}
                                                        className="btn-secondary"
                                                        style={{ padding: '8px', borderRadius: '40px' }}
                                                        title="View Details"
                                                    >
                                                        <FiEye size={16} color="#5c3a28" />
                                                    </button>
                                                    
                                                    {!seller.isApproved ? (
                                                        <button
                                                            onClick={() => handleApprove(seller._id, seller.isApproved)}
                                                            style={{
                                                                padding: '8px',
                                                                borderRadius: '40px',
                                                                backgroundColor: '#d1fae5',
                                                                border: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Approve Seller"
                                                        >
                                                            <FiCheckCircle size={16} color="#065f46" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleApprove(seller._id, seller.isApproved)}
                                                            style={{
                                                                padding: '8px',
                                                                borderRadius: '40px',
                                                                backgroundColor: '#fee2e2',
                                                                border: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Reject Seller"
                                                        >
                                                            <FiXCircle size={16} color="#991b1b" />
                                                        </button>
                                                    )}
                                                    
                                                    <button
                                                        onClick={() => handleDelete(seller._id, seller.name)}
                                                        style={{
                                                            padding: '8px',
                                                            borderRadius: '40px',
                                                            backgroundColor: '#fee2e2',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        title="Delete Seller"
                                                    >
                                                        <FiTrash2 size={16} color="#ef4444" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Seller Details Modal */}
                {showDetails && selectedSeller && (
                    <div className="modal-overlay" onClick={() => setShowDetails(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                            backgroundColor: 'white',
                            borderRadius: '28px',
                            padding: '32px',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px'
                            }}>
                                <h2 style={{ margin: 0, color: '#2d1f12' }}>Seller Details</h2>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '24px',
                                        cursor: 'pointer',
                                        color: '#8b6b58'
                                    }}
                                >
                                    <FiX />
                                </button>
                            </div>

                            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                                {selectedSeller.profileImage ? (
                                    <img
                                        src={getImageUrl(selectedSeller.profileImage)}
                                        alt={selectedSeller.name}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f59e0b',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '36px',
                                        fontWeight: 'bold',
                                        margin: '0 auto'
                                    }}>
                                        {selectedSeller.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className="table-responsive">
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28', width: '40%' }}>Name:</td><td style={{ padding: '12px', color: '#2d1f12' }}>{selectedSeller.name}</td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Email:</td><td style={{ padding: '12px', color: '#2d1f12' }}>{selectedSeller.email}</td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Phone:</td><td style={{ padding: '12px', color: '#2d1f12' }}>{selectedSeller.phone || 'N/A'}</td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Shop Name:</td><td style={{ padding: '12px', color: '#2d1f12' }}>{selectedSeller.shopName}</td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Shop Description:</td><td style={{ padding: '12px', color: '#2d1f12' }}>{selectedSeller.shopDescription || 'N/A'}</td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Address:</td><td style={{ padding: '12px', color: '#2d1f12' }}>
                                            {selectedSeller.address ? (
                                                <>
                                                    {selectedSeller.address.street && <div>{selectedSeller.address.street}</div>}
                                                    {selectedSeller.address.city && <div>{selectedSeller.address.city}</div>}
                                                    {selectedSeller.address.state && <div>{selectedSeller.address.state}</div>}
                                                    {selectedSeller.address.zipCode && <div>{selectedSeller.address.zipCode}</div>}
                                                    {selectedSeller.address.country && <div>{selectedSeller.address.country}</div>}
                                                </>
                                            ) : 'N/A'}
                                        </td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Status:</td><td style={{ padding: '12px', color: '#2d1f12' }}>
                                            {selectedSeller.isApproved ? (
                                                <span style={{ color: '#10b981' }}>Approved</span>
                                            ) : (
                                                <span style={{ color: '#f59e0b' }}>Pending Approval</span>
                                            )}
                                            {selectedSeller.isActive === false && (
                                                <span style={{ color: '#ef4444', marginLeft: '8px' }}>Inactive</span>
                                            )}
                                        </td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Products:</td><td style={{ padding: '12px', color: '#2d1f12' }}>{selectedSeller?.productsCount || selectedSeller?.products?.length || 0}</td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Total Sales:</td><td style={{ padding: '12px', color: '#2d1f12' }}>{selectedSeller.totalSales || 0}</td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Total Revenue:</td><td style={{ padding: '12px', color: '#9a3412', fontWeight: '500' }}>Rs. {selectedSeller.totalRevenue?.toLocaleString() || 0}</td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Rating:</td><td style={{ padding: '12px', color: '#2d1f12' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {[1,2,3,4,5].map(star => (
                                                    <FiStar
                                                        key={star}
                                                        color={star <= (selectedSeller.rating || 0) ? '#f59e0b' : '#d1d5db'}
                                                        fill={star <= (selectedSeller.rating || 0) ? '#f59e0b' : 'none'}
                                                        size={16}
                                                    />
                                                ))}
                                                <span style={{ marginLeft: '8px', color: '#9a3412' }}>
                                                    {selectedSeller.rating?.toFixed(1) || 0}
                                                </span>
                                            </div>
                                        </td></tr>
                                        <tr><td style={{ padding: '12px', fontWeight: 'bold', color: '#5c3a28' }}>Joined:</td><td style={{ padding: '12px', color: '#8b6b58' }}>
                                            {new Date(selectedSeller.createdAt).toLocaleDateString()}
                                        </td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                marginTop: '24px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="btn-secondary"
                                >
                                    Close
                                </button>
                                {!selectedSeller.isApproved && (
                                    <button
                                        onClick={() => {
                                            handleApprove(selectedSeller._id, selectedSeller.isApproved);
                                            setShowDetails(false);
                                        }}
                                        className="btn-primary"
                                    >
                                        Approve Seller
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSellers;