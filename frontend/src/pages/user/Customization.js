import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FiImage, FiLoader, FiTrash2, FiShoppingCart, 
    FiArrowLeft, FiHeart, FiSave, FiAlertCircle,
    FiDroplet, FiHash, FiShare2, FiDownload,
    FiGrid, FiTrendingUp, FiDollarSign, FiEye,
    FiSquare, FiCircle, FiHeart as FiHeartShape,
    FiMinimize, FiMaximize, FiStar, FiZap
} from 'react-icons/fi';
// ✅ ADDED: puter import from Code 2
import { puter } from '@heyputer/puter.js';
import API from '../../services/api';
import toast from 'react-hot-toast';
// ✅ ADDED: imageUtils imports from Code 2
import { getImageUrl, persistImage, isPersistedPath } from '../../utils/imageUtils.js';

// ✅ REMOVED: local getImageUrl function (ab imageUtils se use karenge)

const Customization = () => {
    // State variables
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [customizations, setCustomizations] = useState([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('natural');
    const [selectedProductType, setSelectedProductType] = useState('coaster');
    const [selectedShape, setSelectedShape] = useState('round');
    const [selectedSize, setSelectedSize] = useState('medium');
    const [selectedFinish, setSelectedFinish] = useState('glossy');
    const [selectedTheme, setSelectedTheme] = useState('floral');
    const [loadingDesigns, setLoadingDesigns] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#FF6B9D');
    const [showPriceCalculator, setShowPriceCalculator] = useState(false);
    const [materialCost, setMaterialCost] = useState(0);
    const [laborCost, setLaborCost] = useState(0);
    const navigate = useNavigate();

    // ==================== OPTIONS DATA ====================
    
    const styles = [
        { id: 'natural', name: 'Natural', icon: '🌿' },
        { id: 'elegant', name: 'Elegant', icon: '✨' },
        { id: 'modern', name: 'Modern', icon: '🎨' },
        { id: 'vintage', name: 'Vintage', icon: '📜' },
        { id: 'bohemian', name: 'Bohemian', icon: '🌸' }
    ];

    const colorPalettes = [
        { name: 'Hot Pink', color: '#FF6B9D' },
        { name: 'Dark Pink', color: '#E75480' },
        { name: 'Sunset Orange', color: '#FFB347' },
        { name: 'Plum Purple', color: '#5a4a6a' },
        { name: 'Mint Green', color: '#D4F1E9' },
        { name: 'Lavender', color: '#E8D5F5' },
        { name: 'Soft Pink', color: '#FFD6E0' },
        { name: 'Rose Gold', color: '#E8A3A3' }
    ];

    const productTypes = [
        { id: 'coaster', name: 'Coaster', icon: '🍷', basePrice: 800, baseMaterial: 150 },
        { id: 'tray', name: 'Tray', icon: '🍽️', basePrice: 2500, baseMaterial: 500 },
        { id: 'jewelry', name: 'Jewelry', icon: '💍', basePrice: 1800, baseMaterial: 300 },
        { id: 'keychain', name: 'Keychain', icon: '🔑', basePrice: 550, baseMaterial: 100 },
        { id: 'nameplate', name: 'Nameplate', icon: '🏷️', basePrice: 1200, baseMaterial: 200 },
        { id: 'home-decor', name: 'Home Decor', icon: '🏠', basePrice: 3000, baseMaterial: 600 },
        { id: 'paperweight', name: 'Paperweight', icon: '📚', basePrice: 900, baseMaterial: 180 },
        { id: 'ornament', name: 'Ornament', icon: '🎄', basePrice: 700, baseMaterial: 140 }
    ];

    const productShapes = [
        { id: 'round', name: 'Round', icon: <FiCircle size={16} />, priceMultiplier: 1 },
        { id: 'square', name: 'Square', icon: <FiSquare size={16} />, priceMultiplier: 1 },
        { id: 'heart', name: 'Heart', icon: <FiHeartShape size={16} />, priceMultiplier: 1.2 },
        { id: 'oval', name: 'Oval', icon: '🥚', priceMultiplier: 1.1 }
    ];

    const sizes = [
        { id: 'small', name: 'Small', icon: <FiMinimize size={16} />, priceMultiplier: 0.8 },
        { id: 'medium', name: 'Medium', icon: '📐', priceMultiplier: 1 },
        { id: 'large', name: 'Large', icon: <FiMaximize size={16} />, priceMultiplier: 1.3 }
    ];

    const finishes = [
        { id: 'glossy', name: 'Glossy', icon: '✨', priceMultiplier: 1 },
        { id: 'matte', name: 'Matte', icon: '🎨', priceMultiplier: 1 },
        { id: 'metallic', name: 'Metallic', icon: '⭐', priceMultiplier: 1.2 },
        { id: 'pearl', name: 'Pearl', icon: '💎', priceMultiplier: 1.15 }
    ];

    const themes = [
        { id: 'floral', name: 'Floral', icon: '🌸' },
        { id: 'wedding', name: 'Wedding', icon: '💍' },
        { id: 'birthday', name: 'Birthday', icon: '🎂' },
        { id: 'anniversary', name: 'Anniversary', icon: '💝' },
        { id: 'memorial', name: 'Memorial', icon: '🕊️' },
        { id: 'nature', name: 'Nature', icon: '🌿' },
        { id: 'geometric', name: 'Geometric', icon: '🔷' }
    ];

    // ✅ UPDATED: Code 2 style trending prompts (simpler, cleaner)
    const trendingPrompts = [
        'Rose gold resin coaster with dried flowers',
        'Ocean wave resin tray with glitter',
        'Butterfly preserved in clear resin pendant',
        'Custom name keychain with floral design',
        'Geode resin art with crystals',
        'Wedding invitation preserved in resin frame'
    ];

    // ==================== PRICE CALCULATION ====================
    
    const calculatePrice = () => {
        const product = productTypes.find(p => p.id === selectedProductType);
        const shape = productShapes.find(s => s.id === selectedShape);
        const size = sizes.find(s => s.id === selectedSize);
        const finish = finishes.find(f => f.id === selectedFinish);
        
        const basePrice = product?.basePrice || 800;
        const shapeMultiplier = shape?.priceMultiplier || 1;
        const sizeMultiplier = size?.priceMultiplier || 1;
        const finishMultiplier = finish?.priceMultiplier || 1;
        
        const total = basePrice * shapeMultiplier * sizeMultiplier * finishMultiplier;
        return Math.round(total);
    };

    const getEstimatedPrice = () => {
        return calculatePrice();
    };

    // ==================== API CALLS ====================
    
    useEffect(() => {
        fetchSavedDesigns();
    }, []);

    useEffect(() => {
        const product = productTypes.find(p => p.id === selectedProductType);
        if (product) {
            setMaterialCost(product.baseMaterial);
            setLaborCost(product.basePrice - product.baseMaterial);
            // ✅ UPDATED: Auto-update price like Code 2
            const complexityBonus = prompt.length > 50 ? 500 : 0;
            const estimatedPrice = (product.basePrice) + complexityBonus;
            if (!productPrice) {
                setProductPrice(estimatedPrice.toString());
            }
        }
    }, [selectedProductType, selectedShape, selectedSize, selectedFinish, prompt]);

    const fetchSavedDesigns = async () => {
        setLoadingDesigns(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await API.get('/ai/designs');
                if (response.data?.success) {
                    setCustomizations(response.data.data || []);
                    return;
                }
            }

            // ✅ UPDATED: Filter with isPersistedPath from Code 2
            const savedDesigns = JSON.parse(localStorage.getItem('aiDesigns') || '[]');
            setCustomizations(savedDesigns.filter((item) => isPersistedPath(item.imageUrl)));
        } catch (error) {
            console.error('Error fetching designs:', error);
            const savedDesigns = JSON.parse(localStorage.getItem('aiDesigns') || '[]');
            setCustomizations(savedDesigns.filter((item) => isPersistedPath(item.imageUrl)));
        } finally {
            setLoadingDesigns(false);
        }              
    };

    const handleImageError = (e) => {
        e.target.src = 'https://placehold.co/600x600/fefaf5/FF6B9D?text=✨+AI+Design+✨';
    };

    // ==================== UPDATED GENERATE FUNCTION WITH PUTER.JS ====================
   
    const generateImage = async () => {
        // ✅ UPDATED: Code 2 style prompt validation
        if (!prompt.trim()) {
            toast.error('Please describe your design first');
            return;
        }

        if (!window.puter) {
            toast.error('❌ Puter load nahi hua. Page refresh karo.');
            return;
        }

        setGenerating(true);
        setGeneratedImage(null);

        // ✅ UPDATED: Enhanced prompt like Code 2
        const enhancedPrompt = `
        ${prompt}, ${styles.find(s => s.id === selectedStyle)?.name || 'natural'} style, 
        ${colorPalettes.find(c => c.color === selectedColor)?.name || 'hot pink'} color theme, 
        high quality resin art, professional photography, detailed`;

        const loadingToast = toast.loading('🎨 AI is creating your design... (may take 30-60 seconds)', {
            duration: Infinity,
            id: 'ai-generate'
        });

        try {
            // ✅ UPDATED: Using Puter AI like Code 2
            const result = await window.puter.ai.txt2img(enhancedPrompt, {
                model: "gpt-image-1.5",
                quality: "low"
            });
            
            toast.dismiss(loadingToast);

            if (result) {
                const savingToast = toast.loading('Saving your design image...', { id: 'ai-persist' });

                try {
                    // ✅ UPDATED: Using persistImage from Code 2
                    const localImagePath = await persistImage(result.src);
                    setGeneratedImage(localImagePath);

                    const product = productTypes.find(p => p.id === selectedProductType);
                    const complexityBonus = prompt.length > 50 ? 500 : 0;
                    const estimatedPrice = (product?.basePrice || 800) + complexityBonus;
                    setProductPrice(estimatedPrice.toString());

                    // ✅ Auto-set product details like Code 2
                    const styleName = styles.find(s => s.id === selectedStyle)?.name || 'natural';
                    const colorName = colorPalettes.find(c => c.color === selectedColor)?.name || 'hot pink';
                    setProductName(`${colorName} ${styleName} ${product?.name || 'Design'}`);
                    setProductDescription(prompt);

                    toast.success('AI design generated and saved!', { id: 'ai-persist' });
                } catch (persistError) {
                    console.error('Image persist error:', persistError);
                    toast.error('Generated, but failed to save image locally. Please try again.', { id: 'ai-persist' });
                }
            } else {
                toast.error('Failed to generate image');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error('Puter AI Error:', error);
            toast.error('Failed to generate. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    // ==================== CART & SAVE FUNCTIONS ====================

    // ✅ UPDATED: addToCart with persistImage and Product creation
    const addToCart = async () => {
        if (!generatedImage) {
            toast.error('Please generate a design first');
            return;
        }

        const savingToast = toast.loading('Saving design image...');

        try {
            const localImagePath = await persistImage(generatedImage);

            let productId = `custom-${Date.now()}`;
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const prodRes = await API.post('/ai/create-product', {
                        name: productName || `${productTypes.find(p => p.id === selectedProductType)?.name || 'Resin'} Design`,
                        imageUrl: localImagePath,
                        price: Number(productPrice) || getEstimatedPrice(),
                        description: productDescription || prompt,
                        productType: selectedProductType,
                        style: selectedStyle,
                        shape: selectedShape,
                        size: selectedSize,
                        finish: selectedFinish,
                        theme: selectedTheme,
                        colorTheme: selectedColor
                    });
                    console.log('📦 AI create-product response:', prodRes.data);
                    if (prodRes.data?.success && prodRes.data?.product?._id) {
                        productId = prodRes.data.product._id;
                        console.log('📦 Using real product ID:', productId);
                    }
                } catch (prodErr) {
                    console.error('Product creation error (falling back to local):', prodErr);
                }
            }

            const cartItem = {
                id: Date.now(),
                productId: productId,
                name: productName || 'Custom Resin Art',
                price: Number(productPrice) || getEstimatedPrice(),
                description: productDescription || prompt,
                image: localImagePath,
                quantity: 1,
                isCustom: true,
                prompt: prompt,
                style: selectedStyle,
                productType: selectedProductType,
                shape: selectedShape,
                size: selectedSize,
                finish: selectedFinish,
                theme: selectedTheme,
                colorTheme: selectedColor
            };

            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));

            toast.success('Added to cart!', { id: savingToast });
            navigate('/cart');
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error('Failed to save design image', { id: savingToast });
        }
    };

    // ✅ UPDATED: saveDesign with persistImage like Code 2
    const saveDesign = async () => {
        if (!generatedImage) {
            toast.error('Please generate a design first');
            return;
        }

        const savingToast = toast.loading('Saving design...');

        try {
            const localImagePath = await persistImage(generatedImage);
            const token = localStorage.getItem('token');

            const styleName = styles.find(s => s.id === selectedStyle)?.name || 'natural';
            const colorName = colorPalettes.find(c => c.color === selectedColor)?.name || 'hot pink';
            const productTypeName = productTypes.find(p => p.id === selectedProductType)?.name || 'resin art';
            
            const designPayload = {
                name: productName || `${colorName} ${styleName} ${productTypeName}`,
                prompt: prompt,
                imageUrl: localImagePath,
                price: Number(productPrice) || getEstimatedPrice(),
                description: productDescription || prompt,
                style: selectedStyle,
                productType: selectedProductType,
                shape: selectedShape,
                size: selectedSize,
                finish: selectedFinish,
                theme: selectedTheme,
                colorTheme: selectedColor
            };

            if (token) {
                const response = await API.post('/ai/save', designPayload);
                if (response.data?.success) {
                    await fetchSavedDesigns();
                    toast.success('Design saved!', { id: savingToast });
                    resetForm();
                    return;
                }
            }

            // Save locally with Code 2 style
            const designData = {
                _id: Date.now().toString(),
                ...designPayload,
                createdAt: new Date().toISOString()
            };

            const savedDesigns = JSON.parse(localStorage.getItem('aiDesigns') || '[]');
            savedDesigns.unshift(designData);
            localStorage.setItem('aiDesigns', JSON.stringify(savedDesigns));
            setCustomizations(savedDesigns);
            toast.success('Design saved!', { id: savingToast });
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to save design', { id: savingToast });
        }
    };

    // ✅ ADDED: resetForm from Code 2
    const resetForm = () => {
        setGeneratedImage(null);
        setPrompt('');
        setProductName('');
        setProductPrice('');
        setProductDescription('');
    };

    const addSavedToCart = async (design) => {
        const savingToast = toast.loading('Adding to cart...');

        let productId = `custom-${Date.now()}`;
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const prodRes = await API.post('/ai/create-product', {
                    name: design.name,
                    imageUrl: design.imageUrl,
                    price: design.price,
                    description: design.description,
                    productType: design.productType,
                    style: design.style,
                    shape: design.shape,
                    size: design.size,
                    finish: design.finish,
                    theme: design.theme,
                    colorTheme: design.colorTheme
                });
                if (prodRes.data?.success && prodRes.data?.product?._id) {
                    productId = prodRes.data.product._id;
                }
            } catch (prodErr) {
                console.error('Product creation error (falling back to local):', prodErr);
            }
        }

        const cartItem = {
            id: Date.now(),
            productId: productId,
            name: design.name,
            price: design.price,
            description: design.description,
            image: design.imageUrl,
            quantity: 1,
            isCustom: true,
            prompt: design.prompt,
            style: design.style,
            productType: design.productType,
            shape: design.shape,
            size: design.size,
            finish: design.finish,
            theme: design.theme,
            colorTheme: design.colorTheme
        };

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));

        toast.success('Added to cart!', { id: savingToast });
        navigate('/cart');
    };

    const deleteDesign = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (token && id.length === 24) {
                await API.delete(`/ai/designs/${id}`);
                await fetchSavedDesigns();
                toast.success('Design removed');
                return;
            }

            const savedDesigns = JSON.parse(localStorage.getItem('aiDesigns') || '[]');
            const updated = savedDesigns.filter(item => item._id !== id);
            localStorage.setItem('aiDesigns', JSON.stringify(updated));
            setCustomizations(updated);
            toast.success('Design removed');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const loadDesign = (design) => {
        setGeneratedImage(design.imageUrl);
        setPrompt(design.prompt || '');
        setProductName(design.name);
        setProductPrice(design.price);
        setProductDescription(design.description);
        setSelectedStyle(design.style || 'natural');
        setSelectedProductType(design.productType || 'coaster');
        setSelectedShape(design.shape || 'round');
        setSelectedSize(design.size || 'medium');
        setSelectedFinish(design.finish || 'glossy');
        setSelectedTheme(design.theme || 'floral');
        setSelectedColor(design.colorTheme || '#FF6B9D');
        toast.success('Design loaded!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const shareDesign = () => {
        if (!generatedImage) {
            toast.error('Generate a design first');
            return;
        }
        setShowShareModal(true);
    };

    const shareOnSocial = (platform) => {
        const shareText = `Check out my custom resin art design: ${productName || 'Custom Design'} - Created with ResinArt AI Studio!`;
        const shareUrl = window.location.href;
        
        let shareLink = '';
        switch(platform) {
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                break;
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'pinterest':
                shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}&media=${encodeURIComponent(getImageUrl(generatedImage))}`;
                break;
            default:
                break;
        }
        
        if (shareLink) {
            window.open(shareLink, '_blank');
            toast.success(`Sharing on ${platform}!`);
        }
        setShowShareModal(false);
    };

    const exportAsPNG = () => {
        if (!generatedImage) {
            toast.error('Generate a design first');
            return;
        }
        
        const link = document.createElement('a');
        link.href = getImageUrl(generatedImage);
        link.download = `resin-art-${Date.now()}.png`;
        link.click();
        toast.success('Design downloaded!');
    };

    // ✅ UPDATED: handleTrendingPromptClick from Code 2
    const handleTrendingPromptClick = (promptText) => {
        setPrompt(promptText);
        toast.success('Trending prompt loaded! Customize and generate.');
    };

    // ==================== RENDER ====================

    return (
        <div style={{ minHeight: '100vh', background: '#fefaf5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '45px 24px' }}>
                
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#FF6B9D',
                        marginBottom: '35px',
                        fontSize: '15px',
                        fontWeight: '700',
                        padding: '10px 20px',
                        borderRadius: '40px',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E75480';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateX(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#FF6B9D';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }}
                >
                    <FiArrowLeft /> Back 
                </button>

                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '55px', animation: 'fadeInUp 0.6s ease' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '8px 24px',
                        background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '13px',
                        fontWeight: '800',
                        boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                    }}>
                        Create Your Masterpiece
                    </span>
                    <h1 style={{
                        fontSize: '55px',
                        fontWeight: '800',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginTop: '15px'
                    }}>
                        AI Customization Studio
                    </h1>
                    <p style={{ color: '#8B6B58', maxWidth: '600px', margin: '18px auto 0', fontSize: '16px', fontWeight: '500' }}>
                        Describe your dream resin art, and let AI bring your vision to life
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '55px' }}>
                    
                    {/* ==================== GENERATOR SECTION ==================== */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '32px',
                        padding: '35px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid #f0e4d8',
                        animation: 'fadeInUp 0.7s ease'
                    }}>
                        <h2 style={{ 
                            fontSize: '26px', 
                            marginBottom: '28px', 
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <FiZap /> Create Your Design
                        </h2>
                        
                        {/* Style Selection */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#FF6B9D' }}>
                                <FiDroplet style={{ marginRight: '8px' }} /> Choose Style
                            </label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {styles.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        style={{
                                            padding: '10px 22px',
                                            borderRadius: '40px',
                                            border: selectedStyle === style.id ? '2px solid #FF6B9D' : '1px solid #f0e4d8',
                                            background: selectedStyle === style.id ? 'linear-gradient(135deg, #E75480, #FF6B9D)' : '#FFFFFF',
                                            color: selectedStyle === style.id ? 'white' : '#8B6B58',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: selectedStyle === style.id ? '700' : '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span>{style.icon}</span>
                                        <span>{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Palette Selection */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#FF6B9D' }}>
                                <FiGrid style={{ marginRight: '8px' }} /> Color Palette
                            </label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {colorPalettes.map(palette => (
                                    <button
                                        key={palette.color}
                                        onClick={() => setSelectedColor(palette.color)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '8px 16px',
                                            borderRadius: '40px',
                                            border: selectedColor === palette.color ? '2px solid #FF6B9D' : '1px solid #f0e4d8',
                                            background: selectedColor === palette.color ? '#E75480' : '#FFFFFF',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%',
                                            background: palette.color,
                                            border: '1px solid rgba(0,0,0,0.1)'
                                        }} />
                                        <span style={{ fontSize: '12px', color: selectedColor === palette.color ? 'white' : '#8B6B58' }}>{palette.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Type Selection */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#FF6B9D' }}>
                                <FiHash style={{ marginRight: '8px' }} /> Product Type
                            </label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {productTypes.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedProductType(type.id)}
                                        style={{
                                            padding: '8px 18px',
                                            borderRadius: '40px',
                                            border: selectedProductType === type.id ? '2px solid #FF6B9D' : '1px solid #f0e4d8',
                                            background: selectedProductType === type.id ? '#E75480' : '#FFFFFF',
                                            color: selectedProductType === type.id ? 'white' : '#8B6B58',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: selectedProductType === type.id ? '700' : '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span>{type.icon}</span>
                                        <span>{type.name}</span>
                                        <span style={{ fontSize: '10px', opacity: 0.7 }}>Rs.{type.basePrice}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Shape Selection */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#FF6B9D' }}>
                                <FiSquare style={{ marginRight: '8px' }} /> Shape
                            </label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {productShapes.map(shape => (
                                    <button
                                        key={shape.id}
                                        onClick={() => setSelectedShape(shape.id)}
                                        style={{
                                            padding: '8px 18px',
                                            borderRadius: '40px',
                                            border: selectedShape === shape.id ? '2px solid #FF6B9D' : '1px solid #f0e4d8',
                                            background: selectedShape === shape.id ? '#E75480' : '#FFFFFF',
                                            color: selectedShape === shape.id ? 'white' : '#8B6B58',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        {shape.icon}
                                        <span>{shape.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#FF6B9D' }}>
                                📏 Size
                            </label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {sizes.map(size => (
                                    <button
                                        key={size.id}
                                        onClick={() => setSelectedSize(size.id)}
                                        style={{
                                            padding: '8px 18px',
                                            borderRadius: '40px',
                                            border: selectedSize === size.id ? '2px solid #FF6B9D' : '1px solid #f0e4d8',
                                            background: selectedSize === size.id ? '#E75480' : '#FFFFFF',
                                            color: selectedSize === size.id ? 'white' : '#8B6B58',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        {size.icon}
                                        <span>{size.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Finish Selection */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#FF6B9D' }}>
                                ✨ Finish
                            </label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {finishes.map(finish => (
                                    <button
                                        key={finish.id}
                                        onClick={() => setSelectedFinish(finish.id)}
                                        style={{
                                            padding: '8px 18px',
                                            borderRadius: '40px',
                                            border: selectedFinish === finish.id ? '2px solid #FF6B9D' : '1px solid #f0e4d8',
                                            background: selectedFinish === finish.id ? '#E75480' : '#FFFFFF',
                                            color: selectedFinish === finish.id ? 'white' : '#8B6B58',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span>{finish.icon}</span>
                                        <span>{finish.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Selection */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#FF6B9D' }}>
                                <FiStar style={{ marginRight: '8px' }} /> Theme
                            </label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {themes.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setSelectedTheme(theme.id)}
                                        style={{
                                            padding: '8px 18px',
                                            borderRadius: '40px',
                                            border: selectedTheme === theme.id ? '2px solid #FF6B9D' : '1px solid #f0e4d8',
                                            background: selectedTheme === theme.id ? '#E75480' : '#FFFFFF',
                                            color: selectedTheme === theme.id ? 'white' : '#8B6B58',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span>{theme.icon}</span>
                                        <span>{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ✅ UPDATED: Prompt Input like Code 2 */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#FF6B9D' }}>
                                <FiImage style={{ marginRight: '8px' }} /> Describe your design
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Example: A beautiful resin tray with gold flakes and dried flowers, ocean blue color, elegant design"
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    border: '1px solid #f0e4d8',
                                    borderRadius: '24px',
                                    backgroundColor: '#fefaf5',
                                    fontSize: '14px',
                                    color: '#2D1F12',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#FF6B9D';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#f0e4d8';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* ✅ UPDATED: Trending Prompts like Code 2 */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#FF6B9D' }}>
                                <FiTrendingUp style={{ marginRight: '8px' }} /> Trending Ideas
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                                {trendingPrompts.map((tp, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleTrendingPromptClick(tp)}
                                        style={{
                                            padding: '8px 16px',
                                            background: '#fefaf5',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '40px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            color: '#8B6B58',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#E75480';
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#fefaf5';
                                            e.currentTarget.style.color = '#8B6B58';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        {tp.length > 35 ? tp.substring(0, 35) + '...' : tp}
                                    </button>
                                ))}
                            </div>
                            <p style={{ fontSize: '11px', color: '#8B6B58' }}>
                                Click on any idea above to load it, then click Generate!
                            </p>
                        </div>

                        {/* Price Calculator Toggle */}
                        <button
                            onClick={() => setShowPriceCalculator(!showPriceCalculator)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#FFFFFF',
                                border: '1px solid #f0e4d8',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginBottom: '18px',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: '#FF6B9D',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = '#FF6B9D';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#f0e4d8';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <FiDollarSign /> Price Estimator
                        </button>

                        {/* Price Calculator Panel */}
                        {showPriceCalculator && (
                            <div style={{
                                background: '#fefaf5',
                                borderRadius: '24px',
                                padding: '20px',
                                marginBottom: '25px',
                                border: '1px solid #f0e4d8',
                                animation: 'fadeIn 0.3s ease'
                            }}>
                                <h4 style={{ fontSize: '15px', marginBottom: '15px', color: '#FF6B9D', fontWeight: '700' }}>Cost Breakdown</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#8B6B58' }}>
                                    <span>Material Cost:</span>
                                    <span>Rs. {materialCost}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#8B6B58' }}>
                                    <span>Labor & Craftsmanship:</span>
                                    <span>Rs. {laborCost}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#8B6B58' }}>
                                    <span>Shape/Size/Finish Bonus:</span>
                                    <span>Rs. {calculatePrice() - (materialCost + laborCost)}</span>
                                </div>
                                {/* ✅ ADDED: Complexity Bonus from Code 2 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#8B6B58' }}>
                                    <span>Complexity Bonus:</span>
                                    <span>Rs. {prompt.length > 50 ? 500 : 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #f0e4d8' }}>
                                    <span style={{ color: '#2D1F12' }}>Estimated Price:</span>
                                    <span style={{ color: '#FF6B9D' }}>Rs. {getEstimatedPrice().toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* Generate Button */}
                        <button
                            onClick={generateImage}
                            disabled={generating}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: generating ? '#C9A9A9' : 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '60px',
                                fontSize: '16px',
                                fontWeight: '800',
                                cursor: generating ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                marginBottom: '30px',
                                boxShadow: generating ? 'none' : '0 4px 15px rgba(231,84,128,0.5)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!generating) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(231,84,128,0.7)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!generating) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                                }
                            }}
                        >
                            {generating ? <FiLoader className="spin" size={20} /> : <FiImage size={20} />}
                            {generating ? 'Creating your design...' : 'Generate with AI'}
                        </button>

                        {/* Generated Image Display */}
                        {generatedImage && (
                            <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                                <div style={{
                                    border: '1px dashed #f0e4d8',
                                    borderRadius: '28px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    marginBottom: '25px',
                                    background: '#fefaf5',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={getImageUrl(generatedImage)}
                                        alt="AI Generated Design"
                                        onError={handleImageError}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '280px',
                                            borderRadius: '20px',
                                            marginBottom: '15px',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                            objectFit: 'contain'
                                        }}
                                    />
                                    <p style={{ fontSize: '13px', color: '#FF6B9D', fontWeight: '700' }}>✨ AI Generated Design ✨</p>
                                    
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={shareDesign}
                                            style={{
                                                background: '#FFFFFF',
                                                border: '1px solid #f0e4d8',
                                                borderRadius: '50%',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                transition: 'all 0.3s ease',
                                                color: '#FF6B9D'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#E75480';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#FFFFFF';
                                                e.currentTarget.style.color = '#FF6B9D';
                                            }}
                                            title="Share"
                                        >
                                            <FiShare2 size={14} />
                                        </button>
                                        <button
                                            onClick={exportAsPNG}
                                            style={{
                                                background: '#FFFFFF',
                                                border: '1px solid #f0e4d8',
                                                borderRadius: '50%',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                transition: 'all 0.3s ease',
                                                color: '#FF6B9D'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#E75480';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#FFFFFF';
                                                e.currentTarget.style.color = '#FF6B9D';
                                            }}
                                            title="Download"
                                        >
                                            <FiDownload size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Details Inputs */}
                                <div style={{ marginBottom: '25px' }}>
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            marginBottom: '14px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.3s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#FF6B9D';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#f0e4d8';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price (PKR)"
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '50px',
                                            marginBottom: '14px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.3s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#FF6B9D';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#f0e4d8';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={productDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                        rows="2"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            border: '1px solid #f0e4d8',
                                            borderRadius: '24px',
                                            background: '#fefaf5',
                                            color: '#2D1F12',
                                            fontSize: '14px',
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.3s ease',
                                            boxSizing: 'border-box',
                                            resize: 'vertical'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#FF6B9D';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(231,84,128,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#f0e4d8';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '14px' }}>
                                    <button
                                        onClick={addToCart}
                                        style={{
                                            flex: 1,
                                            padding: '14px',
                                            background: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '60px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontWeight: '700',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(16,185,129,0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <FiShoppingCart /> Add to Cart
                                    </button>
                                    <button
                                        onClick={saveDesign}
                                        style={{
                                            flex: 1,
                                            padding: '14px',
                                            background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '60px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontWeight: '700',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 8px rgba(231,84,128,0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(231,84,128,0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(231,84,128,0.3)';
                                        }}
                                    >
                                        <FiSave /> Save Design
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ==================== SAVED DESIGNS SECTION ==================== */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '32px',
                        padding: '35px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid #f0e4d8',
                        animation: 'fadeInUp 0.8s ease'
                    }}>
                        <h2 style={{ 
                            fontSize: '26px', 
                            marginBottom: '28px', 
                            background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <FiHeart /> My Saved Designs
                        </h2>
                        
                        {loadingDesigns ? (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <FiLoader className="spin" size={40} color="#FF6B9D" />
                            </div>
                        ) : customizations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '70px 20px', color: '#8B6B58' }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    animation: 'glowPulse 2s ease-in-out infinite'
                                }}>
                                    <FiHeart size={30} color="white" />
                                </div>
                                <p style={{ fontSize: '16px', fontWeight: '500' }}>No saved designs yet</p>
                                <p style={{ fontSize: '12px' }}>Generate and save your first design!</p>
                            </div>
                        ) : (
                            <div style={{ maxHeight: '550px', overflowY: 'auto', paddingRight: '8px' }}>
                                {customizations.map((item, idx) => (
                                    <div key={item._id} style={{
                                        display: 'flex',
                                        gap: '18px',
                                        padding: '18px',
                                        background: '#fefaf5',
                                        borderRadius: '24px',
                                        border: '1px solid #f0e4d8',
                                        marginBottom: '15px',
                                        transition: 'all 0.3s ease',
                                        animation: `fadeInUp 0.4s ease ${idx * 0.05}s both`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                        e.currentTarget.style.borderColor = '#FF6B9D';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                        <img
                                            src={getImageUrl(item.imageUrl)}
                                            alt={item.name}
                                            onError={handleImageError}
                                            style={{
                                                width: '75px',
                                                height: '75px',
                                                objectFit: 'cover',
                                                borderRadius: '16px',
                                                border: '1px solid #f0e4d8'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '700', color: '#2D1F12' }}>
                                                {item.name}
                                            </h4>
                                            <p style={{ fontSize: '11px', color: '#8B6B58', margin: '0 0 8px 0' }}>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#FF6B9D', margin: '0 0 10px 0', fontWeight: '700' }}>
                                                Rs. {item.price?.toLocaleString()}
                                            </p>
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => loadDesign(item)}
                                                    style={{
                                                        padding: '5px 14px',
                                                        background: '#FFFFFF',
                                                        border: '1px solid #f0e4d8',
                                                        borderRadius: '30px',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        color: '#FF6B9D',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#E75480';
                                                        e.currentTarget.style.color = 'white';
                                                        e.currentTarget.style.borderColor = '#E75480';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#FFFFFF';
                                                        e.currentTarget.style.color = '#FF6B9D';
                                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                                    }}
                                                >
                                                    Load
                                                </button>
                                                <button
                                                    onClick={() => addSavedToCart(item)}
                                                    style={{
                                                        padding: '5px 14px',
                                                        background: '#FFFFFF',
                                                        border: '1px solid #10b981',
                                                        borderRadius: '30px',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        color: '#10b981',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#10b981';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#FFFFFF';
                                                        e.currentTarget.style.color = '#10b981';
                                                    }}
                                                >
                                                    <FiShoppingCart size={11} /> Add to Cart
                                                </button>
                                                <button
                                                    onClick={() => deleteDesign(item._id)}
                                                    style={{
                                                        padding: '5px 14px',
                                                        background: '#FFFFFF',
                                                        border: '1px solid #f0e4d8',
                                                        borderRadius: '30px',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        color: '#FF6B9D',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#E75480';
                                                        e.currentTarget.style.color = 'white';
                                                        e.currentTarget.style.borderColor = '#E75480';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#FFFFFF';
                                                        e.currentTarget.style.color = '#FF6B9D';
                                                        e.currentTarget.style.borderColor = '#f0e4d8';
                                                    }}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tips Section */}
                <div style={{
                    marginTop: '60px',
                    background: '#FFFFFF',
                    borderRadius: '28px',
                    padding: '30px',
                    textAlign: 'center',
                    border: '1px solid #f0e4d8',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    animation: 'fadeInUp 0.6s ease'
                }}>
                    <h3 style={{ 
                        fontSize: '18px', 
                        color: '#FF6B9D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        fontWeight: '700'
                    }}>
                        <FiAlertCircle /> AI Tips
                    </h3>
                    <p style={{ fontSize: '14px', color: '#8B6B58', fontWeight: '500' }}>
                        Be specific: "round resin coaster with dried lavender flowers, purple and gold, glossy finish"
                    </p>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onClick={() => setShowShareModal(false)}>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '32px',
                        padding: '35px',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center',
                        border: '1px solid #f0e4d8',
                        animation: 'fadeInUp 0.3s ease'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ 
                            marginBottom: '20px', 
                            color: '#FF6B9D', 
                            fontSize: '24px',
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontWeight: '800'
                        }}>
                            Share Your Design
                        </h3>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => shareOnSocial('whatsapp')} style={{ padding: '12px 22px', background: '#25D366', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '700' }}>📱 WhatsApp</button>
                            <button onClick={() => shareOnSocial('facebook')} style={{ padding: '12px 22px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '700' }}>📘 Facebook</button>
                            <button onClick={() => shareOnSocial('twitter')} style={{ padding: '12px 22px', background: '#1DA1F2', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '700' }}>🐦 Twitter</button>
                            <button onClick={() => shareOnSocial('pinterest')} style={{ padding: '12px 22px', background: '#E60023', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '700' }}>📌 Pinterest</button>
                        </div>
                        <button onClick={() => setShowShareModal(false)} style={{ 
                            marginTop: '25px', 
                            width: '100%', 
                            padding: '12px', 
                            background: 'linear-gradient(135deg, #E75480, #FF6B9D)',
                            border: 'none', 
                            borderRadius: '50px', 
                            cursor: 'pointer', 
                            color: 'white',
                            fontWeight: '800'
                        }}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes glowPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default Customization;
