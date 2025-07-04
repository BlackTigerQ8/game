const express = require("express");
const { protect } = require("../middleware/authorize");

const router = express.Router();
router.use(protect);
