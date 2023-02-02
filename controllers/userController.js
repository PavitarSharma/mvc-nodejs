const { accessTopken } = require("../helpers/jwt_helper");
const sendMail = require("../helpers/sendMail");
const User = require("../models/User");
const crypto = require("crypto");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, type, mobile } = req.body;

    if (!name || !email || !password || !type || !mobile || !req.file) {
      return res.status(400).json("Invalid inputs");
    }

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(403).json("User already exits");
    }

    const file = req.file.filename;

    user = await User.create({
      name,
      email,
      password,
      mobile,
      type,
      image: file,
    });

    const savedUser = await user.save();

    res.status(201).json({
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json("Invalid inputs");
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("Invalid user details");
    }

    const matchPassword = await user.isValidPassword(req.body.password);
    if (!matchPassword) {
      return res.status(404).json("Invalid user details");
    }

    const token = await accessTopken(user);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      type: user.type,
      token,
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: userData,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json("Plese enter old & new password");
    }

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.isValidPassword(oldPassword);
    if (!isPasswordMatched) {
      return res.status(400).json("Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json("Password updated successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const forgotPassword = async (req, res, next) => {
  if (!req.body.email) {
    res.status(400).json("Plese give your email for update your password");
  }
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json("User not found with this email");
  }

  const resetToken = await user.getResetPasswordToken();

  await user.save({
    validateBeforeSave: false,
  });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/reset-password/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} succesfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    res.status(500).json(error.message);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTime: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json("Reset password url is invalid or has been expired");
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res
        .status(400)
        .json("Password is not matched with the new password");
    }

    user.password = req.body.newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save();
    res.status(201).json({
      success: true,
      message: "Reset Password successfully",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createUser,
  loginUser,
  updatePassword,
  forgotPassword,
  resetPassword,
};
