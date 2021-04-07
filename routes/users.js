var express = require('express');
const bodyParser = require('body-parser');
var Users = require('../models/user');
var passport = require('passport');

const { Error } = require('mongoose');
var router = express.Router();
router.use(bodyParser.json());


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function (req, res, next) {
  Users.register(new Users({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        });
      }
    });
  // before using passport
  /* Users.findOne({ username: req.body.username })
    .then((user) => {
      console.log('User is: ' + user);
      if (user != null) {
        var err = new Error('User ' + req.body.username + ' already exists');
        err.status = 403;
        next(err);
      }
      else {
        return Users.create({
          username: req.body.username,
          password: req.body.password
        })
      }
    })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Registration Successful!', user: user });
    }, (err) => next(err))
    .catch((err) => next(err)); */

});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, status: 'You are Successfuly logged in!' });
});

// Before using passport 
/* router.post('/login', (req, res, next) => {
  if (!req.session.user) {

    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error('You are not authorized!');

      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var pass = auth[1];

    Users.findOne({ username: username })
      .then((user) => {
        if (username === null) {
          var err = new Error('User ' + username + ' does not exist');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 403;
          return next(err);
        }
        else if (user.password !== pass) {
          var err = new Error('Your passsword is incorrect');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 403;
          return next(err);
        }
        else if (user.username === username && user.password === pass) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated');
        }
      })
      .catch((err) => next(err));
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
}); */

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
