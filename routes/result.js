var express = require('express');
var router = express.Router();

//GET result page.
router.get('/', function(req, res, next) {
  console.log(req);
  output = req.query['sequence'];
  res.render('result', { title: 'de Bruijn graph generator', output: output });
});

module.exports = router;
