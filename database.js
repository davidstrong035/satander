let mongoose = require("mongoose");

class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        //After upgarding mongoose required some key: value set in the connection object.
        let newFlag = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        };

        //mongoose.connect("mongodb://wrbo:wwwwww111@ds337418.mlab.com:37418/wrbo", newFlag)
        mongoose
            .connect(
                "mongodb://adminsector:AAAaaa111@cluster0-shard-00-00.dkwwo.mongodb.net:27017,cluster0-shard-00-01.dkwwo.mongodb.net:27017,cluster0-shard-00-02.dkwwo.mongodb.net:27017/satander?ssl=true&replicaSet=atlas-ba5khr-shard-0&authSource=admin&retryWrites=true&w=majority",
                newFlag
            )
            .then(() => {
                console.log(
                    "Database connection to Satander Savings BANK was successful"
                );
            })
            .catch((err) => {
                console.error("Database connection error " + err);
            });
    }
}

module.exports = new Database();