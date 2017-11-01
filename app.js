const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const cors = require('cors');
const morgan = require('morgan');
const ejs = require('ejs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient: true,});
let db = mongoose.connection;

//Check connection
db.once('open',function() {
  console.log('Conneted to MongoDB');
});
//Check for db Errors
db.on('error',function(err){
  console.log(err);
});

const app = express();

app.set('port', (process.env.PORT || 3000));

//MORGAN Middleware
app.use(morgan('dev'));

//CORS Middleware
app.use(cors());

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//set Public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json());

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

    while (namespace.length) {
      formParam +='['+ namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Login
app.get('/login', function(req, res){
	res.render('login');
});

const user = require('./routes/user');
app.use('/user',user);
//Authenticate Globally
app.use(function(req, res, next){
  if(req.isAuthenticated()) next();
  else res.redirect('/login');
});

const index = require('./routes/index');
const sale = require('./routes/sale');
const vendor = require('./routes/vendor');
const settings = require('./routes/settings');
const products = require('./routes/products');
app.use('/',index);
app.use('/sale',sale);
app.use('/vendor',vendor);
app.use('/settings',settings);
app.use('/products',products);



//Start Server
app.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port')+'....');
});
