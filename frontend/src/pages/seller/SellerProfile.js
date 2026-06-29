import React, { useState, useEffect } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import { 
    FiUser, FiMail, FiPhone, FiMapPin, FiHome,
    FiSave, FiEdit2, FiRefreshCw, FiPackage, FiDollarSign,
    FiX, FiAlertCircle
} from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const SellerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        shopName: '',
        shopDescription: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Pakistan'
        }
    });

    useEffect(() => {
        console.log('👤 SellerProfile - User:', user);
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            console.log('🔍 Token:', token ? 'exists' : 'missing');
            
            if (!token) {
                setError('Please login to continue');
                setTimeout(() => window.location.href = '/seller/login', 2000);
                return;
            }

            console.log('📤 Fetching seller profile...');
            const response = await API.get('/seller/profile');
            console.log('📥 Profile response:', response.data);
            
            if (response.data && response.data.success) {
                const sellerData = response.data.data;
                setProfile(sellerData);
                setFormData({
                    name: sellerData.name || '',
                    email: sellerData.email || '',
                    phone: sellerData.phone || '',
                    shopName: sellerData.shopName || '',
                    shopDescription: sellerData.shopDescription || '',
                    address: sellerData.address || {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: 'Pakistan'
                    }
                });
                toast.success('Profile loaded successfully');
            } else {
                setError(response.data?.message || 'Failed to load profile');
                toast.error(response.data?.message || 'Failed to load profile');
            }
        } catch (error) {
            console.error('❌ Error fetching profile:', error);
            
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => window.location.href = '/seller/login', 2000);
            } else if (error.response?.status === 404) {
                setError('Profile not found. Please complete your registration.');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch profile');
            }
        } finally {
            setLoading(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [field]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        
        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                shopName: formData.shopName,
                shopDescription: formData.shopDescription,
                address: formData.address
            };
            
            const response = await API.put('/seller/profile', updateData);
            
            if (response.data.success) {
                toast.success('Profile updated successfully');
                setProfile(response.data.data);
                setEditing(false);
            } else {
                toast.error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                shopName: profile.shopName || '',
                shopDescription: profile.shopDescription || '',
                address: profile.address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'Pakistan'
                }
            });
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
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#fee2e2',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <FiAlertCircle size={40} color="#ef4444" />
                        </div>
                        <h2 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '24px' }}>
                            Error Loading Profile
                        </h2>
                        <p style={{ color: '#8b6b58', marginBottom: '24px' }}>
                            {error}
                        </p>
                        {error.includes('seller') && (
                            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => window.location.href = '/seller/signup'}
                                    className="btn-primary"
                                >
                                    Register as Seller
                                </button>
                                <button
                                    onClick={() => window.location.href = '/seller/login'}
                                    className="btn-secondary"
                                >
                                    Seller Login
                                </button>
                            </div>
                        )}
                        <button
                            onClick={fetchProfile}
                            className="btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FiRefreshCw /> Try Again
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
                        <h1 style={{ fontSize: '28px', fontWeight: '500', color: '#2d1f12', fontFamily: 'Georgia, serif' }}>
                            Seller Profile
                        </h1>
                        <p style={{ color: '#8b6b58' }}>Manage your profile information</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={fetchProfile}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FiRefreshCw /> Refresh
                        </button>
                        
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <FiEdit2 /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Content */}
                <div className="form-container" style={{ maxWidth: '800px' }}>
                    {editing ? (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <h3 style={{ color: '#9a3412', fontSize: '20px', fontWeight: '500' }}>Edit Profile</h3>
                                <button type="button" onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
                                    <FiX />
                                </button>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    <FiUser /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    <FiMail /> Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="input"
                                    style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    <FiPhone /> Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+92 300 1234567"
                                    className="input"
                                />
                            </div>

                            <h3 style={{ margin: '24px 0 16px 0', color: '#9a3412', fontSize: '18px' }}>Shop Information</h3>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    <FiHome /> Shop Name
                                </label>
                                <input
                                    type="text"
                                    name="shopName"
                                    value={formData.shopName}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                    Shop Description
                                </label>
                                <textarea
                                    name="shopDescription"
                                    value={formData.shopDescription}
                                    onChange={handleChange}
                                    rows="3"
                                    className="input"
                                    style={{ borderRadius: '20px', resize: 'vertical' }}
                                />
                            </div>

                            <h3 style={{ margin: '24px 0 16px 0', color: '#9a3412', fontSize: '18px' }}>Address</h3>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    placeholder="Street Address"
                                    className="input"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className="input"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    name="address.zipCode"
                                    value={formData.address.zipCode}
                                    onChange={handleChange}
                                    placeholder="ZIP Code"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={handleChange}
                                    placeholder="Country"
                                    className="input"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    <FiSave /> {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        profile && (
                            <div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '24px',
                                    marginBottom: '32px'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f59e0b',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '32px',
                                        fontWeight: 'bold'
                                    }}>
                                        {profile.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#2d1f12' }}>{profile.name}</h2>
                                        <p style={{ color: '#9a3412' }}>{profile.shopName}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '16px', color: '#8b6b58', marginBottom: '12px' }}>Contact Information</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FiMail color="#9a3412" /> {profile.email}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FiPhone color="#9a3412" /> {profile.phone || 'Not provided'}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', color: '#8b6b58', marginBottom: '12px' }}>Shop Information</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                            <FiHome color="#9a3412" /> {profile.shopName}
                                        </div>
                                        {profile.shopDescription && (
                                            <div style={{ backgroundColor: '#fefaf5', padding: '12px', borderRadius: '12px', marginTop: '8px' }}>
                                                {profile.shopDescription}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {profile.address && (profile.address.street || profile.address.city) && (
                                    <div style={{ marginTop: '24px' }}>
                                        <h4 style={{ fontSize: '16px', color: '#8b6b58', marginBottom: '12px' }}>Address</h4>
                                        <div style={{ backgroundColor: '#fefaf5', padding: '16px', borderRadius: '16px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <FiMapPin color="#9a3412" />
                                                <div>
                                                    {profile.address.street && <div>{profile.address.street}</div>}
                                                    {(profile.address.city || profile.address.state) && (
                                                        <div>
                                                            {profile.address.city}{profile.address.city && profile.address.state ? ', ' : ''}
                                                            {profile.address.state} {profile.address.zipCode}
                                                        </div>
                                                    )}
                                                    {profile.address.country && <div>{profile.address.country}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '16px',
                                    marginTop: '32px',
                                    padding: '20px',
                                    backgroundColor: '#fefaf5',
                                    borderRadius: '20px'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9a3412' }}>
                                            {profile.products?.length || 0}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#8b6b58' }}>Products</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9a3412' }}>
                                            {profile.totalSales || 0}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#8b6b58' }}>Total Sales</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9a3412' }}>
                                            {formatCurrency(profile.totalRevenue)}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#8b6b58' }}>Revenue</div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;