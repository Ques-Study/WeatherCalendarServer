var express = require('express');
var router = express.Router();
var Weathers = require('../controllers/Weathers');

/* GET home page. */
router.get('/weathers/:zoneCode&:date', function(req, res, next) {
  Weathers.run(req, res, next);
});

module.exports = router;
