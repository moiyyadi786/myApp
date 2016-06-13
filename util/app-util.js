var transporter = require('./mail-util');
var appUtil = {
	sendEmail: function(mailOptions, callback){

	// send mail with defined transport object
	//console.log(transporter);
		transporter.sendMail(mailOptions, function(error, info){
		    if(callback){
		      return callback(error, info);
		    }
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		});
	}
}
module.exports = appUtil;