var test = require('tape');
var FEN = require('../lib/codec/fen.js').FEN;
var brands = require('../lib/brands.js');

test('position: checks', function (t) {
  var checks = [
    {
      fen:'r2qrk2/pp1bpQ2/3p4/8/2BnP1p1/2N2P2/PPP5/2KR4 b - -',
      color: brands.BLACK,
    },
    {
      fen: '2k2bnr/p1p2p2/1pb4p/6p1/2P5/1Q1rP1PP/PP6/3KBq2 w - -',
      color: brands.WHITE,
    },
    {
      fen: '8/4k3/pp1b2p1/3PNp2/2P1K1R1/Pr6/8/8 w - f6',
      color: brands.WHITE,
    }
    // TODO: add a shitload more tests.
  ];

  t.plan(checks.length);

  checks.forEach(function (check) {
    t.ok(FEN.parse(check.fen).isCheck(check.color),
      'it identifies the position as check');
  });
});


test('not checks', function (t) {
  var notChecks = [
    {
      fen: '3R4/pkp2ppp/1p6/2q5/8/5P1P/PP4P1/2rR3K w - -'
    },
    {
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6'
    }
  ];

  t.plan(notChecks.length * 2);

  notChecks.forEach(function (notCheck) {
    t.notOk(FEN.parse(notCheck.fen).isCheck(brands.WHITE),
      'it identifies the position as not check for WHITE');
    t.notOk(FEN.parse(notCheck.fen).isCheck(brands.BLACK),
      'it identifies the position as not check for BLACK');
  });
});