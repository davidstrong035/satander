//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");

function sendAlert(name, bool, email, req, cur, balance, date){
	date = new Date(date);
	//console.log("Date of transaction is: " + date);
	if(bool == 'yes'){
		//Generate test SMTP Service account from ethereal.email
		//Only needed if you don't a real mail account for testing

			nodemailer.createTestAccount((err, account) => {
				// Create reusable transporter object using the default
				// SMTP transporter
				let transporter = nodemailer.createTransport({
						host: 'mail.ghcom-b.com',
						secureConnection: true,
						port: 465,
						tls: {
							rejectUnauthorized:false
						},
						auth: {
							user: 'noreply@ghcom-b.com',	// Generated eheereal User
							pass: '5jG17zO2!(FJhr'	// Generated etheral pass
						}
					});


				let now = date;
				let mailOptions = {
				from: '"GCB" <info@ghcom-b.com>',
				to: email,
				subject: 'Credit alert',
				html: `
					<div style="font-family: arial; font-size: 13px; padding: 10px; width: 800px; margin: 0 auto">

						 <img src="https://i.ibb.co/FBSKCwf/logo.png" style="height: 80px"/>
						<h4 style="text-decoration: underline; font-weight: bold">
							GCB Electronic Notification Service
						</h4>
						<hr>

						<p> Hello ${name} </p>
						<p> Please be informed that a Credit transaction just occurred on your bank account. Please find details of the transaction below: </p>

						<p><strong> Account Number:</strong> ${req.three.toString().substr(0, 5)}***** </p>
						<p><strong> Account Name:</strong>  ${req.four} </p>
						<p><strong> Transaction Branch:</strong>  HeadQuarters</p>
						<p><strong> Transaction Amount:</strong>  ${cur}${req.two.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} </p>
						<p><strong> Transaction Date:</strong>  ${req.five} </p>

						<p>
							As a result of this transaction, the balance on this account reads: <br />
							<strong> Available Balance:</strong> &nbsp; ${cur}${balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
						</p>


						<p> Thank you for banking with us. </p>
						<p style="font-size: 10px">
							Never Disclose your Internet Banking Password, ATM Card Number and Pin or online security code to anyone. Ghana Commercial Bank will never ask you to disclose any of the above. If you receive any of such request through the website, kindly disregard such and contact Ghana Commercial Bank through info@bankliverpool.com
						</p>

						<sub>NOTE</sub>
						<p style="font-size: 8px">
							This is an automated Transaction Alert Service. You are getting this email because a transaction just occured in your account that met the threshold you set. Please DO NOT reply this mail. Kindly contact Ghana Commercial Bank should you require additional information.
						</p>
						<div style="border: 1px dotted gray; margin-top:20px; border-bottom: 0; padding:10px; font-size: 11px;">
							<p> Thank you For banking with Ghana Commercial Bank, the bank that knows all your needs even before you ask. </p>
						</div>
					</div>
					`
				};

				// Send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) =>{
					if(error){
						return console.log(error);

					}
					//console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

					console.log("(Confirmation) Message Sent: %s", info.messageId);
				});
			});
	}
}


router.post("/creditacct", function(req, res){
	var newHistory = {
		Transactiondate: req.body.five,
		Transactiontype: req.body.bound,
		Transfertype: req.body.transtype,
		Amount: req.body.two,
		person: req.body.four,
		Accountno: req.body.three.toString().substr(0, 5) + "*****",
		Bank: req.body.bnkname
	};
	console.log(req.body)

	userModel.find({"bio.login.username": req.body.one})
		.then(data=> {
			//console.log(data);
			var oldBalance = eval(data[0].account.accountbalance);
			var newBalance = oldBalance + req.body.two;

			//Update the processing field in the database
			userModel.where({"bio.login.username": req.body.one})
				.updateOne({$set: {"account.accountbalance": newBalance}}, function(err, count){
					if(err) console.log("Couldn't Update account balance");

					userModel.find({"bio.login.username": req.body.one})
						.then(data=> {
							//console.log(data[0].bio.email);
							sendAlert(data[0].bio.name, req.body.six, data[0].bio.email, req.body, data[0].account.currency, data[0].account.accountbalance, req.body.five);

							console.log("Just updated the log now")
						})
						.catch(err=> res.send({"error": "There's an issue with the server."}))
				});



				//console.log(newHistory);

			userModel.where({"bio.login.username": req.body.one})
				.updateOne({$push: {history: newHistory} }, function(err, count){
					if(err){
						console.log("Couldn't Update account balance");
					} else{
						console.log("Updated the history list")
					}
				  }
				);



			res.send({"success":"Message sent successfully!"});
		})
		.catch(err=> res.send({"error": "There's an issue with the server."}))




});


module.exports = router;
