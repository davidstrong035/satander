//Set up
let express = require("express");
let router = express.Router();

let userModel = require("../schemas/userSchema");


const { trim } = require('express-validator').validator;

router.get("/profile/:user", function(req, res){ 
	console.log("inside");
	//let check = req.params();
	userModel.find({"bio.login.username": req.param("user")})
		.then(data=> {
			//console.log(data)
			res.send(data);
		})
		.catch(err=> res.send({"error": "There's an issue with the server."}))
});



module.exports = router;