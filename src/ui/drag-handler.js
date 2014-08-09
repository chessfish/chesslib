var window = require("global/window")
var extend = require("lodash.assign")

module.exports = DragEventHandler

function DragEventHandler(fn, value) {
    if (!(this instanceof DragEventHandler)) {
        return new DragEventHandler(fn, value)
    }

    this.fn = fn
    this.value = value || {}
}

DragEventHandler.prototype.handleEvent = function (ev) {
    var fn = this.fn
    var value = this.value

    var initialX = ev.offsetX || ev.layerX
    var initialY = ev.offsetY || ev.layerY

    var top = ev.currentTarget.parentNode.offsetTop;
    var left = ev.currentTarget.parentNode.offsetLeft;

    function onmove(ev) {
        var offset = {
            x: ev.clientX - initialX - left,
            y: ev.clientY - initialY - top,
        }

        fn(extend(value, offset))

    }

    function onup(ev) {
        window.removeEventListener("mousemove", onmove)
        window.removeEventListener("mouseup", onup)
    }

    window.addEventListener("mousemove", onmove)
    window.addEventListener("mouseup", onup)
}
