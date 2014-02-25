/**
 * Sound input/output interface.
 *
 * @interface
 */
Grape2D.SoundIO = function(){};
Grape2D.SoundIO.prototype = {
	constructor: Grape2D.SoundIO,
	/**
	 * Connect this sound output to an {@link Grape2D.SoundIO}
	 *
	 * @param  {!(Grape2D.SoundIO|Grape2D.SoundManager|AudioDestinationNode)} connectTo Input to connect this output.
	 * @public
	 */
	connect: function(connectTo) {},
	/**
	 * Gets destination (output) of the sound.
	 *
	 * @return {!AudioDestinationNode} Audio destination.
	 * @public
	 */
	getDestination: function() {}
};