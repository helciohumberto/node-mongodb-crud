const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const auth = require("./auth");
const db = require("./db");

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.findUser(id);
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });

  passport.use(new LocalStrategy({
    usernameField: "nome",
    passwordField: "senha"
  }, async (username, password, done) => {
    try {
      const user = await auth.findUserByName(username);
      if (!user) return done(null, false);

      if (!user.senha) return done(null, false);

      const isMatch = bcrypt.compareSync(password, user.senha);
      if (!isMatch) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
};
