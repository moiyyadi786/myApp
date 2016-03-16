var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/www'));

app.get('/', function(req, res){
  res.redirect('/index.html');
});
app.post('/book/save', function(req, res){
  //var book = JSON.parse(body);
  res.json(req.body);
});
app.listen(8100);
