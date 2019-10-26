const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const errorHandler = require("errorhandler");
const passport = require("./utils/Passport");
const Strategy = require("passport-local").Strategy;
const router = require("./router");
const User = require("./models/user");
const _ = require("lodash");

module.exports = app => {
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use(cors());
  app.use(require("body-parser").urlencoded({ extended: true }));
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("./static"));
  app.use(
    session({
      secret: process.env.SECRET || "fd3ca0730bf8103280e83bb33b7219ee",
      cookie: { maxAge: 60000 },
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(errorHandler());

  passport.use(
    new Strategy(
      { usernameField: "email", passwordField: "password", session: true },
      (email, password, cb) => {
        return User.authenticate(email, password)
          .then(user => {
            cb(null, user);
          })
          .catch(error => {
            console.error({ error });
            cb(null, false, { message: error.message });
          });
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });

  passport.deserializeUser(async (userId, cb) => {
    try {
      const user = await User.findById(userId);
      const json = user.toJSON();
      delete json.password;
      cb(null, json);
    } catch (error) {
      return cb(error.message, null);
    }
  });
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.use((req, res, next) => {
    try {
      const password = _.get(req, "body.password");
      if (password) {
        req.body.password = password.toString();
      }
    } catch (error) {
      console.error({ error });
    }
    next();
  });

  app.use("/", router);
};
