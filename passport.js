const GoogleStrategy = require('passport-google-oauth20').Strategy;

const passport = require('passport');
const clientId = "28918326983-tc1phum44eqjptk4odblk05qj0qkrtcj.apps.googleusercontent.com";
const clientSecret = "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";

passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      //when using db, change done to cb
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    done(null, profile)
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});