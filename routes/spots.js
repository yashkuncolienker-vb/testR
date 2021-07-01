const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateSchema, isLoggedIn, isAuthor } = require("../middleware");
const spot = require("../controllers/spot");

router.get("/new", isLoggedIn, spot.newForm);

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(spot.editForm));

router.get("/:id", catchAsync(spot.showPage));

router.post("/", validateSchema, catchAsync(spot.createNewSpot));

router.put("/:id", validateSchema, isAuthor, catchAsync(spot.updateSpot));

router.delete("/:id/delete", isAuthor, catchAsync(spot.deleteSpot));

router.get("/", catchAsync(spot.index));

module.exports = router;
