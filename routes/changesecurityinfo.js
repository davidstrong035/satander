//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");


var returnObject = {"error": "", "success": ""};

const executeUpdate = (req, update) => {
	userModel.where({"bio.login.username": req.body.user})
		.updateMany(update, function(err, count){
			if(err){
				console.log(err);
				returnObject.error += `Couldn't update ${req.body.whichField}, please try again.`
			}else{
				returnObject.success += `${req.body.whichField.replace(/^./, req.body.whichField[0].toUpperCase())} has been successfully updated.`
			}
		});
}

router.post("/changesecurityinfo", function(req, res){

	console.log(req.body);

	var update = {}

	switch(req.body.whichField){
		case 'password':
			update = {$set: {"bio.login.password": req.body.fieldValue}}
			executeUpdate(req, update);
			break;

		case 'pin':
				update = {$set: {"security.pin": req.body.fieldValue}}
				executeUpdate(req, update);
				break;

		case 'question':
		console.log("in here");
			let { question, answer } = req.body.fieldValue;
			console.log(question, answer);
			update = {$set:
				{
					"security.qanda.question": question,
					"security.qanda.answer": answer
				}
			}
			executeUpdate(req, update);
			break;

		default:
			returnObject.error += `Your request wasn't understood, please try again.`
			return res.send(returnObject)
	}

	setTimeout(()=> res.send(returnObject), 2000);

});


module.exports = router;
