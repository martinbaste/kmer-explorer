var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');
var fasta = require('bionode-fasta');
var sqlite3 = require('sqlite3');
var kmerStream = require('../kmer');
var spawn = require("child_process").spawn;
var streamsql = require('streamsql')



router.post('/fileupload', function(req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    var id = uuid.v4();
    console.log("Id: " + id)
    var saveTo = path.join(__dirname, '../files/'+id );
    fstream = fs.createWriteStream(saveTo+ '.fasta');
    file
      .pipe(fstream);
    fstream.on('close', function () {
      res.render('processing', {id: id});

      console.log('start');
      var data = {};
      var stream = fs.createReadStream(saveTo+'.fasta')
        .pipe(fasta())
        .pipe(kmerStream(20, data));
      //  .pipe(ws);
      stream.on('finish', function(){
        console.log('done');
        var results = {};
        for (item in data) {
          var value = data[item];
          if (value == 1) {
            continue
          }
          if (String(value) in results) {
            results[String(value)].push(item);
          } else {
            results[String(value)] = [item];
          }
        }
        var results2 = [];
        for (item in results) {
          results2.push({number: item, sequences: results[item]})
        }
        fs.writeFile(saveTo + '.json', JSON.stringify(results2, null, 2), 'utf-8');
        //res.redirect('result', {id: id});
      })
    });
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'de Bruijn graph generator' });
});



module.exports = router;
