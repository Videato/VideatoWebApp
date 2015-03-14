var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/:id', function(req, res) {
  	res.render('searchResult',  { searchQuery: req.params.id});
});

module.exports = router;