const auth = require('./auth');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: "nome",
        passwordField: "senha"
    }, async (username, password, done) => {
        try {
            const user = auth.findUserByName(username);
            if (!user) return done(null, false);

            const isMatch = await bcrypt.compare(password, user.senha);
            if (!isMatch) return done(null, false);

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
};
