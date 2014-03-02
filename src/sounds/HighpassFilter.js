/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.HighpassFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(1);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.HighpassFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);