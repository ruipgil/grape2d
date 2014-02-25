/**
 * @extends {Grape2D.SoundIO}
 * @class
 * @interface
 */
Grape2D.ISound = function() {
	Grape2D.SoundIO.call(this);
};
Grape2D.ISound.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Plays a sound.
 *
 * @public
 */
Grape2D.ISound.prototype.play = function(){};
/**
 * Stop a sound.
 *
 * @public
 */
Grape2D.ISound.prototype.stop = function(){};
/**
 * @override
 */
Grape2D.ISound.prototype.connect = function(connectTo){};