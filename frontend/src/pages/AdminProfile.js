import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiSave, FiEdit2, FiLogOut, FiCamera, FiLock } from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

// Helper function for images
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/uploads/${imagePath}`;
};

const AdminProfile = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profilePicture: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    // ✅ useCallback to fix useEffect dependency warning
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/admin/login');
                return;
            }
            
            try {
                const response = await API.get('/admin/profile');
                if (response.data.success) {
                    const adminData = response.data.data;
                    setAdmin(adminData);
                    setFormData({
                        name: adminData.name || '',
                        email: adminData.email || '',
                        phone: adminData.phone || '',
                        profilePicture: adminData.profilePicture || ''
                    });
                    
                    // Update localStorage
                    const storedAdmin = JSON.parse(localStorage.getItem('user') || '{}');
                    storedAdmin.name = adminData.name;
                    storedAdmin.phone = adminData.phone;
                    storedAdmin.profilePicture = adminData.profilePicture;
                    localStorage.setItem('user', JSON.stringify(storedAdmin));
                }
            } catch (err) {
                // Fallback to localStorage if API fails
                const storedAdmin = JSON.parse(localStorage.getItem('user') || '{}');
                if (storedAdmin && storedAdmin.role === 'admin') {
                    setAdmin(storedAdmin);
                    setFormData({
                        name: storedAdmin.name || '',
                        email: storedAdmin.email || '',
                        phone: storedAdmin.phone || '',
                        profilePicture: storedAdmin.profilePicture || ''
                    });
                }
                console.log('Using localStorage admin data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // ✅ Fixed: Added fetchProfile to dependency array
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    // Upload profile picture
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }
        
        setUploading(true);
        
        try {
            const formDataImg = new FormData();
            formDataImg.append('image', file);
            
            const token = localStorage.getItem('token');
            const response = await API.post('/admin/upload-profile-picture', formDataImg, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                const imageUrl = response.data.data.imageUrl;
                setFormData({ ...formData, profilePicture: imageUrl });
                toast.success('Profile picture updated!');
                fetchProfile();
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.put('/admin/profile', {
                name: formData.name,
                phone: formData.phone,
                profilePicture: formData.profilePicture
            });
            if (response.data.success) {
                // Update localStorage
                const storedAdmin = JSON.parse(localStorage.getItem('user') || '{}');
                storedAdmin.name = formData.name;
                storedAdmin.phone = formData.phone;
                storedAdmin.profilePicture = formData.profilePicture;
                localStorage.setItem('user', JSON.stringify(storedAdmin));
                
                setAdmin(storedAdmin);
                setEditing(false);
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        try {
            const response = await API.put('/admin/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            if (response.data.success) {
                toast.success('Password changed successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setChangingPassword(false);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fffaf5' }}>
                <Sidebar />
                <div style={{ 
                    flex: 1, 
                    marginLeft: '280px',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh' 
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid #f0e4d8',
                        borderTop: '3px solid #9a3412',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fffaf5' }}>
            <Sidebar />
            
            {/* Main content with proper margin-left */}
            <div style={{ 
                flex: 1, 
                marginLeft: '280px',
                padding: '24px', 
                overflowX: 'auto',
                minHeight: '100vh',
                width: 'calc(100% - 280px)'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '400',
                        color: '#2d1f12',
                        fontFamily: 'Georgia, serif',
                        marginBottom: '8px'
                    }}>
                        Admin Profile
                    </h1>
                    <p style={{ color: '#8b6b58' }}>
                        Manage your account information
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
                    {/* Profile Picture Card */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        border: '1px solid #f0e4d8',
                        height: 'fit-content',
                        textAlign: 'center'
                    }}>
                        {/* Profile Picture */}
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                            {formData.profilePicture ? (
                                <img
                                    src={getImageUrl(formData.profilePicture)}
                                    alt="Profile"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '3px solid #9a3412'
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/120x120/fef3e8/9a3412?text=Admin';
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    backgroundColor: '#fef3e8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '48px',
                                    color: '#9a3412',
                                    border: '3px solid #9a3412'
                                }}>
                                    {admin?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            )}
                            
                            {/* Upload Button */}
                            <label
                                htmlFor="profile-upload"
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    backgroundColor: '#9a3412',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid white'
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
                            <p style={{ fontSize: '11px', color: '#9a3412', marginTop: '8px' }}>
                                Uploading...
                            </p>
                        )}
                        
                        <h3 style={{ fontSize: '20px', fontWeight: '500', color: '#2d1f12', marginTop: '8px' }}>
                            {admin?.name || 'Admin'}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#8b6b58', marginBottom: '16px' }}>
                            {admin?.email}
                        </p>
                        <p style={{
                            fontSize: '11px',
                            padding: '4px 12px',
                            backgroundColor: '#fef3e8',
                            color: '#9a3412',
                            borderRadius: '20px',
                            display: 'inline-block'
                        }}>
                            Administrator
                        </p>
                        
                        <div style={{ borderTop: '1px solid #f0e4d8', paddingTop: '16px', marginTop: '20px' }}>
                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    width: '100%',
                                    padding: '10px 12px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fee2e2';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <FiLogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '32px',
                        border: '1px solid #f0e4d8'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#2d1f12' }}>
                                Personal Information
                            </h2>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 16px',
                                        backgroundColor: '#fef3e8',
                                        border: 'none',
                                        borderRadius: '40px',
                                        color: '#9a3412',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FiEdit2 size={14} /> Edit Profile
                                </button>
                            )}
                        </div>

                        {editing ? (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#5c3a28', fontSize: '14px' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #e5d5cc',
                                            borderRadius: '40px',
                                            backgroundColor: '#fefaf5',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#5c3a28', fontSize: '14px' }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #e5d5cc',
                                            borderRadius: '40px',
                                            backgroundColor: '#f5efea',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                    <p style={{ fontSize: '11px', color: '#b88d6e', marginTop: '4px' }}>
                                        Email cannot be changed
                                    </p>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#5c3a28', fontSize: '14px' }}>
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+92 300 1234567"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #e5d5cc',
                                            borderRadius: '40px',
                                            backgroundColor: '#fefaf5',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '12px 28px',
                                            backgroundColor: '#9a3412',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '40px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <FiSave /> Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData({
                                                name: admin?.name || '',
                                                email: admin?.email || '',
                                                phone: admin?.phone || '',
                                                profilePicture: admin?.profilePicture || ''
                                            });
                                        }}
                                        style={{
                                            padding: '12px 28px',
                                            backgroundColor: 'transparent',
                                            border: '1px solid #e5d5cc',
                                            borderRadius: '40px',
                                            cursor: 'pointer',
                                            color: '#5c3a28'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #f0e4d8'
                                }}>
                                    <FiUser size={20} style={{ color: '#b88d6e' }} />
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#b88d6e' }}>Full Name</p>
                                        <p style={{ fontSize: '16px', color: '#2d1f12' }}>{admin?.name || 'Not set'}</p>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #f0e4d8'
                                }}>
                                    <FiMail size={20} style={{ color: '#b88d6e' }} />
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#b88d6e' }}>Email Address</p>
                                        <p style={{ fontSize: '16px', color: '#2d1f12' }}>{admin?.email}</p>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #f0e4d8'
                                }}>
                                    <FiPhone size={20} style={{ color: '#b88d6e' }} />
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#b88d6e' }}>Phone Number</p>
                                        <p style={{ fontSize: '16px', color: '#2d1f12' }}>{admin?.phone || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Change Password Section */}
                        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f0e4d8' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#2d1f12' }}>
                                    <FiLock style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Change Password
                                </h2>
                                {!changingPassword && (
                                    <button
                                        onClick={() => setChangingPassword(true)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#fef3e8',
                                            border: 'none',
                                            borderRadius: '40px',
                                            color: '#9a3412',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Change Password
                                    </button>
                                )}
                            </div>

                            {changingPassword && (
                                <form onSubmit={handlePasswordSubmit}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#5c3a28', fontSize: '14px' }}>
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #e5d5cc',
                                                borderRadius: '40px',
                                                backgroundColor: '#fefaf5',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#5c3a28', fontSize: '14px' }}>
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #e5d5cc',
                                                borderRadius: '40px',
                                                backgroundColor: '#fefaf5',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#5c3a28', fontSize: '14px' }}>
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #e5d5cc',
                                                borderRadius: '40px',
                                                backgroundColor: '#fefaf5',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '10px 24px',
                                                backgroundColor: '#9a3412',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '40px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Update Password
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setChangingPassword(false);
                                                setPasswordData({
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                });
                                            }}
                                            style={{
                                                padding: '10px 24px',
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e5d5cc',
                                                borderRadius: '40px',
                                                cursor: 'pointer',
                                                color: '#5c3a28'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @media (max-width: 768px) {
                    .admin-main-content {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminProfile;