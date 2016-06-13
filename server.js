var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');
var app = express();
app.use(express.static(__dirname + '/www'));
var connection = mongoose.connect('mongodb://admin:admin@ds011439.mlab.com:11439/bookexchange');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);
var User = require('./model/user-model')(mongoose, connection, autoIncrement, Schema, bcrypt);
var Message = require('./model/message-model')(mongoose, connection, autoIncrement, Schema);
var Book = require('./model/book-model')(mongoose, connection, autoIncrement, Schema);
var BookUser = require('./model/book-user-model')(mongoose, connection, autoIncrement, Schema);
var transporter = require('./util/mail-util');
var appUtil = require('./util/app-util');
// create reusable transporter object using the default SMTP transport

config = {
  'secret': 'bookexchangewebauthentication',
};

app.set("secret", config.secret);


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
      name: req.body.name
    });
    // save the user
    newUser.save(function(err) {
      console.log(err);
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      var token = jwt.sign(user, app.get('secret'), {
          expiresIn: '1h' // expires in 24 hours
      });
      app.user = newUser;
          // return the information including token as JSON
      var mailOptions = {
          from: 'eExchangeBookAdmin', // sender address
          to: req.body.username, // list of receivers
          subject: 'Exchange Book Registration', // Subject line
          html: 'Hi '+ req.body.name +', <br><br>You registration with Exchange Book is successfull!!.<br><br> Regards,<br>Admin.' // html body
      };
      appUtil.sendEmail(mailOptions);
      res.json({success: true, token: token});
    });
  }
});
 

app.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    username: req.body.username
  }, '-__v', function(err, user){

  if (err) throw err;
  if (!user) {
    res.json({ success: false, message: 'Authentication failed. User not found.'});
  } else if (user) {
    user.comparePassword(req.body.password, function (err, isMatch) {
      console.log(isMatch);
      console.log(err);
      if(isMatch && !err) {
      var token = jwt.sign(user, app.get('secret'), {
        expiresIn: '1h' // expires in 24 hours
      });
      res.json({
        success: true,
        message: 'user authenticated',
        token: token
      });
      app.user = user;   
      } else {
       res.send({success: false, msg: 'Authentication failed. Wrong password.'});
      }
    });
   }
  });
});

app.get('/', function(req, res){
  if(!app.token || app.token !== req.headers.authorization){
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
  res.redirect('/index.html');
});
app.get('/books', function(req, res){
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


var apiRoutes = express.Router(); 
// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.headers.authorization;
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('secret'), function(err, decoded) {      
      if (err) {
        res.status(403).send({ 
          success: false
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        app.user = decoded._doc;   
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
apiRoutes.get('/mybooks', function(req, res){
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
  }
});
apiRoutes.post('/book/save', function(req, res){
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
apiRoutes.get('/book/:bookId', function(req, res){
  //var getBookDetails = function(callback) {
  async.parallel([
    function(cb) { 
      //collection1.find(query1, cb) 
      Book.findOne({bookId:req.params.bookId},'-_id -__v')
      .populate('postedBy', '-_id -password -__v')
      .exec(function(err, book) {
      if (err) throw err;
      cb(null, book);
      });
    },
    function(cb) { 
      //collection2.find(query2, cb)
      BookUser.findOne({bookId: req.params.bookId,userId: app.user.userId})
      .exec(function(err, bookUser) {
      if (err) throw err;
      cb(null, bookUser)
      });
    },
    function(cb){
      Message.count({bookId: req.params.bookId}, function(err, count){
       if (err) throw err;
        cb(null, count);
        console.log("the count "+count);   
      });
    }
    ], function(err, response) {
      if (err) throw err;
      res.json(response);
      // something went wrong
    });

});
apiRoutes.post('/addbooktouser', function(req, res){
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
apiRoutes.post('/message/send', function(req, res){
  var message = new Message({
    bookId: req.body.bookId,
    message: req.body.message
  });
  message.save(function(err){
  if(err){
    throw err;
  }
  Book.findOne({bookId:req.body.bookId},'bookName postedBy')
      .populate('postedBy', 'username')
      .exec(function(err, book) {
      if (err) throw err;
      console.log(book);
    var mailOptions = {
    from: 'eExchangeUser', // sender address
    to: book.postedBy.username, // list of receivers
    subject: 'Interested in your posting for ' + book.bookName, // Subject line
    html: req.body.message.replace(/[\n\r]/g, '<br>')
  };
  appUtil.sendEmail(mailOptions, function(error, info){
   if(error){
    console.log(error);
    res.json({
    "message": "Error sending your message"
    });
    return;  
   }
   res.json({
    "message": "You message have been sent"
   });
  });
 });
});
});
apiRoutes.get('/messages/book/:bookId', function(req, res){
  var o = {};
  o.map = function(){ 
      emit(this.bookId,{
        messageId: this.messageId,
        message: this.message.replace(/[\n\r]/g, '<br>'),
        creationDate: this.creationDate
      });
  };
  o.reduce = function(key, values){
    var messages = [];
    for(var i=0;i<values.length;i++){
      messages.push(values[i]);
    }
    return {messages: messages};
  };
  o.query = {bookId: req.params.bookId};
  var startTime = Date.now();
  var date = new Date();
  Message.mapReduce(o, function(err, result){
     //console.log(result[0].value);
      res.json(result[0].value);
  });
});

apiRoutes.delete('/message/:messageId', function(req, res){
  Message.remove({messageId: req.params.messageId}, function(err){
    if(err){
      throw err;
    }
    res.json({message: 'success'});
  })
});
app.listen(process.env.PORT || 9000);