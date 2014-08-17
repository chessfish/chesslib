require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var FEN = require('../lib/codec/fen.js').FEN;
var Point = require('../lib/point.js').Point;
var brands = require('../lib/brands.js');
var squareName = require('../lib/util.js').squareName;

test('pawn movement', function (t) {

	t.plan(16);

	var p = FEN.standardPosition;

	p.queryArray({
		brand: brands.PAWN,
		color: brands.WHITE,
	}).forEach(function (pawn) {
		var coords = p.pieceCoords(pawn);

		t.doesNotThrow(function () {
			FEN.standardPosition.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach))));
		});

		t.doesNotThrow(function () {
			FEN.standardPosition.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach * 2))));
		});
	});
});


