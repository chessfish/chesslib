var test = require('tape');

var standardPosition = require('../lib/codec/fen.js').standardPosition;
var Point = require('../lib/point.js').Point;

test('Board#getPieceByCoords', function (t) {
	t.plan(2);
	t.ok(standardPosition.board.getPieceByCoords(new Point(0, 0)));
	t.equal(standardPosition.board.getPieceByCoords(new Point(4, 4)), null);
});
