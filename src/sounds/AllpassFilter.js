/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.AllpassFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(7);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.AllpassFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);