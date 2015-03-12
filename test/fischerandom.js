var test = require('tape');
var times = require('lodash.times');
var FEN = require('../lib/fen').FEN;
var Chess960 = require('../lib/fischerandom.js');

test('fischerandom', function (t) {
	t.plan(2001);

	times(1000, function () {
		var position = Chess960.fischerandom();
		t.ok(position.all({}).length === 32,
			'fischerandom: all 32 pieces accounted-for');
	});

	times(1000, function () {
		var position = Chess960.doubleFischerandom();
		t.ok(position.all({}).length === 32,
			'doubleFischerandom: all 32 pieces accounted-for');
	});

	t.equal(Chess960.fischerandom, Chess960.ninesixty,
		'there is an alias for people who hate Bobby Fischer');
});

test('fischerandom: finding the standard position', function(t) {
	t.plan(1);
	console.time('# ' + t.name);
	var counter = 0;
	while(true) {
		counter += 1;
		if (FEN.standard === FEN.stringify(Chess960.fischerandom())) {
			console.timeEnd('# ' + t.name);
			t.ok(true, 'found it in ' + counter + ' tries');
			console.log('# not trying that for doubleFischerandom!');
			break;
		}
	}
});
