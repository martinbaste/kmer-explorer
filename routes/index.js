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
      var db = new sqlite3.Database(saveTo + '.sqlite3');
      db.serialize(function() {
        db.run('CREATE TABLE kmers (kmer TEXT PRIMARY KEY);', function(err) {console.log(err)});
        db.run('CREATE TABLE network (node1 INT, node2 INT);',[], function(){
          db.close()
          var dbs = streamsql.connect({
            driver: 'sqlite3',
            filename: saveTo +'.sqlite3',
          })
          var kmers = dbs.table('kmers', {
            fields : ['kmer']
          })
          var ws = kmers.createWriteStream({ignoreDupes: true})
          console.log('start');
          var stream = fs.createReadStream(saveTo+'.fasta')
            .pipe(fasta())
            .pipe(kmerStream(20))
            .pipe(ws);
          stream.on('finish', function(){
            console.log('done')
          })

        });
      });



    });
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'de Bruijn graph generator' });
});



module.exports = router;
