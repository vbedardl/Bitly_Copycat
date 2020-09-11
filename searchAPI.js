const { urlDatabase, users} = require('./database')

const searchEngine = function(query, userUrls){
  const validObj = {}
  Object.keys(userUrls).forEach((url) => {
    const stringifyObj = JSON.stringify(userUrls[url].longURL)+JSON.stringify(userUrls[url].urlTitle)+JSON.stringify(userUrls[url].tags)
    if(stringifyObj.includes(query)){
      validObj[url] = userUrls[url]
    }
  })

}

module.exports = searchEngine