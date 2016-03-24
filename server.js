var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');

var app = express();
app.use(express.static(__dirname + '/www'));
var connection = mongoose.connect('mongodb://admin:admin@ds011439.mlab.com:11439/bookexchange');

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);


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

app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
  res.redirect('/index.html');
});
app.get('/books', function(req, res){
  Book.find({}, function(err, Books){
  	if(err){
  		throw err;
  	}
  	res.json(Books)
  });
});
app.post('/book/save', function(req, res){
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
  Book.findOne({bookId:req.params.bookId}, function (err, book) {
  if (err) throw err;
  res.json(book);
  });
});

app.listen(4568);
