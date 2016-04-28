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
  var id;
  var filePath;
  var kmerLength;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    id = uuid.v4();
    console.log("Id: " + id)
    filePath = path.join(__dirname, '../files/'+id );
    fstream = fs.createWriteStream(filePath + '.fasta');
    file.pipe(fstream);
  });
  req.busboy.on('field', function(fieldname, val) {
      if (fieldname == 'kmerLength') {
        kmerLength = parseInt(val);
      }
  });
  req.busboy.on('finish', function() {
    res.render('processing', { title: 'K-mer Explorer', id: id});

    console.log('start');
    var data = {};
    var stream = fs.createReadStream(filePath + '.fasta')
      .pipe(fasta())
      .pipe(kmerStream(kmerLength, data));
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
      results2 = results2.reverse();
      fs.writeFile(filePath + '.json', JSON.stringify(results2, null, 2), 'utf-8');
      //res.redirect('result', {id: id});
    });
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'K-mer Explorer' });
});



module.exports = router;
