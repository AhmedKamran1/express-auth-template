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

const loginSchema = JoiInstance.object({
  email: JoiInstance.string().email().required(),
}).concat(passwordSchema);

module.exports = {
  signupSchema,
  loginSchema,
  passwordSchema,
};
