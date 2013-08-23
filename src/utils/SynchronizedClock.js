/**
 * A synchronized clock can keep the same time generation as,
 *   for example, a remote server.
 *
 * @extends {Grape2D.Clock}
 * @constructor
 */
Grape2D.utils.SynchronizedClock = function() {
	Grape2D.utils.Clock.call(this);
	this.deltaSync = 0;
};

Grape2D.utils.SynchronizedClock.prototype = Object.create(Grape2D.utils.Clock.prototype);
/**
 * @override
 */
Grape2D.utils.SynchronizedClock.getTime = function() {
	return Grape2D.utils.Clock.prototype.getTime.call(this) + this.deltaSync;
};
/**
 * Synchronizes the clock acording to a timestamp.
 *   This stores a delta value between the current time
 *   and a given sync time.
 *
 * @param  {!number} syncTime Time right now.
 * @public
 */
Grape2D.utils.SynchronizedClock.sync = function(syncTime) {
	this.deltaSync = syncTime - Grape2D.utils.Clock.prototype.getTime.call(this);
};