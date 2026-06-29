import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';  // ✅ Fixed
import { FiEdit2, FiTrash2, FiSearch, FiUser, FiMail, FiPhone, FiRefreshCw, FiX } from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        role: '',
        phone: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            console.log('📤 Fetching users...');
            const response = await API.get('/admin/users');
            console.log('📥 Users response:', response.data);
            
            if (response.data && response.data.success) {
                setUsers(response.data.data || []);
                toast.success(`Loaded ${response.data.data.length} users`);
            } else {
                toast.error(response.data?.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error('❌ Users fetch error:', error);
            
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 2000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch users');
            }
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
        
        try {
            const response = await API.delete(`/admin/users/${userId}`);
            if (response.data.success) {
                toast.success('User deleted successfully');
                fetchUsers();
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setEditFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'user',
            phone: user.phone || ''
        });
        setShowEditModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        
        try {
            const response = await API.put(`/admin/users/${editingUser._id}`, editFormData);
            if (response.data.success) {
                toast.success('User updated successfully');
                setShowEditModal(false);
                setEditingUser(null);
                fetchUsers();
            } else {
                toast.error(response.data.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update user');
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
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role) => {
        const styles = {
            admin: { bg: '#fee2e2', color: '#991b1b' },
            seller: { bg: '#fff7ed', color: '#9a3412' },
            user: { bg: '#d1fae5', color: '#065f46' }
        };
        return styles[role] || { bg: '#f3f4f6', color: '#4b5563' };
    };

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
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12' }}>Users</h1>
                        <p style={{ color: '#8b6b58' }}>Manage system users</p>
                    </div>
                    
                    <button
                        onClick={fetchUsers}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FiRefreshCw /> Refresh
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
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="seller">Seller</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table style={{ minWidth: '700px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#fef7f0', borderBottom: '2px solid #f0e4d8' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>User</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Contact</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Role</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Joined</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Actions</th>
                                  </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: '#8b6b58' }}>
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => {
                                        const roleStyle = getRoleBadge(user.role);
                                        return (
                                            <tr key={user._id} style={{ borderBottom: '1px solid #f0e4d8' }}>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        {user.profileImage ? (
                                                            <img
                                                                src={getImageUrl(user.profileImage)}
                                                                alt={user.name}
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
                                                                backgroundColor: '#fef7f0',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#b88d6e'
                                                            }}>
                                                                <FiUser size={18} />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div style={{ fontWeight: '500', color: '#2d1f12' }}>{user.name}</div>
                                                            <div style={{ fontSize: '11px', color: '#8b6b58' }}>
                                                                ID: {user._id?.substring(0, 8)}...
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#5c3a28' }}>
                                                            <FiMail size={12} /> {user.email}
                                                        </div>
                                                        {user.phone && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#5c3a28' }}>
                                                                <FiPhone size={12} /> {user.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        backgroundColor: roleStyle.bg,
                                                        color: roleStyle.color,
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '13px', color: '#8b6b58' }}>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        backgroundColor: user.isActive ? '#d1fae5' : '#fee2e2',
                                                        color: user.isActive ? '#065f46' : '#991b1b',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px'
                                                    }}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="btn-secondary"
                                                            style={{ padding: '8px', borderRadius: '40px' }}
                                                            title="Edit User"
                                                        >
                                                            <FiEdit2 size={16} color="#5c3a28" />
                                                        </button>
                                                        {user.role !== 'admin' && (
                                                            <button
                                                                onClick={() => handleDelete(user._id, user.name)}
                                                                style={{
                                                                    padding: '8px',
                                                                    borderRadius: '40px',
                                                                    backgroundColor: '#fee2e2',
                                                                    border: 'none',
                                                                    cursor: 'pointer'
                                                                }}
                                                                title="Delete User"
                                                            >
                                                                <FiTrash2 size={16} color="#ef4444" />
                                                            </button>
                                                        )}
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

                {/* Edit User Modal */}
                {showEditModal && editingUser && (
                    <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                            backgroundColor: 'white',
                            borderRadius: '28px',
                            padding: '32px',
                            maxWidth: '500px',
                            width: '90%'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px'
                            }}>
                                <h2 style={{ margin: 0, color: '#2d1f12' }}>Edit User</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        color: '#8b6b58'
                                    }}
                                >
                                    <FiX />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateUser}>
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                        required
                                        className="input"
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                        required
                                        className="input"
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                        Role
                                    </label>
                                    <select
                                        value={editFormData.role}
                                        onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                                        className="input"
                                    >
                                        <option value="user">User</option>
                                        <option value="seller">Seller</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5c3a28' }}>
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.phone}
                                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                        className="input"
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;