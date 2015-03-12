var test = require('tape');
var Algebraic = require('../lib/algebraic.js').Algebraic;
var FEN = require('../lib/fen.js').FEN;
var start = FEN.standardPosition;
var util = require('../lib/util.js');

test('algebraic notation parser', function (t) {

	t.plan(8);

	t.ok(start.
		move('f3').move('e5').
		move('g4').move('Qh4').
		isCheckmate(),
		"A quick checkmate");

	t.ok(start.
		move('e4').move('e5').
		move('Bc4').move('Nc6').
		move('Qf3').move('Bc5').
		move('Qxf7').
		isCheckmate(),
		"A variation of the scholar's mate");

	t.ok(start.
		move('e4').move('e5').
		move('Nf3').move('Nc6').
		move('Bc4').move('Nf6').
		move('Ng5').move('Bc5').
		move('Nxf7').move('Bxf2').
		move('Kxf2').move('Nxe4').
		move('Ke1').move('Qh4').
		move('Ke2').move('d5').
		move('Bxd5').move('Bg4').
		isCheck(),
		"White plays badly against the Traxler");

	t.equal(start.
		move('e4').move('e5').
		move('Bc4').move('Nf6').
		move('Nf3').move('Nc6').
		move('O-O').pieceBySquare('g1'),
		start.piece({ brand: 'king', color: 'white' }),
		"White castles early");

	t.equal(start.
		move('e4').move('d5').
		move('exd5').move('Nf6').
		move('c4').move('e6').
		move('dxe6').move('Bxe6').
		move('Nf3').move('Nc6').
		move('b3').move('Qd7').
		move('Bb2').move('O-O-O').pieceBySquare('c8'),
		start.piece({ brand: 'king', color: 'black' }),
		"Black castles queenside");

	t.throws(function () {
		start.
			move('Nf3').move('e5').
			move('Nc3').move('d5').
			move('e3').move('c5').
			move('Ne2').move('b5').
			move('Nd4')
		;
	}, "It throws on an ambiguous move");

	t.doesNotThrow(function () {
		start.
			move('Nf3').move('e5').
			move('Nc3').move('d5').
			move('e3').move('c5').
			move('Ne2').move('b5').
			move('Ned4')
		;
	}, "disambiguation works by file");

	t.doesNotThrow(function () {
		start.
			move('Nf3').move('e5').
			move('Nc3').move('d5').
			move('Ng5').move('c5').
			move('Nge4').move('b5').
			move('Nxc5').move('a5').
			move('N3e4')
		;
	}, "disambiguation works by rank");
});

test('stringification', function (t) {
	t.plan(4);

	t.equal(Algebraic.stringify({
		piece: start.pieceBySquare('e2'),
		target: util.squareCoords('e4')
	}, start), 'e4');

	t.equal(Algebraic.stringify({
		piece: start.pieceBySquare('g1'),
		target: util.squareCoords('f3')
	}, start), 'Nf3');

	t.equal(Algebraic.stringify({
		piece: start.pieceBySquare('a2'),
		target: util.squareCoords('a3')
	}, start), 'a3');

	var p1 = FEN.parse(
		'r1bqkb1r/ppp2ppp/2n5/4p1N1/2p1n2P/2N5/PPPP1PP1/R1BQK2R w KQkq - 1'
	);

	t.equal(Algebraic.stringify({
		piece: p1.pieceBySquare('g5'),
		target: util.squareCoords('e4')
	}, p1), 'Ngxe4');

});

test('algebraic package conveniences', function (t) {
	t.plan(3);
	var pkg = require('../lib/algebraic.js');
	t.equal(pkg.chunker, Algebraic.chunker);
	t.equal(pkg.parse, Algebraic.parse);
	t.equal(pkg.stringify, Algebraic.stringify);
});
