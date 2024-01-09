//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");



router.post("/allowtransfer", function(req, res){ 

	//Update the processing field in the database
	userModel.where({"bio.login.username": req.body.three})
		.update({$set: {"status.restricted": req.body.one, "status.message": req.body.two, "status.progress": req.body.four}}, function(err, count){
			if(err) console.log("Couldn't process operation");
			console.log("Count is: " + count);
			console.log("Updated balance");
			res.send({"success":"Message sent successfully!"});
		});
});


module.exports = router; 