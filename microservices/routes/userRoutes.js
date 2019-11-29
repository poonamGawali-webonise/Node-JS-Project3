var express = require('express');
var userController=require('../controllers/userController');
var tokenVerify=require('../middleware/jwtTokenVerify');

module.exports=(function(){
    var router=express.Router();
    
   // restrict index for logged in user only
    router.get('/', userController.home);

    // route to register page
    router.get('/register', userController.register);

    // route for register action
    router.post('/register', userController.doRegister);

    // route to login page
    router.get('/login', userController.login);

    // route for login action
    router.post('/login', userController.doLogin);

    // route for logout action
    router.get('/logout', userController.logout);

    router.get('/users',tokenVerify.checkToken,userController.findAll);

    router.patch('/users/:id',userController.update);

    return router;
})();
