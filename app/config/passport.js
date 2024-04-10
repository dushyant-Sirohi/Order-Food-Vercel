const User = require("../models/user");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username });
          if (!user) {
            return done(null, false, { message: "No user with this email" });
          }
          bcrypt
            .compare(password, user.password)
            .then((match) => {
              if (match) {
                return done(null, user, { message: "Logged in sucessfully" });
              }
              return done(null, false, {
                message: "Wrong username or password",
              });
            })
            .catch((err) => {
              return done(null, false, { message: "Something went wrong" });
            });
        } catch (error) {
          return done(null, false, { message: "Something went wrong" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ _id: id });
    if (user) {
      done(null, user);
    }
  });
}

module.exports = init;
