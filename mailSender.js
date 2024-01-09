var nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "mail.thesantdr.com",
    secureConnection: true,
    port: 587,
    tls: {
        rejectUnauthorized: false,
    },
    auth: {
        user: "noreply@thesantdr.com", // Generated eheereal User
        pass: "06qdK04a]JJ:Ws", // Generated etheral pass
    },
});

function sendEmailNotification(mailOptions) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            console.log("(Confirmation) Message Sent: %s", info.messageId);
            resolve(info.messageId);
        });
    });
}

module.exports = sendEmailNotification;