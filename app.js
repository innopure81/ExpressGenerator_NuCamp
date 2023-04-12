var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const session = require('express-session');
//const FileStore = require('session-file-store')(session); //The first class fuction will take in the (session) parameter.
const passport = require('passport');
//const authenticate = require('./authenticate');
const config = require('./config');

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const campsiteRouter = require('./routes/campsiteRouter');
const partnerRouter = require('./routes/partnerRouter');
const promotionRouter = require('./routes/promotionRouter');
const uploadRouter = require('./routes/uploadRouter');

//To set up a connection between Express server and MongoDB database wrapped w/ mongoose schema
const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(()=>console.log('Connected correctly to server'),
err=>console.log(err)
);

//To set REST API server w/ Express generator
var app = express(); 
app.all('*', (req, res, next)=>{ //'*': To catch every request to any paths on server
    if(req.secure){
      return next();
    }else{
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);//HTTP 301: Moved Permanently
    }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));
/*app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false, //To prevent empty sessions and cookies from being set up
  resave: false, //To keep the session marked as active thru multiple requests
  store: new FileStore()
})); */

app.use(passport.initialize()); //To check incoming reqs from session-based authentication
//app.use(passport.session()); //To check if there's existing session for the client

app.use('/', indexRouter);
app.use('/users', usersRouter);

/*function auth(req, res, next){
  console.log(req.user);//The session data is loaded into the request as 'req.user'
  
  if(!req.user){
    const err = new Error('You are not authenticated!');
    err.status = 401;
    return next(err);    
  }else{ 
      return next(err);
  }
}

app.use(auth); */

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsiteRouter);
app.use('/partners', partnerRouter);
app.use('/promotions', promotionRouter);
app.use('/imageupload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
