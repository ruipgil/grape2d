Grape2D.utils.AssetManager = function(options){
	Grape2D.utils.Loader.call(this, options);
	this.assets = {};
};

Grape2D.utils.AssetManager.prototype = Object.create(Grape2D.utils.Loader.prototype);

Grape2D.utils.AssetManager.prototype.add = function(id, asset){
	this.assets[id] = asset;
};