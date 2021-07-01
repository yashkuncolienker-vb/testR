const { spotSchema, reviewSchema } = require("./schemas");
const Spot = require("./models/spot");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { findById } = require("./models/review");

module.exports.validateSchema = (req, res, next) => {
  const { error } = spotSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.storedURL = req.originalUrl;
    req.flash("error", "Not logged In");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const spot = await Spot.findById(id);

  if (!spot.author.equals(req.user.id)) {
    req.flash("error", "Not Permitted");
    return res.redirect(`/spot/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const review = await Review.findById(reviewid);
  console.log(req.originalUrl)
  if (!review.author.equals(req.user.id)) {
    req.flash("errors", "Not Permitted");
    return res.redirect(`/spot/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
