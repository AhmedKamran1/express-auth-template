const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  taxId: {
    type: String,
    required: true,
    minlength: 13,
    maxlength: 13,
    unique: true,
  },
  categories: [
    {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
