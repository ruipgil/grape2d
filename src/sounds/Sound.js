/**
 * Sound.
 *
 * @param {!AudioBuffer=} audioBuffer ArrayBuffer of the sound.
 * @implements {Grape2D.ISound}
 * @constructor
 */
Grape2D.Sound = function(audioBuffer){
	/**
	 * Sound source.
	 *
	 * @type {?AudioBufferSourceNode}
	 * @private
	 */
	this.soundSource = null;
	/**
	 * Sound duration.
	 *
	 * @type {!number}
	 * @private
	 */
	this.duration = 0;
	/**
	 * Sound buffer.
	 *
	 * @type {?AudioBuffer}
	 * @private
	 */
	this.buffer = null;
	if(audioBuffer){
		this.setBuffer(audioBuffer);
	}
	/**
	 * Output of the sound.
	 *
	 * @type {?(Grape2D.SoundIO|AudioDestinationNode)}
	 * @private
	 */
	this.connectingTo = null;
};
Grape2D.Sound.prototype = Object.create(Grape2D.ISound.prototype);
/**
 * Prepares the sound to be played.
 *
 * @public
 */
Grape2D.Sound.prototype.prepare = function(){
	this.soundSource = Grape2D.SoundManagerSingleton.getContext().createBufferSource();
	this.soundSource.buffer = this.buffer;
	if(this.connectingTo){
		this.soundSource.connect(this.connectingTo.getDestination());
	}
};
/**
 * @override
 */
Grape2D.Sound.prototype.play = function(when, offset, duration){
	this.prepare();
	this.soundSource.start(when || 0, offset || 0, duration || this.duration);
};
/**
 * @override
 */
Grape2D.Sound.prototype.stop = function(){
	this.soundSource.stop(0);
};
/**
 * Sets the buffer.
 *
 * @param {!AudioBuffer} buffer Audio buffer.
 * @public
 */
Grape2D.Sound.prototype.setBuffer = function(buffer){
	this.buffer = buffer;
	this.duration = Grape2D.Math.floorPositive(buffer.duration);
};
/**
 * @override
 */
Grape2D.Sound.prototype.connect = function(inputToOutput){
	this.connectingTo = inputToOutput;
	return this;
};
/**
 * Creates a sound from a file.
 *
 * @param  {!string} filePath Path to the file.
 * @param  {!function(!Grape2D.Sound)} callback Callback.
 * @return {!Grape2D.Sound} Empty sound.
 * @public
 * @static
 */
Grape2D.Sound.createFromFile = function(filePath, callback){
	var request = new XMLHttpRequest(),
		sound = new Grape2D.Sound();
	request.open("GET", filePath, true);
	request.responseType = "arraybuffer";
	request.onload = function(e){
		var context = Grape2D.SoundManagerSingleton.getContext();
		context.decodeAudioData(request.response, function(audioBuffer){
			sound.setBuffer(audioBuffer);
			if(callback){
				callback(sound);
			}
		});
	};
	request.send();
	return sound;
};