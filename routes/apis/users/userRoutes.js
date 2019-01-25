const express = require('express');
const router = express.Router();


router.use('/addUser',function (req,res) {
    let mdb = req.app.get("mdb");
    let crashed = req.app.get("crashed");

    let myObj={};
    myObj.email=req.body.email;
    myObj.password=req.body.password;
    myObj.name=req.body.name;
    myObj.address=req.body.address;
    mdb.collection("users").insertOne(myObj, function(err, result) {
        if (err) throw err;
        res.send('user added successfully')
    });
})

router.use('/allUsers',function (req,res) {

})

router.use('/userDetails',function (req,res) {

})

router.use('/update',function (req,res) {

})

router.use('/delete',function (req,res) {

})

router.use('/',function (req,res) {
    res.send('invalid route');
})

module.exports=router;