const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const { createStore } = require("../controllers/storeController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/storeImages"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/store/create-store", auth, upload.single("logo"),  createStore);



module.exports = router;
