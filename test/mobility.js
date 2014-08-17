require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var Mobility = require('../lib/piece/mobility/index.js').Mobility;

test('Mobility base class', function (t) {
  t.plan(1);
  t.throws(function () {
    (new Mobility).adjacentPoints().next();
  }, 'subclass must override Mobility#adjacentPoints');
})