const { BadRequestError, NotFoundError } = require("../utils/errors");
const User = require("../models/user");
const { sendMail } = require("../utils/mailer");

// Resend Email verification link
const resendEmailConfirmation = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email });
  if (!user) throw NotFoundError("User does not exist");
  if (user.isVerified) throw BadRequestError("User is already verified!");

  const token = user.generateAuthToken();

  await sendMail(
    user.name,
    user.email,
    "Verify your account",
    `http://localhost:3000/verification?token=${token}`
  );
  res.status(200).send({ message: "Verification link sent at email." });
};

// forgot password reset link
const forgotPassword = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email });
  if (!user) throw NotFoundError("User does not exist");

  const token = user.generateAuthToken();

  await sendMail(
    user.name,
    user.email,
    "Update your password",
    `http://localhost:3000/reset-password?token=${token}`
  );
  res.status(201).send({ message: "reset link sent at email!" });
};

module.exports = {
  forgotPassword,
  resendEmailConfirmation,
};
