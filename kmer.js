var express = require('express');
var stream = require('stream');

function kmerStream(kmerLength ){
  var ts = stream.Transform({objectMode: true});

  ts._transform = function(chunk, enc, next) {
    var seq = JSON.parse(chunk.toString())['seq'];
    for (var i = 0; i <= seq.length-kmerLength; i++) {
      var sub = seq.slice(i,i+kmerLength);
      ts.push({ kmer: sub });

    }
    next();
  };
  return ts
}


module.exports = kmerStream;
