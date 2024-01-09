//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");



router.post("/adminacctinfo", function(req, res){ 
	console.log(req.body);
	
	//Update the processing field in the database
	userModel.where({"bio.login.username": req.body.one})
		.update({$set: {"account.accountno": req.body.two, "account.currency": req.body.three, "account.accountofficer": req.body.four, "account.accountofficercode": req.body.five, "account.accountofficeremail":req.body.six, "account.isactive": true}}, function(err, count){
			if(err) console.log("Couldn't Update balance");
			//console.log("Updated balance");
		});
		
		
	res.send({"success":"Message sent successfully!"}); 
});


module.exports = router; 