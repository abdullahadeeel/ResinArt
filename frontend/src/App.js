// frontend/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// ==================== COMPONENTS ====================
import Navbar from './components/Navbar';

// ==================== LANDING PAGE ====================
import LandingPage from './pages/LandingPage';

// ==================== USER PAGES ====================
import Home from './pages/user/Home';
import Shop from './pages/user/Shop';
import About from './pages/user/About';
import Customization from './pages/user/Customization';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import UserOrders from './pages/user/UserOrders';
import UserProfile from './pages/user/UserProfile';
import Wishlist from './pages/user/Wishlist';
import ProductDetail from './pages/user/ProductDetail';
import UserLogin from './pages/user/login';
import UserSignup from './pages/user/Signup';
import UserOrderDetails from './pages/user/OrderDetails';

// ==================== POLICY PAGES ====================
import ShippingInfo from './pages/user/ShippingInfo';
import ReturnsExchanges from './pages/user/ReturnsExchanges';
import PrivacyPolicy from './pages/user/PrivacyPolicy';
import TermsOfService from './pages/user/TermsOfService';

// ==================== BLOG PAGES ====================
import Blog from './pages/user/Blog';
import FlowerPreservation from './pages/user/FlowerPreservation';
import ResinJewelry from './pages/user/ResinJewelry';
import ResinHomeDecor from './pages/user/ResinHomeDecor';
import ResinBasics from './pages/user/ResinBasics';
import ColorTechniques from './pages/user/ColorTechniques';
import PreservingMemories from './pages/user/PreservingMemories';

// ==================== ADMIN PAGES ====================
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import AdminOrderDetails from './pages/OrderDetails';
import Users from './pages/Users';
import AdminSellers from './pages/AdminSellers';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import AdminProfile from './pages/AdminProfile';
import Inventory from './pages/Inventory';

// ==================== SELLER PAGES ====================
import SellerLogin from './pages/seller/SellerLogin';
import SellerSignup from './pages/seller/SellerSignup';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerAddProduct from './pages/seller/SellerAddProduct';
import SellerEditProduct from './pages/seller/SellerEditProduct';
import SellerOrders from './pages/seller/SellerOrders';
import SellerOrderDetails from './pages/seller/SellerOrderDetails';
import SellerProfile from './pages/seller/SellerProfile';
import SellerEarnings from './pages/seller/SellerEarnings';
import SellerInventory from './pages/seller/SellerInventory';

// ==================== ERROR PAGES ====================
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// ==================== ROUTE GUARDS ====================
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import SellerRoute from './components/SellerRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#2d1f12',
              color: '#fff',
              borderRadius: '40px',
            },
          }}
        />
        
        <Routes>
          {/* ==================== LANDING PAGE ==================== */}
          <Route path="/" element={<LandingPage />} />
          
          {/* ==================== POLICY PAGES (NO NAVBAR - CLEAN LAYOUT) ==================== */}
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/returns" element={<ReturnsExchanges />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* ==================== USER AUTH ROUTES ==================== */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          
          {/* ==================== USER PAGES WITH NAVBAR ==================== */}
          <Route path="/home" element={
            <>
              <Navbar />
              <Home />
            </>
          } />
          <Route path="/shop" element={
            <>
              <Navbar />
              <Shop />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              <About />
            </>
          } />
          <Route path="/customize" element={
            <>
              <Navbar />
              <Customization />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Navbar />
              <ProductDetail />
            </>
          } />
          <Route path="/cart" element={
            <>
              <Navbar />
              <Cart />
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Navbar />
              <Checkout />
            </>
          } />
          <Route path="/my-orders" element={
            <PrivateRoute>
              <>
                <Navbar />
                <UserOrders />
              </>
            </PrivateRoute>
          } />
          <Route path="/my-profile" element={
            <PrivateRoute>
              <>
                <Navbar />
                <UserProfile />
              </>
            </PrivateRoute>
          } />
          <Route path="/wishlist" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Wishlist />
              </>
            </PrivateRoute>
          } />
          
          {/* User Order Details Route */}
          <Route path="/order-details/:id" element={
            <PrivateRoute>
              <>
                <Navbar />
                <UserOrderDetails />
              </>
            </PrivateRoute>
          } />
          
          {/* ==================== BLOG ROUTES ==================== */}
          <Route path="/blog" element={
            <>
              <Navbar />
              <Blog />
            </>
          } />
          <Route path="/blog/flower-preservation" element={
            <>
              <Navbar />
              <FlowerPreservation />
            </>
          } />
          <Route path="/blog/resin-jewelry" element={
            <>
              <Navbar />
              <ResinJewelry />
            </>
          } />
          <Route path="/blog/resin-home-decor" element={
            <>
              <Navbar />
              <ResinHomeDecor />
            </>
          } />
          <Route path="/blog/resin-basics" element={
            <>
              <Navbar />
              <ResinBasics />
            </>
          } />
          <Route path="/blog/color-techniques" element={
            <>
              <Navbar />
              <ColorTechniques />
            </>
          } />
          <Route path="/blog/preserving-memories" element={
            <>
              <Navbar />
              <PreservingMemories />
            </>
          } />

          {/* ==================== AUTH ROUTES (Legacy - Keep for compatibility) ==================== */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          
          {/* ==================== ADMIN AUTH ROUTES ==================== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          
          {/* ==================== SELLER AUTH ROUTES ==================== */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/signup" element={<SellerSignup />} />

          {/* ==================== ADMIN ROUTES (No Navbar - Own Sidebar) ==================== */}
          <Route path="/dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path="/products" element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          } />
          <Route path="/add-product" element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          } />
          <Route path="/edit-product/:id" element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          } />
          <Route path="/inventory" element={
            <AdminRoute>
              <Inventory />
            </AdminRoute>
          } />
          <Route path="/orders" element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          } />
          <Route path="/order-details/:id" element={
            <AdminRoute>
              <AdminOrderDetails />
            </AdminRoute>
          } />
          <Route path="/users" element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          } />
          <Route path="/admin/sellers" element={
            <AdminRoute>
              <AdminSellers />
            </AdminRoute>
          } />
          <Route path="/reports" element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          } />
          <Route path="/settings" element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          } />
          <Route path="/admin/profile" element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          } />

          {/* ==================== SELLER ROUTES (No Navbar - Own Sidebar) ==================== */}
          <Route path="/seller/dashboard" element={
            <SellerRoute>
              <SellerDashboard />
            </SellerRoute>
          } />
          <Route path="/seller/products" element={
            <SellerRoute>
              <SellerProducts />
            </SellerRoute>
          } />
          <Route path="/seller/add-product" element={
            <SellerRoute>
              <SellerAddProduct />
            </SellerRoute>
          } />
          <Route path="/seller/edit-product/:id" element={
            <SellerRoute>
              <SellerEditProduct />
            </SellerRoute>
          } />
          <Route path="/seller/inventory" element={
            <SellerRoute>
              <SellerInventory />
            </SellerRoute>
          } />
          <Route path="/seller/orders" element={
            <SellerRoute>
              <SellerOrders />
            </SellerRoute>
          } />
          <Route path="/seller/order-details/:id" element={
            <SellerRoute>
              <SellerOrderDetails />
            </SellerRoute>
          } />
          <Route path="/seller/profile" element={
            <SellerRoute>
              <SellerProfile />
            </SellerRoute>
          } />
          <Route path="/seller/earnings" element={
            <SellerRoute>
              <SellerEarnings />
            </SellerRoute>
          } />

          {/* ==================== ERROR ROUTES ==================== */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;