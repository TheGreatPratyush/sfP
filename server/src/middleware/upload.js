const multer = require("multer");
const path = require("path");
const fs = require("fs");

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    const cloudinary = require("cloudinary").v2;
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'rangrasiya_products',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        },
    });
} else if (process.env.CLOUDINARY_URL) {
    const cloudinary = require("cloudinary").v2;
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    
    // Cloudinary automatically configures itself if CLOUDINARY_URL env var is present
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'rangrasiya_products',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        },
    });
} else {
    // Configures the upload directory
    const uploadDirectory = path.join(__dirname, "../../uploads");

    if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    // Configures where uploaded product images are stored locally
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDirectory);
        },

        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
        },
    });
}

// Allows only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;
