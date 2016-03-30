var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');
var passport = require('passport');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var JwtStrategy = require('passport-jwt').Strategy;
var jwt = require('jwt-simple');
var app = express();
app.use(express.static(__dirname + '/www'));
var connection = mongoose.connect('mongodb://admin:admin@ds011439.mlab.com:11439/bookexchange');

config = {
  'secret': 'secret',
};

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

var UserSchema = new Schema({
  username: {
        type: String,
        unique: true,
        required: true
    },
  password: {
        type: String,
        required: true
    },
  firstname: {
    type: String
  }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'userId'});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
 
var User = connection.model('User', UserSchema);
module.exports = User;
module.exports = function(passport){
var opts = {};
opts.secretOrKey = config.secret;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    //console.log(jwt_payload);
    User.findOne({username: jwt_payload.username}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
}



/*var CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

CounterSchema.plugin(autoIncrement.plugin, 'Counter');
var Counter = mongoose.model('Counter', CounterSchema);
*/
// create a schema
var bookSchema = new Schema({
  bookName: String,
  orderType: String,
  description: String,
  created_at: Date,
  updated_at: Date
});

bookSchema.plugin(autoIncrement.plugin, { model: 'Book', field: 'bookId' });

var Book = connection.model('Book', bookSchema);

module.exports = Book;
app.use(morgan('dev'));
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true,
                  secret: 'secret' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname
    });
    // save the user
    newUser.save(function(err) {
      console.log(err);
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      app.token = jwt.encode(newUser, config.secret);
          // return the information including token as JSON
      res.json({success: true, token: app.token});
    });
  }
});
 

app.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username
  }, '-_id -__v',function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {

          user.password = null;
          console.log(user);
          // if user is found and password is right create a token
          app.token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: app.token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

app.get('/', function(req, res){
  if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
  res.redirect('/index.html');
});
app.get('/books', function(req, res){
  if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
  Book.find({},'-_id -__v', function(err, Books){
  	if(err){
  		throw err;
  	}
  	res.json(Books)
  });
});
app.post('/book/save', function(req, res){
  if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
  var book = new Book({
  	bookName: req.body.bookName,
  	orderType: req.body.orderType,
  	description: req.body.description
  });
  book.save(function(err){
  	if(err){
  		throw err;
  	}
  	res.json({bookName: req.body.bookName});
  });
});
app.get('/book/:bookId', function(req, res){
  if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
  Book.findOne({bookId:req.params.bookId}, function (err, book) {
  if (err) throw err;
  res.json(book);
  });
});

app.listen(process.env.PORT || 9000);
