/**
 * Sound gain.
 *
 * @param {!number=} gain Gain.
 * @implements {Grape2D.SoundIO}
 * @constructor
 */
Grape2D.SoundGain = function(gain) {
	/**
	 * Gain node.
	 *
	 * @type {!GainNode}
	 * @private
	 */
	this.gain = Grape2D.SoundManagerSingleton.getContext().createGain();
	if(gain){
		this.setGain(gain);
	}
};
Grape2D.SoundGain.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Gets sound's gain.
 *
 * @return {!number} Gain value.
 * @public
 */
Grape2D.SoundGain.prototype.getGain = function() {
	return this.gain.gain.value;
};
/**
 * Sets sound's gain.
 *
 * @param {!number} gain Gain value.
 * @public
 */
Grape2D.SoundGain.prototype.setGain = function(gain) {
	this.gain.gain.value = gain;
};
/**
 * @override
 */
Grape2D.SoundGain.prototype.connect = function(toConnect) {
	this.gain.connect(toConnect.getDestination());
	return this;
};
/**
 * @override
 */
Grape2D.SoundGain.prototype.getDestination = function() {
	return this.gain;
};