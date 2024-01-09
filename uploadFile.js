//Set up
let express = require("express");
let multer = require("multer");
let bodyParser = require("body-parser");
let router = express.Router();
let path = require("path");

let userModel = require("./schemas/userSchema");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits:{
        fileFilter: fileFilter
}});


router.post('/uploadFile', upload.single('imageFile'),(req, res, next) => {
    console.log(req.file);


    //Update the processing field in the database
   userModel.where({"bio.login.username": req.body.name})
        .update({$set: {"bio.image": req.file.originalname}}, function(err, count){
            if(err) {
                console.log("Couldn't write name to field");
                res.send({"error": "Error occured saving id"})
            } else {
                    res.status(201).json({
                    success: true,
                });
            }
        });


    
});


module.exports = router;