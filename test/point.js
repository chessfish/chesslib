var test = require('tape');
var Point = require('../lib/point.js').Point;

test('Point#equal', function (t) {
	t.plan(5);
	t.ok(new Point(0, 0).equal(new Point(0, 0)));
	t.ok(new Point(-50, 73).equal(new Point(-50, 73)));
	t.ok(new Point(Infinity, -Infinity).equal(new Point(Infinity, -Infinity)));
	t.ok(new Point(44.5, 71.3).equal(new Point(44.5, 71.3)));
	t.ok(new Point(Math.PI, Math.PI * 2).equal(new Point(Math.PI, Math.PI * 2)));
});

test('Point#sum', function (t) {
	t.plan(2);
	t.ok(new Point(2, 8).equal(new Point(1, 7).sum(new Point(1, 1))));
	t.ok(new Point(-2, 13).equal(new Point(5, 5).sum(new Point(-7, 8))));
})

test('Point#difference', function (t) {
	t.plan(2);
	t.ok(new Point(0, 6).equal(new Point(1, 7).difference(new Point(1, 1))));
	t.ok(new Point(12, -3).equal(new Point(5, 5).difference(new Point(-7, 8))));
});

test('Point gross comparisons', function (t) {
	t.plan(6);
	t.ok(new Point(0, 0).lt(new Point(5, 5)));
	t.ok(new Point(0, 0).lte(new Point(0, 5)));
	t.ok(new Point(4, 5).gte(new Point(4, 5)));
	t.ok(new Point(4, 5).gte(new Point(3, 5)));
	t.ok(new Point(4, 5).gte(new Point(3, 5)));
	t.ok(new Point(4, 5).gt(new Point(3, 3)));
});
