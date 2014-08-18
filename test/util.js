require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var util = require('../lib/util.js');
var brands = require('../lib/brands.js');
var Point = require('../lib/point.js').Point;

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

test('identity', function (t) {
	t.plan(1);
	t.equal(Object, util.identity(Object));
});

test('fileIndex', function (t) {
	t.plan(3);
	t.equal(0, util.fileIndex('a'));
	t.equal(3, util.fileIndex('d'));
	t.equal(7, util.fileIndex('h'));
});

test('fileName', function (t) {
	t.plan(3);
	t.equal('b', util.fileName(1));
	t.equal('c', util.fileName(2));
	t.equal('g', util.fileName(6));
});

test('rankIndex', function (t) {
	t.plan(3);
	t.equal(7, util.rankIndex('1'));
	t.equal(4, util.rankIndex('4'));
	t.equal(0, util.rankIndex('8'));
});

test('rankName', function (t) {
	t.plan(3);
	t.equal('7', util.rankName(1));
	t.equal('6', util.rankName(2));
	t.equal('2', util.rankName(6));
});

test('squareName', function (t) {
	t.plan(2);
	t.equal('e4', util.squareName(new Point(4, 4)));
	t.equal('d5', util.squareName(new Point(3, 3)));
});

test('squareCoords', function (t) {
	t.plan(2);
	t.ok(util.squareCoords('g4').equal(new Point(6, 4)));
	t.ok(util.squareCoords('b7').equal(new Point(1, 1)));
});

test('oppositeColor', function (t) {
	t.plan(2);
	t.equal(brands.WHITE, util.oppositeColor(brands.BLACK));
	t.equal(brands.BLACK, util.oppositeColor(brands.WHITE));
});

