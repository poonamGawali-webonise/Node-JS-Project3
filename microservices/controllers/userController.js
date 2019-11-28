var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user.model");

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.sendFile('index.html', {root: __dirname })
};

// Go to registration page
userController.register = function(req, res) {
//   res.render('register');
    res.sendFile('register.html', {root: __dirname })
};

// Post registration
userController.doRegister = function(req, res) {
        User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
            if (err) {
              res.sendFile('register.html', {root: __dirname })
            }
            passport.authenticate('local')(req, res, function () {
              res.redirect('/');
            });
          });
};

// Go to login page
userController.login = function(req, res) {
  res.sendFile('login.html', {root: __dirname })
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.sendFile('home.html', {root: __dirname })
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;