const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const user = require("../controllers/users");

router.get("/register", user.showRegister);

router.post("/register", catchAsync(user.register));

router.get("/login", user.showLogin);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  user.login
);

router.get("/logout", user.logout);
module.exports = router;
