module.exports = function(mongoose, connection, autoIncrement, Schema, bcrypt){
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
return BookUser;
}