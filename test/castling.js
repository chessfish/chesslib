require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var FEN = require('../lib/fen.js').FEN;
var Point = require('../lib/point.js').Point;
var brands = require('../lib/brands.js');
var Point = require('../lib/point.js').Point;
var Castling = require('../lib/castling.js').Castling;
var squareName = require('../lib/util.js').squareName;

test('legal castling positions', function (t) {

  var whiteKingside = [
    'r1bqkbnr/pppp2pp/2n2p2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq 1 0',
  ]

  t.plan(whiteKingside.length * 3);

  whiteKingside.map(FEN.parse).forEach(function (position) {
    t.ok(position.castling.isLegal(brands.WHITE, brands.KINGSIDE));
    t.ok(position.pieceCoords(
      Castling.rook(position, brands.WHITE, brands.KINGSIDE)).
      equal(new Point(7, 7)));
    t.doesNotThrow(function () {
      var king = position.one({ brand: brands.KING, color: brands.WHITE });
      position.movePiece(king, position.pieceCoords(king).sum(new Point(2, 0)));
    })
  });
});