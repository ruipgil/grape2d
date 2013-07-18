Grape2D.IlluminatedRenderer = function(options){
	//general buffer, stores objects to be rendered.
	this.gBuffer = [];
	//light buffer, stores lights to be rendered.
	this.lightBuffer = [];
	//lights renderer
	this.lightRenderer = new Grape2D.Renderer();
	//shadows renderer
	this.shadowRenderer = new Grape2D.Renderer();

}

Grape2D.IlluminatedRenderer.prototype = Object.create(Grape2D.Renderer.prototype);

/**
 * @see Grape2D.Renderer.renderShape
 */
Grape2D.IlluminatedRenderer.prototype.renderShape = function(shape, position){
};
/**
 * @see Grape2D.Renderer.renderColoredShape
 */
Grape2D.IlluminatedRenderer.prototype.renderColoredShape = function (material, position) {};
/**
 * @see Grape2D.Renderer.renderTexture
 */
Grape2D.IlluminatedRenderer.prototype.renderTexture = function (texture, position) {};

Grape2D.IlluminatedRenderer.prototype.renderLight = function (light, position) {};

Grape2D.IlluminatedRenderer.prototype.start = function () {
	for(var i=0; i<this.objBuffer; i++){

	}
};
Grape2D.IlluminatedRenderer.prototype.end = function () {};