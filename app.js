var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var athenticate = require('./authenticate');
var config= require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promotionRouter = require('./routes/promotionRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const { ProxyAuthenticationRequired } = require('http-errors');
/* const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders'); */

//const url = 'mongodb://localhost:27017/conFusion';
const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));

// we are using token with password and no session
/* app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
 */
app.use(passport.initialize());
//app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// before using passport with token
/* function auth(req, res, next) {
  if (!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err);
  }
  else {
    next();
  }
} */

// before using passport for authentication
/* function auth(req, res, next) {
  // console.log(req.headers);
  console.log(req.session);

  //console.log(req.signedCookies);
  //if (!req.signedCookies.user) {
  if (!req.session.user) {
    var err = new Error('You are not authenticated!');
    err.status = 401;
    return next(err);
  }
  else {
    //if (req.signedCookies.user === 'admin') {
    if (req.session.user === 'authenticated') {
      next();
    }
    else {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      next(err);
    }
  }
} */

// before using passport with token
//app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
