/**
 * Costum event.
 *
 * @param  {!Event} ev The DOM event.
 * @param  {!Grape2D.Renderer} bind Renderer where the event happened.
 * @constructor
 */
Grape2D.InputManagerEvent = function(bind, ev) {
	/**
	 * Raw event.
	 *
	 * @type {!Event}
	 * @private
	 */
	this.raw = ev;
	/**
	 * Place where the event was fired.
	 *
	 * @type {!Grape2D.Renderer}
	 * @private
	 */
	this.bind = bind
};

Grape2D.InputManagerEvent.prototype = {
	constructor: Grape2D.InputManagerEvent,
	/**
	 * Gets the raw event.
	 *
	 * @return {!Event} The event fired.
	 * @public
	 */
	getRaw: function() {
		return this.raw;
	}
};