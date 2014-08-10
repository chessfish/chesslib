var window = require("global/window");
var extend = require("lodash.assign");

module.exports = DragEventHandler;

function DragEventHandler(fn, value) {
	if (!(this instanceof DragEventHandler)) {
		return new DragEventHandler(fn, value);
	}

	this.fn = fn;
	this.value = value || {};
}

DragEventHandler.prototype.handleEvent = function (ev) {
	const fn = this.fn;
	const value = this.value;

	const initialX = ev.offsetX || ev.layerX;
	const initialY = ev.offsetY || ev.layerY;

	const top = ev.currentTarget.parentNode.offsetTop;
	const left = ev.currentTarget.parentNode.offsetLeft;

	const board = ev.currentTarget.parentNode.parentNode.parentNode;

	function onmove(ev) {
		const absX = ev.clientX - initialX;
		const absY = ev.clientY - initialY;

		const offset = {
			absX,
			absY,
			x: absX - left,
			y: absY - top,
			boardWidth: board.offsetWidth,
			boardHeight: board.offsetHeight,
		}

		fn(extend(value, offset));
	}

	function onup(ev) {
		window.removeEventListener("mousemove", onmove);
		window.removeEventListener("mouseup", onup);
	}

	window.addEventListener("mousemove", onmove);
	window.addEventListener("mouseup", onup);
}
