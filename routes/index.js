var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');

router.post('/fileupload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        var id = uuid.v4();
        console.log(id)
        var saveTo = path.join(__dirname, '../files/'+id + '.fastq');
        fstream = fs.createWriteStream(saveTo);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.render('processing', {id: id});
        });
    });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query['sequence']);
  res.render('index', { title: 'de Bruijn graph generator' });
});



module.exports = router;
