const {
    persistImageSource,
    persistFromUploadedFile
} = require('../utils/persistImage');

const persistImage = async (req, res) => {
    try {
        let imageUrl;

        if (req.file) {
            imageUrl = persistFromUploadedFile(req.file);
        } else if (req.body?.source) {
            imageUrl = await persistImageSource(req.body.source);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Provide an image file or a source URL/data URL'
            });
        }

        res.json({
            success: true,
            message: 'Image saved locally',
            data: { imageUrl }
        });
    } catch (error) {
        console.error('Persist image error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to persist image'
        });
    }
};

module.exports = { persistImage };
