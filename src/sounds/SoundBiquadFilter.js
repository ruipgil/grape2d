/**
 * Biquad filter.
 *
 * @implements {Grape2D.SoundIO}
 * @constructor
 */
Grape2D.SoundBiquadFilter = function() {
	/**
	 * Biquad filter node.
	 *
	 * @type {BiquadFilterNode}
	 * @private
	 */
	this.biquadFilter = Grape2D.SoundManagerSingleton.getContext().createBiquadFilter();
};
Grape2D.SoundBiquadFilter.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Gets biquad filter type.
 *
 * @return {!number} Biquad's filter type.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getType = function() {
	return this.biquadFilter.type;
};
/**
 * Sets biquad filter type.
 *
 * @param {!number} type Biquad's filter type.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setType = function(type) {
	this.biquadFilter.type = type;
};
/**
 * Gets biquad frequency.
 *
 * @return {!number} Biquad's frequency.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getFrequency = function() {
	return this.biquadFilter.frequency;
};
/**
 * Sets biquad frequency.
 *
 * @param {!number} frequency Biquad's frequency.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setFrequency = function(frequency) {
	this.biquadFilter.frequency = frequency;
};
/**
 * Gets biquad detune.
 *
 * @return {!number} Biquad's detune.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getDetune = function() {
	return this.biquadFilter.detune;
};
/**
 * Sets biquad detune.
 *
 * @param {!number} detune Biquad's detune.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setDetune = function(detune) {
	this.biquadFilter.detune = detune;
};
/**
 * Gets biquad Q.
 *
 * @return {!number} Biquad's Q.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getQ = function() {
	return this.biquadFilter.Q;
};
/**
 * Sets biquad Q.
 *
 * @param {!number} q Biquad's Q.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setQ = function(q) {
	this.biquadFilter.Q = q;
};
/**
 * Gets biquad gain.
 *
 * @return {!number} Biquad's gain.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getGain = function() {
	return this.biquadFilter.gain;
};
/**
 * Sets biquad gain.
 *
 * @param {!number} gain Biquad's gain.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setGain = function(gain) {
	this.biquadFilter.gain = gain;
};
/**
 * @override
 */
Grape2D.SoundBiquadFilter.prototype.connect = function(toConnect) {
	this.biquadFilter.connect(toConnect.getDestination());
	return this;
};
/**
 * @override
 */
Grape2D.SoundBiquadFilter.prototype.getDestination = function() {
	return this.biquadFilter;
};