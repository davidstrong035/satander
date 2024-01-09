let mongoose = require("mongoose");
//let validator = require("validator");

let usersSchema = new mongoose.Schema({
	time: Date
		
}, {minimize: false})



module.exports = mongoose.model("users", usersSchema) 