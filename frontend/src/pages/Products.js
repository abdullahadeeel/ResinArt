import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { 
    FiEdit2, FiTrash2, FiSearch, FiFilter, FiImage,
    FiCheckCircle, FiXCircle, FiClock, FiPlus
} from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await API.get('/admin/products');
            if (response.data.success) {
                setProducts(response.data.data);
                console.log('✅ Products loaded:', response.data.data.length);
            } else {
                toast.error(response.data?.message || 'Failed to fetch products');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const approveProduct = async (id) => {
        try {
            const response = await API.put(`/admin/products/${id}/approve`);
            if (response.data.success) {
                toast.success('Product approved successfully');
                fetchProducts();
            }
        } catch (error) {
            console.error('Approve error:', error);
            toast.error('Failed to approve product');
        }
    };

    const rejectProduct = async (id) => {
        try {
            const response = await API.put(`/admin/products/${id}/reject`);
            if (response.data.success) {
                toast.success('Product rejected');
                fetchProducts();
            }
        } catch (error) {
            console.error('Reject error:', error);
            toast.error('Failed to reject product');
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const response = await API.delete(`/admin/products/${id}`);
            if (response.data.success) {
                toast.success('Product deleted successfully');
                fetchProducts();
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete product');
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

    const getStatusBadge = (product) => {
        if (!product.isApproved) {
            return { bg: '#fff7ed', color: '#9a3412', text: 'Pending Approval', icon: <FiClock size={12} /> };
        }
        if (product.isActive) {
            return { bg: '#d1fae5', color: '#065f46', text: 'Active', icon: <FiCheckCircle size={12} /> };
        }
        return { bg: '#fee2e2', color: '#991b1b', text: 'Inactive', icon: <FiXCircle size={12} /> };
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              product.sellerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'pending' && !product.isApproved) ||
            (statusFilter === 'approved' && product.isApproved && product.isActive) ||
            (statusFilter === 'rejected' && !product.isApproved && !product.isActive);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="app-layout">
            <Sidebar />
            
            <div className="main-content-container">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>Products</h1>
                        <p style={{ color: '#8b6b58' }}>Manage all resin art products</p>
                    </div>
                    
                    <button
                        onClick={() => navigate('/add-product')}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FiPlus /> Add New Product
                    </button>
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
                            placeholder="Search by name or seller..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">⏳ Pending Approval</option>
                            <option value="approved">✅ Approved</option>
                            <option value="rejected">❌ Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Seller</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '48px' }}>
                                                <div style={{ fontSize: '18px', marginBottom: '8px', color: '#8b6b58' }}>No products found</div>
                                                <div style={{ fontSize: '14px', color: '#b88d6e' }}>
                                                    {products.length === 0 
                                                        ? 'Click "Add New Product" to create your first product.'
                                                        : 'Try adjusting your search or filter.'}
                                                </div>
                                                <button
                                                    onClick={() => navigate('/add-product')}
                                                    className="btn-primary"
                                                    style={{ marginTop: '16px', padding: '8px 20px', fontSize: '13px' }}
                                                >
                                                    Add New Product
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map(product => {
                                            const status = getStatusBadge(product);
                                            return (
                                                <tr key={product._id}>
                                                    <td>
                                                        {product.images && product.images[0] ? (
                                                            <img
                                                                src={getImageUrl(product.images[0])}
                                                                alt={product.name}
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '12px',
                                                                    border: '1px solid #f0e4d8'
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://placehold.co/50x50/fef3e8/9a3412?text=No+Image';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                backgroundColor: '#fef7f0',
                                                                borderRadius: '12px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#b88d6e'
                                                            }}>
                                                                <FiImage size={24} />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ fontWeight: '500', color: '#2d1f12' }}>
                                                        {product.name}
                                                        <div style={{ fontSize: '11px', color: '#b88d6e', marginTop: '4px' }}>
                                                            ID: {product._id?.substring(0, 8)}...
                                                        </div>
                                                    </td>
                                                    <td style={{ color: '#5c3a28' }}>
                                                        {product.sellerName || 'Admin'}
                                                    </td>
                                                    <td style={{ fontWeight: '600', color: '#9a3412' }}>
                                                        Rs. {product.price?.toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            backgroundColor: status.bg,
                                                            color: status.color,
                                                            padding: '4px 12px',
                                                            borderRadius: '30px',
                                                            fontSize: '12px',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            fontWeight: '500'
                                                        }}>
                                                            {status.icon} {status.text}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                            {!product.isApproved && (
                                                                <>
                                                                    <button
                                                                        onClick={() => approveProduct(product._id)}
                                                                        className="btn-primary"
                                                                        style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#10b981' }}
                                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => rejectProduct(product._id)}
                                                                        className="btn-primary"
                                                                        style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#ef4444' }}
                                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button
                                                                onClick={() => navigate(`/edit-product/${product._id}`)}
                                                                className="btn-secondary"
                                                                style={{ padding: '8px', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            >
                                                                <FiEdit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteProduct(product._id)}
                                                                style={{ padding: '8px', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', cursor: 'pointer' }}
                                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#fecaca'}
                                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#fee2e2'}
                                                            >
                                                                <FiTrash2 size={16} color="#ef4444" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;