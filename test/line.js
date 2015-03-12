var test = require('tape');
var Line = require('../lib/line').Line;

test('Line class', function (t) {

	t.plan(3);

	var line = new Line()
		.move('e4').move('e5')
		.move('d4').move('exd4')
		.move('Qxd4')
	;

	t.equal(line.plyLength, 5);
	t.equal(line.length, 3);

  t.throws(function () {
    (new Line).annotate("there is no move to annotate.");
  }, "you can't annotate an empty line")


});