const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateSchema, isLoggedIn, isAuthor } = require("../middleware");
const spot = require("../controllers/spot");

router.get("/new", isLoggedIn, spot.newForm);
router
  .route("/:id")
  .put(validateSchema, isAuthor, catchAsync(spot.updateSpot))
  .get(catchAsync(spot.showPage));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(spot.editForm));

router.delete("/:id/delete", isAuthor, catchAsync(spot.deleteSpot));

router
  .route("/")
  .post(validateSchema, catchAsync(spot.createNewSpot))
  .get(catchAsync(spot.index));

module.exports = router;
