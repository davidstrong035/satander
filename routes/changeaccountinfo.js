//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");



router.post("/changeaccountinfo", function(req, res){

	var newemail = req.body.newemail;
	let newphone = req.body.newphone;
	var oldemail = req.body.oldemail;
	var oldphone = req.body.oldphone
	

	var returnObject = {"error": "", "success": ""};

	if((newphone != oldphone) && (newphone != "")){
		userModel.where({"bio.login.username": req.body.user})
			.update({$set: {"bio.phonenumber": newphone}}, function(err, count){
				if(err){
					console.log(err);
					returnObject.error += "<br />Couldn't update your phone number, please try again."
				}else{
					returnObject.success += "<br />Your Phone number has been changed."
				}
			});
	}


	if((newemail != oldemail) && (newemail != "")){
		userModel.where({"bio.login.username": req.body.user})
			.update({$set: {"bio.email": newemail}}, function(err, count){
				if(err){
					//console.log(err);
					returnObject.error = "Couldn't update your email address, please try again."
				} else{
					returnObject.success = "Your email address has been changed"
				}
			});
	}

	setTimeout(()=> res.send(returnObject), 2000);

});


module.exports = router; 