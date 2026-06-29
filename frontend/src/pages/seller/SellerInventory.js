// frontend/src/pages/seller/SellerInventory.js

import React, { useState, useEffect } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiRefreshCw, FiSearch, FiAlertCircle, FiTrendingUp, FiPackage, FiX, FiSave, FiArrowUp } from 'react-icons/fi';

const SellerInventory = () => {
    const [materials, setMaterials] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [stockData, setStockData] = useState({ quantity: 0, operation: 'add', note: '' });

    const token = localStorage.getItem('token');
    const API_URL = 'http://localhost:5000/api/seller/inventory';

    // ✅ UPDATED CATEGORIES - Resin Art Complete
    const categories = [
        'Resin', 'Hardener', 'Pigment', 'Dye', 'Mica Powder', 'Glitter', 'Flakes',
        'Dried Flowers', 'Preserved Flowers', 'Natural Elements', 'Mold', 'Tool',
        'Hardware', 'Finding', 'Packaging', 'Safety', 'Solvent', 'Adhesive',
        'Measuring', 'Mixing', 'Finishing', 'Other'
    ];

    // ✅ UPDATED UNITS - All possible units
    const units = [
        'ml', 'L', 'g', 'kg', 'piece', 'set', 'pack', 'bottle', 'jar', 
        'box', 'roll', 'sheet', 'pair', 'dozen', 'tube', 'can', 'bunch', 
        'gram', 'kilogram', 'milliliter', 'liter', 'packet', 'bottle (100ml)',
        'bottle (250ml)', 'bottle (500ml)', 'bottle (1L)', 'jar (50g)', 
        'jar (100g)', 'jar (500g)', 'set (10pcs)', 'pack (20pcs)', 'pack (50pcs)'
    ];

    const [formData, setFormData] = useState({
        name: '', category: 'Resin', quantity: '', unit: 'ml',
        minThreshold: '', costPerUnit: '', supplierName: '', supplierLink: '', notes: ''
    });

    // Fetch all data
    const fetchAllData = async () => {
        setLoading(true);
        try {
            const materialsRes = await axios.get(`${API_URL}/materials`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Materials Response:', materialsRes.data);
            
            if (materialsRes.data.success) {
                setMaterials(materialsRes.data.materials || []);
                if (materialsRes.data.stats) {
                    setStats(materialsRes.data.stats);
                }
            }

            const statsRes = await axios.get(`${API_URL}/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (statsRes.data.success && statsRes.data.stats) {
                setStats(statsRes.data.stats);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAllData();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.costPerUnit) {
            toast.error('Please fill required fields');
            return;
        }
        try {
            if (editingMaterial) {
                await axios.put(`${API_URL}/materials/${editingMaterial._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Material updated');
            } else {
                await axios.post(`${API_URL}/materials`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Material added');
            }
            setShowForm(false);
            setEditingMaterial(null);
            setFormData({ name: '', category: 'Resin', quantity: '', unit: 'ml', minThreshold: '', costPerUnit: '', supplierName: '', supplierLink: '', notes: '' });
            fetchAllData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this material?')) {
            try {
                await axios.delete(`${API_URL}/materials/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Material deleted');
                fetchAllData();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    const handleStockUpdate = async () => {
        if (!selectedMaterial) return;
        try {
            await axios.put(`${API_URL}/stock/${selectedMaterial._id}`, stockData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Stock updated');
            setShowStockModal(false);
            fetchAllData();
        } catch (error) {
            toast.error('Stock update failed');
        }
    };

    const handleEdit = (material) => {
        setEditingMaterial(material);
        setFormData({
            name: material.name,
            category: material.category,
            quantity: material.quantity,
            unit: material.unit,
            minThreshold: material.minThreshold,
            costPerUnit: material.costPerUnit,
            supplierName: material.supplierName || '',
            supplierLink: material.supplierLink || '',
            notes: material.notes || ''
        });
        setShowForm(true);
    };

    const filteredMaterials = materials.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedCategory || m.category === selectedCategory)
    );

    if (loading) {
        return (
            <div style={{ display: 'flex' }}>
                <SellerSidebar />
                <div style={{ marginLeft: '280px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', backgroundColor: '#fefaf5', minHeight: '100vh' }}>
            <SellerSidebar />
            <div style={{ marginLeft: '280px', flex: 1, padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d1f12', margin: 0 }}>My Inventory</h1>
                        <p style={{ color: '#8b6b58', marginTop: '4px' }}>Manage your raw materials</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={fetchAllData} style={buttonOutline}><FiRefreshCw /> Refresh</button>
                        <button onClick={() => setShowForm(true)} style={buttonPrimary}><FiPlus /> Add Material</button>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div style={statCard}>
                            <div><p style={statLabel}>Total Materials</p><h2 style={statValue}>{stats.totalMaterials || 0}</h2></div>
                            <FiPackage size={32} style={{ color: '#b88d6e' }} />
                        </div>
                        <div style={statCard}>
                            <div><p style={statLabel}>Inventory Value</p><h2 style={statValue}>Rs. {(stats.totalValue || 0).toLocaleString()}</h2></div>
                            <FiTrendingUp size={32} style={{ color: '#10b981' }} />
                        </div>
                        <div style={statCard}>
                            <div><p style={statLabel}>Low Stock Alerts</p><h2 style={{ ...statValue, color: (stats.lowStockCount || 0) > 0 ? '#f59e0b' : '#10b981' }}>{stats.lowStockCount || 0}</h2></div>
                            <FiAlertCircle size={32} style={{ color: (stats.lowStockCount || 0) > 0 ? '#f59e0b' : '#10b981' }} />
                        </div>
                    </div>
                )}

                {/* Search & Filter */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f0e4d8', borderRadius: '40px', padding: '8px 16px' }}>
                        <FiSearch /><input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
                        {searchTerm && <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX /></button>}
                    </div>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={selectStyle}>
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Materials Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#fefaf5', borderBottom: '1px solid #f0e4d8' }}>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Category</th>
                                <th style={thStyle}>Stock</th>
                                <th style={thStyle}>Min Threshold</th>
                                <th style={thStyle}>Cost/Unit</th>
                                <th style={thStyle}>Total Value</th>
                                <th style={thStyle}>Supplier</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaterials.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ padding: '48px', textAlign: 'center', color: '#8b6b58' }}>
                                        No materials found. Click "Add Material" to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredMaterials.map(m => {
                                    const isLowStock = m.quantity <= m.minThreshold;
                                    return (
                                        <tr key={m._id} style={{ borderBottom: '1px solid #f0e4d8', backgroundColor: isLowStock ? '#fef3c7' : 'white' }}>
                                            <td style={tdStyle}><strong>{m.name}</strong>{m.notes && <div style={{ fontSize: '11px', color: '#8b6b58' }}>{m.notes.substring(0, 40)}</div>}</td>
                                            <td style={tdStyle}>{m.category}</td>
                                            <td style={tdStyle}>{m.quantity} {m.unit}</td>
                                            <td style={tdStyle}>{m.minThreshold} {m.unit}</td>
                                            <td style={tdStyle}>Rs. {m.costPerUnit}</td>
                                            <td style={tdStyle}>Rs. {(m.quantity * m.costPerUnit).toLocaleString()}</td>
                                            <td style={tdStyle}>{m.supplierLink ? <a href={m.supplierLink} target="_blank" rel="noopener noreferrer">{m.supplierName || 'Link'} 🔗</a> : m.supplierName || '-'}</td>
                                            <td style={tdStyle}>
                                                <button onClick={() => { setSelectedMaterial(m); setStockData({ quantity: 0, operation: 'add', note: '' }); setShowStockModal(true); }} style={actionBtn}><FiArrowUp size={12} /> Stock</button>
                                                <button onClick={() => handleEdit(m)} style={actionBtn}><FiEdit2 size={12} /></button>
                                                <button onClick={() => handleDelete(m._id)} style={{ ...actionBtn, backgroundColor: '#dc2626' }}><FiTrash2 size={12} /></button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showForm && (
                <div style={modalOverlay} onClick={() => { setShowForm(false); setEditingMaterial(null); }}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <h2>{editingMaterial ? 'Edit Material' : 'Add New Material'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Material Name *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle}>
                                        {categories.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Unit</label>
                                    <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} style={inputStyle}>
                                        {units.map(u => <option key={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label>Quantity</label>
                                    <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} style={inputStyle} />
                                </div>
                                <div>
                                    <label>Min Threshold</label>
                                    <input type="number" value={formData.minThreshold} onChange={e => setFormData({...formData, minThreshold: e.target.value})} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label>Cost per Unit (Rs.) *</label>
                                    <input type="number" value={formData.costPerUnit} onChange={e => setFormData({...formData, costPerUnit: e.target.value})} required style={inputStyle} />
                                </div>
                                <div>
                                    <label>Supplier Name</label>
                                    <input type="text" value={formData.supplierName} onChange={e => setFormData({...formData, supplierName: e.target.value})} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Supplier Link</label>
                                <input type="url" value={formData.supplierLink} onChange={e => setFormData({...formData, supplierLink: e.target.value})} style={inputStyle} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label>Notes</label>
                                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows="2" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" style={saveBtn}><FiSave /> Save</button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingMaterial(null); }} style={cancelBtn}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stock Modal */}
            {showStockModal && selectedMaterial && (
                <div style={modalOverlay} onClick={() => setShowStockModal(false)}>
                    <div style={{ ...modalContent, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <h2>Update Stock: {selectedMaterial.name}</h2>
                        <p>Current: {selectedMaterial.quantity} {selectedMaterial.unit}</p>
                        <select value={stockData.operation} onChange={e => setStockData({...stockData, operation: e.target.value})} style={inputStyle}>
                            <option value="add">Add to stock</option>
                            <option value="deduct">Deduct from stock</option>
                            <option value="set">Set to specific quantity</option>
                        </select>
                        <input type="number" placeholder="Quantity" value={stockData.quantity} onChange={e => setStockData({...stockData, quantity: parseFloat(e.target.value) || 0})} style={inputStyle} />
                        <input type="text" placeholder="Note" value={stockData.note} onChange={e => setStockData({...stockData, note: e.target.value})} style={inputStyle} />
                        <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
                            <button onClick={handleStockUpdate} style={saveBtn}>Update</button>
                            <button onClick={() => setShowStockModal(false)} style={cancelBtn}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .loading-spinner { width: 48px; height: 48px; border: 3px solid #f0e4d8; border-top: 3px solid #9a3412; border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

// Styles
const thStyle = { padding: '16px', textAlign: 'left', color: '#5c3a28', fontWeight: '600' };
const tdStyle = { padding: '16px', color: '#2d1f12', borderBottom: '1px solid #f0e4d8' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', marginTop: '5px' };
const actionBtn = { padding: '4px 8px', margin: '0 4px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' };
const buttonPrimary = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer' };
const buttonOutline = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'white', border: '1px solid #f0e4d8', borderRadius: '40px', cursor: 'pointer' };
const statCard = { backgroundColor: 'white', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const statLabel = { color: '#8b6b58', fontSize: '13px', margin: 0 };
const statValue = { fontSize: '28px', fontWeight: 'bold', margin: 0 };
const selectStyle = { padding: '10px 20px', borderRadius: '40px', border: '1px solid #f0e4d8', backgroundColor: 'white', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: 'white', borderRadius: '20px', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' };
const saveBtn = { flex: 1, padding: '12px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const cancelBtn = { padding: '12px 24px', backgroundColor: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default SellerInventory;