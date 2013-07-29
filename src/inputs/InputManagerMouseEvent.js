/**
 * Mouse event.
 *
 * @param  {!Event} rawEvent Raw DOM event.
 * @extends {Grape2D.InputManagerEvent}
 * @constructor
 */
Grape2D.InputManagerMouseEvent = function(rawEvent){
	Grape2D.InputManagerEvent.call(this, rawEvent);
	var bb = rawEvent.target.getBoundingClientRect();
	/**
	 * Place where the drag event happened. It should be a DOM element
	 *   associated with a {Grape2D.Renderer}.
	 *
	 * @type {EventTarget}
	 * @private
	 */
	this.target = rawEvent.target;
	/**
	 * Position relative to the renderer, where the event was triggered.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector(rawEvent.clientX-bb.left, rawEvent.clientY-bb.top);
	/**
	 * Button that was pressed to trigger the event.
	 * <ol>
	 * <li>Left button.
	 * <li>Mouse wheel.
	 * <li>Right button.
	 * </ol
	 *
	 * @type {!number}
	 * @private
	 */
	this.button = rawEvent.button;
	/**
	 * Mouse wheel value. This value is only used when the <code>
	 *   rawEvent.type == "mousewheel"</code>. If the value is
	 *   positive the wheel was moved upwards, if it's negative
	 *   the wheel was moved downwards.
	 *
	 * @type {!number}
	 * @private
	 */
	this.wheelDelta = 0;
	if(rawEvent.type == "mousewheel"){
		this.wheelDelta = rawEvent.wheelDelta;
	}
};
Grape2D.InputManagerMouseEvent.prototype = Object.create(Grape2D.InputManagerEvent.prototype);
/**
 * Gets the element where the event happened.
 *
 * @return {EventTarget} Element.
 * @public
 */
Grape2D.InputManagerMouseEvent.prototype.getTarget = function(){
	return this.target;
};
/**
 * Gets the position where the event was triggered.
 *
 * @return {!Grape2D.Vector} Position.
 * @public
 */
Grape2D.InputManagerMouseEvent.prototype.getPosition = function(){
	return this.position;
};
/**
 * Gets the wheel data.
 *
 * @return {!number} Wheel data.
 * @public
 */
Grape2D.InputManagerMouseEvent.prototype.getWheelDelta = function(){
	return this.wheelDelta;
};