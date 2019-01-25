const express = require('express');
const router = express.Router();

router.get('/',function (req,res) {
    console.log("getusers",req.body);
})

module.exports=router;