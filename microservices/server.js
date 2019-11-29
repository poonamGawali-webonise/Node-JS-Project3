//server.js

//var http = require('http')
var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

var dbConfig=require('./config/database.config');
const logger = require('./config/logger.config');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
mongoose.Promise = global.Promise;

const app = express();
const router = express.Router();

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

var User = require('./models/user.model');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(dbConfig.url,{}).then(()=>{
    logger.info("Connected to database.");
}).catch();

// app.post('/login',loginHandler.login);

var userRoutes = require('./routes/userRoutes');

app.use('/',router);
router.use('/',userRoutes);

module.exports=app.listen(3000,function(req,res){
    logger.info("Server is running at 3000 port..")
})