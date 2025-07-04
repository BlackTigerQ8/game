const express = require("express");
const { authorize, protect } = require("../middleware/authorize");
const {
  createCategory,
  createQuestion,
  getStats,
  getUsers,
} = require("../controllers/adminController");

const router = express.Router();
router.use(protect, authorize("admin"));

router.route("/categories").post(createCategory);
router.route("/questions").post(createQuestion);
router.route("/stats").get(getStats);
router.route("/users").get(getUsers);

module.exports = router;
