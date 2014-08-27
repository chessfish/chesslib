require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var joinPath = require('path').join;
var FEN = require('../lib/fen.js').FEN;
var PGN = require('../lib/pgn.js').PGN;
var EnPassantTarget = require('../lib/eptarget.js').EnPassantTarget;
var Point = require('../lib/point.js').Point;
var brands = require('../lib/brands.js');
var squareCoords = require('../lib/util.js').squareCoords;
var util = require('./lib/util.js');

var p = FEN.standardPosition;

test('position: checks', function (t) {
	var checks = [
		'r2qrk2/pp1bpQ2/3p4/8/2BnP1p1/2N2P2/PPP5/2KR4 b - -',
		'2k2bnr/p1p2p2/1pb4p/6p1/2P5/1Q1rP1PP/PP6/3KBq2 w - -',
		'8/4k3/pp1b2p1/3PNp2/2P1K1R1/Pr6/8/8 w - f6',
		// TODO: add a shitload more tests.
	];

	t.plan(checks.length);

	checks.forEach(function (check) {
		t.ok(FEN.parse(check).isCheck(),
			'it identifies the position as check');
	});
});


test('not checks', function (t) {
	var notChecks = [
		'3R4/pkp2ppp/1p6/2q5/8/5P1P/PP4P1/2rR3K w - -',
		'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6',
	];

	t.plan(notChecks.length * 2);

	notChecks.forEach(function (notCheck) {
		t.notOk(FEN.parse(notCheck).isCheck(brands.WHITE),
			'it identifies the position as not check for WHITE');
		t.notOk(FEN.parse(notCheck).isCheck(brands.BLACK),
			'it identifies the position as not check for BLACK');
	});
});

test('checkmates', function (t) {
	var checkmates = [
		'r2qrk2/pp1bpQ2/3p4/8/2BnP1p1/2N2P2/PPP5/2KR4 b - -',
		'r1b1k2r/pppp2pp/8/4N3/2B1n3/4P3/PP3qPP/RNB2K1R w kq -',
		'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 4 1',
	];

	t.plan(checkmates.length);

	checkmates.forEach(function (checkmate) {
		t.ok(FEN.parse(checkmate).isCheckmate(),
			'it identifies the position as checkmate');
	});
});

test('not checkmates', function (t) {
	var notCheckmates = [
		FEN.standard,
		'2k2bnr/p1p2p2/1pb4p/6p1/2P5/1Q1rP1PP/PP6/3KBq2 w - -'
	];

	t.plan(notCheckmates.length);

	notCheckmates.forEach(function (notCheckmate) {
		t.notOk(FEN.parse(notCheckmate).isCheckmate(),
			'it identifies the position as not checkmate');
	});
});

test('shortcuts', function (t) {
	t.plan(2);
	t.equal(FEN.standardPosition.ranks, 8);
	t.equal(FEN.standardPosition.files, 8);
});

test('tryMovePiece', function (t) {
	t.plan(2);
	t.equal(p, p.tryMovePiece(p.pieceByCoords(new Point(4, 7)), squareCoords('e4')));
	t.notEqual(p, p.tryMovePiece(p.pieceByCoords(new Point(4, 6)), squareCoords('e4')));
});

test('move', function (t) {
	t.plan(1);
	t.throws(function () {
		p.movePiece(p.pieceBySquare('a4'), null);
	}, 'when you pass null as targetSquare');
});

test('50 move rule', function (t) {
	t.plan(1);

	util.getFile(joinPath(__dirname, './data/pgn/karpov_kasparov_1991.pgn')).
	then(PGN.parse).
	spread(function (game) { t.ok(game.ply[112 * 2].position.is50MoveDraw()); });
});
