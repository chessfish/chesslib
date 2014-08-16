var test = require('tape');
var util = require('../lib/util.js');

test('isEven', function (t) {
	t.plan(20);

	for(var i = -10; i < 10; i ++) {
		t.ok(util.isEven(i * 2));
	}
});

test('isOdd', function (t) {
	t.plan(20);

	for(var i = -10; i < 10; i ++) {
		t.ok(util.isOdd(i * 2 + 1));
	}
});
