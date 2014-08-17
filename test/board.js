require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');

var board = require('../lib/codec/fen.js').standardPosition.board;
var Point = require('../lib/point.js').Point;

test('Board#getPieceByCoords', function (t) {
	t.plan(2);
	t.ok(board.getPieceByCoords(new Point(0, 0)));
	t.equal(board.getPieceByCoords(new Point(4, 4)), null);
});

test('Board#getPieceCoords', function (t) {
	t.plan(2);
	t.ok(board.getPieceCoords(board.getPieceByCoords(new Point(0, 0))).
		equal(new Point(0, 0)));
	t.equal(board.getPieceCoords(null), null);
});
