// frontend/src/pages/seller/SellerEditProduct.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';
import RecipeBuilder from '../../components/RecipeBuilder';
import { FiSave, FiX, FiUpload, FiImage, FiTrash2, FiPackage, FiEdit } from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';

const SellerEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showBOM, setShowBOM] = useState(false);
    const [activeTab, setActiveTab] = useState('product'); // 'product' or 'bom'
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Trays',
        images: [],
        imagePreviews: [],
        stock: '',
        isActive: true
    });
    const [existingImages, setExistingImages] = useState([]);
    const [productName, setProductName] = useState('');

    const categories = ['Trays', 'Coasters', 'Jewelry', 'Nameplates', 'Home Decor', 'Gifts', 'Other'];

    useEffect(() => {
        fetchProduct();
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

    const fetchProduct = async () => {
        setFetchLoading(true);
        try {
            console.log('📤 Fetching product:', id);
            const response = await API.get('/seller/products');
            
            if (response.data.success) {
                const product = response.data.data.find(p => p._id === id);
                
                if (product) {
                    console.log('✅ Product found:', product);
                    setExistingImages(product.images || []);
                    setProductName(product.name || '');
                    setFormData({
                        name: product.name || '',
                        description: product.description || '',
                        price: product.price || '',
                        category: product.category || 'Trays',
                        images: [],
                        imagePreviews: [],
                        stock: product.stock || '',
                        isActive: product.isActive !== undefined ? product.isActive : true
                    });
                } else {
                    toast.error('Product not found');
                    navigate('/seller/products');
                }
            }
        } catch (error) {
            console.error('❌ Error fetching product:', error);
            toast.error('Failed to fetch product');
            navigate('/seller/products');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        console.log('📸 Files selected:', files.length);
        
        const newImages = [...formData.images, ...files];
        const newPreviews = files.map(file => URL.createObjectURL(file));
        
        setFormData({
            ...formData,
            images: newImages,
            imagePreviews: [...formData.imagePreviews, ...newPreviews]
        });
        
        toast.success(`${files.length} new image(s) selected`);
    };

    const removeNewImage = (index) => {
        const newImages = [...formData.images];
        const newPreviews = [...formData.imagePreviews];
        
        URL.revokeObjectURL(newPreviews[index]);
        
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setFormData({
            ...formData,
            images: newImages,
            imagePreviews: newPreviews
        });
    };

    const removeExistingImage = (index) => {
        const newExistingImages = [...existingImages];
        newExistingImages.splice(index, 1);
        setExistingImages(newExistingImages);
        toast.success('Image removed');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.price || !formData.category) {
            toast.error('Please fill all required fields');
            setLoading(false);
            return;
        }

        if (formData.price <= 0) {
            toast.error('Price must be greater than 0');
            setLoading(false);
            return;
        }

        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('price', String(formData.price));
        formDataToSend.append('category', formData.category);
        formDataToSend.append('stock', String(formData.stock || 0));
        formDataToSend.append('isActive', String(formData.isActive));
        
        // Send existing images URLs
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
        
        // Append new images
        formData.images.forEach((image, index) => {
            console.log(`📸 Appending new image ${index}:`, image.name);
            formDataToSend.append('newImages', image);
        });

        console.log('📤 Updating product with', formData.images.length, 'new images');

        try {
            const response = await API.put(`/seller/products/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                toast.success('Product updated successfully!');
                // Refresh product data
                await fetchProduct();
                toast.success('You can now update BOM');
            } else {
                toast.error(response.data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    const handleBOMSaveComplete = () => {
        toast.success('BOM saved successfully!');
    };

    if (fetchLoading) {
        return (
            <div className="app-layout">
                <SellerSidebar />
                <div className="main-content-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loading-spinner"></div>
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
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>
                            Edit Product: {productName}
                        </h1>
                        <p style={{ color: '#8b6b58' }}>
                            Update product details or manage raw materials (BOM)
                        </p>
                    </div>
                    
                    <button
                        onClick={() => navigate('/seller/products')}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FiX /> Cancel
                    </button>
                </div>

                {/* Tab Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '0',
                    marginBottom: '24px',
                    borderBottom: '2px solid #f0e4d8',
                    backgroundColor: 'white',
                    borderRadius: '12px 12px 0 0',
                    overflow: 'hidden'
                }}>
                    <button
                        onClick={() => setActiveTab('product')}
                        style={{
                            padding: '14px 24px',
                            backgroundColor: activeTab === 'product' ? '#fefaf5' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: activeTab === 'product' ? '600' : '500',
                            color: activeTab === 'product' ? '#9a3412' : '#8b6b58',
                            borderBottom: activeTab === 'product' ? '3px solid #9a3412' : '3px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <FiEdit size={18} />
                        Product Details
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('bom')}
                        style={{
                            padding: '14px 24px',
                            backgroundColor: activeTab === 'bom' ? '#fefaf5' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: activeTab === 'bom' ? '600' : '500',
                            color: activeTab === 'bom' ? '#9a3412' : '#8b6b58',
                            borderBottom: activeTab === 'bom' ? '3px solid #9a3412' : '3px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <FiPackage size={18} />
                        Raw Materials (BOM)
                    </button>
                </div>

                {/* Product Details Tab */}
                {activeTab === 'product' && (
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            {/* Product Name */}
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    Product Name <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Resin Art Tray"
                                    className="input"
                                    style={{ borderRadius: '20px', padding: '12px 16px', border: '1px solid #e5d5cc' }}
                                />
                            </div>

                            {/* Description */}
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Describe your product..."
                                    className="input"
                                    style={{ borderRadius: '20px', resize: 'vertical', padding: '12px 16px', border: '1px solid #e5d5cc' }}
                                />
                            </div>

                            {/* Price and Category */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                        Price (PKR) <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        placeholder="1000"
                                        className="input"
                                        style={{ borderRadius: '20px', padding: '12px 16px', border: '1px solid #e5d5cc' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                        Category <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                        style={{ borderRadius: '20px', padding: '12px 16px', border: '1px solid #e5d5cc' }}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="10"
                                    className="input"
                                    style={{ borderRadius: '20px', padding: '12px 16px', border: '1px solid #e5d5cc' }}
                                />
                            </div>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                        Current Images
                                    </label>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                        gap: '12px'
                                    }}>
                                        {existingImages.map((img, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <img
                                                    src={getImageUrl(img)}
                                                    alt={`Existing ${index + 1}`}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '12px',
                                                        border: '1px solid #f0e4d8'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/80x80/fef3e8/9a3412?text=No+Image';
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-8px',
                                                        right: '-8px',
                                                        backgroundColor: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '24px',
                                                        height: '24px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Image Upload */}
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    Add New Images
                                </label>
                                
                                <div
                                    style={{
                                        border: '2px dashed #e5d5cc',
                                        borderRadius: '20px',
                                        padding: '24px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: '#fefaf5',
                                        marginBottom: '16px',
                                        transition: 'all 0.3s'
                                    }}
                                    onClick={() => document.getElementById('image-upload').click()}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9a3412'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5d5cc'}
                                >
                                    <FiUpload size={32} style={{ color: '#b88d6e', marginBottom: '12px' }} />
                                    <p style={{ color: '#8b6b58', margin: 0 }}>
                                        Click to upload new images
                                    </p>
                                    <p style={{ color: '#b88d6e', fontSize: '12px', marginTop: '8px' }}>
                                        JPG, PNG, GIF (Max 5MB each)
                                    </p>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {/* New Image Previews */}
                                {formData.imagePreviews.length > 0 && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                        gap: '12px',
                                        marginTop: '16px'
                                    }}>
                                        {formData.imagePreviews.map((img, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <img
                                                    src={img}
                                                    alt={`New Preview ${index + 1}`}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '12px',
                                                        border: '1px solid #f0e4d8'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-8px',
                                                        right: '-8px',
                                                        backgroundColor: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '24px',
                                                        height: '24px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Active Checkbox */}
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span style={{ color: '#5c3a28' }}>Active (visible to customers)</span>
                                </label>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <FiSave /> {loading ? 'Updating...' : 'Update Product'}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => navigate('/seller/products')}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* BOM Tab */}
                {activeTab === 'bom' && (
                    <div>
                        {/* Info Banner */}
                        <div style={{
                            backgroundColor: '#fef3c7',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: '1px solid #fde68a'
                        }}>
                            <FiPackage size={24} style={{ color: '#d97706' }} />
                            <div>
                                <strong style={{ color: '#92400e' }}>Raw Materials (Bill of Materials)</strong>
                                <p style={{ color: '#92400e', margin: '4px 0 0 0', fontSize: '14px' }}>
                                    Define what raw materials are needed to make "{productName}". 
                                    Inventory will be auto-deducted when customers order this product.
                                </p>
                            </div>
                        </div>
                        
                        <RecipeBuilder 
                            productId={id} 
                            onSaveComplete={handleBOMSaveComplete}
                        />
                        
                        <div style={{ marginTop: '20px', textAlign: 'center', padding: '16px' }}>
                            <p style={{ color: '#8b6b58', fontSize: '13px' }}>
                                💡 Tip: Make sure to add all materials needed (Resin, Hardener, Color, Mold, etc.)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerEditProduct;