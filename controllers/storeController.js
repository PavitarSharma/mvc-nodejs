const Store = require("../models/Store");
const User = require("../models/User");
const createStore = async (req, res, next) => {
  try {
    const { lat, long } = req.body;
    const user = await User.findOne({ _id: req.body.vendor_id });

    if (!user) {
      return res.status(404).json("Vendor id does not exits");
    }

    if (!lat || !long) {
      return res.status(404).json("lat and long is not found");
    }

    const vendorData = await Store.findOne({ vendor_id: req.body.vendor_id });
    if (vendorData) {
      return res.status(404).json("This vendor id is alredy created a store");
    }

    const store = await Store({
      vendor_id: req.body.vendor_id,
      logo: req.file.filename,
      business_email: req.body.business_email,
      address: req.body.address,
      pin: req.body.pin,
      location: {
        type: "Point",
        coordinates: [lat, long],
      },
    });

    await store.save();

    res.status(201).json({
      success: true,
      message: "Store is created",
      store,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createStore,
};
