var User = require('./models/user');

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.render('index.ejs');
  });

  app.get('/login', (req, res) => {
    res.render('login.ejs', {message: req.flash('loginMessage')});
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/logout', (req, res) => {
    req.logout(); //passport adds function adds to express
    res.redirect('/');
  });

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {user: req.user });
  });

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: req.flash('signupMessage')});
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/:username/:password', (req, res) => {
    var newUser = new User();
    newUser.local.username = req.params.username;
    newUser.local.password = req.params.password;

    console.log(newUser.local.username + " > " + newUser.local.password);

    newUser.save((e) => {
      if (e) {
        throw e;
      }
      res.send('Success');
    })
  });
};

var isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
