require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var Algebraic = require('../lib/algebraic.js').Algebraic;
var start = require('../lib/fen.js').FEN.standardPosition;
var util = require('../lib/util.js');

test('algebraic notation parser', function (t) {

	t.plan(5);

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
		move('O-O').piece('g1'),
		start.one({ brand: 'king', color: 'white' }),
		"White castles early");

	t.equal(start.
		move('e4').move('d5').
		move('exd5').move('Nf6').
		move('c4').move('e6').
		move('dxe6').move('Bxe6').
		move('Nf3').move('Nc6').
		move('b3').move('Qd7').
		move('Bb2').move('O-O-O').piece('c8'),
		start.one({ brand: 'king', color: 'black' }),
		"Black castles queenside");


});