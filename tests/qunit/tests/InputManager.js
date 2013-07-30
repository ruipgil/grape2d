/* global module, test, Grape2D, asyncTest, strictEqual, ok, start, equal */

function createMouseEvent(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget) {
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
	return evt;
}

function createSimpleMouseEvent(type, screenX, screenY, clientX, clientY, button) {
	return createMouseEvent(type, true, true, window, 0, screenX, screenY, clientX, clientY, false, false, false, false, button, null);
}

// This method to create a keyboard event is not recommended. However is the most
// stable across platforms.
function createKeyboardEvent(type, bubbles, cancelable, keyCodeArg) {
	var evt = document.createEvent("Event");
	evt.initEvent(type, bubbles, cancelable);
	evt.keyCode = keyCodeArg;
	return evt;
}

var renderer = new Grape2D.CanvasRenderer({
	width: 500,
	height: 500
}),
	rendererDOME = renderer.getDOMElement(),
	im = new Grape2D.InputManager(renderer);

module("Input Manager");
asyncTest("Mouse down", 4, function() {
	var point = new Grape2D.Vector(200, 300);
	var callback = function(ev) {
		ok(true, "Event triggered.");
		equal("mousedown", ev.getRaw().type, "Correct type.");
		ok(ev.getPosition().equals(point), "Same point.");
		im.removeMouseDown(callback);
		strictEqual(1, im.getMouseDownBindStack().length, "Callback removed.");
		start();
	};
	im.addMouseDown(callback);
	rendererDOME.dispatchEvent(createSimpleMouseEvent("mousedown", point.getX(), point.getY(), point.getX(), point.getY(), 0));
});

asyncTest("Mouse up", 4, function() {
	var point = new Grape2D.Vector(200, 300);
	var callback = function(ev) {
		ok(true, "Event triggered.");
		equal("mouseup", ev.getRaw().type, "Correct type.");
		ok(ev.getPosition().equals(point), "Same point.");
		im.removeMouseUp(callback);
		strictEqual(1, im.getMouseUpBindStack().length, "Callback removed.");
		start();
	};
	im.addMouseUp(callback);
	rendererDOME.dispatchEvent(createSimpleMouseEvent("mouseup", point.getX(), point.getY(), point.getX(), point.getY(), 0));
});

asyncTest("Mouse move", 4, function() {
	var point = new Grape2D.Vector(200, 300);
	var callback = function(ev) {
		ok(true, "Event triggered.");
		equal("mousemove", ev.getRaw().type, "Correct type.");
		ok(ev.getPosition().equals(point), "Same point.");
		im.removeMouseMove(callback);
		strictEqual(1, im.getMouseMoveBindStack().length, "Callback removed.");
		start();
	};
	im.addMouseMove(callback);
	rendererDOME.dispatchEvent(createSimpleMouseEvent("mousemove", point.getX(), point.getY(), point.getX(), point.getY(), 0));
});

asyncTest("Click", 4, function() {
	var point = new Grape2D.Vector(200, 300);
	var callback = function(ev) {
		ok(true, "Event triggered.");
		equal("click", ev.getRaw().type, "Correct type.");
		ok(ev.getPosition().equals(point), "Same point.");
		im.removeClick(callback);
		strictEqual(0, im.getClickBindStack().length, "Callback removed.");
		start();
	};
	im.addClick(callback);
	rendererDOME.dispatchEvent(createSimpleMouseEvent("click", point.getX(), point.getY(), point.getX(), point.getY(), 0));
});

asyncTest("Mouse over", 4, function() {
	var point = new Grape2D.Vector(200, 300);
	var callback = function(ev) {
		ok(true, "Event triggered.");
		equal("mouseover", ev.getRaw().type, "Correct type.");
		ok(ev.getPosition().equals(point), "Same point.");
		im.removeMouseOver(callback);
		strictEqual(0, im.getMouseOverBindStack().length, "Callback removed.");
		start();
	};
	im.addMouseOver(callback);
	rendererDOME.dispatchEvent(createSimpleMouseEvent("mouseover", point.getX(), point.getY(), point.getX(), point.getY(), 0));
});

asyncTest("Mouse out", 4, function() {
	var point = new Grape2D.Vector(200, 300);
	var callback = function(ev) {
		ok(true, "Event triggered.");
		equal("mouseout", ev.getRaw().type, "Correct type.");
		ok(ev.getPosition().equals(point), "Same point.");
		im.removeMouseOut(callback);
		strictEqual(1, im.getMouseOutBindStack().length, "Callback removed.");
		start();
	};
	im.addMouseOut(callback);
	rendererDOME.dispatchEvent(createSimpleMouseEvent("mouseout", point.getX(), point.getY(), point.getX(), point.getY(), 0));
});

asyncTest("Drag", 5, function() {
	var point = new Grape2D.Vector(200, 300),
		n = 0;
	var callback = function(ev) {
		console.log(ev, n);
		ok(true, "Event triggered.");
		ok(ev.getStart().equals(new Grape2D.Vector(200, 300)), "Correct start point.");
		ok(ev.getEnd().equals(new Grape2D.Vector(205, 300)), "Correct end point");
		ok(ev.getDelta().equals(new Grape2D.Vector(5, 0)), "Correct delta.")
		im.removeDrag(callback);
		strictEqual(0, im.getDragBindStack().length, "Callback removed.");
		start();
	};
	im.addDrag(callback);
	rendererDOME.dispatchEvent(createSimpleMouseEvent("mousedown", point.getX(), point.getY(), point.getX(), point.getY(), 0));
	point.setX(205);
	rendererDOME.dispatchEvent(createSimpleMouseEvent("mousemove", point.getX(), point.getY(), point.getX(), point.getY(), 0));
	rendererDOME.dispatchEvent(createSimpleMouseEvent("mouseup", point.getX(), point.getY(), point.getX(), point.getY(), 0));
});

asyncTest("Key down", 4, function() {
	var kc = Grape2D.InputManager.KEY.A,
		callback = function(ev) {
			ok(true, "Event triggered.");
			equal("keydown", ev.type, "Correct type.");
			equal(kc, ev.keyCode, "Same key.");
			im.removeKeyDown(kc, callback);
			strictEqual(im.getKeyDownBindStack()[ev.keyCode].length, 0, "Callback removed.");
			start();
		};
	im.addKeyDown(kc, callback);
	window.dispatchEvent(createKeyboardEvent("keydown", false, false, kc));
});

asyncTest("Key up", 4, function() {
	var kc = Grape2D.InputManager.KEY['A'],
		callback = function(ev) {
			ok(true, "Event triggered.");
			equal("keyup", ev.type, "Correct type.");
			equal(kc, ev.keyCode, "Same key.");
			im.removeKeyUp(kc, callback);
			strictEqual(im.getKeyUpBindStack()[ev.keyCode].length, 0, "Callback removed.");
			start();
		};
	im.addKeyUp(kc, callback);
	window.dispatchEvent(createKeyboardEvent("keyup", false, false, kc));
});

asyncTest("Key press", 4, function() {
	var kc = Grape2D.InputManager.KEY['A'],
		callback = function(ev) {
			ok(true, "Event triggered.");
			equal("keypress", ev.type, "Correct type.");
			equal(kc, ev.keyCode, "Same key.");
			im.removeKeyPress(kc, callback);
			strictEqual(im.getKeyPressBindStack()[ev.keyCode].length, 0, "Callback removed.");
			start();
		};
	im.addKeyPress(kc, callback);
	window.dispatchEvent(createKeyboardEvent("keypress", false, false, kc));
});