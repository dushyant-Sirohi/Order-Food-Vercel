const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
function authController() {
  const _getRedirectUrl = (req) => {
    return req.user.role === "admin" ? "admin/orders" : "customers/orders";
  };

  return {
    login(req, res) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      const { email, password } = req.body;
      if (!email || !password) {
        req.flash("error", "All fields are required");
        req.flash("email", email);
        return res.redirect("/login");
      }

      passport.authenticate("local", (error, user, info) => {
        if (error) {
          req.flash("error", info.message);
          return next(error);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render("auth/register");
    },
    async registerUser(req, res) {
      const { name, email, password } = req.body;
      req.flash("error", "All fields are required");
      if (!name || !email || !password) {
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // Check Email Unique

      const result = await User.exists({ email: email });
      if (result) {
        req.flash("error", "Email already exists");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      userData
        .save()
        .then((user) => {
          return res.redirect("/login");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong");
          return res.redirect("/register");
        });
    },
    logoutUser(req, res) {
      req.logout();
      return res.redirect("/login");
    },
  };
}

module.exports = authController;
