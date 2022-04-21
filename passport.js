const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('./schemas/user');
const passport = require('passport');
require('dotenv').config();
const bcrypt = require('bcrypt');
const mongo = require('mongodb')

const ObjectID = mongo.ObjectId;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  function async (accessToken, refreshToken, profile, done) {
    User.findOne({googleId: profile.id}, (err, user) => {
      if(err){
        return done(err)
      }
      if(!user) {
        user = new User({
          _id: new ObjectID(),
          nameFirst: profile.name.givenName,
          nameLast: profile.name.familyName,
          googleId: profile.id,
          email: profile.emails[0].value,
          password: null
        });
        console.log(user);
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

passport.use(new LocalStrategy({usernameField: 'email'},
  async function(username, password, done) {
    console.log("local strategy")
    try{
      const foundUser = await User.findOne({ email: username });
      console.log("found user")
      if (foundUser && await bcrypt.compare(password, foundUser.password)) {
        console.log("user and password match!")
        done(null, foundUser);
      } else {
        console.log("password or user wrong!")
        done(null, false);
      }

    } catch (error){
      done(error)
    }
  }
));
passport.serializeUser((user, done) => {
  console.log("serialize: ", user)
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log("id: ", id);
  User.findOne({_id: id}, (err, user) => {
    done(err, user);
  })
});