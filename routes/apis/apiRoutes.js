const express = require('express');
const router = express.Router();

const users = require("./users/userRoutes");
const activities = require('./activities/activityRoutes');

router.use('/users', users)

router.use('/activities', activities)

router.use('/', function (req, res) {
    res.send("invalid Route");
})
module.exports = router;