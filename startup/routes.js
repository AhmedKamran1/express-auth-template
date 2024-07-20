const express = require("express");
const auth = require("../routes/auth");
const mail = require("../routes/mail");
const restaurant = require("../routes/restaurant");
const routeMiddleware = require("../middlewares/invalid-route");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/mail", mail);
  app.use("/api/restaurant", restaurant);
  app.use(routeMiddleware);
};
