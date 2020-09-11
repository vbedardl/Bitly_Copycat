const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()
const { users } = require('../database');
const { getUserByEmail, generateRandomString, getUserByResetToken } = require('../helpers');
const TemplateVars = require('../Schema/TemplateVars');

router.get('/forgot-password', (req, res) => {
  const templateVars = new TemplateVars()
  res.render('forgot-page', templateVars)
})

router.post('/forgot-password', (req, res) => {
  const user = getUserByEmail(req.body.email, users)
  if(user){
    user.resetToken = generateRandomString(7)
    let transporter = nodeMailer.createTransport({
      host:'smtp.gmail.com',
      port:465,
      secure:true,
      auth:{
        user:process.env.USERMAIL,
        pass: process.env.USERPASS
      }
    })
    let mailOptions = {
      to: req.body.email,
      subject: 'Reset password for TinyUrl',
      html: `<p>Hi, to reset your password click on the following link: <a href="${req.protocol}://${req.get('host')}/reset?token=${user.resetToken}">Reset your password</a></p>`
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if(error){
        return console.log(error)
      }
      console.log('Message %s sent: %s', info.messageId, info.response)
    })
  }
  const templateVars = new TemplateVars()
  templateVars.hasMessage('Reset email sent')
  res.render('forgot-page', templateVars)
})

router.get('/reset', (req, res) => {
  req.session.reset = req.query.token
  res.redirect('/reset-password')
})

router.get('/reset-password', (req, res) => {
  const user = getUserByResetToken(req.session.reset, users)
  const templateVars = new TemplateVars()
  if(!user){
  templateVars.hasMessage('Error...')
  }else{
    req.session.user_id = user.id;
  }
  res.render('reset-password', templateVars)
})

router.post('/change-password', (req, res) => {
  if(req.session.reset && req.session.user_id){
    users[req.session.user_id].password = bcrypt.hashSync(req.body.password, 10)
  }
  req.session.reset = null
  res.redirect('/urls')
})

module.exports = router