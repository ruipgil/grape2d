/**
 * @implements {Grape2D.ISoundManager}
 * @constructor
 */
Grape2D.SoundManager = function(){
	/**
	 * Audio context.
	 *
	 * @type {?AudioContext}
	 * @private
	 */
	this.audioContext = null;
	if(typeof Grape2D.WINDOW.AudioContext != "undefined"){
		this.audioContext = new Grape2D.WINDOW.AudioContext();
	}else if(typeof Grape2D.WINDOW.webkitAudioContext != "undefined"){
		this.audioContext = new Grape2D.WINDOW.webkitAudioContext();
	}
};
Grape2D.SoundManager.prototype = Object.create(Grape2D.ISoundManager.prototype);
Grape2D.SoundManager.prototype.getContext = function(){
	return this.audioContext;
};
Grape2D.SoundManager.prototype.getInstance = function(){
	return this.audioContext;
};
Grape2D.SoundManager.prototype.getDestination = function(){
	return this.audioContext.destination;
};