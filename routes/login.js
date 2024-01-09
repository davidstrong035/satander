//Set up
let express = require("express");
let router = express.Router();

let userModel = require("../schemas/userSchema");


router.post("/login", function(req, res){

	uname = trimString(req.body.one);
	pwd = trimString(req.body.two)

	userModel.find({"bio.login.username": uname}, function(err, user){
		if(err){
			console.log("An error occured");
			console.log(err);
			res.send({"error": " There was an error processing your request."})
		}else{
			if(user.length > 0){
				//console.log(user);
				if((uname == user[0].bio.login.username) && (pwd == user[0].bio.login.password)){
					res.send({"username": uname, "password": pwd, "name": user[0].bio.name, "time": user[0].timestamp});
					console.log("User found")
				} else{	
					res.send({"error": "Your username and/or password isn't correct. Please try again"})
				}
			} else{
				//console.log("User not registered");
				res.send({"error": " " + uname+" isn't registered on our database"})
			}
		}
	})
});


trimString = (string) => string.trim();

 
module.exports = router;