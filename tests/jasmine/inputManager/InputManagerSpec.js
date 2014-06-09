describe("input manager", function() {
	var renderer = new Grape2D.CanvasRenderer({
			width: 1600,
			height: 900
		}),
		rendererDOM = renderer.getDOMElement(),
		im = new Grape2D.InputManager(renderer);

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

	function testMouseEvent(options) {
		describe(options.name, function() {
			var point = options.point || new Grape2D.Vector(100, 300),
				trigger = null,
				callback = function() {
					if (options.callback) {
						options.callback.apply(null, arguments);
					}
					trigger();
				},
				value = 0;

			it("add event", function() {
				expect(im[options.getBindStackFn]().length).toBe(options.addEvent.before);
				im[options.addFn](callback);
				expect(im[options.getBindStackFn]().length).toBe(options.addEvent.after);
			});

			it("trigger event", function(done) {
				trigger = done;
				rendererDOM.dispatchEvent(createSimpleMouseEvent(options.rawName, point.getX(), point.getY(), point.getX(), point.getY(), 0));
			});

			it("remove event", function() {
				expect(im[options.getBindStackFn]().length).toBe(options.removeEvent.before);
				im[options.removeFn](callback);
				expect(im[options.getBindStackFn]().length).toBe(options.removeEvent.after);
			});
		});
	}

	function testKeyEvent(options) {
		describe(options.name, function() {
			var key = options.key || Grape2D.InputManager.KEY.A,
				trigger = null,
				callback = function() {
					if (options.callback) {
						options.callback.apply(null, arguments);
					}
					trigger();
				},
				value = 0;

			it("add event", function() {
				expect(im[options.getBindStackFn]()[key]).toBe(options.addEvent.before);
				im[options.addFn](key, callback);
				expect(im[options.getBindStackFn]()[key].length).toBe(options.addEvent.after);
			});

			it("trigger event", function(done) {
				trigger = done;
				window.dispatchEvent(createKeyboardEvent(options.rawName, false, false, key));
			});

			it("remove event", function() {
				expect(im[options.getBindStackFn]()[key].length).toBe(options.removeEvent.before);
				im[options.removeFn](key, callback);
				expect(im[options.getBindStackFn]()[key].length).toBe(options.removeEvent.after);
			});
		});
	}

	testMouseEvent({
		name: "mouse down",
		rawName: "mousedown",
		getBindStackFn: "getMouseDownBindStack",
		addFn: "addMouseDown",
		removeFn: "removeMouseDown",
		addEvent: {
			before: 1,
			after: 2
		},
		removeEvent: {
			before: 2,
			after: 1
		}
	});

	testMouseEvent({
		name: "mouse up",
		rawName: "mouseup",
		getBindStackFn: "getMouseUpBindStack",
		addFn: "addMouseUp",
		removeFn: "removeMouseUp",
		addEvent: {
			before: 1,
			after: 2
		},
		removeEvent: {
			before: 2,
			after: 1
		}
	});

	testMouseEvent({
		name: "mouse move",
		rawName: "mousemove",
		getBindStackFn: "getMouseMoveBindStack",
		addFn: "addMouseMove",
		removeFn: "removeMouseMove",
		addEvent: {
			before: 1,
			after: 2
		},
		removeEvent: {
			before: 2,
			after: 1
		}
	});

	testMouseEvent({
		name: "click",
		rawName: "click",
		getBindStackFn: "getClickBindStack",
		addFn: "addClick",
		removeFn: "removeClick",
		addEvent: {
			before: 0,
			after: 1
		},
		removeEvent: {
			before: 1,
			after: 0
		}
	});

	testMouseEvent({
		name: "mouse over",
		rawName: "mouseover",
		getBindStackFn: "getMouseOverBindStack",
		addFn: "addMouseOver",
		removeFn: "removeMouseOver",
		addEvent: {
			before: 0,
			after: 1
		},
		removeEvent: {
			before: 1,
			after: 0
		}
	});

	testMouseEvent({
		name: "mouse out",
		rawName: "mouseout",
		getBindStackFn: "getMouseOutBindStack",
		addFn: "addMouseOut",
		removeFn: "removeMouseOut",
		addEvent: {
			before: 1,
			after: 2
		},
		removeEvent: {
			before: 2,
			after: 1
		}
	});

	// drags
	describe("drag start", function() {
		var point = new Grape2D.Vector(100, 300),
			p2 = new Grape2D.Vector(70, 310),
			trigger = null,
			callback = function(evnt) {
				expect(evnt.getDelta().getX()).toBe(-30);
				expect(evnt.getDelta().getY()).toBe(10);
				trigger();
			},
			value = 0;

		it("add event", function() {
			expect(im.getDragStartBindStack().length).toBe(0);
			im.addDragStart(callback);
			expect(im.getDragStartBindStack().length).toBe(1);
		});

		it("trigger event", function(done) {
			trigger = done;
			rendererDOM.dispatchEvent(createSimpleMouseEvent("mousedown", point.getX(), point.getY(), point.getX(), point.getY(), 0));
			rendererDOM.dispatchEvent(createSimpleMouseEvent("mousemove", p2.getX(), p2.getY(), p2.getX(), p2.getY(), 0));
			rendererDOM.dispatchEvent(createSimpleMouseEvent("mouseup", p2.getX(), p2.getY(), p2.getX(), p2.getY(), 0));
		});

		it("remove event", function() {
			expect(im.getDragStartBindStack().length).toBe(1);
			im.removeDragStart(callback);
			expect(im.getDragStartBindStack().length).toBe(0);
		});
	});

	describe("drag", function() {
		var point = new Grape2D.Vector(100, 300),
			p2 = new Grape2D.Vector(70, 310),
			trigger = null,
			callback = function(evnt) {
				expect(evnt.getDelta().getX()).toBe(-30);
				expect(evnt.getDelta().getY()).toBe(10);
				trigger();
			},
			value = 0;

		it("add event", function() {
			expect(im.getDragBindStack().length).toBe(0);
			im.addDrag(callback);
			expect(im.getDragBindStack().length).toBe(1);
		});

		it("trigger event", function(done) {
			trigger = done;
			rendererDOM.dispatchEvent(createSimpleMouseEvent("mousedown", point.getX(), point.getY(), point.getX(), point.getY(), 0));
			rendererDOM.dispatchEvent(createSimpleMouseEvent("mousemove", p2.getX(), p2.getY(), p2.getX(), p2.getY(), 0));
			rendererDOM.dispatchEvent(createSimpleMouseEvent("mouseup", p2.getX(), p2.getY(), p2.getX(), p2.getY(), 0));
		});

		it("remove event", function() {
			expect(im.getDragBindStack().length).toBe(1);
			im.removeDrag(callback);
			expect(im.getDragBindStack().length).toBe(0);
		});
	});

	describe("drag stop", function() {
		var point = new Grape2D.Vector(100, 300),
			p2 = new Grape2D.Vector(70, 310),
			trigger = null,
			callback = function(evnt) {
				//expect(evnt.getDelta().getX()).toBe(-30);
				//expect(evnt.getDelta().getY()).toBe(10);
				trigger();
			},
			value = 0;

		it("add event", function() {
			expect(im.getDragStopBindStack().length).toBe(0);
			im.addDragStop(callback);
			expect(im.getDragStopBindStack().length).toBe(1);
		});

		it("trigger event", function(done) {
			trigger = done;
			rendererDOM.dispatchEvent(createSimpleMouseEvent("mousedown", point.getX(), point.getY(), point.getX(), point.getY(), 0));
			rendererDOM.dispatchEvent(createSimpleMouseEvent("mousemove", p2.getX(), p2.getY(), p2.getX(), p2.getY(), 0));
			rendererDOM.dispatchEvent(createSimpleMouseEvent("mouseup", p2.getX(), p2.getY(), p2.getX(), p2.getY(), 0));
		});

		it("remove event", function() {
			expect(im.getDragStopBindStack().length).toBe(1);
			im.removeDragStop(callback);
			expect(im.getDragStopBindStack().length).toBe(0);
		});
	});

	testKeyEvent({
		name: "key up",
		rawName: "keyup",
		getBindStackFn: "getKeyUpBindStack",
		addFn: "addKeyUp",
		removeFn: "removeKeyUp",
		addEvent: {
			before: undefined,
			after: 1
		},
		removeEvent: {
			before: 1,
			after: 0
		}
	});

	testKeyEvent({
		name: "key down",
		rawName: "keydown",
		getBindStackFn: "getKeyDownBindStack",
		addFn: "addKeyDown",
		removeFn: "removeKeyDown",
		addEvent: {
			before: undefined,
			after: 1
		},
		removeEvent: {
			before: 1,
			after: 0
		}
	});

	testKeyEvent({
		name: "key press",
		rawName: "keypress",
		getBindStackFn: "getKeyPressBindStack",
		addFn: "addKeyPress",
		removeFn: "removeKeyPress",
		addEvent: {
			before: undefined,
			after: 1
		},
		removeEvent: {
			before: 1,
			after: 0
		}
	});

});