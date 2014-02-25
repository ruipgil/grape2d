/**
 * Delays a sound.
 *
 * @param {!number=} delayTime Delay time.
 * @extends {Grape2D.SoundIO}
 * @constructor
 */
Grape2D.SoundDelay = function(delayTime) {
	/**
	 * Delay node.
	 *
	 * @type {!DelayNode}
	 * @private
	 */
	this.delay = Grape2D.SoundManagerSingleton.getContext().createDelay(delayTime || 1);
	this.setDelay(delayTime);
};
Grape2D.SoundDelay.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Gets sound's delay.
 *
 * @return {!number} Delay time.
 * @public
 */
Grape2D.SoundDelay.prototype.getDelay = function() {
	return this.delay.delayTime.value;
};
/**
 * Sets sound's delay.
 *
 * @param {!number} delay Delay time.
 * @public
 */
Grape2D.SoundDelay.prototype.setDelay = function(delay) {
	this.delay.delayTime.value = delay;
};
/**
 * @override
 */
Grape2D.SoundDelay.prototype.connect = function(toConnect) {
	this.delay.connect(toConnect.getDestination());
	return this;
};
/**
 * @override
 */
Grape2D.SoundDelay.prototype.getDestination = function() {
	return this.delay;
};