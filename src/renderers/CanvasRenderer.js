/**
 * @author rui_web@hotmail.com (Rui Gil)
 */

/**
 * This is a specialization from {@link Grape2D.CanvasRenderer}.
 * This renders objects to a canvas object, with a 2D context. This method is not
 * hardware accelerated by default, however is the most stable and cross-browser.
 *
 * @param  {?Object} options [description]
 *
 * @constructor
 * @extends Grape2D.Renderer
 */
Grape2D.CanvasRenderer = function (options) {
	Grape2D.Renderer.call(this, options);
	/**
	 * A canvas object
	 *
	 * @type {(Grape2D.Canvas|CanvasRenderingContext2D)}
	 */
	this.canvas = new Grape2D.Canvas(options);
};

//CanvasRenderer inherits from Renderer
Grape2D.CanvasRenderer.prototype = Object.create(Grape2D.Renderer.prototype);

/**
 * @see Grape2D.Renderer.renderShape
 */
Grape2D.CanvasRenderer.prototype.renderShape = function(shape, position){
};
/**
 * @see Grape2D.Renderer.renderColoredShape
 */
Grape2D.CanvasRenderer.prototype.renderColoredShape = function (material, position) {};
/**
 * @see Grape2D.Renderer.renderTexture
 */
Grape2D.CanvasRenderer.prototype.renderTexture = function (texture, position) {};