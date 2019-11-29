var mongoose = require("mongoose");
var passport = require("passport");
const jwt = require('jsonwebtoken');
var User = require("../models/user.model");
var util = require('util');

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.sendFile('index.html', {root: __dirname })
};

// Go to registration page
userController.register = function(req, res) {
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
      let user = req.body.username;
      const token = jwt.sign(user, 'your_jwt_secret');
      res.setHeader('Authorization', 'Bearer '+token)
    res.sendFile('home.html', {root: __dirname })
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.sendFile('register.html', {root: __dirname })
};

userController.findAll = (req,res)=>{
    User.find(function(err,user){
        console.log("User :",user)
        res.json(user);
    })
}

userController.update = (req,res) =>{
    if(Object.keys(req.body).length > 0){
      User.findByIdAndUpdate(req.params.id,req.body,{new:true},function(err,user){
        if(!util.isNullOrUndefined(user)){
          res.status(200).json({"status":200,"message":"User updated successfully","data":user});
        } else{
          res.status(404).json({"status":404,"message":"User not found with ID "+req.params.id});
        }
      });
    } else{
      res.status(400).json({'status':400,'message':'User content can not be empty'});
    }
}

module.exports = userController;