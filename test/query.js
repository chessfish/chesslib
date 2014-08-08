require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var Fen = require('../lib/codecs/fen.js').Fen;
var constants = require('../lib/constants.js');
var PAWN = constants.PAWN;
var WHITE = constants.WHITE;
var BLACK = constants.BLACK;
var KING = constants.KING;
var BISHOP = constants.BISHOP;
var ROOK = constants.ROOK;

var startingPosition =
	new Fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
		.position;

test('can query all pieces', function (t) {
	t.plan(1);
	t.equal(startingPosition.queryAll().length, 32, 'there are 32 pieces');
})

test('can query all pawns', function (t) {
	t.plan(2);
	var allPawns = startingPosition.queryAll({ brand: PAWN }).array();
	t.equal(allPawns.length, 16, 'there are sixteen of them');
	t.ok(allPawns.every(function (pawn) {
		return pawn.brand === PAWN;
	}), 'they are all pawns');
});

test('can query all white pawns', function (t) {
	t.plan(2);
	var whitePawns = startingPosition.queryAll({
		brand: PAWN,
		color: WHITE
	}).array();
	t.equal(whitePawns.length, 8, 'there are eight of them');
	t.ok(whitePawns.every(function (pawn) {
		return pawn.brand === PAWN && pawn.color === WHITE;
	}), 'they are all white pawns');
});

test('can query all black pawns', function (t) {
	t.plan(2);
	var blackPawns = startingPosition.queryAll({
		brand: PAWN,
		color: BLACK
	}).array();
	t.equal(blackPawns.length, 8, 'there are eight of them');
	t.ok(blackPawns.every(function (pawn) {
		return pawn.brand === PAWN && pawn.color === BLACK;
	}), 'they are all black pawns');
});

test('can query both kings', function (t) {
	t.plan(2);
	var kings = startingPosition.queryAll({
		brand: KING
	}).array();
	t.equal(kings.length, 2, 'there are two of them');
	t.ok(kings.every(function (king) {
		return king.brand === KING;
	}), 'they are both kings');
});

test('the active king in the starting position is white', function (t) {
	t.plan(2);
	var activeKing = startingPosition.query({
		brand: KING,
		color: startingPosition.activeColor
	});
	t.equal(activeKing.brand, KING, 'the piece is a king');
	t.equal(activeKing.color, WHITE, 'the piece is white');
});

var morphyPuzzle = new Fen('kbK5/pp6/1P6/8/8/8/8/R7 w - - 0 1').position

test("morphy's puzzle features", function (t) {
	t.plan(9);
	t.equal(morphyPuzzle.queryAll().length, 7, 'there are seven pieces');
	t.equal(morphyPuzzle.queryAll({
		color: WHITE
	}).length, 3, 'three of them are white');
	t.equal(morphyPuzzle.queryAll({
		color: BLACK
	}).length, 4, 'four of them are black');
	t.equal(morphyPuzzle.queryAll({
		brand: PAWN,
		color: BLACK
	}).length, 2, 'two are black pawns');
	t.equal(morphyPuzzle.queryAll({
		brand: KING
	}).length, 2, 'two are kings');
	t.equal(morphyPuzzle.queryAll({
		color: BLACK,
		brand: BISHOP
	}).length, 1, 'one is a black bishop');
	t.equal(morphyPuzzle.queryAll({
		color: WHITE,
		brand: PAWN
	}).length, 1, 'one is a white pawn');
	t.equal(morphyPuzzle.queryAll({
		color: WHITE,
		brand: ROOK
	}).length, 1, 'the remaining piece is a white rook');
	t.equal(morphyPuzzle.activeColor, WHITE, 'it is white to move');
});
