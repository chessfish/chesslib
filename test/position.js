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
    }
  ];

  t.plan(checks.length);

  checks.forEach(function (check) {
    t.ok(FEN.parse(check.fen).isCheck(check.color), 'it identifies the position as check');
  });
})