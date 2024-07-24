const JoiInstance = require("../joi-instance");

// Joi validation schema for adding a new user
const signupSchema = JoiInstance.object({
  name: JoiInstance.string().required(),
  email: JoiInstance.string().email().required(),
  password: JoiInstance.string().required(),
  role: JoiInstance.string().required(),
});

const passwordSchema = JoiInstance.object({
  password: JoiInstance.string().required(),
});

const emailSchema = JoiInstance.object({
  email: JoiInstance.string().email().required(),
});

const loginSchema = JoiInstance.object()
  .concat(emailSchema)
  .concat(passwordSchema);

const otpSchema = JoiInstance.object({
  otp: JoiInstance.string().min(6).max(6).required(),
}).concat(emailSchema);

module.exports = {
  signupSchema,
  loginSchema,
  passwordSchema,
  otpSchema,
};
