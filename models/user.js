const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ROLES = require("../utils/constants/roles");
const { hashPassword } = require("../utils/password");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    select: false,
  },
  role: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 10,
    enum: [ROLES.USER, ROLES.MANAGER],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
    next();
  }
});

userSchema.methods.generateAuthToken = function (expireTime) {
  const token = jwt.sign(
    { id: this._id, name: this.name, email: this.email, role: this.role },
    process.env.jwtPrivateKey,
    { expiresIn: expireTime || "3600m" }
  );
  return token;
};

userSchema.methods.generateOTP = function () {
  let digits = "0123456789";
  let OTP = "";
  let len = digits.length;
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }

  return OTP.toString();
};

module.exports = mongoose.model("User", userSchema);
