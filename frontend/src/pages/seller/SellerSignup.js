import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiLogIn, FiHome, FiPhone, FiMapPin } from 'react-icons/fi';

const SellerSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        shopName: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Pakistan'
        }
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate required fields
        if (!formData.name || !formData.email || !formData.password || !formData.shopName) {
            toast.error('Please fill all required fields');
            setLoading(false);
            return;
        }

        try {
            console.log('📝 Sending seller signup request to:', '/seller/register');
            console.log('Request data:', {
                name: formData.name,
                email: formData.email,
                shopName: formData.shopName,
                phone: formData.phone
            });
            
            const response = await API.post('/seller/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                shopName: formData.shopName,
                phone: formData.phone,
                address: formData.address
            });
            
            console.log('✅ Signup response:', response.data);
            
            if (response.data && response.data.success) {
                toast.success('Registration successful! Please wait for admin approval.');
                
                // Store token if provided
                if (response.data.data?.token) {
                    localStorage.setItem('token', response.data.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                }
                
                // Redirect to seller login after 2 seconds
                setTimeout(() => {
                    navigate('/seller/login');
                }, 2000);
            } else {
                toast.error(response.data?.message || 'Signup failed');
            }
        } catch (error) {
            console.error('❌ Signup error:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.status === 400) {
                toast.error(error.response.data?.message || 'Seller already exists');
            } else if (error.response?.status === 404) {
                toast.error('API route not found. Please check backend connection.');
            } else if (!error.response) {
                toast.error('Cannot connect to server. Is backend running on port 5000?');
            } else {
                toast.error(error.response?.data?.message || 'Signup failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '600px'
            }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textAlign: 'center',
                    color: '#f59e0b'
                }}>
                    Seller Registration
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#6b7280',
                    marginBottom: '32px'
                }}>
                    Register as a seller on ResinArt
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Personal Information Section */}
                    <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            margin: '0 0 16px 0', 
                            color: '#f59e0b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FiUser /> Personal Information
                        </h3>

                        {/* Full Name */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Full Name <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                <FiMail style={{ marginRight: '4px', display: 'inline' }} />
                                Email Address <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="seller@example.com"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Phone */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                <FiPhone style={{ marginRight: '4px', display: 'inline' }} />
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+92 300 1234567"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Shop Information Section */}
                    <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            margin: '0 0 16px 0', 
                            color: '#f59e0b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FiHome /> Shop Information
                        </h3>

                        {/* Shop Name */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Shop Name <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleChange}
                                required
                                placeholder="Your shop/business name"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Address Section */}
                    <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            margin: '0 0 16px 0', 
                            color: '#f59e0b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FiMapPin /> Address Information
                        </h3>

                        {/* Street Address */}
                        <div style={{ marginBottom: '16px' }}>
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                placeholder="Street Address"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* City and State */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                placeholder="City"
                                style={{
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                            <input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                placeholder="State"
                                style={{
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* ZIP and Country */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <input
                                type="text"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                                placeholder="ZIP Code"
                                style={{
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                            <input
                                type="text"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                placeholder="Country"
                                style={{
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Security Section */}
                    <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            margin: '0 0 16px 0', 
                            color: '#f59e0b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FiLock /> Security
                        </h3>

                        {/* Password */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Password <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                                placeholder="•••••• (min. 6 characters)"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Confirm Password <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="••••••"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    borderColor: formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? '#ef4444' : '#d1d5db'
                                }}
                            />
                            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                                    Passwords do not match
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                            <input type="checkbox" required />
                            <span>
                                I agree to the <Link to="/terms" style={{ color: '#f59e0b', textDecoration: 'none' }}>Terms and Conditions</Link> and <Link to="/privacy" style={{ color: '#f59e0b', textDecoration: 'none' }}>Privacy Policy</Link>
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading ? '#9ca3af' : '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            marginBottom: '16px'
                        }}
                    >
                        <FiLogIn />
                        {loading ? 'Registering...' : 'Register as Seller'}
                    </button>

                    {/* Login Link */}
                    <div style={{ textAlign: 'center', fontSize: '14px' }}>
                        Already have an account?{' '}
                        <Link to="/seller/login" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: '500' }}>
                            Login here
                        </Link>
                    </div>
                </form>

                {/* Approval Note */}
                <div style={{
                    marginTop: '24px',
                    padding: '12px',
                    backgroundColor: '#fff7ed',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#9a3412',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <FiLock size={14} />
                    <span>
                        <strong>Note:</strong> New seller accounts require admin approval before you can log in.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SellerSignup;