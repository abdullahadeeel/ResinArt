// frontend/src/pages/seller/SellerAddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';
import RecipeBuilder from '../../components/RecipeBuilder';
import { FiSave, FiX, FiUpload, FiPackage } from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';

const SellerAddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showBOM, setShowBOM] = useState(false);
    const [productId, setProductId] = useState(null);
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

    const categories = ['Trays', 'Coasters', 'Jewelry', 'Nameplates', 'Home Decor', 'Gifts', 'Other'];

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
        
        toast.success(`${files.length} image(s) selected`);
    };

    const removeImage = (index) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!formData.name || !formData.price || !formData.category) {
            toast.error('Please fill all required fields (Name, Price, Category)');
            setLoading(false);
            return;
        }

        if (formData.price <= 0) {
            toast.error('Price must be greater than 0');
            setLoading(false);
            return;
        }

        // Create FormData
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('price', String(formData.price));
        formDataToSend.append('category', formData.category);
        formDataToSend.append('stock', String(formData.stock || 0));
        formDataToSend.append('isActive', String(formData.isActive));
        
        // Append images
        formData.images.forEach((image, index) => {
            formDataToSend.append('images', image);
        });

        try {
            const response = await API.post('/seller/products', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                const newProductId = response.data.product._id;
                setProductId(newProductId);
                setShowBOM(true);
                toast.success('Product created! Now add raw materials (BOM)');
            } else {
                toast.error(response.data.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleBOMSaveComplete = () => {
        toast.success('Product and BOM saved successfully!');
        setTimeout(() => {
            navigate('/seller/products');
        }, 1500);
    };

    const handleSkipBOM = () => {
        toast.success('Product created! You can add BOM later from edit product page.');
        setTimeout(() => {
            navigate('/seller/products');
        }, 1000);
    };

    return (
        <div className="app-layout">
            <SellerSidebar />
            
            <div className="main-content-container">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>
                            {showBOM ? '📋 Add Raw Materials (BOM)' : 'Add New Product'}
                        </h1>
                        <p style={{ color: '#8b6b58' }}>
                            {showBOM 
                                ? 'Select raw materials needed to make this product' 
                                : 'Create a new resin art product'}
                        </p>
                    </div>
                    
                    {!showBOM && (
                        <button
                            onClick={() => navigate('/seller/products')}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FiX /> Cancel
                        </button>
                    )}
                </div>

                {/* Show Product Form OR BOM Builder */}
                {!showBOM ? (
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
                                    placeholder="e.g., Resin Tray with Gold Flakes"
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
                                    rows="3"
                                    placeholder="Describe your product details..."
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
                                    className="input"
                                    style={{ borderRadius: '20px', padding: '12px 16px', border: '1px solid #e5d5cc' }}
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    Product Images
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
                                        Click to upload images
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

                                {/* Image previews */}
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
                                                    alt={`Preview ${index + 1}`}
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
                                                    onClick={() => removeImage(index)}
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
                                                        fontSize: '14px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    ×
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
                                    <span style={{ color: '#5c3a28' }}>Active (visible to customers after approval)</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '14px',
                                    fontSize: '16px'
                                }}
                            >
                                <FiSave /> {loading ? 'Creating Product...' : 'Create Product & Continue to BOM'}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* BOM Builder Section - Shown after product creation */
                    <div>
                        <div style={{
                            backgroundColor: '#f0fdf4',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: '1px solid #bbf7d0'
                        }}>
                            <FiPackage size={24} style={{ color: '#10b981' }} />
                            <div>
                                <strong style={{ color: '#166534' }}>Product Created Successfully!</strong>
                                <p style={{ color: '#166534', margin: '4px 0 0 0', fontSize: '14px' }}>
                                    Now add raw materials needed to make "{formData.name}"
                                </p>
                            </div>
                        </div>
                        
                        <RecipeBuilder 
                            productId={productId} 
                            onSaveComplete={handleBOMSaveComplete}
                        />
                        
                        <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <button
                                onClick={handleSkipBOM}
                                className="btn-secondary"
                                style={{ padding: '10px 24px' }}
                            >
                                Skip BOM for Now (Add Later)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerAddProduct;