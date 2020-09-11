const { urlDatabase} = require('./database');

//return a user object from the user database given an email
const getUserByEmail = function(email, database) {
  const user = Object.keys(database).filter(user => database[user].email === email);
  return database[user];
};

const getUserById = function(id, database){
  const user = Object.keys(database).filter(user => database[user].id === id)
  return database[user]
}

//return a user object from the user database given a reset token
const getUserByResetToken = function(token, database) {
  const user = Object.keys(database).filter(user => database[user].resetToken === token);
  return database[user];
};

//return a random string from 09-az-AZ characters given the amount of characters desired(num)
const generateRandomString = function(num) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomStr = '';
  for (let i = num; i > 0; i--) {
    randomStr += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return randomStr;
};

const findCurrentUrl = function(shortU){
  const urlObject = Object.keys(urlDatabase).filter(elm => urlDatabase[elm].u === shortU)
  return urlDatabase[urlObject[0]]
}

//return a filtered set of url objects given a user id
const urlsForUser = function(id) {
  const tempDatabase = {};
  const userUrls =  Object.keys(urlDatabase).filter(elm => urlDatabase[elm].userID === id);
  userUrls.forEach((url) => tempDatabase[url] = urlDatabase[url]);
  return tempDatabase;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  getUserByResetToken,
  findCurrentUrl,
  getUserById
};