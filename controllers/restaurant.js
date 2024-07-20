const {
  BadRequestError,
  ForbiddenRequestError,
  NotFoundError,
} = require("../utils/errors");
const Restaurant = require("../models/restaurant");

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
  const restaurant = await Restaurant.findOne({
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
};
