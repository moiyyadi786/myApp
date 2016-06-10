module.exports = function(mongoose, connection, autoIncrement, Schema, bcrypt){
//autoIncrement.initialize(connection);
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
return Book;
}