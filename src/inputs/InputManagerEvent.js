/**
 * Custom event.
 *
 * @param  {!Event} ev The DOM event.
 * @constructor
 */
Grape2D.InputManagerEvent = function(ev) {
	/**
	 * Raw event.
	 *
	 * @type {!Event}
	 * @private
	 */
	this.raw = ev;
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