const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configuring cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  // Cloudinary cloud name
  api_key: process.env.CLOUD_API_KEY,  // Cloudinary API key
  api_secret: process.env.CLOUD_API_SECRET,  // Cloudinary API secret
});

// Creating a new storage instance for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",  // Folder name in Cloudinary where files will be uploaded
    allowed_formats: ["png", "jpg", "jpeg"],  // Allowed file formats
  },
});

module.exports = {
  cloudinary,
  storage,
};
