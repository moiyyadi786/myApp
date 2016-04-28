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
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
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
  name: {
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
  creationDate: {type: Date, default: Date.now},
  updatedDate: {type: Date, default: Date.now},
  postedBy: {type: Schema.Types.ObjectId, ref: 'User'}
});

bookSchema.plugin(autoIncrement.plugin, { model: 'Book', field: 'bookId' });
var Book = connection.model('Book', bookSchema);

var bookUserSchema = new Schema({
  bookId: Number,
  userId: Number,
  interestType: String,
  creationDate: {type: Date, default: Date.now},
  updatedDate: {type: Date, default: Date.now},
  postedBy: {type: Schema.Types.ObjectId, ref: 'User'}
});

bookUserSchema.plugin(autoIncrement.plugin, { model: 'BookUser', field: 'bookUserId'});

var BookUser = connection.model('BookUser', bookUserSchema); 

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
      //_id: req.body.username,
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      creationDate: {type: Date, default: Date.now},
      updatedDate: {type: Date, default: Date.now},
    });
    // save the user
    newUser.save(function(err) {
      console.log(err);
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      app.token = jwt.encode(newUser, config.secret);
      app.user = newUser;
          // return the information including token as JSON
      res.json({success: true, token: app.token});
    });
  }
});
 

app.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username
  }, '-__v',function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {

          user.password = null;
          app.user = user;
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
  /*if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }*/
  var findObj = {};
  if(req.query.search){
    var re = new RegExp(req.query.search, 'i');
    findObj = {"bookName": re};
    console.log(findObj);
  }
  Book.find(findObj,'-_id -__v', function(err, Books){
  	if(err){
  		throw err;
  	}
  	res.json(Books)
  });
});
app.get('/mybooks', function(req, res){
  if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
  //var user = new ObjectId.createFrom(app.user._id);
  if(req.query.type === "postings"){
  Book.find({'postedBy': ObjectId(app.user._id)},'-_id -__v')
  .populate('postedBy', '-_id -password -__v')
  .exec(function(err, Books){
    if(err){
      throw err;
    }
    //console.log(Books);
    res.json(Books)
  });
  } else {
   BookUser.find({userId: app.user.userId}, 'bookId')
   .exec(function(err, Books){
      if(err){
        throw err;
      }    
    var interested = Books.map(function(book) {return book.bookId;});
    Book.find(
      {'bookId':
        { $in: interested
        }
      }).exec(function(err, Books){
          if(err){
            throw err;
          }
        res.json(Books)  
      })
    });
  /* Book.aggregate([
       {
         $match: { 
          'bookId':{
          $in: BookUser.find(
            {
              "userId": app.user.userId
            }, 'bookId')
            /*BookUser.find(
              {
                'postedBy': ObjectId(app.user._id)
              }, 'bookId')
            }
           }
         }
      ], callback);*/
  }
});
app.post('/book/save', function(req, res){
  if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
  var book = new Book({
  	bookName: req.body.bookName,
  	orderType: req.body.orderType,
  	description: req.body.description,
    postedBy: app.user._id
  });
  book.save(function(err){
  	if(err){
  		throw err;
  	}
  	res.json({bookName: req.body.bookName});
  });
});
app.get('/book/:bookId', function(req, res){
  /*if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }*/
  if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }

  //var getBookDetails = function(callback) {
    async.parallel([
    function(cb) { 
      //collection1.find(query1, cb) 
      Book.findOne({bookId:req.params.bookId},'-_id -__v')
      .populate('postedBy', '-_id -password -__v')
      .exec(function(err, book) {
      if (err) throw err;
       console.log("Below is the book \n"+book);
      cb(null, book);
      });
    },
    function(cb) { 
      //collection2.find(query2, cb)
      BookUser.findOne({bookId: req.params.bookId,userId: app.user.userId})
      .exec(function(err, bookUser) {
      if (err) throw err;
      console.log("Below is the book user \n"+bookUser);
      cb(null, bookUser)
      });
    }
    ], function(err, response) {
      if (err) throw err;
      res.json(response);
      // something went wrong
    });

});
app.post('/addbooktouser', function(req, res){
  if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
  var bookUser = new BookUser({
    bookId: req.body.bookId,
    userId: app.user.userId,
    postedBy: app.user._id,
    interestType: req.body.interestType
  });
  bookUser.save(function(err){
    if(err){
      throw err;
    }
    res.json({
      "message": "Added to you interest tab",
     "bookId": req.body.bookId
   });
  });
});
app.listen(process.env.PORT || 9000);
