const User = require("../models/user");

module.exports.showRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
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
};

module.exports.showLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back");
  let storedURL = "/spot";
  if (req.session.storedURL && req.session.storedURL.method !== "GET") {
    storedURL = req.session.storedURL;
  }
  delete req.session.storedURL;
  res.redirect(storedURL);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/spot");
};
