import React, { useState, useEffect } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import { 
    FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, 
    FiImage, FiRefreshCw, FiEye
} from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            console.log('📤 Fetching seller products...');
            const response = await API.get('/seller/products');
            console.log('📥 Products response:', response.data);
            
            if (response.data.success) {
                setProducts(response.data.data || []);
                // Extract unique categories
                const uniqueCategories = [...new Set(response.data.data.map(p => p.category))];
                setCategories(uniqueCategories);
            } else {
                toast.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
        
        try {
            const response = await API.delete(`/seller/products/${id}`);
            if (response.data.success) {
                toast.success('Product deleted successfully');
                fetchProducts();
            }
        } catch (error) {
            console.error('❌ Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete product');
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

    const filteredProducts = products.filter(product => {
        const matchesSearch = searchTerm === '' || 
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="app-layout">
            <SellerSidebar />
            
            <div className="main-content-container">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>My Products</h1>
                        <p style={{ color: '#8b6b58' }}>Manage your resin art products</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={fetchProducts}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FiRefreshCw /> Refresh
                        </button>
                        <button
                            onClick={() => navigate('/seller/add-product')}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FiPlus /> Add New Product
                        </button>
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
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>

                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <FiFilter style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#b88d6e'
                        }} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="input"
                            style={{ paddingLeft: '40px' }}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
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
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '48px' }}>
                                                <div style={{ fontSize: '18px', marginBottom: '8px', color: '#8b6b58' }}>
                                                    No products found
                                                </div>
                                                <button
                                                    onClick={() => navigate('/seller/add-product')}
                                                    className="btn-primary"
                                                    style={{ marginTop: '16px', padding: '8px 20px', fontSize: '13px' }}
                                                >
                                                    Add Your First Product
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map(product => (
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
                                                </td>
                                                <td>
                                                    <span style={{
                                                        backgroundColor: '#fef7f0',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        color: '#5c3a28'
                                                    }}>
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: '600', color: '#9a3412' }}>
                                                    Rs. {product.price?.toLocaleString()}
                                                </td>
                                                <td>
                                                    <span style={{
                                                        color: product.stock > 0 ? '#10b981' : '#ef4444',
                                                        fontWeight: '500'
                                                    }}>
                                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        backgroundColor: product.isActive ? '#d1fae5' : '#fee2e2',
                                                        color: product.isActive ? '#065f46' : '#991b1b',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px'
                                                    }}>
                                                        {product.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                                                            className="btn-secondary"
                                                            style={{ padding: '8px', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            title="Edit"
                                                        >
                                                            <FiEdit2 size={16} color="#5c3a28" />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/seller/products/${product._id}`)}
                                                            className="btn-secondary"
                                                            style={{ padding: '8px', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0f2fe' }}
                                                            title="View Details"
                                                        >
                                                            <FiEye size={16} color="#0369a1" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id, product.name)}
                                                            style={{ padding: '8px', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', cursor: 'pointer' }}
                                                            title="Delete"
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
                )}
            </div>
        </div>
    );
};

export default SellerProducts;