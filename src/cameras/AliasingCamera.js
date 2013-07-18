/**
 * [ description]
 *
 * @param  {[type]} options [description]
 *
 * @extends {Grape2D.Camera}
 * @constructor
 */
Grape2D.AliasingCamera = function(options){
	Grape2D.Camera.call(this, options);
};

Grape2D.AliasingCamera.prototype = Object.create(Grape2D.Camera.prototype);
/**
 * Floors the components of the result of the
 *   {@link Grape2D.Camera.wcsToViewport} to avoid anti-aliasing by
 *   the renderer. However this method is more specific for the
 *   {@link Grape2D.CanvasRenderer}.
 * @override
 */
Grape2D.AliasingCamera.prototype.wcsToViewport = function(renderer, vector){
	return Grape2D.Camera.prototype.wcsToViewport.call(this, renderer, vector).use(Grape2D.Math.floor);
};