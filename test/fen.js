require('traceur/bin/traceur-runtime.js');

var test = require('tape');

var Fen = require('../lib/fen.js').Fen;

test('it can read a FEN from a string', function (t) {
  t.plan(2);

  // var initialPosition = new Fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  // console.log(initialPosition);

  var after1e4Fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
  var after1e4 = new Fen(after1e4Fen);

  t.equal(after1e4Fen, after1e4.fen);

  var myWin = new Fen('2kr1bnr/1pp2ppp/p7/2pP4/6P1/2N2Q1P/PPP2PK1/R1B1q3 w - -');
  console.log(myWin.position.readableText);

  t.ok(true);
});