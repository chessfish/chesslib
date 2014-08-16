var test = require('tape');
var Chess960 = require('../lib/innovation/fischerandom.js');
var fischerandom = Chess960.fischerandom;
var ninesixty = Chess960.ninesixty;

test('it can generate fischerandom positions', function (t) {
  t.plan(2);

  console.log(fischerandom());

  t.ok(fischerandom());

  t.equal(fischerandom, ninesixty,
    'there is an alias for people who hate Bobby Fischer');
});
