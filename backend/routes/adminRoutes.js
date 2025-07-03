const express = require("express");
const adminController = require("../controllers/adminController");
const validate = require("../middleware/validate");
const { body } = require("express-validator");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Apply auth and admin authorization to all admin routes
router.use(require("../middleware/authorize"), authorize("admin"));

router.post(
  "/categories",
  [body("name").trim().notEmpty().withMessage("Category name is required")],
  validate,
  adminController.createCategory
);

router.post(
  "/questions",
  [
    body("category").isMongoId().withMessage("Invalid category ID"),
    body("title").trim().notEmpty().withMessage("Question title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("level")
      .isIn(["easy", "medium", "hard"])
      .withMessage("Invalid difficulty level"),
  ],
  validate,
  adminController.createQuestion
);

router.get("/stats", adminController.getStats);

module.exports = router;
