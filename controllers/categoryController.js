const Category = require("../models/Category");

const addCategory = async (req, res) => {
  try {
    if (!req.body.category) {
      return res.status(400).json("Category is required");
    }
    const categoryData = await Category.find();
    let checking = false;
    if (categoryData.length > 0) {
      for (let i = 0; i < categoryData.length; i++) {
        if (
          categoryData[i]["category"].toLowerCase() ===
          req.body.category.toLowerCase()
        ) {
          checking = true;
          break;
        }
      }
    }

    if (checking === false) {
      const category = new Category({
        category: req.body.category,
      });
      await category.save();

      res.status(201).json({
        success: true,
        message: "Category is created",
        category,
      });
    }

    res.status(400).json({
      success: false,
      message: "This category (" + req.body.category + ") is already exits",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  addCategory,
};
