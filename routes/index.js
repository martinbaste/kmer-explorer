var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');


router.post('/fileupload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        var saveTo = path.join(__dirname, '../files/'+filename);
        fstream = fs.createWriteStream(saveTo);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query['sequence']);
  res.render('index', { title: 'de Bruijn graph generator' });
});



module.exports = router;
