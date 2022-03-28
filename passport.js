const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./mongoose');
const passport = require('passport');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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