const User = require("../models/user");

class Auth {
  static async login(req, res) {
    try {
      res.redirect("/dashboard");
    } catch (error) {
      console.error({ error });
      res.redirect("/signup");
    }
  }
  static async signup(req, res) {
    try {
      const { email, password } = req.body;
      await User.signup(email, password);
      res.redirect("/dashboard");
    } catch (error) {
      console.error({ error });
      res.redirect("/signup");
    }
  }
}

module.exports = Auth;
