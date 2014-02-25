Grape2D.SoundManagerSingleton = {
	instance: new Grape2D.SoundManager(),
	getInstance: function(){
		return Grape2D.SoundManagerSingleton.instance;
	},
	getContext: function(){
		return Grape2D.SoundManagerSingleton.instance.getContext();
	},
	getDestination: function(){
		return Grape2D.SoundManagerSingleton.instance.getDestination();
	}
};