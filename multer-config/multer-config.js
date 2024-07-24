const cloudinary = require("cloudinary").v2;

const multer = require("multer");
const upload = multer({ dest: 'uploads/' })

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = upload;