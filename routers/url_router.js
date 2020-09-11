const express = require('express');
const router = express.Router();
const { users, urlDatabase } = require('../database');
const { generateRandomString, urlsForUser } = require('../helpers');
const UrlObject = require('../Schema/Url');
const TemplateVars = require('../Schema/TemplateVars');
const dotenv = require('dotenv')
dotenv.config()
const request = require('request-promise-native')

const isLoggedIn = (req, res, next) => {
  if(req.session.user_id === undefined){
    const templateVars = new TemplateVars()
    res.render('homepage', templateVars)
  }else{
    next()
  }
}

//GET LIST OF URLS
router.get('/', isLoggedIn, (req, res) => {
  const templateVars = new TemplateVars();
    templateVars.hasUserID(req.session.user_id);
  if (req.session.msg) {
    templateVars.hasMessage(req.session.msg);
    req.session.msg = null;
  }
  res.render("new_urls_index", templateVars);
});

//DISPLAY THE FORM TO CREATE A NEW URL
router.get("/new", isLoggedIn, (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  res.render("urls_new", templateVars);
});

//CREATE A NEW URL
router.post("/", (req, res) => {
  if (req.session.user_id) {
    let shortURL = undefined;
    req.body.customURL ?
      shortURL = req.body.customURL :
      shortURL = generateRandomString(6);
    urlDatabase[shortURL] = new UrlObject(req.body.longURL, req.session.user_id, shortURL);
//here
    const base64Credentials = Buffer.from(`vincent@pocketstrategist.ca:${process.env.URLMETA}`).toString('base64')
    const options = {
      url: `https://api.urlmeta.org/?url=${req.body.longURL}`,
      headers: {
        'Authorization': 'Basic ' + base64Credentials
      }
    }

    request(options)
    .then((data) => {
    urlDatabase[shortURL].metaData = JSON.parse(data).meta
    urlDatabase[shortURL].updateUrlTitle()
    }).catch((error)=> {
    console.log(error)
    })

    res.redirect(`/urls/${shortURL}`);
  } else {
    req.session.msg = 'You need to be logged in to do this';
    res.redirect('/');
  }
});

//GET A SPECIFIC URL
router.get('/:shortURL', (req, res) => {
  const templateVars = new TemplateVars();
  const { shortURL } = req.params;
  if (urlDatabase[shortURL]) {
    templateVars.hasUserID(req.session.user_id);
    templateVars.hasShortURL(shortURL);
    templateVars.clickCount(false);
    templateVars.fullPath = req.protocol + '://' + req.get('host');
    res.render("new_url_show", templateVars);
  } else {
    req.session.msg = 'This tiny URL does not exist';
    res.redirect('/');
  }
});

//DISPLAY FORM TO EDIT URL
router.get('/edit/:shortURL', (req, res) => {
  const templateVars = new TemplateVars();
  const { shortURL } = req.params;
  if (urlDatabase[shortURL]) {
    templateVars.hasUserID(req.session.user_id);
    templateVars.hasShortURL(shortURL);
    templateVars.clickCount(false);
    templateVars.fullPath = req.protocol + '://' + req.get('host');
    res.render("new_edit_urls", templateVars);
  } else {
    req.session.msg = 'This tiny URL does not exist';
    res.redirect('/');
  }
});

//DELETE SPECIFIC URL
router.delete('/:shortURL', (req, res) => {
  if (req.session.user_id) {
    const userUrls = urlsForUser(req.session.user_id);
    userUrls[req.params.shortURL] && req.body.shortU === req.params.shortURL ?
      delete urlDatabase[req.params.shortURL] :
      req.session.msg = `The URL was not deleted`;
  } else {
    req.session.msg = `You can't delete a url if you are not logged in`;
  }
  res.redirect('/urls');
});

//UPDATE SPECIFIC URL
router.put('/:shortURL', (req, res) => {
  if (req.session.user_id) {
    const userUrls = urlsForUser(req.session.user_id);
    if(userUrls[req.params.shortURL]) {
      urlDatabase[req.params.shortURL].u = req.body.newLongUrl 
      urlDatabase[req.params.shortURL].urlTitle = req.body.urlTitle 
    }else{
      req.session.msg = `You can't update a url that is not yours`;
    }
  } else {
    req.session.msg = `You can't update a url if you are not logged in`;
  }
  res.redirect('/urls');
});

module.exports = router;
