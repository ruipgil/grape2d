/**
 * @implements {Grape2D.ISoundManager}
 * @constructor
 */
Grape2D.SoundManager = function(){
	var AContext;
	if(typeof Grape2D.WINDOW.AudioContext != "undefined"){
		AContext = Grape2D.WINDOW.AudioContext;
	}else if(typeof Grape2D.WINDOW.webkitAudioContext != "undefined"){
		AContext = Grape2D.WINDOW.webkitAudioContext;
	}else{
		throw new Error("Audio is not supported.");
	}

	this.audioContext = new AContext();
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