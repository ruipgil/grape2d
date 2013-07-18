/**
 * Event.
 *
 * @param  {Event} ev The DOM event.
 * @param  {Grape2D.Renderer} bind Renderer where the event happened.
 * @constructor
 */
Grape2D.InputManagerEvent = function(bind, ev) {
	this.raw = ev;
	this.bind = bind
};

Grape2D.InputManagerEvent.prototype = {
	constructor: Grape2D.InputManagerEvent,
	getRaw: function() {
		return this.raw;
	}
};