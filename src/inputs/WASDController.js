/**
 * An WASD controller is a top-level way to control input.
 *   This allows for a easier way to capture W, A, S, D keys.
 *   This is mostly used to control movement, so with that
 *   in mind, the keys pairs W and S can't have the same state
 *   at the same time, the same goes for the pair A and D.
 *   However it possible to have W with the same state as either
 *   A or D, but not both. Again, the same goes for S.
 *   If a key it's press, lets say W, and it's opposite is also
 *   pressed, in this case S, the controller keeps the state that
 *   indicated that W is pressed. But when the key W is lifted
 *   up (key up event), the controller waits for the next event,
 *   and S is not automatically press (for the controller).
 *
 * @param  {!Grape2D.Renderer} renderer Renderer to bind the events.
 * @constructor
 */
Grape2D.WASDController = function(renderer) {
	/**
	 * 'W' key is locked/pressed.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.wLock = false;
	/**
	 * 'A' key is locked/pressed.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.aLock = false;
	/**
	 * 'S' key is locked/pressed.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.sLock = false;
	/**
	 * 'D' key is locked/pressed.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.dLock = false;
	/**
	 * Input manager.
	 *
	 * @type {!Grape2D.InputManager}
	 * @private
	 */
	this.im = new Grape2D.InputManager(renderer);
	var that = this;
	// W key handlers
	this.im.addKeyDown(Grape2D.InputManager.KEY.W, function() {
		if (!that.sLock && !that.wLock) {
			that.w();
			that.wLock = true;
		}
	});
	this.im.addKeyUp(Grape2D.InputManager.KEY.W, function() {
		if(that.wLock){
			that.wUp();
		}
		that.wLock = false;
	});
	// S key handlers
	this.im.addKeyDown(Grape2D.InputManager.KEY.S, function() {
		if (!that.wLock && !that.sLock) {
			that.s();
			that.sLock = true;
		}
	});
	this.im.addKeyUp(Grape2D.InputManager.KEY.S, function() {
		if(that.sLock){
			that.sUp();
		}
		that.sLock = false;
	});
	// A key handlers
	this.im.addKeyDown(Grape2D.InputManager.KEY.A, function() {
		if (!that.dLock && !that.aLock) {
			that.a();
			that.aLock = true;
		}
	});
	this.im.addKeyUp(Grape2D.InputManager.KEY.A, function() {
		if(that.aLock){
			that.aUp();
		}
		that.aLock = false;
	});
	// D key handlers
	this.im.addKeyDown(Grape2D.InputManager.KEY.D, function() {
		if (!that.aLock && !that.dLock) {
			that.d();
			that.dLock = true;
		}
	});
	this.im.addKeyUp(Grape2D.InputManager.KEY.D, function() {
		if(that.dLock){
			that.dUp();
		}
		that.dLock = false;
	});
};

Grape2D.WASDController.prototype = {
	constructor: Grape2D.WASDController,
	/**
	 * Action for the 'W' key.
	 *
	 * @public
	 */
	w: function() {},
	/**
	 * Action for when the 'W' keys is released.
	 *
	 * @public
	 */
	wUp: function() {},
	/**
	 * Checks if the key 'W' is pressed.
	 *
	 * @return {!boolean} True if it's pressed.
	 * @public
	 */
	isW: function() {
		return this.wLock;
	},
	/**
	 * Action for the 'A' key.
	 *
	 * @public
	 */
	a: function() {},
	/**
	 * Action for when the 'A' keys is released.
	 *
	 * @public
	 */
	aUp: function() {},
	/**
	 * Checks if the key 'A' is pressed.
	 *
	 * @return {!boolean} True if it's pressed.
	 * @public
	 */
	isA: function() {
		return this.aLock;
	},
	/**
	 * Action for the 'S' key.
	 *
	 * @public
	 */
	s: function() {},
	/**
	 * Action for when the 'S' keys is released.
	 *
	 * @public
	 */
	sUp: function() {},
	/**
	 * Checks if the key 'S' is pressed.
	 *
	 * @return {!boolean} True if it's pressed.
	 * @public
	 */
	isS: function() {
		return this.sLock;
	},
	/**
	 * Action for the 'D' key.
	 *
	 * @public
	 */
	d: function() {},
	/**
	 * Action for when the 'D' keys is released.
	 *
	 * @public
	 */
	dUp: function() {},
	/**
	 * Checks if the key 'D' is pressed.
	 *
	 * @return {!boolean} True if it's pressed.
	 * @public
	 */
	isD: function() {
		return this.dLock;
	}
};