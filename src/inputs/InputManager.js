/* global Grape2D */
/**
 * Managers inputs.
 *
 * @param  {!Grape2D.Renderer} renderer Renderer to listen.
 *
 * @constructor
 */
Grape2D.InputManager = function(renderer) {

	this.mouseUp = [];
	this.mouseDown = [];
	this.mouseMove = [];
	this.mouseOver = [];
	this.mouseOut = [];
	this.mouseWheel = [];
	this.resize = [];
	/**
	 * Renderer
	 *
	 * @type {!Grape2D.Renderer}
	 * @private
	 */
	this.rendererBinding = renderer;
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
	getMouseUpBindStack: function() {
		return this.mouseUp;
	},
	addMouseUp: function(callback) {
		this.mouseUp.push(callback);
	},
	removeMouseUp: function(callback) {
		var indx = this.mouseUp.indexOf(callback);
		if (indx >= 1) {
			this.mouseUp.splice(this.mouseUp.indexOf(callback), 1);
		}
	},
	getMouseDownBindStack: function() {
		return this.mouseDown;
	},
	addMouseDown: function(callback) {
		this.mouseDown.push(callback);
	},
	removeMouseDown: function(callback) {
		var indx = this.mouseDown.indexOf(callback);
		if (indx >= 1) {
			this.mouseDown.splice(this.mouseDown.indexOf(callback), 1);
		}
	},
	getMouseMoveBindStack: function() {
		return this.mouseMove;
	},
	addMouseMove: function(callback) {
		this.mouseMove.push(callback);
	},
	removeMouseMove: function(callback) {
		var indx = this.mouseMove.indexOf(callback);
		if (indx >= 1) {
			this.mouseMove.splice(this.mouseMove.indexOf(callback), 1);
		}
	},
	getMouseOverBindStack: function() {
		return this.mouseOver;
	},
	addMouseOver: function(callback) {
		this.mouseOver.push(callback);
	},
	removeMouseOver: function(callback) {
		var indx = this.mouseOver.indexOf(callback);
		if (indx >= 1) {
			this.mouseOver.splice(this.mouseOver.indexOf(callback), 1);
		}
	},
	getMouseOutBindStack: function() {
		return this.mouseOut;
	},
	addMouseOut: function(callback) {
		this.mouseOut.push(callback);
	},
	removeMouseOut: function(callback) {
		var indx = this.mouseOut.indexOf(callback);
		if (indx >= 1) {
			this.mouseOut.splice(this.mouseOut.indexOf(callback), 1);
		}
	},
	getMouseWheelBindStack: function() {
		return this.mouseWheel;
	},
	addMouseWheel: function(callback) {
		this.mouseWheel.push(callback);
	},
	removeMouseWheel: function(callback) {
		var indx = this.mouseWheel.indexOf(callback);
		if (indx >= 1) {
			this.mouseWheel.splice(this.mouseWheel.indexOf(callback), 1);
		}
	},
	getResizeBindStack: function() {
		return this.resize;
	},
	addResize: function(callback) {
		this.resize.push(callback);
	},
	removeResize: function(callback) {
		var indx = this.resize.indexOf(callback);
		if (indx >= 1) {
			this.resize.splice(this.resize.indexOf(callback), 1);
		}
	}

};

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

Grape2D.InputManager.globalRegistry = {
	keyDown: {},
	keyUp: {},
	keyPress: {}
};