const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },

    mobile: {
      type: String,
      required: [true, "mobile is required"],
      trim: true,
    },

    image: {
      type: String,
      required: [true, "image is required"],
    },

    type: {
      type: Number,
      required: [true, "type is required"],
    },

    resetPasswordToken: String,

    resetPasswordTime: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.getResetPasswordToken = function () {
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  this.resetPasswordTime = Date.now() + 45 * 60 * 1000;

  return resetPasswordToken;
};

module.exports = mongoose.model("User", userSchema);
