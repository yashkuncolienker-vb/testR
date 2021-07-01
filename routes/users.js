const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body.user;
      const usr = new User({ email, username });
      const regUser = await User.register(usr, password);
      req.login(regUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Successfully Registered New User");
        res.redirect("/spot");
      });
    } catch (e) {
      req.flash("errors", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back");
    let storedURL = "/spot";
    if (req.session.storedURL && req.session.storedURL.method !== "GET") {
      storedURL = req.session.storedURL
    }
    delete req.session.storedURL;
    res.redirect(storedURL);
  }

);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/spot");
});
module.exports = router;
