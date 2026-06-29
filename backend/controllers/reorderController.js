// backend/controllers/reorderController.js
const RawMaterial = require('../models/RawMaterial');

// Generate reorder report (JSON)
const generateReorderReport = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'seller') {
            query.sellerId = req.user._id;
        }
        
        // Get low stock materials
        const lowStockMaterials = await RawMaterial.find({
            ...query,
            $expr: { $lte: ['$quantity', '$minThreshold'] }
        });
        
        const reportData = lowStockMaterials.map(m => ({
            _id: m._id,
            name: m.name,
            currentStock: m.quantity,
            unit: m.unit,
            minThreshold: m.minThreshold,
            recommendedOrder: m.defaultOrderQuantity || 50,
            supplierLink: m.supplierLink,
            supplierName: m.supplierName || 'Daraz',
            estimatedCost: (m.defaultOrderQuantity || 50) * (m.costPerUnit || 0)
        }));
        
        const totalCost = reportData.reduce((sum, m) => sum + m.estimatedCost, 0);
        
        res.json({
            success: true,
            report: {
                generatedAt: new Date(),
                items: reportData,
                totalItems: reportData.length,
                totalEstimatedCost: totalCost,
                summary: {
                    critical: reportData.filter(m => m.currentStock === 0).length,
                    low: reportData.filter(m => m.currentStock > 0).length
                }
            }
        });
        
    } catch (error) {
        console.error('Generate report error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate PDF report
const generateReorderPDF = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'seller') {
            query.sellerId = req.user._id;
        }
        
        const lowStockMaterials = await RawMaterial.find({
            ...query,
            $expr: { $lte: ['$quantity', '$minThreshold'] }
        });
        
        // Simple HTML PDF (browser print friendly)
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reorder Report - ResinArt</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #9a3412; text-align: center; }
                    h2 { color: #5c3a28; margin-top: 30px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    th { background-color: #9a3412; color: white; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
                    .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
                    .critical { color: #dc2626; font-weight: bold; }
                    .low { color: #f59e0b; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ResinArt - Reorder Report</h1>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                
                <h2>Low Stock Materials</h2>
                <table>
                    <thead>
                        <tr><th>Material</th><th>Current Stock</th><th>Min Threshold</th><th>To Order</th><th>Supplier</th><th>Est. Cost</th></tr>
                    </thead>
                    <tbody>
                        ${lowStockMaterials.map(m => `
                            <tr>
                                <td>${m.name}</td>
                                <td class="${m.quantity === 0 ? 'critical' : 'low'}">${m.quantity} ${m.unit}</td>
                                <td>${m.minThreshold}</td>
                                <td>${m.defaultOrderQuantity || 50}</td>
                                <td>${m.supplierName || 'Daraz'}</td>
                                <td>Rs. ${((m.defaultOrderQuantity || 50) * (m.costPerUnit || 0)).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total">
                    Total Estimated Cost: Rs. ${lowStockMaterials.reduce((sum, m) => sum + ((m.defaultOrderQuantity || 50) * (m.costPerUnit || 0)), 0).toLocaleString()}
                </div>
                
                <div class="footer">
                    <p>ResinArt Inventory Management System</p>
                    <p>${new Date().getFullYear()} © ResinArt</p>
                </div>
            </body>
            </html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
        
    } catch (error) {
        console.error('Generate PDF error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { generateReorderReport, generateReorderPDF };