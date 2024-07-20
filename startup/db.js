const appLogger = require("../utils/logger");
const mongoose = require("mongoose");

const connectionURL = "mongodb://127.0.0.1:27017/playground";

module.exports = function () {
  mongoose
    .connect(connectionURL)
    .then(() => appLogger.info("Connected to MongoDB"))
    .catch((e) => appLogger.error("Error connecting to MongoDB", e));
};
