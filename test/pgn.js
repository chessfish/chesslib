require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var joinPath = require('path').join;
var PGN = require('../lib/pgn.js').PGN;
var ChessError = require('../lib/error.js').ChessError;
var util = require('./lib/util.js');

test('PGN parser', function (t) {
	util.getFiles(joinPath(__dirname, 'data/pgn')).
		tap(function (files) { t.plan(files.length); }).
		map(PGN.parse).
		map(function (games, i) {
			t.ok(games.length > 0, this.filenames[i]);
		}).
		catch(ChessError, function (err) {
			console.error("Chess error! ");
			console.error("Last position: " + err.lastPosition);
			console.error(err.message);
			t.ok(false);
		})
	;
});

test('invalid PGN', function (t) {

	var cheating = [
		'1. e5',
		'1. e4 dxe4',
		'1.e5 Nxe5',
	];
	t.plan(cheating.length);

	cheating.forEach(function (pgn) {
		t.throws(function () { PGN.parse(pgn); }, pgn);
	});
})
