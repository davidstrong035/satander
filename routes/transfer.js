//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");

var sendEmailNotification = require("../mailSender");

function calculateAccountBalance(clientValue, serverValue) {
    if (clientValue > serverValue) {
        return serverValue;
    } else {
        return clientValue - serverValue;
    }
}

router.post("/transfer", function(req, res) {
    console.log("Processing transfer...");
    // console.log(req.body);

    var email = "";
    let currency = "";
    let acctBalance = "";

    var restrictedStatus = "";
    var messageStatus = "";

    var newHistory = {
        Transactiondate: new Date(),
        Transactiontype: "Debit",
        //Transfertype: req.body.transtype,
        Transfertype: "Direct Debit",
        Amount: req.body.amount,
        person: req.body.receiver,
        Accountno: req.body.accountno.toString().substr(0, 5) + "*****",
        Bank: req.body.bankname,
    };

    //First find the email of the user
    userModel.findOne({ "bio.login.username": req.body.user }, {
            "bio.email": 1,
            "account.currency": 1,
            "account.accountbalance": 1,
            "status.restricted": 1,
            "status.message": 1,
        },
        function(err, doc) {
            if (err) console.log(error);

            restrictedStatus = doc.status.restricted;
            messageStatus = doc.status.message;
            email = doc.bio.email;
            currency = doc.account.currency;
            acctBalance = doc.account.accountbalance;

            //console.log("Restricted status is: " + restrictedStatus);

            if (restrictedStatus) {
                //Check if the account is restricted from making transfers
                //console.log(restrictedStatus);
                res.send({ error: messageStatus });
            } else {
                //if the account can make transfers then you can continue

                // Check if the amount being sent is greater than the current balance;

                console.log(acctBalance);
                if (req.body.amount > acctBalance) {
                    //console.log("From db: " + acctBalance);
                    //console.log("From client: " + req.body.seven);
                    return res.send({
                        error: "You have insufficient funds to effect this transfer, kindly fund your account and try again. Your account balance is " +
                            currency +
                            calculateAccountBalance(req.body.seven, acctBalance),
                    });
                } else {
                    // Update account balance
                    userModel.where({ "bio.login.username": req.body.user }).updateOne({
                            $set: {
                                "account.accountbalance": acctBalance - req.body.amount,
                            },
                        },
                        function(err, count) {
                            //if(err) console.log("Couldn't Update balance");
                            //console.log("Update balance");
                            if (err) console.log(err);
                            return res.send({
                                error: "There was an error processing this request!",
                            });
                        }
                    );

                    let d = new Date();
                    let now =
                        d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

                    let calculatedCurrentBalance = acctBalance - req.body.amount;

                    let mailOptions = {
                        from: '"Satander Bank" <noreply@thesantdr.com>',
                        to: email,
                        //to: 'davidstrong035@gmail.com',
                        subject: "Successful Transfer of Funds",
                        html: `
              <div style="width: 800px; margin: 0 auto; height: 500px;">
                <div style="border-bottom: 1px dotted #AAAEB4; padding: 10px;">
                  <img src="https://i.ibb.co/THwc5CP/logo.png" style="height: 100px; margin-top: 20px"/> <br />
                </div>

                <div>
                  <p> Dear ${req.body.name} </p><
p style = "text-decoration: underline; font-weight: bold">
                    ${req.body.company} Electronic Notification Service
                  </p>

                  <p>
                    The details of this transaction are shown below:
                  </p>

                  <h4 style="text-decoration: underline">
                    Transaction Notification
                  </h4>

                  <table>
                    <tr>
                      <td style="width: 170px"> Beneficiary : </td>
                      <td style="width: 170px"> ${req.body.receiver}</td>
                    </tr>
                    <tr>
                      <td style="width: 170px"> Account Number : </td>
                      <td style="width: 170px"> ${req.body.accountno}</td>
                    </tr>
                    <tr>
                      <td style="width: 170px"> Transaction Location : </td>
                      <td style="width: 170px"> E -STATION</td>
                    </tr>
                    <tr>
                      <td style="width: 170px"> Description : </td>
                      <td style="width: 250px"> NIBS Instant Payment Outward</td>
                    </tr>

                    <tr>
                      <td style="width: 170px"> Amount : </td>
                      <td style="width: 170px"> ${currency}${req.body.amount
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")} </td>
                    </tr>

                    <tr>
                      <td style="width: 170px"> Beneficiary Bank : </td>
                      <td style="width: 170px"> ${req.body.bankname} </td>
                    </tr>



                    <tr>
                      <td style="width: 170px"> Value Date : </td>
                      <td style="width: 170px"> ${now} </td>
                    </tr>

                    <tr>
                      <td style="width: 170px"> Remarks : </td>
                      <td style="width: 40px">
                        ${Math.random().toString(36).slice(2)}/${Math.random()
              .toString(36)
              .slice(2)}/${Math.random().toString(36).slice(2)}
                      </td>
                    </tr>
                  </table>

                  <p style="border-top: 1px dotted #AAAEB4; padding: 10px;">
                    The balances on this account at the time of this transaction are as follows:
                  </p>
                  <table>
                    <tr>
                      <td style="width: 170px"> Current Balance : </td>
                      <td style="width: 170px">  ${currency}${calculatedCurrentBalance
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}  </td>
                    </tr>

                    <tr>
                      <td style="width: 170px"> Previous Balance : </td>
                      <td style="width: 170px">  ${currency}${acctBalance
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")} </td>
                    </tr>
                  </table>

                  <p style="font-size: .8em; color: gray">
                    The privacy and security of your Bank Account details is important to us. If you would prever that we do not display your account balance in every transaction, please reach out to us, and we can see how to make this happen.
                  </p>

                  <p style="font-size: .8em; color: gray">
                    Thank you for choosing Satander Savings BANK.
                  </p>
                </div>

              </div>
              `,
                    };

                    userModel
                        .where({ "bio.login.username": req.body.user })
                        .updateOne({ $push: { history: newHistory } },
                            function(err, count) {
                                if (err) {
                                    console.log("Couldn't Update history list");
                                    return res.send({
                                        error: "An error occured processing your request!",
                                    });
                                } else {
                                    //console.log(newHistory);
                                    console.log("Updated the history list");
                                    sendEmailNotification(mailOptions).then(
                                        (data) => {
                                            return res.send({
                                                success: "Your transfer has been initiated successfully, if anything goes wrong, we'll notify you by email, Thank you for banking with us. Your account balance is " +
                                                    currency +
                                                    (acctBalance - req.body.seven),
                                            });
                                        },
                                        (error) => {
                                            console.log(error);
                                            return res.send({
                                                error: "This process was completed successfully, but there was an error sending your confirmation email.",
                                            });
                                        }
                                    );
                                }
                            }
                        );
                }
                // End of transfer
            }
        }
    );
});

module.exports = router;