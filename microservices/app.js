const express = require('express');
const passport = require('passport');
cookieParser = require('cookie-parser'),
cookieSession = require('cookie-session');

const app = express();

const GoogleStrategy = require('passport-google-oauth20');

const CLIENT_ID = "1072696920237-2lago52pkqcrb0nr22dlv2kjgdeummft.apps.googleusercontent.com";
const CLIENT_SECRET = "gp9SGtbw0SNEC3F9xpH-iQmC";
const REDIRECT_URL = "http://localhost:5000/auth/google/callback"


app.use(cookieSession({
    name: 'session',
    keys: ['123'],
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}));
app.use(passport.initialize());
// app.use(cookieParser());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: REDIRECT_URL
},
(token, refreshToken, profile, done) => {
    console.log("token :",token);
    console.log("profile :",profile);
    return done(null, {
        profile: profile,
        token: token
});
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You must login!');
    }
}

// Routes
app.get('/', (req, res) => {
    // res.render('index.html');
    res.sendFile('index.html', {root: __dirname })
});

// passport.authenticate middleware is used here to authenticate the request
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile'] // Used to specify the required data
}));

// The middleware receives the data from Google and runs the function on Strategy config
app.get('/auth/google/callback', passport.authenticate('google',{ failureRedirect: '/auth/google' }), (req, res) => {
    res.redirect('/secret');
});

// Secret route
app.get('/secret', isUserAuthenticated, (req, res) => {
    res.send('You have reached the secret route');
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout(); 
    res.redirect('/');
});

app.listen(5000, () => {
    console.log('Server Started at 5000!');
});