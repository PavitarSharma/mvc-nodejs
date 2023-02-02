const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    vendor_id: {
      type: String,
      required: [true, "Vendor id is required"],
    },

    logo: {
      type: String,
      required: [true, "Store logo is required"],
    },

    business_email: {
      type: String,
      required: [true, "Business email is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },

    pin: {
      type: Number,
      required: [true, "Pin is required"],
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  {
    timestamps: true,
  }
);

storeSchema.index({ location: "2dsphere" });

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
