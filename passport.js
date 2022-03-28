const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./mongoose');
const passport = require('passport');
const clientId = "28918326983-tc1phum44eqjptk4odblk05qj0qkrtcj.apps.googleusercontent.com";
const clientSecret = "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";

passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: "/auth/google/callback",
    // passReqToCallback: true,
  },
  function async (accessToken, refreshToken, profile, done) {
    User.findOne({googleId: profile.id}, (err, user) => {
      if(err){
        return done(err)
      }
      if(!user) {
        user = new User({
          nameFirst: profile.name.givenName,
          nameLast: profile.name.familyName,
          googleId: profile.id,
          email: profile.emails[0].value,
        });
        user.save(err => {
          if(err){
            console.log(err);
            return done(err)
          }
          done(null, profile)
        });
      } else {
        done(null, profile)
      }
    })


    console.log(profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});