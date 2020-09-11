const { urlsForUser } = require('../helpers');
const { users, urlDatabase } = require('../database');

class TemplateVars {
  constructor() {
    this.message = undefined,
    this.urls = undefined,
    this.user = undefined,
    this.shortURL = undefined,
    this.longURL = undefined,
    this.userUrls = undefined,
    this.fullPath = undefined,
    this.mobileCount = undefined,
    this.desktopCount = undefined,
    this.url = undefined;
  }
  //populate the various key:value that needs the shortURL has an input
  hasShortURL(shortURL) {
    this.shortURL = shortURL;
    this.longURL = urlDatabase[shortURL].longURL;
    this.url = urlDatabase[shortURL];
  }
  //populate the various key:value that needs the userId has an input
  hasUserID(userId) {
    this.user = users[userId];
    this.userUrls = urlsForUser(userId);
  }
  //populate the key:value 'message' with a desired string
  hasMessage(message) {
    this.message = message;
  }
  // populate the key:value mobileCount and desktopCount with either their total amount of clicks for all the urls in this user database (global = true) or with the amount of clicks for the specific url(global = false)
  clickCount(global) {
    if (global) {
      if (Object.keys(this.userUrls).length > 0) {
        this.mobileCount = Object.keys(this.userUrls).map((url) => this.userUrls[url].visits.mobile).reduce((a, b) => a + b);
        this.desktopCount = Object.keys(this.userUrls).map((url) => this.userUrls[url].visits.desktop).reduce((a, b) => a + b);
      }
    } else {
      this.mobileCount = urlDatabase[this.shortURL].visits.mobile;
      this.desktopCount = urlDatabase[this.shortURL].visits.desktop;
    }
  }
  searchUrls(newObj){
    this.userUrls = newObj
  }
}

module.exports = TemplateVars;