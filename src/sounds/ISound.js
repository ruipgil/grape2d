/**
 * Interface for a sound.
 * A sound only have an output and no inputs.
 * 
 * @class
 * @interface
 */
Grape2D.ISound = function() {};
Grape2D.ISound.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Connect this sound output to a valid input node.
 *
 * @param  {!(Grape2D.SoundIO|Grape2D.SoundManager|AudioDestinationNode)} connectTo Input to connect this output.
 * @public
 */
Grape2D.ISound.prototype.connect = function(connectTo) {};
/**
 * Plays a sound.
 *
 * @public
 */
Grape2D.ISound.prototype.play = function(when, offset, duration){};
/**
 * Stop a sound.
 *
 * @public
 */
Grape2D.ISound.prototype.stop = function(){};