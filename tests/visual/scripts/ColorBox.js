/**
 * Represents a colored shape.
 *
 * @param  {Object} options Setup options. See {@link Grape2D.Object2D}
 *   for more details
 * @param  {string} options.color Color of the object.
 *
 * @extends {Grape2D.Object2D}
 * @constructor
 */
var ColorBox = function(options) {
	Grape2D.Object2D.call(this, options);
	this.color = options.color || 'rgba(0,0,0,1)';
};
ColorBox.prototype = Object.create(Grape2D.Object2D.prototype);
/**
 * @override
 */
ColorBox.prototype.render = function(renderer, camera) {
	renderer.setStrokeColor(this.color);
	Grape2D.Object2D.prototype.render.call(this, renderer, camera);
};