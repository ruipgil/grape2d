/**
 * A synchronized clock can keep the same time generation as,
 *   for example, a remote server.
 *
 * @extends {Grape2D.utils.Clock}
 * @constructor
 */
Grape2D.utils.SynchronizedClock = function() {
	Grape2D.utils.Clock.call(this);
	/**
	 * Time diference between clocks.
	 *
	 * @type {!number}
	 * @private
	 */
	this.deltaSync = 0;
};

Grape2D.utils.SynchronizedClock.prototype = Object.create(Grape2D.utils.Clock.prototype);
/**
 * @override
 */
Grape2D.utils.SynchronizedClock.prototype.getTime = function() {
	return Grape2D.utils.Clock.prototype.getTime.call(this) - this.deltaSync;
};
/**
 * Synchronizes this clock with a remote clock, based on the
 *   time difference.
 *
 * @param  {!number} syncTime Time difference between clocks.
 * @public
 */
Grape2D.utils.SynchronizedClock.prototype.sync = function(syncTime) {
	this.deltaSync = syncTime;
};