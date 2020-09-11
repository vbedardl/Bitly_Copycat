//Import MODULES
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const express = require('express');
const methodOverride = require('method-override');

//Import ROUTERS
const registrationRouter = require('./routers/registration_routers');
const urlRouter = require('./routers/url_router');
const redirectionRouter = require('./routers/redirection_router');
const googleRouter = require('./routers/googleOAuth')
const userRouter = require('./routers/user_router')
const forgottenPasswordRouter = require('./routers/forgotten_password_router')

//Set Up Server
const app = express();
const PORT = 3001;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name:'session',
  keys: ['key1', 'key2'],
  maxAge: 60*60*1000*1
}));

app.set('view engine', 'ejs');

//Use all Routers
app.use('/', registrationRouter);
app.use('/urls', urlRouter);
app.use('/', redirectionRouter);
app.use('/', googleRouter)
app.use('/', userRouter)
app.use('/', forgottenPasswordRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});