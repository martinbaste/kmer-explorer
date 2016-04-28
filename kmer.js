var express = require('express');
var stream = require('stream');

//My kmerStream function. It takes one fasta sequence,
//gets all kmers and adds the count to results.
function kmerStream(kmerLength, results){
  var ws = stream.Writable({objectMode: true});

  ws._write = function(chunk, enc, next) {
    var seq = JSON.parse(chunk.toString())['seq'];
    for (var i = 0; i <= seq.length-kmerLength; i++) {
      var sub = seq.slice(i,i+kmerLength);
      if (sub in results) {
        results[sub]++;
      } else {
        results[sub] = 1;
      }

    }
    next(); //Lets the stream know the function is ready
  };
  return ws
}


module.exports = kmerStream;
