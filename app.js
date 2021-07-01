const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const session = require("express-session");
const flash = require("connect-flash");

const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

const spotRoutes = require("./routes/spots");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const MongoStore = new require('connect-mongo');

const { date } = require("joi");
const { authenticate } = require("passport");
const dbURL = "mongodb+srv://ya17kun:KwJBy8hBr7gQEznI@cluster0.kyk3f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'squirrel'
  }
});

app.use(
  session({
    store,
    secret: "abcd",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.errors = req.flash("errors");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/", userRoutes);
app.use("/spot", spotRoutes);
app.use("/spot/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("not found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "We ran into an error";
  }
  res.status(status).render("error", { err });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`SERVER STARTED ON ${port}`);
});
