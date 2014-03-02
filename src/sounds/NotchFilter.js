/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.NotchFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(6);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.NotchFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);