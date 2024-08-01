const { BadRequestError, NotFoundError } = require("../utils/errors");
const Restaurant = require("../models/restaurant");
const {
  uploadImage,
  deleteImage,
  extractPublicId,
} = require("../multer-config/multer-config");

// Add Restaurant Cover Photo
const uploadCover = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const restaurant = await Restaurant.findById({
    _id: restaurantId,
  });
  if (!restaurant) throw NotFoundError("Restaurant does not exist");
  const image = req.file;
  if (!image) throw NotFoundError("Image does not exist");
  const deletedCover = restaurant.cover;
  const path = `${restaurantId}/cover`;
  const result = await uploadImage(path, image);
  restaurant.set({ cover: result.secure_url });
  await restaurant.save();
  if (deletedCover)
    await deleteImage(`${path}/${extractPublicId(deletedCover)}`);
  res.status(200).send({ message: "Cover uploaded successfully!" });
};

// Add restaurant images
const uploadImages = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const restaurant = await Restaurant.findById({
    _id: restaurantId,
  });
  if (!restaurant) throw NotFoundError("Restaurant does not exist");
  const path = `${restaurantId}/images`;
  const results = await Promise.allSettled(
    req.files.map((image) => uploadImage(path, image))
  );
  const successfulUploads = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      successfulUploads.push(result.value.secure_url);
    }
  }
  restaurant.images.push(...successfulUploads);
  await restaurant.save();
  res.status(200).send(restaurant);
};

// Delete restaurant images
const deleteImages = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const updatedImages = req.body.images;
  const restaurant = await Restaurant.findById({
    _id: restaurantId,
  });
  if (!restaurant) throw NotFoundError("Restaurant does not exist");
  const path = `${restaurantId}/images`;
  await Promise.allSettled(
    updatedImages.map((image) =>
      deleteImage(`${path}/${extractPublicId(image)}`)
    )
  );
  const filteredImages = restaurant.images.filter(
    (image) => !updatedImages.includes(image)
  );
  restaurant.set({ images: filteredImages });
  await restaurant.save();
  res.status(200).send(restaurant);
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find();
  res.status(200).send(restaurants);
};

// Get all approved restaurants
const getApprovedRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find({ isApproved: true });
  res.status(200).send(restaurants);
};

// Get user restaurants
const getUserRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find({ userId: req.user.id });
  res.status(200).send(restaurants);
};

// Register unapproved restaurant
const registerRestaurant = async (req, res) => {
  const newRestaurant = req.body;
  let restaurant = await Restaurant.findOne({ taxId: req.body.taxId });
  if (restaurant) throw BadRequestError("Restaurant already exists");
  await Restaurant.create({ ...newRestaurant, userId: req.user.id });
  res.status(201).send({ message: "restaurant created!" });
};

// approve restaurant
const approveRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById({
    _id: req.params.restaurantId,
  });
  if (!restaurant) throw NotFoundError("Restaurant does not exist");
  if (restaurant.isApproved)
    throw BadRequestError("Restaurant is already approved!");
  restaurant.set({ isApproved: true });
  await restaurant.save();

  res.status(200).send({ message: "Restaurant approved successfully!" });
};

module.exports = {
  getAllRestaurants,
  getApprovedRestaurants,
  registerRestaurant,
  getUserRestaurants,
  approveRestaurant,
  uploadCover,
  uploadImages,
  deleteImages,
};
