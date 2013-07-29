/**
 * Drag event.
 *
 * @param  {!Event} rawEvent Raw DOM event.
 * @param  {!Grape2D.Vector} start Start position of the drag.
 * @extends {Grape2D.InputManagerEvent}
 * @constructor
 */
Grape2D.InputManagerDragEvent = function(rawEvent, start){
	Grape2D.InputManagerEvent.call(this, rawEvent);
	var bb = rawEvent.target.getBoundingClientRect();
	/**
	 * Element where the drag event happened. It should be a DOM element
	 *   associated with a {Grape2D.Renderer}.
	 *
	 * @type {EventTarget}
	 * @private
	 */
	this.target = rawEvent.target;
	/**
	 * Start position of the dragging event.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.start = new Grape2D.Vector().set(start);
	/**
	 * End position of the dragging event.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.end = new Grape2D.Vector(rawEvent.clientX-bb.left, rawEvent.clientY-bb.top);
	/**
	 * Difference between the end and the start position of the event.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.delta = this.end.clone().sub(this.start);
};
Grape2D.InputManagerDragEvent.prototype = Object.create(Grape2D.InputManagerEvent.prototype);
/**
 * Gets the element where the event happened.
 *
 * @return {EventTarget} Element.
 * @public
 */
Grape2D.InputManagerDragEvent.prototype.getTarget = function(){
	return this.target;
};
/**
 * Gets the start position of the event.
 *
 * @return {!Grape2D.Vector} Start position.
 * @public
 */
Grape2D.InputManagerDragEvent.prototype.getStart = function(){
	return this.start;
};
/**
 * Gets the end position of the event.
 *
 * @return {!Grape2D.Vector} End position.
 * @public
 */
Grape2D.InputManagerDragEvent.prototype.getEnd = function(){
	return this.end;
};
/**
 * Gets the difference between end and start position.
 *
 * @return {!Grape2D.Vector} Difference of positions.
 * @public
 */
Grape2D.InputManagerDragEvent.prototype.getDelta = function(){
	return this.delta;
};