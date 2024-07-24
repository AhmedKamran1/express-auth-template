const router = require("express").Router();

// controller
const {
  getAllRestaurants,
  getApprovedRestaurants,
  registerRestaurant,
  getUserRestaurants,
  approveRestaurant,
  uploadCover,
} = require("../controllers/restaurant");

// middlewares
const { validateRequest } = require("../middlewares/validate-request");
const authenticate = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");

// validation
const {
  restaurantSchema,
  restaurantStatusSchema,
} = require("../utils/validation-schema/restaurant");

// constants
const ROLES = require("../utils/constants/roles");
const upload = require("../multer-config/multer-config");

// Routes
router.get("/all", [authenticate, authorize([ROLES.ADMIN])], getAllRestaurants);
router.get("/approved", getApprovedRestaurants);
router.get(
  "/user",
  [authenticate, authorize([ROLES.MANAGER])],
  getUserRestaurants
);
router.patch(
  "/update-status/:restaurantId",
  [
    authenticate,
    authorize([ROLES.ADMIN]),
    validateRequest(restaurantStatusSchema),
  ],
  approveRestaurant
);
router.post(
  "/register",
  [authenticate, authorize([ROLES.MANAGER]), validateRequest(restaurantSchema)],
  registerRestaurant
);

router.post(
  "/cover",
  [authenticate, authorize([ROLES.MANAGER]), upload.single("image")],
  uploadCover
);

module.exports = router;
