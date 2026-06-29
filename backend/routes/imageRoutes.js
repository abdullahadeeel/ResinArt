const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ensureImagesDir } = require('../utils/persistImage');
const { persistImage } = require('../controllers/imagecontroller');

ensureImagesDir();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureImagesDir();
        cb(null, path.join(__dirname, '../uploads/images'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || '.png';
        cb(null, `img-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/persist', upload.single('image'), persistImage);

module.exports = router;
