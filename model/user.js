module.exports = function(mongoose, connection, autoIncrement, Schema, bcrypt){
//autoIncrement.initialize(connection);
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
  },
  creationDate: {type: Date, default: Date.now},
  updatedDate: {type: Date, default: Date.now}
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
//module.exports = User;
return User;
}