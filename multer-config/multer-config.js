const { allowedImageTypes } = require("../utils/constants/files-types");
const cloudinary = require("cloudinary").v2;

const multer = require("multer");
const { BadRequestError } = require("../utils/errors");
const storage = multer.memoryStorage(); // store image in memory
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(BadRequestError("file type is not allowed"));
    }

    cb(null, true);
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const extractPublicId = (link) => {
  const dottedParts = link.split("/").pop().split(".");
  dottedParts.pop();
  return dottedParts.join(".");
};

const uploadImage = async (path, file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "image", folder: path },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(file.buffer);
  });
};

const deleteImage = async (path) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { upload, uploadImage, deleteImage, extractPublicId };
