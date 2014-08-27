require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var FEN = require('../lib/fen.js').FEN;
var brands = require('../lib/brands.js');
var PAWN = brands.PAWN;
var WHITE = brands.WHITE;
var BLACK = brands.BLACK;
var KING = brands.KING;
var BISHOP = brands.BISHOP;
var ROOK = brands.ROOK;

var startingPosition =
	FEN.parse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

test('can query all pieces', function (t) {
	t.plan(1);
	t.equal(startingPosition.all().length, 32, 'there are 32 pieces');
})

test('can query all pawns', function (t) {
	t.plan(2);
	var allPawns = startingPosition.all({ brand: PAWN });
	t.equal(allPawns.length, 16, 'there are sixteen of them');
	t.ok(allPawns.every(function (pawn) {
		return pawn.brand === PAWN;
	}), 'they are all pawns');
});

test('can query all white pawns', function (t) {
	t.plan(2);
	var whitePawns = startingPosition.all({
		brand: PAWN,
		color: WHITE
	});
	t.equal(whitePawns.length, 8, 'there are eight of them');
	t.ok(whitePawns.every(function (pawn) {
		return pawn.brand === PAWN && pawn.color === WHITE;
	}), 'they are all white pawns');
});

test('can query all black pawns', function (t) {
	t.plan(2);
	var blackPawns = startingPosition.all({
		brand: PAWN,
		color: BLACK
	});
	t.equal(blackPawns.length, 8, 'there are eight of them');
	t.ok(blackPawns.every(function (pawn) {
		return pawn.brand === PAWN && pawn.color === BLACK;
	}), 'they are all black pawns');
});

test('can query both kings', function (t) {
	t.plan(2);
	var kings = startingPosition.all({
		brand: KING
	});
	t.equal(kings.length, 2, 'there are two of them');
	t.ok(kings.every(function (king) {
		return king.brand === KING;
	}), 'they are both kings');
});

test('the active king in the starting position is white', function (t) {
	t.plan(2);
	var activeKing = startingPosition.piece({
		brand: KING,
		color: startingPosition.activeColor
	});
	t.equal(activeKing.brand, KING, 'the piece is a king');
	t.equal(activeKing.color, WHITE, 'the piece is white');
});

var morphyPuzzle = FEN.parse('kbK5/pp6/1P6/8/8/8/8/R7 w - - 0 1');

test("morphy's puzzle features", function (t) {
	t.plan(9);
	t.equal(morphyPuzzle.all().length, 7, 'there are seven pieces');
	t.equal(morphyPuzzle.all({
		color: WHITE
	}).length, 3, 'three of them are white');
	t.equal(morphyPuzzle.all({
		color: BLACK
	}).length, 4, 'four of them are black');
	t.equal(morphyPuzzle.all({
		brand: PAWN,
		color: BLACK
	}).length, 2, 'two are black pawns');
	t.equal(morphyPuzzle.all({
		brand: KING
	}).length, 2, 'two are kings');
	t.equal(morphyPuzzle.all({
		color: BLACK,
		brand: BISHOP
	}).length, 1, 'one is a black bishop');
	t.equal(morphyPuzzle.all({
		color: WHITE,
		brand: PAWN
	}).length, 1, 'one is a white pawn');
	t.equal(morphyPuzzle.all({
		color: WHITE,
		brand: ROOK
	}).length, 1, 'the remaining piece is a white rook');
	t.equal(morphyPuzzle.activeColor, WHITE, 'it is white to move');
});
