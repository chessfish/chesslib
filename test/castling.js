require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var FEN = require('../lib/codec/fen.js').FEN;
var brands = require('../lib/brands.js');
var Point = require('../lib/point.js').Point;
var Castling = require('../lib/piece/king/castling.js').Castling;

test('legal castling positions', function (t) {

  var whiteKingside = [
    'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 5 1',
  ]

  t.plan(whiteKingside.length * 2);

  whiteKingside.map(FEN.parse).forEach(function (position) {
    t.ok(position.castling.isLegal(brands.WHITE, brands.KINGSIDE));
    t.ok(position.pieceCoords(
      Castling.rook(position, brands.WHITE, brands.KINGSIDE)).
      equal(new Point(7, 7)));
  });
});