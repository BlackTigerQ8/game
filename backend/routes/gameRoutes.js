const express = require("express");
const gameController = require("../controllers/gameController");
const validate = require("../middleware/validate");
const { body } = require("express-validator");

const router = express.Router();

// Apply auth middleware to all game routes
router.use(require("../middleware/authorize"));

router.post(
  "/rooms",
  [body("name").trim().notEmpty().withMessage("Room name is required")],
  validate,
  gameController.createRoom
);

router.put(
  "/rooms/:id/teams",
  [
    body("teams").isArray({ min: 2 }).withMessage("At least 2 teams required"),
    body("teams.*").trim().notEmpty().withMessage("Team name is required"),
  ],
  validate,
  gameController.addTeams
);

router.put(
  "/rooms/:id/categories",
  [
    body("categories")
      .isArray()
      .custom((value, { req }) => {
        const teamCount = req.body.teams?.length || 2;
        return value.length === teamCount * 2;
      })
      .withMessage("Number of categories must be twice the team count"),
  ],
  validate,
  gameController.selectCategories
);

router.post("/rooms/:id/start", gameController.startGame);
router.put("/rooms/:id/reveal/:questionIndex", gameController.revealQuestion);
router.patch("/rooms/:id/award", gameController.awardPoints);
router.get("/rooms/:id", gameController.getRoom);

module.exports = router;
