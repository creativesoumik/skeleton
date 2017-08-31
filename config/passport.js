var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/models/user');
var configAuth = require('./auth');



module.exports = (passport) => {

  //serialize user : take a user object and find the minimal info which is the id which should be stored in the session
  passport.serializeUser((user, done)=>{
		done(null, user.id);
	});

  //deserialize user: take a user info like the id field and get all user info from the db
  passport.deserializeUser((id, done)=>{
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

  //creating a passport strategy name which we use in route.js
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email', // form field name from views file
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    process.nextTick(() => {

      User.findOne({'local.username': email},(err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email already taken')); // false is to send arg to passport that user is not authenticated
        } else {
          var newUser = new User();
					newUser.local.username = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
        }
			});

    });
  }));

  //creating a passport strategy name which we use in route.js
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email', // form field name from views file
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({'local.username': email}, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, req.flash('loginMessage', 'No user found'));// false is to send arg to passport that user is not authenticated
        }
        if (!user.validPassword(password)) { // using the bcrypt method defined in user.js
          return done(null, false, req.flash('loginMessage', 'Invalid password'));// false is to send arg to passport that user is not authenticated
        }

        return done(null, user);


      });
    });
  }));


  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
  	clientSecret: configAuth.facebookAuth.clientSecret,
  	callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'email', 'name']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);

    process.nextTick(() => {
      User.findOne({'facebook.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
	    				var newUser = new User();
	    				newUser.facebook.id = profile.id;
	    				newUser.facebook.token = accessToken;
	    				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	    				newUser.facebook.email = profile.emails[0].value;

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})

	    			}
	    		});
    });
  }
  ));



}
