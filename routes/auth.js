const router = require("express").Router();

// controller
const {
  getAllUsers,
  registerUser,
  loginUser,
  verifyUser,
  updatePassword,
} = require("../controllers/auth");

// middlewares
const { validateRequest } = require("../middlewares/validate-request");
const authenticate = require("../middlewares/auth");

// validation
const {
  signupSchema,
  loginSchema,
  passwordSchema,
} = require("../utils/validation-schema/auth");

// Routes
router.get("/users", getAllUsers);
router.post("/register", validateRequest(signupSchema), registerUser);
router.get("/verify", authenticate, verifyUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.patch(
  "/update-password",
  [authenticate, validateRequest(passwordSchema)],
  updatePassword
);

module.exports = router;
