// frontend/src/pages/AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RecipeBuilder from '../components/RecipeBuilder';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showRecipe, setShowRecipe] = useState(false);
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

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('price', formData.price);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('stock', formData.stock || 0);
        formDataToSend.append('isActive', formData.isActive);
        
        formData.images.forEach((image) => {
            formDataToSend.append('images', image);
        });

        try {
            const response = await API.post('/products', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                const newProductId = response.data.data._id;
                setProductId(newProductId);
                toast.success('Product created! Now add raw materials recipe.');
                setShowRecipe(true);
            } else {
                toast.error(response.data.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleRecipeComplete = () => {
        toast.success('Product and recipe saved successfully!');
        navigate('/products');
    };

    const handleSkipRecipe = () => {
        toast.success('Product created without recipe. You can add recipe later from edit product.');
        navigate('/products');
    };

    // Show Recipe Builder after product creation
    if (showRecipe && productId) {
        return (
            <div className="app-layout">
                <Sidebar />
                <div className="main-content-container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                            <h2 style={{ marginBottom: '8px' }}>✅ Product Created: {formData.name}</h2>
                            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                                Now add raw materials recipe for inventory tracking.
                            </p>
                            <button onClick={handleSkipRecipe} style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                Skip for Now
                            </button>
                        </div>
                        <RecipeBuilder productId={productId} onSaveComplete={handleRecipeComplete} />
                    </div>
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
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>Add New Product</h1>
                        <p style={{ color: '#8b6b58' }}>Create a new resin art product</p>
                    </div>
                    <button onClick={() => navigate('/products')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiX /> Cancel
                    </button>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                Product Name <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="input" />
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

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>Product Images</label>
                            <div style={{ border: '2px dashed #e5d5cc', borderRadius: '20px', padding: '24px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#fefaf5' }} onClick={() => document.getElementById('image-upload').click()}>
                                <FiUpload size={32} style={{ color: '#b88d6e', marginBottom: '12px' }} />
                                <p style={{ color: '#8b6b58', margin: 0 }}>Click to upload images</p>
                                <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            </div>
                            {formData.imagePreviews.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px', marginTop: '16px' }}>
                                    {formData.imagePreviews.map((img, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img src={img} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                                            <button type="button" onClick={() => removeImage(index)} style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>×</button>
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

                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <FiSave /> {loading ? 'Creating...' : 'Create Product'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;