// frontend/src/pages/EditProduct.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RecipeBuilder from '../components/RecipeBuilder';
import { FiSave, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import API, { getProductRecipe } from '../services/api';
import toast from 'react-hot-toast';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showRecipe, setShowRecipe] = useState(false);
    const [hasRecipe, setHasRecipe] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Trays',
        images: [],
        imagePreviews: [],
        stock: '',
        isActive: true,
        isApproved: true
    });
    const [existingImages, setExistingImages] = useState([]);

    const categories = ['Trays', 'Coasters', 'Jewelry', 'Nameplates', 'Home Decor', 'Gifts', 'Other'];

    useEffect(() => {
        fetchProduct();
        checkRecipe();
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
            const response = await API.get(`/products/${id}`);
            if (response.data.success) {
                const product = response.data.data;
                setExistingImages(product.images || []);
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    category: product.category || 'Trays',
                    images: [],
                    imagePreviews: [],
                    stock: product.stock || '',
                    isActive: product.isActive !== undefined ? product.isActive : true,
                    isApproved: product.isApproved !== undefined ? product.isApproved : true
                });
            } else {
                toast.error('Product not found');
                navigate('/products');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch product');
            navigate('/products');
        } finally {
            setFetchLoading(false);
        }
    };

    const checkRecipe = async () => {
        try {
            const response = await getProductRecipe(id);
            if (response.data.success && response.data.recipe) {
                setHasRecipe(true);
            }
        } catch (error) {
            setHasRecipe(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...formData.images, ...files];
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setFormData({ ...formData, images: newImages, imagePreviews: [...formData.imagePreviews, ...newPreviews] });
        toast.success(`${files.length} new image(s) selected`);
    };

    const removeNewImage = (index) => {
        const newImages = [...formData.images];
        const newPreviews = [...formData.imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setFormData({ ...formData, images: newImages, imagePreviews: newPreviews });
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

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('price', String(formData.price));
        formDataToSend.append('category', formData.category);
        formDataToSend.append('stock', String(formData.stock || 0));
        formDataToSend.append('isActive', String(formData.isActive));
        formDataToSend.append('isApproved', String(formData.isApproved));
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
        formData.images.forEach((image) => formDataToSend.append('newImages', image));

        try {
            const response = await API.put(`/products/${id}`, formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (response.data.success) {
                toast.success('Product updated successfully!');
                setTimeout(() => navigate('/products'), 1500);
            } else {
                toast.error(response.data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    const handleRecipeComplete = () => {
        setHasRecipe(true);
        toast.success('Recipe saved successfully!');
        setShowRecipe(false);
    };

    if (fetchLoading) {
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
                <div className="page-header">
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>Edit Product</h1>
                        <p style={{ color: '#8b6b58' }}>Update product details</p>
                    </div>
                    <button onClick={() => navigate('/products')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiX /> Cancel
                    </button>
                </div>

                {/* Product Edit Form */}
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className={`card ${formData.isApproved ? 'bg-success-light' : 'bg-warning-light'}`} style={{ marginBottom: '24px', padding: '16px', textAlign: 'center', borderRadius: '12px' }}>
                            {formData.isApproved ? <span style={{ color: '#065f46' }}>✅ Product is approved and visible to customers</span> : <span style={{ color: '#9a3412' }}>⏳ Product pending approval.</span>}
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>Product Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>Price (PKR) *</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="1" className="input" />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>Category *</label>
                                <select name="category" value={formData.category} onChange={handleChange} required className="input">
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>Stock Quantity</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" className="input" />
                        </div>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>Current Images</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px' }}>
                                    {existingImages.map((img, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img src={getImageUrl(img)} alt="Existing" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                                            <button type="button" onClick={() => removeExistingImage(index)} style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Image Upload */}
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>Add New Images</label>
                            <div style={{ border: '2px dashed #e5d5cc', borderRadius: '20px', padding: '24px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#fefaf5' }} onClick={() => document.getElementById('image-upload').click()}>
                                <FiUpload size={32} style={{ color: '#b88d6e', marginBottom: '12px' }} />
                                <p style={{ color: '#8b6b58', margin: 0 }}>Click to upload new images</p>
                                <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            </div>
                            {formData.imagePreviews.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px', marginTop: '16px' }}>
                                    {formData.imagePreviews.map((img, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img src={img} alt="New" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                                            <button type="button" onClick={() => removeNewImage(index)} style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                                <span style={{ color: '#5c3a28' }}>Active (visible to customers)</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}><FiSave /> {loading ? 'Updating...' : 'Update Product'}</button>
                            <button type="button" onClick={() => navigate('/products')} className="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>

                {/* Recipe Section */}
                <div style={{ marginTop: '24px' }}>
                    <div className="form-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d1f12' }}>📋 Raw Materials Recipe</h2>
                            {!showRecipe && hasRecipe && <button onClick={() => setShowRecipe(true)} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Edit Recipe</button>}
                            {!showRecipe && !hasRecipe && <button onClick={() => setShowRecipe(true)} style={{ padding: '8px 16px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Add Recipe</button>}
                        </div>
                        {!showRecipe && hasRecipe && <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}><p style={{ color: '#166534' }}>✅ Recipe is configured! Inventory will be auto-deducted when orders are placed.</p></div>}
                        {!showRecipe && !hasRecipe && <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px' }}><p style={{ color: '#92400e' }}>⚠️ No recipe added yet. Add raw materials to enable inventory tracking.</p></div>}
                        {showRecipe && <RecipeBuilder productId={id} onSaveComplete={handleRecipeComplete} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;