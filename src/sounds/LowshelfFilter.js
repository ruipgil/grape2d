/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.LowshelfFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(3);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.LowshelfFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);