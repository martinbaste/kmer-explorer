var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

//GET result page.
router.get('/:resid', function(req, res, next) {
  var id = req.params.resid;
  var filePath = path.join(__dirname, '../files/'+ id + '.json' );
  try {
    fs.accessSync(filePath, fs.F_OK);
    var json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    var trimmedJson = json.slice(0,5);
    res.render('result', { title: 'K-mer Explorer', objects: trimmedJson, id : id});
  } catch (e) {
    console.log(e)
    res.render('processing', { title: 'K-mer Explorer', id: id });
  }
  ;
});

router.get('/download/:resid', function(req, res, next) {
  var id = req.params.resid;
  var filePath = path.join(__dirname, '../files/'+ id + '.json' );
  res.download(filePath);
})


module.exports = router;
