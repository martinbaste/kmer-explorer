var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');
var fasta = require('bionode-fasta');
var kmerStream = require('../kmer');
var spawn = require("child_process").spawn;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'K-mer Explorer' });
});

//Trigers when user uploads a file
router.post('/fileupload', function(req, res) {
  var fstream;
  var id;
  var filePath;
  var kmerLength;
  req.pipe(req.busboy);

  //This handles the file, it gets written into disk with new name
  req.busboy.on('file', function (fieldname, file, filename) {
    id = uuid.v4();
    filePath = path.join(__dirname, '../files/'+id );
    fstream = fs.createWriteStream(filePath + '.fasta');
    file.pipe(fstream);
  });

  //This handles the kmer Length user input
  req.busboy.on('field', function(fieldname, val) {
      if (fieldname == 'kmerLength') {
        kmerLength = parseInt(val);
      }
  });

  //Only continue when form processing is done
  req.busboy.on('finish', function() {
    //Displays the processing view
    res.render('processing', { title: 'K-mer Explorer', id: id});
    var data = {};
    var stream;

    //This turns the fasta file into sequences and they are sent to kmerStream
    stream = fs.createReadStream(filePath + '.fasta')
      .pipe(fasta())
      .pipe(kmerStream(kmerLength, data));

    /* THIS DOESNT WORK, NON FASTA FILES STILL CRASH THE SERVER
    try {
      stream = fs.createReadStream(filePath + '.fasta')
        .pipe(fasta())
        .pipe(kmerStream(kmerLength, data));
    } catch (e) {
      console.log(e);
      res.render('problem', {error: 'fasta'});
    }
    */

    /* data now contains the info in this format:
    {
      'sequence1': 1,
      'sequence2': 1.
      'sequence3': 2,
      'sequence4': 4
    }
    Which is convenient when analysing their frequency
    but not to filter and show the data */

    stream.on('finish', function(){
      var dataFormat2 = {};
      for (item in data) {
        var value = data[item];
        if (value == 1) {
          //We skip kmers that are only once.
          continue
        }
        if (String(value) in dataFormat2) {
          dataFormat2[String(value)].push(item);
        } else {
          dataFormat2[String(value)] = [item];
        }
      }
      /*
      Format now is
      {
        '1': [seq1, seq2],
        '2': [seq3]
      }
      To display it we prefer the format:
      [
        {number:'1', sequences: [seq1, seq2]},
        {number: '2', sequences: [seq3]}
      ]

      Probably it is faster to create this second
      format from the beginning, or display it using
      the first format (TODO)
      */
      var dataFormat3 = [];
      for (item in dataFormat2) {
        dataFormat3.push({number: item, sequences: dataFormat2[item]});
      }
      dataFormat3 = dataFormat3.reverse(); //most common first
      //Store in .json
      fs.writeFile(filePath + '.json', JSON.stringify(dataFormat3, null, 2), 'utf-8');
    });
  });
});






module.exports = router;
