var express = require('express');
var router = express.Router();
var Index = require('../controllers/Index');

/* GET home page. */
router.get('/', function(req, res, next) {
  Index.run(req, res, next);
});

module.exports = router;
