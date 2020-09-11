//Import MODULES
const express = require('express');
const router = express.Router();
const passport = require('passport');  //GOOGLEAUTH
require('../passport-setup')           //GOOGLEAUTH

//Import DATABASE
const { users } = require('../database');

//Import SCHEMAS
const UserObj = require('../Schema/User')
const TemplateVars = require('../Schema/TemplateVars')

//Import HELPERS
const { getUserByEmail } = require('../helpers')

//Set Up Router
router.use(passport.initialize())      //GOOGLEAUTH
router.use(passport.session())         //GOOGLEAUTH


const isLoggedIn = (req, res, next) => {
  if(req.user){
    next()
  }else{
    res.sendStatus(401)
  }
}

//GOOGLEAUTH
router.get('/failed', (req, res) => res.send('You failed to log in'))
router.get('/good', isLoggedIn, (req, res) => {
    let user = getUserByEmail(req.user.emails[0].value, users)
    const templateVars = new TemplateVars()
    if(user){
      req.session.user_id = user.id;
      res.redirect('/urls');
      return
    }else{
      user = new UserObj(req.user.emails[0].value, req.user.id, req.user.displayName, false);
      users[user.id] = user;
      req.session.user_id = user.id;
      console.log(users)
      res.redirect('/urls');
      return
    }
})

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/good')
  });

module.exports = router;