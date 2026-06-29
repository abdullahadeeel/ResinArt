const { fal } = require('@fal-ai/client');
const {
    persistImageSource,
    isLocalUploadPath,
    deleteLocalImage
} = require('../utils/persistImage');

// Configure Fal.ai with your API key
fal.config({
    credentials: process.env.FAL_API_KEY
});

const generateAIImage = async (req, res) => {
    try {
        const { prompt, style, productType } = req.body;
        
        console.log('🎨 REAL AI GENERATION (Fal.ai):');
        console.log('Prompt:', prompt);
        console.log('Style:', style);
        console.log('Product Type:', productType);
        
        if (!prompt || prompt.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Please describe your design'
            });
        }

        // Product specific keywords
        let productKeywords = "";
        switch(productType) {
            case 'coaster':
                productKeywords = "round resin coaster, drink coaster, resin art coaster";
                break;
            case 'keychain':
                productKeywords = "resin keychain, epoxy keychain, resin charm";
                break;
            case 'jewelry':
                productKeywords = "resin necklace, resin pendant, resin jewelry";
                break;
            case 'tray':
                productKeywords = "resin serving tray, decorative resin tray";
                break;
            default:
                productKeywords = "resin art product";
        }
        
        let styleKeywords = "";
        switch(style) {
            case 'elegant':
                styleKeywords = "elegant, sophisticated, gold accents";
                break;
            case 'modern':
                styleKeywords = "modern, minimalist, sleek";
                break;
            default:
                styleKeywords = "natural, organic";
        }
        
        // Enhanced prompt for resin art
        let fullPrompt = `${prompt}, ${productKeywords}, ${styleKeywords}, epoxy resin art, handcrafted resin, clear resin with embedded dried flowers, product photography, white background, 4k, detailed, professional`;

        let negativePrompt = "low quality, blurry, ugly, watermark, text, ribbon, bow, gift wrap, chicken, bird, animal, food, person, human, face, cartoon, illustration, drawing";

        console.log('📝 Full Prompt:', fullPrompt);
        console.log('🤖 Calling Fal.ai to generate resin art...');

        const result = await fal.subscribe("fal-ai/flux/dev", {
            input: {
                prompt: fullPrompt,
                negative_prompt: negativePrompt,
                image_size: "square_hd",
                num_images: 1,
                guidance_scale: 7.5,
                num_inference_steps: 30,
                seed: Math.floor(Math.random() * 1000000)
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    console.log("⏳ Generating resin art image...");
                }
            }
        });

        const tempImageUrl = result.data.images[0].url;
        const imageUrl = await persistImageSource(tempImageUrl);
        
        console.log('✅ RESIN ART IMAGE GENERATED!');
        console.log('📸 Local image path:', imageUrl);
        
        return res.json({
            success: true,
            data: {
                imageUrl: imageUrl,
                prompt: fullPrompt,
                style: style || 'natural',
                productType: productType || 'other',
                description: `${prompt} - AI generated resin art`,
                isRealAI: true,
                provider: 'fal-ai',
                createdAt: new Date()
            }
        });
        
    } catch (error) {
        console.error('❌ Fal.ai Error:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        
        // Fallback - colored placeholders
        const fallbackText = encodeURIComponent(req.body?.prompt?.substring(0, 30) || 'Resin Art');
        const placeholderUrl = `https://placehold.co/600x600/fef3e8/9a3412?text=${fallbackText}`;
        
        return res.json({
            success: true,
            data: {
                imageUrl: placeholderUrl,
                prompt: req.body?.prompt || 'Resin Art',
                isFallback: true
            }
        });
    }
};

// Keep other functions same
const saveAIDesign = async (req, res) => {
    try {
        const AIDesign = require('../models/AIDesign');
        const { name, prompt, imageUrl, price, description, style, productType } = req.body;
        const userId = req.user?._id || null;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        const persistedImageUrl = await persistImageSource(imageUrl);

        const design = await AIDesign.create({
            user: userId,
            name: name || 'Custom AI Design',
            prompt: prompt,
            imageUrl: persistedImageUrl,
            price: price || 2999,
            description: description || '',
            style: style || 'natural',
            productType: productType || 'other'
        });

        console.log('✅ Design saved:', design._id);

        res.json({
            success: true,
            message: 'Design saved successfully',
            data: design
        });

    } catch (error) {
        console.error('❌ Save design error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getUserDesigns = async (req, res) => {
    try {
        const AIDesign = require('../models/AIDesign');
        const userId = req.user?._id;
        
        let designs = [];
        if (userId) {
            designs = await AIDesign.find({ user: userId }).sort({ createdAt: -1 });
        }

        res.json({
            success: true,
            data: designs
        });

    } catch (error) {
        console.error('❌ Get designs error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteAIDesign = async (req, res) => {
    try {
        const AIDesign = require('../models/AIDesign');
        const design = await AIDesign.findById(req.params.id);
        
        if (!design) {
            return res.status(404).json({
                success: false,
                message: 'Design not found'
            });
        }

        if (design.user && req.user?._id && design.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this design'
            });
        }

        if (isLocalUploadPath(design.imageUrl) && design.imageUrl.includes('/uploads/images/')) {
            deleteLocalImage(design.imageUrl);
        }

        await design.deleteOne();

        res.json({
            success: true,
            message: 'Design deleted successfully'
        });

    } catch (error) {
        console.error('❌ Delete design error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    generateAIImage,
    saveAIDesign,
    getUserDesigns,
    deleteAIDesign
};