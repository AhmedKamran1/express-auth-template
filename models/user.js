const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ROLES = require("../utils/constants/roles");

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
  },
  role: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    enum: [ROLES.USER, ROLES.MANAGER],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, name: this.name, email: this.email, role: this.role },
    process.env.jwtPrivateKey
  );
  return token;
};

module.exports = mongoose.model("User", userSchema);
