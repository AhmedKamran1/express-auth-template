const mongoose = require("mongoose");
const { hashPassword } = require("../utils/password");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1m",
  },
});

otpSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    this.otp = await hashPassword(this.otp);
    next();
  }
});

module.exports = mongoose.model("OTP", otpSchema);
