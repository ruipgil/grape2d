Grape2D.Game = function(){
	this._setup = setup || function(){};
	this._animate = animate || function(){};
}

Grape2D.Game.prototype = {
	constructor: Grape2D.Game,
	start: function(){
		this._setup();
		this.animate();
	},
	animate: function(){
		requestAnimationFrame(this._animate);
		this._animate();
	}
}