Grape2D.SoundManager = function(){
	//var ACx = AudioContext || webkitAudioContext;

	this.audioContext = new webkitAudioContext();
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