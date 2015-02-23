var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('addVideo', { title: 'Add Video' });
});

module.exports = router;