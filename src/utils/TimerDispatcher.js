/**
 * Timer class. This is not handling double calls or more for long intervals.
 *
 * @constructor
 */
Grape2D.utils.TimerDispatcher = function() {
	/**
	 * Internal representation of the callbacks and internal timers.
	 *
	 * @type {!Array.<Object.<!string,!(number|Function|boolean)>>}
	 * @private
	 */
	this.tm = [];
};

Grape2D.utils.TimerDispatcher.prototype = {
	constructor: Grape2D.utils.TimerDispatcher,
	/**
	 * Adds.
	 *
	 * @param {!number} interv Time interval between calls, in milliseconds.
	 * @param {Function} callback Function to be called after the interval has run out.
	 * @param {!boolean=} remove True to remove after it has been called one time.
	 * @public
	 */
	add: function(interv, callback, remove) {
		var storedObj = {
			interval: interv,
			callback: callback,
			remaining: interv,
			remove: remove || false
		};
		this.tm.push(storedObj);
	},
	/**
	 * Dispatches the calls if its time for it, or updates the internal timers, preparing for the next update.
	 *
	 * @param  {!number} dt Delta time, since the last dispatch call.
	 * @public
	 */
	dispatch: function(dt) {
		var current;
		var remove = [];
		for (var i = 0; i < this.tm.length; i++) {
			current = this.tm[i];
			if (current.remaining <= dt) {
				current.callback();
				if (current.remove) {
					remove.push(i);
				} else {
					current.remaining = Grape2D.Math.clamp(current.interval - (current.remaining - dt), 0, current.interval);
				}
			} else {
				current.remaining -= dt;
			}
		}
		for (i = 0; i < remove.length; i++) {
			this.tm.splice(remove[i], 1);
		}
	}
};
/**
 * Constant that represents a second.
 *
 * @type {!number}
 * @constant
 * @public
 */
Grape2D.utils.TimerDispatcher.SECOND = 1000;
/**
 * Constant that represents a minute.
 *
 * @type {!number}
 * @constant
 * @public
 */
Grape2D.utils.TimerDispatcher.MINUTE = Grape2D.utils.TimerDispatcher.SECOND * 60;
/**
 * Constant that represents an hour.
 *
 * @type {!number}
 * @constant
 * @public
 */
Grape2D.utils.TimerDispatcher.HOUR = Grape2D.utils.TimerDispatcher.MINUTE * 60;