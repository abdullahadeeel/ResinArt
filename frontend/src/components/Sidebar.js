// frontend/src/components/Sidebar.js (Admin Sidebar)

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    FiGrid, FiPackage, FiShoppingBag, FiUsers, FiSettings,
    FiLogOut, FiUserCheck, FiBarChart2, FiMenu, FiX, 
    FiUser, FiBox, FiClipboard
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * AdminSidebar Component
 * Navigation sidebar for admin panel
 */
const Sidebar = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setCollapsed(true);
                setMobileOpen(false);
            } else {
                setCollapsed(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    // ✅ Admin Menu Items
    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: <FiGrid size={20} /> },
        { path: '/products', name: 'Products', icon: <FiPackage size={20} /> },
        { path: '/inventory', name: 'Inventory', icon: <FiBox size={20} /> },
        { path: '/orders', name: 'Orders', icon: <FiShoppingBag size={20} /> },
        { path: '/users', name: 'Users', icon: <FiUsers size={20} /> },
        { path: '/admin/sellers', name: 'Sellers', icon: <FiUserCheck size={20} /> },
        { path: '/reports', name: 'Reports', icon: <FiBarChart2 size={20} /> },
        { path: '/settings', name: 'Settings', icon: <FiSettings size={20} /> }
    ];

    const displayName = user?.name || 'Admin';
    const userRole = 'Admin';

    const sidebarContent = (
        <>
            {/* Logo Section */}
            <div style={{
                padding: collapsed ? '20px 0' : '24px',
                textAlign: 'center',
                borderBottom: '1px solid #374151',
                cursor: 'pointer'
            }} onClick={() => navigate('/dashboard')}>
                {collapsed ? (
                    <h2 style={{ color: '#f59e0b', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>RA</h2>
                ) : (
                    <>
                        <h2 style={{ color: '#f59e0b', margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold' }}>ResinArt</h2>
                        <p style={{ color: '#9ca3af', margin: 0, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Panel</p>
                    </>
                )}
            </div>

            {/* User Info */}
            {!collapsed && user && (
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#111827'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: 'white'
                    }}>
                        {displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>
                            {displayName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#f59e0b' }}>{userRole}</div>
                    </div>
                </div>
            )}

            {/* Collapsed User Avatar */}
            {collapsed && user && (
                <div style={{ padding: '16px 0', textAlign: 'center', borderBottom: '1px solid #374151' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: 'white',
                        margin: '0 auto'
                    }}>
                        {displayName?.charAt(0).toUpperCase()}
                    </div>
                </div>
            )}

            {/* Menu Items */}
            <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        onClick={() => isMobile && setMobileOpen(false)}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            padding: collapsed ? '12px 0' : '12px 24px',
                            color: isActive ? '#f59e0b' : '#d1d5db',
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#374151' : 'transparent',
                            borderLeft: isActive ? '4px solid #f59e0b' : '4px solid transparent',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            gap: collapsed ? '0' : '12px',
                            cursor: 'pointer',
                            marginBottom: '4px'
                        })}
                    >
                        <span style={{ fontSize: '20px', color: 'inherit' }}>{item.icon}</span>
                        {!collapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</span>}
                    </NavLink>
                ))}
            </div>

            {/* Logout Button */}
            <div style={{ padding: collapsed ? '16px 0' : '16px 24px', borderTop: '1px solid #374151' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: collapsed ? '0' : '12px',
                        width: '100%',
                        padding: collapsed ? '12px 0' : '12px',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <FiLogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                    position: 'fixed',
                    top: '16px',
                    left: '16px',
                    zIndex: 1100,
                    backgroundColor: '#1f2937',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    cursor: 'pointer',
                    display: isMobile ? 'flex' : 'none'
                }}
            >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Sidebar */}
            <div style={{
                width: collapsed ? '80px' : '280px',
                backgroundColor: '#1f2937',
                color: 'white',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                transition: 'width 0.3s ease, transform 0.3s ease',
                zIndex: 1000,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                transform: isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)'
            }}>
                {sidebarContent}
            </div>

            {/* Overlay for mobile */}
            {isMobile && mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999,
                        cursor: 'pointer'
                    }}
                />
            )}
        </>
    );
};

export default Sidebar;