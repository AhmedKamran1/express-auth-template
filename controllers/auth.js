const jwt = require("jsonwebtoken");

// Models
const User = require("../models/user");
const Otp = require("../models/otp");

// utils
const {
  BadRequestError,
  ForbiddenRequestError,
  NotFoundError,
} = require("../utils/errors");
const TOKENTYPES = require("../utils/constants/token-types");
const { sendMail } = require("../utils/mailer");
const { validatePassword } = require("../utils/password");

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
  user = await User.create(newUser);
  const token = jwt.sign(
    { email: newUser.email, tokenType: TOKENTYPES.ACCOUNT_VERIFICATION },
    process.env.jwtPrivateKey,
    {
      expiresIn: "30m",
    }
  );
  await sendMail(
    newUser.name,
    newUser.email,
    "Verify your account",
    `http://localhost:3000/verification?token=${token}`
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
  console.log(req.user.email);
  if (!user) throw NotFoundError("User does not exist");

  user.set({ password: newPassword });
  await user.save();

  res.status(200).send({ message: "Password updated successfully!" });
};

// login user
const loginUser = async (req, res) => {
  const credentials = req.body;
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) throw NotFoundError("User does not exist");
  const isValid = await validatePassword(credentials.password, user.password);
  if (!isValid) throw BadRequestError("Invalid Credentials");
  if (!user.isVerified)
    throw ForbiddenRequestError("User is not verified! Verify user to login.");
  const token = user.generateAuthToken();

  res.status(200).send({
    details: { name: user.name, email: user.email, role: user.role },
    token: token,
  });
};

// send otp on email
const sendOTP = async (req, res) => {
  const userEmail = req.params.email;
  const user = await User.findOne({ email: userEmail });
  if (!user) throw NotFoundError("User does not exist");
  if (!user.isVerified)
    throw ForbiddenRequestError("User is not verified! Verify user to login.");
  let OTP = user.generateOTP();
  await sendMail(user.name, user.email, "Login attempt", `Your OTP is: ${OTP}`);
  const otpPayload = {
    email: userEmail,
    otp: OTP,
  };
  await Otp.create(otpPayload);

  res.status(201).send({ message: "OTP is sent at email!" });
};

// login user by otp
const loginUserByOtp = async (req, res) => {
  const credentials = req.body;
  const user = await User.findOne({ email: credentials.email });
  if (!user) throw NotFoundError("User does not exist");
  const otpDetails = await Otp.findOne({ email: credentials.email }).sort({
    createdAt: -1,
  });
  if (!otpDetails) throw NotFoundError("OTP has expired!");
  const isValid = await validatePassword(credentials.otp, otpDetails.otp);
  if (!isValid) throw BadRequestError("Invalid OTP");
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
  sendOTP,
  loginUserByOtp,
  verifyUser,
  updatePassword,
};
