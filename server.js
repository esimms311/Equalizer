var express = require('express');
var session = require('express-session');
var passport = require('passport');
var facebookStrategy = require('passport-facebook');
var bodyParser = require('body-parser');
var massive = require('massive');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var config = require('./config');
// var config = require('./config');

// var port = 4000;

var app = express();
// var app = express();
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}))
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// Connects to Postgres
// var db = massive.connectSync({
//     connectionString: 'postgres://postgres:postgres@localhost/Equalizer'
// });

//Facebook Strategy
passport.use('facebook', new facebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: "http://localhost:5000/auth/facebook/callback",
  profileFields: ['id', 'diplayName', 'emails']
},
  function(accessToken, refreshToken, profile, done) {
    console.log(profile.emails[0].value);
    db.getUserByFAcebookId([profile.id], function(err, user) {
      if (!user.length) {
        console.log("Creating USER");
        db.createUserFacebook([profile.displayName, profile.id], function(err, newUser) {
          return done(err, newUser[0], {
            scope: 'all'
          });
        })
      } else {
        return done(err, user[0]);
      }
    })
  }))

passport.serializeUser(function(user, done) {
  return done(null, user);
})
passport.deserializeUser(function(user, done) {
  if(user.googleid) {
    db.getUserByGoogleId([user.googleid], function(err, us) {
      return done(null, us[0]);
    })
  } else {
    db.getUserByFacebookId([user.facebookid], function(err, u) {
      return done(null, u[0]);
    })
  }
})

//Send to facebook to sign in
app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope:['email']
  }))

//redirect after successful sign-in
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.status(200).redirect('/#/');
  })

  app.get('/logout', function(req, res) {
    req.session.destroy(function() {
      res.redirect('/')
    })
  })

app.get('/verifyuser', function(req, res) {
  if(!req.session.passport) {
    console.log('test');
    res.status(200).json('')
  } else {
    res.json(req.session.passport.user)
  }
})

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
