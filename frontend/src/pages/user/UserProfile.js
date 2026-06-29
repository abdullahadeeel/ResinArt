import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiEdit2, FiPackage, FiHeart, FiLogOut, FiCamera, FiShoppingBag, FiStar, FiZap } from 'react-icons/fi';
import API from '../../services/api';
import toast from 'react-hot-toast';

// Helper function for images
const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://placehold.co/100x100/fefaf5/FF6B9D?text=+Product+';
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

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        profilePicture: ''
    });
    const navigate = useNavigate();

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            const response = await API.get('/users/profile');
            if (response.data.success) {
                const userData = response.data.data;
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: typeof userData.address === 'object' 
                        ? `${userData.address.street || ''}, ${userData.address.city || ''}, ${userData.address.state || ''}`.replace(/^, |, $/g, '')
                        : (userData.address || ''),
                    profilePicture: userData.profilePicture || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile ');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            toast.error(' Please upload an image file ');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            toast.error(' Image size should be less than 2MB ');
            return;
        }
        
        setUploading(true);
        
        try {
            const formDataImg = new FormData();
            formDataImg.append('image', file);
            
            const token = localStorage.getItem('token');
            const response = await API.post('/users/upload-profile-picture', formDataImg, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                const imageUrl = response.data.data.imageUrl;
                setFormData({ ...formData, profilePicture: imageUrl });
                toast.success(' Profile picture updated! ');
                fetchProfile();
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('✨ Failed to upload image ✨');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.put('/users/profile', {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                profilePicture: formData.profilePicture
            });
            if (response.data.success) {
                setUser(response.data.data);
                setEditing(false);
                toast.success(' Profile updated successfully! ');
                fetchProfile();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || ' Failed to update profile ');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success(' Logged out successfully! ');
        navigate('/');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fefaf5' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '3px solid rgba(231,84,128,0.2)',
                    borderTop: '3px solid #FF6B9D',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                {/* Page Header - Light Mode */}
                <div style={{ marginBottom: '35px', animation: 'fadeInUp 0.6s ease' }}>
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '800',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}>
                        👤 My Profile
                    </h1>
                    <p style={{ color: '#8B6B58', fontSize: '15px', fontWeight: '500' }}>
                        Manage your account information with love 
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '35px' }}>
                    
                    {/* Sidebar - Light Mode */}
                    <div style={{
                        background: '#FFFFFF',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '28px',
                        padding: '28px',
                        border: '1px solid #f0e4d8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        height: 'fit-content',
                        textAlign: 'center',
                        animation: 'fadeInUp 0.6s ease'
                    }}>
                        {/* Profile Picture */}
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
                            {formData.profilePicture ? (
                                <img
                                    src={getImageUrl(formData.profilePicture)}
                                    alt="Profile"
                                    style={{
                                        width: '110px',
                                        height: '110px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '3px solid #FF6B9D',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        animation: 'glowPulse 3s ease-in-out infinite'
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/110x110/fefaf5/FF6B9D?text=';
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '110px',
                                    height: '110px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '45px',
                                    color: 'white',
                                    border: '3px solid #FF6B9D',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    animation: 'glowPulse 3s ease-in-out infinite'
                                }}>
                                    {user?.name?.charAt(0).toUpperCase() || ''}
                                </div>
                            )}
                            
                            {/* Upload Button */}
                            <label
                                htmlFor="profile-upload"
                                style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    right: '5px',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    borderRadius: '50%',
                                    width: '34px',
                                    height: '34px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid white',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <FiCamera size={16} color="white" />
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                        
                        {uploading && (
                            <p style={{ fontSize: '12px', color: '#FF6B9D', marginTop: '10px', fontWeight: '700' }}>
                                 Uploading... 
                            </p>
                        )}
                        
                        <h3 style={{ 
                            fontSize: '22px', 
                            fontWeight: '800', 
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginTop: '10px' 
                        }}>
                            {user?.name || 'User'}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#8B6B58', marginBottom: '20px' }}>{user?.email}</p>
                        
                        {/* Sidebar Menu */}
                        <div style={{ borderTop: '1px dashed #f0e4d8', paddingTop: '20px' }}>
                            <Link to="/my-orders" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '50px',
                                    color: '#8B6B58',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    border: '1px solid transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E75480';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#8B6B58';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}>
                                    <FiPackage size={18} />
                                    <span style={{ fontWeight: '700' }}> My Orders</span>
                                </div>
                            </Link>
                            
                            <Link to="/wishlist" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '50px',
                                    color: '#8B6B58',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    border: '1px solid transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E75480';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                    e.currentTarget.style.borderColor = '#FF6B9D';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#8B6B58';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}>
                                    <FiHeart size={18} />
                                    <span style={{ fontWeight: '700' }}> Wishlist</span>
                                </div>
                            </Link>
                            
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '50px',
                                color: '#E75480',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                marginTop: '10px',
                                border: '1px solid transparent'
                            }}
                            onClick={handleLogout}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E75480';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'translateX(5px)';
                                e.currentTarget.style.borderColor = '#FF6B9D';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#E75480';
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}>
                                <FiLogOut size={18} />
                                <span style={{ fontWeight: '700' }}> Logout</span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Form - Light Mode */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        padding: '35px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid #f0e4d8',
                        animation: 'fadeInUp 0.7s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '15px' }}>
                            <h2 style={{ 
                                fontSize: '24px', 
                                fontWeight: '800', 
                                background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                Personal Information 
                            </h2>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 24px',
                                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                        border: 'none',
                                        borderRadius: '50px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(231,84,128,0.3)';
                                    }}
                                >
                                    <FiEdit2 size={14} /> Edit Profile
                                </button>
                            )}
                        </div>

                        {editing ? (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '22px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', color: '#FF6B9D', fontSize: '14px', fontWeight: '700' }}>
                                        Full Name 
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#FF6B9D';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#f0e4d8';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '22px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', color: '#FF6B9D', fontSize: '14px', fontWeight: '700' }}>
                                        Email Address 📧
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            background: '#fefaf5',
                                            fontSize: '14px',
                                            outline: 'none',
                                            color: '#8B6B58'
                                        }}
                                    />
                                    <p style={{ fontSize: '11px', color: '#8B6B58', marginTop: '6px' }}>
                                        Email cannot be changed 
                                    </p>
                                </div>

                                <div style={{ marginBottom: '22px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', color: '#FF6B9D', fontSize: '14px', fontWeight: '700' }}>
                                        Phone Number 📱
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+92 300 1234567"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#FF6B9D';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#f0e4d8';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '28px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', color: '#FF6B9D', fontSize: '14px', fontWeight: '700' }}>
                                        Address 
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="House No., Street, City, Province"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '24px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
                                            fontSize: '14px',
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#FF6B9D';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#f0e4d8';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '14px 32px',
                                            background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            fontWeight: '700',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(231,84,128,0.3)';
                                        }}
                                    >
                                        <FiSave />  Save Changes 
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData({
                                                name: user?.name || '',
                                                email: user?.email || '',
                                                phone: user?.phone || '',
                                                address: typeof user?.address === 'object' 
                                                    ? `${user?.address?.street || ''}, ${user?.address?.city || ''}`.replace(/^, |, $/g, '')
                                                    : (user?.address || ''),
                                                profilePicture: user?.profilePicture || ''
                                            });
                                        }}
                                        style={{
                                            padding: '14px 32px',
                                            background: 'transparent',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            color: '#FF6B9D',
                                            fontWeight: '700',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#E75480';
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.borderColor = '#E75480';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#FF6B9D';
                                            e.currentTarget.style.borderColor = '#f0e4d8';
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                {/* Name */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '18px',
                                    padding: '18px 0',
                                    borderBottom: '1px solid #f0e4d8',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(231,84,128,0.05)';
                                    e.currentTarget.style.paddingLeft = '10px';
                                    e.currentTarget.style.borderRadius = '16px';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.paddingLeft = '0';
                                    e.currentTarget.style.borderRadius = '0';
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: '#E75480',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FiUser size={20} style={{ color: 'white' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#8B6B58', fontWeight: '500' }}>Full Name</p>
                                        <p style={{ fontSize: '16px', color: '#2D1F12', fontWeight: '600' }}>{user?.name || 'Not set'}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '18px',
                                    padding: '18px 0',
                                    borderBottom: '1px solid #f0e4d8',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(231,84,128,0.05)';
                                    e.currentTarget.style.paddingLeft = '10px';
                                    e.currentTarget.style.borderRadius = '16px';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.paddingLeft = '0';
                                    e.currentTarget.style.borderRadius = '0';
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: '#FF6B9D',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FiMail size={20} style={{ color: 'white' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#8B6B58', fontWeight: '500' }}>Email Address</p>
                                        <p style={{ fontSize: '16px', color: '#2D1F12', fontWeight: '600' }}>{user?.email}</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '18px',
                                    padding: '18px 0',
                                    borderBottom: '1px solid #f0e4d8',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(231,84,128,0.05)';
                                    e.currentTarget.style.paddingLeft = '10px';
                                    e.currentTarget.style.borderRadius = '16px';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.paddingLeft = '0';
                                    e.currentTarget.style.borderRadius = '0';
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: '#FFB347',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FiPhone size={20} style={{ color: 'white' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#8B6B58', fontWeight: '500' }}>Phone Number</p>
                                        <p style={{ fontSize: '16px', color: '#2D1F12', fontWeight: '600' }}>{user?.phone || 'Not set'}</p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '18px',
                                    padding: '18px 0',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(231,84,128,0.05)';
                                    e.currentTarget.style.paddingLeft = '10px';
                                    e.currentTarget.style.borderRadius = '16px';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.paddingLeft = '0';
                                    e.currentTarget.style.borderRadius = '0';
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: '#E75480',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FiMapPin size={20} style={{ color: 'white' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#8B6B58', fontWeight: '500' }}>Address</p>
                                        <p style={{ fontSize: '16px', color: '#2D1F12', fontWeight: '600', lineHeight: '1.5' }}>
                                            {(() => {
                                                const addr = user?.address;
                                                if (!addr) return 'Not set';
                                                if (typeof addr === 'string') return addr;
                                                if (typeof addr === 'object') {
                                                    const parts = [addr.street, addr.city, addr.state, addr.zipCode].filter(p => p);
                                                    return parts.join(', ') || 'Address not formatted';
                                                }
                                                return 'Not set';
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes glowPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; text-shadow: 0 0 10px rgba(255,107,157,0.3); }
                }
            `}</style>
        </div>
    );
};

export default UserProfile;