var express = require('express');
var stream = require('stream');

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
    next();
  };
  return ws
}


module.exports = kmerStream;
