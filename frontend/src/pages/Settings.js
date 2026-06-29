import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  FiSave, FiGlobe, FiMoon, FiSun, FiBell, FiLock, FiDollarSign,
  FiUser, FiCheckCircle, FiMail, FiPhone, FiMapPin, FiClock,
  FiCalendar, FiDroplet, FiImage, FiEye, FiEyeOff,
  FiTruck, FiPercent, FiTag, FiGift, FiAward
} from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isDark = false; // We'll use appearanceSettings.theme

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'ResinArt by Komal Zahra',
    storeEmail: 'info@resinart.com',
    storePhone: '+92 300 1234567',
    address: 'Lahore, Pakistan',
    currency: 'PKR',
    timezone: 'Asia/Karachi',
    dateFormat: 'DD/MM/YYYY'
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#9a3412',
    itemsPerPage: 20,
    fontSize: 'medium',
    animations: true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    newUserAlerts: true,
    lowStockAlerts: true,
    weeklyReports: false,
    orderConfirmed: true,
    orderShipped: true,
    orderDelivered: true,
    paymentReceived: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireStrongPassword: true,
    autoLogout: true,
    loginNotifications: true
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    cashOnDelivery: true,
    taxRate: 10,
    shippingFee: 200,
    freeShippingThreshold: 5000
  });

  // Features Settings
  const [featureSettings, setFeatureSettings] = useState({
    enableDeliverySlots: true,
    deliverySlots: ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM', '6:00 PM - 9:00 PM'],
    cancellationWindow: 24,
    enableBulkDiscount: true,
    bulkDiscountThreshold: 3,
    bulkDiscountPercentage: 10,
    enableLoyaltyPoints: true,
    pointsPerOrder: 10,
    pointsPerRupee: 1,
    enableGiftWrapping: true,
    giftWrappingFee: 150
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'general', label: 'General', icon: <FiGlobe size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <FiMoon size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell size={16} /> },
    { id: 'security', label: 'Security', icon: <FiLock size={16} /> },
    { id: 'payment', label: 'Payment', icon: <FiDollarSign size={16} /> },
    { id: 'features', label: 'Features', icon: <FiGift size={16} /> },
    { id: 'password', label: 'Password', icon: <FiUser size={16} /> }
  ];

  const currencies = ['PKR', 'USD', 'EUR'];
  const timezones = ['Asia/Karachi', 'Asia/Dubai', 'Asia/Singapore'];
  const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
  const fontSizes = ['small', 'medium', 'large'];

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#1a1a2e';
      document.body.style.color = '#e5e5e5';
    } else {
      document.body.style.backgroundColor = '#fffaf5';
      document.body.style.color = '#2d1f12';
    }
  };

  useEffect(() => {
    fetchSettings();
    applyTheme(appearanceSettings.theme);
  }, []);

  useEffect(() => {
    applyTheme(appearanceSettings.theme);
  }, [appearanceSettings.theme]);

  const fetchSettings = async () => {
    setFetchLoading(true);
    try {
      const response = await API.get('/settings');
      const data = response.data.data;
      if (data) {
        if (data.general) setGeneralSettings(prev => ({ ...prev, ...data.general }));
        if (data.appearance) setAppearanceSettings(prev => ({ ...prev, ...data.appearance }));
        if (data.notifications) setNotificationSettings(prev => ({ ...prev, ...data.notifications }));
        if (data.security) setSecuritySettings(prev => ({ ...prev, ...data.security }));
        if (data.payment) setPaymentSettings(prev => ({ ...prev, ...data.payment }));
        if (data.features) setFeatureSettings(prev => ({ ...prev, ...data.features }));
      }
    } catch (error) {
      console.log('Using default settings');
    }
    setFetchLoading(false);
  };

  const handleGeneralChange = (e) => {
    setGeneralSettings({ ...generalSettings, [e.target.name]: e.target.value });
  };

  const handleAppearanceChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAppearanceSettings({ ...appearanceSettings, [e.target.name]: value });
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings({ ...notificationSettings, [e.target.name]: e.target.checked });
  };

  const handleSecurityChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : parseInt(e.target.value);
    setSecuritySettings({ ...securitySettings, [e.target.name]: value });
  };

  const handlePaymentChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : parseFloat(e.target.value);
    setPaymentSettings({ ...paymentSettings, [e.target.name]: value });
  };

  const handleFeatureChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFeatureSettings({ ...featureSettings, [e.target.name]: value });
  };

  const handleAddDeliverySlot = () => {
    const newSlot = prompt('Enter new delivery slot (e.g., 9:00 AM - 12:00 PM)');
    if (newSlot && !featureSettings.deliverySlots.includes(newSlot)) {
      setFeatureSettings({
        ...featureSettings,
        deliverySlots: [...featureSettings.deliverySlots, newSlot]
      });
      toast.success('Delivery slot added');
    }
  };

  const handleRemoveDeliverySlot = (slot) => {
    setFeatureSettings({
      ...featureSettings,
      deliverySlots: featureSettings.deliverySlots.filter(s => s !== slot)
    });
    toast.success('Delivery slot removed');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      await API.put('/settings/general', generalSettings);
      toast.success('General settings saved');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      toast.error('Failed to save');
    }
    setLoading(false);
  };

  const handleSaveAppearance = async () => {
    setLoading(true);
    try {
      await API.put('/settings/appearance', appearanceSettings);
      toast.success('Appearance settings saved');
    } catch (error) {
      toast.error('Failed to save');
    }
    setLoading(false);
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await API.put('/settings/notifications', notificationSettings);
      toast.success('Notification settings saved');
    } catch (error) {
      toast.error('Failed to save');
    }
    setLoading(false);
  };

  const handleSaveSecurity = async () => {
    setLoading(true);
    try {
      await API.put('/settings/security', securitySettings);
      toast.success('Security settings saved');
    } catch (error) {
      toast.error('Failed to save');
    }
    setLoading(false);
  };

  const handleSavePayment = async () => {
    setLoading(true);
    try {
      await API.put('/settings/payment', paymentSettings);
      toast.success('Payment settings saved');
    } catch (error) {
      toast.error('Failed to save');
    }
    setLoading(false);
  };

  const handleSaveFeatures = async () => {
    setLoading(true);
    try {
      await API.put('/settings/features', featureSettings);
      toast.success('Feature settings saved');
    } catch (error) {
      toast.error('Failed to save');
    }
    setLoading(false);
  };

  const handleSavePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error('Enter current password');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await API.put('/settings/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
    setLoading(false);
  };

  if (fetchLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fffaf5' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid #f0e4d8', borderTop: '3px solid #9a3412', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    );
  }

  const getBgColor = () => appearanceSettings.theme === 'dark' ? '#1a1a2e' : '#fffaf5';
  const getCardBg = () => appearanceSettings.theme === 'dark' ? '#2d2d44' : 'white';
  const getCardBorder = () => appearanceSettings.theme === 'dark' ? '#444' : '#f0e4d8';
  const getInputBg = () => appearanceSettings.theme === 'dark' ? '#3d3d5c' : '#fefaf5';
  const getInputBorder = () => appearanceSettings.theme === 'dark' ? '#555' : '#e5d5cc';
  const getTextColor = () => appearanceSettings.theme === 'dark' ? '#fff' : '#2d1f12';
  const getLabelColor = () => appearanceSettings.theme === 'dark' ? '#ccc' : '#5c3a28';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: getBgColor() }}>
      <Sidebar />
      
      <div style={{ 
        flex: 1, 
        marginLeft: '280px',
        padding: '24px', 
        overflowX: 'auto',
        minHeight: '100vh',
        width: 'calc(100% - 280px)'
      }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '400', color: getTextColor(), fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
              Settings
            </h1>
            <p style={{ color: appearanceSettings.theme === 'dark' ? '#aaa' : '#8b6b58' }}>Configure and customize your store settings</p>
          </div>
          {success && (
            <div style={{ padding: '10px 20px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCheckCircle /> Settings saved!
            </div>
          )}
        </div>

        <div style={{ backgroundColor: getCardBg(), borderRadius: '24px', border: `1px solid ${getCardBorder()}`, overflow: 'hidden' }}>
          
          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            borderBottom: `1px solid ${getCardBorder()}`,
            backgroundColor: appearanceSettings.theme === 'dark' ? '#22223b' : '#fefaf5',
            gap: '4px',
            padding: '8px 16px'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#9a3412' : 'transparent',
                  color: activeTab === tab.id ? 'white' : (appearanceSettings.theme === 'dark' ? '#ccc' : '#5c3a28'),
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '500' : '400',
                  borderRadius: '40px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '32px' }}>
            
            {/* GENERAL SETTINGS */}
            {activeTab === 'general' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px', color: getTextColor() }}>
                  <FiGlobe style={{ marginRight: '8px', color: '#9a3412' }} /> General Settings
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Store Name</label>
                    <input type="text" name="storeName" value={generalSettings.storeName} onChange={handleGeneralChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Store Email</label>
                    <input type="email" name="storeEmail" value={generalSettings.storeEmail} onChange={handleGeneralChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Phone Number</label>
                    <input type="text" name="storePhone" value={generalSettings.storePhone} onChange={handleGeneralChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Address</label>
                    <textarea name="address" value={generalSettings.address} onChange={handleGeneralChange} rows="2" style={{ width: '100%', padding: '12px 16px', borderRadius: '20px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Currency</label>
                      <select name="currency" value={generalSettings.currency} onChange={handleGeneralChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }}>
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Timezone</label>
                      <select name="timezone" value={generalSettings.timezone} onChange={handleGeneralChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }}>
                        {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Date Format</label>
                      <select name="dateFormat" value={generalSettings.dateFormat} onChange={handleGeneralChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }}>
                        {dateFormats.map(df => <option key={df} value={df}>{df}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={handleSaveGeneral} disabled={loading} style={{ padding: '12px 28px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                    <FiSave /> {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* APPEARANCE SETTINGS */}
            {activeTab === 'appearance' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px', color: getTextColor() }}>
                  <FiMoon style={{ marginRight: '8px', color: '#9a3412' }} /> Appearance Settings
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '12px', color: getLabelColor() }}>Theme</label>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'light'})} style={{ flex: 1, padding: '12px 20px', borderRadius: '40px', border: appearanceSettings.theme === 'light' ? '2px solid #9a3412' : `1px solid ${getInputBorder()}`, backgroundColor: appearanceSettings.theme === 'light' ? '#fef3e8' : getInputBg(), color: '#5c3a28', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <FiSun /> Light Mode
                      </button>
                      <button onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'dark'})} style={{ flex: 1, padding: '12px 20px', borderRadius: '40px', border: appearanceSettings.theme === 'dark' ? '2px solid #9a3412' : `1px solid ${getInputBorder()}`, backgroundColor: appearanceSettings.theme === 'dark' ? '#fef3e8' : getInputBg(), color: '#5c3a28', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <FiMoon /> Dark Mode
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Primary Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="color" name="primaryColor" value={appearanceSettings.primaryColor} onChange={handleAppearanceChange} style={{ width: '50px', height: '50px', borderRadius: '12px', border: `1px solid ${getInputBorder()}`, cursor: 'pointer' }} />
                      <input type="text" value={appearanceSettings.primaryColor} onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})} style={{ flex: 1, padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Items Per Page</label>
                    <input type="number" name="itemsPerPage" value={appearanceSettings.itemsPerPage} onChange={handleAppearanceChange} min="5" max="100" style={{ width: '150px', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Font Size</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {fontSizes.map(fs => (
                        <button key={fs} onClick={() => setAppearanceSettings({...appearanceSettings, fontSize: fs})} style={{ padding: '8px 20px', borderRadius: '40px', border: appearanceSettings.fontSize === fs ? '2px solid #9a3412' : `1px solid ${getInputBorder()}`, backgroundColor: appearanceSettings.fontSize === fs ? '#fef3e8' : getInputBg(), cursor: 'pointer', color: getTextColor() }}>
                          {fs.charAt(0).toUpperCase() + fs.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" name="animations" checked={appearanceSettings.animations} onChange={handleAppearanceChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <span style={{ color: getLabelColor() }}>Enable Animations</span>
                  </label>
                  <button onClick={handleSaveAppearance} disabled={loading} style={{ padding: '12px 28px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                    <FiSave /> {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATION SETTINGS */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px', color: getTextColor() }}>
                  <FiBell style={{ marginRight: '8px', color: '#9a3412' }} /> Notification Settings
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
                  <div style={{ backgroundColor: getInputBg(), borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#9a3412' }}>Email Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="emailNotifications" checked={notificationSettings.emailNotifications} onChange={handleNotificationChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Enable Email Notifications</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="orderUpdates" checked={notificationSettings.orderUpdates} onChange={handleNotificationChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Order Updates</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="newUserAlerts" checked={notificationSettings.newUserAlerts} onChange={handleNotificationChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>New User Alerts</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="lowStockAlerts" checked={notificationSettings.lowStockAlerts} onChange={handleNotificationChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Low Stock Alerts</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="weeklyReports" checked={notificationSettings.weeklyReports} onChange={handleNotificationChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Weekly Reports</span>
                      </label>
                    </div>
                  </div>
                  <div style={{ backgroundColor: getInputBg(), borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#9a3412' }}>Order Status Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="orderConfirmed" checked={notificationSettings.orderConfirmed} onChange={handleNotificationChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Order Confirmed</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="orderShipped" checked={notificationSettings.orderShipped} onChange={handleNotificationChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Order Shipped</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="orderDelivered" checked={notificationSettings.orderDelivered} onChange={handleNotificationChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Order Delivered</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="paymentReceived" checked={notificationSettings.paymentReceived} onChange={handleNotificationChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Payment Received</span>
                      </label>
                    </div>
                  </div>
                  <button onClick={handleSaveNotifications} disabled={loading} style={{ padding: '12px 28px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                    <FiSave /> {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY SETTINGS */}
            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px', color: getTextColor() }}>
                  <FiLock style={{ marginRight: '8px', color: '#9a3412' }} /> Security Settings
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Session Timeout (minutes)</label>
                    <input type="number" name="sessionTimeout" value={securitySettings.sessionTimeout} onChange={handleSecurityChange} min="5" max="120" style={{ width: '150px', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Max Login Attempts</label>
                    <input type="number" name="maxLoginAttempts" value={securitySettings.maxLoginAttempts} onChange={handleSecurityChange} min="3" max="10" style={{ width: '150px', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" name="requireStrongPassword" checked={securitySettings.requireStrongPassword} onChange={handleSecurityChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                      <span>Require Strong Password</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" name="autoLogout" checked={securitySettings.autoLogout} onChange={handleSecurityChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                      <span>Auto Logout Inactive Sessions</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" name="loginNotifications" checked={securitySettings.loginNotifications} onChange={handleSecurityChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                      <span>Login Notifications</span>
                    </label>
                  </div>
                  <button onClick={handleSaveSecurity} disabled={loading} style={{ padding: '12px 28px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                    <FiSave /> {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* PAYMENT SETTINGS */}
            {activeTab === 'payment' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px', color: getTextColor() }}>
                  <FiDollarSign style={{ marginRight: '8px', color: '#9a3412' }} /> Payment Settings
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
                  <div style={{ backgroundColor: getInputBg(), borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#9a3412' }}>Payment Methods</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="stripeEnabled" checked={paymentSettings.stripeEnabled} onChange={handlePaymentChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Stripe (Credit/Debit Cards)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" name="cashOnDelivery" checked={paymentSettings.cashOnDelivery} onChange={handlePaymentChange} style={{ width: '18px', height: '18px', margin: 0 }} />
                        <span>Cash on Delivery (COD)</span>
                      </label>
                    </div>
                  </div>
                  <div style={{ backgroundColor: getInputBg(), borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#9a3412' }}>Tax & Shipping</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Tax Rate (%)</label>
                        <input type="number" name="taxRate" value={paymentSettings.taxRate} onChange={handlePaymentChange} min="0" max="100" step="0.1" style={{ width: '100%', padding: '10px 12px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Shipping Fee (Rs.)</label>
                        <input type="number" name="shippingFee" value={paymentSettings.shippingFee} onChange={handlePaymentChange} min="0" style={{ width: '100%', padding: '10px 12px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Free Shipping Threshold (Rs.)</label>
                      <input type="number" name="freeShippingThreshold" value={paymentSettings.freeShippingThreshold} onChange={handlePaymentChange} min="0" style={{ width: '100%', padding: '10px 12px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                    </div>
                  </div>
                  <button onClick={handleSavePayment} disabled={loading} style={{ padding: '12px 28px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                    <FiSave /> {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* FEATURES SETTINGS */}
            {activeTab === 'features' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px', color: getTextColor() }}>
                  <FiGift style={{ marginRight: '8px', color: '#9a3412' }} /> Unique Features
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
                  
                  {/* Delivery Slots */}
                  <div style={{ backgroundColor: getInputBg(), borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d1f12' }}>📦 Delivery Slots</h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" name="enableDeliverySlots" checked={featureSettings.enableDeliverySlots} onChange={handleFeatureChange} style={{ width: '16px', height: '16px', margin: 0 }} />
                        <span style={{ fontSize: '13px', color: getLabelColor() }}>Enable</span>
                      </label>
                    </div>
                    {featureSettings.enableDeliverySlots && (
                      <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                          {featureSettings.deliverySlots.map(slot => (
                            <div key={slot} style={{ backgroundColor: getCardBg(), padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: `1px solid ${getInputBorder()}` }}>
                              <span style={{ fontSize: '13px', color: getTextColor() }}>{slot}</span>
                              <button onClick={() => handleRemoveDeliverySlot(slot)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>×</button>
                            </div>
                          ))}
                        </div>
                        <button onClick={handleAddDeliverySlot} style={{ padding: '6px 16px', backgroundColor: '#f0e4d8', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', color: '#5c3a28' }}>+ Add Delivery Slot</button>
                      </>
                    )}
                  </div>

                  {/* Order Cancellation */}
                  <div style={{ backgroundColor: getInputBg(), borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#2d1f12' }}>⏰ Order Cancellation</h3>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Cancellation Window (hours)</label>
                      <input type="number" name="cancellationWindow" value={featureSettings.cancellationWindow} onChange={handleFeatureChange} min="1" max="72" style={{ width: '150px', padding: '10px 12px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getCardBg(), color: getTextColor() }} />
                      <p style={{ fontSize: '11px', color: appearanceSettings.theme === 'dark' ? '#aaa' : '#8b6b58', marginTop: '4px' }}>Customer can cancel order within this many hours after placing</p>
                    </div>
                  </div>

                  {/* Bulk Discount */}
                  <div style={{ backgroundColor: getInputBg(), borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d1f12' }}>🏷️ Bulk Discount</h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" name="enableBulkDiscount" checked={featureSettings.enableBulkDiscount} onChange={handleFeatureChange} style={{ width: '16px', height: '16px', margin: 0 }} />
                        <span style={{ fontSize: '13px', color: getLabelColor() }}>Enable</span>
                      </label>
                    </div>
                    {featureSettings.enableBulkDiscount && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Min Quantity</label>
                          <input type="number" name="bulkDiscountThreshold" value={featureSettings.bulkDiscountThreshold} onChange={handleFeatureChange} min="2" max="20" style={{ width: '100%', padding: '10px 12px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getCardBg(), color: getTextColor() }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Discount (%)</label>
                          <input type="number" name="bulkDiscountPercentage" value={featureSettings.bulkDiscountPercentage} onChange={handleFeatureChange} min="0" max="50" style={{ width: '100%', padding: '10px 12px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getCardBg(), color: getTextColor() }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Loyalty Points */}
                  <div style={{ backgroundColor: getInputBg(), borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d1f12' }}>⭐ Loyalty Points</h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" name="enableLoyaltyPoints" checked={featureSettings.enableLoyaltyPoints} onChange={handleFeatureChange} style={{ width: '16px', height: '16px', margin: 0 }} />
                        <span style={{ fontSize: '13px', color: getLabelColor() }}>Enable</span>
                      </label>
                    </div>
                    {featureSettings.enableLoyaltyPoints && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Points per Order</label>
                          <input type="number" name="pointsPerOrder" value={featureSettings.pointsPerOrder} onChange={handleFeatureChange} min="0" max="100" style={{ width: '100%', padding: '10px 12px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getCardBg(), color: getTextColor() }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Points per Rs.</label>
                          <input type="number" name="pointsPerRupee" value={featureSettings.pointsPerRupee} onChange={handleFeatureChange} min="0" max="10" step="0.1" style={{ width: '100%', padding: '10px 12px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getCardBg(), color: getTextColor() }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Gift Wrapping */}
                  <div style={{ backgroundColor: getInputBg(), borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d1f12' }}>🎁 Gift Wrapping</h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" name="enableGiftWrapping" checked={featureSettings.enableGiftWrapping} onChange={handleFeatureChange} style={{ width: '16px', height: '16px', margin: 0 }} />
                        <span style={{ fontSize: '13px', color: getLabelColor() }}>Enable</span>
                      </label>
                    </div>
                    {featureSettings.enableGiftWrapping && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Gift Wrapping Fee (Rs.)</label>
                        <input type="number" name="giftWrappingFee" value={featureSettings.giftWrappingFee} onChange={handleFeatureChange} min="0" max="500" style={{ width: '150px', padding: '10px 12px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getCardBg(), color: getTextColor() }} />
                      </div>
                    )}
                  </div>

                  <button onClick={handleSaveFeatures} disabled={loading} style={{ padding: '12px 28px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                    <FiSave /> {loading ? 'Saving...' : 'Save Features'}
                  </button>
                </div>
              </div>
            )}

            {/* CHANGE PASSWORD */}
            {activeTab === 'password' && (
              <div style={{ maxWidth: '500px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px', color: getTextColor() }}>
                  <FiUser style={{ marginRight: '8px', color: '#9a3412' }} /> Change Password
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Current Password</label>
                    <input type={showPassword ? 'text' : 'password'} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>New Password</label>
                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: getLabelColor() }}>Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? '1px solid #ef4444' : `1px solid ${getInputBorder()}`, backgroundColor: getInputBg(), color: getTextColor() }} />
                    {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <p style={{ fontSize: '12px', marginTop: '4px', color: '#ef4444' }}>Passwords do not match</p>
                    )}
                  </div>
                  <button onClick={handleSavePassword} disabled={loading} style={{ padding: '12px 28px', backgroundColor: '#9a3412', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                    <FiSave /> {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .settings-main {
            margin-left: 0 !important;
          }
        }
        input, select, textarea {
          transition: all 0.2s ease;
        }
        input:focus, select:focus, textarea:focus {
          border-color: #9a3412 !important;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Settings;