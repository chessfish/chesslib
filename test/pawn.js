require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var FEN = require('../lib/codec/fen.js').FEN;
var Point = require('../lib/point.js').Point;
var brands = require('../lib/brands.js');
var squareName = require('../lib/util.js').squareName;

var p = FEN.standardPosition;

test('pawn movement: WHITE', function (t) {

	t.plan(16);

	p.queryArray({
		brand: brands.PAWN,
		color: brands.WHITE,
	}).forEach(function (pawn) {
		var coords = p.pieceCoords(pawn);

		t.doesNotThrow(function () {
			p.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach))));
		});

		t.doesNotThrow(function () {
			p.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach * 2))));
		});
	});
});

test('pawn movement: BLACK', function (t) {

	t.plan(16);

	var whiteP = p.query({ brand: brands.PAWN, color: brands.WHITE });
	var coords = p.pieceCoords(whiteP);
	// move any old white pawn forward one:
	var p2 = p.move(whiteP, squareName(coords.sum(new Point(0, whiteP.reach))));

	p2.queryArray({
		brand: brands.PAWN,
		color: brands.BLACK,
	}).forEach(function (pawn) {
		var coords = p2.pieceCoords(pawn);

		t.doesNotThrow(function () {
			p2.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach))));
		});

		t.doesNotThrow(function () {
			p2.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach * 2))));
		});
	});
});



