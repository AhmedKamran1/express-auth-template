const JoiInstance = require("../joi-instance");

// Joi validation schema for registering a restaurant
const restaurantSchema = JoiInstance.object({
  name: JoiInstance.string().required(),
  taxId: JoiInstance.string().min(13).max(13),
  categories: JoiInstance.array().min(1),
  address: JoiInstance.string().required(),
  cover: JoiInstance.string(),
  images: JoiInstance.array(),
});

const restaurantStatusSchema = JoiInstance.object({
  isApproved: JoiInstance.boolean().required(),
});

module.exports = {
  restaurantSchema,
  restaurantStatusSchema,
};
