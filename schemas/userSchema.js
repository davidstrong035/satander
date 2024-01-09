let mongoose = require("mongoose");
//let validator = require("validator");

let usersSchema = new mongoose.Schema({
	bio: {
		name: String,
		login: {
			username: {
				type: String,
				required: true,
				unique: true,
			},
			password: {
				type: String,
				required: true,
			}
		},
		phonenumber: Number,
		dob: {
			type: Date,
			required: true,
		},
		address: {
			street: String,
			city: String,
			state: String,
			country: String,
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		image: String
	},

	security: {
		qanda: {
			question: {
				type: String,
				required: true
			},
			answer: {
				type: String,
				required: true
			}
		},
		pin: {
			type: Number,
			required: true
		}
	},
	account: {
		accountno: Number,
		accounttype: String,
		accountbalance: Number,
		currency: String,
		accountofficer: String,
		accountofficercode: String,
		accountofficeremail: String,
		isactive: {
			type: Boolean,
			default: false
		}
	},
	status: {
		activated: Boolean,
		restricted: Boolean,
		message: String,
		progress: Number
	},
	kin: {
		kinname: String,
		kinnumber: Number,
		kinaddress: String,
		kin_city: String,
		kin_state: String,
		kin_country: String
	},
	history:[
		{
			Transactiondate: Date,
			Transactiontype: String,
			Transfertype: String,
			Amount: Number,
			person: String,
			Accountno: String,
			Bank: String
		}
	]
		
}, {minimize: false})


module.exports = mongoose.model("users", usersSchema) 