const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()
const { users } = require('../database');
const { getUserByEmail, generateRandomString, getUserByResetToken } = require('../helpers');
const UserObj = require('../Schema/User');
const TemplateVars = require('../Schema/TemplateVars');

const isLoggedIn = (req, res, next) => {
  if(req.session.user_id === undefined){
    const templateVars = new TemplateVars()
    res.render('homepage', templateVars)
  }else{
    next()
  }
}

//GET HOMEPAGE
router.get('/', isLoggedIn, (req, res) => {
    res.redirect('/urls');
  }
);

//DISPLAY LOGIN FORM
router.get('/login', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  if (req.session.msg) {
    templateVars.hasMessage(req.session.msg);
    req.session.msg = null;
  }
  res.render('login_page', templateVars);
});

//DISPLAY REGISTRATION FORM
router.get('/register', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  res.render('registration_page', templateVars);
});

//LOGIN A USER
router.post('/login', (req, res) => {
  const { password, email } = req.body;
  const user = getUserByEmail(email, users);
  const templateVars = new TemplateVars();
  if (!user) {
    templateVars.hasMessage('Sorry user does not exist');
    res.render('login_page', templateVars);
    return;
  }
  if (!bcrypt.compareSync(password, user.password)) {
    templateVars.hasMessage('Password doesnt match');
    res.render('login_page', templateVars);
    return;
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

//LOGOUT A USER
router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

//CREATE A NEW USER
router.post('/register', (req, res) => {
  const templateVars = new TemplateVars();
  if (!req.body.email || !req.body.password) {
    templateVars.hasMessage('Missing something');
    res.render('registration_page', templateVars);
    return;
  }

  const existingUser = getUserByEmail(req.body.email, users);
  if (existingUser) {
    templateVars.hasMessage('User already exists');
    res.render('registration_page', templateVars);
    return;
  }

  let paid = (req.body.paid === 'on' ? true : false);
  const { email, password, userName } = req.body;
  const user = new UserObj(email, password, userName, paid);
  users[user.id] = user;
  req.session.user_id = user.id;
  console.log(users)
  res.redirect('/urls');
});

module.exports = router;