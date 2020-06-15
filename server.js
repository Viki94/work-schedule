var express = require("express");
var dotenv = require("dotenv").config();
var bodyParser = require("body-parser");
var logger = require("morgan");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
var path = require("path");
var db = require("./db/db.js")
var User = require("./models/user")

const jwt = require('jsonwebtoken');
const rp = require('request-promise');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(require("express-session")({
  secret: "Secret session!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//Body-Parser
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.get("/", autoRedirect, function (req, res) {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.use(express.static(__dirname + "/public"))

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  function (req, res) {
    res.redirect('/contributor');
  });

if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ "username": profile.displayName, "email": profile.emails[0].value }, function (err, user) {
        console.log("Current user already stored = " + user)
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }
        else {
          var newUser = new User();
          newUser.username = profile.displayName;
          newUser.email = profile.emails[0].value
          newUser.userType = "contributor";
          console.log("Storing new user to DB")

          newUser.save(function (err) {
            if (err) {
              throw err;
            }

            return done(null, newUser);
          });
        }
      });
    }
  ));
}

app.get('/auth/linkedin', passport.authenticate('linkedin', {
  failureRedirect: '/',
  scope: ['r_emailaddress', 'r_liteprofile']
}));

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/contributor',
  failureRedirect: '/'
}));

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_ID,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: process.env.LINKEDIN_CALLBACK,
  state: true
},
  function (accessToken, refreshToken, profile, done) {
    console.log(profile.photos[0].value)
    User.findOne({ "username": profile.name.givenName, "email": profile.emailAddress }, function (err, user) {
      console.log("Current user already stored = " + user)
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, user);
      }
      else {
        var newUser = new User();
        newUser.username = profile.name.givenName;
        newUser.email = profile.emailAddress;
        newUser.userType = "contributor";
        newUser.picture = profile.photos[0].value;
        console.log("Storing new user to DB")

        newUser.save(function (err) {
          if (err) {
            throw err;
          }

          return done(null, newUser);
        });
      }
    });
  }));

app.post("/register", function (req, res) {
  User.register(new User({
    username: req.body.username,
    email: req.body.email,
    userType: req.body.userType,
    groups: ["10"],
    picture: "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
  }),

    req.body.password, function (err, user) {
      if (err) {
        res.sendFile(path.resolve(__dirname, "public", "error.html"));
        console.log(err);
      }
      else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    })
});

app.post("/login", passport.authenticate("local", {
  failureRedirect: "/"
}), function (req, res) {
  reRoute(req, res);
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
}

function reRoute(req, res) {
  if (req.user.userType === "admin") {
    res.redirect("/admin");
  }
  else {
    res.redirect("/contributor");
  }
}

function autoRedirect(req, res, next) {
  if (req.isAuthenticated()) {
    reRoute(req, res);
  }
  else {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  }
}

app.get('/user', function (req, res) {
  res.send(req.user)
});

app.get("/login", function (req, res) {
  res.sendFile(path.resolve(__dirname, "public", "index.html"))
});

app.get("/register", function (req, res) {
  res.sendFile(path.resolve(__dirname, "public", "index.html"))
});

app.get("/admin", isLoggedIn, function (req, res) {
  if (req.user.userType === "admin") {
    res.sendFile(path.resolve(__dirname, "public", "index.html"))
  }
  else {
    res.sendFile(path.resolve(__dirname, "public", "notauth.html"))
  }
});

app.get("/admin/*", isLoggedIn, function (req, res) {
  if (req.user.userType === "admin") {
    res.sendFile(path.resolve(__dirname, "public", "index.html"))
  }
  else {
    res.sendFile(path.resolve(__dirname, "public", "notauth.html"))
  }
});

app.get("/contributor", isLoggedIn, function (req, res) {
  if (req.user.userType === "contributor") {
    res.sendFile(path.resolve(__dirname, "public", "index.html"))
  }
  else {
    res.redirect("/admin");
  }
});

app.get("/contributor/*", isLoggedIn, function (req, res) {
  if (req.user.userType === "contributor") {
    res.sendFile(path.resolve(__dirname, "public", "index.html"))
  }
  else {
    res.redirect("/admin");
  }
});

app.use(express.urlencoded({ extended: true }));
let topic;
let password;
let startTime;

const payload = {
  iss: process.env.ZOOM_API_KEY,
  exp: ((new Date()).getTime() + 5000)
};

const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);

app.post('/admin', (req, res) => {
  topic = req.body.topic;
  password = req.body.password;
  startTime = req.body.startTime;
  var userId = process.env.ZOOM_USER_ID;

  var options = {
    method: 'POST',
    uri: "https://api.zoom.us/v2/users/" + userId + "/meetings",
    body: {
      topic: topic,
      type: 2,
      start_time: startTime,
      duration: 60,
      timezone: "Europe/Sofia",
      password: password
    },
    auth: { 'bearer': token },
    headers: {
      'User-Agent': 'Zoom-api-Jwt-Request',
      'content-type': 'application/json'
    },
    json: true
  };

  rp(options)
    .then(function (response) {
      var result = {
        id: response.id,
        join_url: response.join_url,
        password: response.password,
        start_time: response.start_time,
        start_url: response.start_url,
        topic: response.topic,
        timezone : response.timezone
      }
      res.send(result);
    })
    .catch(function (err) {
      console.log('API call failed, reason ', err);
    });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

var routes = require('./controllers/db_controller.js');
app.use('/', isLoggedIn, routes);

app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "public", "404.html"))
})

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
