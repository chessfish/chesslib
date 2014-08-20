require('traceur/bin/traceur-runtime.js');
require('longjohn');

var test = require('tape');
var joinPath = require('path').join;
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var PGN = require('../lib/pgn.js').PGN;
var ChessError = require('../lib/error.js').ChessError;

test('PGN parser', function (t) {
	getPGNs().
		tap(function (pgns) {
			t.plan(pgns.length);
		}).
		map(PGN.parse).
		then(function () {
			t.ok(true, 'parsing ok');
		}).
		catch(ChessError, function (err) {
			console.error("Chess error! ");
			console.error("Last position: " + err.lastPosition);
			console.error(err.message);
			t.ok(false);
		})
	;
});

function getPGNs() {
	return (
		fs.readdirAsync(joinPath(__dirname, 'data/pgn')).
		map(function (filename) {
			return fs.readFileAsync(joinPath(__dirname, 'data/pgn', filename))
		}).
		map(String)
	);
}
