const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const Spot = require("../models/spot");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  validateReview,
  isLoggedIn,
  catchAsync(async (req, res) => {
    let spot = await Spot.findById(req.params.id);
    let temp = new Review(req.body.review);
    temp.author = req.user.id;
    spot.reviews.push(temp);
    await temp.save();
    await spot.save();
    req.flash("success", "successfully made new review!");
    res.redirect(`/spot/${req.params.id}`);
  })
);

router.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    await Review.findByIdAndDelete(req.params.reviewid);

    await Spot.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewid },
    });

    req.flash("success", "successfully deleted review!");
    res.redirect(`/spot/${req.params.id}`);
  })
);

module.exports = router;
