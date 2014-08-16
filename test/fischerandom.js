var test = require('tape');
var times = require('lodash.times');
var Chess960 = require('../lib/innovation/fischerandom.js');
var fischerandom = Chess960.fischerandom;
var doubleFischerandom = Chess960.doubleFischerandom;
var ninesixty = Chess960.ninesixty;

test('it can generate fischerandom positions', function (t) {
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
});
