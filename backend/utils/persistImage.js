const fs = require('fs');
const path = require('path');
const axios = require('axios');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');

const MIME_TO_EXT = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp'
};

function ensureImagesDir() {
    if (!fs.existsSync(IMAGES_DIR)) {
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
}

function extFromMime(mime) {
    if (!mime) return '.png';
    return MIME_TO_EXT[mime.split(';')[0].trim().toLowerCase()] || '.png';
}

function generateFilename(ext = '.png') {
    const safeExt = ext.startsWith('.') ? ext : `.${ext}`;
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `img-${uniqueSuffix}${safeExt}`;
}

function normalizeToRelativePath(source) {
    if (!source || typeof source !== 'string') return '';

    let value = source.trim();
    value = value.replace(/^https?:\/\/[^/]+/i, '');

    if (!value.startsWith('/uploads/')) {
        if (value.startsWith('uploads/')) {
            value = `/${value}`;
        } else if (value.startsWith('/')) {
            value = `/uploads${value}`;
        } else {
            value = `/uploads/${value.replace(/^\/+/, '')}`;
        }
    }

    return value;
}

function isLocalUploadPath(source) {
    if (!source || typeof source !== 'string') return false;
    if (
        source.startsWith('data:') ||
        source.startsWith('blob:') ||
        source.startsWith('http://') ||
        source.startsWith('https://')
    ) {
        return false;
    }

    return normalizeToRelativePath(source).startsWith('/uploads/');
}

function writeImageBuffer(buffer, ext = '.png') {
    ensureImagesDir();
    const filename = generateFilename(ext);
    const filepath = path.join(IMAGES_DIR, filename);
    fs.writeFileSync(filepath, buffer);
    return `/uploads/images/${filename}`;
}

function persistFromDataUrl(dataUrl) {
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid data URL');
    }

    const mime = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    return writeImageBuffer(buffer, extFromMime(mime));
}

async function persistFromRemoteUrl(url) {
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000,
        maxContentLength: 10 * 1024 * 1024,
        maxBodyLength: 10 * 1024 * 1024
    });

    const contentType = response.headers['content-type'] || 'image/png';
    if (!contentType.startsWith('image/')) {
        throw new Error('Remote URL did not return an image');
    }

    return writeImageBuffer(Buffer.from(response.data), extFromMime(contentType));
}

async function persistImageSource(source) {
    if (!source || typeof source !== 'string') {
        throw new Error('Image source is required');
    }

    if (isLocalUploadPath(source)) {
        return normalizeToRelativePath(source);
    }

    if (source.startsWith('data:')) {
        return persistFromDataUrl(source);
    }

    if (source.startsWith('http://') || source.startsWith('https://')) {
        return persistFromRemoteUrl(source);
    }

    throw new Error('Unsupported image source. Use a local /uploads path, data URL, or http(s) URL.');
}

function persistFromUploadedFile(file) {
    if (!file) {
        throw new Error('No file uploaded');
    }

    if (file.path) {
        const filename = path.basename(file.path);
        if (file.path.includes(`${path.sep}images${path.sep}`)) {
            return `/uploads/images/${filename}`;
        }
        return `/uploads/${filename}`;
    }

    if (file.buffer) {
        const ext = path.extname(file.originalname || '') || extFromMime(file.mimetype);
        return writeImageBuffer(file.buffer, ext);
    }

    throw new Error('Uploaded file is missing data');
}

function deleteLocalImage(imagePath) {
    if (!imagePath) return false;

    const relative = normalizeToRelativePath(imagePath);
    if (!relative.startsWith('/uploads/')) return false;

    const filepath = path.join(__dirname, '..', relative.replace(/^\//, ''));
    if (!fs.existsSync(filepath)) return false;

    fs.unlinkSync(filepath);
    return true;
}

module.exports = {
    IMAGES_DIR,
    ensureImagesDir,
    isLocalUploadPath,
    normalizeToRelativePath,
    persistImageSource,
    persistFromUploadedFile,
    deleteLocalImage
};
