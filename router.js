const router = require("express").Router();
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;
const Auth = require("./controllers/auth");
const passport = require("./utils/Passport");

router.get("/dashboard", ensureLoggedIn(), (req, res) => {
  const { user } = req;
  res.render("dashboard", { user });
});

router.get("/", (req, res) => {
  res.render("home", {});
});

router.get("/login", (req, res) => {
  res.render("login", {});
});

router.get("/signup", (req, res) => {
  res.render("signup", {});
});

router.post("/signup", Auth.signup);
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/error" }),
  Auth.login
);

module.exports = router;
