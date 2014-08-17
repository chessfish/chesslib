require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var FEN = require('../lib/codec/fen.js').FEN;
var Point = require('../lib/point.js').Point;
var brands = require('../lib/brands.js');
var util = require('../lib/util.js');
var squareName = util.squareName;
var squareCoords = util.squareCoords;

test('pawn movement: WHITE', function (t) {

	t.plan(21);

	var p1 = FEN.standardPosition;
	var p2 = FEN.parse(
		'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6'
	);
	var p3 = FEN.parse(
		'rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq e6'
	);

	p1.queryArray({
		brand: brands.PAWN,
		color: brands.WHITE,
	}).forEach(function (pawn) {
		var coords = p1.pieceCoords(pawn);

		t.doesNotThrow(function () {
			p1.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach))));
		});

		t.doesNotThrow(function () {
			p1.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach * 2))));
		});
	});

	t.doesNotThrow(function () {
		p2.move(p2.pieceByCoords(squareCoords('e4')), 'd5'); // capture at d5
	});

	t.doesNotThrow(function () {
		p3.move(p3.pieceByCoords(squareCoords('d4')), 'e5'); // capture at d5
	});

	t.doesNotThrow(function () {
		p3.move(p3.pieceByCoords(squareCoords('d4')), 'd5');
	});

	t.throws(function () {
		p3.move(p3.pieceByCoords(squareCoords('d4')), 'e6');
	});

	t.throws(function () {
		p3.move(p3.pieceByCoords(squareCoords('a2')), 'h3');
	});
});

test('pawn movement: BLACK', function (t) {

	t.plan(18);

	var p = FEN.standardPosition;
	var whiteP = p.query({ brand: brands.PAWN, color: brands.WHITE });
	var coords = p.pieceCoords(whiteP);
	// move any old white pawn forward one:
	var p1 = p.move(whiteP, squareName(coords.sum(new Point(0, whiteP.reach))));
	var p2 = FEN.parse(
		'rnbqkbnr/ppp1pppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -'
	);
	var p3 = FEN.parse(
		'rnbqkbnr/pppp1ppp/8/4p3/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq -'
	);

	p1.queryArray({
		brand: brands.PAWN,
		color: brands.BLACK,
	}).forEach(function (pawn) {
		var coords = p1.pieceCoords(pawn);

		t.doesNotThrow(function () {
			p1.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach))));
		});

		t.doesNotThrow(function () {
			p1.move(pawn,
				squareName(coords.sum(new Point(0, pawn.reach * 2))));
		});
	});

	t.doesNotThrow(function () {
		p2.move(p2.pieceByCoords(squareCoords('d5')), 'e4'); // capture at d5
	});

	t.doesNotThrow(function () {
		p3.move(p3.pieceByCoords(squareCoords('e5')), 'd4'); // capture at d5
	});
});



