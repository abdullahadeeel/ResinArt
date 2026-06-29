// backend/routes/inventoryRoutes.js

const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getMaterials,
    getMaterialById,
    getLowStockMaterials,
    getInventoryStats
} = require('../controllers/inventoryController');

// ==================== ADMIN INVENTORY ROUTES (READ-ONLY) ====================
// ✅ These routes use the actual controller functions

router.get('/materials', protect, admin, getMaterials);
router.get('/materials/:id', protect, admin, getMaterialById);
router.get('/low-stock', protect, admin, getLowStockMaterials);
router.get('/stats', protect, admin, getInventoryStats);

module.exports = router;