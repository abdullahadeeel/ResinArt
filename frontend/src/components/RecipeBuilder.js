// frontend/src/components/RecipeBuilder.js
import React, { useState, useEffect } from 'react';
import { getAvailableMaterials, saveProductRecipe, getProductRecipe } from '../services/api';
import toast from 'react-hot-toast';

const RecipeBuilder = ({ productId, onSaveComplete }) => {
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, [productId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const materialsRes = await getAvailableMaterials();
            if (materialsRes.data.success) {
                setAvailableMaterials(materialsRes.data.materials);
            }
            
            const recipeRes = await getProductRecipe(productId);
            if (recipeRes.data.success && recipeRes.data.recipe && recipeRes.data.recipe.rawMaterials && recipeRes.data.recipe.rawMaterials.length > 0) {
                setSelectedMaterials(recipeRes.data.recipe.rawMaterials);
            } else {
                setSelectedMaterials([{
                    materialId: '',
                    materialName: '',
                    quantity: '',
                    unit: '',
                    wastageFactor: ''
                }]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setSelectedMaterials([{
                materialId: '',
                materialName: '',
                quantity: '',
                unit: '',
                wastageFactor: ''
            }]);
        } finally {
            setLoading(false);
        }
    };

    const addMaterial = () => {
        setSelectedMaterials([...selectedMaterials, {
            materialId: '',
            materialName: '',
            quantity: '',
            unit: '',
            wastageFactor: ''
        }]);
    };

    const updateMaterial = (index, field, value) => {
        const updated = [...selectedMaterials];
        updated[index][field] = value;
        
        if (field === 'materialId') {
            const material = availableMaterials.find(m => m._id === value);
            if (material) {
                updated[index].materialName = material.name;
                updated[index].unit = material.unit;
            }
        }
        
        setSelectedMaterials(updated);
    };

    const removeMaterial = (index) => {
        if (selectedMaterials.length === 1) {
            toast.error('At least one material is required');
            return;
        }
        const updated = selectedMaterials.filter((_, i) => i !== index);
        setSelectedMaterials(updated);
    };

    const calculateTotalCost = () => {
        let total = 0;
        for (const item of selectedMaterials) {
            if (item.materialId && item.quantity && parseFloat(item.quantity) > 0) {
                const material = availableMaterials.find(m => m._id === item.materialId);
                if (material) {
                    const qty = parseFloat(item.quantity) || 0;
                    const wastage = parseFloat(item.wastageFactor) || 0;
                    const cost = material.costPerUnit * qty;
                    const withWastage = cost * (1 + wastage / 100);
                    total += withWastage;
                }
            }
        }
        return Math.round(total * 100) / 100;
    };

    const handleSave = async () => {
        const validMaterials = selectedMaterials.filter(m => 
            m.materialId && m.quantity && parseFloat(m.quantity) > 0
        ).map(m => ({
            materialId: m.materialId,
            quantity: parseFloat(m.quantity),
            wastageFactor: parseFloat(m.wastageFactor) || 0
        }));
        
        if (validMaterials.length === 0) {
            toast.error('Please add at least one raw material with valid quantity');
            return;
        }
        
        setSaving(true);
        try {
            const response = await saveProductRecipe(productId, {
                rawMaterials: validMaterials,
                productionTimeMinutes: 30
            });
            
            if (response.data.success) {
                toast.success(`Recipe saved with ${response.data.materialCount || validMaterials.length} material(s)! Total cost: Rs. ${response.data.totalCost}`);
                if (onSaveComplete) onSaveComplete();
            } else {
                toast.error(response.data.message || 'Error saving recipe');
            }
        } catch (error) {
            console.error('Error saving recipe:', error);
            toast.error(error.response?.data?.message || 'Error saving recipe');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading materials...</div>;
    }

    return (
        <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '12px', 
            backgroundColor: '#f9fafb' 
        }}>
            <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 'bold' }}>
                📋 Raw Materials Required (BOM)
            </h3>
            <p style={{ marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
                Select all raw materials needed to make this product.
            </p>
            
            {selectedMaterials.map((material, index) => (
                <div key={index} style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    marginBottom: '12px', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    backgroundColor: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                }}>
                    <select
                        value={material.materialId || ''}
                        onChange={(e) => updateMaterial(index, 'materialId', e.target.value)}
                        style={{ flex: 2, minWidth: '150px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    >
                        <option value="">-- Select Material --</option>
                        {availableMaterials.map(m => (
                            <option key={m._id} value={m._id}>
                                {m.name} (Available: {m.quantity} {m.unit}) - Rs.{m.costPerUnit}/{m.unit}
                            </option>
                        ))}
                    </select>
                    
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={material.quantity === '' ? '' : material.quantity}
                        onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                        style={{ flex: 1, minWidth: '100px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    
                    <span style={{ minWidth: '50px', textAlign: 'center' }}>{material.unit || 'unit'}</span>
                    
                    <input
                        type="number"
                        placeholder="Wastage %"
                        value={material.wastageFactor === '' ? '' : material.wastageFactor}
                        onChange={(e) => updateMaterial(index, 'wastageFactor', e.target.value)}
                        style={{ flex: 1, minWidth: '100px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    
                    <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#dc2626', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer'
                        }}
                    >
                        Remove
                    </button>
                </div>
            ))}
            
            {calculateTotalCost() > 0 && (
                <div style={{ 
                    marginTop: '16px', 
                    padding: '12px', 
                    backgroundColor: '#f0fdf4', 
                    borderRadius: '8px',
                    textAlign: 'right'
                }}>
                    <strong>Total Material Cost: Rs. {calculateTotalCost().toLocaleString()}</strong>
                </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button
                    type="button"
                    onClick={addMaterial}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer'
                    }}
                >
                    + Add Another Material
                </button>
                
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#9a3412', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer'
                    }}
                >
                    {saving ? 'Saving...' : 'Save Recipe'}
                </button>
            </div>
        </div>
    );
};

export default RecipeBuilder;