var express = require('express');
var app = express();
var port  = process.env.PORT || 3000;

var cookieParser = require('cookie-parser');
var session = require('express-session');

var morgan = require('morgan');
var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var passport = require('passport');
var flash = require('connect-flash');



mongoose.Promise = global.Promise;
var configDB = require('./config/database');
mongoose.connect(configDB.url, {
  useMongoClient: true,
  /* other options */
});
require('./config/passport')(passport);

//express middleware setups - process each on sequential basis
app.use(morgan('dev')); //dev envrionment
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'Any string or text', //Keycode for cookies - any string or text
  saveUninitialized: true, //app crash return user profile
  resave: true // even nothing changed still save it
}));

app.use(passport.initialize());
app.use(passport.session()); //passport uses the previous export session. Make sure to call this line after requiring passport

app.use(flash());

app.set('view engine', 'ejs');


require('./app/routes')(app, passport);

app.listen(port, (e) => {
  if (e) {
    console.log(e);
  } else {
    console.log('Server is running on port '+ port);
  }
});





























/**/
