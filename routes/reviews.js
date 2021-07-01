const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const Spot = require("../models/spot");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const review = require("../controllers/reviews");

router.post("/", validateReview, isLoggedIn, catchAsync(review.createReview));

router.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(review.deleteReview)
);

module.exports = router;
