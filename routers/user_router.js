const express = require('express');
const router = express.Router();
const { users } = require('../database');
const bcrypt = require('bcrypt')
const TemplateVars = require('../Schema/TemplateVars');
const { getUserById } = require('../helpers');
const searchEngine = require('../searchAPI')

router.get('/user/:id', (req, res) => {
  const templateVars = new TemplateVars();
  if (req.session.user_id) {
    templateVars.hasUserID(req.session.user_id);
  }
  res.render('edit_user', templateVars)
})

router.put('/user/:id', (req, res) => {
  const templateVars = new TemplateVars();
  if (bcrypt.compareSync(req.body.password, users[req.params.id].password) && req.session.user_id === req.params.id) {
    users[req.params.id].name = req.body.userName
    users[req.params.id].email = req.body.email
    users[req.params.id].newpassword = bcrypt.hashSync(req.body.password,10)
    templateVars.hasUserID(req.session.user_id);
    templateVars.hasMessage('Account information updated');
  res.render('edit_user', templateVars)
  }else{
    templateVars.hasUserID(req.session.user_id);
    templateVars.hasMessage('Wrong Password. The information was not updated');
  }
})

router.get('/dashboard', (req, res) => {
  const user = getUserById(req.session.user_id, users)
  if(user.paid){
    res.render('dashboard')
  }else{
    req.session.msg = 'Dashboard Features. Learn more'
    res.redirect('/upgrade')
  }
})
router.get('/campaign', (req, res) => {
  const user = getUserById(req.session.user_id, users)
  if(user.paid){
    res.render('campaign')
  }else{
    req.session.msg = 'Campaign Features. Learn more'
    res.redirect('/upgrade')
  }
})
router.get('/upgrade', (req, res) => {
  const templateVars = new TemplateVars();
templateVars.hasUserID(req.session.user_id)
templateVars.message = req.session.msg
req.session.msg = null
  res.render('upgrade_page', templateVars)
})

router.get('/account-settings', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id)

  res.render('account_settings', templateVars)
})

router.get('/search', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id)

  const { userUrls } = templateVars
  const selectedUrls = {}
  Object.keys(userUrls).forEach((url) => {
    const stringifyObj = JSON.stringify(userUrls[url].longURL)+JSON.stringify(userUrls[url].urlTitle)+JSON.stringify(userUrls[url].tags)
    if(stringifyObj.includes(req.query.q)){
      selectedUrls[url] = userUrls[url]
    }
  })



   console.log('SelectedURLS:',selectedUrls)
  templateVars.searchUrls(selectedUrls)

  res.render('new_urls_index', templateVars)
})

module.exports = router;
