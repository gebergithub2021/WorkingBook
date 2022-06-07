const express = require('express');
const {Router} = require('express');
//const Router = express.Router();
const Working=require('./Working');
const User=require('./User');


const router = new Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.use('/Working',Working);
router.use('/User',User);

module.exports = router;
