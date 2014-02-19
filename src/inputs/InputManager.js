/**
 * Managers inputs, giving an easy to use interface.
 *   An input manager can only be listening to a single renderer
 *   at once.
 *
 * @param  {!Grape2D.Renderer} renderer Renderer to listen.
 * @constructor
 */
Grape2D.InputManager = function(renderer) {
	/**
	 * Mouse up callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseUp = [];
	/**
	 * Mouse down callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseDown = [];
	/**
	 * Mouse move callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseMove = [];
	/**
	 * Mouse over callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseOver = [];
	/**
	 * Mouse out callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseOut = [];
	/**
	 * Mouse wheel callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseWheel = [];
	/**
	 * Click callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.click = [];
	/**
	 * Start drag callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.dragStartClbk = [];
	/**
	 * Drag callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.drag = [];
	/**
	 * Stop drag callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.dragStop = [];
	/**
	 * Start dragging position.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.dragStart = new Grape2D.Vector();
	/**
	 * Dragging state.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.isDragging = false;
	/**
	 * Resize callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.resize = [];
	/**
	 * Key down callback stack.
	 *
	 * @type {!Object.<number, !Array.<Function>>}
	 * @private
	 */
	this.keyDown = {};
	/**
	 * Key up callback stack.
	 *
	 * @type {!Object.<number, !Array.<Function>>}
	 * @private
	 */
	this.keyUp = {};
	/**
	 * Key press callback stack.
	 *
	 * @type {!Object.<number, !Array.<Function>>}
	 * @private
	 */
	this.keyPress = {};
	/**
	 * Renderer
	 *
	 * @type {!Grape2D.Renderer}
	 * @private
	 */
	this.rendererBinding = renderer;
	//binds this input manager to the renderer.
	this.bindToRenderer(renderer);
};

Grape2D.InputManager.prototype = {
	constructor: Grape2D.InputManager,
	/**
	 * Binds the renderer to this input manager. Sets up helper functions
	 *   and callbacks.
	 *
	 * @param  {!Grape2D.Renderer} renderer The renderer to listen.
	 * @public
	 */
	bindToRenderer: function(renderer) {
		//if there is a rendererBinding then remove events
		this.rendererBinding = renderer;
		/**
		 * DOM Element
		 *
		 * @type {!Element}
		 */
		var dom = this.rendererBinding.getDOMElement();
		var that = this;

		dom.addEventListener('mouseup', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseUp), false);
		dom.addEventListener('mousedown', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseDown), false);
		dom.addEventListener('mousemove', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseMove), false);
		dom.addEventListener('mouseover', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseOver), false);
		dom.addEventListener('mouseout', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseOut), false);
		dom.addEventListener('mousewheel', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseWheel), false);
		dom.addEventListener('click', Grape2D.InputManager.bindFn(this.rendererBinding, this.click), false);

		//add helper fns for drag
		this.addMouseDown(function(e) {
			that.dragStart.set(e.getPosition());
			that.isDragging = true;
		});
		var dragExecuted = false;
		this.addMouseMove(function(e) {
			if (that.isDragging) {
				var end = new Grape2D.Vector(e.getRaw().pageX, e.getRaw().pageY),
					ev = new Grape2D.InputManagerDragEvent(e.getRaw(), that.dragStart),
					list = that.getDragBindStack();
				for (var i = 0; i < list.length; i++) {
					list[i](ev);
				}
				that.dragStart.set(end);
				if(!dragExecuted){
					var startList = that.dragStartClbk;
					for(var j=0; j<startList.length; j++){
						startList[j](ev);
					}
				}
				dragExecuted = true;
			}
		});
		this.addMouseUp(function(e) {
			if(that.isDragging && dragExecuted){
				var list = that.dragStop,
					end = new Grape2D.Vector(e.getRaw().pageX, e.getRaw().pageY),
					ev = new Grape2D.InputManagerDragEvent(e.getRaw(), that.dragStart);
				for(var i=0; i<list.length; i++){
					list[i](ev);
				}
			}
			that.isDragging = false;
			dragExecuted = false;
		});
		this.addMouseOut(function(e) {
			if(that.isDragging && dragExecuted){
				var list = that.dragStop,
					end = new Grape2D.Vector(e.getRaw().pageX, e.getRaw().pageY),
					ev = new Grape2D.InputManagerDragEvent(e.getRaw(), that.dragStart);
				for(var i=0; i<list.length; i++){
					list[i](ev);
				}
			}
			that.isDragging = false;
			dragExecuted = false;
		});
	},
	/**
	 * Gets the mouse up callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseUpBindStack: function() {
		return this.mouseUp;
	},
	/**
	 * Adds a callback to the mouse up event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseUp: function(callback) {
		this.mouseUp.push(callback);
	},
	/**
	 * Removes a callback from the mouse up callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseUp: function(callback) {
		var indx = this.mouseUp.indexOf(callback);
		if (indx >= 0) {
			this.mouseUp.splice(this.mouseUp.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse down callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseDownBindStack: function() {
		return this.mouseDown;
	},
	/**
	 * Adds a callback to the mouse down event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseDown: function(callback) {
		this.mouseDown.push(callback);
	},
	/**
	 * Removes a callback from the mouse down callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseDown: function(callback) {
		var indx = this.mouseDown.indexOf(callback);
		if (indx >= 0) {
			this.mouseDown.splice(this.mouseDown.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse move callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseMoveBindStack: function() {
		return this.mouseMove;
	},
	/**
	 * Adds a callback to the mouse move event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseMove: function(callback) {
		this.mouseMove.push(callback);
	},
	/**
	 * Removes a callback from the mouse move callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseMove: function(callback) {
		var indx = this.mouseMove.indexOf(callback);
		if (indx >= 0) {
			this.mouseMove.splice(this.mouseMove.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse over callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseOverBindStack: function() {
		return this.mouseOver;
	},
	/**
	 * Adds a callback to the mouse over event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseOver: function(callback) {
		this.mouseOver.push(callback);
	},
	/**
	 * Removes a callback from the mouse over callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseOver: function(callback) {
		var indx = this.mouseOver.indexOf(callback);
		if (indx >= 0) {
			this.mouseOver.splice(this.mouseOver.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse out callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseOutBindStack: function() {
		return this.mouseOut;
	},
	/**
	 * Adds a callback to the mouse out event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseOut: function(callback) {
		this.mouseOut.push(callback);
	},
	/**
	 * Removes a callback from the mouse out callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseOut: function(callback) {
		var indx = this.mouseOut.indexOf(callback);
		if (indx >= 0) {
			this.mouseOut.splice(this.mouseOut.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse wheel callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseWheelBindStack: function() {
		return this.mouseWheel;
	},
	/**
	 * Adds a callback to the mouse wheel event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseWheel: function(callback) {
		this.mouseWheel.push(callback);
	},
	/**
	 * Removes a callback from the mouse wheel callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseWheel: function(callback) {
		var indx = this.mouseWheel.indexOf(callback);
		if (indx >= 0) {
			this.mouseWheel.splice(this.mouseWheel.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the resize callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getResizeBindStack: function() {
		return this.resize;
	},
	/**
	 * Adds a callback to the resize event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addResize: function(callback) {
		this.resize.push(callback);
		Grape2D.InputManager.registerGlobalResize(callback);
	},
	/**
	 * Removes a callback from the resize callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeResize: function(key, callback) {
		var indx = this.resize.indexOf(callback);
		if (indx >= 0) {
			this.resize.splice(this.resize.indexOf(callback), 1);
		}
		Grape2D.InputManager.unregisterGlobalResize(callback);
	},
	/**
	 * Gets the key down callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Object.<number, !Array.<Function>>} Callback stack.
	 * @public
	 */
	getKeyDownBindStack: function() {
		return this.keyDown;
	},
	/**
	 * Adds a callback to the key down event.
	 *
	 * @param  {!number} key Key code that triggers the callback.
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addKeyDown: function(key, callback) {
		if (!this.keyDown[key]) {
			this.keyDown[key] = [];
		}
		this.keyDown[key].push(callback);
		Grape2D.InputManager.registerGlobalKeyDown(key, callback);
	},
	/**
	 * Removes a callback from the key down callback stack.
	 *
	 * @param  {!number} key Key code of the key that triggers the
	 *   callback.
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeKeyDown: function(key, callback) {
		if (!this.keyDown[key]) {
			return;
		}
		var indx = this.keyDown[key].indexOf(callback);
		if (indx >= 0) {
			this.keyDown[key].splice(indx, 1);
			Grape2D.InputManager.unregisterGlobalKeyDown(key, callback);
		}
	},
	/**
	 * Gets the key up callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Object.<number, !Array.<Function>>} Callback stack.
	 * @public
	 */
	getKeyUpBindStack: function() {
		return this.keyDown;
	},
	/**
	 * Adds a callback to the key up event.
	 *
	 * @param  {!number} key Key code that triggers the callback.
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addKeyUp: function(key, callback) {
		if (!this.keyUp[key]) {
			this.keyUp[key] = [];
		}
		this.keyUp[key].push(callback);
		Grape2D.InputManager.registerGlobalKeyUp(key, callback);
	},
	/**
	 * Removes a callback from the key up callback stack.
	 *
	 * @param  {!number} key Key code of the key that triggers the
	 *   callback.
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeKeyUp: function(key, callback) {
		if (!this.keyUp[key]) {
			return;
		}
		var indx = this.keyUp[key].indexOf(callback);
		if (indx >= 0) {
			this.keyUp[key].splice(indx, 1);
			Grape2D.InputManager.unregisterGlobalKeyUp(key, callback);
		}
	},
	/**
	 * Gets the key press callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Object.<number, !Array.<Function>>} Callback stack.
	 * @public
	 */
	getKeyPressBindStack: function() {
		return this.keyPress;
	},
	/**
	 * Adds a callback to the key press event.
	 *
	 * @param  {!number} key Key code that triggers the callback.
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addKeyPress: function(key, callback) {
		if (!this.keyPress[key]) {
			this.keyPress[key] = [];
		}
		this.keyPress[key].push(callback);
		Grape2D.InputManager.registerGlobalKeyPress(key, callback);
	},
	/**
	 * Removes a callback from the key press callback stack.
	 *
	 * @param  {!number} key Key code of the key that triggers the
	 *   callback.
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeKeyPress: function(key, callback) {
		if (!this.keyPress[key]) {
			return;
		}
		var indx = this.keyPress[key].indexOf(callback);
		if (indx >= 0) {
			this.keyPress[key].splice(indx, 1);
			Grape2D.InputManager.unregisterGlobalKeyPress(key, callback);
		}
	},
	/**
	 * Gets the drag callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getDragBindStack: function() {
		return this.drag;
	},
	/**
	 * Adds a callback to be executed after the drag event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addDragStart: function(callback) {
		this.dragStartClbk.push(callback);
	},
	/**
	 * Adds a callback to the drag event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addDrag: function(callback) {
		this.drag.push(callback);
	},
	/**
	 * Adds a callback to be executed after the drag event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addDragStop: function(callback) {
		this.dragStop.push(callback);
	},
	/**
	 * Removes a callback from the drag callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeDrag: function(callback) {
		var indx = this.drag.indexOf(callback);
		if (indx >= 0) {
			this.drag.splice(this.drag.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the click callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getClickBindStack: function() {
		return this.click;
	},
	/**
	 * Adds a callback to the click event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addClick: function(callback) {
		this.click.push(callback);
	},
	/**
	 * Removes a callback from the click callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeClick: function(callback) {
		var indx = this.click.indexOf(callback);
		if (indx >= 0) {
			this.click.splice(this.click.indexOf(callback), 1);
		}
	}
};
/**
 * This function creates a callback function to be
 *   called when a keyboard event occurs.
 *
 * @param  {!Grape2D.Renderer} binding Renderer where the input
 *   manager is bound.
 * @param  {!Array.<Function>} stck List of references to an input
 *   manager callback stack.
 * @return {!Function} Callback to an event.
 * @protected
 * @static
 */
Grape2D.InputManager.bindFn = function(binding, stck) {
	var fn = function(ev) {
		var i = 0,
			evnt = new Grape2D.InputManagerMouseEvent(ev);
		for (; i < stck.length; i++) {
			stck[i](evnt);
		}
	};

	return fn;
};
/**
 * Registers a global callback function, to the resize event. A
 *   resize event is triggered by the window, not the renderer, binded.
 *
 * @param  {!Function} callback Callback to register.
 * @private
 */
Grape2D.InputManager.registerGlobalResize = function(callback) {
	Grape2D.InputManager.globalRegistry.resize.push(callback);
};
/**
 * Unregisters a global callback function, to the resize event, that
 *   has been already registered.
 *
 * @param  {!Function} callback Callback to unregister.
 * @private
 */
Grape2D.InputManager.unregisterGlobalResize = function(callback) {
	var indx = Grape2D.InputManager.globalRegistry.resize.indexOf(callback);
	if (indx >= 0) {
		Grape2D.InputManager.globalRegistry.resize.splice(indx, 1);
	}
};
/**
 * Registers a global callback function, to the key down event. A
 *   key down event is triggered by the window, not the renderer,
 *   binded.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to register.
 * @private
 */
Grape2D.InputManager.registerGlobalKeyDown = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyDown[key]) {
		Grape2D.InputManager.globalRegistry.keyDown[key] = [];
	}
	Grape2D.InputManager.globalRegistry.keyDown[key].push(callback);
};
/**
 * Unregisters a global callback function, to the key down event, that
 *   has been already registered.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to unregister.
 * @private
 */
Grape2D.InputManager.unregisterGlobalKeyDown = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyDown[key]) {
		return;
	}
	var indx = Grape2D.InputManager.globalRegistry.keyDown[key].indexOf(callback);
	if (indx >= 0) {
		Grape2D.InputManager.globalRegistry.keyDown[key].splice(indx, 1);
	}
};
/**
 * Registers a global callback function, to the key up event. A
 *   key up event is triggered by the window, not the renderer,
 *   binded.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to register.
 * @private
 */
Grape2D.InputManager.registerGlobalKeyUp = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyUp[key]) {
		Grape2D.InputManager.globalRegistry.keyUp[key] = [];
	}
	Grape2D.InputManager.globalRegistry.keyUp[key].push(callback);
};
/**
 * Unregisters a global callback function, to the key up event, that
 *   has been already registered.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to unregister.
 * @private
 */
Grape2D.InputManager.unregisterGlobalKeyUp = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyUp[key]) {
		return;
	}
	var indx = Grape2D.InputManager.globalRegistry.keyUp[key].indexOf(callback);
	if (indx >= 0) {
		Grape2D.InputManager.globalRegistry.keyUp[key].splice(indx, 1);
	}
};
/**
 * Registers a global callback function, to the key press event. A
 *   key press event is triggered by the window, not the renderer,
 *   binded.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to register.
 * @private
 */
Grape2D.InputManager.registerGlobalKeyPress = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyPress[key]) {
		Grape2D.InputManager.globalRegistry.keyPress[key] = [];
	}
	Grape2D.InputManager.globalRegistry.keyPress[key].push(callback);
};
/**
 * Unregisters a global callback function, to the key press event, that
 *   has been already registered.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to unregister.
 * @private
 */
Grape2D.InputManager.unregisterGlobalKeyPress = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyPress[key]) {
		return;
	}
	var indx = Grape2D.InputManager.globalRegistry.keyPress[key].indexOf(callback);
	if (indx >= 0) {
		Grape2D.InputManager.globalRegistry.keyPress[key].splice(indx, 1);
	}
};
/**
 * Returns a function that dispatches the callbacks associated with
 *   key codes.
 *
 * @param  {!Object.<number, Function>} stck Object with the callbacks
 *   associated with the key codes.
 * @return {!Function} Dispatcher function.
 * @private
 */
Grape2D.InputManager.keyDispatcher = function(stck) {
	var kDispFn = function(ev) {
		var key = ev.keyCode;
		if (stck[key]) {
			for (var i = 0; i < stck[key].length; i++) {
				stck[key][i](ev);
			}
		}
	};
	return kDispFn;
};
/**
 * Returns a function that dispatches the callbacks associated with
 *   resize event.
 *
 * @return {!Function} Dispatcher function.
 * @private
 */
Grape2D.InputManager.resizeDispatcher = function() {
	var rDispFn = function(ev) {
		for (var i = 0; i < Grape2D.InputManager.globalRegistry.resize.length; i++) {
			Grape2D.InputManager.globalRegistry.resize[i](ev);
		}
	};
	return rDispFn;
};
/**
 * Setups globals callbacks. It must be called once for this to work.
 *
 * @public
 */
Grape2D.InputManager.setupGlobals = function() {
	if (!Grape2D.NODE) {
		window.addEventListener('resize', Grape2D.InputManager.resizeDispatcher(), false);
		window.addEventListener('keyup', Grape2D.InputManager.keyDispatcher(Grape2D.InputManager.globalRegistry.keyUp), false);
		window.addEventListener('keydown', Grape2D.InputManager.keyDispatcher(Grape2D.InputManager.globalRegistry.keyDown), false);
		window.addEventListener('keypress', Grape2D.InputManager.keyDispatcher(Grape2D.InputManager.globalRegistry.keyPress), false);
	}
};
/**
 * Registry of non-specific events.
 *
 * @type {!Object.<string, !(Array.<!Function>|Object.<number, Function>)>}
 * @private
 * @static
 */
Grape2D.InputManager.globalRegistry = {
	resize: [],
	keyDown: {},
	keyUp: {},
	keyPress: {}
};
/**
 * Key map partially from {@link https://github.com/bitwalker/keys.js}
 *
 * @constant {!Object.<string, number>}
 * @public
 */
Grape2D.InputManager.KEY = {
	'A': 65,
	'B': 66,
	'C': 67,
	'D': 68,
	'E': 69,
	'F': 70,
	'G': 71,
	'H': 72,
	'I': 73,
	'J': 74,
	'K': 75,
	'L': 76,
	'M': 77,
	'N': 78,
	'O': 79,
	'P': 80,
	'Q': 81,
	'R': 82,
	'S': 83,
	'T': 84,
	'U': 85,
	'V': 86,
	'W': 87,
	'X': 88,
	'Y': 89,
	'Z': 90,
	'0': 48,
	'1': 49,
	'2': 50,
	'3': 51,
	'4': 52,
	'5': 53,
	'6': 54,
	'7': 55,
	'8': 56,
	'9': 57,
	'Numpad 0': 96,
	'Numpad 1': 97,
	'Numpad 2': 98,
	'Numpad 3': 99,
	'Numpad 4': 100,
	'Numpad 5': 101,
	'Numpad 6': 102,
	'Numpad 7': 103,
	'Numpad 8': 104,
	'Numpad 9': 105,
	'F1': 112,
	'F2': 113,
	'F3': 114,
	'F4': 115,
	'F5': 116,
	'F6': 117,
	'F7': 118,
	'F8': 119,
	'F9': 120,
	'F10': 121,
	'F11': 122,
	'F12': 123,
	'Backspace': 8,
	'Tab': 9,
	'Enter': 13,
	'SHIFT': 16,
	'CTRL': 17,
	'ALT': 18,
	'META': 91,
	'META_RIGHT': 93,
	'Caps Lock': 20,
	'Esc': 27,
	'Spacebar': 32,
	'Page Up': 33,
	'Page Down': 34,
	'End': 35,
	'Home': 36,
	'Left': 37,
	'Up': 38,
	'Right': 39,
	'Down': 40,
	'Insert': 45,
	'Delete': 46,
	'Num Lock': 144,
	'ScrLk': 145,
	'Pause/Break': 19,
};
//setup the global callbacks
Grape2D.InputManager.setupGlobals();