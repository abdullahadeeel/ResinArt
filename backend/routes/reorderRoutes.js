// backend/routes/reorderRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateReorderReport, generateReorderPDF } = require('../controllers/reorderController');

// @route   GET /api/reorder/report
// @desc    Generate reorder report (JSON)
// @access  Private (Admin/Seller)
router.get('/report', protect, generateReorderReport);

// @route   GET /api/reorder/report-pdf
// @desc    Generate reorder report (HTML/PDF)
// @access  Private (Admin/Seller)
router.get('/report-pdf', protect, generateReorderPDF);

module.exports = router;