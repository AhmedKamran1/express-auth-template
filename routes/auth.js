const router = require("express").Router();

// controller
const {
  getAllUsers,
  registerUser,
  loginUser,
  verifyUser,
  updatePassword,
  sendOTP,
  loginUserByOtp,
} = require("../controllers/auth");

// middlewares
const { validateRequest } = require("../middlewares/validate-request");
const {
  authenticateTokenType,
} = require("../middlewares/authenticate-token-types");
const { authorize } = require("../middlewares/authorize");
const authenticate = require("../middlewares/authenticate");

// validation
const {
  signupSchema,
  loginSchema,
  passwordSchema,
  otpSchema,
} = require("../utils/validation-schema/auth");

// constants
const TOKENTYPES = require("../utils/constants/token-types");
const ROLES = require("../utils/constants/roles");

// Routes
router.get("/users", [authenticate, authorize([ROLES.ADMIN])], getAllUsers);
router.post("/register", validateRequest(signupSchema), registerUser);
router.get(
  "/verify",
  authenticateTokenType(TOKENTYPES.ACCOUNT_VERIFICATION),
  verifyUser
);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/login-otp", validateRequest(otpSchema), loginUserByOtp);
router.get("/send-otp/:email", sendOTP);
router.patch(
  "/update-password",
  [
    authenticateTokenType(TOKENTYPES.RESET_PASSWORD),
    validateRequest(passwordSchema),
  ],
  updatePassword
);

module.exports = router;
