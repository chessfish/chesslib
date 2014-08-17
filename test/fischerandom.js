require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var times = require('lodash.times');
var FEN = require('../lib/codec/fen').FEN;
var Chess960 = require('../lib/innovation/fischerandom.js');
var fischerandom = Chess960.fischerandom;
var doubleFischerandom = Chess960.doubleFischerandom;
var ninesixty = Chess960.ninesixty;

test('fischerandom', function (t) {
  t.plan(2001);

  times(1000, function () {
    var position = fischerandom();
    t.ok(position.queryArray({}).length === 32,
      'fischerandom: all 32 pieces accounted-for');
  });

  times(1000, function () {
    var position = doubleFischerandom();
    t.ok(position.queryArray({}).length === 32,
      'doubleFischerandom: all 32 pieces accounted-for');
  });

  t.equal(fischerandom, ninesixty,
    'there is an alias for people who hate Bobby Fischer');

  test('fischerandom: finding the standard position', function(t) {
    t.plan(1);
    console.time('# ' + t.name);
    var counter = 0;
    while(true) {
      counter += 1;
      if (FEN.standard === FEN.stringify(fischerandom())) {
        console.timeEnd('# ' + t.name);
        t.ok(true, 'found it in ' + counter + 'tries');
        console.log('# not trying that for doubleFischerandom!');
        break;
      }
    }
  });
});