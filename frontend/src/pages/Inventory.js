// frontend/src/pages/Inventory.js
// Admin can ONLY VIEW inventory - CANNOT add/edit/delete

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/Sidebar';
import { 
    FiPackage, FiSearch, FiAlertCircle, FiRefreshCw, FiX,
    FiTrendingUp, FiEye, FiPrinter, FiDownload, FiUsers,
    FiInfo
} from 'react-icons/fi';
import { getMaterials, getLowStockMaterials } from '../services/api';
import toast from 'react-hot-toast';

const Inventory = () => {
    const [materials, setMaterials] = useState([]);
    const [lowStockMaterials, setLowStockMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSeller, setSelectedSeller] = useState('');
    const [sellers, setSellers] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const categories = ['All', 'Resin', 'Hardener', 'Color', 'Mold', 'Tool', 'Packaging', 'Other'];

    useEffect(() => {
        fetchData();
        fetchSellers();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch all materials
            const materialsRes = await getMaterials();
            console.log('Materials API Response:', materialsRes);
            
            // ✅ FIX: Handle backend response with 'data' key
            let materialsData = [];
            if (materialsRes && materialsRes.data) {
                if (materialsRes.data.success && materialsRes.data.data) {
                    // Response format: { success: true, data: [...] }
                    materialsData = materialsRes.data.data;
                    console.log('✅ Extracted from data.data:', materialsData);
                } else if (materialsRes.data.success && materialsRes.data.materials) {
                    // Response format: { success: true, materials: [...] }
                    materialsData = materialsRes.data.materials;
                    console.log('✅ Extracted from data.materials:', materialsData);
                } else if (Array.isArray(materialsRes.data)) {
                    // Response format: direct array
                    materialsData = materialsRes.data;
                    console.log('✅ Extracted direct array:', materialsData);
                } else if (materialsRes.data.data && Array.isArray(materialsRes.data.data)) {
                    materialsData = materialsRes.data.data;
                }
            }
            
            setMaterials(materialsData);
            
            // Fetch low stock materials
            const lowStockRes = await getLowStockMaterials();
            let lowStockData = [];
            if (lowStockRes && lowStockRes.data) {
                if (lowStockRes.data.success && lowStockRes.data.data) {
                    lowStockData = lowStockRes.data.data;
                } else if (lowStockRes.data.success && lowStockRes.data.materials) {
                    lowStockData = lowStockRes.data.materials;
                } else if (Array.isArray(lowStockRes.data)) {
                    lowStockData = lowStockRes.data;
                }
            }
            setLowStockMaterials(lowStockData);
            
        } catch (error) {
            console.error('Error fetching inventory:', error);
            toast.error('Failed to load inventory data');
            setMaterials([]);
            setLowStockMaterials([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSellers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/sellers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setSellers(data.data || data.sellers || []);
            } else {
                setSellers([]);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
            setSellers([]);
        }
    };

    const getStockStatus = (material) => {
        if (!material) return { color: '#9ca3af', text: 'Unknown', icon: '❓' };
        const quantity = material.quantity || 0;
        const minLevel = material.minThreshold || material.minStockLevel || 10;
        if (quantity <= 0) return { color: '#ef4444', text: 'Out of Stock', icon: '🔴' };
        if (quantity <= minLevel) return { color: '#f59e0b', text: 'Low Stock', icon: '⚠️' };
        return { color: '#10b981', text: 'In Stock', icon: '✅' };
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Resin': '🧪',
            'Hardener': '⚗️',
            'Color': '🎨',
            'Mold': '📦',
            'Tool': '🔧',
            'Packaging': '📦',
            'Other': '📦'
        };
        return icons[category] || '📦';
    };

    const handleExportReport = () => {
        if (!filteredMaterials || filteredMaterials.length === 0) {
            toast.error('No data to export');
            return;
        }
        
        const headers = ['Seller', 'Material Name', 'Category', 'Stock', 'Unit', 'Min Threshold', 'Cost/Unit', 'Total Value', 'Supplier', 'Status'];
        const rows = filteredMaterials.map(m => [
            m.sellerName || m.sellerId?.name || '-',
            m.name || '-',
            m.category || '-',
            m.quantity || 0,
            m.unit || '-',
            m.minThreshold || m.minStockLevel || 0,
            m.costPerUnit || 0,
            ((m.quantity || 0) * (m.costPerUnit || 0)).toFixed(2),
            m.supplierName || m.supplier?.name || '-',
            getStockStatus(m).text
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Report exported successfully');
    };

    const handlePrintReport = () => {
        window.print();
    };

    // Safe filter - ensure materials is array
    const filteredMaterials = Array.isArray(materials) ? materials.filter(material => {
        if (!material) return false;
        const matchesSearch = (material.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (material.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || selectedCategory === '' || material.category === selectedCategory;
        
        const matchesSeller = !selectedSeller || material.sellerId?._id === selectedSeller || material.sellerId === selectedSeller || material.sellerName === selectedSeller;
        
        return matchesSearch && matchesCategory && matchesSeller;
    }) : [];

    // Calculate inventory stats safely
    const totalMaterials = materials.length;
    const totalValue = materials.reduce((sum, m) => sum + ((m?.quantity || 0) * (m?.costPerUnit || 0)), 0);
    const lowStockCount = materials.filter(m => (m?.quantity || 0) <= (m?.minThreshold || m?.minStockLevel || 0)).length;
    const outOfStockCount = materials.filter(m => (m?.quantity || 0) <= 0).length;

    // Safe group by seller
    const materialsBySeller = materials.reduce((acc, m) => {
        if (!m) return acc;
        const sellerName = m.sellerName || m.sellerId?.name || m.sellerId?.shopName || 'Unknown';
        if (!acc[sellerName]) acc[sellerName] = [];
        acc[sellerName].push(m);
        return acc;
    }, {});

    const handleViewDetails = (material) => {
        setSelectedMaterial(material);
        setShowDetailsModal(true);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <AdminSidebar />
                <div style={{ marginLeft: '280px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar />
            
            <div style={{ marginLeft: '280px', flex: 1, padding: '24px', backgroundColor: '#fefaf5' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12', margin: 0 }}>Inventory Management</h1>
                        <p style={{ color: '#8b6b58', marginTop: '4px' }}>View all raw materials across all sellers</p>
                        <p style={{ 
                            backgroundColor: '#f0e4d8', 
                            display: 'inline-block',
                            padding: '4px 12px', 
                            borderRadius: '20px', 
                            fontSize: '11px', 
                            color: '#5c3a28',
                            marginTop: '8px'
                        }}>
                            <FiEye style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> 
                            Read-only mode - Admin can only view inventory
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handlePrintReport}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'white', border: '1px solid #f0e4d8', borderRadius: '40px', cursor: 'pointer' }}
                        >
                            <FiPrinter /> Print
                        </button>
                        <button
                            onClick={handleExportReport}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'white', border: '1px solid #f0e4d8', borderRadius: '40px', cursor: 'pointer' }}
                        >
                            <FiDownload /> Export CSV
                        </button>
                        <button
                            onClick={fetchData}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer' }}
                        >
                            <FiRefreshCw /> Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Total Materials</p>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{totalMaterials}</h2>
                            </div>
                            <FiPackage size={32} style={{ color: '#b88d6e' }} />
                        </div>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Inventory Value</p>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Rs. {totalValue.toLocaleString()}</h2>
                            </div>
                            <FiTrendingUp size={32} style={{ color: '#10b981' }} />
                        </div>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Low Stock Alerts</p>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: lowStockCount > 0 ? '#f59e0b' : '#10b981' }}>
                                    {lowStockCount}
                                </h2>
                            </div>
                            <FiAlertCircle size={32} style={{ color: lowStockCount > 0 ? '#f59e0b' : '#10b981' }} />
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: '#8b6b58', fontSize: '13px', margin: 0 }}>Out of Stock</p>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: outOfStockCount > 0 ? '#ef4444' : '#10b981' }}>
                                    {outOfStockCount}
                                </h2>
                            </div>
                            <FiUsers size={32} style={{ color: '#ef4444' }} />
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert Banner */}
                {lowStockMaterials.length > 0 && (
                    <div style={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #fde68a',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}>
                        <FiAlertCircle style={{ color: '#d97706' }} size={20} />
                        <span style={{ color: '#92400e' }}>
                            <strong>Low Stock Alert:</strong> {lowStockMaterials.length} material(s) are below minimum stock level.
                        </span>
                    </div>
                )}

                {/* Filters */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f0e4d8', borderRadius: '40px', padding: '8px 16px' }}>
                            <FiSearch size={20} style={{ color: '#b88d6e' }} />
                            <input
                                type="text"
                                placeholder="Search by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '8px 0',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '14px',
                                    backgroundColor: 'transparent'
                                }}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <FiX size={18} />
                                </button>
                            )}
                        </div>
                        
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '40px', border: '1px solid #f0e4d8', backgroundColor: 'white', cursor: 'pointer' }}
                        >
                            {categories.map(cat => <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>)}
                        </select>
                        
                        <select
                            value={selectedSeller}
                            onChange={(e) => setSelectedSeller(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '40px', border: '1px solid #f0e4d8', backgroundColor: 'white', cursor: 'pointer' }}
                        >
                            <option value="">All Sellers</option>
                            {sellers.map(seller => (
                                <option key={seller._id} value={seller._id}>{seller.shopName || seller.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Materials Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f0e4d8', backgroundColor: '#fefaf5' }}>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Seller</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Material</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#5c3a28' }}>Category</th>
                                <th style={{ padding: '16px', textAlign: 'right', color: '#5c3a28' }}>Stock</th>
                                <th style={{ padding: '16px', textAlign: 'right', color: '#5c3a28' }}>Min Threshold</th>
                                <th style={{ padding: '16px', textAlign: 'right', color: '#5c3a28' }}>Cost/Unit</th>
                                <th style={{ padding: '16px', textAlign: 'right', color: '#5c3a28' }}>Total Value</th>
                                <th style={{ padding: '16px', textAlign: 'center', color: '#5c3a28' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'center', color: '#5c3a28' }}>Supplier</th>
                                <th style={{ padding: '16px', textAlign: 'center', color: '#5c3a28' }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaterials.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ padding: '48px', textAlign: 'center', color: '#8b6b58' }}>
                                        No materials found.
                                    </td>
                                </tr>
                            ) : (
                                filteredMaterials.map((material) => {
                                    if (!material) return null;
                                    const stockStatus = getStockStatus(material);
                                    const totalMaterialValue = (material.quantity || 0) * (material.costPerUnit || 0);
                                    const minLevel = material.minThreshold || material.minStockLevel || 0;
                                    return (
                                        <tr key={material._id} style={{ 
                                            borderBottom: '1px solid #f0e4d8',
                                            backgroundColor: stockStatus.text === 'Low Stock' ? '#fef3c715' : 'white'
                                        }}>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ fontWeight: '500', color: '#2d1f12' }}>
                                                    {material.sellerName || material.sellerId?.shopName || material.sellerId?.name || '-'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontSize: '24px' }}>{getCategoryIcon(material.category)}</span>
                                                    <div>
                                                        <div style={{ fontWeight: '500', color: '#2d1f12' }}>{material.name || '-'}</div>
                                                        {material.sku && <div style={{ fontSize: '10px', color: '#b88d6e' }}>SKU: {material.sku}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', color: '#8b6b58' }}>{material.category || '-'}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: '500', color: '#2d1f12' }}>
                                                {material.quantity || 0} {material.unit || ''}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right', color: '#8b6b58' }}>
                                                {minLevel} {material.unit || ''}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: '500', color: '#9a3412' }}>
                                                Rs. {material.costPerUnit || 0}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: '500', color: '#2d1f12' }}>
                                                Rs. {totalMaterialValue.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: `${stockStatus.color}15`,
                                                    color: stockStatus.color
                                                }}>
                                                    {stockStatus.icon} {stockStatus.text}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                {material.supplierName || material.supplier?.name ? (
                                                    <a 
                                                        href={material.supplierLink || material.supplier?.link || '#'} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ color: '#9a3412', textDecoration: 'none', fontSize: '12px' }}
                                                    >
                                                        {material.supplierName || material.supplier?.name} 🔗
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleViewDetails(material)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        backgroundColor: '#f0e4d8',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        color: '#5c3a28',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    <FiInfo size={14} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                        <tfoot style={{ backgroundColor: '#fefaf5', borderTop: '1px solid #f0e4d8' }}>
                            <tr>
                                <td colSpan="6" style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>Total Value:</td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#9a3412' }}>
                                    Rs. {filteredMaterials.reduce((sum, m) => sum + ((m?.quantity || 0) * (m?.costPerUnit || 0)), 0).toLocaleString()}
                                </td>
                                <td colSpan="3"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Seller-wise Summary Report */}
                {Object.keys(materialsBySeller).length > 0 && (
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', marginTop: '24px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#2d1f12' }}>
                            <FiUsers /> Seller-wise Inventory Summary
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {Object.entries(materialsBySeller).map(([sellerName, sellerMaterials]) => {
                                const sellerTotalValue = sellerMaterials.reduce((sum, m) => sum + ((m?.quantity || 0) * (m?.costPerUnit || 0)), 0);
                                const sellerLowStock = sellerMaterials.filter(m => (m?.quantity || 0) <= (m?.minThreshold || m?.minStockLevel || 0)).length;
                                return (
                                    <div key={sellerName} style={{ 
                                        backgroundColor: '#fefaf5', 
                                        borderRadius: '12px', 
                                        padding: '16px',
                                        border: '1px solid #f0e4d8'
                                    }}>
                                        <div style={{ fontWeight: 'bold', color: '#2d1f12', marginBottom: '8px' }}>{sellerName}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span>Materials: {sellerMaterials.length}</span>
                                            <span>Value: Rs. {sellerTotalValue.toLocaleString()}</span>
                                            {sellerLowStock > 0 && <span style={{ color: '#f59e0b' }}>⚠️ {sellerLowStock} low stock</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Material Details Modal */}
            {showDetailsModal && selectedMaterial && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowDetailsModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#2d1f12' }}>Material Details</h2>
                            <button onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <span style={{ fontSize: '48px' }}>{getCategoryIcon(selectedMaterial.category)}</span>
                                <div>
                                    <h3 style={{ margin: 0, color: '#2d1f12' }}>{selectedMaterial.name || '-'}</h3>
                                    <p style={{ margin: 0, color: '#8b6b58' }}>{selectedMaterial.category || '-'}</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><strong>Seller:</strong> {selectedMaterial.sellerName || selectedMaterial.sellerId?.shopName || '-'}</div>
                                <div><strong>Unit:</strong> {selectedMaterial.unit || '-'}</div>
                                <div><strong>Current Stock:</strong> {selectedMaterial.quantity || 0} {selectedMaterial.unit || ''}</div>
                                <div><strong>Min Threshold:</strong> {selectedMaterial.minThreshold || selectedMaterial.minStockLevel || 0} {selectedMaterial.unit || ''}</div>
                                <div><strong>Cost per Unit:</strong> Rs. {selectedMaterial.costPerUnit || 0}</div>
                                <div><strong>Total Value:</strong> Rs. {((selectedMaterial.quantity || 0) * (selectedMaterial.costPerUnit || 0)).toLocaleString()}</div>
                                <div><strong>Supplier:</strong> {selectedMaterial.supplierName || selectedMaterial.supplier?.name || '-'}</div>
                                <div><strong>Status:</strong> {getStockStatus(selectedMaterial).text}</div>
                            </div>
                            
                            {selectedMaterial.notes && (
                                <div style={{ marginTop: '16px' }}>
                                    <strong>Notes:</strong>
                                    <p style={{ marginTop: '4px', color: '#8b6b58' }}>{selectedMaterial.notes}</p>
                                </div>
                            )}
                            
                            {selectedMaterial.supplierLink && (
                                <div style={{ marginTop: '16px' }}>
                                    <a href={selectedMaterial.supplierLink} target="_blank" rel="noopener noreferrer" style={{ color: '#9a3412' }}>
                                        🔗 Order from Supplier
                                    </a>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#9a3412',
                                color: 'white',
                                border: 'none',
                                borderRadius: '40px',
                                cursor: 'pointer',
                                marginTop: '16px'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Print Styles */}
            <style>{`
                @media print {
                    .sidebar-container {
                        display: none;
                    }
                    .main-content-container {
                        margin-left: 0 !important;
                        padding: 20px;
                    }
                    button, .btn-secondary, .btn-primary {
                        display: none;
                    }
                    .card {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                }
                .loading-spinner {
                    width: 48px;
                    height: 48px;
                    border: 3px solid #f0e4d8;
                    border-top: 3px solid #9a3412;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Inventory;