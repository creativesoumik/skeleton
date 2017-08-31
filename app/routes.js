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


  //removed because signup is done using passport authentication

  // app.get('/:username/:password', (req, res) => {
  //   var newUser = new User();
  //   newUser.local.username = req.params.username;
  //   newUser.local.password = req.params.password;
  //
  //   console.log(newUser.local.username + " > " + newUser.local.password);
  //
  //   newUser.save((e) => {
  //     if (e) {
  //       throw e;
  //     }
  //     res.send('Success');
  //   })
  // });


  // Redirect the user to Facebook for authentication.  When complete,
  // Facebook will redirect the user back to the application at
  //     /auth/facebook/callback
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  // Facebook will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  app.use('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/profile',
                                        failureRedirect: '/' }));



};

var isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
