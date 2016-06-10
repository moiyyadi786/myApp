module.exports = function(mongoose, connection, autoIncrement, Schema, bcrypt){
//autoIncrement.initialize(connection);
var MessageSchema = new Schema({
  message: {
        type: String,
        required: true
    },
  bookId: {type: Number, required: true},
  postedBy: {type: Schema.Types.ObjectId, ref: 'User'},
  creationDate: {type: Date, default: Date.now},
  updatedDate: {type: Date, default: Date.now},
});

MessageSchema.plugin(autoIncrement.plugin, { model: 'Message', field: 'messageId'});
var Message = connection.model('Message', MessageSchema);

return Message;
}