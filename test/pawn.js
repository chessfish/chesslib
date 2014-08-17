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

	t.plan(22);

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
			p1.move(pawn, coords.sum(new Point(0, pawn.reach)));
		});

		t.doesNotThrow(function () {
			p1.move(pawn, coords.sum(new Point(0, pawn.reach * 2)));
		});
	});

	t.doesNotThrow(function () {
		p2.move(p2.piece('e4'), squareCoords('d5'));
	});

	t.doesNotThrow(function () {
		p3.move(p3.piece('d4'), squareCoords('e5'));
	});

	t.doesNotThrow(function () {
		p3.move(p3.piece('d4'), squareCoords('d5'));
	});

	t.throws(function () {
		p3.move(p3.piece('d4'), squareCoords('e6'));
	});

	t.throws(function () {
		p3.move(p3.piece('a2'), squareCoords('h3'));
	});

	t.doesNotThrow(function () {
		var p4 = FEN.parse(
			'rbbnqknr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RBBNQKNR w KQkq f6'
		);
		p4.move(p4.piece('e5'), squareCoords('f6'));
	}, 'can capture en passant');
});

test('pawn movement: BLACK', function (t) {

	t.plan(18);

	var p = FEN.standardPosition;
	var whiteP = p.query({ brand: brands.PAWN, color: brands.WHITE });
	var coords = p.pieceCoords(whiteP);
	// move any old white pawn forward one:
	var p1 = p.move(whiteP, coords.sum(new Point(0, whiteP.reach)));
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
			p1.move(pawn, coords.sum(new Point(0, pawn.reach)));
		});

		t.doesNotThrow(function () {
			p1.move(pawn, coords.sum(new Point(0, pawn.reach * 2)));
		});
	});

	t.doesNotThrow(function () {
		p2.move(p2.piece('d5'), squareCoords('e4'));
	});

	t.doesNotThrow(function () {
		p3.move(p3.piece('e5'), squareCoords('d4'));
	});
});



