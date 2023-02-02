const express = require("express")
const { addCategory } = require("../controllers/categoryController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/add-category", auth, addCategory)

module.exports = router