const express = require('express');
const router = express.Router();

router.use('/home',function (req,res) {
    res.render('home/home')

})
router.use('/', function (req, res) {
    res.render('main/main');
})
module.exports = router;