import API from '../services/api';

export const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
    .replace(/\/api\/?$/, '');

export function isPersistedPath(source) {
    if (!source || typeof source !== 'string') return false;
    if (
        source.startsWith('data:') ||
        source.startsWith('blob:') ||
        (source.startsWith('http') && !source.startsWith(`${API_ORIGIN}/uploads/`))
    ) {
        return false;
    }
    if (source.startsWith('/uploads/')) return true;
    if (source.startsWith(`${API_ORIGIN}/uploads/`)) return true;
    return false;
}

export function normalizeImagePath(source) {
    if (!source) return '';

    if (isPersistedPath(source)) {
        const withoutOrigin = source.replace(API_ORIGIN, '');
        return withoutOrigin.startsWith('/uploads/')
            ? withoutOrigin
            : `/uploads/${withoutOrigin.replace(/^\/+/, '')}`;
    }

    return source;
}

export function getImageUrl(imagePath) {
    if (!imagePath) return null;
    if (
        imagePath.startsWith('http') ||
        imagePath.startsWith('data:') ||
        imagePath.startsWith('blob:')
    ) {
        return imagePath;
    }

    if (imagePath.startsWith('/uploads')) {
        return `${API_ORIGIN}${imagePath}`;
    }

    return `${API_ORIGIN}/uploads/${imagePath.replace(/^\/+/, '')}`;
}

export async function persistImage(source) {
    if (!source) {
        throw new Error('No image to save');
    }

    if (isPersistedPath(source)) {
        return normalizeImagePath(source);
    }

    if (source.startsWith('http://') || source.startsWith('https://')) {
        const response = await API.post('/images/persist', { source });
        return response.data.data.imageUrl;
    }

    if (source.startsWith('data:') || source.startsWith('blob:')) {
        const blob = await fetch(source).then((res) => res.blob());
        const formData = new FormData();
        formData.append('image', blob, `image-${Date.now()}.png`);

        const response = await API.post('/images/persist', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data.imageUrl;
    }

    throw new Error('Unsupported image format');
}
