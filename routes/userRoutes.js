const express = require("express");
const {
  createUser,
  loginUser,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
// const upload = require("../middleware/uploadFile");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/userImages"));
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

router.post("/user/register", upload.single("image"), createUser);

router.post("/user/login", loginUser);

router.patch("/user/update-password", auth, updatePassword);

router.post("/user/forgot-password", forgotPassword);

router.put("/user/reset-password/:token", resetPassword);

module.exports = router;
