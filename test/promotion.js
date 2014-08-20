require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');

var FEN = require('../lib/fen.js').FEN;
var standard = require('../lib/standard.js');
var brands = require('../lib/brands.js');
var squareCoords = require('../lib/util.js').squareCoords;

test('Pawn promotion', function (t) {
	t.end()//plan(4);

	var p1 = FEN.parse(
		'rnbq1bnr/pppkpPpp/8/8/8/3p4/PPPP1PPP/RNBQKBNR w KQkq 0 2'
	);
	var p2;
	t.doesNotThrow(function () {
		p2 = p1.movePiece(p1.piece('f7'), squareCoords('g8'));
	}, 'position can be pending promotion');

	t.doesNotThrow(function () {
		var p3 = p2.promote(new standard.Queen({ color: brands.WHITE }));
	}, 'pawn can be promoted to queen');

	t.doesNotThrow(function () {
		var p3 = p2.promote(new standard.Knight({ color: brands.WHITE }));
	}, 'pawn can be underpromoted to knight');

	t.throws(function () {
		FEN.standardPosition.promote(
			new standard.Queen({ color: brands.WHITE }))
	}, "no promotion from a position not pending");
});
