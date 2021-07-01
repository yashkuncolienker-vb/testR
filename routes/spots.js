const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Spot = require("../models/spot");
const { validateSchema, isLoggedIn, isAuthor } = require("../middleware");

router.get("/new", isLoggedIn, (req, res) => {
  res.render("spot/new");
});

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    let temp = await Spot.findById(req.params.id);
    if (!temp) {
      req.flash("errors", "Spot Does not exist, Wrong ID");
      return res.redirect("/spot");
    }

    res.render("spot/edit", { temp });
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    let { id } = req.params;
    let temp = await Spot.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");

    if (!temp) {
      req.flash("errors", "Spot Does not exist, Wrong ID");
      return res.redirect("/spot");
    }

    res.render("spot/show", { temp });
  })
);

router.post(
  "/",
  validateSchema,
  catchAsync(async (req, res, next) => {
    let temp = new Spot(req.body.spot);
    temp.author = req.user.id;
    await temp.save();
    req.flash("success", "Successfully made new spot!");
    res.redirect(`/spot/${temp.id}`);
  })
);

router.put(
  "/:id",
  validateSchema,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);

    await Spot.findByIdAndUpdate(
      req.params.id,
      { ...req.body.spot },
      { useFindAndModify: false }
    );
    req.flash("success", "Successfully edited spot!");
    res.redirect(`/spot/${req.params.id}`);
  })
);

router.delete(
  "/:id/delete",
  isAuthor,
  catchAsync(async (req, res) => {
    await Spot.findByIdAndDelete(req.params.id);
    req.flash("success", "successfully deleted spot!");
    res.redirect("/spot");
  })
);

router.get(
  "/",
  catchAsync(async (req, res) => {
    let temp = await Spot.find({});
    res.render("spot/index", { temp });
  })
);
module.exports = router;
