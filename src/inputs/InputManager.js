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
	 * Resize callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.resize = [];
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

		dom.addEventListener('mouseup', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseUp), false);
		dom.addEventListener('mousedown', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseDown), false);
		dom.addEventListener('mousemove', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseMove), false);
		dom.addEventListener('mouseover', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseOver), false);
		dom.addEventListener('mouseout', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseOut), false);
		dom.addEventListener('mousewheel', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseWheel), false);
		dom.addEventListener('resize', Grape2D.InputManager.bindFn(this.rendererBinding, this.resize), false);

		//add fns for click and drag

		//register them globally
		//Grape2D.InputManager.registerGlobal('keydown', Grape2D.InputManager.clickBind(this));
		/*dom.addEventListener('keydown', Grape2D.InputManager.clickBind(this));
		dom.addEventListener('keyup', Grape2D.InputManager.clickBind(this));
		dom.addEventListener('keypress', Grape2D.InputManager.clickBind(this));*/
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
		if (indx >= 1) {
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
		if (indx >= 1) {
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
		if (indx >= 1) {
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
		if (indx >= 1) {
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
		if (indx >= 1) {
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
		if (indx >= 1) {
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
	},
	/**
	 * Removes a callback from the resize callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeResize: function(callback) {
		var indx = this.resize.indexOf(callback);
		if (indx >= 1) {
			this.resize.splice(this.resize.indexOf(callback), 1);
		}
	}

};
/**
 * This function creates a callback function to be
 *   called when an event occurs.
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
			evnt = new Grape2D.InputManagerEvent(binding, ev);
		for (; i < stck.length; i++) {
			stck[i](evnt);
		}
	};

	return fn;
};
/**
 * Registry of non-spcific events.
 *
 * @type {!Object}
 * @private
 * @static
 */
Grape2D.InputManager.globalRegistry = {
	keyDown: {},
	keyUp: {},
	keyPress: {}
};