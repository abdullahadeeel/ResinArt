// frontend/src/services/api.js

import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🌐 Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
const authEndpoints = ['/auth/login', '/auth/register', '/seller/login', '/seller/register', '/admin/login'];
API.interceptors.response.use(
    (response) => {
        console.log(`✅ Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`❌ Response Error: ${error.response?.status} ${error.config?.url}`, error.message);
        
        // Handle token expiration — skip auth endpoints
        const isAuthEndpoint = authEndpoints.some(endpoint => error.config?.url?.includes(endpoint));
        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

// ==================== AUTH APIs ====================

// User Auth
export const userLogin = (credentials) => API.post('/auth/login', credentials);
export const userSignup = (userData) => API.post('/auth/register', userData);

// Admin Auth
export const adminLogin = (credentials) => API.post('/admin/login', credentials);
export const adminSignup = (userData) => API.post('/admin/register', userData);

// Seller Auth
export const sellerLogin = (credentials) => API.post('/seller/login', credentials);
export const sellerSignup = (userData) => API.post('/seller/register', userData);

// ==================== USER APIs ====================

export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);
export const getProductsByCategory = (category) => API.get(`/products/category/${category}`);

// Cart APIs
export const getCart = () => API.get('/cart');
export const addToCart = (productId, quantity) => API.post('/cart/add', { productId, quantity });
export const updateCartItem = (itemId, quantity) => API.put(`/cart/update/${itemId}`, { quantity });
export const removeCartItem = (itemId) => API.delete(`/cart/remove/${itemId}`);
export const clearCart = () => API.delete('/cart/clear');

// Order APIs
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getUserOrders = () => API.get('/orders/my-orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);

// Wishlist APIs
export const getWishlist = () => API.get('/wishlist');
export const addToWishlist = (productId) => API.post('/wishlist/add', { productId });
export const removeFromWishlist = (productId) => API.delete(`/wishlist/remove/${productId}`);

// User Profile APIs
export const getUserProfile = () => API.get('/users/profile');
export const updateUserProfile = (profileData) => API.put('/users/profile', profileData);

// ==================== ADMIN APIs ====================

// Product Management
export const adminGetProducts = () => API.get('/admin/products');
export const adminCreateProduct = (productData) => API.post('/admin/products', productData);
export const adminUpdateProduct = (id, productData) => API.put(`/admin/products/${id}`, productData);
export const adminDeleteProduct = (id) => API.delete(`/admin/products/${id}`);

// Order Management
export const adminGetOrders = () => API.get('/admin/orders');
export const adminUpdateOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status`, { status });

// User Management
export const adminGetUsers = () => API.get('/admin/users');
export const adminUpdateUserRole = (id, role) => API.put(`/admin/users/${id}/role`, { role });
export const adminDeleteUser = (id) => API.delete(`/admin/users/${id}`);

// Seller Management
export const adminGetSellers = () => API.get('/admin/sellers');
export const adminApproveSeller = (id) => API.put(`/admin/sellers/${id}/approve`);
export const adminRejectSeller = (id) => API.put(`/admin/sellers/${id}/reject`);

// Dashboard Stats
export const adminGetDashboardStats = () => API.get('/admin/dashboard/stats');

// ==================== SELLER APIs ====================

// Seller Dashboard
export const getSellerDashboard = () => API.get('/seller/dashboard');
export const getSellerEarnings = () => API.get('/seller/earnings');

// Seller Product Management
export const getSellerProducts = () => API.get('/seller/products');
export const createSellerProduct = (productData) => API.post('/seller/products', productData);
export const updateSellerProduct = (id, productData) => API.put(`/seller/products/${id}`, productData);
export const deleteSellerProduct = (id) => API.delete(`/seller/products/${id}`);

// Seller Order Management
export const getSellerOrders = () => API.get('/seller/orders');
export const updateSellerOrderStatus = (id, status) => API.put(`/seller/orders/${id}/status`, { status });

// Seller Profile
export const getSellerProfile = () => API.get('/seller/profile');
export const updateSellerProfile = (profileData) => API.put('/seller/profile', profileData);

// ==================== RECIPE / BOM APIs ====================

// Get all available materials for dropdown
export const getAvailableMaterials = async () => {
    try {
        const response = await API.get('/materials');
        return {
            data: {
                success: response.data.success,
                materials: response.data.materials || []
            }
        };
    } catch (error) {
        console.error('Error fetching materials:', error);
        return {
            data: {
                success: false,
                materials: []
            }
        };
    }
};

// Get recipe for a product
export const getProductRecipe = (productId) => API.get(`/recipes/product/${productId}`);

// Save recipe for a product
export const saveProductRecipe = (productId, recipeData) => API.post(`/recipes/product/${productId}`, recipeData);

// Get all recipes (admin)
export const getAllRecipes = () => API.get('/recipes');

// Delete recipe
export const deleteRecipe = (productId) => API.delete(`/recipes/product/${productId}`);

// ==================== ✅ INVENTORY APIs ====================

// ==================== ✅ INVENTORY APIs ====================

// Get all materials (Admin: all, Seller: own only)
export const getMaterials = async () => {
    const response = await API.get('/inventory/materials');
    return response;
};

// Get single material by ID
export const getMaterialById = async (id) => {
    const response = await API.get(`/inventory/materials/${id}`);
    return response;
};

// Create new material (Seller only)
export const createMaterial = async (materialData) => {
    const response = await API.post('/inventory/materials', materialData);
    return response;
};

// Update material (Seller only - own materials)
export const updateMaterial = async (id, materialData) => {
    const response = await API.put(`/inventory/materials/${id}`, materialData);
    return response;
};

// Delete material (Seller only - own materials)
export const deleteMaterial = async (id) => {
    const response = await API.delete(`/inventory/materials/${id}`);
    return response;
};

// Update stock quantity (Seller only)
export const updateMaterialStock = async (id, quantity, operation = 'set') => {
    const response = await API.put(`/inventory/materials/${id}/stock`, { quantity, operation });
    return response;
};

// Get low stock materials (Admin: all, Seller: own only)
export const getLowStockMaterials = async () => {
    const response = await API.get('/inventory/low-stock');
    return response;
};

// Get inventory stats
export const getInventoryStats = async () => {
    const response = await API.get('/inventory/stats');
    return response;
};

// Get inventory by seller (Admin only)
export const getInventoryBySeller = async (sellerId) => {
    const response = await API.get(`/inventory/seller/${sellerId}`);
    return response;
};
// frontend/src/services/api.js - Add these functions

// ==================== SELLER INVENTORY APIs ====================

// Get seller's materials
export const getSellerMaterials = () => API.get('/seller/inventory/materials');

// Create material
export const createSellerMaterial = (data) => API.post('/seller/inventory/materials', data);

// Update material
export const updateSellerMaterial = (id, data) => API.put(`/seller/inventory/materials/${id}`, data);

// Delete material
export const deleteSellerMaterial = (id) => API.delete(`/seller/inventory/materials/${id}`);

// Update stock
export const updateSellerStock = (id, quantity, operation, note) => 
    API.put(`/seller/inventory/stock/${id}`, { quantity, operation, note });

// Get product BOM
export const getProductBOM = (productId) => API.get(`/seller/inventory/bom/${productId}`);

// Save product BOM
export const saveProductBOM = (data) => API.post('/seller/inventory/bom', data);

// Auto deduct stock on order
export const autoDeductStock = (orderId, items) => 
    API.post('/seller/inventory/auto-deduct', { orderId, items });

// Get transactions
export const getSellerTransactions = (params) => API.get('/seller/inventory/transactions', { params });

// Get low stock materials
export const getSellerLowStock = () => API.get('/seller/inventory/low-stock');

// Get inventory dashboard stats
export const getSellerInventoryStats = () => API.get('/seller/inventory/dashboard-stats');
// ==================== REPORT APIs ====================

export const getSalesReport = (startDate, endDate) => API.get('/reports/sales', { params: { startDate, endDate } });

// ==================== HELPER FUNCTIONS ====================

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
};

// ✅ Default export bhi rakho for backward compatibility
export default API;