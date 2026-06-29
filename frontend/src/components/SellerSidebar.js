// frontend/src/components/SellerSidebar.js

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    FiGrid, FiPackage, FiShoppingBag, FiUser,
    FiLogOut, FiDollarSign, FiHome, FiPlusCircle,
    FiSettings, FiMenu, FiX, FiClipboard
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * SellerSidebar Component
 * Navigation sidebar for seller panel
 * Displays seller information and menu items
 */
const SellerSidebar = () => {
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

    // Debug logs to check user data
    console.log('👤 SellerSidebar - User:', user);
    console.log('👤 SellerSidebar - User Role:', user?.role);
    console.log('👤 SellerSidebar - User Name:', user?.name);
    console.log('👤 SellerSidebar - Shop Name:', user?.shopName);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/seller/login');
    };

    // ✅ UPDATED MENU ITEMS - Added Inventory
    const menuItems = [
        { path: '/seller/dashboard', name: 'Dashboard', icon: <FiHome size={20} /> },
        { path: '/seller/products', name: 'My Products', icon: <FiPackage size={20} /> },
        { path: '/seller/add-product', name: 'Add Product', icon: <FiPlusCircle size={20} /> },
        { path: '/seller/inventory', name: 'My Inventory', icon: <FiClipboard size={20} /> },  // ✅ NEW
        { path: '/seller/orders', name: 'Orders', icon: <FiShoppingBag size={20} /> },
        { path: '/seller/earnings', name: 'Earnings', icon: <FiDollarSign size={20} /> },
        { path: '/seller/profile', name: 'Profile', icon: <FiUser size={20} /> }
    ];

    // Display name - prioritize shopName, then name, fallback to 'Seller'
    const displayName = user?.shopName || user?.name || 'Seller';
    
    // Display role
    const userRole = user?.role === 'admin' ? 'Admin' : (user?.role === 'seller' ? 'Seller' : 'User');

    const sidebarContent = (
        <>
            {/* Logo Section */}
            <div style={{
                padding: collapsed ? '20px 0' : '28px 24px',
                textAlign: 'center',
                borderBottom: '1px solid #374151',
                cursor: 'pointer'
            }} onClick={() => navigate('/seller/dashboard')}>
                {collapsed ? (
                    <h2 style={{ 
                        color: '#f59e0b', 
                        margin: 0, 
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>RS</h2>
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '28px' }}>✨</span>
                            <h2 style={{ 
                                color: '#f59e0b', 
                                margin: 0, 
                                fontSize: '22px',
                                fontWeight: '500',
                                letterSpacing: '1px'
                            }}>ResinArt</h2>
                        </div>
                        <p style={{ 
                            color: '#9ca3af', 
                            margin: 0, 
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>Seller Panel</p>
                    </>
                )}
            </div>

            {/* User Info - Shows seller name */}
            {!collapsed && user && (
                <div style={{
                    padding: '20px 16px',
                    borderBottom: '1px solid #374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#111827'
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: 'white'
                    }}>
                        {displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ 
                            fontWeight: '600', 
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'white'
                        }}>
                            {displayName}
                        </div>
                        <div style={{ 
                            fontSize: '11px', 
                            color: '#f59e0b',
                            textTransform: 'capitalize',
                            marginTop: '2px'
                        }}>
                            {userRole}
                        </div>
                    </div>
                </div>
            )}

            {/* Collapsed User Avatar */}
            {collapsed && user && (
                <div style={{
                    padding: '16px 0',
                    textAlign: 'center',
                    borderBottom: '1px solid #374151'
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
                        color: 'white',
                        margin: '0 auto'
                    }}>
                        {displayName?.charAt(0).toUpperCase()}
                    </div>
                </div>
            )}

            {/* Menu Items */}
            <div style={{
                flex: 1,
                padding: '20px 0',
                overflowY: 'auto'
            }}>
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        onClick={() => isMobile && setMobileOpen(false)}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            padding: collapsed ? '12px 0' : '12px 20px',
                            color: isActive ? '#f59e0b' : '#d1d5db',
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#374151' : 'transparent',
                            borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            gap: collapsed ? '0' : '12px',
                            cursor: 'pointer',
                            marginBottom: '4px',
                            transition: 'all 0.2s'
                        })}
                    >
                        <span style={{ fontSize: '20px', color: 'inherit' }}>
                            {item.icon}
                        </span>
                        {!collapsed && (
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                {item.name}
                            </span>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Logout Button */}
            <div style={{
                padding: collapsed ? '16px 0' : '16px 20px',
                borderTop: '1px solid #374151'
            }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: collapsed ? '0' : '12px',
                        width: '100%',
                        padding: collapsed ? '12px 0' : '12px 16px',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <FiLogOut size={18} />
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
                className="mobile-menu-btn"
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
                    display: isMobile ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Sidebar */}
            <div className={`sidebar-container ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}
                style={{
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
                }}
            >
                {sidebarContent}
            </div>

            {/* Overlay for mobile */}
            {isMobile && mobileOpen && (
                <div
                    className="mobile-overlay"
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

export default SellerSidebar;