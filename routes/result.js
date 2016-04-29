var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

//GET result page.
router.get('/:resid', function(req, res, next) {
  var id = req.params.resid;
  var filePath = path.join(__dirname, '../files/'+ id );
  try { //Does the json exist?

    fs.accessSync(filePath + '.json', fs.F_OK);
    var json = JSON.parse(fs.readFileSync(filePath + '.json', 'utf-8'));
    var trimmedJson = json.slice(0,5);
    res.render('result', { objects: trimmedJson, id : id});

  } catch (e) {
    console.log(e);
    try { //Does the .fasta exist?
      fs.accessSync(filePath + '.fasta', fs.F_OK);
      res.render('processing', {  id: id });

    } catch (e) { //We cannot find anything!
      console.log(e);
      res.render('problem', {error: 'id'})
    }

  }
});

//Download the json!
router.get('/download/:resid', function(req, res, next) {
  var id = req.params.resid;
  var filePath = path.join(__dirname, '../files/'+ id + '.json' );

  try { //Does the json exist?
    res.download(filePath);

  } catch (e) {
    console.log(e);
    res.render('problem', {error: 'id'})

  }
})


module.exports = router;
