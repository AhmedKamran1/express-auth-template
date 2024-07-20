const bcrypt = require("bcrypt");
const {
  BadRequestError,
  ForbiddenRequestError,
  NotFoundError,
} = require("../utils/errors");
const User = require("../models/user");
const { sendMail } = require("../utils/mailer");

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
};

// Signup user unverified
const registerUser = async (req, res) => {
  const newUser = req.body;
  let user = await User.findOne({ email: req.body.email });
  if (user) throw BadRequestError("User already exists");
  newUser.password = await bcrypt.hash(newUser.password, 10);
  user = await User.create(newUser);
  const token = user.generateAuthToken();
  await sendMail(
    newUser.name,
    newUser.email,
    "Verify your account",
    `http://localhost:5001/api/auth/verify?token=${token}`
  );
  res
    .status(201)
    .send({ message: "User Created! Verification link sent at email." });
};

// verify user
const verifyUser = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) throw NotFoundError("User does not exist");
  if (user.isVerified) throw BadRequestError("User is already verified!");
  user.set({ isVerified: true });
  await user.save();

  res.status(200).send({ message: "User verified successfully!" });
};

// update user password
const updatePassword = async (req, res) => {
  const newPassword = req.body.password;
  const user = await User.findOne({ email: req.user.email });
  console.log(req.user.email)
  if (!user) throw NotFoundError("User does not exist");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.set({ password: hashedPassword });
  await user.save();

  res.status(200).send({ message: "Password updated successfully!" });
};

// login user
const loginUser = async (req, res) => {
  const credentials = req.body;
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw NotFoundError("User does not exist");
  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) throw BadRequestError("Invalid Credentials");
  if (!user.isVerified)
    throw ForbiddenRequestError("User is not verified! Verify user to login.");
  const token = user.generateAuthToken();

  res.status(200).send({
    details: { name: user.name, email: user.email, role: user.role },
    token: token,
  });
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  verifyUser,
  updatePassword,
};
