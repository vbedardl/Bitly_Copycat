const dotenv = require('dotenv')
dotenv.config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const users = require('./database')
const getUserByEmail = require('./helpers')

passport.serializeUser(function(user, done){
  done(null, user)
})

passport.deserializeUser(function(user, done) {
    done(null, user)
  })

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/google/callback"
},
function(accessToken, refreshToken, profile, done){
  const user = profile
  /* const user = getUserByEmail(profile.emails[0].value, users)
  if(!user){
    user = new UserObj(profile.emails[0].value, undefined, false)
    users[user.id] = user 
  } */
    return done(null, user)
  }
))