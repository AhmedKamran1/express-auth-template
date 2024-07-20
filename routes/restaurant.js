const router = require("express").Router();

// controller
const {
  getAllRestaurants,
  getApprovedRestaurants,
  registerRestaurant,
  getUserRestaurants,
  approveRestaurant,
} = require("../controllers/restaurant");

// middlewares
const { validateRequest } = require("../middlewares/validate-request");
const authenticate = require("../middlewares/auth");
const authorizeManager = require("../middlewares/manager");
const authorizeAdmin = require("../middlewares/admin");

// validation
const {
  restaurantSchema,
  restaurantStatusSchema,
} = require("../utils/validation-schema/restaurant");

// Routes
router.get("/all", getAllRestaurants);
router.get("/approved", getApprovedRestaurants);
router.get("/user", [authenticate, authorizeManager], getUserRestaurants);
router.patch(
  "/update-status/:restaurantId",
  [authenticate, authorizeAdmin, validateRequest(restaurantStatusSchema)],
  approveRestaurant
);
router.post(
  "/register",
  [authenticate, authorizeManager, validateRequest(restaurantSchema)],
  registerRestaurant
);

module.exports = router;
