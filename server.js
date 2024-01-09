//Set up
let express = require("express");
let app = express();
let logger = require("morgan");
let bodyParser = require("body-parser");
let cors = require("cors");
let path = require("path");

let database = require("./database");
// Endpoint for the login function
app.use(cors());

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

app.use(bodyParser.urlencoded({ extended: false })); //Parses urlencoded bodies
app.use(bodyParser.json()); //Send JSON responses

app.use(logger("dev")); // Log requests to API using morgan

app.use("/images", express.static(path.join(__dirname, "uploads")));

// Import all routes
let login = require("./routes/login");
let profile = require("./routes/profile");
let apply = require("./routes/apply");
let transfer = require("./routes/transfer");
let creditacct = require("./routes/creditacct");
let restriction = require("./routes/restriction");
let allowtransfer = require("./routes/allowtransfer");
let updatebalance = require("./routes/updatebalance");
let changeaccountinfo = require("./routes/changeaccountinfo");
let changesecurityinfo = require("./routes/changesecurityinfo");
let adminacctinfo = require("./routes/adminacctinfo");
let kins = require("./routes/kins");
//let uploadFile = require("./uploadFile");

app.use("/", login);
app.use("/", profile);
app.use("/", apply);
app.use("/", transfer);
app.use("/", creditacct);
app.use("/", restriction);
app.use("/", allowtransfer);
app.use("/", updatebalance);
app.use("/", changeaccountinfo);
app.use("/", adminacctinfo);
app.use("/", kins);
app.use("/", changesecurityinfo);
//app.use("/", uploadFile);

app.listen(process.env.PORT || 5000);
console.log("Satander Bank Server Started, listening on port 5000");

module.exports = app;